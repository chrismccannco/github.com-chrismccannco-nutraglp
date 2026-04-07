import Link from "next/link";

export default function FounderSignal() {
  return (
    <section className="py-16 px-6 md:px-12 border-t border-b border-rule">
      <div className="max-w-[720px] mx-auto">
        <p className="text-[11px] font-bold uppercase tracking-[2px] text-forest-mid mb-6">
          Who&apos;s behind this
        </p>
        <div className="space-y-4 text-[15px] leading-relaxed text-mist">
          <p>
            NutraGLP was founded by Richard Kaufman, PhD, who invented
            patented nanoparticle delivery systems across 24+ countries and
            earned the Frost &amp; Sullivan Innovation Award for nanoemulsion
            technology. He spent two decades solving one problem: getting
            bioactive compounds past the GI tract at concentrations that matter.
          </p>
          <p>
            The company is led by Kaufman and Chris McCann, who spent fifteen
            years in enterprise technology before turning that operating
            experience toward a market that needs it.
          </p>
        </div>
        <div className="mt-6">
          <Link
            href="/about"
            className="text-sm text-forest-mid hover:text-forest transition no-underline border-b border-forest-mid/30 pb-0.5"
          >
            Full team background &rarr;
          </Link>
        </div>
      </div>
    </section>
  );
}
