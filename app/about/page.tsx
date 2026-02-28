import type { Metadata } from "next";
import Link from "next/link";
import Footer from "../components/Footer";

export const metadata: Metadata = {
  title: "About",
  description:
    "Meet the team behind NutraGLP. Building the platform layer between pharmaceutical GLP-1 drugs and the supplement aisle with patent-pending nanoemulsion technology.",
  alternates: {
    canonical: "https://nutraglp.com/about",
  },
};

const personSchema = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "[Founder Name]",
  jobTitle: "Founder & CEO",
  worksFor: {
    "@type": "Organization",
    name: "NutraGLP",
    url: "https://nutraglp.com",
  },
  description:
    "Founder and CEO of NutraGLP. Background in metabolic science and nutraceutical product development. Leading development of patent-pending nanoemulsion delivery systems for natural GLP-1 activation.",
};

export default function AboutPage() {
  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
      />

      {/* Hero */}
      <section className="bg-forest-deep px-6 md:px-12 pt-28 pb-20 text-center">
        <p className="text-[11px] font-bold uppercase tracking-[2px] text-gold mb-4">
          About
        </p>
        <h1
          className="text-3xl md:text-[48px] font-normal text-white leading-[1.1] tracking-tight max-w-[720px] mx-auto mb-6"
          style={{ fontFamily: "'Fraunces', Georgia, serif" }}
        >
          The team behind NutraGLP
        </h1>
        <p className="text-lg text-white/50 max-w-[560px] mx-auto leading-relaxed">
          Building the platform layer between pharmaceutical GLP-1 drugs and
          the supplement aisle.
        </p>
      </section>

      {/* Founder */}
      <section className="py-24 px-6 md:px-12">
        <div className="max-w-[720px] mx-auto">
          <div className="md:flex md:gap-12 md:items-start">
            {/* Photo placeholder */}
            <div className="w-[160px] h-[160px] rounded-xl bg-white border border-rule flex items-center justify-center shrink-0 mb-8 md:mb-0">
              <div className="text-center">
                <div
                  className="text-4xl text-forest-mid/20 mb-1"
                  style={{ fontFamily: "'Fraunces', Georgia, serif" }}
                >
                  ?
                </div>
                <p className="text-[9px] text-mist-light uppercase tracking-wider">Photo</p>
              </div>
            </div>

            <div>
              <p className="text-[11px] font-bold uppercase tracking-[2px] text-forest-mid mb-3">
                Founder &amp; CEO
              </p>
              <h2
                className="text-2xl md:text-3xl font-normal tracking-tight text-ink mb-4"
                style={{ fontFamily: "'Fraunces', Georgia, serif" }}
              >
                [Founder Name]
              </h2>
              <div className="space-y-4 text-[16px] leading-[1.75] text-mist">
                <p>
                  [Placeholder: 2-3 sentences about the founder&apos;s background.
                  What led them to metabolic health. Professional experience
                  relevant to building a nutraceutical company. Keep it factual,
                  not promotional.]
                </p>
                <p>
                  [Placeholder: The origin of NutraGLP. The observation or
                  problem that started it. The thesis: that the bioavailability
                  problem is solvable, and that endogenous GLP-1 activation is a
                  viable complement to pharmaceutical approaches.]
                </p>
                <p>
                  [Placeholder: What they are focused on now. The nanoemulsion
                  platform, the regulatory pathway, the team they are building.
                  A sentence about what drives them. End there.]
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <hr className="max-w-[720px] mx-auto border-t border-rule" />

      {/* Company thesis */}
      <section className="py-24 px-6 md:px-12">
        <div className="max-w-[720px] mx-auto">
          <p className="text-[11px] font-bold uppercase tracking-[2px] text-forest-mid mb-4">
            The Thesis
          </p>
          <h2
            className="text-2xl md:text-3xl font-normal tracking-tight leading-tight mb-6 text-ink"
            style={{ fontFamily: "'Fraunces', Georgia, serif" }}
          >
            The supplement aisle has a delivery problem, not a formulation
            problem.
          </h2>
          <div className="space-y-4 text-[16px] leading-[1.75] text-mist">
            <p>
              The compounds that activate natural GLP-1 production have
              published clinical evidence. AMPK activation stimulates L-cell
              secretion. GPR120 receptor signaling triggers incretin release.
              Insulin receptor sensitization supports glucose-dependent GLP-1
              output. The mechanisms are characterized. The pathways are mapped.
            </p>
            <p>
              The gap between what the research shows and what consumers
              experience is bioavailability. Standard oral supplements lose 95%
              or more of their active compounds to stomach acid degradation,
              poor intestinal absorption, and first-pass liver metabolism. The
              compounds work. The delivery does not.
            </p>
            <p>
              NutraGLP exists to solve the delivery problem. The patent-pending
              nanoemulsion platform encapsulates active compounds in lipid-based
              nanoparticles that survive the GI tract, cross the intestinal
              membrane, and reach their target metabolic pathways at effective
              concentrations. Not by increasing the dose. By ensuring the dose
              arrives.
            </p>
          </div>
        </div>
      </section>

      {/* Quality */}
      <section className="py-20 px-6 md:px-12 bg-cream-warm">
        <div className="max-w-[720px] mx-auto">
          <p className="text-[11px] font-bold uppercase tracking-[2px] text-forest-mid mb-4">
            Standards
          </p>
          <h2
            className="text-2xl md:text-3xl font-normal tracking-tight leading-tight mb-8 text-ink"
            style={{ fontFamily: "'Fraunces', Georgia, serif" }}
          >
            How the product is made
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              {
                label: "GRAS Certified",
                desc: "Every active compound holds Generally Recognized as Safe status at the dosages used in the formula.",
              },
              {
                label: "cGMP Manufacturing",
                desc: "Produced in FDA-registered, cGMP-certified facilities with documented quality controls at every stage.",
              },
              {
                label: "Third-Party Testing",
                desc: "Independent lab verification of purity, potency, and composition for every batch before release.",
              },
              {
                label: "Patent-Pending Platform",
                desc: "The nanoemulsion delivery system is protected by patent-pending intellectual property covering formulation and process.",
              },
            ].map((item) => (
              <div
                key={item.label}
                className="p-6 bg-white border border-rule rounded-xl"
              >
                <p className="text-[13px] font-bold text-ink mb-2">{item.label}</p>
                <p className="text-sm text-mist leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Parent company */}
      <section className="py-16 px-6 md:px-12">
        <div className="max-w-[720px] mx-auto text-center">
          <p className="text-sm text-mist">
            NutraGLP is a brand of{" "}
            <span className="text-ink font-semibold">NanoAlchemie</span>, a
            nanoemulsion technology company developing next-generation delivery
            systems for bioactive compounds.
          </p>
        </div>
      </section>

      {/* Cross-links */}
      <section className="py-12 px-6 md:px-12 border-t border-rule">
        <div className="max-w-[720px] mx-auto flex flex-wrap gap-6">
          <Link
            href="/slim-shot"
            className="text-sm text-forest-mid hover:text-forest transition no-underline border-b border-forest-mid/30 pb-0.5"
          >
            Slim SHOT product details &rarr;
          </Link>
          <Link
            href="/science"
            className="text-sm text-forest-mid hover:text-forest transition no-underline border-b border-forest-mid/30 pb-0.5"
          >
            The science &rarr;
          </Link>
          <Link
            href="/blog"
            className="text-sm text-forest-mid hover:text-forest transition no-underline border-b border-forest-mid/30 pb-0.5"
          >
            Research &amp; insights &rarr;
          </Link>
        </div>
      </section>

      <Footer />
    </main>
  );
}
