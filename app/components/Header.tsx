"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";

export default function Header() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  // Hide site header on admin pages — admin has its own sidebar nav
  if (pathname.startsWith("/admin")) return null;

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-forest-deep/95 backdrop-blur-sm border-b border-white/[0.06]">
      <div className="max-w-[1200px] mx-auto flex items-center justify-between px-6 md:px-12 py-4">
        <Link href="/" className="flex items-center no-underline">
          <img src="/nutraglp-logo.svg" alt="NutraGLP Biosciences" className="h-10 w-auto" />
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-8">
          <Link href="/slim-shot" className="text-sm text-white/50 hover:text-white transition no-underline">
            Slim SHOT
          </Link>
          <Link href="/science" className="text-sm text-white/50 hover:text-white transition no-underline">
            Science
          </Link>
          <Link href="/faq" className="text-sm text-white/50 hover:text-white transition no-underline">
            FAQ
          </Link>
          <Link href="/blog" className="text-sm text-white/50 hover:text-white transition no-underline">
            Blog
          </Link>
          <button onClick={() => window.dispatchEvent(new CustomEvent('openSubscribePopup'))} className="bg-gold text-white px-6 py-2.5 text-sm font-bold rounded-md tracking-tight border-none cursor-pointer hover:bg-gold-light transition">
              Get Early Access
            </button>
        </nav>

        {/* Mobile toggle */}
        <button
          onClick={() => setOpen(!open)}
          className="md:hidden text-white/50 hover:text-white transition cursor-pointer bg-transparent border-none"
          aria-label="Toggle menu"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            {open ? (
              <path d="M6 6l12 12M6 18L18 6" />
            ) : (
              <path d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden bg-forest-deep border-t border-white/[0.06] px-6 pb-6">
          <Link
            href="/slim-shot"
            onClick={() => setOpen(false)}
            className="block py-3 text-sm text-white/50 hover:text-white transition no-underline"
          >
            Slim SHOT
          </Link>
          <Link
            href="/science"
            onClick={() => setOpen(false)}
            className="block py-3 text-sm text-white/50 hover:text-white transition no-underline"
          >
            Science
          </Link>
          <Link
            href="/faq"
            onClick={() => setOpen(false)}
            className="block py-3 text-sm text-white/50 hover:text-white transition no-underline"
          >
            FAQ
          </Link>
          <Link
            href="/blog"
            onClick={() => setOpen(false)}
            className="block py-3 text-sm text-white/50 hover:text-white transition no-underline"
          >
            Blog
          </Link>
          <button onClick={() => { window.dispatchEvent(new CustomEvent('openSubscribePopup')); setOpen(false); }} className="block mt-2 w-full bg-gold text-white px-6 py-3 text-sm font-bold rounded-md tracking-tight text-center border-none cursor-pointer">
            Get Early Access
          </button>
        </div>
      )}
    </header>
  );
}
