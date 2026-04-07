"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function MobileStickyCTA() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      // Show after scrolling past the hero (roughly 500px)
      setVisible(window.scrollY > 500);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-forest-deep/95 backdrop-blur-sm border-t border-white/[0.1] px-4 py-3 safe-bottom">
      <Link
        href="/#waitlist"
        className="block w-full bg-gold text-white text-center text-sm font-bold py-3 rounded-lg tracking-tight no-underline hover:bg-gold-light transition"
      >
        Reserve Your Spot &rarr;
      </Link>
    </div>
  );
}
