import type { Metadata } from "next";
import Image from "next/image";
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

const teamSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "NutraGLP",
  url: "https://nutraglp.com",
  parentOrganization: {
    "@type": "Organization",
    name: "NanoAlchemie",
  },
  member: [
    {
      "@type": "Person",
      name: "Richard Kaufman, PhD",
      jobTitle: "Founder & CEO",
      description:
        "Architect of the NutraGLP platform and IP portfolio. Inventor of patented nanoparticle delivery systems across 24+ countries. Former CSO & Co-Founder of Nanosphere Health Sciences.",
    },
    {
      "@type": "Person",
      name: "Chris McCann",
      jobTitle: "Co-Founder & President",
      description:
        "15+ years leading enterprise sales organizations across SaaS, cloud infrastructure, and emerging technology. Responsible for go-to-market strategy, capital formation, and commercial operations at NutraGLP.",
    },
  ],
};

const team = [
  {
    name: "Richard Kaufman, PhD",
    role: "Founder & CEO",
    image: "/images/richard-kaufman.jpg",
    bio: [
      "Richard built the NutraGLP platform and its underlying intellectual property portfolio. He invented the patented nanoparticle delivery systems that form the basis of the company's technology, with patent protection across 24+ countries spanning nutraceutical and pharmaceutical biotechnology applications.",
      "Before NutraGLP, Richard served as Chief Science Officer and Co-Founder of Nanosphere Health Sciences, a publicly traded nanoemulsion technology company. His work in nano-encapsulation earned the Frost & Sullivan Innovation Award.",
      "His focus now is the same problem he has studied for two decades: how to get bioactive compounds past the GI tract and into the bloodstream at concentrations that matter. The nanoemulsion platform is the answer he kept arriving at.",
    ],
  },
  {
    name: "Chris McCann",
    role: "Co-Founder & President",
    image: "/images/chris-mccann.png",
    bio: [
      "Chris spent fifteen years leading enterprise sales organizations across SaaS, cloud infrastructure, and emerging technology before co-founding NutraGLP. The pattern he observed across every category was the same: the best technology means nothing without trust.",
      "At NutraGLP he is responsible for go-to-market strategy, capital formation, and commercial operations. He builds the systems that connect the science to the market, the investors to the mission, and the product to the consumer.",
      "He also studies consciousness, identity, and the structures that shape human decision-making. That work informs how he thinks about brand, positioning, and the gap between what people want and what they are willing to try.",
    ],
  },
];

export default function AboutPage() {
  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(teamSchema) }}
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

      {/* Leadership */}
      <section className="py-24 px-6 md:px-12">
        <div className="max-w-[900px] mx-auto">
          <p className="text-[11px] font-bold uppercase tracking-[2px] text-forest-mid mb-10">
            Leadership
          </p>

          <div className="space-y-20">
            {team.map((person) => (
              <div
                key={person.name}
                className="md:flex md:gap-12 md:items-start"
              >
                <div className="w-[180px] h-[220px] rounded-xl overflow-hidden shrink-0 mb-8 md:mb-0 bg-cream-warm border border-rule">
                  <Image
                    src={person.image}
                    alt={person.name}
                    width={180}
                    height={220}
                    className="w-full h-full object-cover object-top"
                  />
                </div>

                <div>
                  <p className="text-[11px] font-bold uppercase tracking-[2px] text-forest-mid mb-3">
                    {person.role}
                  </p>
                  <h2
                    className="text-2xl md:text-3xl font-normal tracking-tight text-ink mb-4"
                    style={{ fontFamily: "'Fraunces', Georgia, serif" }}
                  >
                    {person.name}
                  </h2>
                  <div className="space-y-4 text-[16px] leading-[1.75] text-mist">
                    {person.bio.map((paragraph, i) => (
                      <p key={i}>{paragraph}</p>
                    ))}
                  </div>
                </div>
              </div>
            ))}
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
