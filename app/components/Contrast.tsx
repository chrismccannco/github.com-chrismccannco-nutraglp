const pharma = [
  { text: "Weekly self-injection" },
  { text: "$800\u2013$1,600/month without insurance" },
  { text: "Nausea, vomiting, gastroparesis risk" },
  { text: "Provider visit + prior authorization" },
  { text: "Single synthetic mechanism" },
  { text: "FDA-approved with established clinical data" },
];

const nutraglp = [
  { text: "Daily drinkable liquid" },
  { text: "$155/month, ships direct" },
  { text: "GRAS-certified, clinically studied compounds" },
  { text: "No prescription required" },
  { text: "Multi-pathway formula" },
  { text: "Observational data; clinical program in progress" },
];

export default function Contrast() {
  return (
    <section className="bg-forest-deep bg-line-texture py-24 px-6 md:px-12">
      <div className="max-w-[1000px] mx-auto">
        <p className="text-[11px] font-bold uppercase tracking-[2px] text-gold mb-4">
          Two Approaches
        </p>
        <h2
          className="text-3xl md:text-4xl font-normal tracking-tight leading-tight mb-12 text-white font-display"
        >
          Same biological goal. Different path to get there.
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-0.5">
          {/* Pharma */}
          <div className="bg-white/[0.04] rounded-lg p-10">
            <p className="text-[11px] font-bold uppercase tracking-[1.5px] text-white/40 mb-6">
              GLP-1 Prescriptions
            </p>
            {pharma.map((item) => (
              <div
                key={item.text}
                className="py-3 border-b border-white/[0.06] flex items-start gap-3"
              >
                <span className="w-1.5 h-1.5 shrink-0 mt-2 rounded-full bg-white/20" />
                <span className="text-[15px] leading-relaxed text-white/40">
                  {item.text}
                </span>
              </div>
            ))}
          </div>

          {/* NutraGLP */}
          <div className="bg-gold/[0.08] border border-gold/20 rounded-lg p-10">
            <p className="text-[11px] font-bold uppercase tracking-[1.5px] text-gold mb-6">
              Slim SHOT by NutraGLP
            </p>
            {nutraglp.map((item) => (
              <div
                key={item.text}
                className="py-3 border-b border-white/[0.06] flex items-start gap-3"
              >
                <span className="w-1.5 h-1.5 shrink-0 mt-2 rounded-full bg-gold/60" />
                <span className="text-[15px] leading-relaxed text-white/85">
                  {item.text}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom note */}
        <p className="text-xs text-white/25 mt-6 text-center max-w-[640px] mx-auto">
          These are different product categories with different regulatory frameworks.
          NutraGLP is not a replacement for prescribed medication. Consult your healthcare
          provider before making changes to any treatment plan.
        </p>
      </div>
    </section>
  );
}
