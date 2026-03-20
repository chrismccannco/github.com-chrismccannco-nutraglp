'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { useParams } from 'next/navigation';
import { ArrowLeft, Loader2, Check } from 'lucide-react';
import Link from 'next/link';

interface KnowledgeDoc {
  id: number;
  title: string;
  slug: string;
  doc_type: string;
  content: string;
  summary: string | null;
  tags: string;
  word_count: number;
  enabled: number;
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

export default function KnowledgeEditPage() {
  const { id } = useParams<{ id: string }>();
  const [doc, setDoc] = useState<KnowledgeDoc | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [tagsInput, setTagsInput] = useState('');
  const pendingRef = useRef<Record<string, unknown>>({});
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    fetch(`/api/knowledge/${id}`)
      .then(r => r.ok ? r.json() : null)
      .then(data => {
        if (data) {
          setDoc(data);
          try {
            setTagsInput(JSON.parse(data.tags || '[]').join(', '));
          } catch { setTagsInput(''); }
        }
      })
      .finally(() => setLoading(false));
  }, [id]);

  const doSave = useCallback(async () => {
    if (!doc || Object.keys(pendingRef.current).length === 0) return;
    setSaving(true);
    setSaved(false);
    try {
      const res = await fetch(`/api/knowledge/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(pendingRef.current),
      });
      if (res.ok) {
        const updated = await res.json();
        setDoc(updated);
        pendingRef.current = {};
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
      }
    } catch (e) { console.error(e); }
    setSaving(false);
  }, [id, doc]);

  function update(key: string, value: unknown) {
    if (!doc) return;
    if (key === 'tags') {
      // tags stored as JSON array
      const arr = (value as string).split(',').map(t => t.trim()).filter(Boolean);
      pendingRef.current.tags = arr;
      setTagsInput(value as string);
    } else {
      setDoc({ ...doc, [key]: value });
      pendingRef.current[key] = value;
    }
    setSaved(false);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(doSave, 1200);
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20 text-neutral-400">
        <Loader2 size={20} className="animate-spin" />
      </div>
    );
  }

  if (!doc) {
    return (
      <div className="text-center py-20">
        <p className="text-sm text-neutral-500">Document not found.</p>
        <Link href="/admin/knowledge" className="text-sm text-neutral-900 underline mt-2 inline-block">
          Back to knowledge base
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="bg-white border-b border-neutral-200 px-8 pt-6 pb-6">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <Link
              href="/admin/knowledge"
              className="p-2 -ml-2 text-neutral-400 hover:text-neutral-600 rounded-lg hover:bg-neutral-100 transition-colors"
            >
              <ArrowLeft size={16} />
            </Link>
            <div className="flex-1">
              <input
                type="text"
                value={doc.title}
                onChange={e => update('title', e.target.value)}
                className="text-lg font-semibold text-neutral-900 bg-transparent border-none outline-none focus:ring-0 p-0 w-full"
                placeholder="Document title"
              />
              <div className="flex items-center gap-3 mt-1">
                <span className="text-xs text-neutral-400">{doc.word_count.toLocaleString()} words</span>
                <span className={`text-xs ${doc.enabled === 1 ? 'text-teal-600' : 'text-neutral-400'}`}>
                  {doc.enabled === 1 ? 'Active in AI' : 'Disabled'}
                </span>
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
              onClick={doSave}
              disabled={saving}
              className="flex items-center gap-2 px-4 py-2 bg-neutral-900 text-white text-sm font-medium rounded-lg hover:bg-neutral-700 disabled:opacity-50 transition-colors"
            >
              {saving ? <Loader2 size={13} className="animate-spin" /> : <Check size={13} />}
              Save
            </button>
          </div>
        </div>
      </div>

      <div className="px-8 py-6 max-w-5xl space-y-6">
        {/* Metadata row */}
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-neutral-500 mb-1.5">Document type</label>
            <select
              value={doc.doc_type}
              onChange={e => update('doc_type', e.target.value)}
              className="w-full px-3 py-2 border border-neutral-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-neutral-200 text-neutral-700"
            >
              {Object.entries(DOC_TYPES).map(([val, label]) => (
                <option key={val} value={val}>{label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-neutral-500 mb-1.5">Tags (comma-separated)</label>
            <input
              type="text"
              value={tagsInput}
              onChange={e => update('tags', e.target.value)}
              placeholder="e.g. pricing, features, Q1"
              className="w-full px-3 py-2 border border-neutral-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-neutral-200 placeholder:text-neutral-300 text-neutral-700"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-neutral-500 mb-1.5">Status</label>
            <button
              onClick={() => update('enabled', doc.enabled === 1 ? 0 : 1)}
              className={`w-full px-3 py-2 border rounded-lg text-sm font-medium transition-colors ${
                doc.enabled === 1
                  ? 'bg-teal-50 border-teal-200 text-teal-700'
                  : 'bg-neutral-50 border-neutral-200 text-neutral-500'
              }`}
            >
              {doc.enabled === 1 ? 'Active — included in AI context' : 'Disabled — excluded from AI'}
            </button>
          </div>
        </div>

        {/* Summary */}
        <div>
          <label className="block text-xs font-semibold text-neutral-500 mb-1.5">Summary</label>
          <p className="text-xs text-neutral-400 mb-2">One-line description. Shown in the document list and used by AI to decide relevance.</p>
          <input
            type="text"
            value={doc.summary || ''}
            onChange={e => update('summary', e.target.value)}
            placeholder="Brief description of what this document covers"
            className="w-full px-3 py-2.5 border border-neutral-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-neutral-200 placeholder:text-neutral-300 text-neutral-700"
          />
        </div>

        {/* Content */}
        <div>
          <label className="block text-xs font-semibold text-neutral-500 mb-1.5">Content</label>
          <p className="text-xs text-neutral-400 mb-2">Paste your reference material. The AI writer injects this as source of truth when generating content.</p>
          <textarea
            value={doc.content || ''}
            onChange={e => update('content', e.target.value)}
            placeholder="Paste product specs, competitor analysis, pricing details, policies, or any reference material here..."
            rows={20}
            className="w-full px-4 py-3 border border-neutral-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-neutral-200 resize-y placeholder:text-neutral-300 text-neutral-800 font-mono leading-relaxed"
          />
        </div>
      </div>
    </div>
  );
}
