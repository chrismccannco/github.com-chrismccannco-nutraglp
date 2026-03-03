import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-forest-deep px-6 md:px-12 py-10">
      <div className="max-w-[720px] mx-auto">
        <p className="text-xs text-white/30 leading-relaxed text-center">
          *These statements have not been evaluated by the Food and Drug
          Administration. This product is not intended to diagnose, treat, cure,
          or prevent any disease. NutraGLP is a dietary supplement. Consult your
          healthcare provider before starting any new supplement regimen.
        </p>
        <div className="flex justify-center gap-4 sm:gap-6 mt-6 text-xs text-white/40 flex-wrap">
          <Link href="/slim-shot" className="hover:text-white/60 transition no-underline">
            Slim SHOT
          </Link>
          <Link href="/science" className="hover:text-white/60 transition no-underline">
            Science
          </Link>
          <Link href="/blog" className="hover:text-white/60 transition no-underline">
            Blog
          </Link>
          <Link href="/about" className="hover:text-white/60 transition no-underline">
            About
          </Link>
          <Link href="/privacy" className="hover:text-white/60 transition no-underline">
            Privacy
          </Link>
          <Link href="/terms" className="hover:text-white/60 transition no-underline">
            Terms
          </Link>
          <Link href="/investors" className="hover:text-white/60 transition no-underline">
            Investors
          </Link>
        </div>
        <div className="flex items-center justify-center gap-2 mt-6">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" fill="none" className="w-5 h-5 opacity-50" aria-hidden="true">
            <path d="M 206.44 324.74 A 140 140 0 0 1 206.44 75.26" fill="none" stroke="#D4B87A" strokeWidth="3" strokeLinecap="round"/>
            <path d="M 193.56 75.26 A 140 140 0 0 1 193.56 324.74" fill="none" stroke="#F5F2EB" strokeWidth="3" strokeLinecap="round"/>
            <circle cx="200.0" cy="75.3" r="2.4" fill="#D4B87A"/>
            <circle cx="200.0" cy="324.7" r="2.4" fill="#F5F2EB"/>
          </svg>
          <p className="text-xs text-white/40">
            &copy; {new Date().getFullYear()} NutraGLP Biosciences. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
