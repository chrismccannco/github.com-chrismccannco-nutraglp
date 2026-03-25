import type { Metadata } from "next";
import Footer from "../components/Footer";
import InvestorDeckForm from "../components/InvestorDeckForm";

export const metadata: Metadata = {
  title: "Investors",
  description:
    "NutraGLP Biosciences — a biotechnology platform for natural incretin modulation. $5.5M seed round. 40+ patent-pending formulations.",
  alternates: {
    canonical: "https://nutraglp.com/investors",
  },
  robots: {
    index: false,
    follow: true,
  },
};

const metrics = [
  { value: "$5.5M", label: "Seed Round" },
  { value: "40+", label: "Patent-Pending Formulations" },
  { value: "13", label: "Validated Signaling Targets" },
  { value: "8x", label: "Bioavailability vs Standard Oral" },
];

const comparables = [
  {
    transaction: "Metsera acquisition",
    acquirer: "Pfizer",
    value: "Up to $10B (2025)",
    signal: "Strategic acquirers paying platform premiums for incretin biology",
  },
  {
    transaction: "Carmot Therapeutics",
    acquirer: "Roche",
    value: "$2.7B (2023)",
    signal: "Delivery system IP and novel peptide structures command acquisition premium",
  },
  {
    transaction: "Protomer Technologies",
    acquirer: "Eli Lilly",
    value: "Undisclosed (2024)",
    signal: "Lilly using CVC and M&A to build ecosystem beyond internal R&D",
  },
  {
    transaction: "Verdiva Bio Series A",
    acquirer: "Lilly Asia Ventures (led)",
    value: "$411M (2025)",
    signal: "CVC actively building GLP-1 adjacent pipeline at early stage",
  },
];

export default function Investors() {
  return (
    <main>
      {/* Hero */}
      <section className="bg-forest-deep px-6 md:px-12 pt-28 pb-20 text-center">
        <p className="text-xs font-semibold uppercase tracking-[3px] text-gold/70 mb-6">
          NutraGLP Biosciences
        </p>
        <h1 className="text-4xl md:text-[52px] font-normal text-white leading-[1.08] tracking-tight max-w-[820px] mx-auto mb-6 font-heading">
          A biotechnology platform for
          <br />
          <span className="text-gold italic">natural incretin modulation</span>
        </h1>
      </section>

      {/* Metrics Bar */}
      <section className="bg-forest px-6 md:px-12 py-5 flex justify-center gap-6 sm:gap-12 flex-wrap">
        {metrics.map((s) => (
          <div key={s.label} className="text-center">
            <div className="text-2xl font-normal tracking-tight text-gold font-heading">
              {s.value}
            </div>
            <div className="text-xs text-white/50 uppercase tracking-wider mt-0.5">
              {s.label}
            </div>
          </div>
        ))}
      </section>

      {/* The Platform */}
      <section className="py-24 px-6 md:px-12 max-w-[720px] mx-auto">
        <p className="text-[11px] font-bold uppercase tracking-[2px] text-forest-mid mb-4">
          The Platform
        </p>
        <h2 className="text-3xl md:text-4xl font-normal tracking-tight leading-tight mb-6 text-ink font-heading">
          Not a supplement company.
        </h2>
        <p className="text-[17px] leading-relaxed text-mist mb-5">
          NutraGLP is not a supplement company. It is a biotechnology platform
          occupying a new product category at the intersection of
          pharmaceuticals, foods, and dietary supplements.
        </p>
        <p className="text-[17px] leading-relaxed text-mist mb-5">
          The platform activates endogenous GLP-1 and GIP production through a
          coordinated architecture of 13 validated signaling targets &mdash;
          including DPP-4 inhibition, AMPK activation, GPR120 signaling, and
          insulin receptor sensitization. Delivered via a proprietary
          nanoemulsion system achieving up to 8x bioavailability over standard
          oral delivery.
        </p>
        <p className="text-[17px] leading-relaxed text-mist mb-12">
          The moat is the architecture, not any single ingredient. The platform
          is defended through 40+ patent-pending formulations, platform-level
          delivery technology, and system design IP.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              title: "Activate",
              body: "Four GRAS-certified active systems stimulate endogenous GLP-1 and GIP production through AMPK activation, GPR120 signaling, and insulin receptor sensitization.",
            },
            {
              title: "Protect",
              body: "Natural DPP-4 inhibitors extend the active life of endogenous GLP-1. More hormone. Longer metabolic window. No synthetic peptides. This is the key differentiator from commodity supplements.",
            },
            {
              title: "Deliver",
              body: "Patent-pending nanoemulsion technology achieves up to 8x bioavailability over standard oral formats.",
            },
          ].map((card) => (
            <div key={card.title} className="border border-rule rounded-xl p-6">
              <p className="text-sm font-semibold text-ink mb-2">{card.title}</p>
              <p className="text-sm leading-relaxed text-mist">{card.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Proof of Concept */}
      <section className="py-24 px-6 md:px-12 bg-cream-warm">
        <div className="max-w-[720px] mx-auto">
          <p className="text-[11px] font-bold uppercase tracking-[2px] text-forest-mid mb-4">
            Proof of Concept
          </p>
          <h2 className="text-3xl md:text-4xl font-normal tracking-tight leading-tight mb-6 text-ink font-heading">
            503-person observational trial.
          </h2>
          <p className="text-[17px] leading-relaxed text-mist mb-10">
            A 503-person observational trial of a licensed NutraGLP formulation
            demonstrated weight loss outcomes after 6 months that exceeded
            results reported for GLP-1 and dual GLP-1/GIP pharmaceutical agents
            &mdash; with fewer than 5% adverse effects and no widespread
            discontinuation.
          </p>
          <div className="grid grid-cols-3 gap-6 mb-10">
            {[
              { value: "503", label: "Participants" },
              { value: "<5%", label: "Adverse Effects" },
              { value: "6 Mo", label: "Study Duration" },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-3xl font-normal text-gold font-heading">{stat.value}</div>
                <div className="text-xs text-mist uppercase tracking-wider mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
          <p className="text-xs text-mist-light leading-relaxed">
            The observational study was not a randomized controlled trial. Data
            requires appropriate scientific qualification before distribution.
          </p>
        </div>
      </section>

      {/* The Market */}
      <section className="py-24 px-6 md:px-12">
        <div className="max-w-[720px] mx-auto mb-14">
          <p className="text-[11px] font-bold uppercase tracking-[2px] text-forest-mid mb-4">
            The Market
          </p>
          <h2 className="text-3xl md:text-4xl font-normal tracking-tight leading-tight mb-6 text-ink font-heading">
            Serving the market Ozempic created.
          </h2>
          <p className="text-[17px] leading-relaxed text-mist">
            The GLP-1 drug market is projected to exceed $100B in annual revenue
            within a decade. 42 million prescriptions were written in 2024. A
            significant and growing population cannot access, afford, or
            tolerate pharmacologic therapy. No credible non-drug option has
            existed until now. NutraGLP is not competing with Ozempic. It is
            serving the market Ozempic created.
          </p>
        </div>
        <div className="max-w-[1000px] mx-auto overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="bg-forest-deep text-white">
                <th className="px-4 py-3 font-semibold rounded-tl-lg">Transaction</th>
                <th className="px-4 py-3 font-semibold">Acquirer</th>
                <th className="px-4 py-3 font-semibold">Value</th>
                <th className="px-4 py-3 font-semibold rounded-tr-lg">Signal</th>
              </tr>
            </thead>
            <tbody>
              {comparables.map((row, i) => (
                <tr key={row.transaction} className={i % 2 === 0 ? "bg-cream" : "bg-white"}>
                  <td className="px-4 py-3 font-medium text-ink">{row.transaction}</td>
                  <td className="px-4 py-3 text-mist">{row.acquirer}</td>
                  <td className="px-4 py-3 text-mist whitespace-nowrap">{row.value}</td>
                  <td className="px-4 py-3 text-mist">{row.signal}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* The Raise */}
      <section className="bg-forest-deep py-24 px-6 md:px-12">
        <div className="max-w-[720px] mx-auto">
          <p className="text-[11px] font-bold uppercase tracking-[2px] text-gold mb-4">
            The Raise
          </p>
          <h2 className="text-3xl md:text-4xl font-normal tracking-tight leading-tight mb-6 text-white font-heading">
            Seeking $5.5M seed round.
          </h2>
          <p className="text-[17px] leading-relaxed text-white/50 mb-10">
            Two-track capital strategy: direct-to-VC and strategic telehealth
            platform investment.
          </p>
          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-gold mb-4">Use of Funds</p>
              <ul className="space-y-3">
                {[
                  "Biomarker-based mechanistic validation and controlled study infrastructure",
                  "Nanoemulsion manufacturing scale and quality systems",
                  "Go-to-market execution \u2014 D2C launch and telehealth channel development",
                  "IP prosecution across 40+ patent-pending formulations",
                  "Regulatory compliance and claims substantiation",
                ].map((item) => (
                  <li key={item} className="text-sm text-white/50 leading-relaxed pl-4 border-l border-gold/30">{item}</li>
                ))}
              </ul>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-gold mb-4">Exit Thesis</p>
              <ul className="space-y-3">
                {[
                  "Strategic acquisition by consumer health, CPG, or pharmaceutical acquirer",
                  "Target horizon: Year 4",
                  "Target multiple: 12\u201318x EBITDA",
                  "Acquisition surface area: IP portfolio, nanoemulsion platform, clinical data, DTC distribution infrastructure",
                  "Comparable acquirers: Nestl\u00e9 Health Science, Bayer, Unilever, Eli Lilly, Pfizer",
                ].map((item) => (
                  <li key={item} className="text-sm text-white/50 leading-relaxed pl-4 border-l border-gold/30">{item}</li>
                ))}
              </ul>
            </div>
          </div>
          <div className="mt-16 pt-12 border-t border-white/10 text-center">
            <p className="text-xs font-semibold uppercase tracking-[2px] text-gold mb-6">Request the Deck</p>
            <InvestorDeckForm />
          </div>
        </div>
      </section>

      {/* Contact */}
      <section className="bg-forest py-20 px-6 md:px-12 text-center">
        <p className="text-[11px] font-bold uppercase tracking-[2px] text-gold mb-8">Contact</p>
        <div className="flex flex-col md:flex-row justify-center gap-8 md:gap-16">
          <div>
            <p className="text-white font-heading text-lg">Richard Clark Kaufman PhD</p>
            <p className="text-white/40 text-sm mt-1">Founder &amp; CEO</p>
            <a href="mailto:Richard@nutraglpbio.com" className="text-gold text-sm no-underline hover:text-gold-light transition">Richard@nutraglpbio.com</a>
          </div>
          <div>
            <p className="text-white font-heading text-lg">Chris McCann</p>
            <p className="text-white/40 text-sm mt-1">Co-Founder &amp; President, Commercialization</p>
            <a href="mailto:Chris@nutraglpbio.com" className="text-gold text-sm no-underline hover:text-gold-light transition">Chris@nutraglpbio.com</a>
          </div>
        </div>
      </section>

      {/* Disclaimer */}
      <section className="bg-forest-deep px-6 md:px-12 py-10">
        <p className="text-xs text-white/25 leading-relaxed text-center max-w-[720px] mx-auto">
          NutraGLP Biosciences products are dietary supplements. They are not
          intended to diagnose, treat, cure, or prevent any disease. The
          observational study referenced on this page was not a randomized
          controlled trial and requires appropriate scientific qualification
          before distribution. Forward-looking statements regarding market size,
          exit valuation, and acquisition timelines involve risk and
          uncertainty. This page does not constitute an offer to sell or
          solicitation of an offer to buy any securities. &copy; 2026 NutraGLP
          Biosciences. All rights reserved.
        </p>
      </section>

      <Footer />
    </main>
  );
}
