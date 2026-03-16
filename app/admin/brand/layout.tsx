'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Palette, Type, ImageIcon, MessageSquare, Zap, Code2 } from 'lucide-react';

const TABS = [
  { href: '/admin/brand/colors',     label: 'Colors',       icon: Palette },
  { href: '/admin/brand/typography', label: 'Typography',   icon: Type },
  { href: '/admin/brand/logos',      label: 'Logos',        icon: ImageIcon },
  { href: '/admin/brand/voice',      label: 'Voice & Tone', icon: MessageSquare },
  { href: '/admin/brand/score',      label: 'AI Score',     icon: Zap },
  { href: '/admin/brand/export',     label: 'Export',       icon: Code2 },
];

export default function BrandLayout({ children }: { children: React.ReactNode }) {
  const path = usePathname();

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Page header */}
      <div className="bg-white border-b border-neutral-200 px-8 pt-6 pb-0">
        <p className="text-xs text-neutral-400 mb-1">Admin / Brand Hub</p>
        <div className="flex items-end justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-neutral-900">Brand Hub</h1>
            <p className="text-xs text-neutral-400 mt-0.5 mb-4">
              One source of truth. Changes sync to your live site automatically.
            </p>
          </div>
        </div>

        {/* Tab bar */}
        <div className="flex -mb-px">
          {TABS.map(({ href, label, icon: Icon }) => {
            const active = path === href || path.startsWith(href + '/');
            return (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-1.5 px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                  active
                    ? 'border-neutral-900 text-neutral-900'
                    : 'border-transparent text-neutral-500 hover:text-neutral-700 hover:border-neutral-300'
                }`}
              >
                <Icon size={14} />
                {label}
              </Link>
            );
          })}
        </div>
      </div>

      {/* Content */}
      <div className="px-8 py-8 max-w-5xl">
        {children}
      </div>
    </div>
  );
}
