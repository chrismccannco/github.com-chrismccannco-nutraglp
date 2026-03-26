import Link from "next/link";
import FadeIn from "./FadeIn";
import MechanismDiagram from "./MechanismDiagram";

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
  name: "How NutraGLP activates natural GLP-1 production",
  description:
    "A daily drinkable liquid that amplifies your body's natural GLP-1 production while inhibiting the enzyme that breaks it down. Three steps, one daily dose.",
  step: steps.map((s) => ({
    "@type": "HowToStep",
    name: s.title,
    text: s.text,
    position: parseInt(s.num),
  })),
};

export default function Mechanism() {
  return (
    <section className="py-24 px-6 md:px-12 bg-forest-deep">
      <div className="max-w-[1000px] mx-auto">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }}
        />
        <FadeIn>
          <p className="text-[10px] font-bold uppercase tracking-[1.5px] text-teal-light mb-4">
            How It Works
          </p>
          <h2 className="text-[26px] md:text-[36px] font-normal tracking-tight leading-tight mb-6 text-white font-heading">
            Your body already makes GLP-1.
            <br />
            <span className="text-gold italic">NutraGLP helps it make more.</span>
          </h2>
          <p className="text-[17px] leading-relaxed text-white/50 max-w-[640px] mb-12">
            GLP-1 drugs work by injecting synthetic hormones. NutraGLP takes a
            different approach: a drinkable liquid that amplifies your body&apos;s
            natural GLP-1 production while inhibiting the enzyme that breaks it
            down. Three steps, one daily dose.
          </p>
        </FadeIn>

        <FadeIn delay={100} className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-14">
          {steps.map((s) => (
            <div
              key={s.num}
              className="p-6 md:p-8 bg-white/[0.07] border border-white/[0.12] rounded-xl"
            >
              <div className="w-10 h-10 bg-gold/20 border border-gold/30 rounded-lg flex items-center justify-center text-gold text-lg font-bold mb-4">
                {s.num}
              </div>
              <h3 className="text-[18px] font-semibold tracking-tight mb-2 text-white">
                {s.title}
              </h3>
              <p className="text-[15px] text-white/50 leading-relaxed">{s.text}</p>
            </div>
          ))}
        </FadeIn>

        <FadeIn delay={200}>
          <MechanismDiagram />
        </FadeIn>

        <div className="mt-10">
          <Link
            href="/slim-shot"
            className="text-sm text-white/40 hover:text-white/70 transition no-underline border-b border-white/20 pb-0.5"
          >
            See the science, dosing, and FAQs &rarr;
          </Link>
        </div>
      </div>
    </section>
  );
}
