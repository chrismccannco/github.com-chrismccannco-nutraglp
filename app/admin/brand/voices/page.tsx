'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Plus, Star, Trash2, Copy, Loader2 } from 'lucide-react';
import { SectionHeader, Card } from '../components';

interface BrandVoice {
  id: number;
  name: string;
  slug: string;
  is_default: number;
  tagline: string | null;
  tone: string | null;
  mission: string | null;
  created_at: string;
  updated_at: string;
}

export default function VoicesPage() {
  const [voices, setVoices] = useState<BrandVoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);

  async function load() {
    try {
      const res = await fetch('/api/brand-voices');
      if (res.ok) setVoices(await res.json());
    } catch { /* ignore */ }
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  async function createVoice() {
    setCreating(true);
    try {
      const res = await fetch('/api/brand-voices', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: `New Voice ${voices.length + 1}`,
          is_default: voices.length === 0,
        }),
      });
      if (res.ok) {
        const voice = await res.json();
        window.location.href = `/admin/brand/voices/${voice.id}`;
      }
    } catch { /* ignore */ }
    setCreating(false);
  }

  async function duplicateVoice(id: number) {
    try {
      const res = await fetch(`/api/brand-voices/${id}/duplicate`, {
        method: 'POST',
      });
      if (res.ok) await load();
    } catch { /* ignore */ }
  }

  async function deleteVoice(id: number, name: string) {
    if (!confirm(`Delete "${name}"? This cannot be undone.`)) return;
    try {
      await fetch(`/api/brand-voices/${id}`, { method: 'DELETE' });
      await load();
    } catch { /* ignore */ }
  }

  async function setDefault(id: number) {
    try {
      await fetch(`/api/brand-voices/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_default: true }),
      });
      await load();
    } catch { /* ignore */ }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20 text-neutral-400">
        <Loader2 size={20} className="animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <SectionHeader
        title="Brand Voices"
        description="Create multiple voices for different brands, audiences, or content types. The default voice is used by the AI writer when no voice is specified."
        action={
          <button
            onClick={createVoice}
            disabled={creating}
            className="flex items-center gap-2 px-4 py-2 bg-neutral-900 text-white text-sm font-medium rounded-lg hover:bg-neutral-700 disabled:opacity-50 transition-colors"
          >
            {creating ? <Loader2 size={13} className="animate-spin" /> : <Plus size={13} />}
            New Voice
          </button>
        }
      />

      {voices.length === 0 ? (
        <Card className="p-8 text-center">
          <p className="text-sm text-neutral-500 mb-4">No brand voices yet. Create one to get started.</p>
          <button
            onClick={createVoice}
            disabled={creating}
            className="inline-flex items-center gap-2 px-4 py-2 bg-neutral-900 text-white text-sm font-medium rounded-lg hover:bg-neutral-700 disabled:opacity-50 transition-colors"
          >
            <Plus size={13} /> Create your first voice
          </button>
        </Card>
      ) : (
        <div className="grid gap-4">
          {voices.map((v) => (
            <Card key={v.id} className="p-5 hover:border-neutral-300 transition-colors">
              <div className="flex items-start justify-between">
                <Link href={`/admin/brand/voices/${v.id}`} className="flex-1 no-underline group">
                  <div className="flex items-center gap-2.5 mb-1.5">
                    <h3 className="text-sm font-semibold text-neutral-900 group-hover:text-neutral-600 transition-colors">
                      {v.name}
                    </h3>
                    {v.is_default === 1 && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-amber-50 text-amber-700 text-[10px] font-semibold uppercase tracking-wider rounded-full">
                        <Star size={9} fill="currentColor" /> Default
                      </span>
                    )}
                  </div>
                  {v.tagline && (
                    <p className="text-xs text-neutral-500 mb-2">{v.tagline}</p>
                  )}
                  {v.tone && (
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {v.tone.split(',').map(t => t.trim()).filter(Boolean).slice(0, 5).map(t => (
                        <span key={t} className="px-2 py-0.5 bg-neutral-100 rounded-full text-[11px] font-medium text-neutral-500">
                          {t}
                        </span>
                      ))}
                    </div>
                  )}
                </Link>

                <div className="flex items-center gap-1 ml-4 shrink-0">
                  {v.is_default !== 1 && (
                    <button
                      onClick={() => setDefault(v.id)}
                      title="Set as default"
                      className="p-2 text-neutral-400 hover:text-amber-600 rounded-lg hover:bg-neutral-50 transition-colors"
                    >
                      <Star size={14} />
                    </button>
                  )}
                  <button
                    onClick={() => duplicateVoice(v.id)}
                    title="Duplicate"
                    className="p-2 text-neutral-400 hover:text-neutral-600 rounded-lg hover:bg-neutral-50 transition-colors"
                  >
                    <Copy size={14} />
                  </button>
                  {v.is_default !== 1 && (
                    <button
                      onClick={() => deleteVoice(v.id, v.name)}
                      title="Delete"
                      className="p-2 text-neutral-400 hover:text-red-500 rounded-lg hover:bg-neutral-50 transition-colors"
                    >
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
