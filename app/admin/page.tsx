"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  FileText,
  BookOpen,
  HelpCircle,
  Package,
  Plus,
  Settings,
  ArrowRight,
  Star,
  BarChart3,
} from "lucide-react";

interface Stats {
  pages: number;
  posts: number;
  faqs: number;
  products: number;
  testimonials: number;
  views7d: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    async function load() {
      const [blogRes, faqRes, prodRes, testRes, analyticsRes] = await Promise.all([
        fetch("/api/blog"),
        fetch("/api/faqs"),
        fetch("/api/products"),
        fetch("/api/testimonials"),
        fetch("/api/analytics?days=7"),
      ]);
      const blog = await blogRes.json();
      const faqs = await faqRes.json();
      const products = await prodRes.json();
      const testimonials = await testRes.json();
      const analytics = await analyticsRes.json();
      setStats({
        pages: 8,
        posts: Array.isArray(blog) ? blog.length : 0,
        faqs: Array.isArray(faqs) ? faqs.length : 0,
        products: Array.isArray(products) ? products.length : 0,
        testimonials: Array.isArray(testimonials) ? testimonials.length : 0,
        views7d: analytics?.total ?? 0,
      });
    }
    load();
  }, []);

  const cards = [
    {
      label: "Pages",
      count: stats?.pages ?? "\u2014",
      href: "/admin/pages",
      icon: FileText,
      accent: "text-emerald-600",
      bg: "bg-emerald-50",
    },
    {
      label: "Blog Posts",
      count: stats?.posts ?? "\u2014",
      href: "/admin/blog",
      icon: BookOpen,
      accent: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      label: "FAQs",
      count: stats?.faqs ?? "\u2014",
      href: "/admin/faq",
      icon: HelpCircle,
      accent: "text-amber-600",
      bg: "bg-amber-50",
    },
    {
      label: "Products",
      count: stats?.products ?? "\u2014",
      href: "/admin/products",
      icon: Package,
      accent: "text-purple-600",
      bg: "bg-purple-50",
    },
    {
      label: "Testimonials",
      count: stats?.testimonials ?? "\u2014",
      href: "/admin/testimonials",
      icon: Star,
      accent: "text-orange-600",
      bg: "bg-orange-50",
    },
    {
      label: "Views (7d)",
      count: stats?.views7d ?? "\u2014",
      href: "/admin/analytics",
      icon: BarChart3,
      accent: "text-cyan-600",
      bg: "bg-cyan-50",
    },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-xl font-semibold text-neutral-900">Dashboard</h1>
        <p className="text-xs text-neutral-400 mt-1">
          NutraGLP content management
        </p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
        {cards.map((c) => {
          const Icon = c.icon;
          return (
            <Link
              key={c.label}
              href={c.href}
              className="bg-white border border-neutral-200 rounded-lg shadow-sm p-5 no-underline hover:shadow-md transition group"
            >
              <div className="flex items-center justify-between mb-3">
                <div className={`${c.bg} p-2 rounded-lg`}>
                  <Icon className={`w-4 h-4 ${c.accent}`} />
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-neutral-300 group-hover:text-neutral-500 transition" />
              </div>
              <p className="text-2xl font-bold text-neutral-900">{c.count}</p>
              <p className="text-xs text-neutral-500 mt-0.5">{c.label}</p>
            </Link>
          );
        })}
      </div>

      <div className="bg-white border border-neutral-200 rounded-lg shadow-sm p-6">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-4">
          Quick actions
        </h2>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/admin/blog/new"
            className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 text-white text-sm rounded-lg no-underline hover:bg-emerald-700 transition"
          >
            <Plus className="w-3.5 h-3.5" />
            New blog post
          </Link>
          <Link
            href="/admin/pages"
            className="px-4 py-2 bg-neutral-100 text-neutral-700 text-sm rounded-lg no-underline hover:bg-neutral-200 transition"
          >
            Edit pages
          </Link>
          <Link
            href="/admin/settings"
            className="flex items-center gap-1.5 px-4 py-2 bg-neutral-100 text-neutral-700 text-sm rounded-lg no-underline hover:bg-neutral-200 transition"
          >
            <Settings className="w-3.5 h-3.5" />
            Site settings
          </Link>
        </div>
      </div>
    </div>
  );
}
