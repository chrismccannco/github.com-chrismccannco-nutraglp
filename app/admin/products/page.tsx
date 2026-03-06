"use client";

import { useEffect, useState } from "react";
import RichTextEditor from "../components/RichTextEditor";

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
  const [editing, setEditing] = useState<string | null>(null);
  const [form, setForm] = useState<Partial<Product>>({});
  const [saving, setSaving] = useState(false);

  const load = () => {
    fetch("/api/products")
      .then((r) => r.json())
      .then((data) => setProducts(Array.isArray(data) ? data : []));
  };

  useEffect(() => {
    load();
  }, []);

  const startEdit = (p: Product) => {
    setEditing(p.slug);
    setForm(p);
  };

  const saveEdit = async (pub?: boolean) => {
    if (!editing) return;
    setSaving(true);
    const payload = { ...form };
    if (pub !== undefined) payload.published = pub ? 1 : 0;
    await fetch(`/api/products/${editing}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    setSaving(false);
    setEditing(null);
    load();
  };

  return (
    <div className="max-w-3xl">
      <h1 className="text-2xl font-semibold text-gray-900 mb-1">Products</h1>
      <p className="text-sm text-gray-500 mb-8">
        {products.length} products in pipeline
      </p>

      <div className="space-y-3">
        {products.map((p) =>
          editing === p.slug ? (
            <div
              key={p.slug}
              className="bg-white border border-emerald-300 rounded-xl p-5 space-y-3"
            >
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">
                    Name
                  </label>
                  <input
                    value={form.name || ""}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">
                    Status
                  </label>
                  <select
                    value={form.status || ""}
                    onChange={(e) =>
                      setForm({ ...form, status: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="available">Available</option>
                    <option value="coming-soon">Coming Soon</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">
                  Tagline
                </label>
                <input
                  value={form.tagline || ""}
                  onChange={(e) =>
                    setForm({ ...form, tagline: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">
                    Price
                  </label>
                  <input
                    value={form.price || ""}
                    onChange={(e) =>
                      setForm({ ...form, price: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">
                    Launch date
                  </label>
                  <input
                    value={form.launch_date || ""}
                    onChange={(e) =>
                      setForm({ ...form, launch_date: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">
                  Description
                </label>
                <RichTextEditor
                  content={form.description || ""}
                  onChange={(html) => setForm({ ...form, description: html })}
                />
              </div>
              <div className="flex items-center justify-between pt-2">
                <div className="flex gap-2">
                  <button
                    onClick={() => saveEdit(false)}
                    disabled={saving}
                    className="px-3 py-1.5 border border-gray-300 text-gray-700 text-xs rounded-lg hover:bg-gray-50 disabled:opacity-50"
                  >
                    Save draft
                  </button>
                  <button
                    onClick={() => saveEdit(true)}
                    disabled={saving}
                    className="px-3 py-1.5 bg-emerald-600 text-white text-xs rounded-lg disabled:opacity-50"
                  >
                    {saving ? "Saving..." : "Publish"}
                  </button>
                </div>
                <button
                  onClick={() => setEditing(null)}
                  className="px-3 py-1.5 text-gray-500 text-xs hover:text-gray-700"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div
              key={p.slug}
              className="bg-white border border-gray-200 rounded-xl px-5 py-4 flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <div>
                  <p className="text-sm font-medium text-gray-900">{p.name}</p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {p.tagline} · {p.price || "TBD"} ·{" "}
                    <span
                      className={
                        p.status === "available"
                          ? "text-emerald-600"
                          : "text-gray-400"
                      }
                    >
                      {p.status === "available"
                        ? "Available"
                        : `Coming ${p.launch_date}`}
                    </span>
                  </p>
                </div>
                <span
                  className={`px-2 py-0.5 text-[10px] font-medium rounded-full ${
                    p.published
                      ? "bg-emerald-100 text-emerald-800"
                      : "bg-amber-100 text-amber-800"
                  }`}
                >
                  {p.published ? "Live" : "Draft"}
                </span>
              </div>
              <button
                onClick={() => startEdit(p)}
                className="text-xs text-gray-500 hover:text-gray-700"
              >
                Edit
              </button>
            </div>
          )
        )}
      </div>
    </div>
  );
}
