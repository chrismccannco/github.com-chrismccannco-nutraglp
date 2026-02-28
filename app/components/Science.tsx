import Link from "next/link";

export default function Science() {
  return (
    <section className="py-24 px-6 md:px-12 max-w-[720px] mx-auto">
      <p className="text-[11px] font-bold uppercase tracking-[2px] text-forest-mid mb-4">
        The Science
      </p>
      <h2
        className="text-3xl md:text-4xl font-normal tracking-tight leading-tight mb-6 text-ink"
        style={{ fontFamily: "'Fraunces', Georgia, serif" }}
      >
        Built on published research. Not marketing claims.
      </h2>
      <p className="text-[17px] leading-relaxed text-mist mb-5">
        Every compound in the NutraGLP formula is backed by peer-reviewed
        studies demonstrating metabolic activity. The nanoemulsion delivery
        system addresses the bioavailability gap that limits most oral
        nutraceuticals, ensuring the compounds reach their target pathways at
        therapeutic-relevant concentrations.
      </p>
      <p className="text-[17px] leading-relaxed text-mist mb-5">
        We chose not to build a single-mechanism product. GLP-1 signaling is
        part of a larger metabolic system that includes insulin sensitivity,
        appetite regulation, glucose uptake, and lipid metabolism. NutraGLP
        engages 13 distinct pathways because metabolic health isn&apos;t a
        single-variable problem.
      </p>
      <p className="text-[17px] leading-relaxed text-mist mb-8">
        <strong className="text-ink font-semibold">
          Patent-pending formulation. GRAS-certified compounds. Third-party
          tested. Designed for the regulatory framework that actually exists.
        </strong>
      </p>
      <div className="flex flex-wrap gap-6">
        <Link
          href="/science"
          className="text-sm text-forest-mid hover:text-forest transition no-underline border-b border-forest-mid/30 pb-0.5"
        >
          Read the full science &rarr;
        </Link>
        <Link
          href="/slim-shot"
          className="text-sm text-forest-mid hover:text-forest transition no-underline border-b border-forest-mid/30 pb-0.5"
        >
          See the product &rarr;
        </Link>
      </div>
    </section>
  );
}
