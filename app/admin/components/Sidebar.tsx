"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  LayoutDashboard,
  FileText,
  BookOpen,
  HelpCircle,
  Package,
  Image,
  Settings,
  ExternalLink,
  X,
  Star,
  BarChart3,
  Inbox,
  Users,
  ClipboardCheck,
  Key,
  FileCode2,
  Gauge,
  FormInput,
  Languages,
  Globe,
  LayoutTemplate,
  BookMarked,
  Palette,
  LibraryBig,
  Wand2,
  UserCircle,
  RefreshCw,
  Video,
  Cpu,
  Webhook,
  ChevronDown,
} from "lucide-react";
import { useAuth } from "../layout";
import { useCmsBranding } from "../hooks/useCmsBranding";

interface NavItem {
  label: string;
  href: string;
  icon: typeof LayoutDashboard;
  adminOnly?: boolean;
}

const navGroups: { label: string; items: NavItem[]; collapsible?: boolean }[] = [
  {
    label: "Content",
    items: [
      { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
      { label: "Pages", href: "/admin/pages", icon: FileText },
      { label: "Blog", href: "/admin/blog", icon: BookOpen },
      { label: "Products", href: "/admin/products", icon: Package },
      { label: "Testimonials", href: "/admin/testimonials", icon: Star },
      { label: "Reviews", href: "/admin/reviews", icon: ClipboardCheck },
      { label: "FAQ", href: "/admin/faq", icon: HelpCircle },
    ],
  },
  {
    label: "Media & Forms",
    items: [
      { label: "Media", href: "/admin/media", icon: Image },
      { label: "Form Builder", href: "/admin/form-builder", icon: FormInput },
      { label: "Submissions", href: "/admin/submissions", icon: Inbox },
    ],
  },
  {
    label: "AI & Creation",
    items: [
      { label: "AI Templates", href: "/admin/ai-templates", icon: Wand2 },
      { label: "Repurpose", href: "/admin/repurpose", icon: RefreshCw },
      { label: "Video Studio", href: "/admin/video-studio", icon: Video },
    ],
  },
  {
    label: "Brand & Voice",
    items: [
      { label: "Brand Hub", href: "/admin/brand", icon: Palette },
      { label: "Knowledge Base", href: "/admin/knowledge", icon: LibraryBig },
      { label: "Personas", href: "/admin/personas", icon: UserCircle },
      { label: "Templates", href: "/admin/templates", icon: LayoutTemplate },
    ],
  },
  {
    label: "Analytics",
    items: [
      { label: "Analytics", href: "/admin/analytics", icon: BarChart3 },
      { label: "Performance", href: "/admin/performance", icon: Gauge },
      { label: "AI Usage", href: "/admin/analytics/ai", icon: Cpu },
    ],
  },
  {
    label: "System",
    collapsible: true,
    items: [
      { label: "API Keys", href: "/admin/api-keys", icon: Key, adminOnly: true },
      { label: "API Docs", href: "/admin/api-docs", icon: FileCode2, adminOnly: true },
      { label: "Sites", href: "/admin/sites", icon: Globe, adminOnly: true },
      { label: "Localization", href: "/admin/localization", icon: Languages, adminOnly: true },
      { label: "Documentation", href: "/admin/docs", icon: BookMarked },
      { label: "Settings", href: "/admin/settings", icon: Settings, adminOnly: true },
      { label: "Users", href: "/admin/users", icon: Users, adminOnly: true },
      { label: "Webhooks", href: "/admin/webhooks", icon: Webhook },
    ],
  },
];

interface SidebarProps {
  open?: boolean;
  onClose?: () => void;
}

export default function Sidebar({ open, onClose }: SidebarProps) {
  const pathname = usePathname();
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";
  const branding = useCmsBranding();

  // System group starts collapsed unless the user is currently on a system page
  const systemPaths = navGroups.find((g) => g.label === "System")?.items.map((i) => i.href) || [];
  const onSystemPage = systemPaths.some((p) => pathname.startsWith(p));
  const [systemOpen, setSystemOpen] = useState(onSystemPage);

  const isActive = (href: string) =>
    href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);

  const renderLink = (item: NavItem) => {
    if (item.adminOnly && !isAdmin) return null;
    const active = isActive(item.href);
    const Icon = item.icon;
    return (
      <Link
        key={item.href}
        href={item.href}
        onClick={onClose}
        className={`flex items-center gap-3 px-4 py-2 text-sm rounded-lg no-underline transition ${
          active
            ? "bg-teal-50 text-teal-700 font-medium border-l-2 border-teal-600 -ml-px"
            : "text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900"
        }`}
      >
        <Icon className="w-4 h-4 flex-shrink-0" />
        {item.label}
      </Link>
    );
  };

  const sidebarContent = (
    <>
      {/* Logo */}
      <div className="px-5 py-5 border-b border-neutral-100">
        <Link href="/admin" className="no-underline" onClick={onClose}>
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: branding.accentColor }}>
              <span className="text-white tracking-tight leading-none select-none" style={{ fontFamily: "'BigShoulders', sans-serif", fontWeight: 700, fontSize: branding.logoLetter.length === 1 ? '20px' : '11px' }}>{branding.logoLetter}</span>
            </div>
            <div>
              <p className="text-sm font-semibold text-neutral-900 leading-tight">
                {branding.name}
              </p>
              <p className="text-[10px] uppercase tracking-widest text-neutral-400">
                CMS
              </p>
            </div>
          </div>
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 py-4 px-3 space-y-5 overflow-y-auto">
        {navGroups.map((group) => {
          const visibleItems = group.items.filter(
            (item) => !item.adminOnly || isAdmin
          );
          if (visibleItems.length === 0) return null;

          const isCollapsible = group.collapsible;
          const isExpanded = !isCollapsible || systemOpen;

          return (
            <div key={group.label}>
              {isCollapsible ? (
                <button
                  onClick={() => setSystemOpen(!systemOpen)}
                  className="flex items-center justify-between w-full px-4 mb-2 group"
                >
                  <span className="text-[10px] font-semibold uppercase tracking-widest text-neutral-400 group-hover:text-neutral-600 transition">
                    {group.label}
                  </span>
                  <ChevronDown
                    className={`w-3 h-3 text-neutral-400 transition-transform ${
                      isExpanded ? "rotate-180" : ""
                    }`}
                  />
                </button>
              ) : (
                <p className="px-4 mb-2 text-[10px] font-semibold uppercase tracking-widest text-neutral-400">
                  {group.label}
                </p>
              )}
              {isExpanded && (
                <div className="space-y-0.5">{visibleItems.map(renderLink)}</div>
              )}
            </div>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="px-5 py-4 border-t border-neutral-100 space-y-2">
        {user && (
          <div className="flex items-center justify-between">
            <span className="text-xs text-neutral-500 truncate max-w-[140px]">{user.name || user.email}</span>
            <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium ${
              user.role === "admin" ? "bg-red-50 text-red-600" :
              user.role === "editor" ? "bg-blue-50 text-blue-600" :
              "bg-neutral-100 text-neutral-500"
            }`}>
              {user.role}
            </span>
          </div>
        )}
        <Link
          href="/blog"
          target="_blank"
          className="flex items-center gap-2 text-xs text-neutral-400 hover:text-neutral-600 no-underline transition"
        >
          <ExternalLink className="w-3 h-3" />
          View live site
        </Link>
      </div>
    </>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden md:flex w-64 bg-white border-r border-neutral-200 min-h-screen flex-col">
        {sidebarContent}
      </aside>

      {/* Mobile overlay */}
      {open && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div
            className="absolute inset-0 bg-black/30"
            onClick={onClose}
          />
          <aside className="relative w-72 bg-white min-h-screen flex flex-col shadow-xl">
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-1 text-neutral-400 hover:text-neutral-600"
            >
              <X className="w-5 h-5" />
            </button>
            {sidebarContent}
          </aside>
        </div>
      )}
    </>
  );
}
