"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface PageRow {
  id: number;
  slug: string;
  title: string;
  meta_description: string | null;
  published: number;
  updated_at: string;
}

export default function PagesAdmin() {
  const [pages, setPages] = useState<PageRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/pages")
      .then((r) => r.json())
      .then((data) => {
        setPages(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return <p className="text-sm text-gray-500 p-4">Loading pages...</p>;

  return (
    <div className="max-w-3xl">
      <h1 className="text-2xl font-semibold text-gray-900 mb-1">Pages</h1>
      <p className="text-sm text-gray-500 mb-8">
        {pages.length} page{pages.length !== 1 ? "s" : ""} in database
      </p>

      {pages.length === 0 && (
        <p className="text-sm text-gray-400">No pages found. Pages are created via seed data or the API.</p>
      )}

      <div className="space-y-2">
        {pages.map((p) => (
          <Link
            key={p.slug}
            href={`/admin/pages/${p.slug}`}
            className="flex items-center justify-between bg-white border border-gray-200 rounded-lg px-5 py-4 no-underline hover:border-gray-300 hover:shadow-sm transition"
          >
            <div className="flex items-center gap-3">
              <div>
                <p className="text-sm font-medium text-gray-900">{p.title}</p>
                <p className="text-xs text-gray-500 mt-0.5">
                  /{p.slug === "home" ? "" : p.slug}
                  {p.meta_description ? ` — ${p.meta_description.slice(0, 60)}...` : ""}
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
            <span className="text-xs text-gray-400">Edit &rarr;</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
