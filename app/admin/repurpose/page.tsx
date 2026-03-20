'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Loader2, Copy, Check, RefreshCw, ChevronDown, UserCircle } from 'lucide-react';

interface Format {
  key: string;
  label: string;
  category: string;
}

interface RepurposeResult {
  format: string;
  label: string;
  output: string;
}

interface Persona {
  id: number;
  name: string;
  description: string | null;
  is_default: number;
}

export default function RepurposePage() {
  const searchParams = useSearchParams();
  const fromSlug = searchParams.get('from');

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [formats, setFormats] = useState<Format[]>([]);
  const [categories, setCategories] = useState<Record<string, string>>({});
  const [selectedFormats, setSelectedFormats] = useState<string[]>([]);
  const [results, setResults] = useState<RepurposeResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingPost, setLoadingPost] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);
  const [posts, setPosts] = useState<{ slug: string; title: string }[]>([]);
  const [personas, setPersonas] = useState<Persona[]>([]);
  const [selectedPersonaId, setSelectedPersonaId] = useState<number | null>(null);

  // Load available formats and personas
  useEffect(() => {
    fetch('/api/repurpose')
      .then(r => r.json())
      .then(data => {
        setFormats(data.formats || []);
        setCategories(data.categories || {});
        setSelectedFormats([]);
      });
    fetch('/api/personas')
      .then(r => r.ok ? r.json() : [])
      .then(setPersonas)
      .catch(() => {});
  }, []);

  // Load blog posts for the selector
  useEffect(() => {
    fetch('/api/blog')
      .then(r => r.json())
      .then(data => {
        const list = (Array.isArray(data) ? data : data.posts || []).map(
          (p: { slug: string; title: string }) => ({ slug: p.slug, title: p.title })
        );
        setPosts(list);
      })
      .catch(() => {});
  }, []);

  // Auto-load post if ?from= is set
  useEffect(() => {
    if (fromSlug) loadPost(fromSlug);
  }, [fromSlug]);

  async function loadPost(slug: string) {
    setLoadingPost(true);
    try {
      const res = await fetch(`/api/blog/${slug}`);
      if (res.ok) {
        const post = await res.json();
        setTitle(post.title || '');
        // Extract text from sections
        const sections = typeof post.sections === 'string' ? JSON.parse(post.sections) : post.sections || [];
        const text = sections
          .map((s: { heading?: string; body?: string | string[] }) => {
            const heading = s.heading ? `## ${s.heading}\n` : '';
            const body = Array.isArray(s.body) ? s.body.join('\n\n') : s.body || '';
            return heading + body;
          })
          .join('\n\n');
        setContent(post.description ? post.description + '\n\n' + text : text);
      }
    } catch (e) { console.error(e); }
    setLoadingPost(false);
  }

  async function generate() {
    if (!content || selectedFormats.length === 0) return;
    setLoading(true);
    setResults([]);
    try {
      const res = await fetch('/api/repurpose', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content, title, formats: selectedFormats, ...(selectedPersonaId ? { personaId: selectedPersonaId } : {}) }),
      });

      if (!res.ok) {
        let errMsg = 'Generation failed';
        try { const err = await res.json(); errMsg = err.error || errMsg; } catch { /* use default */ }
        alert(errMsg);
        setLoading(false);
        return;
      }

      // Read SSE stream
      const reader = res.body!.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const text = decoder.decode(value, { stream: true });
        const lines = text.split('\n');
        for (const line of lines) {
          if (!line.startsWith('data: ')) continue;
          const payload = line.slice(6).trim();
          if (payload === '[DONE]') continue;
          try {
            const evt = JSON.parse(payload);
            if (evt.type === 'result' && evt.data) {
              setResults(evt.data.results || []);
            } else if (evt.type === 'error') {
              alert(evt.error || 'Generation failed');
            }
          } catch { /* skip */ }
        }
      }
    } catch {
      alert('Generation failed');
    }
    setLoading(false);
  }

  function toggleFormat(key: string) {
    setSelectedFormats(prev =>
      prev.includes(key) ? prev.filter(f => f !== key) : [...prev, key]
    );
  }

  function copyText(text: string, key: string) {
    navigator.clipboard.writeText(text);
    setCopied(key);
    setTimeout(() => setCopied(null), 1500);
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="bg-white border-b border-neutral-200 px-8 pt-6 pb-6">
        <p className="text-xs text-neutral-400 mb-1">Admin / Content Repurposing</p>
        <h1 className="text-2xl font-semibold text-neutral-900">Repurpose Content</h1>
        <p className="text-xs text-neutral-400 mt-0.5">
          Turn a blog post into LinkedIn, tweets, email subjects, and more. One click, all formats.
        </p>
      </div>

      <div className="px-8 py-6 max-w-6xl">
        <div className="grid grid-cols-2 gap-6">
          {/* Left: Source content */}
          <div className="space-y-4">
            {/* Post selector */}
            <div>
              <label className="block text-xs font-semibold text-neutral-500 mb-1.5">Load from blog post</label>
              <div className="relative">
                <select
                  value={fromSlug || ''}
                  onChange={e => { if (e.target.value) loadPost(e.target.value); }}
                  className="w-full px-3 py-2 border border-neutral-200 rounded-lg text-sm bg-white text-neutral-700 appearance-none pr-8"
                >
                  <option value="">Select a post...</option>
                  {posts.map(p => (
                    <option key={p.slug} value={p.slug}>{p.title}</option>
                  ))}
                </select>
                <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none" />
              </div>
              {loadingPost && <p className="text-xs text-neutral-400 mt-1 flex items-center gap-1"><Loader2 size={10} className="animate-spin" /> Loading...</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-500 mb-1.5">Title</label>
              <input type="text" value={title} onChange={e => setTitle(e.target.value)}
                placeholder="Article title" className="w-full px-3 py-2 border border-neutral-200 rounded-lg text-sm text-neutral-700" />
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-500 mb-1.5">Content</label>
              <p className="text-xs text-neutral-400 mb-1.5">Paste or load your source content. The AI generates all selected formats from this.</p>
              <textarea value={content} onChange={e => setContent(e.target.value)}
                rows={16} placeholder="Paste your article content here..."
                className="w-full px-3 py-2.5 border border-neutral-200 rounded-lg text-sm text-neutral-800 font-mono resize-y leading-relaxed" />
            </div>

            {/* Persona selector */}
            {personas.length > 0 && (
              <div>
                <label className="block text-xs font-semibold text-neutral-500 mb-1.5">
                  <span className="flex items-center gap-1.5"><UserCircle size={12} /> Target persona</span>
                </label>
                <select
                  value={selectedPersonaId ?? ''}
                  onChange={e => setSelectedPersonaId(e.target.value ? Number(e.target.value) : null)}
                  className="w-full px-3 py-2 border border-neutral-200 rounded-lg text-sm bg-white text-neutral-700"
                >
                  <option value="">No persona (generic output)</option>
                  {personas.map(p => (
                    <option key={p.id} value={p.id}>
                      {p.name}{p.is_default === 1 ? ' (default)' : ''}
                    </option>
                  ))}
                </select>
                <p className="text-[11px] text-neutral-400 mt-1">AI adapts tone, vocabulary, and emphasis to this audience.</p>
              </div>
            )}

            {/* Format selector — grouped by platform */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-xs font-semibold text-neutral-500">Output formats</label>
                {selectedFormats.length > 0 && (
                  <button onClick={() => setSelectedFormats([])} className="text-[11px] text-neutral-400 hover:text-neutral-600 transition-colors">
                    Clear all
                  </button>
                )}
              </div>
              <div className="space-y-3">
                {Object.entries(categories).map(([catKey, catLabel]) => {
                  const catFormats = formats.filter(f => f.category === catKey);
                  if (catFormats.length === 0) return null;
                  const allSelected = catFormats.every(f => selectedFormats.includes(f.key));
                  return (
                    <div key={catKey}>
                      <button
                        onClick={() => {
                          if (allSelected) {
                            setSelectedFormats(prev => prev.filter(k => !catFormats.some(f => f.key === k)));
                          } else {
                            setSelectedFormats(prev => [...new Set([...prev, ...catFormats.map(f => f.key)])]);
                          }
                        }}
                        className={`text-[11px] font-semibold uppercase tracking-wider mb-1.5 transition-colors ${allSelected ? 'text-neutral-900' : 'text-neutral-400 hover:text-neutral-600'}`}
                      >
                        {catLabel} {allSelected ? '✓' : ''}
                      </button>
                      <div className="flex flex-wrap gap-1.5">
                        {catFormats.map(f => (
                          <button key={f.key} onClick={() => toggleFormat(f.key)}
                            className={`px-2.5 py-1 text-[11px] font-medium rounded-md border transition-colors ${
                              selectedFormats.includes(f.key)
                                ? 'bg-neutral-900 border-neutral-900 text-white'
                                : 'bg-white border-neutral-200 text-neutral-500 hover:border-neutral-300'
                            }`}>
                            {f.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <button onClick={generate} disabled={loading || !content || selectedFormats.length === 0}
              className="flex items-center gap-2 px-5 py-2.5 bg-emerald-600 text-white text-sm font-medium rounded-lg hover:bg-emerald-500 disabled:opacity-50 transition-colors w-full justify-center">
              {loading ? <Loader2 size={14} className="animate-spin" /> : <RefreshCw size={14} />}
              {loading ? 'Generating...' : selectedFormats.length === 0 ? 'Select formats above' : `Generate ${selectedFormats.length} format${selectedFormats.length !== 1 ? 's' : ''}`}
            </button>
          </div>

          {/* Right: Results */}
          <div className="space-y-4">
            {results.length === 0 && !loading && (
              <div className="bg-white rounded-xl border border-neutral-200 p-8 text-center">
                <RefreshCw size={28} className="mx-auto text-neutral-300 mb-3" />
                <p className="text-sm text-neutral-500">Select a blog post and click Generate.</p>
                <p className="text-xs text-neutral-400 mt-1">All formats are generated in a single AI call.</p>
              </div>
            )}

            {loading && (
              <div className="bg-white rounded-xl border border-neutral-200 p-8 text-center">
                <Loader2 size={24} className="mx-auto text-neutral-400 animate-spin mb-3" />
                <p className="text-sm text-neutral-500">Generating {selectedFormats.length} formats...</p>
              </div>
            )}

            {results.map(r => (
              <div key={r.format} className="bg-white rounded-xl border border-neutral-200 p-5">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-semibold text-neutral-900">{r.label}</h3>
                  <button onClick={() => copyText(r.output, r.format)}
                    className="flex items-center gap-1 text-xs text-neutral-400 hover:text-neutral-600 transition-colors">
                    {copied === r.format ? <Check size={11} /> : <Copy size={11} />}
                    {copied === r.format ? 'Copied' : 'Copy'}
                  </button>
                </div>
                <div className="text-sm text-neutral-700 whitespace-pre-wrap leading-relaxed">
                  {r.output}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
