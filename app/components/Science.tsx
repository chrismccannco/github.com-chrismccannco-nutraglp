import Link from "next/link";

export default function Science() {
  return (
    <section className="py-24 px-6 md:px-12 max-w-[720px] mx-auto">
      <p className="text-[11px] font-bold uppercase tracking-[2px] text-forest-mid mb-4">
        The Science
      </p>
      <h2
        className="text-3xl md:text-4xl font-normal tracking-tight leading-tight mb-6 text-ink font-display"
      >
        Built on published research. Not marketing claims.
      </h2>
      <p className="text-[17px] leading-relaxed text-mist mb-5">
        Every compound in the formula is backed by peer-reviewed studies.
        The patent-pending delivery system solves the absorption problem
        that limits most oral formulas. And the multi-pathway approach means
        the formula supports your metabolism from multiple angles, not just one.
      </p>
      <p className="text-[17px] leading-relaxed text-mist mb-8">
        <strong className="text-ink font-semibold">
          GRAS-certified compounds. Third-party tested. Patent-pending
          formulation. Manufactured in cGMP-certified facilities.
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
