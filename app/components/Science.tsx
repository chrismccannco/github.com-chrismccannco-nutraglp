import Link from "next/link";
import FadeIn from "./FadeIn";

export default function Science() {
  return (
    <section className="bg-forest-deep py-24 px-6 md:px-12 border-t border-white/[0.06]">
      <div className="max-w-[720px] mx-auto">
        <FadeIn>
          <p className="text-[10px] font-bold uppercase tracking-[1.5px] text-teal-light mb-4">
            The Science
          </p>
          <h2 className="text-[26px] md:text-[36px] font-normal tracking-tight leading-tight mb-6 text-white font-heading">
            Built on published research. Not marketing claims.
          </h2>
          <p className="text-[17px] leading-relaxed text-white/60 mb-5">
            Every compound in the NutraGLP formula is backed by peer-reviewed
            studies demonstrating metabolic activity. The nanoemulsion delivery
            system addresses the bioavailability gap that limits most oral
            nutraceuticals, ensuring the compounds reach their target pathways at
            therapeutically-relevant concentrations.
          </p>
          <p className="text-[17px] leading-relaxed text-white/60 mb-5">
            We chose not to build a single-mechanism product. GLP-1 signaling is
            part of a larger metabolic system that includes insulin sensitivity,
            appetite regulation, glucose uptake, and lipid metabolism. NutraGLP
            engages 13 distinct pathways because metabolic health isn&apos;t a
            single-variable problem.
          </p>
          <p className="text-[17px] leading-relaxed text-white/80 mb-8">
            <strong className="text-white font-semibold">
              Patent-pending formulation. GRAS-certified compounds. Third-party
              tested. Designed for the regulatory framework that actually exists.
            </strong>
          </p>
          <div className="flex flex-wrap gap-6">
            <Link
              href="/science"
              className="text-sm text-teal-light hover:text-white transition no-underline border-b border-teal-light/40 pb-0.5"
            >
              Read the full science &rarr;
            </Link>
            <Link
              href="/slim-shot"
              className="text-sm text-white/50 hover:text-white transition no-underline border-b border-white/20 pb-0.5"
            >
              See the product &rarr;
            </Link>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
