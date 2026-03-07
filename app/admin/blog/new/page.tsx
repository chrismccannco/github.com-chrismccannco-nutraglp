"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Breadcrumbs from "../../components/Breadcrumbs";
import FormSection from "../../components/FormSection";

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
          read_time: "5 min",
          gradient: "from-emerald-900 to-green-800",
          sections: [{ heading: "", body: [""] }],
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
    <div className="max-w-xl">
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

      <form onSubmit={handleCreate} className="space-y-4">
        <FormSection title="Details">
          <div className="mb-4">
            <label className="block text-xs font-medium text-neutral-500 mb-1">
              Title
            </label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 border border-neutral-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
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
              className="w-full px-3 py-2 border border-neutral-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
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
              className="w-full px-3 py-2 border border-neutral-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-neutral-500 mb-1">
              Tag
            </label>
            <input
              value={tag}
              onChange={(e) => setTag(e.target.value)}
              className="w-full px-3 py-2 border border-neutral-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
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
              className="w-full px-3 py-2 border border-neutral-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
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
              className="w-full px-3 py-2 border border-neutral-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
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
              className="w-full px-3 py-2 border border-neutral-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
        </FormSection>

        {error && <p className="text-xs text-red-600">{error}</p>}

        <button
          type="submit"
          disabled={saving}
          className="px-4 py-2 bg-emerald-600 text-white text-sm rounded-lg hover:bg-emerald-700 transition disabled:opacity-50"
        >
          {saving ? "Creating\u2026" : "Create post"}
        </button>
      </form>
    </div>
  );
}
