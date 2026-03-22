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
  Wand2,
  RefreshCw,
  Palette,
  X,
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
  const [showGuide, setShowGuide] = useState(true);
  const [hasApiKey, setHasApiKey] = useState<boolean | null>(null);

  useEffect(() => {
    const dismissed = localStorage.getItem("cs_guide_dismissed");
    if (dismissed) setShowGuide(false);
  }, []);

  useEffect(() => {
    fetch("/api/settings")
      .then((r) => r.json())
      .then((d) => {
        setHasApiKey(!!(d.anthropic_api_key || d.openai_api_key));
      })
      .catch(() => setHasApiKey(null));
  }, []);

  const dismissGuide = () => {
    setShowGuide(false);
    localStorage.setItem("cs_guide_dismissed", "1");
  };

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
      accent: "text-teal-600",
      bg: "bg-teal-50",
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
          Content management dashboard
        </p>
      </div>

      {hasApiKey === false && (
        <Link
          href="/admin/settings"
          className="flex items-center gap-3 bg-amber-50 border border-amber-200 rounded-xl px-5 py-3.5 mb-6 no-underline hover:bg-amber-100 transition group"
        >
          <Settings className="w-4 h-4 text-amber-600 flex-shrink-0" />
          <div className="flex-1">
            <p className="text-sm font-medium text-amber-900">Connect your AI key to start generating</p>
            <p className="text-xs text-amber-700 mt-0.5">Add your Anthropic or OpenAI key in Settings → AI Integration. Takes 30 seconds.</p>
          </div>
          <ArrowRight className="w-4 h-4 text-amber-500 group-hover:translate-x-0.5 transition-transform" />
        </Link>
      )}

      {showGuide && (
        <div className="relative bg-gradient-to-br from-teal-50 to-violet-50 border border-teal-200 rounded-xl p-6 mb-8">
          <button
            onClick={dismissGuide}
            className="absolute top-3 right-3 p-1 text-neutral-400 hover:text-neutral-600 transition"
          >
            <X className="w-4 h-4" />
          </button>
          <h2 className="text-sm font-semibold text-neutral-900 mb-1">Welcome to ContentFoundry™</h2>
          <p className="text-xs text-neutral-500 mb-4">Try these to see what the platform can do.</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <Link
              href="/admin/blog/new"
              className="flex items-start gap-3 bg-white/80 rounded-lg p-4 no-underline hover:bg-white transition group"
            >
              <div className="w-8 h-8 rounded-lg bg-violet-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                <Wand2 className="w-4 h-4 text-violet-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-neutral-900 group-hover:text-teal-700 transition">Write a blog post with AI</p>
                <p className="text-[11px] text-neutral-500 mt-0.5">Type a topic, hit Draft. The AI writes the whole post.</p>
              </div>
            </Link>
            <Link
              href="/admin/repurpose"
              className="flex items-start gap-3 bg-white/80 rounded-lg p-4 no-underline hover:bg-white transition group"
            >
              <div className="w-8 h-8 rounded-lg bg-teal-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                <RefreshCw className="w-4 h-4 text-teal-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-neutral-900 group-hover:text-teal-700 transition">Repurpose into 25+ formats</p>
                <p className="text-[11px] text-neutral-500 mt-0.5">Turn a blog post into tweets, LinkedIn, email, and more.</p>
              </div>
            </Link>
            <Link
              href="/admin/brand"
              className="flex items-start gap-3 bg-white/80 rounded-lg p-4 no-underline hover:bg-white transition group"
            >
              <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                <Palette className="w-4 h-4 text-amber-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-neutral-900 group-hover:text-teal-700 transition">Set your brand voice</p>
                <p className="text-[11px] text-neutral-500 mt-0.5">Define tone, audience, and style. AI follows your guidelines.</p>
              </div>
            </Link>
          </div>
        </div>
      )}

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
            className="flex items-center gap-1.5 px-4 py-2 bg-teal-600 text-white text-sm rounded-lg no-underline hover:bg-teal-700 transition"
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
