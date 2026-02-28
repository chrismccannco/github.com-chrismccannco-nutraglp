import Image from "next/image";
import Link from "next/link";

const steps = [
  {
    num: "1",
    title: "Activate",
    text: "Four GRAS-certified active systems stimulate your body\u2019s own GLP-1 and GIP production in the gut through AMPK activation, GPR120 signaling, and insulin receptor sensitization. The same hormones the drugs target, produced naturally.",
  },
  {
    num: "2",
    title: "Protect",
    text: "Natural DPP-4 inhibitors extend the life of your GLP-1 before it breaks down. More active hormone. Longer metabolic window. No synthetic peptides.",
  },
  {
    num: "3",
    title: "Deliver",
    text: "Most oral supplements fail because the body can\u2019t absorb them. Our patent-pending nanoemulsion technology solves this. High bioavailability. Every dose, every day.",
  },
];

const howToSchema = {
  "@context": "https://schema.org",
  "@type": "HowTo",
  name: "How Slim SHOT activates natural GLP-1 production",
  description:
    "A daily drinkable liquid that amplifies your body's natural GLP-1 production while inhibiting the enzyme that breaks it down. Three steps, one daily Slim SHOT.",
  step: steps.map((s) => ({
    "@type": "HowToStep",
    name: s.title,
    text: s.text,
    position: parseInt(s.num),
  })),
};

export default function Mechanism() {
  return (
    <section className="py-24 px-6 md:px-12 max-w-[1000px] mx-auto">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }}
      />
      <p className="text-[11px] font-bold uppercase tracking-[2px] text-forest-mid mb-4">
        How It Works
      </p>
      <h2
        className="text-3xl md:text-4xl font-normal tracking-tight leading-tight mb-6 text-ink"
        style={{ fontFamily: "'Fraunces', Georgia, serif" }}
      >
        Your body already makes GLP-1.
        <br />Slim SHOT helps it make more.
      </h2>
      <p className="text-[17px] leading-relaxed text-mist max-w-[640px] mb-12">
        GLP-1 drugs work by injecting synthetic hormones. Slim SHOT takes a
        different approach: a drinkable liquid that amplifies your body&apos;s
        natural GLP-1 production while inhibiting the enzyme that breaks it
        down. Three steps, one daily Slim SHOT.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
        {steps.map((s) => (
          <div
            key={s.num}
            className="p-8 bg-white border border-rule rounded-xl"
          >
            <div className="w-10 h-10 bg-forest rounded-lg flex items-center justify-center text-white text-lg font-bold mb-4">
              {s.num}
            </div>
            <h3 className="text-[17px] font-bold tracking-tight mb-2 text-ink">
              {s.title}
            </h3>
            <p className="text-sm text-mist leading-relaxed">{s.text}</p>
          </div>
        ))}
      </div>

      {/* Mechanism diagram */}
      <div className="mt-14 mb-10">
        <Image
          src="/images/mechanism-diagram.png"
          alt="How the NutraGLP nanoemulsion works: active compounds are encapsulated in lipid nanoparticles, absorbed through intestinal L-cells, triggering GLP-1 release and metabolic effects across 13 pathways"
          width={1920}
          height={840}
          className="w-full h-auto rounded-xl border border-rule"
        />
      </div>

      <div className="mt-10">
        <Link
          href="/slim-shot"
          className="text-sm text-forest-mid hover:text-forest transition no-underline border-b border-forest-mid/30 pb-0.5"
        >
          See the science, dosing, and FAQs &rarr;
        </Link>
      </div>
    </section>
  );
}
