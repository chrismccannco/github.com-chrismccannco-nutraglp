import type { Metadata } from "next";
import Link from "next/link";
import Pipeline from "../components/Pipeline";
import Footer from "../components/Footer";

export const metadata: Metadata = {
  title: "Investors",
  description:
    "NutraGLP investor overview. $132B addressable market, patent-pending nanoemulsion platform, and a clear path to category leadership in natural GLP-1 activation.",
  alternates: {
    canonical: "https://nutraglp.com/investors",
  },
  robots: {
    index: false,
    follow: true,
  },
};

const metrics = [
  { value: "$132B", label: "Total Addressable Market" },
  { value: "30+", label: "Patent-Pending Formulations" },
  { value: "4", label: "Product Lines" },
  { value: "$4.5M", label: "Seed Round" },
];

export default function Investors() {
  return (
    <main>
      {/* Hero */}
      <section className="bg-forest-deep px-6 md:px-12 pt-28 pb-20 text-center">
        <p className="text-xs font-semibold uppercase tracking-[3px] text-gold mb-6">
          NutraGLP Sync&trade; Platform
        </p>
        <h1
          className="text-4xl md:text-[52px] font-normal text-white leading-[1.08] tracking-tight max-w-[820px] mx-auto mb-6"
          style={{ fontFamily: "'Fraunces', Georgia, serif" }}
        >
          Your body already makes GLP-1.
          <br />
          <span className="text-gold italic">We built the platform to optimize it.</span>
        </h1>
        <p className="text-lg text-white/50 max-w-[620px] mx-auto mb-10 leading-relaxed">
          A patent-pending metabolic activation platform that coordinates
          endogenous incretin pathways. One core mechanism. Multiple product
          formats. A $132B market with no platform-level entrant.
        </p>
        <a
          href="mailto:investors@nutraglp.com"
          className="inline-block bg-gold text-white text-sm font-semibold px-8 py-3 rounded-full no-underline hover:bg-gold-light transition"
        >
          Request the Deck
        </a>
      </section>

      {/* Metrics Bar */}
      <section className="bg-forest px-6 md:px-12 py-5 flex justify-center gap-6 sm:gap-12 flex-wrap">
        {metrics.map((s) => (
          <div key={s.label} className="text-center">
            <div
              className="text-2xl font-normal tracking-tight text-gold"
              style={{ fontFamily: "'Fraunces', Georgia, serif" }}
            >
              {s.value}
            </div>
            <div className="text-xs text-white/50 uppercase tracking-wider mt-0.5">
              {s.label}
            </div>
          </div>
        ))}
      </section>

      {/* Thesis */}
      <section className="py-24 px-6 md:px-12 max-w-[720px] mx-auto">
        <p className="text-[11px] font-bold uppercase tracking-[2px] text-forest-mid mb-4">
          Investment Thesis
        </p>
        <h2
          className="text-3xl md:text-4xl font-normal tracking-tight leading-tight mb-6 text-ink"
          style={{ fontFamily: "'Fraunces', Georgia, serif" }}
        >
          The space between pharma and supplements is unoccupied.
        </h2>
        <p className="text-[17px] leading-relaxed text-mist mb-5">
          GLP-1 drugs are a $50B+ category growing 40% year over year. But
          the delivery model, weekly injections at $800&ndash;$1,600/month,
          excludes the majority of the addressable market. Meanwhile, the
          supplement aisle offers no credible alternative.
        </p>
        <p className="text-[17px] leading-relaxed text-mist mb-5">
          NutraGLP is building the platform layer between these two worlds.
          Our patent-pending technology amplifies endogenous GLP-1 production
          and inhibits DPP-4 degradation, delivered through a proprietary
          nanoemulsion system that solves the bioavailability problem that
          makes most oral formats ineffective.
        </p>
        <p className="text-[17px] leading-relaxed text-mist">
          Slim SHOT is the lead product. It ships first, generates revenue,
          and validates the core mechanism. The same technology powers
          every product in the pipeline: sweeteners, protein, energy
          formats, and an AI-driven companion app. One R&amp;D investment,
          multiple revenue streams.
        </p>
      </section>

      {/* Pipeline */}
      <Pipeline />

      {/* Market */}
      <section className="py-24 px-6 md:px-12 max-w-[720px] mx-auto">
        <p className="text-[11px] font-bold uppercase tracking-[2px] text-forest-mid mb-4">
          Market Opportunity
        </p>
        <h2
          className="text-3xl md:text-4xl font-normal tracking-tight leading-tight mb-6 text-ink"
          style={{ fontFamily: "'Fraunces', Georgia, serif" }}
        >
          $132B TAM. No platform-level entrant.
        </h2>
        <div className="space-y-8">
          {[
            { value: "$132B", title: "Total Addressable Market", desc: "Global weight management + metabolic health" },
            { value: "$21B", title: "Serviceable Addressable Market", desc: "U.S. consumers seeking non-prescription metabolic support" },
            { value: "~$500M", title: "Serviceable Obtainable Market", desc: "Direct-to-consumer capture within 5 years" },
          ].map((item) => (
            <div key={item.value} className="grid grid-cols-[90px_1fr] sm:grid-cols-[120px_1fr] items-baseline gap-4 sm:gap-6">
              <span className="text-2xl sm:text-3xl font-normal text-gold text-right" style={{ fontFamily: "'Fraunces', Georgia, serif" }}>
                {item.value}
              </span>
              <div>
                <p className="text-[15px] font-semibold text-ink">{item.title}</p>
                <p className="text-sm text-mist mt-0.5">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Projections */}
      <section className="bg-forest-deep py-24 px-6 md:px-12">
        <div className="max-w-[1000px] mx-auto">
          <p className="text-[11px] font-bold uppercase tracking-[2px] text-gold mb-4">
            Financial Projections
          </p>
          <h2
            className="text-3xl md:text-4xl font-normal tracking-tight leading-tight mb-12 text-white"
            style={{ fontFamily: "'Fraunces', Georgia, serif" }}
          >
            Path to $135M in four years.
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { year: "Year 1", revenue: "$3M", note: "Slim SHOT launch + DTC" },
              { year: "Year 2", revenue: "$15M", note: "Sweetener launch + retail" },
              { year: "Year 3", revenue: "$45M", note: "Full product line + app" },
              { year: "Year 4", revenue: "$135M", note: "Scale + international" },
            ].map((y) => (
              <div key={y.year} className="text-center">
                <p className="text-xs text-white/40 uppercase tracking-wider mb-2">{y.year}</p>
                <p className="text-3xl font-normal text-gold mb-2" style={{ fontFamily: "'Fraunces', Georgia, serif" }}>
                  {y.revenue}
                </p>
                <p className="text-xs text-white/40">{y.note}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-forest py-20 px-6 md:px-12 text-center">
        <h2
          className="text-3xl md:text-4xl font-normal text-white tracking-tight mb-4"
          style={{ fontFamily: "'Fraunces', Georgia, serif" }}
        >
          Raising $4.5M seed.
        </h2>
        <p className="text-[17px] text-white/50 max-w-[520px] mx-auto mb-8">
          For the full deck, clinical data, and a conversation
          about what we&apos;re building.
        </p>
        <a
          href="mailto:investors@nutraglp.com"
          className="inline-block bg-gold text-white text-sm font-semibold px-8 py-3 rounded-full no-underline hover:bg-gold-light transition"
        >
          Request the Deck
        </a>
      </section>

      <Footer />
    </main>
  );
}
