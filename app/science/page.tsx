import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import WaitlistForm from "../components/WaitlistForm";
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

export default function SciencePage() {
  return (
    <main>
      {/* Hero */}
      <section className="bg-forest-deep px-6 md:px-12 pt-28 pb-20 text-center">
        <p className="text-[11px] font-bold uppercase tracking-[2px] text-gold mb-4">
          The Science
        </p>
        <h1
          className="text-3xl md:text-[48px] font-normal text-white leading-[1.1] tracking-tight max-w-[720px] mx-auto mb-6"
          style={{ fontFamily: "'Fraunces', Georgia, serif" }}
        >
          Built on published research. Not marketing claims.
        </h1>
        <p className="text-lg text-white/50 max-w-[560px] mx-auto leading-relaxed">
          Every compound in the NutraGLP formula is backed by peer-reviewed
          studies. The nanoemulsion delivery system ensures they reach their
          target pathways at effective concentrations.
        </p>
      </section>

      {/* Thesis */}
      <section className="py-20 px-6 md:px-12 max-w-[720px] mx-auto">
        <h2
          className="text-2xl md:text-3xl font-normal tracking-tight leading-tight mb-6 text-ink"
          style={{ fontFamily: "'Fraunces', Georgia, serif" }}
        >
          What is endogenous GLP-1 activation?
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
          incretin activation, enzyme inhibition, insulin sensitivity, appetite
          regulation, glucose uptake, and lipid metabolism.
        </p>
      </section>

      <hr className="max-w-[720px] mx-auto border-t border-rule" />

      {/* Pathway Detail */}
      <section className="py-20 px-6 md:px-12 max-w-[1000px] mx-auto">
        <h2
          className="text-2xl md:text-3xl font-normal tracking-tight leading-tight mb-4 text-ink"
          style={{ fontFamily: "'Fraunces', Georgia, serif" }}
        >
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
                  <h3 className="text-[16px] font-bold tracking-tight mb-2 text-ink">
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

      {/* Nanoemulsion */}
      <section className="py-20 px-6 md:px-12 max-w-[720px] mx-auto">
        <h2
          className="text-2xl md:text-3xl font-normal tracking-tight leading-tight mb-6 text-ink"
          style={{ fontFamily: "'Fraunces', Georgia, serif" }}
        >
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
        <p className="text-[17px] leading-relaxed text-mist mb-8">
          <strong className="text-ink font-semibold">
            The science only matters if it gets where it needs to go.
          </strong>{" "}
          The nanoemulsion is the mechanism that closes the gap between
          published research and real-world metabolic effect.
        </p>

        {/* Mechanism diagram */}
        <div className="mb-10">
          <Image
            src="/images/mechanism-diagram.png"
            alt="How the NutraGLP nanoemulsion works: active compounds are encapsulated in lipid nanoparticles, absorbed through intestinal L-cells, triggering GLP-1 release and metabolic effects across 13 pathways"
            width={1920}
            height={840}
            className="w-full h-auto rounded-xl border border-rule"
          />
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
      </section>

      {/* Standards */}
      <section className="bg-forest-deep bg-line-texture py-20 px-6 md:px-12">
        <div className="max-w-[720px] mx-auto">
          <p className="text-[11px] font-bold uppercase tracking-[2px] text-gold mb-4">
            Quality & Compliance
          </p>
          <h2
            className="text-2xl md:text-3xl font-normal tracking-tight leading-tight mb-6 text-white"
            style={{ fontFamily: "'Fraunces', Georgia, serif" }}
          >
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
        <h2
          className="text-2xl md:text-3xl font-normal text-white tracking-tight mb-4"
          style={{ fontFamily: "'Fraunces', Georgia, serif" }}
        >
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
