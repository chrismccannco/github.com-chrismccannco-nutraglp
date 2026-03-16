import type { Metadata } from "next";
import Link from "next/link";
import Footer from "../components/Footer";
import { getFaqs } from "@/lib/cms";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Frequently Asked Questions",
  description:
    "Common questions about natural GLP-1 amplification, nanoemulsion delivery, DPP-4 inhibition, and how NutraGLP's Slim SHOT works.",
  alternates: {
    canonical: "https://nutraglp.com/faq",
  },
};

export default async function FAQPage() {
  const allFaqs = await getFaqs();

  // Group FAQs by category
  const categoryOrder: string[] = [];
  const grouped: Record<string, { question: string; answer: string }[]> = {};
  for (const faq of allFaqs) {
    if (!grouped[faq.category]) {
      grouped[faq.category] = [];
      categoryOrder.push(faq.category);
    }
    grouped[faq.category].push({ question: faq.question, answer: faq.answer });
  }

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: allFaqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer.replace(/<[^>]*>/g, ""),
      },
    })),
  };

  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      {/* Hero */}
      <section className="bg-forest-deep px-6 md:px-12 pt-28 pb-20 text-center">
        <p className="text-[11px] font-bold uppercase tracking-[2px] text-gold mb-4">
          FAQ
        </p>
        <h1
          className="text-3xl md:text-[48px] font-normal text-white leading-[1.1] tracking-tight max-w-[720px] mx-auto mb-6 font-display"
        >
          Common questions about natural GLP-1 amplification
        </h1>
        <p className="text-lg text-white/50 max-w-[560px] mx-auto leading-relaxed">
          The science, the technology, and how it all fits together.
        </p>
      </section>

      {/* FAQ Sections */}
      {categoryOrder.map((cat, catIndex) => (
        <section
          key={cat}
          className={`py-16 px-6 md:px-12 ${catIndex % 2 === 1 ? "bg-white" : ""}`}
        >
          <div className="max-w-[720px] mx-auto">
            <p className="text-[11px] font-bold uppercase tracking-[2px] text-forest-mid mb-8">
              {cat}
            </p>
            <div className="space-y-10">
              {grouped[cat].map((faq) => (
                <div key={faq.question}>
                  <h2
                    className="text-xl md:text-2xl font-normal tracking-tight leading-tight mb-4 text-ink font-display"
                  >
                    {faq.question}
                  </h2>
                  <div
                    className="text-[16px] leading-relaxed text-mist prose prose-gray max-w-none"
                    dangerouslySetInnerHTML={{ __html: faq.answer }}
                  />
                </div>
              ))}
            </div>
          </div>
        </section>
      ))}

      {/* Cross-links */}
      <section className="py-12 px-6 md:px-12 border-t border-rule">
        <div className="max-w-[720px] mx-auto flex flex-wrap gap-6">
          <Link
            href="/slim-shot"
            className="text-sm text-forest-mid hover:text-forest transition no-underline border-b border-forest-mid/30 pb-0.5"
          >
            Product details, dosing, and pricing &rarr;
          </Link>
          <Link
            href="/science"
            className="text-sm text-forest-mid hover:text-forest transition no-underline border-b border-forest-mid/30 pb-0.5"
          >
            Read the full science &rarr;
          </Link>
        </div>
      </section>

      <Footer />
    </main>
  );
}
