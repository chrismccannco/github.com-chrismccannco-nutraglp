"use client";

import { useEffect, useState, useCallback } from "react";
import type { Template, TemplateCategory } from "@/lib/types/templates";
import { TEMPLATE_CATEGORIES } from "@/lib/types/templates";

/* ────────────────────── helpers ────────────────────── */

const BLOCK_TYPE_LABELS: Record<string, string> = {
  hero: "Hero",
  rich_text: "Rich Text",
  image: "Image",
  image_text: "Image + Text",
  cta_button: "CTA Button",
  testimonials: "Testimonials",
  faq_accordion: "FAQ",
  spacer: "Spacer",
  video_embed: "Video",
  stats_grid: "Stats Grid",
  card_grid: "Card Grid",
  divider: "Divider",
};

function categoryColor(cat: string): string {
  const colors: Record<string, string> = {
    page: "bg-blue-100 text-blue-700",
    landing: "bg-teal-100 text-teal-700",
    blog: "bg-blue-100 text-blue-700",
    product: "bg-amber-100 text-amber-700",
    email: "bg-pink-100 text-pink-700",
    form: "bg-cyan-100 text-cyan-700",
  };
  return colors[cat] || "bg-gray-100 text-gray-700";
}

/* ────────────────────── main page ────────────────────── */

export default function TemplatesPage() {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(true);
  const [seeded, setSeeded] = useState(false);

  /* Filters */
  const [category, setCategory] = useState<string>("");
  const [search, setSearch] = useState("");
  const [premiumFilter, setPremiumFilter] = useState<string>("");

  /* Modals */
  const [preview, setPreview] = useState<Template | null>(null);
  const [installing, setInstalling] = useState<number | null>(null);
  const [installResult, setInstallResult] = useState<{ slug?: string; target_type?: string } | null>(null);

  /* Create template */
  const [showCreate, setShowCreate] = useState(false);
  const [newName, setNewName] = useState("");
  const [newSlug, setNewSlug] = useState("");
  const [newCategory, setNewCategory] = useState<TemplateCategory>("page");
  const [newDescription, setNewDescription] = useState("");
  const [newTags, setNewTags] = useState("");
  const [newPremium, setNewPremium] = useState(false);
  const [newPrice, setNewPrice] = useState("");

  const fetchTemplates = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (category) params.set("category", category);
    if (search) params.set("search", search);
    if (premiumFilter) params.set("premium", premiumFilter);
    const res = await fetch(`/api/templates?${params}`);
    if (res.ok) setTemplates(await res.json());
    setLoading(false);
  }, [category, search, premiumFilter]);

  useEffect(() => {
    fetchTemplates();
  }, [fetchTemplates]);

  /* Seed starter templates */
  const seedTemplates = async () => {
    const res = await fetch("/api/templates/seed", { method: "POST" });
    if (res.ok) {
      setSeeded(true);
      fetchTemplates();
    }
  };

  /* Install template as new page */
  const handleInstall = async (tpl: Template) => {
    setInstalling(tpl.id);
    setInstallResult(null);
    const res = await fetch("/api/templates/install", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ template_id: tpl.id, target_type: "page" }),
    });
    if (res.ok) {
      const data = await res.json();
      setInstallResult(data);
      fetchTemplates();
    }
    setInstalling(null);
  };

  /* Create custom template */
  const handleCreate = async () => {
    if (!newName.trim()) return;
    const slug =
      newSlug.trim() ||
      newName
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "");

    const res = await fetch("/api/templates", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        slug,
        name: newName.trim(),
        description: newDescription.trim() || null,
        category: newCategory,
        tags: newTags
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean),
        is_premium: newPremium,
        price: newPremium ? parseFloat(newPrice) || 0 : 0,
        blocks: [],
      }),
    });

    if (res.ok) {
      setShowCreate(false);
      setNewName("");
      setNewSlug("");
      setNewDescription("");
      setNewTags("");
      setNewPremium(false);
      setNewPrice("");
      fetchTemplates();
    }
  };

  /* Delete template */
  const handleDelete = async (slug: string) => {
    if (!confirm("Delete this template?")) return;
    await fetch(`/api/templates/${slug}`, { method: "DELETE" });
    fetchTemplates();
    if (preview?.slug === slug) setPreview(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Template Marketplace</h1>
          <p className="text-sm text-gray-500 mt-1">
            Browse, preview, and install templates to jumpstart your pages.
          </p>
        </div>
        <div className="flex gap-2">
          {!seeded && templates.length === 0 && !loading && (
            <button
              onClick={seedTemplates}
              className="px-4 py-2 text-sm bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition"
            >
              Load Starter Templates
            </button>
          )}
          <button
            onClick={() => setShowCreate(true)}
            className="px-4 py-2 text-sm bg-[#1B3A5C] text-white rounded-lg hover:bg-[#132D4A] transition"
          >
            + Create Template
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-3 flex-wrap">
        <input
          type="text"
          placeholder="Search templates…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="px-3 py-2 border rounded-lg text-sm w-64 focus:ring-2 focus:ring-[#1B3A5C]/20 focus:border-[#1B3A5C] outline-none"
        />
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="px-3 py-2 border rounded-lg text-sm"
        >
          <option value="">All Categories</option>
          {TEMPLATE_CATEGORIES.map((c) => (
            <option key={c.value} value={c.value}>
              {c.label}
            </option>
          ))}
        </select>
        <select
          value={premiumFilter}
          onChange={(e) => setPremiumFilter(e.target.value)}
          className="px-3 py-2 border rounded-lg text-sm"
        >
          <option value="">All</option>
          <option value="false">Free</option>
          <option value="true">Premium</option>
        </select>
      </div>

      {/* Install success banner */}
      {installResult && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-blue-800">Template installed successfully.</p>
            {installResult.slug && (
              <p className="text-xs text-blue-600 mt-0.5">
                New {installResult.target_type === "blog_post" ? "blog post" : "page"} created with slug: {installResult.slug}
              </p>
            )}
          </div>
          <div className="flex gap-2">
            {installResult.slug && (
              <a
                href={`/admin/pages/${installResult.slug}`}
                className="text-xs text-blue-700 underline"
              >
                Edit Page
              </a>
            )}
            <button onClick={() => setInstallResult(null)} className="text-xs text-blue-600 hover:text-blue-800">
              Dismiss
            </button>
          </div>
        </div>
      )}

      {/* Template grid */}
      {loading ? (
        <div className="text-center py-12 text-gray-400">Loading templates…</div>
      ) : templates.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl border border-dashed border-gray-300">
          <p className="text-gray-500 text-sm">No templates found.</p>
          <p className="text-gray-400 text-xs mt-1">
            Click "Load Starter Templates" to get started, or create your own.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {templates.map((tpl) => (
            <div
              key={tpl.id}
              className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-md transition group"
            >
              {/* Thumbnail placeholder */}
              <div className="h-40 bg-gradient-to-br from-gray-100 to-gray-50 flex items-center justify-center relative">
                <div className="text-center">
                  <div className="text-3xl mb-1 opacity-40">
                    {tpl.category === "landing" ? "🚀" : tpl.category === "blog" ? "📝" : tpl.category === "product" ? "📦" : "📄"}
                  </div>
                  <p className="text-xs text-gray-400">
                    {(tpl.blocks as unknown[]).length} blocks
                  </p>
                </div>
                {tpl.is_premium && (
                  <span className="absolute top-2 right-2 bg-amber-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                    PRO ${tpl.price}
                  </span>
                )}
              </div>

              <div className="p-4">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h3 className="font-semibold text-gray-900 text-sm leading-tight">{tpl.name}</h3>
                  <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full whitespace-nowrap ${categoryColor(tpl.category)}`}>
                    {tpl.category}
                  </span>
                </div>

                {tpl.description && (
                  <p className="text-xs text-gray-500 mb-3 line-clamp-2">{tpl.description}</p>
                )}

                <div className="flex items-center gap-3 text-[11px] text-gray-400 mb-3">
                  <span>by {tpl.author}</span>
                  <span>v{tpl.version}</span>
                  <span>{tpl.downloads} installs</span>
                  {tpl.rating > 0 && <span>★ {tpl.rating.toFixed(1)}</span>}
                </div>

                {tpl.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-3">
                    {tpl.tags.slice(0, 4).map((tag) => (
                      <span
                        key={tag}
                        className="text-[10px] bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}

                <div className="flex gap-2">
                  <button
                    onClick={() => setPreview(tpl)}
                    className="flex-1 text-xs py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition"
                  >
                    Preview
                  </button>
                  <button
                    onClick={() => handleInstall(tpl)}
                    disabled={installing === tpl.id}
                    className="flex-1 text-xs py-2 bg-[#1B3A5C] text-white rounded-lg hover:bg-[#132D4A] transition disabled:opacity-50"
                  >
                    {installing === tpl.id ? "Installing…" : "Install"}
                  </button>
                  <button
                    onClick={() => handleDelete(tpl.slug)}
                    className="text-xs py-2 px-2 text-red-400 hover:text-red-600 transition"
                    title="Delete"
                  >
                    ✕
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Preview modal */}
      {preview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40" onClick={() => setPreview(null)} />
          <div className="relative bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[85vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between z-10 rounded-t-2xl">
              <div>
                <h2 className="font-bold text-lg text-gray-900">{preview.name}</h2>
                <p className="text-xs text-gray-500">
                  {preview.category} · {preview.author} · v{preview.version}
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    handleInstall(preview);
                    setPreview(null);
                  }}
                  className="px-4 py-2 text-sm bg-[#1B3A5C] text-white rounded-lg hover:bg-[#132D4A] transition"
                >
                  Install as New Page
                </button>
                <button onClick={() => setPreview(null)} className="p-2 text-gray-400 hover:text-gray-600">
                  ✕
                </button>
              </div>
            </div>

            <div className="p-6 space-y-4">
              {preview.description && (
                <p className="text-sm text-gray-600">{preview.description}</p>
              )}

              <div>
                <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                  Block Structure ({(preview.blocks as unknown[]).length} blocks)
                </h3>
                <div className="space-y-2">
                  {(preview.blocks as { id: string; type: string; order: number; data: Record<string, unknown> }[]).map(
                    (block, i) => (
                      <div
                        key={block.id || i}
                        className="flex items-center gap-3 px-3 py-2.5 bg-gray-50 rounded-lg"
                      >
                        <span className="text-xs font-mono text-gray-400 w-5">{i + 1}</span>
                        <span className="text-sm font-medium text-gray-700">
                          {BLOCK_TYPE_LABELS[block.type] || block.type}
                        </span>
                        {block.data &&
                          (block.data.headline || block.data.heading || block.data.text) ? (
                            <span className="text-xs text-gray-400 truncate flex-1">
                              {(block.data.headline as string) ||
                                (block.data.heading as string) ||
                                (block.data.text as string)?.replace(/<[^>]*>/g, "").slice(0, 60)}
                            </span>
                          ) : null}
                      </div>
                    )
                  )}
                </div>
              </div>

              {preview.tags.length > 0 && (
                <div>
                  <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                    Tags
                  </h3>
                  <div className="flex flex-wrap gap-1.5">
                    {preview.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="grid grid-cols-3 gap-4 pt-2">
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <p className="text-lg font-bold text-gray-900">{preview.downloads}</p>
                  <p className="text-[11px] text-gray-500">Installs</p>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <p className="text-lg font-bold text-gray-900">
                    {preview.rating > 0 ? `★ ${preview.rating.toFixed(1)}` : "—"}
                  </p>
                  <p className="text-[11px] text-gray-500">Rating ({preview.rating_count})</p>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <p className="text-lg font-bold text-gray-900">
                    {preview.is_premium ? `$${preview.price}` : "Free"}
                  </p>
                  <p className="text-[11px] text-gray-500">Price</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Create template modal */}
      {showCreate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40" onClick={() => setShowCreate(false)} />
          <div className="relative bg-white rounded-2xl shadow-xl max-w-lg w-full p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-bold text-lg text-gray-900">Create Template</h2>
              <button onClick={() => setShowCreate(false)} className="text-gray-400 hover:text-gray-600">
                ✕
              </button>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
              <input
                type="text"
                value={newName}
                onChange={(e) => {
                  setNewName(e.target.value);
                  if (!newSlug) {
                    // auto-generate slug from name
                  }
                }}
                placeholder="My Custom Template"
                className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-[#1B3A5C]/20 focus:border-[#1B3A5C] outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Slug</label>
              <input
                type="text"
                value={newSlug}
                onChange={(e) => setNewSlug(e.target.value)}
                placeholder="auto-generated-from-name"
                className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-[#1B3A5C]/20 focus:border-[#1B3A5C] outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <select
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value as TemplateCategory)}
                className="w-full px-3 py-2 border rounded-lg text-sm"
              >
                {TEMPLATE_CATEGORIES.map((c) => (
                  <option key={c.value} value={c.value}>
                    {c.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                value={newDescription}
                onChange={(e) => setNewDescription(e.target.value)}
                placeholder="A brief description of the template…"
                rows={2}
                className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-[#1B3A5C]/20 focus:border-[#1B3A5C] outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tags (comma-separated)</label>
              <input
                type="text"
                value={newTags}
                onChange={(e) => setNewTags(e.target.value)}
                placeholder="landing, hero, conversion"
                className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-[#1B3A5C]/20 focus:border-[#1B3A5C] outline-none"
              />
            </div>

            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={newPremium}
                  onChange={(e) => setNewPremium(e.target.checked)}
                  className="accent-[#1B3A5C]"
                />
                Premium template
              </label>
              {newPremium && (
                <div className="flex items-center gap-1">
                  <span className="text-sm text-gray-500">$</span>
                  <input
                    type="number"
                    value={newPrice}
                    onChange={(e) => setNewPrice(e.target.value)}
                    placeholder="29"
                    className="w-20 px-2 py-1 border rounded text-sm"
                  />
                </div>
              )}
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setShowCreate(false)}
                className="px-4 py-2 text-sm border rounded-lg hover:bg-gray-50 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleCreate}
                disabled={!newName.trim()}
                className="px-4 py-2 text-sm bg-[#1B3A5C] text-white rounded-lg hover:bg-[#132D4A] transition disabled:opacity-50"
              >
                Create Template
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
