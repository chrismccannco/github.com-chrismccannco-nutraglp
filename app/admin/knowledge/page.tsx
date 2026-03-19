'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Plus, Trash2, Loader2, FileText, Search, ToggleLeft, ToggleRight } from 'lucide-react';

interface KnowledgeDoc {
  id: number;
  title: string;
  slug: string;
  doc_type: string;
  summary: string | null;
  tags: string;
  word_count: number;
  enabled: number;
  created_at: string;
  updated_at: string;
}

const DOC_TYPES: Record<string, string> = {
  general: 'General',
  product: 'Product Brief',
  competitor: 'Competitor Card',
  style_guide: 'Style Guide',
  faq: 'FAQ Source',
  research: 'Research',
  policy: 'Policy',
};

export default function KnowledgePage() {
  const [docs, setDocs] = useState<KnowledgeDoc[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState('');

  async function load() {
    try {
      const params = new URLSearchParams();
      if (search) params.set('q', search);
      if (filterType) params.set('type', filterType);
      params.set('enabled', '0'); // show all, including disabled
      const res = await fetch(`/api/knowledge?${params}`);
      if (res.ok) setDocs(await res.json());
    } catch (e) { console.error(e); }
    setLoading(false);
  }

  useEffect(() => { load(); }, [search, filterType]);

  async function createDoc() {
    setCreating(true);
    try {
      const res = await fetch('/api/knowledge', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: 'Untitled Document',
          content: '',
          doc_type: 'general',
        }),
      });
      if (res.ok) {
        const doc = await res.json();
        window.location.href = `/admin/knowledge/${doc.id}`;
      } else {
        const err = await res.json().catch(() => ({ error: 'Creation failed' }));
        alert(err.error || 'Failed to create document');
      }
    } catch {
      alert('Failed to create document');
    }
    setCreating(false);
  }

  async function toggleEnabled(id: number, currentState: number) {
    try {
      const res = await fetch(`/api/knowledge/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ enabled: currentState !== 1 }),
      });
      if (!res.ok) alert('Failed to update document status');
      await load();
    } catch {
      alert('Failed to update document status');
    }
  }

  async function deleteDoc(id: number, title: string) {
    if (!confirm(`Delete "${title}"? This cannot be undone.`)) return;
    try {
      const res = await fetch(`/api/knowledge/${id}`, { method: 'DELETE' });
      if (!res.ok) alert('Failed to delete document');
      await load();
    } catch {
      alert('Failed to delete document');
    }
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="bg-white border-b border-neutral-200 px-8 pt-6 pb-6">
        <p className="text-xs text-neutral-400 mb-1">Admin / Knowledge Base</p>
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-neutral-900">Knowledge Base</h1>
            <p className="text-xs text-neutral-400 mt-0.5">
              Upload product briefs, competitor cards, and reference docs. The AI writer uses these as source of truth.
            </p>
          </div>
          <button
            onClick={createDoc}
            disabled={creating}
            className="flex items-center gap-2 px-4 py-2 bg-neutral-900 text-white text-sm font-medium rounded-lg hover:bg-neutral-700 disabled:opacity-50 transition-colors"
          >
            {creating ? <Loader2 size={13} className="animate-spin" /> : <Plus size={13} />}
            Add Document
          </button>
        </div>
      </div>

      <div className="px-8 py-6 max-w-5xl">
        {/* Filters */}
        <div className="flex gap-3 mb-6">
          <div className="relative flex-1">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search documents..."
              className="w-full pl-9 pr-3 py-2 border border-neutral-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-neutral-200 placeholder:text-neutral-300"
            />
          </div>
          <select
            value={filterType}
            onChange={e => setFilterType(e.target.value)}
            className="px-3 py-2 border border-neutral-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-neutral-200 text-neutral-700"
          >
            <option value="">All types</option>
            {Object.entries(DOC_TYPES).map(([val, label]) => (
              <option key={val} value={val}>{label}</option>
            ))}
          </select>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20 text-neutral-400">
            <Loader2 size={20} className="animate-spin" />
          </div>
        ) : docs.length === 0 ? (
          <div className="bg-white rounded-xl border border-neutral-200 p-8 text-center">
            <FileText size={32} className="mx-auto text-neutral-300 mb-3" />
            <p className="text-sm text-neutral-500 mb-4">
              {search || filterType ? 'No documents match your search.' : 'No knowledge documents yet. Add your first reference doc.'}
            </p>
            {!search && !filterType && (
              <button
                onClick={createDoc}
                disabled={creating}
                className="inline-flex items-center gap-2 px-4 py-2 bg-neutral-900 text-white text-sm font-medium rounded-lg hover:bg-neutral-700 disabled:opacity-50 transition-colors"
              >
                <Plus size={13} /> Add your first document
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            {docs.map(doc => (
              <div
                key={doc.id}
                className={`bg-white rounded-xl border border-neutral-200 p-5 hover:border-neutral-300 transition-colors ${
                  doc.enabled !== 1 ? 'opacity-60' : ''
                }`}
              >
                <div className="flex items-start justify-between">
                  <Link href={`/admin/knowledge/${doc.id}`} className="flex-1 no-underline group">
                    <div className="flex items-center gap-2.5 mb-1">
                      <h3 className="text-sm font-semibold text-neutral-900 group-hover:text-neutral-600 transition-colors">
                        {doc.title}
                      </h3>
                      <span className="px-2 py-0.5 bg-neutral-100 rounded-full text-[10px] font-medium text-neutral-500">
                        {DOC_TYPES[doc.doc_type] || doc.doc_type}
                      </span>
                    </div>
                    {doc.summary && (
                      <p className="text-xs text-neutral-500 mb-2 line-clamp-2">{doc.summary}</p>
                    )}
                    <div className="flex items-center gap-4 text-[11px] text-neutral-400">
                      <span>{doc.word_count.toLocaleString()} words</span>
                      <span>Updated {new Date(doc.updated_at).toLocaleDateString()}</span>
                      {doc.tags && doc.tags !== '[]' && (
                        <span>{JSON.parse(doc.tags).length} tags</span>
                      )}
                    </div>
                  </Link>

                  <div className="flex items-center gap-1 ml-4 shrink-0">
                    <button
                      onClick={() => toggleEnabled(doc.id, doc.enabled)}
                      title={doc.enabled === 1 ? 'Disable (exclude from AI)' : 'Enable (include in AI)'}
                      className="p-2 text-neutral-400 hover:text-neutral-600 rounded-lg hover:bg-neutral-50 transition-colors"
                    >
                      {doc.enabled === 1 ? <ToggleRight size={16} className="text-emerald-500" /> : <ToggleLeft size={16} />}
                    </button>
                    <button
                      onClick={() => deleteDoc(doc.id, doc.title)}
                      title="Delete"
                      className="p-2 text-neutral-400 hover:text-red-500 rounded-lg hover:bg-neutral-50 transition-colors"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
