'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Loader2, Check, Star } from 'lucide-react';
import Link from 'next/link';
import { Card } from '../../components';

interface BrandVoice {
  id: number;
  name: string;
  slug: string;
  is_default: number;
  tagline: string | null;
  mission: string | null;
  audience: string | null;
  tone: string | null;
  dos: string | null;
  donts: string | null;
  exemplar: string | null;
}

const FIELDS = [
  {
    key: 'tagline',
    label: 'Brand tagline',
    multiline: false,
    placeholder: 'Short and memorable. One line.',
    hint: 'Appears in headers, social bios, email footers.',
  },
  {
    key: 'mission',
    label: 'Mission statement',
    multiline: true,
    rows: 3,
    placeholder: 'What you do, who you do it for, and why it matters.',
    hint: 'Context the AI uses when scoring and generating content.',
  },
  {
    key: 'audience',
    label: 'Target audience',
    multiline: true,
    rows: 3,
    placeholder: 'Who are they? What do they care about? What do they already know?',
    hint: 'The more specific, the better the AI output.',
  },
  {
    key: 'tone',
    label: 'Tone keywords',
    multiline: false,
    placeholder: 'e.g. Direct, Warm, Expert, Understated, Honest',
    hint: 'Comma-separated. These become the scoring rubric.',
  },
  {
    key: 'dos',
    label: "Do's — patterns to reinforce",
    multiline: true,
    rows: 4,
    placeholder: 'One per line.\nShort declarative sentences.\nFirst person, observational.',
    hint: 'The AI references these when generating and scoring.',
  },
  {
    key: 'donts',
    label: "Don'ts — patterns to avoid",
    multiline: true,
    rows: 4,
    placeholder: 'One per line.\nBullet points in prose.\nMotivational sign-offs.',
    hint: 'Violations lower the AI score.',
  },
  {
    key: 'exemplar',
    label: 'Exemplar paragraph',
    multiline: true,
    rows: 5,
    placeholder: 'Paste one paragraph that perfectly represents your voice. The AI uses this as a style anchor.',
    hint: 'The single most effective input for consistent AI output.',
  },
];

export default function VoiceEditPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [voice, setVoice] = useState<BrandVoice | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const pendingRef = useRef<Record<string, string | number | null>>({});
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    fetch(`/api/brand-voices/${id}`)
      .then(r => r.ok ? r.json() : null)
      .then(data => { if (data) setVoice(data); })
      .finally(() => setLoading(false));
  }, [id]);

  const doSave = useCallback(async () => {
    if (!voice || Object.keys(pendingRef.current).length === 0) return;
    setSaving(true);
    setSaved(false);
    try {
      const res = await fetch(`/api/brand-voices/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(pendingRef.current),
      });
      if (res.ok) {
        const updated = await res.json();
        setVoice(updated);
        pendingRef.current = {};
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
      }
    } catch (e) { console.error(e); }
    setSaving(false);
  }, [id, voice]);

  function update(key: string, value: string) {
    if (!voice) return;
    setVoice({ ...voice, [key]: value });
    pendingRef.current[key] = value;
    setSaved(false);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(doSave, 1200);
  }

  async function toggleDefault() {
    if (!voice) return;
    const newVal = voice.is_default === 1 ? 0 : 1;
    try {
      const res = await fetch(`/api/brand-voices/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_default: newVal }),
      });
      if (res.ok) setVoice(await res.json());
    } catch (e) { console.error(e); }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20 text-neutral-400">
        <Loader2 size={20} className="animate-spin" />
      </div>
    );
  }

  if (!voice) {
    return (
      <div className="text-center py-20">
        <p className="text-sm text-neutral-500">Voice not found.</p>
        <Link href="/admin/brand/voices" className="text-sm text-neutral-900 underline mt-2 inline-block">
          Back to voices
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/brand/voices"
            className="p-2 -ml-2 text-neutral-400 hover:text-neutral-600 rounded-lg hover:bg-neutral-100 transition-colors"
          >
            <ArrowLeft size={16} />
          </Link>
          <div>
            <input
              type="text"
              value={voice.name}
              onChange={e => update('name', e.target.value)}
              className="text-lg font-semibold text-neutral-900 bg-transparent border-none outline-none focus:ring-0 p-0 w-full"
              placeholder="Voice name"
            />
            <div className="flex items-center gap-3 mt-0.5">
              <span className="text-xs text-neutral-400">/{voice.slug}</span>
              {voice.is_default === 1 && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-amber-50 text-amber-700 text-[10px] font-semibold uppercase tracking-wider rounded-full">
                  <Star size={9} fill="currentColor" /> Default
                </span>
              )}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {saving && (
            <span className="flex items-center gap-1.5 text-xs text-neutral-400">
              <Loader2 size={12} className="animate-spin" /> Saving...
            </span>
          )}
          {saved && (
            <span className="flex items-center gap-1.5 text-xs text-teal-600">
              <Check size={12} /> Saved
            </span>
          )}
          <button
            onClick={toggleDefault}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors ${
              voice.is_default === 1
                ? 'bg-amber-50 border-amber-200 text-amber-700'
                : 'bg-white border-neutral-200 text-neutral-500 hover:border-amber-300 hover:text-amber-600'
            }`}
          >
            <Star size={11} fill={voice.is_default === 1 ? 'currentColor' : 'none'} />
            {voice.is_default === 1 ? 'Default voice' : 'Set as default'}
          </button>
          <button
            onClick={doSave}
            disabled={saving}
            className="flex items-center gap-2 px-4 py-2 bg-neutral-900 text-white text-sm font-medium rounded-lg hover:bg-neutral-700 disabled:opacity-50 transition-colors"
          >
            {saving ? <Loader2 size={13} className="animate-spin" /> : <Check size={13} />}
            Save
          </button>
        </div>
      </div>

      {/* Fields */}
      <div className="space-y-5">
        {FIELDS.map(({ key, label, multiline, rows, placeholder, hint }) => (
          <div key={key}>
            <label className="block text-sm font-semibold text-neutral-700 mb-1">{label}</label>
            <p className="text-xs text-neutral-400 mb-2">{hint}</p>
            {multiline ? (
              <textarea
                value={(voice as unknown as Record<string, unknown>)[key] as string || ''}
                onChange={e => update(key, e.target.value)}
                placeholder={placeholder}
                rows={rows}
                className="w-full px-3 py-2.5 border border-neutral-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-neutral-200 resize-none placeholder:text-neutral-300 text-neutral-800"
              />
            ) : (
              <input
                type="text"
                value={(voice as unknown as Record<string, unknown>)[key] as string || ''}
                onChange={e => update(key, e.target.value)}
                placeholder={placeholder}
                className="w-full px-3 py-2.5 border border-neutral-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-neutral-200 placeholder:text-neutral-300 text-neutral-800"
              />
            )}
          </div>
        ))}
      </div>

      {/* Preview card */}
      {(voice.tagline || voice.tone) && (
        <Card className="p-5">
          <p className="text-xs font-semibold text-neutral-400 uppercase tracking-widest mb-3">Voice snapshot</p>
          {voice.tagline && (
            <p className="text-lg font-semibold text-neutral-900 mb-2">"{voice.tagline}"</p>
          )}
          {voice.tone && (
            <div className="flex flex-wrap gap-2 mt-3">
              {voice.tone.split(',').map(t => t.trim()).filter(Boolean).map(t => (
                <span key={t} className="px-2.5 py-1 bg-neutral-100 rounded-full text-xs font-medium text-neutral-600">
                  {t}
                </span>
              ))}
            </div>
          )}
        </Card>
      )}
    </div>
  );
}
