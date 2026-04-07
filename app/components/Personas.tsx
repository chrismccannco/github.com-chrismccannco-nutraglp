const personas = [
  {
    label: "The needle question",
    headline: "You\u2019ve done the math on injections. It doesn\u2019t add up.",
    body: "The results are real. But so is the weekly self-injection, the nausea that doesn\u2019t always pass, and the $1,600/month without insurance. You\u2019re not anti-science. You\u2019re looking for a version of this that fits your life. Slim SHOT works the same biological pathway. You drink it. No needle. No clinic visit. No side effects you have to Google at 2am.",
  },
  {
    label: "The supplement question",
    headline: "You stopped trusting the supplement aisle a long time ago.",
    body: "Every bottle promises something. Nothing delivers it. The issue isn\u2019t the ingredients. Published research supports several natural GLP-1 activators. The issue is that capsules and powders lose 95% of their active compounds before they reach your bloodstream. Slim SHOT uses a patent-pending nanoemulsion to solve the delivery problem. Same compounds, different result.",
  },
  {
    label: "The optimization question",
    headline: "You don\u2019t need to lose weight. You want metabolic precision.",
    body: "You already train. You already eat well. What you want is metabolic efficiency without the muscle wasting that comes with higher-dose synthetic GLP-1 agonists. Slim SHOT activates multiple complementary metabolic pathways while preserving lean mass. Metabolic health as a performance input, not a medical intervention.",
  },
];

export default function Personas() {
  return (
    <section className="py-24 px-6 md:px-12 bg-cream-warm bg-dot-grid">
      <div className="max-w-[1000px] mx-auto">
        <p className="text-[11px] font-bold uppercase tracking-[2px] text-forest-mid mb-4">
          Who This Is For
        </p>
        <h2
          className="text-3xl md:text-4xl font-normal tracking-tight leading-tight mb-4 text-ink font-display"
        >
          Three reasons people find us.
        </h2>
        <p className="text-[17px] leading-relaxed text-mist max-w-[640px] mb-14">
          Different starting points. Same gap in the market.
        </p>

        <div className="grid grid-cols-1 gap-6">
          {personas.map((p) => (
            <div
              key={p.label}
              className="bg-white border border-rule rounded-xl p-8 md:p-10"
            >
              <p className="text-[10px] font-bold uppercase tracking-wider text-forest-mid mb-3">
                {p.label}
              </p>
              <h3
                className="text-xl md:text-2xl font-normal tracking-tight text-ink mb-4 leading-snug font-display"
              >
                {p.headline}
              </h3>
              <p className="text-[15px] text-mist leading-relaxed max-w-[680px]">
                {p.body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
