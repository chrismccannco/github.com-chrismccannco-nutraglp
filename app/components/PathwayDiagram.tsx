"use client";

import { useState } from "react";

/* ── Data ── */

interface Trigger {
  id: string;
  label: string;
  subtitle: string;
  pathways: string[];
}

interface Pathway {
  id: string;
  label: string;
  category: string;
  description: string;
}

const triggers: Trigger[] = [
  {
    id: "ampk",
    label: "AMPK Activation",
    subtitle: "Berberine + Quercetin",
    pathways: ["glp1-secretion", "fatty-acid-oxidation", "glucose-uptake", "insulin-sensitivity", "triglyceride-reduction"],
  },
  {
    id: "gpr120",
    label: "GPR120 Signaling",
    subtitle: "Omega-3 Fatty Acids",
    pathways: ["glp1-secretion", "gip-secretion", "appetite-regulation", "lipid-metabolism", "inflammatory-modulation"],
  },
  {
    id: "dpp4",
    label: "DPP-4 Inhibition",
    subtitle: "Berberine + Chromium",
    pathways: ["glp1-halflife", "gip-halflife", "insulin-sensitivity", "appetite-regulation", "glucose-uptake"],
  },
];

const pathways: Pathway[] = [
  { id: "glp1-secretion", label: "GLP-1 Secretion", category: "Incretin", description: "L-cell stimulation via AMPK and GPR120" },
  { id: "gip-secretion", label: "GIP Secretion", category: "Incretin", description: "K-cell activation through fatty acid receptor pathways" },
  { id: "glp1-halflife", label: "GLP-1 Half-Life Extension", category: "Incretin", description: "Enzymatic degradation inhibition" },
  { id: "gip-halflife", label: "GIP Half-Life Extension", category: "Incretin", description: "Extended active window for incretin signaling" },
  { id: "appetite-regulation", label: "Appetite Regulation", category: "Metabolic", description: "GLP-1-mediated satiety via gut-brain axis" },
  { id: "insulin-sensitivity", label: "Insulin Sensitivity", category: "Metabolic", description: "Enhanced receptor sensitivity and GLUT4 translocation" },
  { id: "glucose-uptake", label: "Glucose Uptake", category: "Metabolic", description: "Improved cellular glucose transport" },
  { id: "fatty-acid-oxidation", label: "Fatty Acid Oxidation", category: "Lipid", description: "AMPK-mediated fat metabolism" },
  { id: "triglyceride-reduction", label: "Triglyceride Reduction", category: "Lipid", description: "Downstream lipid-lowering effect" },
  { id: "lipid-metabolism", label: "Lipid Metabolism", category: "Lipid", description: "Broad lipid-modulating activity" },
  { id: "inflammatory-modulation", label: "Inflammatory Modulation", category: "Support", description: "GPR120-mediated anti-inflammatory signaling" },
];

const categoryColors: Record<string, { bg: string; text: string; border: string }> = {
  Incretin: { bg: "bg-forest-mid/10", text: "text-forest-mid", border: "border-forest-mid/20" },
  Metabolic: { bg: "bg-gold/10", text: "text-gold", border: "border-gold/20" },
  Lipid: { bg: "bg-forest/10", text: "text-forest", border: "border-forest/20" },
  Support: { bg: "bg-mist/10", text: "text-mist", border: "border-mist/30" },
};

/* ── Component ── */

export default function PathwayDiagram() {
  const [activeTrigger, setActiveTrigger] = useState<string | null>(null);

  const activePathwayIds = activeTrigger
    ? triggers.find((t) => t.id === activeTrigger)?.pathways ?? []
    : [];

  const isPathwayActive = (id: string) =>
    activeTrigger === null || activePathwayIds.includes(id);

  return (
    <div>
      {/* Triggers */}
      <p className="text-[11px] font-bold uppercase tracking-[2px] text-forest-mid mb-6">
        Select a trigger to see which pathways it activates
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
        {triggers.map((t) => {
          const isActive = activeTrigger === t.id;
          return (
            <button
              key={t.id}
              onClick={() => setActiveTrigger(isActive ? null : t.id)}
              className={`
                text-left p-5 rounded-xl border-2 transition-all duration-200 cursor-pointer
                ${isActive
                  ? "border-gold bg-gold/[0.08] shadow-sm"
                  : "border-rule bg-white hover:border-forest-mid/30"
                }
              `}
            >
              <div className="flex items-center gap-3 mb-2">
                <div
                  className={`w-3 h-3 rounded-full transition-colors duration-200 ${
                    isActive ? "bg-gold" : "bg-forest-mid/30"
                  }`}
                />
                <span
                  className={`text-[15px] font-bold tracking-tight transition-colors duration-200 ${
                    isActive ? "text-ink" : "text-ink"
                  }`}
                >
                  {t.label}
                </span>
              </div>
              <p className="text-xs text-mist ml-6">{t.subtitle}</p>
            </button>
          );
        })}
      </div>

      {/* Connection lines (visual indicator) */}
      {activeTrigger && (
        <div className="flex justify-center mb-6">
          <div className="flex items-center gap-2 text-xs text-mist">
            <div className="w-8 h-[2px] bg-gold/40" />
            <span>
              {activePathwayIds.length} pathway{activePathwayIds.length !== 1 ? "s" : ""} activated
            </span>
            <div className="w-8 h-[2px] bg-gold/40" />
          </div>
        </div>
      )}

      {/* Pathway grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {pathways.map((p) => {
          const active = isPathwayActive(p.id);
          const colors = categoryColors[p.category] || categoryColors.Support;
          return (
            <div
              key={p.id}
              className={`
                p-4 rounded-xl border transition-all duration-300
                ${active
                  ? `${colors.bg} ${colors.border} border`
                  : "bg-white/40 border-rule/50 opacity-30"
                }
              `}
            >
              <div className="flex items-start justify-between gap-2 mb-1.5">
                <h4
                  className={`text-[13px] font-bold tracking-tight transition-colors duration-300 ${
                    active ? "text-ink" : "text-mist-light"
                  }`}
                >
                  {p.label}
                </h4>
                <span
                  className={`text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded ${
                    active ? `${colors.text} ${colors.bg}` : "text-mist-light bg-mist/5"
                  }`}
                >
                  {p.category}
                </span>
              </div>
              <p
                className={`text-xs leading-relaxed transition-colors duration-300 ${
                  active ? "text-mist" : "text-mist-light"
                }`}
              >
                {p.description}
              </p>
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-4 mt-8 pt-6 border-t border-rule">
        {Object.entries(categoryColors).map(([cat, colors]) => (
          <div key={cat} className="flex items-center gap-2">
            <div className={`w-2.5 h-2.5 rounded-full ${colors.bg} border ${colors.border}`} />
            <span className="text-[11px] text-mist uppercase tracking-wider">{cat}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
