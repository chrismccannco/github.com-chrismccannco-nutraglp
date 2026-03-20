'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Plus, Trash2, Loader2, UserCircle, Star } from 'lucide-react';

interface Persona {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  demographics: string | null;
  goals: string | null;
  pain_points: string | null;
  communication_style: string | null;
  is_default: number;
  created_at: string;
}

export default function PersonasPage() {
  const [personas, setPersonas] = useState<Persona[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);

  async function load() {
    try {
      const res = await fetch('/api/personas');
      if (res.ok) setPersonas(await res.json());
    } catch (e) { console.error(e); }
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  async function createPersona() {
    setCreating(true);
    try {
      const res = await fetch('/api/personas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: `New Persona ${personas.length + 1}`,
          is_default: personas.length === 0,
        }),
      });
      if (res.ok) {
        const p = await res.json();
        window.location.href = `/admin/personas/${p.id}`;
      }
    } catch (e) { console.error(e); }
    setCreating(false);
  }

  async function deletePersona(id: number, name: string) {
    if (!confirm(`Delete "${name}"?`)) return;
    try {
      await fetch(`/api/personas/${id}`, { method: 'DELETE' });
      await load();
    } catch (e) { console.error(e); }
  }

  async function setDefault(id: number) {
    try {
      await fetch(`/api/personas/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_default: true }),
      });
      await load();
    } catch (e) { console.error(e); }
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="bg-white border-b border-neutral-200 px-8 pt-6 pb-6">
        <p className="text-xs text-neutral-400 mb-1">Admin / Audience Personas</p>
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-neutral-900">Audience Personas</h1>
            <p className="text-xs text-neutral-400 mt-0.5">
              Define target segments. The AI adapts content to speak directly to each persona's goals, pain points, and communication style.
            </p>
          </div>
          <button
            onClick={createPersona}
            disabled={creating}
            className="flex items-center gap-2 px-4 py-2 bg-neutral-900 text-white text-sm font-medium rounded-lg hover:bg-neutral-700 disabled:opacity-50 transition-colors"
          >
            {creating ? <Loader2 size={13} className="animate-spin" /> : <Plus size={13} />}
            New Persona
          </button>
        </div>
      </div>

      <div className="px-8 py-6 max-w-5xl">
        {loading ? (
          <div className="flex items-center justify-center py-20 text-neutral-400">
            <Loader2 size={20} className="animate-spin" />
          </div>
        ) : personas.length === 0 ? (
          <div className="bg-white rounded-xl border border-neutral-200 p-8 text-center">
            <UserCircle size={32} className="mx-auto text-neutral-300 mb-3" />
            <p className="text-sm text-neutral-500 mb-4">No personas yet. Define your first target audience segment.</p>
            <button onClick={createPersona} disabled={creating}
              className="inline-flex items-center gap-2 px-4 py-2 bg-neutral-900 text-white text-sm font-medium rounded-lg hover:bg-neutral-700 disabled:opacity-50 transition-colors">
              <Plus size={13} /> Create your first persona
            </button>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {personas.map(p => (
              <div key={p.id} className="bg-white rounded-xl border border-neutral-200 p-5 hover:border-neutral-300 transition-colors">
                <div className="flex items-start justify-between mb-2">
                  <Link href={`/admin/personas/${p.id}`} className="flex-1 no-underline group">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-sm font-semibold text-neutral-900 group-hover:text-neutral-600 transition-colors">{p.name}</h3>
                      {p.is_default === 1 && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-amber-50 text-amber-700 text-[10px] font-semibold uppercase tracking-wider rounded-full">
                          <Star size={9} fill="currentColor" /> Default
                        </span>
                      )}
                    </div>
                    {p.description && <p className="text-xs text-neutral-500 line-clamp-2 mb-2">{p.description}</p>}
                  </Link>
                  <div className="flex items-center gap-1 ml-2 shrink-0">
                    {p.is_default !== 1 && (
                      <button onClick={() => setDefault(p.id)} title="Set as default"
                        className="p-1.5 text-neutral-400 hover:text-amber-600 rounded-lg hover:bg-neutral-50 transition-colors">
                        <Star size={13} />
                      </button>
                    )}
                    <button onClick={() => deletePersona(p.id, p.name)} title="Delete"
                      className="p-1.5 text-neutral-400 hover:text-red-500 rounded-lg hover:bg-neutral-50 transition-colors">
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2 text-[11px] text-neutral-400">
                  {p.goals && <span>Goals defined</span>}
                  {p.pain_points && <span>Pain points defined</span>}
                  {p.communication_style && <span>Style defined</span>}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
