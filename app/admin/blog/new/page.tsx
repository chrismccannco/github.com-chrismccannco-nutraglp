"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function NewBlogPost() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [tag, setTag] = useState("");
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
      <button onClick={() => router.push("/admin/blog")} className="text-xs text-gray-500 hover:text-gray-700 mb-1">
        &larr; All posts
      </button>
      <h1 className="text-2xl font-semibold text-gray-900 mb-6">New blog post</h1>

      <form onSubmit={handleCreate} className="bg-white border border-gray-200 rounded-xl p-5 space-y-4">
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">Title</label>
          <input value={title} onChange={(e) => setTitle(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">Slug</label>
          <input
            value={slug}
            onChange={(e) => setSlug(e.target.value.replace(/[^a-z0-9-]/g, ""))}
            placeholder="my-article-slug"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">Description</label>
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={2} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">Tag</label>
          <input value={tag} onChange={(e) => setTag(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" />
        </div>
        {error && <p className="text-xs text-red-600">{error}</p>}
        <button
          type="submit"
          disabled={saving}
          className="px-4 py-2 bg-[#0f2d20] text-white text-sm rounded-lg hover:bg-[#1a4a33] transition disabled:opacity-50"
        >
          {saving ? "Creating..." : "Create post"}
        </button>
      </form>
    </div>
  );
}
