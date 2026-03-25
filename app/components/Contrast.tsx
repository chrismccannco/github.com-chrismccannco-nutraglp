const them = [
  { text: "Weekly self-injection", icon: "💉" },
  { text: "$800–$1,600/month without insurance", icon: "💸" },
  { text: "Nausea, vomiting, gastroparesis risk", icon: "⚠" },
  { text: "Provider visit + prior authorization", icon: "📋" },
  { text: "Single synthetic mechanism", icon: "🔬" },
  { text: "Muscle loss concerns at higher doses", icon: "↓" },
];

const us = [
  { text: "Daily drinkable liquid nanoemulsion", icon: "✓" },
  { text: "Fraction of prescription cost", icon: "✓" },
  { text: "GRAS-certified, clinically studied compounds", icon: "✓" },
  { text: "No prescription required", icon: "✓" },
  { text: "13 complementary metabolic pathways", icon: "✓" },
  { text: "Designed to preserve lean mass", icon: "✓" },
];

export default function Contrast() {
  return (
    <section className="bg-forest-deep bg-line-texture py-24 px-6 md:px-12">
      <div className="max-w-[1000px] mx-auto">
        <p className="text-[11px] font-bold uppercase tracking-[2px] text-gold mb-4">
          A Different Category
        </p>
        <h2
          className="text-3xl md:text-4xl font-normal tracking-tight leading-tight mb-12 text-white font-heading"
        >
          What changes when you don&apos;t need a prescription.
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-0.5">
          {/* Them */}
          <div className="bg-white/[0.04] rounded-lg p-10">
            <p className="text-[11px] font-bold uppercase tracking-[1.5px] text-white/40 mb-6">
              GLP-1 Prescriptions
            </p>
            {them.map((item) => (
              <div
                key={item.text}
                className="py-3 border-b border-white/[0.06] flex items-start gap-3"
              >
                <span className="w-5 h-5 shrink-0 mt-0.5 rounded-full bg-white/[0.06] flex items-center justify-center text-white/25 text-[10px]">
                  ✕
                </span>
                <span className="text-[15px] leading-relaxed text-white/40">
                  {item.text}
                </span>
              </div>
            ))}
          </div>

          {/* Us */}
          <div className="bg-gold/[0.08] border border-gold/20 rounded-lg p-10">
            <p className="text-[11px] font-bold uppercase tracking-[1.5px] text-gold mb-6">
              NutraGLP
            </p>
            {us.map((item) => (
              <div
                key={item.text}
                className="py-3 border-b border-white/[0.06] flex items-start gap-3"
              >
                <span className="w-5 h-5 shrink-0 mt-0.5 rounded-full bg-gold/20 flex items-center justify-center text-gold text-[11px] font-bold">
                  ✓
                </span>
                <span className="text-[15px] leading-relaxed text-white/85">
                  {item.text}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom note */}
        <p className="text-xs text-white/20 mt-6 text-center">
          NutraGLP is a dietary supplement, not a drug. It is not intended to diagnose, treat, cure, or prevent any disease.
        </p>
      </div>
    </section>
  );
}
