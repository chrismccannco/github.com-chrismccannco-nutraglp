// Static server component — no "use client" needed

const ACTIVE_ITEMS = [
  { label: "GLP-1 Activation",    color: "teal" as const },
  { label: "Insulin Sensitization", color: "teal" as const },
  { label: "Metabolic Support",   color: "gold" as const },
  { label: "DPP-4 Inhibition",    color: "gold" as const },
];

const EFFECTS = [
  { arrow: "↑", label: "GLP-1 & GIP",        sub: "Incretin production",          up: true  },
  { arrow: "↓", label: "DPP-4 Activity",      sub: "Longer hormone half-life",     up: false },
  { arrow: "↑", label: "Insulin Sensitivity", sub: "GLUT4 translocation",          up: true  },
  { arrow: "↓", label: "Appetite",            sub: "Gut-brain axis signaling",     up: false },
  { arrow: "↑", label: "Lipid Metabolism",    sub: "AMPK fatty acid oxidation",    up: true  },
];

export default function MechanismDiagram() {
  return (
    <div className="rounded-xl overflow-hidden border border-white/[0.08]">
      <div className="grid grid-cols-2 md:grid-cols-4">

        {/* ── Panel 1: Active Systems ────────────────── */}
        <div className="border-b md:border-b-0 border-r border-white/[0.08]">
          <div className="bg-gold px-5 py-2.5">
            <p className="text-[10px] font-bold tracking-[0.14em] uppercase text-[#0A2463]">Active Systems</p>
          </div>
          <div className="p-5 bg-[#0A2463] h-full">
            <div className="space-y-0 mb-5">
              {ACTIVE_ITEMS.map((item, i) => (
                <div key={item.label} className={`flex items-center gap-3 py-2.5 ${i < ACTIVE_ITEMS.length - 1 ? "border-b border-white/[0.07]" : ""}`}>
                  <div className={`w-2 h-2 rounded-full flex-shrink-0 ${item.color === "teal" ? "bg-[#1585B5]" : "bg-[#C8962E]"}`} />
                  <span className="text-[13px] text-white/80">{item.label}</span>
                </div>
              ))}
            </div>
            <div className="bg-[#0f3020] border border-white/[0.08] rounded-lg p-3 mb-4">
              <p className="text-[10px] font-bold tracking-[0.1em] uppercase text-white mb-1">Nanoemulsion</p>
              <p className="text-[11px] text-white/50">Patent-pending carrier</p>
            </div>
            <p className="text-[10px] text-white/25 text-center">4 active systems</p>
          </div>
        </div>

        {/* ── Panel 2: Encapsulation ─────────────────── */}
        <div className="border-b md:border-b-0 border-white/[0.08] md:border-r">
          <div className="bg-[#1585B5] px-5 py-2.5">
            <p className="text-[10px] font-bold tracking-[0.14em] uppercase text-white">Encapsulation</p>
          </div>
          <div className="p-5 bg-[#0A2463] h-full flex flex-col items-center">
            {/* Nanoparticle illustration */}
            <svg viewBox="0 0 120 120" className="w-[88px] h-[88px] mb-4" aria-hidden="true">
              <circle cx="60" cy="60" r="52" fill="none" stroke="rgba(21,133,181,0.25)" strokeWidth="1.5" strokeDasharray="4 3" />
              <circle cx="60" cy="42" r="13" fill="#1585B5" fillOpacity="0.65" />
              <circle cx="44" cy="63" r="10" fill="#1585B5" fillOpacity="0.45" />
              <circle cx="73" cy="64" r="8"  fill="#C8962E" fillOpacity="0.55" />
              <circle cx="59" cy="76" r="5"  fill="#C8962E" fillOpacity="0.45" />
              <circle cx="76" cy="46" r="5"  fill="#1585B5" fillOpacity="0.35" />
              <circle cx="45" cy="44" r="4"  fill="#C8962E" fillOpacity="0.30" />
            </svg>
            <p className="text-[14px] font-semibold text-white mb-1">Lipid nanoparticle</p>
            <p className="text-[12px] text-white/50 text-center mb-5 leading-relaxed">Protects compounds through GI tract</p>
            <div className="w-full space-y-3 mt-auto">
              {[
                { label: "Surface area",         sub: "Nano-scale particle size" },
                { label: "Membrane permeability", sub: "Lipid-based transport" },
              ].map(item => (
                <div key={item.label} className="flex gap-2.5 items-start">
                  <span className="text-[#1585B5] text-[13px] font-bold mt-0.5 flex-shrink-0">↑</span>
                  <div>
                    <p className="text-[12px] font-semibold text-white leading-tight">{item.label}</p>
                    <p className="text-[11px] text-white/40">{item.sub}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Panel 3: Gut Absorption ────────────────── */}
        <div className="border-r border-white/[0.08]">
          <div className="bg-[#1585B5] px-5 py-2.5">
            <p className="text-[10px] font-bold tracking-[0.14em] uppercase text-white">Gut Absorption</p>
          </div>
          <div className="p-5 bg-[#0A2463] h-full flex flex-col items-center">
            {/* Intestinal villi illustration */}
            <svg viewBox="0 0 120 90" className="w-[88px] h-[66px] mb-4" aria-hidden="true">
              <path d="M8 90 Q8 38 28 38 Q48 38 48 90"  fill="#0d2d6b" stroke="rgba(21,133,181,0.35)" strokeWidth="1.5" />
              <path d="M34 90 Q34 26 56 26 Q78 26 78 90" fill="#0d2d6b" stroke="rgba(21,133,181,0.35)" strokeWidth="1.5" />
              <path d="M62 90 Q62 38 82 38 Q102 38 102 90" fill="#0d2d6b" stroke="rgba(21,133,181,0.35)" strokeWidth="1.5" />
              {/* L-cell */}
              <ellipse cx="56" cy="56" rx="11" ry="8" fill="none" stroke="#C8962E" strokeWidth="1.5" />
              <text x="56" y="60" textAnchor="middle" fontSize="7" fill="#C8962E" fontFamily="sans-serif" fontWeight="700">L</text>
              {/* Nanoparticles approaching */}
              <circle cx="34" cy="34" r="3.5" fill="#1585B5" fillOpacity="0.85" />
              <circle cx="45" cy="27" r="2.5" fill="#1585B5" fillOpacity="0.60" />
              <circle cx="27" cy="42" r="2"   fill="#1585B5" fillOpacity="0.50" />
            </svg>
            <p className="text-[14px] font-semibold text-white mb-1">Intestinal L-cells</p>
            <p className="text-[12px] text-white/50 text-center mb-5 leading-relaxed">Nanoparticles cross membrane, activate GPR120 + AMPK pathways</p>
            <div className="w-full space-y-3 mt-auto">
              {[
                { label: "Bioavailability",  sub: "Bypasses first-pass metabolism" },
                { label: "Cellular uptake",  sub: "Targeted L-cell delivery" },
              ].map(item => (
                <div key={item.label} className="flex gap-2.5 items-start">
                  <span className="text-[#1585B5] text-[13px] font-bold mt-0.5 flex-shrink-0">↑</span>
                  <div>
                    <p className="text-[12px] font-semibold text-white leading-tight">{item.label}</p>
                    <p className="text-[11px] text-white/40">{item.sub}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Panel 4: Metabolic Effect ──────────────── */}
        <div>
          <div className="bg-gold px-5 py-2.5">
            <p className="text-[10px] font-bold tracking-[0.14em] uppercase text-[#0A2463]">Metabolic Effect</p>
          </div>
          <div className="p-5 bg-[#0A2463] h-full">
            <div className="space-y-3">
              {EFFECTS.map(item => (
                <div key={item.label} className="flex gap-2.5 items-start">
                  <span className={`text-[14px] font-bold flex-shrink-0 mt-0.5 ${item.up ? "text-[#1585B5]" : "text-[#C8962E]"}`}>
                    {item.arrow}
                  </span>
                  <div>
                    <p className="text-[12px] font-semibold text-white leading-tight">{item.label}</p>
                    <p className="text-[11px] text-white/40">{item.sub}</p>
                  </div>
                </div>
              ))}
            </div>
            <p className="text-[10px] text-white/25 text-right mt-5">13 pathways engaged</p>
          </div>
        </div>

      </div>

      {/* Footer rule */}
      <div className="px-5 py-3 border-t border-white/[0.06] bg-[#081a3e] text-center">
        <p className="text-[10px] text-white/25 italic tracking-wide">Patent-pending nanoemulsion delivery — NutraGLP</p>
      </div>
    </div>
  );
}
