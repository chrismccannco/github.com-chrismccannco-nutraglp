import Link from "next/link";
import Footer from "./components/Footer";

export default function NotFound() {
  return (
    <main>
      <section className="bg-forest-deep px-6 md:px-12 pt-28 pb-20 text-center min-h-[60vh] flex flex-col items-center justify-center">
        <p className="text-[11px] font-bold uppercase tracking-[2px] text-gold mb-4">
          404
        </p>
        <h1
          className="text-3xl md:text-[48px] font-normal text-white leading-[1.1] tracking-tight max-w-[600px] mx-auto mb-6"
          style={{ fontFamily: "'Fraunces', Georgia, serif" }}
        >
          Page not found.
        </h1>
        <p className="text-lg text-white/50 max-w-[480px] mx-auto leading-relaxed mb-10">
          The page you&apos;re looking for doesn&apos;t exist or has moved.
        </p>
        <div className="flex flex-wrap justify-center gap-6">
          <Link
            href="/"
            className="text-sm text-gold hover:text-gold-light transition no-underline border-b border-gold/30 pb-0.5"
          >
            Back to home &rarr;
          </Link>
          <Link
            href="/slim-shot"
            className="text-sm text-gold hover:text-gold-light transition no-underline border-b border-gold/30 pb-0.5"
          >
            Slim SHOT &rarr;
          </Link>
          <Link
            href="/science"
            className="text-sm text-gold hover:text-gold-light transition no-underline border-b border-gold/30 pb-0.5"
          >
            The science &rarr;
          </Link>
          <Link
            href="/blog"
            className="text-sm text-gold hover:text-gold-light transition no-underline border-b border-gold/30 pb-0.5"
          >
            Research articles &rarr;
          </Link>
        </div>
      </section>
      <Footer />
    </main>
  );
}
