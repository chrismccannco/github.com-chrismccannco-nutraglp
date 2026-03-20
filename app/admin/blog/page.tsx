"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import DataTable, { Column } from "../components/DataTable";
import StatusBadge from "../components/StatusBadge";
import Breadcrumbs from "../components/Breadcrumbs";
import { Plus } from "lucide-react";

interface Post {
  [key: string]: unknown;
  id: number;
  slug: string;
  title: string;
  date: string;
  tag: string;
  published: number;
  publish_at: string | null;
  brand_score: number | null;
  voice_score: number | null;
  clarity_score: number | null;
}

export default function BlogAdmin() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetch("/api/blog")
      .then((r) => r.json())
      .then((data) => {
        setPosts(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleDelete = async (post: Post) => {
    if (!confirm(`Delete "${post.title}"?`)) return;
    await fetch(`/api/blog/${post.slug}`, { method: "DELETE" });
    setPosts((prev) => prev.filter((p) => p.slug !== post.slug));
  };

  const columns: Column<Post>[] = [
    {
      key: "title",
      label: "Title",
      sortable: true,
      render: (row) => (
        <div>
          <p className="font-medium text-neutral-900">{row.title}</p>
          <p className="text-xs text-neutral-400 mt-0.5">/{row.slug}</p>
        </div>
      ),
    },
    {
      key: "tag",
      label: "Tag",
      render: (row) => (
        <span className="text-xs text-neutral-500">{row.tag || "\u2014"}</span>
      ),
      className: "w-32",
    },
    {
      key: "published",
      label: "Status",
      render: (row) => {
        const isScheduled = row.publish_at && new Date(row.publish_at) > new Date();
        return isScheduled
          ? <span className="inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium rounded-full bg-blue-50 text-blue-700"><span className="w-1.5 h-1.5 rounded-full bg-blue-500" />Scheduled</span>
          : <StatusBadge status={row.published ? "published" : "draft"} />;
      },
      className: "w-28",
    },
    {
      key: "brand_score",
      label: "Score",
      sortable: true,
      render: (row) => {
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
      key: "date",
      label: "Date",
      sortable: true,
      render: (row) => (
        <span className="text-xs text-neutral-500">{row.date || "\u2014"}</span>
      ),
      className: "w-32",
    },
  ];

  if (loading)
    return <p className="text-sm text-neutral-400 p-4">Loading posts\u2026</p>;

  return (
    <div>
      <Breadcrumbs items={[{ label: "Admin", href: "/admin" }, { label: "Blog" }]} />
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-semibold text-neutral-900">Blog Posts</h1>
          <p className="text-xs text-neutral-400 mt-1">
            {posts.length} article{posts.length !== 1 ? "s" : ""}
          </p>
        </div>
        <Link
          href="/admin/blog/new"
          className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 text-white text-sm rounded-lg no-underline hover:bg-indigo-700 transition"
        >
          <Plus className="w-4 h-4" />
          New post
        </Link>
      </div>
      <DataTable
        data={posts}
        columns={columns}
        searchKeys={["title", "slug", "tag"]}
        onRowClick={(row) => router.push(`/admin/blog/${row.slug}`)}
        actions={[
          {
            label: "Edit",
            onClick: (row) => router.push(`/admin/blog/${row.slug}`),
          },
          {
            label: "Delete",
            onClick: handleDelete,
            destructive: true,
          },
        ]}
        emptyMessage="No blog posts yet."
      />
    </div>
  );
}
