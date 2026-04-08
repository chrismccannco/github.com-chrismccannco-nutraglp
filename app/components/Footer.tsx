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
          <Link href="/investors" className="hover:text-white/60 transition no-underline">
            Investors
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
        </div>
        <p className="text-xs text-white/40 mt-6 text-center">
          &copy; {new Date().getFullYear()} NutraGLP Biosciences. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
