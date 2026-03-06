"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface Post {
  id: number;
  slug: string;
  title: string;
  date: string;
  tag: string;
  published: number;
}

export default function BlogAdmin() {
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    fetch("/api/blog")
      .then((r) => r.json())
      .then((data) => setPosts(Array.isArray(data) ? data : []));
  }, []);

  const handleDelete = async (slug: string) => {
    if (!confirm(`Delete "${slug}"?`)) return;
    await fetch(`/api/blog/${slug}`, { method: "DELETE" });
    setPosts((prev) => prev.filter((p) => p.slug !== slug));
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 mb-1">Blog Posts</h1>
          <p className="text-sm text-gray-500">{posts.length} articles</p>
        </div>
        <Link
          href="/admin/blog/new"
          className="px-4 py-2 bg-[#0f2d20] text-white text-sm rounded-lg no-underline hover:bg-[#1a4a33] transition"
        >
          New post
        </Link>
      </div>

      <div className="space-y-2">
        {posts.map((post) => (
          <div
            key={post.slug}
            className="flex items-center justify-between bg-white border border-gray-200 rounded-lg px-5 py-4"
          >
            <Link href={`/admin/blog/${post.slug}`} className="no-underline flex-1">
              <p className="text-sm font-medium text-gray-900">{post.title}</p>
              <p className="text-xs text-gray-500 mt-0.5">
                {post.date} · {post.tag}
                {!post.published && (
                  <span className="ml-2 text-amber-600 font-medium">Draft</span>
                )}
              </p>
            </Link>
            <button
              onClick={() => handleDelete(post.slug)}
              className="text-xs text-red-500 hover:text-red-700 ml-4"
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
