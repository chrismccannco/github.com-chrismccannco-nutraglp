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
  { value: "$132B", label: "Total Addressable Market" },
  { value: "40+", label: "Patent-Pending Formulations" },
  { value: "4", label: "Product Lines" },
  { value: "$5.5M", label: "Seed Round" },
];

const comparables = [
  {
    transaction: "Metsera",
    acquirer: "Pfizer",
    value: "$10B",
    signal: "Oral GLP-1 pipeline acquisition at pre-revenue stage",
  },
  {
    transaction: "Carmot Therapeutics",
    acquirer: "Roche",
    value: "$2.7B",
    signal: "GLP-1/GIP dual agonist platform with Phase I data",
  },
  {
    transaction: "Inversago Pharma",
    acquirer: "Novo Nordisk",
    value: "$1.1B",
    signal: "CB1 receptor inverse agonist for metabolic disease",
  },
  {
    transaction: "Gelesis",
    acquirer: "Acquired (recap)",
    value: "$400M+",
    signal: "Non-pharma weight management device/supplement hybrid",
  },
];

const platformCards = [
  {
    step: "01",
    title: "Activate",
    body: "Four GRAS-certified active systems stimulate endogenous GLP-1 and GIP production through AMPK activation, GPR120 signaling, and insulin receptor sensitization.",
  },
  {
    step: "02",
    title: "Protect",
    body: "Natural DPP-4 inhibitors extend the active life of endogenous GLP-1. More hormone. Longer metabolic window. No synthetic peptides.",
  },
  {
    step: "03",
    title: "Deliver",
    body: "Patent-pending nanoemulsion technology achieves up to 8x bioavailability over standard oral formats. The delivery system is the second moat.",
  },
];

export default function Investors() {
  return (
    <main>
      {/* ─── HERO ─── */}
      <section className="bg-forest-deep px-6 md:px-12 pt-28 pb-20 text-center">
        <p className="text-[11px] font-bold uppercase tracking-[3px] text-gold/70 mb-6">
          NutraGLP Biosciences
        </p>
        <h1 className="text-4xl md:text-[56px] font-normal text-white leading-[1.08] tracking-tight max-w-[820px] mx-auto mb-6 font-heading">
          Your body already makes GLP-1.
          <br />
          <span className="text-gold italic">We make it work harder.</span>
        </h1>
        <p className="text-[17px] leading-relaxed text-white/50 max-w-[540px] mx-auto mb-10">
          A biotechnology platform for natural incretin modulation. Raising
          $5.5M to bring it to market.
        </p>
        <a
          href="#request-deck"
          className="inline-block px-8 py-3.5 text-[15px] font-bold rounded-md bg-gold text-white hover:bg-gold-light transition"
        >
          Request the Deck
        </a>
      </section>

      {/* ─── METRICS BAR ─── */}
      <section className="bg-forest px-6 md:px-12 py-8 flex justify-center gap-8 sm:gap-16 flex-wrap">
        {metrics.map((s) => (
          <div key={s.label} className="text-center">
            <div className="text-[36px] md:text-[44px] font-normal tracking-tight text-gold font-heading leading-none">
              {s.value}
            </div>
            <div className="text-[11px] text-white/50 uppercase tracking-wider mt-1.5">
              {s.label}
            </div>
          </div>
        ))}
      </section>

      {/* ─── THE PLATFORM ─── */}
      <section className="py-24 px-6 md:px-12">
        <div className="max-w-[720px] mx-auto mb-14">
          <p className="text-[11px] font-bold uppercase tracking-[2px] text-forest-mid mb-4">
            The Platform
          </p>
          <h2 className="text-[26px] md:text-[36px] font-normal tracking-tight leading-tight mb-6 text-ink font-heading">
            Not a supplement company.
          </h2>
          <p className="text-[17px] leading-relaxed text-mist mb-5">
            NutraGLP is a biotechnology platform occupying a new product category
            at the intersection of pharmaceuticals, foods, and dietary
            supplements. The platform activates endogenous GLP-1 and GIP
            production through a coordinated architecture of 13 validated
            signaling targets.
          </p>
          <p className="text-[17px] leading-relaxed text-mist">
            The moat is the architecture, not any single ingredient. Defended
            through 40+ patent-pending formulations, platform-level delivery
            technology, and system design IP.
          </p>
        </div>
        <div className="max-w-[960px] mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
          {platformCards.map((card) => (
            <div
              key={card.title}
              className="border border-rule rounded-xl p-7 relative"
            >
              <span className="text-[11px] font-bold text-forest-mid/40 uppercase tracking-wider">
                {card.step}
              </span>
              <p className="text-[18px] font-semibold tracking-tight text-ink mt-2 mb-3">
                {card.title}
              </p>
              <p className="text-[15px] leading-relaxed text-mist">
                {card.body}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ─── IP & DEFENSIBILITY ─── */}
      <section className="py-24 px-6 md:px-12 bg-forest-deep">
        <div className="max-w-[720px] mx-auto">
          <p className="text-[11px] font-bold uppercase tracking-[2px] text-gold mb-4">
            IP &amp; Defensibility
          </p>
          <h2 className="text-[26px] md:text-[36px] font-normal tracking-tight leading-tight mb-6 text-white font-heading">
            Three layers of protection.
          </h2>
          <p className="text-[17px] leading-relaxed text-white/50 mb-12">
            The IP strategy is designed to create compounding defensibility. Each
            layer reinforces the others. A competitor cannot replicate the
            platform by copying a single formulation.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "Formulation IP",
                stat: "40+",
                statLabel: "patent-pending",
                body: "Multi-compound synergistic formulations across weight management, metabolic health, cognitive function, and longevity.",
              },
              {
                title: "Delivery IP",
                stat: "8x",
                statLabel: "bioavailability",
                body: "Proprietary nanoemulsion system. Protected independently from the active formulations it carries.",
              },
              {
                title: "System Design IP",
                stat: "13",
                statLabel: "signaling targets",
                body: "The coordinated activation architecture itself is the invention. Targeting multiple pathways simultaneously is the mechanism of action.",
              },
            ].map((card) => (
              <div key={card.title}>
                <div className="text-[36px] font-normal text-gold font-heading leading-none mb-1">
                  {card.stat}
                </div>
                <p className="text-[11px] text-gold/60 uppercase tracking-wider mb-4">
                  {card.statLabel}
                </p>
                <p className="text-[15px] font-semibold text-white mb-2">
                  {card.title}
                </p>
                <p className="text-[15px] leading-relaxed text-white/40">
                  {card.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── PROOF OF CONCEPT ─── */}
      <section className="py-24 px-6 md:px-12 bg-cream-warm">
        <div className="max-w-[720px] mx-auto">
          <p className="text-[11px] font-bold uppercase tracking-[2px] text-forest-mid mb-4">
            Proof of Concept
          </p>
          <h2 className="text-[26px] md:text-[36px] font-normal tracking-tight leading-tight mb-6 text-ink font-heading">
            503-person observational trial.
          </h2>
          <p className="text-[17px] leading-relaxed text-mist mb-10">
            A 503-person observational trial of a licensed NutraGLP formulation
            demonstrated weight loss outcomes after 6 months that exceeded
            results reported for GLP-1 and dual GLP-1/GIP pharmaceutical agents,
            with fewer than 5% adverse effects and no widespread
            discontinuation.
          </p>
          <div className="grid grid-cols-3 gap-6 mb-10">
            {[
              { value: "503", label: "Participants" },
              { value: "<5%", label: "Adverse Effects" },
              { value: "6 Mo", label: "Study Duration" },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-[36px] md:text-[44px] font-normal text-gold font-heading leading-none">
                  {stat.value}
                </div>
                <div className="text-[11px] text-mist uppercase tracking-wider mt-2">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
          <p className="text-xs text-mist-light leading-relaxed">
            The observational study was not a randomized controlled trial. Data
            requires appropriate scientific qualification before distribution.
          </p>
        </div>
      </section>

      {/* ─── THE MARKET ─── */}
      <section className="py-24 px-6 md:px-12">
        <div className="max-w-[720px] mx-auto mb-14">
          <p className="text-[11px] font-bold uppercase tracking-[2px] text-forest-mid mb-4">
            The Market
          </p>
          <h2 className="text-[26px] md:text-[36px] font-normal tracking-tight leading-tight mb-6 text-ink font-heading">
            Serving the market Ozempic created.
          </h2>
          <p className="text-[17px] leading-relaxed text-mist">
            The GLP-1 drug market is projected to exceed $100B in annual revenue
            within a decade. 42 million prescriptions were written in 2024. A
            significant and growing population cannot access, afford, or
            tolerate pharmacologic therapy. No credible non-drug option has
            existed until now.
          </p>
        </div>
        <div className="max-w-[1000px] mx-auto overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="bg-forest-deep text-white">
                <th className="px-4 py-3 font-semibold rounded-tl-lg">
                  Transaction
                </th>
                <th className="px-4 py-3 font-semibold">Acquirer</th>
                <th className="px-4 py-3 font-semibold">Value</th>
                <th className="px-4 py-3 font-semibold rounded-tr-lg">
                  Signal
                </th>
              </tr>
            </thead>
            <tbody>
              {comparables.map((row, i) => (
                <tr
                  key={row.transaction}
                  className={i % 2 === 0 ? "bg-cream" : "bg-white"}
                >
                  <td className="px-4 py-3 font-medium text-ink">
                    {row.transaction}
                  </td>
                  <td className="px-4 py-3 text-mist">{row.acquirer}</td>
                  <td className="px-4 py-3 text-mist whitespace-nowrap">
                    {row.value}
                  </td>
                  <td className="px-4 py-3 text-mist">{row.signal}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* ─── THE RAISE ─── */}
      <section className="bg-forest-deep py-24 px-6 md:px-12">
        <div className="max-w-[720px] mx-auto">
          <p className="text-[11px] font-bold uppercase tracking-[2px] text-gold mb-4">
            The Raise
          </p>
          <h2 className="text-[26px] md:text-[36px] font-normal tracking-tight leading-tight mb-6 text-white font-heading">
            Seeking $5.5M seed round.
          </h2>
          <p className="text-[17px] leading-relaxed text-white/50 mb-10">
            Two-track capital strategy: direct-to-VC and strategic telehealth
            platform investment.
          </p>

          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-gold mb-4">
                Use of Funds
              </p>
              <ul className="space-y-3">
                {[
                  "Biomarker-based mechanistic validation and controlled study infrastructure",
                  "Nanoemulsion manufacturing scale and quality systems",
                  "Go-to-market execution, D2C launch and telehealth channel development",
                  "IP prosecution across 40+ patent-pending formulations",
                  "Regulatory compliance and claims substantiation",
                ].map((item) => (
                  <li
                    key={item}
                    className="text-[15px] text-white/50 leading-relaxed pl-4 border-l border-gold/30"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-gold mb-4">
                Exit Thesis
              </p>
              <ul className="space-y-3">
                {[
                  "Strategic acquisition by consumer health, CPG, or pharmaceutical acquirer",
                  "Target horizon: Year 4",
                  "Target multiple: 12–18x EBITDA",
                  "Acquisition surface area: IP portfolio, nanoemulsion platform, clinical data, DTC distribution infrastructure",
                  "Comparable acquirers: Nestlé Health Science, Bayer, Unilever, Eli Lilly, Pfizer",
                ].map((item) => (
                  <li
                    key={item}
                    className="text-[15px] text-white/50 leading-relaxed pl-4 border-l border-gold/30"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div
            id="request-deck"
            className="mt-16 pt-12 border-t border-white/10 text-center scroll-mt-24"
          >
            <p className="text-[11px] font-bold uppercase tracking-[2px] text-gold mb-6">
              Request the Deck
            </p>
            <InvestorDeckForm />
          </div>
        </div>
      </section>

      {/* ─── BOTTOM CTA ─── */}
      <section className="bg-forest py-20 px-6 md:px-12 text-center">
        <h2 className="text-[26px] md:text-[36px] font-normal text-white tracking-tight mb-4 font-heading">
          Raising $5.5M seed.
        </h2>
        <p className="text-[17px] text-white/50 max-w-[520px] mx-auto mb-8">
          For the full deck, clinical data, and a conversation about what
          we&apos;re building.
        </p>
        <a
          href="#request-deck"
          className="inline-block px-8 py-3.5 text-[15px] font-bold rounded-md bg-gold text-white hover:bg-gold-light transition"
        >
          Request the Deck
        </a>
      </section>

      <Footer />
    </main>
  );
}
