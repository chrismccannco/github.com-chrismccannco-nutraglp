import type { Metadata } from "next";
import Link from "next/link";
import WaitlistForm from "../components/WaitlistForm";
import FadeIn from "../components/FadeIn";
import Footer from "../components/Footer";

export const metadata: Metadata = {
  title: "The Science",
  description:
    "How NutraGLP activates endogenous GLP-1 and GIP production through 13 complementary metabolic pathways using a patent-pending nanoemulsion delivery system.",
  alternates: {
    canonical: "https://nutraglp.com/science",
  },
};

const pathways = [
  {
    category: "GLP-1 & GIP Activation",
    items: [
      {
        name: "AMPK-Mediated L-Cell Activation",
        action: "Stimulates GLP-1 secretion from intestinal L-cells via AMPK pathway activation",
        evidence: "Multiple RCTs demonstrate significant increases in postprandial GLP-1 levels",
      },
      {
        name: "Insulin Receptor Sensitization",
        action: "Enhances insulin receptor sensitivity and supports glucose-dependent GLP-1 release",
        evidence: "Established GRAS compound with extensive clinical literature on glucose metabolism",
      },
      {
        name: "GPR120 Receptor Activation",
        action: "Activates GPR120 receptors on L-cells, triggering GLP-1 and GIP secretion",
        evidence: "Published mechanisms via free fatty acid receptor pathways",
      },
    ],
  },
  {
    category: "DPP-4 Inhibition",
    items: [
      {
        name: "Natural DPP-4 Inhibitors",
        action: "Extend the half-life of endogenously produced GLP-1 by inhibiting enzymatic degradation",
        evidence: "Compounds with demonstrated in vitro DPP-4 inhibitory activity",
      },
    ],
  },
  {
    category: "Complementary Metabolic Support",
    items: [
      {
        name: "Insulin Sensitivity Enhancement",
        action: "Multiple pathways supporting glucose uptake and GLUT4 translocation",
        evidence: "Synergistic effects documented across formula components",
      },
      {
        name: "Appetite Regulation",
        action: "GLP-1-mediated satiety signaling through the gut-brain axis",
        evidence: "Downstream effect of increased endogenous GLP-1 production",
      },
      {
        name: "Lipid Metabolism",
        action: "AMPK-mediated fatty acid oxidation and triglyceride reduction",
        evidence: "Multiple formula compounds demonstrate lipid-modulating effects through complementary pathways",
      },
    ],
  },
];

const platformSteps = [
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

const productLines = [
  {
    name: "Slim SHOT",
    category: "Weight Management",
    status: "Launched",
    statusColor: "bg-gold",
    desc: "GLP-1 amplification for appetite regulation and metabolic rate. First product to market. D2C channel live.",
  },
  {
    name: "MetaSync",
    category: "Metabolic Health",
    status: "In Development",
    statusColor: "bg-forest-mid",
    desc: "Targeted formulation for glucose regulation, insulin sensitivity, and metabolic syndrome markers. Same platform, different signaling emphasis.",
  },
  {
    name: "NeuroSync",
    category: "Cognitive Function",
    status: "In Development",
    statusColor: "bg-forest-mid",
    desc: "GLP-1 receptor activation in the CNS supports neuroprotective pathways. Emerging research links incretin signaling to cognitive resilience.",
  },
  {
    name: "LongevSync",
    category: "Longevity",
    status: "In Development",
    statusColor: "bg-forest-mid",
    desc: "AMPK and mTOR pathway modulation for cellular repair and metabolic aging. The same core mechanisms, optimized for healthspan extension.",
  },
];

const deliverySteps = [
  {
    step: "1",
    title: "Encapsulate",
    desc: "Active compounds are encased in lipid-based nanoparticles. Particle size under 200nm. Protected from enzymatic degradation in the GI tract.",
  },
  {
    step: "2",
    title: "Absorb",
    desc: "Nanoparticles cross the intestinal epithelium through enhanced membrane permeability. Up to 8x bioavailability versus standard oral formats.",
  },
  {
    step: "3",
    title: "Activate",
    desc: "Compounds reach intestinal L-cells at effective concentrations. GLP-1 and GIP secretion triggered. 13 metabolic pathways engaged simultaneously.",
  },
];

export default function SciencePage() {
  return (
    <main>
      {/* Hero */}
      <section className="bg-forest-deep px-6 md:px-12 pt-28 pb-20 text-center">
        <p className="text-[10px] font-bold uppercase tracking-[1.5px] text-teal-light mb-4">
          The Science
        </p>
        <h1 className="text-[30px] md:text-[44px] font-normal text-white leading-[1.1] tracking-tight max-w-[720px] mx-auto mb-6 font-heading">
          Built on published research. Not marketing claims.
        </h1>
        <p className="text-lg text-white/50 max-w-[560px] mx-auto leading-relaxed">
          Every compound in the NutraGLP formula is backed by peer-reviewed
          studies. The nanoemulsion delivery system ensures they reach their
          target pathways at effective concentrations.
        </p>
      </section>

      {/* Thesis */}
      <FadeIn className="py-20 px-6 md:px-12 max-w-[720px] mx-auto">
        <h2 className="text-3xl md:text-4xl font-normal tracking-tight leading-tight mb-6 text-ink font-heading">
          What is endogenous GLP-1 amplification?
        </h2>
        <p className="text-[17px] leading-relaxed text-mist mb-5">
          Pharmaceutical GLP-1 receptor agonists work by introducing synthetic
          peptides that mimic natural incretin hormones. The approach is
          effective. It also requires injection, carries significant side
          effects, and costs upward of $1,000 per month.
        </p>
        <p className="text-[17px] leading-relaxed text-mist mb-5">
          NutraGLP takes a different approach. Rather than replacing the body&apos;s
          incretin production with synthetic analogs, the formula is designed to
          amplify the GLP-1 and GIP your gut already produces, while extending
          the window those hormones remain active by inhibiting DPP-4, the
          enzyme responsible for their degradation.
        </p>
        <p className="text-[17px] leading-relaxed text-mist">
          This is not a single-mechanism product. GLP-1 signaling is part of a
          larger metabolic system. NutraGLP engages 13 distinct pathways across
          incretin amplification, enzyme inhibition, insulin sensitivity, appetite
          regulation, glucose uptake, and lipid metabolism.
        </p>
      </FadeIn>

      <hr className="max-w-[720px] mx-auto border-t border-rule" />

      {/* ─── PLATFORM ARCHITECTURE ─── */}
      <section className="py-24 px-6 md:px-12 bg-cream-warm">
        <FadeIn className="max-w-[960px] mx-auto">
          <p className="text-[11px] font-bold uppercase tracking-[2px] text-forest-mid mb-4">
            Platform Architecture
          </p>
          <h2 className="text-3xl md:text-4xl font-normal tracking-tight leading-tight mb-4 text-ink font-heading">
            One platform. Three mechanisms. Four product lines.
          </h2>
          <p className="text-[17px] leading-relaxed text-mist mb-14 max-w-[640px]">
            Every NutraGLP product runs on the same coordinated architecture.
            The platform is the invention, not any single compound.
          </p>

          {/* Activate → Protect → Deliver */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            {platformSteps.map((card, i) => (
              <div key={card.title} className="border border-rule rounded-xl p-7 bg-white relative">
                {i < platformSteps.length - 1 && (
                  <div className="hidden md:block absolute top-1/2 -right-3 w-6 text-center text-rule text-lg">
                    &rarr;
                  </div>
                )}
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
        </FadeIn>
      </section>

      {/* ─── PRODUCT PIPELINE ─── */}
      <section className="py-24 px-6 md:px-12 bg-forest-deep">
        <FadeIn className="max-w-[960px] mx-auto">
          <p className="text-[10px] font-bold uppercase tracking-[1.5px] text-teal-light mb-4">
            Product Pipeline
          </p>
          <h2 className="text-[26px] md:text-[36px] font-normal tracking-tight leading-tight mb-6 text-white font-heading">
            Four verticals. 40+ patent-pending formulations.
          </h2>
          <p className="text-[17px] leading-relaxed text-white/50 mb-14 max-w-[640px]">
            The same core mechanisms, each optimized for a different therapeutic
            target. Shared delivery IP across all product lines.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {productLines.map((product) => (
              <div
                key={product.name}
                className="p-7 bg-white/[0.04] border border-white/[0.08] rounded-xl"
              >
                <div className="flex items-center gap-3 mb-4">
                  <span className={`inline-block w-2 h-2 rounded-full ${product.statusColor}`} />
                  <span className="text-[11px] font-bold uppercase tracking-wider text-white/40">
                    {product.status}
                  </span>
                </div>
                <p className="text-[11px] font-bold uppercase tracking-wider text-teal-light/60 mb-1">
                  {product.category}
                </p>
                <p className="text-[20px] font-semibold text-white tracking-tight mb-3">
                  {product.name}
                </p>
                <p className="text-[15px] leading-relaxed text-white/40">
                  {product.desc}
                </p>
              </div>
            ))}
          </div>
        </FadeIn>
      </section>

      {/* Pathway Detail */}
      <section className="py-20 px-6 md:px-12 max-w-[1000px] mx-auto">
        <h2 className="text-3xl md:text-4xl font-normal tracking-tight leading-tight mb-4 text-ink font-heading">
          Which metabolic pathways does NutraGLP target?
        </h2>
        <p className="text-[17px] leading-relaxed text-mist mb-12 max-w-[640px]">
          The formula targets three primary mechanisms, each supported by
          multiple active compounds working in concert.
        </p>

        {pathways.map((group) => (
          <div key={group.category} className="mb-12">
            <p className="text-[11px] font-bold uppercase tracking-[2px] text-forest-mid mb-6">
              {group.category}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {group.items.map((item) => (
                <div
                  key={item.name}
                  className="p-6 bg-white border border-rule rounded-xl"
                >
                  <h3 className="text-[18px] font-semibold tracking-tight mb-2 text-ink">
                    {item.name}
                  </h3>
                  <p className="text-sm text-mist leading-relaxed mb-3">
                    {item.action}
                  </p>
                  <p className="text-xs text-mist-light leading-relaxed italic">
                    {item.evidence}
                  </p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </section>

      <hr className="max-w-[720px] mx-auto border-t border-rule" />

      {/* ─── NANOEMULSION DELIVERY ─── */}
      <section className="py-20 px-6 md:px-12">
        <div className="max-w-[720px] mx-auto">
          <h2 className="text-3xl md:text-4xl font-normal tracking-tight leading-tight mb-6 text-ink font-heading">
            Why do most oral supplements fail at absorption?
          </h2>
          <p className="text-[17px] leading-relaxed text-mist mb-5">
            Most oral nutraceuticals fail at absorption. The compounds may have
            demonstrated efficacy in vitro or in clinical studies, but they never
            reach their target pathways at meaningful concentrations when taken as
            a standard oral supplement. Bioavailability is the bottleneck.
          </p>
          <p className="text-[17px] leading-relaxed text-mist mb-5">
            NutraGLP uses a patent-pending nanoemulsion delivery system that
            encapsulates active compounds in lipid-based nanoparticles. This
            increases surface area, protects against enzymatic degradation in the
            GI tract, and enhances cellular uptake through improved membrane
            permeability.
          </p>
          <p className="text-[17px] leading-relaxed text-mist mb-12">
            <strong className="text-ink font-semibold">
              The science only matters if it gets where it needs to go.
            </strong>{" "}
            The nanoemulsion is the mechanism that closes the gap between
            published research and real-world metabolic effect.
          </p>

          {/* Delivery steps visual */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-0 mb-12">
            {deliverySteps.map((s, i) => (
              <div key={s.title} className="relative pb-8 md:pb-0">
                {/* Connector */}
                {i < deliverySteps.length - 1 && (
                  <div className="hidden md:block absolute top-5 right-0 w-full h-px bg-rule" style={{ left: "50%" }} />
                )}
                <div className="flex md:flex-col items-start md:items-center gap-4 md:gap-0 md:text-center">
                  {/* Number circle */}
                  <div className="w-10 h-10 rounded-full bg-forest-deep text-teal-light font-heading text-[18px] flex items-center justify-center flex-shrink-0 relative z-10">
                    {s.step}
                  </div>
                  <div className="md:mt-4">
                    <p className="text-[16px] font-semibold tracking-tight text-ink mb-2">
                      {s.title}
                    </p>
                    <p className="text-[14px] leading-relaxed text-mist">
                      {s.desc}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex flex-wrap gap-6">
            <Link
              href="/slim-shot"
              className="text-sm text-forest-mid hover:text-forest transition no-underline border-b border-forest-mid/30 pb-0.5"
            >
              See the full Slim SHOT formula &rarr;
            </Link>
            <Link
              href="/faq"
              className="text-sm text-forest-mid hover:text-forest transition no-underline border-b border-forest-mid/30 pb-0.5"
            >
              Common questions about GLP-1 &rarr;
            </Link>
          </div>
        </div>
      </section>

      {/* Standards */}
      <section className="bg-forest-deep bg-line-texture py-20 px-6 md:px-12">
        <div className="max-w-[720px] mx-auto">
          <p className="text-[10px] font-bold uppercase tracking-[1.5px] text-teal-light mb-4">
            Quality & Compliance
          </p>
          <h2 className="text-3xl md:text-4xl font-normal tracking-tight leading-tight mb-6 text-white font-heading">
            How does NutraGLP meet quality and safety standards?
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-8">
            {[
              { label: "GRAS Certified", desc: "All compounds hold Generally Recognized as Safe status" },
              { label: "Patent Pending", desc: "Proprietary nanoemulsion formulation and delivery system" },
              { label: "Third-Party Tested", desc: "Independent verification of purity, potency, and composition" },
              { label: "cGMP Manufactured", desc: "Produced in facilities meeting current Good Manufacturing Practice standards" },
            ].map((item) => (
              <div key={item.label} className="p-6 bg-white/[0.04] border border-white/[0.08] rounded-xl">
                <p className="text-[15px] font-bold text-white mb-1">{item.label}</p>
                <p className="text-sm text-white/40 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-forest py-16 px-6 md:px-12 text-center">
        <h2 className="text-3xl md:text-4xl font-normal text-white tracking-tight mb-4 font-heading">
          Questions about the science?
        </h2>
        <p className="text-[17px] text-white/50 max-w-[480px] mx-auto mb-6">
          Join the waitlist. We&apos;ll send the full science brief and clinical references.
        </p>
        <WaitlistForm variant="cta" />
        <div className="mt-6">
          <Link
            href="/"
            className="text-white/40 text-sm hover:text-white/70 transition no-underline"
          >
            &larr; Back to home
          </Link>
        </div>
      </section>

      <Footer />
    </main>
  );
}
