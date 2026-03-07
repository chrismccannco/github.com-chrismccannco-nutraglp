"use client";

import { useEffect, useState } from "react";
import Breadcrumbs from "../components/Breadcrumbs";
import DataTable, { Column } from "../components/DataTable";
import StatusBadge from "../components/StatusBadge";
import FormSection from "../components/FormSection";
import { X, Plus, Star } from "lucide-react";

interface Testimonial {
  id: number;
  name: string;
  title: string | null;
  quote: string;
  rating: number;
  avatar_url: string | null;
  featured: number;
  sort_order: number;
  published: number;
  created_at: string;
}

const emptyForm: Partial<Testimonial> = {
  name: "",
  title: "",
  quote: "",
  rating: 5,
  avatar_url: "",
  featured: 0,
  sort_order: 0,
  published: 1,
};

export default function TestimonialsAdmin() {
  const [items, setItems] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Testimonial | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [form, setForm] = useState<Partial<Testimonial>>(emptyForm);
  const [saving, setSaving] = useState(false);

  const load = () => {
    fetch("/api/testimonials")
      .then((r) => r.json())
      .then((data) => {
        setItems(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  const startEdit = (t: Testimonial) => {
    setIsNew(false);
    setEditing(t);
    setForm(t);
  };

  const startNew = () => {
    setIsNew(true);
    setEditing({ id: 0 } as Testimonial);
    setForm(emptyForm);
  };

  const saveEdit = async () => {
    setSaving(true);
    if (isNew) {
      await fetch("/api/testimonials", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
    } else if (editing) {
      await fetch("/api/testimonials", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, id: editing.id }),
      });
    }
    setSaving(false);
    setEditing(null);
    load();
  };

  const handleDelete = async () => {
    if (!editing || isNew) return;
    if (!confirm("Delete this testimonial?")) return;
    await fetch("/api/testimonials", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: editing.id }),
    });
    setEditing(null);
    load();
  };

  const renderStars = (rating: number) => (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          className={`w-3 h-3 ${i <= rating ? "fill-amber-400 text-amber-400" : "text-neutral-300"}`}
        />
      ))}
    </div>
  );

  const columns: Column<Testimonial>[] = [
    {
      key: "name",
      label: "Customer",
      sortable: true,
      render: (row) => (
        <div className="flex items-center gap-3">
          {row.avatar_url ? (
            <img src={row.avatar_url} alt="" className="w-8 h-8 rounded-full object-cover" />
          ) : (
            <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-xs font-semibold text-emerald-700">
              {row.name.charAt(0).toUpperCase()}
            </div>
          )}
          <div>
            <p className="font-medium text-neutral-900 text-sm">{row.name}</p>
            <p className="text-xs text-neutral-400 mt-0.5 truncate max-w-[200px]">{row.title}</p>
          </div>
        </div>
      ),
    },
    {
      key: "quote",
      label: "Quote",
      render: (row) => (
        <p className="text-xs text-neutral-600 truncate max-w-[240px]">{row.quote}</p>
      ),
    },
    {
      key: "rating",
      label: "Rating",
      render: (row) => renderStars(row.rating),
      className: "w-28",
    },
    {
      key: "featured",
      label: "Featured",
      render: (row) =>
        row.featured ? (
          <span className="inline-flex items-center gap-1 text-[10px] font-medium text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full">
            <Star className="w-2.5 h-2.5 fill-amber-500" /> Featured
          </span>
        ) : null,
      className: "w-24",
    },
    {
      key: "published",
      label: "Status",
      render: (row) => (
        <StatusBadge status={row.published ? "published" : "draft"} />
      ),
      className: "w-28",
    },
  ];

  if (loading)
    return <p className="text-sm text-neutral-400 p-4">Loading testimonials…</p>;

  return (
    <div>
      <Breadcrumbs
        items={[{ label: "Admin", href: "/admin" }, { label: "Testimonials" }]}
      />
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-semibold text-neutral-900">Testimonials</h1>
          <p className="text-xs text-neutral-400 mt-1">
            {items.length} testimonial{items.length !== 1 ? "s" : ""}
          </p>
        </div>
        <button
          onClick={startNew}
          className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white text-sm rounded-lg hover:bg-emerald-700 transition"
        >
          <Plus className="w-4 h-4" /> Add
        </button>
      </div>

      <DataTable
        data={items}
        columns={columns}
        searchKeys={["name", "title", "quote"]}
        onRowClick={startEdit}
        actions={[{ label: "Edit", onClick: startEdit }]}
        emptyMessage="No testimonials yet."
      />

      {/* Edit / New modal */}
      {editing && (
        <div className="fixed inset-0 bg-black/40 flex items-start justify-center z-50 pt-20 px-4">
          <div className="bg-neutral-50 rounded-xl shadow-xl w-full max-w-2xl max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-200 bg-white rounded-t-xl sticky top-0 z-10">
              <h2 className="text-sm font-semibold text-neutral-900">
                {isNew ? "New testimonial" : `Edit: ${editing.name}`}
              </h2>
              <button
                onClick={() => setEditing(null)}
                className="p-1 text-neutral-400 hover:text-neutral-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <FormSection title="Details">
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-xs font-medium text-neutral-500 mb-1">
                      Name
                    </label>
                    <input
                      value={form.name || ""}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      className="w-full px-3 py-2 border border-neutral-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-neutral-500 mb-1">
                      Title / headline
                    </label>
                    <input
                      value={form.title || ""}
                      onChange={(e) => setForm({ ...form, title: e.target.value })}
                      placeholder="e.g. Lost 30 lbs in 3 months"
                      className="w-full px-3 py-2 border border-neutral-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                </div>
                <div className="mb-4">
                  <label className="block text-xs font-medium text-neutral-500 mb-1">
                    Quote
                  </label>
                  <textarea
                    value={form.quote || ""}
                    onChange={(e) => setForm({ ...form, quote: e.target.value })}
                    rows={3}
                    className="w-full px-3 py-2 border border-neutral-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-neutral-500 mb-1">
                      Rating
                    </label>
                    <select
                      value={form.rating ?? 5}
                      onChange={(e) => setForm({ ...form, rating: parseInt(e.target.value) })}
                      className="w-full px-3 py-2 border border-neutral-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    >
                      {[5, 4, 3, 2, 1].map((n) => (
                        <option key={n} value={n}>
                          {n} star{n !== 1 ? "s" : ""}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-neutral-500 mb-1">
                      Avatar URL
                    </label>
                    <input
                      value={form.avatar_url || ""}
                      onChange={(e) => setForm({ ...form, avatar_url: e.target.value })}
                      placeholder="https://..."
                      className="w-full px-3 py-2 border border-neutral-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                </div>
              </FormSection>
              <FormSection title="Settings">
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-neutral-500 mb-1">
                      Sort order
                    </label>
                    <input
                      type="number"
                      value={form.sort_order ?? 0}
                      onChange={(e) => setForm({ ...form, sort_order: parseInt(e.target.value) || 0 })}
                      className="w-full px-3 py-2 border border-neutral-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                  <div className="flex items-center gap-2 pt-5">
                    <input
                      type="checkbox"
                      checked={!!form.featured}
                      onChange={(e) => setForm({ ...form, featured: e.target.checked ? 1 : 0 })}
                      className="rounded border-neutral-300 text-emerald-600 focus:ring-emerald-500"
                    />
                    <label className="text-xs text-neutral-600">Featured</label>
                  </div>
                  <div className="flex items-center gap-2 pt-5">
                    <input
                      type="checkbox"
                      checked={!!form.published}
                      onChange={(e) => setForm({ ...form, published: e.target.checked ? 1 : 0 })}
                      className="rounded border-neutral-300 text-emerald-600 focus:ring-emerald-500"
                    />
                    <label className="text-xs text-neutral-600">Published</label>
                  </div>
                </div>
              </FormSection>
            </div>
            <div className="flex items-center justify-between px-6 py-4 border-t border-neutral-200 bg-white rounded-b-xl sticky bottom-0">
              <div>
                {!isNew && (
                  <button
                    onClick={handleDelete}
                    className="px-3 py-2 text-xs text-red-600 hover:text-red-700 transition"
                  >
                    Delete
                  </button>
                )}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setEditing(null)}
                  className="px-4 py-2 text-sm text-neutral-600 hover:text-neutral-800 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={saveEdit}
                  disabled={saving || !form.name || !form.quote}
                  className="px-4 py-2 bg-emerald-600 text-white text-sm rounded-lg hover:bg-emerald-700 transition disabled:opacity-50"
                >
                  {saving ? "Saving…" : isNew ? "Create" : "Save"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
