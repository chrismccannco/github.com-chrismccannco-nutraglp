import FadeIn from "./FadeIn";

export default function Problem() {
  return (
    <section className="py-24 px-6 md:px-12 max-w-[720px] mx-auto">
      <FadeIn>
      <p className="text-[10px] font-bold uppercase tracking-[1.5px] text-teal mb-4">
        The Problem
      </p>
      <h2 className="text-[26px] md:text-[36px] font-normal tracking-tight leading-tight mb-6 text-ink font-heading">
        Forty-two million prescriptions. Same three trade-offs.
      </h2>
      <p className="text-[17px] leading-relaxed text-mist mb-5">
        GLP-1 drugs work. The data is clear. But the delivery model forces a
        choice most people shouldn&apos;t have to make: weekly injections with
        significant side effects, $1,000+ monthly costs without insurance, or a
        waitlist that stretches past the point of motivation.
      </p>
      <p className="text-[17px] leading-relaxed text-mist mb-5">
        Meanwhile, the supplement aisle offers the opposite problem. Dozens of
        products claiming metabolic support, built on single-compound formulas
        with minimal bioavailability and no real mechanism of action.
      </p>
      <p className="text-[17px] leading-relaxed text-mist">
        <strong className="text-ink font-semibold">
          The space between pharmaceutical efficacy and supplement accessibility
          is where metabolic health actually lives.
        </strong>{" "}
        That&apos;s where we built NutraGLP.
      </p>
      </FadeIn>
    </section>
  );
}
