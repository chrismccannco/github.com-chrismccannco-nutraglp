"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
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
} from "lucide-react";
import { useAuth } from "../layout";
import { useCmsBranding } from "../hooks/useCmsBranding";

const contentNav = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { label: "Pages", href: "/admin/pages", icon: FileText },
  { label: "Blog", href: "/admin/blog", icon: BookOpen },
  { label: "Products", href: "/admin/products", icon: Package },
  { label: "Testimonials", href: "/admin/testimonials", icon: Star },
  { label: "Reviews", href: "/admin/reviews", icon: ClipboardCheck },
  { label: "Submissions", href: "/admin/submissions", icon: Inbox },
  { label: "Media", href: "/admin/media", icon: Image },
  { label: "Analytics", href: "/admin/analytics", icon: BarChart3 },
  { label: "Performance", href: "/admin/performance", icon: Gauge },
  { label: "FAQ", href: "/admin/faq", icon: HelpCircle },
  { label: "Form Builder", href: "/admin/form-builder", icon: FormInput },
  { label: "Templates", href: "/admin/templates", icon: LayoutTemplate },
  { label: "Brand Hub", href: "/admin/brand", icon: Palette },
  { label: "Knowledge Base", href: "/admin/knowledge", icon: LibraryBig },
  { label: "AI Templates", href: "/admin/ai-templates", icon: Wand2 },
  { label: "Personas", href: "/admin/personas", icon: UserCircle },
  { label: "Repurpose", href: "/admin/repurpose", icon: RefreshCw },
];

const settingsNav = [
  { label: "API Keys", href: "/admin/api-keys", icon: Key, adminOnly: true },
  { label: "API Docs", href: "/admin/api-docs", icon: FileCode2, adminOnly: true },
  { label: "Sites", href: "/admin/sites", icon: Globe, adminOnly: true },
  { label: "Localization", href: "/admin/localization", icon: Languages, adminOnly: true },
  { label: "Documentation", href: "/admin/docs", icon: BookMarked },
  { label: "Settings", href: "/admin/settings", icon: Settings, adminOnly: true },
  { label: "Users", href: "/admin/users", icon: Users, adminOnly: true },
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

  const isActive = (href: string) =>
    href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);

  const renderLink = (item: {
    label: string;
    href: string;
    icon: typeof LayoutDashboard;
    adminOnly?: boolean;
  }) => {
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
            ? "bg-emerald-50 text-emerald-700 font-medium border-l-2 border-emerald-600 -ml-px"
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
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: branding.accentColor }}>
              <span className="text-white text-xs font-bold">{branding.logoLetter}</span>
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
      <nav className="flex-1 py-4 px-3 space-y-6 overflow-y-auto">
        <div>
          <p className="px-4 mb-2 text-[10px] font-semibold uppercase tracking-widest text-neutral-400">
            Content
          </p>
          <div className="space-y-0.5">{contentNav.map(renderLink)}</div>
        </div>
        <div>
          <p className="px-4 mb-2 text-[10px] font-semibold uppercase tracking-widest text-neutral-400">
            Settings
          </p>
          <div className="space-y-0.5">{settingsNav.map(renderLink)}</div>
        </div>
      </nav>

      {/* Footer */}
      <div className="px-5 py-4 border-t border-neutral-100">
        <Link
          href="/"
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
