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

  if (loading)
    return <p className="text-sm text-neutral-400 p-4">Loading pages\u2026</p>;

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
      </div>
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
        emptyMessage="No pages found. Pages are created via seed data or the API."
      />
    </div>
  );
}
