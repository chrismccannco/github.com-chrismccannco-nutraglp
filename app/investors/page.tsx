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
  { value: "30+", label: "Patent-Pending Formulations" },
  { value: "4", label: "Product Lines" },
  { value: "$5.5M", label: "Seed Round" },
];

export default function Investors() {
  return (
    <main>
      <section className="bg-forest-deep px-6 md:px-12 pt-28 pb-20 text-center">
        <p className="text-xs font-semibold uppercase tracking-[3px] text-gold/70 mb-6">
          NutraGLP Biosciences
        </p>
        <h1
          className="text-4xl md:text-[56px] font-normal text-white leading-[1.08] tracking-tight max-w-[820px] mx-auto mb-6 font-heading"
         
        >
          Your body already makes GLP-1.
          <br />
          <span className="text-gold italic">natural incretin modulation</span>
        </h1>
      </section>

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
            <div
              key={card.title}
              className="border border-rule rounded-xl p-6"
            >
              <p className="text-sm font-semibold text-ink mb-2">
                {card.title}
              </p>
              <p className="text-sm leading-relaxed text-mist">{card.body}</p>
            </div>
          ))}
        </div>
      </section>

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
                <div className="text-3xl font-normal text-gold font-heading">
                  {stat.value}
                </div>
                <div className="text-xs text-mist uppercase tracking-wider mt-1">
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
              <p className="text-xs font-semibold uppercase tracking-wider text-gold mb-4">
                Use of Funds
              </p>
              <ul className="space-y-3">
                {[
                  "Biomarker-based mechanistic validation and controlled study infrastructure",
                  "Nanoemulsion manufacturing scale and quality systems",
                  "Go-to-market execution — D2C launch and telehealth channel development",
                  "IP prosecution across 40+ patent-pending formulations",
                  "Regulatory compliance and claims substantiation",
                ].map((item) => (
                  <li
                    key={item}
                    className="text-sm text-white/50 leading-relaxed pl-4 border-l border-gold/30"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-gold mb-4">
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
                    className="text-sm text-white/50 leading-relaxed pl-4 border-l border-gold/30"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mt-16 pt-12 border-t border-white/10 text-center">
            <p className="text-xs font-semibold uppercase tracking-[2px] text-gold mb-6">
              Request the Deck
            </p>
            <InvestorDeckForm />
          </div>
        </div>
      </section>

      <section className="bg-forest py-20 px-6 md:px-12 text-center">
        <h2
          className="text-3xl md:text-4xl font-normal text-white tracking-tight mb-4 font-heading"
         
        >
          Raising $5.5M seed.
        </h2>
        <p className="text-[17px] text-white/50 max-w-[520px] mx-auto mb-8">
          For the full deck, clinical data, and a conversation
          about what we&apos;re building.
        </p>
      </section>

      <Footer />
    </main>
  );
}
