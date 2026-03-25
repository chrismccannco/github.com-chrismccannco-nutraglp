import FadeIn from "./FadeIn";

const personas = [
  {
    label: "The needle question",
    headline: "I want the results. I don\u2019t want the injection.",
    body: "You\u2019ve read about GLP-1 drugs. Maybe your doctor mentioned them. But a weekly self-injection with nausea, gastroparesis risk, and no clear end date isn\u2019t the answer you were looking for. Slim SHOT is a daily liquid you drink. Same biological pathway, activated naturally. No needle. No clinic visit. No side effects you have to Google at 2am.",
  },
  {
    label: "The cost question",
    headline: "I can\u2019t justify $1,600 a month. I still need something that works.",
    body: "Ozempic without insurance runs $800\u2013$1,600/month. Compounded versions are legally uncertain. The supplement aisle is noise. Slim SHOT is $155/mo, ships to your door, and uses patent-pending nanoemulsion technology to actually deliver what most supplements can\u2019t. Real mechanism of action. Real bioavailability. Price that doesn\u2019t require a second income.",
  },
  {
    label: "The performance question",
    headline: "I\u2019m not trying to lose weight. I\u2019m trying to optimize.",
    body: "You train. You eat well. You want metabolic efficiency without the muscle wasting that comes with synthetic GLP-1 agonists at higher doses. Slim SHOT activates 13 complementary metabolic pathways while preserving lean mass. It\u2019s built for people who want precision, not a blunt instrument. Metabolic health as a performance input, not a medical intervention.",
  },
];

export default function Personas() {
  return (
    <section className="bg-forest-deep py-24 px-6 md:px-12 border-t border-white/[0.06]">
      <div className="max-w-[1000px] mx-auto">
        <FadeIn>
          <p className="text-[10px] font-bold uppercase tracking-[1.5px] text-teal-light mb-4">
            Who This Is For
          </p>
          <h2 className="text-[26px] md:text-[36px] font-normal tracking-tight leading-tight mb-4 text-white font-heading">
            Three reasons people find us.
          </h2>
          <p className="text-[17px] leading-relaxed text-white/55 max-w-[640px] mb-14">
            Different starting points. Same gap in the market. If one of
            these sounds like your story, Slim SHOT was built for you.
          </p>
        </FadeIn>

        <FadeIn delay={100} className="grid grid-cols-1 gap-6">
          {personas.map((p) => (
            <div
              key={p.label}
              className="bg-white/[0.04] border border-white/[0.08] rounded-xl p-8 md:p-10"
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
