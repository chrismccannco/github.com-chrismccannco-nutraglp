import type { Metadata } from "next";
import Link from "next/link";
import Footer from "../components/Footer";

export const metadata: Metadata = {
  title: "You're In — NutraGLP",
  description:
    "Thank you for joining the Slim SHOT early access waitlist. We'll reach out with launch details soon.",
  robots: { index: false, follow: true },
};

export default function ThankYouPage() {
  return (
    <main>
      <section className="bg-forest-deep px-6 md:px-12 pt-28 pb-20 text-center min-h-[60vh] flex flex-col items-center justify-center">
        <p className="text-[11px] font-bold uppercase tracking-[2px] text-gold mb-4">
          Early Access
        </p>
        <h1
          className="text-3xl md:text-[48px] font-normal text-white leading-[1.1] tracking-tight max-w-[600px] mx-auto mb-6"
          style={{ fontFamily: "'Fraunces', Georgia, serif" }}
        >
          You&apos;re in.
        </h1>
        <p className="text-lg text-white/50 max-w-[480px] mx-auto leading-relaxed mb-10">
          We&apos;ll reach out with early access details and launch pricing
          before Slim SHOT ships. Keep an eye on your inbox.
        </p>
        <div className="flex flex-wrap justify-center gap-6">
          <Link
            href="/science"
            className="text-sm text-gold hover:text-gold-light transition no-underline border-b border-gold/30 pb-0.5"
          >
            Read the science &rarr;
          </Link>
          <Link
            href="/blog"
            className="text-sm text-gold hover:text-gold-light transition no-underline border-b border-gold/30 pb-0.5"
          >
            Latest research &rarr;
          </Link>
        </div>
      </section>
      <Footer />
    </main>
  );
}
