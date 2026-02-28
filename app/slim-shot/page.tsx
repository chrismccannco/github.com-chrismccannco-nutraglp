import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import WaitlistForm from "../components/WaitlistForm";
import Footer from "../components/Footer";

export const metadata: Metadata = {
  title: "Slim SHOT — Daily GLP-1 Activation",
  description:
    "A daily liquid formula that activates your body's own GLP-1 production. Patent-pending nanoemulsion delivery, clinically studied compounds. $145/mo.",
  alternates: {
    canonical: "https://nutraglp.com/slim-shot",
  },
};

const principles = [
  {
    title: "Activate",
    desc: "Clinically studied compounds that stimulate your body\u2019s own GLP-1 and GIP production from intestinal L-cells.",
  },
  {
    title: "Protect",
    desc: "Natural DPP-4 inhibition extends the half-life of your endogenous hormones before enzymatic breakdown.",
  },
  {
    title: "Deliver",
    desc: "Patent-pending nanoemulsion carrier ensures bioavailability. The delivery system is the differentiator.",
  },
];

const timeline = [
  {
    week: "Week 1",
    title: "Adjustment",
    desc: "Your body begins responding to the formula. Some people notice reduced cravings within the first few days. Others take longer. Both are normal.",
  },
  {
    week: "Week 2–3",
    title: "Activation",
    desc: "GLP-1 production ramps up. Appetite regulation becomes more noticeable. Energy levels tend to stabilize as glucose metabolism improves.",
  },
  {
    week: "Week 4+",
    title: "Steady state",
    desc: "The full metabolic effect. Consistent appetite control, improved metabolic markers, sustained energy. This is where the compound effect of daily use shows up.",
  },
];

const faqs = [
  {
    q: "Is Slim SHOT FDA approved?",
    a: "Slim SHOT is a clinical nutraceutical, not a drug. It is regulated under the dietary supplement framework (DSHEA) and does not require pre-market approval. All compounds in our formula hold GRAS (Generally Recognized as Safe) status, and the product is manufactured in cGMP-certified facilities with third-party testing for purity and potency.",
  },
  {
    q: "Will this interact with my medication?",
    a: "Certain active compounds in the formula can interact with medications, particularly those metabolized by the liver (CYP enzymes) and blood sugar-lowering drugs. If you are taking any prescription medication, consult your healthcare provider before starting Slim SHOT. This is not optional advice.",
  },
  {
    q: "How is this different from Ozempic or Wegovy?",
    a: "GLP-1 drugs inject synthetic peptides that mimic your incretin hormones. Slim SHOT takes the opposite approach: it amplifies your body's own GLP-1 production while inhibiting the enzyme that breaks it down. No injection, no prescription, no synthetic peptides. Different mechanism, same biological pathway.",
  },
  {
    q: "What if it doesn't work for me?",
    a: "Individual responses vary based on metabolism, diet, and baseline GLP-1 activity. We recommend a minimum 30-day trial to allow the formula to reach steady-state effect. If you're not seeing results, contact us and we'll work with you.",
  },
  {
    q: "Can I cancel anytime?",
    a: "Yes. No contracts, no commitments, no cancellation fees. You can pause or cancel your subscription at any time through your account dashboard.",
  },
  {
    q: "Is this safe for athletes?",
    a: "Yes. All compounds are naturally derived and none appear on WADA or USADA prohibited substance lists. Slim SHOT is designed to support metabolic efficiency without the muscle-wasting effects associated with higher-dose synthetic GLP-1 agonists.",
  },
  {
    q: "How do I take it? Is it an injection?",
    a: "Not an injection. Slim SHOT is a drinkable liquid you take by mouth, like a wellness shot. One per day, ideally in the morning on an empty stomach. No needle, no syringe, no mixing, no measuring. Refrigerate after opening.",
  },
  {
    q: "What does it taste like?",
    a: "Neutral with a mild citrus finish. It's not a smoothie. It's not unpleasant. Most people describe it as unremarkable, which is the goal.",
  },
];

const productSchema = {
  "@context": "https://schema.org",
  "@type": "Product",
  name: "Slim SHOT",
  description:
    "A daily drinkable liquid nanoemulsion that activates your body's natural GLP-1 production and inhibits DPP-4. Patent-pending formula with four GRAS-certified active systems targeting AMPK activation, GPR120 signaling, insulin receptor sensitization, and DPP-4 inhibition.",
  brand: {
    "@type": "Brand",
    name: "NutraGLP",
  },
  url: "https://nutraglp.com/slim-shot",
  image: "https://nutraglp.com/og-image.png",
  offers: {
    "@type": "Offer",
    price: "145.00",
    priceCurrency: "USD",
    availability: "https://schema.org/PreOrder",
    priceValidUntil: "2026-12-31",
    url: "https://nutraglp.com/slim-shot",
  },
  category: "Health & Wellness > Dietary Supplements",
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((faq) => ({
    "@type": "Question",
    name: faq.q,
    acceptedAnswer: {
      "@type": "Answer",
      text: faq.a,
    },
  })),
};

export default function SlimShotPage() {
  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      {/* Hero */}
      <section className="bg-forest-deep px-6 md:px-12 pt-28 pb-20">
        <div className="max-w-[1000px] mx-auto md:flex md:items-center md:gap-16">
          <div className="flex-1">
            <p className="text-[10px] font-bold uppercase tracking-[2px] text-gold mb-4">
              Slim SHOT &mdash; a drinkable daily liquid, not an injection
            </p>
            <h1
              className="text-3xl md:text-[44px] font-normal text-white leading-[1.1] tracking-tight mb-6"
              style={{ fontFamily: "'Fraunces', Georgia, serif" }}
            >
              Daily GLP-1 activation.
              <br />
              <span className="text-gold italic">Drink it. No needle. No syringe. Ever.</span>
            </h1>
            <p className="text-[17px] text-white/50 leading-relaxed mb-8 max-w-[480px]">
              Slim SHOT is a drinkable liquid, not an injection. A patent-pending
              nanoemulsion you take by mouth every morning that amplifies your
              body&apos;s natural GLP-1 production and inhibits the enzyme that
              breaks it down.
            </p>
            <div className="flex items-baseline gap-3 mb-8">
              <span
                className="text-3xl text-gold font-normal"
                style={{ fontFamily: "'Fraunces', Georgia, serif" }}
              >
                $145
              </span>
              <span className="text-white/40 text-sm">/month &middot; Ships direct &middot; Cancel anytime</span>
            </div>
            <WaitlistForm variant="hero" />
          </div>

          {/* Product image */}
          <div className="hidden md:flex flex-1 items-center justify-center">
            <div className="relative">
              <div className="absolute -inset-8 bg-gold/[0.06] rounded-full blur-3xl" />
              <Image
                src="/images/slim-shot-bottle-alt.png"
                alt="Slim SHOT daily nanoemulsion supplement bottle"
                width={600}
                height={600}
                className="relative drop-shadow-2xl max-h-[380px] w-auto"
                priority
              />
            </div>
          </div>
        </div>
      </section>

      {/* Quick facts bar */}
      <section className="bg-forest px-6 md:px-12 py-5 flex justify-center gap-6 sm:gap-10 md:gap-14 flex-wrap">
        {[
          { value: "1 shot", label: "Daily" },
          { value: "30 sec", label: "Morning Routine" },
          { value: "100%", label: "Natural" },
          { value: "0", label: "Injections" },
        ].map((s) => (
          <div key={s.label} className="text-center">
            <div
              className="text-xl font-normal tracking-tight text-gold"
              style={{ fontFamily: "'Fraunces', Georgia, serif" }}
            >
              {s.value}
            </div>
            <div className="text-[10px] text-white/50 uppercase tracking-wider mt-0.5">
              {s.label}
            </div>
          </div>
        ))}
      </section>

      {/* How it works */}
      <section className="py-24 px-6 md:px-12 max-w-[1000px] mx-auto">
        <p className="text-[11px] font-bold uppercase tracking-[2px] text-forest-mid mb-4">
          The Mechanism
        </p>
        <h2
          className="text-3xl md:text-4xl font-normal tracking-tight leading-tight mb-4 text-ink"
          style={{ fontFamily: "'Fraunces', Georgia, serif" }}
        >
          Three systems. One daily protocol.
        </h2>
        <p className="text-[17px] leading-relaxed text-mist max-w-[640px] mb-12">
          Slim SHOT works at the intersection of clinical science and delivery
          technology. The formula activates, protects, and delivers.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {principles.map((p) => (
            <div
              key={p.title}
              className="p-8 bg-white border border-rule rounded-xl"
            >
              <h3 className="text-[17px] font-bold tracking-tight mb-3 text-ink">
                {p.title}
              </h3>
              <p className="text-sm text-mist leading-relaxed">{p.desc}</p>
            </div>
          ))}
        </div>

        <div className="mt-8">
          <Link
            href="/science"
            className="text-sm text-forest-mid hover:text-forest transition no-underline border-b border-forest-mid/30 pb-0.5"
          >
            Full science breakdown &rarr;
          </Link>
        </div>
      </section>

      <hr className="max-w-[720px] mx-auto border-t border-rule" />

      {/* What to expect */}
      <section className="py-24 px-6 md:px-12 max-w-[1000px] mx-auto">
        <p className="text-[11px] font-bold uppercase tracking-[2px] text-forest-mid mb-4">
          What to Expect
        </p>
        <h2
          className="text-3xl md:text-4xl font-normal tracking-tight leading-tight mb-4 text-ink"
          style={{ fontFamily: "'Fraunces', Georgia, serif" }}
        >
          The first 30 days.
        </h2>
        <p className="text-[17px] leading-relaxed text-mist max-w-[640px] mb-12">
          This isn&apos;t a quick fix. It&apos;s a daily protocol that compounds
          over time. Here&apos;s what the trajectory typically looks like.
        </p>

        {/* Timeline with connected visual */}
        <div className="relative">
          {/* Connecting line (desktop only) */}
          <div className="hidden md:block absolute top-[28px] left-[calc(16.67%-8px)] right-[calc(16.67%-8px)] h-[2px] bg-gradient-to-r from-forest-mid/20 via-forest-mid/40 to-gold/40" />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {timeline.map((t, i) => (
              <div key={t.week} className="relative">
                {/* Step dot */}
                <div className="flex justify-center mb-4">
                  <div className={`w-14 h-14 rounded-full flex items-center justify-center border-2 ${
                    i === 2 ? 'border-gold bg-gold/10' : 'border-forest-mid/30 bg-forest-mid/5'
                  }`}>
                    <span className={`text-lg font-normal ${i === 2 ? 'text-gold' : 'text-forest-mid'}`}
                      style={{ fontFamily: "'Fraunces', Georgia, serif" }}>
                      {i + 1}
                    </span>
                  </div>
                </div>
                <div className="p-8 bg-white border border-rule rounded-xl">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-forest-mid mb-3">
                    {t.week}
                  </p>
                  <h3
                    className="text-lg font-normal tracking-tight text-ink mb-3"
                    style={{ fontFamily: "'Fraunces', Georgia, serif" }}
                  >
                    {t.title}
                  </h3>
                  <p className="text-sm text-mist leading-relaxed">{t.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-24 px-6 md:px-12 bg-cream-warm bg-dot-grid">
        <div className="max-w-[720px] mx-auto">
          <p className="text-[11px] font-bold uppercase tracking-[2px] text-forest-mid mb-4">
            Questions
          </p>
          <h2
            className="text-3xl md:text-4xl font-normal tracking-tight leading-tight mb-12 text-ink"
            style={{ fontFamily: "'Fraunces', Georgia, serif" }}
          >
            Things people ask before they start.
          </h2>

          <div className="space-y-6">
            {faqs.map((faq) => (
              <div key={faq.q} className="bg-white border border-rule rounded-xl p-6 md:p-8">
                <h3 className="text-[15px] font-bold text-ink mb-3">
                  {faq.q}
                </h3>
                <p className="text-sm text-mist leading-relaxed">
                  {faq.a}
                </p>
              </div>
            ))}
          </div>
          <div className="mt-8">
            <Link
              href="/faq"
              className="text-sm text-forest-mid hover:text-forest transition no-underline border-b border-forest-mid/30 pb-0.5"
            >
              More questions about GLP-1, nanoemulsions, and the science &rarr;
            </Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-forest py-20 px-6 md:px-12 text-center">
        <h2
          className="text-3xl md:text-4xl font-normal text-white tracking-tight mb-4"
          style={{ fontFamily: "'Fraunces', Georgia, serif" }}
        >
          Ready to try a different approach?
        </h2>
        <p className="text-[17px] text-white/50 max-w-[520px] mx-auto mb-8">
          $145/mo. No prescription. No commitment. Join the waitlist for
          early access and launch pricing.
        </p>
        <WaitlistForm variant="cta" />
      </section>

      <Footer />
    </main>
  );
}
