import Image from "next/image";
import Link from "next/link";

const steps = [
  {
    num: "1",
    title: "Activate",
    text: "Clinically studied compounds signal your body to produce more of its own appetite-regulating hormones. The same ones the injectable drugs target, triggered naturally.",
  },
  {
    num: "2",
    title: "Protect",
    text: "Natural enzyme inhibitors keep those hormones active longer before your body breaks them down. A wider window for your metabolism to respond.",
  },
  {
    num: "3",
    title: "Deliver",
    text: "Most supplements fail because your body can’t absorb them. Our patent-pending liquid delivery system changes that. What you take actually gets where it needs to go.",
  },
];

const howToSchema = {
  "@context": "https://schema.org",
  "@type": "HowTo",
  name: "How Slim SHOT works",
  description:
    "A daily drinkable liquid that works with your body's own biology to support appetite control and metabolic health. Three steps, twice daily.",
  step: steps.map((s) => ({
    "@type": "HowToStep",
    name: s.title,
    text: s.text,
    position: parseInt(s.num),
  })),
};

export default function Mechanism() {
  return (
    <section className="bg-forest-deep py-24 px-6 md:px-12"><div className="max-w-[1000px] mx-auto">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }}
      />
      <p className="text-[11px] font-bold uppercase tracking-[2px] text-teal-light mb-4">
        How It Works
      </p>
      <h2
        className="text-3xl md:text-4xl font-normal tracking-tight leading-tight mb-6 text-white font-display"
      >
        Your body already makes the hormones.
        <br />Slim SHOT helps it make more.
      </h2>
      <p className="text-[17px] leading-relaxed text-white/60 max-w-[640px] mb-12">
        The injectable drugs replace your hormones with synthetic versions.
        Slim SHOT takes a different approach: a daily liquid that works with
        your biology, not instead of it.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
        {steps.map((s) => (
          <div
            key={s.num}
            className="p-8 bg-white/[0.04] border border-white/[0.08] rounded-xl"
          >
            <div className="w-10 h-10 bg-forest rounded-lg flex items-center justify-center text-white text-lg font-bold mb-4">
              {s.num}
            </div>
            <h3 className="text-[17px] font-bold tracking-tight mb-2 text-white">
              {s.title}
            </h3>
            <p className="text-sm text-white/50 leading-relaxed">{s.text}</p>
          </div>
        ))}
      </div>

      <div className="mt-14">
        <Link
          href="/science"
          className="text-sm text-teal-light hover:text-white transition no-underline border-b border-teal-light/30 pb-0.5"
        >
          The full science behind the formula &rarr;
        </Link>
      </div>
    </div></section>
  );
}
