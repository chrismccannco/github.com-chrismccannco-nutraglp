import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-forest-deep px-6 md:px-12 py-10">
      <div className="max-w-[720px] mx-auto">
        <p className="text-xs text-white/50 leading-relaxed text-center">
          *These statements have not been evaluated by the Food and Drug
          Administration. This product is not intended to diagnose, treat, cure,
          or prevent any disease. NutraGLP is a dietary supplement. Consult your
          healthcare provider before starting any new supplement regimen.
        </p>
        <div className="flex justify-center gap-4 sm:gap-6 mt-6 text-xs text-white/60 flex-wrap">
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
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40" fill="none" className="w-5 h-5 opacity-50" aria-hidden="true">
            <path d="M20 5.5 C12 5.5 5.5 12 5.5 20 C5.5 28 12 34.5 20 34.5" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" fill="none"/>
            <path d="M20 5.5 C28 5.5 34.5 12 34.5 20 C34.5 28 28 34.5 20 34.5" stroke="#c8962e" strokeWidth="2.5" strokeLinecap="round" fill="none"/>
            <circle cx="20" cy="5.5" r="2.5" fill="#c8962e"/>
            <circle cx="20" cy="34.5" r="2.5" fill="#c8962e"/>
          </svg>
          <p className="text-xs text-white/60">
            &copy; {new Date().getFullYear()} NutraGLP Biosciences. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
