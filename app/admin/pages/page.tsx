"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import DataTable, { Column } from "../components/DataTable";
import StatusBadge from "../components/StatusBadge";
import Breadcrumbs from "../components/Breadcrumbs";

interface PageRow {
  id: number;
  slug: string;
  title: string;
  meta_description: string | null;
  published: number;
  updated_at: string;
  brand_score: number | null;
  [key: string]: unknown;
}

const columns: Column<PageRow>[] = [
  {
    key: "title",
    label: "Title",
    sortable: true,
    render: (row) => (
      <div>
        <p className="font-medium text-neutral-900">{row.title}</p>
        <p className="text-xs text-neutral-400 mt-0.5">
          /{row.slug === "home" ? "" : row.slug}
        </p>
      </div>
    ),
  },
  {
    key: "published",
    label: "Status",
    render: (row) => (
      <StatusBadge status={row.published ? "published" : "draft"} />
    ),
    className: "w-28",
  },
  {
    key: "brand_score",
    label: "Score",
    sortable: true,
    render: (row: PageRow) => {
      if (row.brand_score == null) return <span className="text-[11px] text-neutral-300">—</span>;
      const s = row.brand_score;
      const color = s >= 80 ? "bg-indigo-100 text-indigo-700" : s >= 60 ? "bg-amber-100 text-amber-700" : "bg-red-100 text-red-700";
      return (
        <span className={`inline-flex items-center px-2 py-0.5 text-[11px] font-semibold rounded-full ${color}`}>
          {s}
        </span>
      );
    },
    className: "w-20",
  },
  {
    key: "updated_at",
    label: "Updated",
    sortable: true,
    render: (row) => (
      <span className="text-xs text-neutral-500">
        {row.updated_at
          ? new Date(row.updated_at).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })
          : "\u2014"}
      </span>
    ),
    className: "w-32",
  },
];

export default function PagesAdmin() {
  const [pages, setPages] = useState<PageRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [showNew, setShowNew] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newSlug, setNewSlug] = useState("");
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState("");
  const router = useRouter();

  useEffect(() => {
    fetch("/api/pages")
      .then((r) => r.json())
      .then((data) => {
        setPages(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleTitleChange = (val: string) => {
    setNewTitle(val);
    // Auto-generate slug from title
    setNewSlug(
      val
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-")
        .replace(/^-|-$/g, "")
    );
  };

  const handleCreate = async () => {
    if (!newTitle.trim() || !newSlug.trim()) return;
    setCreating(true);
    setCreateError("");
    try {
      const res = await fetch("/api/pages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: newTitle.trim(), slug: newSlug.trim() }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to create page");
      router.push(`/admin/pages/${data.slug}`);
    } catch (e: unknown) {
      setCreateError(e instanceof Error ? e.message : String(e));
      setCreating(false);
    }
  };

  if (loading)
    return <p className="text-sm text-neutral-400 p-4">Loading pages&hellip;</p>;

  return (
    <div>
      <Breadcrumbs items={[{ label: "Admin", href: "/admin" }, { label: "Pages" }]} />
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-semibold text-neutral-900">Pages</h1>
          <p className="text-xs text-neutral-400 mt-1">
            {pages.length} page{pages.length !== 1 ? "s" : ""}
          </p>
        </div>
        <button
          onClick={() => { setShowNew(true); setNewTitle(""); setNewSlug(""); setCreateError(""); }}
          className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors"
        >
          + New Page
        </button>
      </div>

      {/* Create Page Modal */}
      {showNew && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md mx-4 p-6">
            <h2 className="text-lg font-semibold text-neutral-900 mb-4">New Page</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-neutral-500 mb-1">Page Title</label>
                <input
                  value={newTitle}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  placeholder="e.g. About Us"
                  autoFocus
                  className="w-full px-3 py-2 border border-neutral-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  onKeyDown={(e) => e.key === "Enter" && handleCreate()}
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-neutral-500 mb-1">URL Slug</label>
                <div className="flex items-center gap-1">
                  <span className="text-sm text-neutral-400">/</span>
                  <input
                    value={newSlug}
                    onChange={(e) => setNewSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "-"))}
                    placeholder="about-us"
                    className="w-full px-3 py-2 border border-neutral-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    onKeyDown={(e) => e.key === "Enter" && handleCreate()}
                  />
                </div>
              </div>
              {createError && (
                <p className="text-red-600 text-xs">{createError}</p>
              )}
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setShowNew(false)}
                className="px-4 py-2 text-sm text-neutral-600 hover:text-neutral-900"
              >
                Cancel
              </button>
              <button
                onClick={handleCreate}
                disabled={creating || !newTitle.trim() || !newSlug.trim()}
                className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50"
              >
                {creating ? "Creating\u2026" : "Create Page"}
              </button>
            </div>
          </div>
        </div>
      )}

      <DataTable
        data={pages}
        columns={columns}
        searchKeys={["title", "slug"]}
        onRowClick={(row) => router.push(`/admin/pages/${row.slug}`)}
        actions={[
          {
            label: "Edit",
            onClick: (row) => router.push(`/admin/pages/${row.slug}`),
          },
        ]}
        emptyMessage="No pages yet. Click '+ New Page' to create your first page."
      />
    </div>
  );
}
