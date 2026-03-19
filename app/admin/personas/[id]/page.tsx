'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { useParams } from 'next/navigation';
import { ArrowLeft, Loader2, Check, Star } from 'lucide-react';
import Link from 'next/link';

interface Persona {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  demographics: string | null;
  goals: string | null;
  pain_points: string | null;
  communication_style: string | null;
  objections: string | null;
  channels: string;
  is_default: number;
}

const FIELDS = [
  {
    key: 'description',
    label: 'Description',
    multiline: true,
    rows: 2,
    placeholder: 'One-line summary of who this persona represents.',
    hint: 'Shown in the persona list and used by AI to decide relevance.',
  },
  {
    key: 'demographics',
    label: 'Demographics',
    multiline: true,
    rows: 3,
    placeholder: 'Age range, role/title, industry, company size, location, income bracket.',
    hint: 'The more specific, the more targeted the AI output.',
  },
  {
    key: 'goals',
    label: 'Goals and motivations',
    multiline: true,
    rows: 3,
    placeholder: 'What are they trying to achieve? What does success look like for them?',
    hint: 'The AI frames content around helping them reach these goals.',
  },
  {
    key: 'pain_points',
    label: 'Pain points and frustrations',
    multiline: true,
    rows: 3,
    placeholder: 'What problems do they face? What keeps them up at night?',
    hint: 'Content will address these directly. Specificity matters.',
  },
  {
    key: 'communication_style',
    label: 'Communication preferences',
    multiline: true,
    rows: 3,
    placeholder: 'How do they prefer to receive information? Technical vs. plain language? Data-driven vs. narrative?',
    hint: 'Controls tone adaptation. A CFO reads differently than an engineer.',
  },
  {
    key: 'objections',
    label: 'Common objections',
    multiline: true,
    rows: 3,
    placeholder: 'What pushback do they typically give? Price, complexity, switching costs, skepticism?',
    hint: 'The AI anticipates and addresses these in generated content.',
  },
];

export default function PersonaEditPage() {
  const { id } = useParams<{ id: string }>();
  const [persona, setPersona] = useState<Persona | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const pendingRef = useRef<Record<string, unknown>>({});
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    fetch(`/api/personas/${id}`)
      .then(r => r.ok ? r.json() : null)
      .then(data => { if (data) setPersona(data); })
      .finally(() => setLoading(false));
  }, [id]);

  const doSave = useCallback(async () => {
    if (!persona || Object.keys(pendingRef.current).length === 0) return;
    setSaving(true);
    setSaved(false);
    try {
      const res = await fetch(`/api/personas/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(pendingRef.current),
      });
      if (res.ok) {
        setPersona(await res.json());
        pendingRef.current = {};
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
      }
    } catch { /* ignore */ }
    setSaving(false);
  }, [id, persona]);

  function update(key: string, value: string) {
    if (!persona) return;
    setPersona({ ...persona, [key]: value } as Persona);
    pendingRef.current[key] = value;
    setSaved(false);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(doSave, 1200);
  }

  async function toggleDefault() {
    if (!persona) return;
    try {
      const res = await fetch(`/api/personas/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_default: persona.is_default === 1 ? 0 : 1 }),
      });
      if (res.ok) setPersona(await res.json());
    } catch { /* ignore */ }
  }

  if (loading) {
    return <div className="flex items-center justify-center py-20 text-neutral-400"><Loader2 size={20} className="animate-spin" /></div>;
  }

  if (!persona) {
    return (
      <div className="text-center py-20">
        <p className="text-sm text-neutral-500">Persona not found.</p>
        <Link href="/admin/personas" className="text-sm text-neutral-900 underline mt-2 inline-block">Back</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="bg-white border-b border-neutral-200 px-8 pt-6 pb-6">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <Link href="/admin/personas" className="p-2 -ml-2 text-neutral-400 hover:text-neutral-600 rounded-lg hover:bg-neutral-100 transition-colors">
              <ArrowLeft size={16} />
            </Link>
            <div>
              <input type="text" value={persona.name} onChange={e => update('name', e.target.value)}
                className="text-lg font-semibold text-neutral-900 bg-transparent border-none outline-none focus:ring-0 p-0 w-full" placeholder="Persona name" />
              <div className="flex items-center gap-3 mt-0.5">
                <span className="text-xs text-neutral-400">/{persona.slug}</span>
                {persona.is_default === 1 && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-amber-50 text-amber-700 text-[10px] font-semibold uppercase tracking-wider rounded-full">
                    <Star size={9} fill="currentColor" /> Default
                  </span>
                )}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {saving && <span className="flex items-center gap-1.5 text-xs text-neutral-400"><Loader2 size={12} className="animate-spin" /> Saving...</span>}
            {saved && <span className="flex items-center gap-1.5 text-xs text-emerald-600"><Check size={12} /> Saved</span>}
            <button onClick={toggleDefault}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors ${
                persona.is_default === 1 ? 'bg-amber-50 border-amber-200 text-amber-700' : 'bg-white border-neutral-200 text-neutral-500 hover:border-amber-300 hover:text-amber-600'
              }`}>
              <Star size={11} fill={persona.is_default === 1 ? 'currentColor' : 'none'} />
              {persona.is_default === 1 ? 'Default persona' : 'Set as default'}
            </button>
            <button onClick={doSave} disabled={saving}
              className="flex items-center gap-2 px-4 py-2 bg-neutral-900 text-white text-sm font-medium rounded-lg hover:bg-neutral-700 disabled:opacity-50 transition-colors">
              <Check size={13} /> Save
            </button>
          </div>
        </div>
      </div>

      <div className="px-8 py-6 max-w-4xl space-y-5">
        {FIELDS.map(({ key, label, multiline, rows, placeholder, hint }) => (
          <div key={key}>
            <label className="block text-sm font-semibold text-neutral-700 mb-1">{label}</label>
            <p className="text-xs text-neutral-400 mb-2">{hint}</p>
            {multiline ? (
              <textarea
                value={(persona as unknown as Record<string, unknown>)[key] as string || ''}
                onChange={e => update(key, e.target.value)}
                placeholder={placeholder} rows={rows}
                className="w-full px-3 py-2.5 border border-neutral-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-neutral-200 resize-none placeholder:text-neutral-300 text-neutral-800"
              />
            ) : (
              <input type="text"
                value={(persona as unknown as Record<string, unknown>)[key] as string || ''}
                onChange={e => update(key, e.target.value)}
                placeholder={placeholder}
                className="w-full px-3 py-2.5 border border-neutral-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-neutral-200 placeholder:text-neutral-300 text-neutral-800"
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
