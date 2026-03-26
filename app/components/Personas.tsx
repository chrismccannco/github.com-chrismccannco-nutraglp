import FadeIn from "./FadeIn";

const personas = [
  {
    label: "The access question",
    headline: "I want what Ozempic does. The prescription, the cost, or the system got in the way.",
    body: "Most people who need GLP-1 support can\u2019t access pharmaceutical options. Insurance denials. BMI thresholds that exclude millions. $800\u2013$1,600/month without coverage. Compounded versions in legal gray areas. No prescriber willing to engage. Slim SHOT doesn\u2019t require a prescription, a qualifying diagnosis, or insurance approval. $155/month, ships to your door.",
  },
  {
    label: "The side effects question",
    headline: "The drug worked. The nausea, the injections, and the muscle loss didn\u2019t.",
    body: "70% of people on GLP-1 drugs discontinue within a year. Not because they stop wanting results \u2014 because the experience isn\u2019t sustainable. Weekly self-injections. Persistent nausea. Gastroparesis. Lean mass loss at higher doses. Slim SHOT activates the same biological pathway without synthetic peptides. Your body produces the hormone. The side effect profile follows.",
  },
  {
    label: "The performance question",
    headline: "I\u2019m not trying to lose weight. I\u2019m trying to optimize.",
    body: "You train. You eat well. You want metabolic efficiency without the muscle wasting or systemic disruption that comes with synthetic GLP-1 agonists. Slim SHOT activates 13 complementary metabolic pathways \u2014 incretin amplification, DPP-4 inhibition, insulin sensitization \u2014 while preserving lean mass. Metabolic health as a performance input, not a medical intervention.",
  },
];

export default function Personas() {
  return (
    <section className="bg-forest-black py-24 px-6 md:px-12 border-t border-white/[0.10]">
      <div className="max-w-[1000px] mx-auto">
        <FadeIn>
          <p className="text-[10px] font-bold uppercase tracking-[1.5px] text-teal-light mb-4">
            Who This Is For
          </p>
          <h2 className="text-[26px] md:text-[36px] font-normal tracking-tight leading-tight mb-4 text-white font-heading">
            Three reasons people find us.
          </h2>
          <p className="text-[17px] leading-relaxed text-white/55 max-w-[640px] mb-14">
            Different starting points. The same gap in the market.
          </p>
        </FadeIn>

        <FadeIn delay={100} className="grid grid-cols-1 gap-6">
          {personas.map((p) => (
            <div
              key={p.label}
              className="bg-white/[0.07] border border-white/[0.12] rounded-xl p-8 md:p-10"
            >
              <p className="text-[10px] font-bold uppercase tracking-[1.5px] text-teal-light mb-3">
                {p.label}
              </p>
              <h3 className="text-xl md:text-2xl font-normal tracking-tight text-white mb-4 leading-snug font-heading">
                {p.headline}
              </h3>
              <p className="text-[15px] text-white/55 leading-relaxed max-w-[680px]">
                {p.body}
              </p>
            </div>
          ))}
        </FadeIn>
      </div>
    </section>
  );
}
