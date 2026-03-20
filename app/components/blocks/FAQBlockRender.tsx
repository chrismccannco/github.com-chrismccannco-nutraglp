"use client";

import { useEffect, useState } from "react";
import type { FAQBlockData } from "@/lib/types/blocks";

interface Faq {
  id: number;
  question: string;
  answer: string;
  category: string;
}

interface Props {
  data?: FAQBlockData;
}

export default function FAQBlockRender({ data }: Props) {
  const [faqs, setFaqs] = useState<Faq[]>([]);
  const [openId, setOpenId] = useState<number | null>(null);
  const display = data?.display || "open";
  const heading = data?.heading || "Frequently Asked Questions";

  useEffect(() => {
    fetch("/api/faqs")
      .then((r) => r.json())
      .then((d) => setFaqs(Array.isArray(d) ? d : []))
      .catch(() => {});
  }, []);

  if (faqs.length === 0) return null;

  return (
    <section className="max-w-3xl mx-auto px-6 py-12">
      {heading && (
        <h2 className="text-2xl font-bold text-[#1A1A1A] mb-8 font-[family-name:var(--font-fraunces)]">
          {heading}
        </h2>
      )}

      {display === "open" ? (
        /* ── AEO-Optimized: All answers visible with proper heading hierarchy ── */
        <div className="space-y-8">
          {faqs.map((faq) => (
            <div key={faq.id} className="border-b border-neutral-100 pb-6 last:border-b-0">
              <h3 className="text-lg font-semibold text-[#1A1A1A] mb-2">
                {faq.question}
              </h3>
              <p className="text-neutral-600 text-sm leading-relaxed">
                {faq.answer}
              </p>
            </div>
          ))}
        </div>
      ) : (
        /* ── Accordion: Click to expand ── */
        <div className="divide-y divide-neutral-200 border-t border-b border-neutral-200">
          {faqs.map((faq) => (
            <div key={faq.id}>
              <button
                type="button"
                onClick={() => setOpenId(openId === faq.id ? null : faq.id)}
                className="w-full flex items-center justify-between py-4 text-left"
                aria-expanded={openId === faq.id}
              >
                <span className="font-medium text-[#1A1A1A]">{faq.question}</span>
                <span className="ml-4 text-neutral-400 text-xl leading-none">
                  {openId === faq.id ? "\u2212" : "+"}
                </span>
              </button>
              {openId === faq.id && (
                <div className="pb-4 text-neutral-600 text-sm leading-relaxed">
                  {faq.answer}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* FAQPage Schema.org structured data — always rendered regardless of display mode */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: faqs.map((faq) => ({
              "@type": "Question",
              name: faq.question,
              acceptedAnswer: {
                "@type": "Answer",
                text: faq.answer,
              },
            })),
          }),
        }}
      />
    </section>
  );
}
