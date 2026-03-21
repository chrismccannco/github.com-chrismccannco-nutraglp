"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Breadcrumbs from "../../components/Breadcrumbs";
import FormSection from "../../components/FormSection";
import AiAssistPanel from "../../components/AiAssistPanel";
import type { AiAssistResult } from "../../components/AiAssistPanel";

interface AIDraft {
  title: string;
  slug: string;
  description: string;
  tag: string;
  meta_title: string;
  meta_description: string;
  read_time: string;
  sections: { heading: string; body: string }[];
}

export default function NewBlogPost() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [tag, setTag] = useState("");
  const [metaTitle, setMetaTitle] = useState("");
  const [metaDescription, setMetaDescription] = useState("");
  const [ogImage, setOgImage] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [aiDraft, setAiDraft] = useState<AIDraft | null>(null);

  const handleAiResult = (data: AiAssistResult) => {
    const draft = data as unknown as AIDraft;
    setAiDraft(draft);
    if (draft.title) setTitle(draft.title);
    if (draft.slug) setSlug(draft.slug);
    if (draft.description) setDescription(draft.description);
    if (draft.tag) setTag(draft.tag);
    if (draft.meta_title) setMetaTitle(draft.meta_title);
    if (draft.meta_description) setMetaDescription(draft.meta_description);
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !slug) {
      setError("Title and slug are required");
      return;
    }
    setSaving(true);
    try {
      const res = await fetch("/api/blog", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          slug,
          description,
          tag,
          meta_title: metaTitle || undefined,
          meta_description: metaDescription || undefined,
          og_image: ogImage || undefined,
          date: new Date().toISOString().split("T")[0],
          read_time: aiDraft?.read_time || "5 min",
          gradient: "from-blue-900 to-blue-800",
          sections: aiDraft?.sections || [{ heading: "", body: [""] }],
          published: 0,
        }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Create failed");
      }
      router.push(`/admin/blog/${slug}`);
    } catch (e: unknown) {
      setError(String(e));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-2xl">
      <Breadcrumbs
        items={[
          { label: "Admin", href: "/admin" },
          { label: "Blog", href: "/admin/blog" },
          { label: "New post" },
        ]}
      />
      <h1 className="text-xl font-semibold text-neutral-900 mb-6">
        New blog post
      </h1>

      {/* AI Assist Panel */}
      <div className="mb-6">
        <AiAssistPanel
          contentType="blog"
          placeholder="e.g. How GLP-1 affects gut health and digestion, or The science behind appetite regulation with natural compounds"
          buttonLabel="Draft with AI"
          onResult={handleAiResult}
        />
      </div>

      <form onSubmit={handleCreate} className="space-y-4">
        <FormSection title="Details">
          <div className="mb-4">
            <label className="block text-xs font-medium text-neutral-500 mb-1">
              Title
            </label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 border border-neutral-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="mb-4">
            <label className="block text-xs font-medium text-neutral-500 mb-1">
              Slug
            </label>
            <input
              value={slug}
              onChange={(e) =>
                setSlug(e.target.value.replace(/[^a-z0-9-]/g, ""))
              }
              placeholder="my-article-slug"
              className="w-full px-3 py-2 border border-neutral-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="mb-4">
            <label className="block text-xs font-medium text-neutral-500 mb-1">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
              className="w-full px-3 py-2 border border-neutral-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-neutral-500 mb-1">
              Tag
            </label>
            <input
              value={tag}
              onChange={(e) => setTag(e.target.value)}
              className="w-full px-3 py-2 border border-neutral-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </FormSection>

        <FormSection title="SEO (optional)" collapsible>
          <div className="mb-4">
            <label className="block text-xs font-medium text-neutral-500 mb-1">
              Meta Title
            </label>
            <input
              value={metaTitle}
              onChange={(e) => setMetaTitle(e.target.value)}
              placeholder="Override post title for search engines"
              className="w-full px-3 py-2 border border-neutral-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="mb-4">
            <label className="block text-xs font-medium text-neutral-500 mb-1">
              Meta Description (SEO)
            </label>
            <textarea
              value={metaDescription}
              onChange={(e) => setMetaDescription(e.target.value)}
              rows={2}
              placeholder="Override post description for search engines"
              className="w-full px-3 py-2 border border-neutral-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-neutral-500 mb-1">
              OG Image URL
            </label>
            <input
              value={ogImage}
              onChange={(e) => setOgImage(e.target.value)}
              placeholder="https://..."
              className="w-full px-3 py-2 border border-neutral-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </FormSection>

        {/* Preview AI-generated sections */}
        {aiDraft?.sections && aiDraft.sections.length > 0 && (
          <FormSection title={`Content Preview (${aiDraft.sections.length} sections)`} collapsible>
            <div className="space-y-4">
              {aiDraft.sections.map((s, i) => (
                <div key={i} className="border-l-2 border-teal-300 pl-3">
                  <p className="text-xs font-semibold text-neutral-700">{s.heading}</p>
                  <div
                    className="text-xs text-neutral-500 mt-1 line-clamp-3 prose prose-xs"
                    dangerouslySetInnerHTML={{ __html: s.body }}
                  />
                </div>
              ))}
            </div>
            <p className="text-[10px] text-neutral-400 mt-3">
              Full content will be editable after creation.
            </p>
          </FormSection>
        )}

        {error && <p className="text-xs text-red-600">{error}</p>}

        <button
          type="submit"
          disabled={saving}
          className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
        >
          {saving ? "Creating\u2026" : "Create draft"}
        </button>
      </form>
    </div>
  );
}
