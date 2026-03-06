"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const nav = [
  { label: "Dashboard", href: "/admin" },
  { label: "Pages", href: "/admin/pages" },
  { label: "Blog", href: "/admin/blog" },
  { label: "FAQ", href: "/admin/faq" },
  { label: "Products", href: "/admin/products" },
  { label: "Media", href: "/admin/media" },
  { label: "Settings", href: "/admin/settings" },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-56 bg-[#0f2d20] text-white min-h-screen flex flex-col">
      <div className="p-5 border-b border-white/10">
        <Link href="/admin" className="no-underline">
          <p className="text-lg font-semibold tracking-tight text-white">NutraGLP</p>
          <p className="text-[11px] uppercase tracking-widest text-white/40 mt-0.5">CMS</p>
        </Link>
      </div>
      <nav className="flex-1 py-4">
        {nav.map((item) => {
          const active =
            item.href === "/admin"
              ? pathname === "/admin"
              : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`block px-5 py-2.5 text-sm no-underline transition ${
                active
                  ? "bg-white/10 text-white font-medium"
                  : "text-white/60 hover:text-white hover:bg-white/5"
              }`}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div className="p-5 border-t border-white/10">
        <Link
          href="/"
          className="text-xs text-white/40 hover:text-white/70 no-underline transition"
        >
          View live site &rarr;
        </Link>
      </div>
    </aside>
  );
}
