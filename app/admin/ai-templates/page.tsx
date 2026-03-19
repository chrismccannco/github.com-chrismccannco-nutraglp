'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Plus, Trash2, Loader2, Wand2, Play } from 'lucide-react';

interface ContentTemplate {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  category: string;
  prompt_template: string;
  voice_id: number | null;
  output_format: string;
  variables: string;
  is_system: number;
  created_at: string;
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

export default function AITemplatesPage() {
  const [templates, setTemplates] = useState<ContentTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);

  async function load() {
    try {
      const res = await fetch('/api/content-templates');
      if (res.ok) setTemplates(await res.json());
    } catch { /* ignore */ }
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  async function createTemplate() {
    setCreating(true);
    try {
      const res = await fetch('/api/content-templates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: 'New Template',
          prompt_template: 'Write a {{content_type}} about {{topic}}.',
          variables: [
            { key: 'content_type', label: 'Content type', default: 'blog post' },
            { key: 'topic', label: 'Topic', default: '' },
          ],
        }),
      });
      if (res.ok) {
        const tmpl = await res.json();
        window.location.href = `/admin/ai-templates/${tmpl.id}`;
      }
    } catch { /* ignore */ }
    setCreating(false);
  }

  async function deleteTemplate(id: number, name: string) {
    if (!confirm(`Delete "${name}"?`)) return;
    try {
      await fetch(`/api/content-templates/${id}`, { method: 'DELETE' });
      await load();
    } catch { /* ignore */ }
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="bg-white border-b border-neutral-200 px-8 pt-6 pb-6">
        <p className="text-xs text-neutral-400 mb-1">Admin / AI Templates</p>
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-neutral-900">AI Templates</h1>
            <p className="text-xs text-neutral-400 mt-0.5">
              Reusable generation recipes. Each template specifies a prompt, voice, knowledge sources, and output format.
            </p>
          </div>
          <button
            onClick={createTemplate}
            disabled={creating}
            className="flex items-center gap-2 px-4 py-2 bg-neutral-900 text-white text-sm font-medium rounded-lg hover:bg-neutral-700 disabled:opacity-50 transition-colors"
          >
            {creating ? <Loader2 size={13} className="animate-spin" /> : <Plus size={13} />}
            New Template
          </button>
        </div>
      </div>

      <div className="px-8 py-6 max-w-5xl">
        {loading ? (
          <div className="flex items-center justify-center py-20 text-neutral-400">
            <Loader2 size={20} className="animate-spin" />
          </div>
        ) : templates.length === 0 ? (
          <div className="bg-white rounded-xl border border-neutral-200 p-8 text-center">
            <Wand2 size={32} className="mx-auto text-neutral-300 mb-3" />
            <p className="text-sm text-neutral-500 mb-4">No AI templates yet. Create reusable content recipes.</p>
            <button
              onClick={createTemplate}
              disabled={creating}
              className="inline-flex items-center gap-2 px-4 py-2 bg-neutral-900 text-white text-sm font-medium rounded-lg hover:bg-neutral-700 disabled:opacity-50 transition-colors"
            >
              <Plus size={13} /> Create your first template
            </button>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {templates.map(t => {
              let varCount = 0;
              try { varCount = JSON.parse(t.variables || '[]').length; } catch { /* */ }
              return (
                <div
                  key={t.id}
                  className="bg-white rounded-xl border border-neutral-200 p-5 hover:border-neutral-300 transition-colors"
                >
                  <div className="flex items-start justify-between mb-3">
                    <Link href={`/admin/ai-templates/${t.id}`} className="flex-1 no-underline group">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-sm font-semibold text-neutral-900 group-hover:text-neutral-600 transition-colors">
                          {t.name}
                        </h3>
                        <span className="px-2 py-0.5 bg-neutral-100 rounded-full text-[10px] font-medium text-neutral-500">
                          {CATEGORIES[t.category] || t.category}
                        </span>
                      </div>
                      {t.description && (
                        <p className="text-xs text-neutral-500 line-clamp-2">{t.description}</p>
                      )}
                    </Link>
                    {t.is_system !== 1 && (
                      <button
                        onClick={() => deleteTemplate(t.id, t.name)}
                        className="p-1.5 text-neutral-400 hover:text-red-500 rounded-lg hover:bg-neutral-50 transition-colors ml-2"
                      >
                        <Trash2 size={13} />
                      </button>
                    )}
                  </div>
                  <div className="flex items-center gap-3 text-[11px] text-neutral-400">
                    <span>{varCount} variable{varCount !== 1 ? 's' : ''}</span>
                    <span>{t.output_format}</span>
                    {t.voice_id && <span>Voice #{t.voice_id}</span>}
                  </div>
                  <Link
                    href={`/admin/ai-templates/${t.id}`}
                    className="inline-flex items-center gap-1.5 mt-3 px-3 py-1.5 bg-neutral-900 text-white text-xs font-medium rounded-lg hover:bg-neutral-700 transition-colors no-underline"
                  >
                    <Play size={10} /> Run
                  </Link>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
