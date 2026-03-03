"use client";

import { useState } from "react";
import Link from "next/link";

export default function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-forest-deep/95 backdrop-blur-sm border-b border-white/[0.06]">
      <div className="max-w-[1200px] mx-auto flex items-center justify-between px-6 md:px-12 py-4">
        <Link href="/" className="flex items-center gap-2.5 no-underline">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" fill="none" className="w-9 h-9 flex-shrink-0" aria-hidden="true">
            <path d="M 206.44 324.74 A 140 140 0 0 1 206.44 75.26" fill="none" stroke="#D4B87A" strokeWidth="3" strokeLinecap="round"/>
            <path d="M 193.56 75.26 A 140 140 0 0 1 193.56 324.74" fill="none" stroke="#F5F2EB" strokeWidth="3" strokeLinecap="round"/>
            <circle cx="200.0" cy="75.3" r="2.4" fill="#D4B87A"/>
            <circle cx="200.0" cy="324.7" r="2.4" fill="#F5F2EB"/>
          </svg>
          <span className="flex items-baseline gap-2">
            <span className="text-xl font-bold tracking-tight text-cream font-heading">NutraGLP</span>
            <span className="text-[10px] font-semibold uppercase tracking-[2.5px] text-gold/80">Biosciences</span>
          </span>
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
          <Link href="/#waitlist" className="bg-gold text-white px-6 py-2.5 text-sm font-bold rounded-md tracking-tight no-underline hover:bg-gold-light transition">
            Join the Waitlist
          </Link>
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
          <Link
            href="/#waitlist"
            onClick={() => setOpen(false)}
            className="block mt-2 bg-gold text-white px-6 py-3 text-sm font-bold rounded-md tracking-tight text-center no-underline"
          >
            Join the Waitlist
          </Link>
        </div>
      )}
    </header>
  );
}
