"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface Stats {
  pages: number;
  posts: number;
  faqs: number;
  products: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    async function load() {
      const [blogRes, faqRes, prodRes] = await Promise.all([
        fetch("/api/blog"),
        fetch("/api/faqs"),
        fetch("/api/products"),
      ]);
      const blog = await blogRes.json();
      const faqs = await faqRes.json();
      const products = await prodRes.json();
      setStats({
        pages: 8,
        posts: Array.isArray(blog) ? blog.length : 0,
        faqs: Array.isArray(faqs) ? faqs.length : 0,
        products: Array.isArray(products) ? products.length : 0,
      });
    }
    load();
  }, []);

  const cards = [
    { label: "Pages", count: stats?.pages ?? "—", href: "/admin/pages", color: "bg-emerald-50 text-emerald-700" },
    { label: "Blog Posts", count: stats?.posts ?? "—", href: "/admin/blog", color: "bg-blue-50 text-blue-700" },
    { label: "FAQs", count: stats?.faqs ?? "—", href: "/admin/faq", color: "bg-amber-50 text-amber-700" },
    { label: "Products", count: stats?.products ?? "—", href: "/admin/products", color: "bg-purple-50 text-purple-700" },
  ];

  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-900 mb-1">Dashboard</h1>
      <p className="text-sm text-gray-500 mb-8">NutraGLP content management</p>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        {cards.map((c) => (
          <Link
            key={c.label}
            href={c.href}
            className={`${c.color} rounded-xl p-5 no-underline hover:shadow-sm transition`}
          >
            <p className="text-3xl font-bold">{c.count}</p>
            <p className="text-sm font-medium mt-1">{c.label}</p>
          </Link>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-3">Quick actions</h2>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/admin/blog/new"
            className="px-4 py-2 bg-[#0f2d20] text-white text-sm rounded-lg no-underline hover:bg-[#1a4a33] transition"
          >
            New blog post
          </Link>
          <Link
            href="/admin/pages"
            className="px-4 py-2 bg-gray-100 text-gray-700 text-sm rounded-lg no-underline hover:bg-gray-200 transition"
          >
            Edit pages
          </Link>
          <Link
            href="/admin/settings"
            className="px-4 py-2 bg-gray-100 text-gray-700 text-sm rounded-lg no-underline hover:bg-gray-200 transition"
          >
            Site settings
          </Link>
        </div>
      </div>
    </div>
  );
}
