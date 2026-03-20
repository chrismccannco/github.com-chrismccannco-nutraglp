'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { useParams } from 'next/navigation';
import { ArrowLeft, Loader2, Check, Play, Copy } from 'lucide-react';
import Link from 'next/link';

interface Variable {
  key: string;
  label: string;
  default: string;
}

interface ContentTemplate {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  category: string;
  prompt_template: string;
  voice_id: number | null;
  persona_id: number | null;
  knowledge_doc_ids: string;
  output_format: string;
  max_tokens: number;
  variables: string;
}

interface BrandVoice {
  id: number;
  name: string;
  slug: string;
  is_default: number;
}

interface Persona {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  is_default: number;
}

const CATEGORIES: Record<string, string> = {
  general: 'General',
  blog: 'Blog',
  social: 'Social Media',
  email: 'Email',
  product: 'Product',
  seo: 'SEO',
  ad: 'Advertising',
};

export default function TemplateEditPage() {
  const { id } = useParams<{ id: string }>();
  const [template, setTemplate] = useState<ContentTemplate | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [running, setRunning] = useState(false);
  const [output, setOutput] = useState('');
  const [varValues, setVarValues] = useState<Record<string, string>>({});
  const [voices, setVoices] = useState<BrandVoice[]>([]);
  const [personas, setPersonas] = useState<Persona[]>([]);
  const [runPersonaId, setRunPersonaId] = useState<number | null>(null);
  const pendingRef = useRef<Record<string, unknown>>({});
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    fetch(`/api/content-templates/${id}`)
      .then(r => r.ok ? r.json() : null)
      .then(data => {
        if (data) {
          setTemplate(data);
          try {
            const vars: Variable[] = JSON.parse(data.variables || '[]');
            const defaults: Record<string, string> = {};
            vars.forEach(v => { defaults[v.key] = v.default || ''; });
            setVarValues(defaults);
          } catch (e) { console.error(e); }
        }
      })
      .finally(() => setLoading(false));

    // Load voices and personas for selectors
    fetch('/api/brand-voices').then(r => r.ok ? r.json() : []).then(setVoices).catch(() => {});
    fetch('/api/personas').then(r => r.ok ? r.json() : []).then(setPersonas).catch(() => {});
  }, [id]);

  const doSave = useCallback(async () => {
    if (!template || Object.keys(pendingRef.current).length === 0) return;
    setSaving(true);
    setSaved(false);
    try {
      const res = await fetch(`/api/content-templates/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(pendingRef.current),
      });
      if (res.ok) {
        setTemplate(await res.json());
        pendingRef.current = {};
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
      }
    } catch (e) { console.error(e); }
    setSaving(false);
  }, [id, template]);

  function update(key: string, value: unknown) {
    if (!template) return;
    setTemplate({ ...template, [key]: value });
    pendingRef.current[key] = value;
    setSaved(false);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(doSave, 1200);
  }

  async function executeTemplate() {
    if (!template) return;
    // Save any pending changes first
    if (Object.keys(pendingRef.current).length > 0) await doSave();
    setRunning(true);
    setOutput('');
    try {
      const res = await fetch(`/api/content-templates/${id}/execute`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ variables: varValues, ...(runPersonaId ? { personaId: runPersonaId } : {}) }),
      });
      if (!res.ok) {
        const err = await res.json();
        setOutput(`Error: ${err.error || 'Failed to execute'}`);
        setRunning(false);
        return;
      }
      const reader = res.body?.getReader();
      if (!reader) { setRunning(false); return; }
      const decoder = new TextDecoder();
      let buffer = '';
      let fullText = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';
        for (const line of lines) {
          if (!line.startsWith('data: ')) continue;
          const data = line.slice(6);
          if (data === '[DONE]') continue;
          try {
            const parsed = JSON.parse(data);
            if (parsed.type === 'content_block_delta' && parsed.delta?.text) {
              fullText += parsed.delta.text;
              setOutput(fullText);
            }
          } catch { /* skip */ }
        }
      }
    } catch (err) {
      setOutput(`Error: ${err instanceof Error ? err.message : 'Unknown error'}`);
    }
    setRunning(false);
  }

  function getVariables(): Variable[] {
    if (!template) return [];
    try { return JSON.parse(template.variables || '[]'); } catch { return []; }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20 text-neutral-400">
        <Loader2 size={20} className="animate-spin" />
      </div>
    );
  }

  if (!template) {
    return (
      <div className="text-center py-20">
        <p className="text-sm text-neutral-500">Template not found.</p>
        <Link href="/admin/ai-templates" className="text-sm text-neutral-900 underline mt-2 inline-block">Back</Link>
      </div>
    );
  }

  const variables = getVariables();

  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="bg-white border-b border-neutral-200 px-8 pt-6 pb-6">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <Link href="/admin/ai-templates" className="p-2 -ml-2 text-neutral-400 hover:text-neutral-600 rounded-lg hover:bg-neutral-100 transition-colors">
              <ArrowLeft size={16} />
            </Link>
            <div>
              <input
                type="text"
                value={template.name}
                onChange={e => update('name', e.target.value)}
                className="text-lg font-semibold text-neutral-900 bg-transparent border-none outline-none focus:ring-0 p-0 w-full"
              />
              <span className="text-xs text-neutral-400">/{template.slug}</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {saving && <span className="flex items-center gap-1.5 text-xs text-neutral-400"><Loader2 size={12} className="animate-spin" /> Saving...</span>}
            {saved && <span className="flex items-center gap-1.5 text-xs text-indigo-600"><Check size={12} /> Saved</span>}
            <button onClick={doSave} disabled={saving} className="flex items-center gap-2 px-4 py-2 bg-neutral-900 text-white text-sm font-medium rounded-lg hover:bg-neutral-700 disabled:opacity-50 transition-colors">
              <Check size={13} /> Save
            </button>
          </div>
        </div>
      </div>

      <div className="px-8 py-6 max-w-6xl">
        <div className="grid grid-cols-2 gap-6">
          {/* Left: Template config */}
          <div className="space-y-5">
            <div>
              <label className="block text-xs font-semibold text-neutral-500 mb-1.5">Description</label>
              <input type="text" value={template.description || ''} onChange={e => update('description', e.target.value)}
                placeholder="What this template generates" className="w-full px-3 py-2 border border-neutral-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-neutral-200 placeholder:text-neutral-300 text-neutral-700" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-neutral-500 mb-1.5">Category</label>
                <select value={template.category} onChange={e => update('category', e.target.value)} className="w-full px-3 py-2 border border-neutral-200 rounded-lg text-sm bg-white text-neutral-700">
                  {Object.entries(CATEGORIES).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-neutral-500 mb-1.5">Output format</label>
                <select value={template.output_format} onChange={e => update('output_format', e.target.value)} className="w-full px-3 py-2 border border-neutral-200 rounded-lg text-sm bg-white text-neutral-700">
                  <option value="prose">Prose</option>
                  <option value="html">HTML</option>
                  <option value="json">JSON</option>
                  <option value="markdown">Markdown</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-neutral-500 mb-1.5">Brand voice</label>
                <select
                  value={template.voice_id ?? ''}
                  onChange={e => update('voice_id', e.target.value ? Number(e.target.value) : null)}
                  className="w-full px-3 py-2 border border-neutral-200 rounded-lg text-sm bg-white text-neutral-700"
                >
                  <option value="">No voice</option>
                  {voices.map(v => (
                    <option key={v.id} value={v.id}>
                      {v.name}{v.is_default === 1 ? ' (default)' : ''}
                    </option>
                  ))}
                </select>
                <p className="text-[11px] text-neutral-400 mt-1">Tone, dos/donts, and style anchor injected into the AI prompt.</p>
              </div>
              <div>
                <label className="block text-xs font-semibold text-neutral-500 mb-1.5">Default persona</label>
                <select
                  value={template.persona_id ?? ''}
                  onChange={e => update('persona_id', e.target.value ? Number(e.target.value) : null)}
                  className="w-full px-3 py-2 border border-neutral-200 rounded-lg text-sm bg-white text-neutral-700"
                >
                  <option value="">No persona</option>
                  {personas.map(p => (
                    <option key={p.id} value={p.id}>
                      {p.name}{p.is_default === 1 ? ' (default)' : ''}
                    </option>
                  ))}
                </select>
                <p className="text-[11px] text-neutral-400 mt-1">AI adapts output to this audience. Can be overridden per run.</p>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-500 mb-1.5">Prompt template</label>
              <p className="text-xs text-neutral-400 mb-2">Use {'{{variable_name}}'} for dynamic values. These become input fields when running the template.</p>
              <textarea value={template.prompt_template} onChange={e => update('prompt_template', e.target.value)}
                rows={10} className="w-full px-3 py-2.5 border border-neutral-200 rounded-lg text-sm font-mono focus:outline-none focus:ring-2 focus:ring-neutral-200 text-neutral-800 resize-y" />
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-500 mb-1.5">Max tokens</label>
              <input type="number" value={template.max_tokens} onChange={e => update('max_tokens', Number(e.target.value))}
                className="w-32 px-3 py-2 border border-neutral-200 rounded-lg text-sm text-neutral-700" />
            </div>
          </div>

          {/* Right: Run panel */}
          <div className="space-y-5">
            <div className="bg-white rounded-xl border border-neutral-200 p-5">
              <h3 className="text-sm font-semibold text-neutral-900 mb-4">Run template</h3>

              {variables.length > 0 ? (
                <div className="space-y-3 mb-4">
                  {variables.map(v => (
                    <div key={v.key}>
                      <label className="block text-xs font-medium text-neutral-600 mb-1">{v.label || v.key}</label>
                      <input
                        type="text"
                        value={varValues[v.key] || ''}
                        onChange={e => setVarValues({ ...varValues, [v.key]: e.target.value })}
                        placeholder={v.default || `Enter ${v.label || v.key}`}
                        className="w-full px-3 py-2 border border-neutral-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-neutral-200 placeholder:text-neutral-300 text-neutral-700"
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-neutral-400 mb-4">No variables defined. Add {'{{variable}}'} placeholders in the prompt template.</p>
              )}

              {personas.length > 0 && (
                <div className="mb-4">
                  <label className="block text-xs font-medium text-neutral-600 mb-1">Persona override</label>
                  <select
                    value={runPersonaId ?? ''}
                    onChange={e => setRunPersonaId(e.target.value ? Number(e.target.value) : null)}
                    className="w-full px-3 py-2 border border-neutral-200 rounded-lg text-sm bg-white text-neutral-700"
                  >
                    <option value="">{template.persona_id ? 'Use template default' : 'No persona'}</option>
                    {personas.map(p => (
                      <option key={p.id} value={p.id}>{p.name}</option>
                    ))}
                  </select>
                  <p className="text-[11px] text-neutral-400 mt-1">Override the template's default persona for this run.</p>
                </div>
              )}

              <button
                onClick={executeTemplate}
                disabled={running}
                className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-500 disabled:opacity-50 transition-colors w-full justify-center"
              >
                {running ? <Loader2 size={13} className="animate-spin" /> : <Play size={13} />}
                {running ? 'Generating...' : 'Generate'}
              </button>
            </div>

            {/* Output */}
            {(output || running) && (
              <div className="bg-white rounded-xl border border-neutral-200 p-5">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-semibold text-neutral-900">Output</h3>
                  {output && !running && (
                    <button
                      onClick={() => navigator.clipboard.writeText(output)}
                      className="flex items-center gap-1 text-xs text-neutral-400 hover:text-neutral-600 transition-colors"
                    >
                      <Copy size={11} /> Copy
                    </button>
                  )}
                </div>
                <div className="prose prose-sm max-w-none text-neutral-800 whitespace-pre-wrap text-sm leading-relaxed">
                  {output || (running && <span className="text-neutral-400">Generating...</span>)}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
