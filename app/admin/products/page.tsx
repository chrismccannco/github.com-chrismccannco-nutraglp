"use client";

import { useEffect, useState } from "react";
import Breadcrumbs from "../components/Breadcrumbs";
import DataTable, { Column } from "../components/DataTable";
import StatusBadge from "../components/StatusBadge";
import RichTextEditor from "../components/RichTextEditor";
import FormSection from "../components/FormSection";
import { X } from "lucide-react";

interface Product {
  id: number;
  slug: string;
  name: string;
  tagline: string;
  price: string;
  description: string;
  status: string;
  launch_date: string;
  sort_order: number;
  published: number;
}

export default function ProductsAdmin() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Product | null>(null);
  const [form, setForm] = useState<Partial<Product>>({});
  const [saving, setSaving] = useState(false);

  const load = () => {
    fetch("/api/products")
      .then((r) => r.json())
      .then((data) => {
        setProducts(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  const startEdit = (p: Product) => {
    setEditing(p);
    setForm(p);
  };

  const saveEdit = async (pub?: boolean) => {
    if (!editing) return;
    setSaving(true);
    const payload = { ...form };
    if (pub !== undefined) payload.published = pub ? 1 : 0;
    await fetch(`/api/products/${editing.slug}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    setSaving(false);
    setEditing(null);
    load();
  };

  const columns: Column<Product>[] = [
    {
      key: "name",
      label: "Product",
      sortable: true,
      render: (row) => (
        <div>
          <p className="font-medium text-neutral-900">{row.name}</p>
          <p className="text-xs text-neutral-400 mt-0.5">{row.tagline}</p>
        </div>
      ),
    },
    {
      key: "price",
      label: "Price",
      render: (row) => (
        <span className="text-xs text-neutral-600">{row.price || "TBD"}</span>
      ),
      className: "w-24",
    },
    {
      key: "status",
      label: "Availability",
      render: (row) => (
        <span
          className={`text-xs ${
            row.status === "available"
              ? "text-indigo-600"
              : "text-neutral-400"
          }`}
        >
          {row.status === "available" ? "Available" : `Coming ${row.launch_date}`}
        </span>
      ),
      className: "w-36",
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
    return <p className="text-sm text-neutral-400 p-4">Loading products\u2026</p>;

  return (
    <div>
      <Breadcrumbs
        items={[{ label: "Admin", href: "/admin" }, { label: "Products" }]}
      />
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-semibold text-neutral-900">Products</h1>
          <p className="text-xs text-neutral-400 mt-1">
            {products.length} product{products.length !== 1 ? "s" : ""} in pipeline
          </p>
        </div>
      </div>

      <DataTable
        data={products}
        columns={columns}
        searchKeys={["name", "tagline", "slug"]}
        onRowClick={startEdit}
        actions={[{ label: "Edit", onClick: startEdit }]}
        emptyMessage="No products found."
      />

      {/* Edit modal */}
      {editing && (
        <div className="fixed inset-0 bg-black/40 flex items-start justify-center z-50 pt-20 px-4">
          <div className="bg-neutral-50 rounded-xl shadow-xl w-full max-w-2xl max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-200 bg-white rounded-t-xl sticky top-0 z-10">
              <h2 className="text-sm font-semibold text-neutral-900">
                Edit: {editing.name}
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
                      className="w-full px-3 py-2 border border-neutral-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-neutral-500 mb-1">
                      Status
                    </label>
                    <select
                      value={form.status || ""}
                      onChange={(e) => setForm({ ...form, status: e.target.value })}
                      className="w-full px-3 py-2 border border-neutral-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      <option value="available">Available</option>
                      <option value="coming-soon">Coming Soon</option>
                    </select>
                  </div>
                </div>
                <div className="mb-4">
                  <label className="block text-xs font-medium text-neutral-500 mb-1">
                    Tagline
                  </label>
                  <input
                    value={form.tagline || ""}
                    onChange={(e) => setForm({ ...form, tagline: e.target.value })}
                    className="w-full px-3 py-2 border border-neutral-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-neutral-500 mb-1">
                      Price
                    </label>
                    <input
                      value={form.price || ""}
                      onChange={(e) => setForm({ ...form, price: e.target.value })}
                      className="w-full px-3 py-2 border border-neutral-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-neutral-500 mb-1">
                      Launch date
                    </label>
                    <input
                      value={form.launch_date || ""}
                      onChange={(e) => setForm({ ...form, launch_date: e.target.value })}
                      className="w-full px-3 py-2 border border-neutral-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                </div>
              </FormSection>
              <FormSection title="Description">
                <RichTextEditor
                  content={form.description || ""}
                  onChange={(html) => setForm({ ...form, description: html })}
                />
              </FormSection>
            </div>
            <div className="flex items-center justify-end gap-2 px-6 py-4 border-t border-neutral-200 bg-white rounded-b-xl sticky bottom-0">
              <button
                onClick={() => setEditing(null)}
                className="px-4 py-2 text-sm text-neutral-600 hover:text-neutral-800 transition"
              >
                Cancel
              </button>
              <button
                onClick={() => saveEdit(false)}
                disabled={saving}
                className="px-4 py-2 text-sm border border-neutral-300 rounded-lg hover:bg-neutral-50 transition disabled:opacity-50"
              >
                Save draft
              </button>
              <button
                onClick={() => saveEdit(true)}
                disabled={saving}
                className="px-4 py-2 bg-indigo-600 text-white text-sm rounded-lg hover:bg-indigo-700 transition disabled:opacity-50"
              >
                {saving ? "Saving\u2026" : "Publish"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
