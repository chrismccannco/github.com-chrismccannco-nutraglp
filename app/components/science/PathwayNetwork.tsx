"use client";
import { useState, useCallback } from "react";

// ── Brand colors ──────────────────────────────────────────────────────────────
const C = {
  navy:   "#0A2463",
  gold:   "#C8962E",
  teal:   "#1585B5",
  ink:    "#1A1A18",
  muted:  "#6B7280",
  silver: "#9CA3AF",
};

// ── Source mechanisms (top tier) ──────────────────────────────────────────────
const SOURCES = [
  {
    id: "activate",
    label: "Activate",
    sub: "AMPK · GPR120 · Insulin Receptor",
    cx: 162, cy: 80, r: 32,
    color: C.navy,
  },
  {
    id: "protect",
    label: "Protect",
    sub: "DPP-4 Inhibition",
    cx: 450, cy: 62, r: 32,
    color: C.gold,
  },
  {
    id: "deliver",
    label: "Deliver",
    sub: "Nanoemulsion",
    cx: 738, cy: 80, r: 32,
    color: C.teal,
  },
];

// ── Middle tier (primary biological events) ───────────────────────────────────
const MIDDLE = [
  { id: "glp1",   label: "GLP-1",    sub: "Secretion",    cx: 238, cy: 218, r: 19, from: ["activate", "deliver"] },
  { id: "gip",    label: "GIP",      sub: "Co-secretion", cx: 376, cy: 234, r: 19, from: ["activate"] },
  { id: "dpp4",   label: "DPP-4",    sub: "Inhibited",    cx: 522, cy: 218, r: 19, from: ["protect"] },
  { id: "absorb", label: "Enhanced", sub: "Absorption",   cx: 658, cy: 234, r: 19, from: ["deliver"] },
];

// ── 13 downstream metabolic effects ──────────────────────────────────────────
const DOWN = [
  // Row 1 (y ≈ 368)
  { id: "appetite", label: "Appetite",    sub: "Regulation",        cx: 50,  cy: 368, from: ["glp1", "gip"] },
  { id: "glucose",  label: "Glucose",     sub: "Uptake",            cx: 168, cy: 368, from: ["glp1", "gip", "absorb"] },
  { id: "lipid",    label: "Lipid",       sub: "Metabolism",        cx: 286, cy: 368, from: ["glp1", "gip"] },
  { id: "insulin",  label: "Insulin",     sub: "Sensitivity",       cx: 404, cy: 368, from: ["glp1", "gip", "absorb"] },
  { id: "glut4",    label: "GLUT4",       sub: "Translocation",     cx: 522, cy: 368, from: ["glp1", "dpp4"] },
  { id: "fao",      label: "Fatty Acid",  sub: "Oxidation",         cx: 640, cy: 368, from: ["glp1", "dpp4"] },
  { id: "satiety",  label: "Gut-Brain",   sub: "Satiety",           cx: 758, cy: 368, from: ["glp1", "gip"] },
  // Row 2 (y ≈ 452)
  { id: "trig",     label: "Triglyceride", sub: "Reduction",        cx: 82,  cy: 452, from: ["glp1", "dpp4"] },
  { id: "thermo",   label: "Thermogenesis", sub: "",                cx: 222, cy: 452, from: ["dpp4", "absorb"] },
  { id: "adipose",  label: "Adipose",     sub: "Remodeling",        cx: 362, cy: 452, from: ["dpp4", "absorb"] },
  { id: "inflam",   label: "Inflammatory", sub: "Regulation",       cx: 500, cy: 452, from: ["dpp4", "absorb"] },
  { id: "mtor",     label: "mTOR",        sub: "Modulation",        cx: 638, cy: 452, from: ["dpp4", "absorb"] },
  { id: "energy",   label: "Cellular",    sub: "Energy Sensing",    cx: 776, cy: 452, from: ["dpp4", "absorb"] },
];

// ── Layout ────────────────────────────────────────────────────────────────────
const W = 900, H = 528;

// ── Helper: compute active sets for a given hovered source ───────────────────
function getActive(hoveredId: string | null) {
  if (!hoveredId) return { srcIds: new Set<string>(), midIds: new Set<string>(), downIds: new Set<string>() };
  const srcIds = new Set([hoveredId]);
  const midIds = new Set(MIDDLE.filter(m => m.from.includes(hoveredId)).map(m => m.id));
  const downIds = new Set(DOWN.filter(d => d.from.some(f => midIds.has(f))).map(d => d.id));
  return { srcIds, midIds, downIds };
}

// ── Curved path between two nodes ─────────────────────────────────────────────
function curvePath(x1: number, y1: number, x2: number, y2: number): string {
  const mx = (x1 + x2) / 2;
  const my = (y1 + y2) / 2;
  const bow = Math.abs(x2 - x1) * 0.12;
  return `M${x1} ${y1} C${x1} ${my + bow},${x2} ${my - bow},${x2} ${y2}`;
}

// ── Component ─────────────────────────────────────────────────────────────────
export default function PathwayNetwork() {
  const [hovered, setHovered] = useState<string | null>(null);
  const active = getActive(hovered);
  const isHovering = hovered !== null;

  const lineOpacity = useCallback(
    (srcId: string, isActive: boolean) => {
      if (!isHovering) return 0.22;
      return isActive ? 0.75 : 0.05;
    },
    [isHovering]
  );

  const nodeOpacity = useCallback(
    (isActive: boolean) => {
      if (!isHovering) return 1;
      return isActive ? 1 : 0.18;
    },
    [isHovering]
  );

  return (
    <figure className="w-full select-none">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="w-full h-auto"
        aria-label="13-pathway network map showing how Activate, Protect, and Deliver mechanisms connect to metabolic outcomes"
      >
        {/* ── Source → Middle connections ────────────────────────────────── */}
        {MIDDLE.map(mid =>
          mid.from.map(srcId => {
            const src = SOURCES.find(s => s.id === srcId)!;
            const isActive = active.midIds.has(mid.id) && active.srcIds.has(srcId);
            return (
              <path
                key={`${srcId}-${mid.id}`}
                d={curvePath(src.cx, src.cy + src.r, mid.cx, mid.cy - mid.r)}
                fill="none"
                stroke={src.color}
                strokeWidth={isHovering && isActive ? 2 : 1.2}
                opacity={lineOpacity(srcId, isActive)}
                style={{ transition: "opacity 0.2s, stroke-width 0.2s" }}
              />
            );
          })
        )}

        {/* ── Middle → Downstream connections ───────────────────────────── */}
        {DOWN.map(down =>
          down.from.map(midId => {
            const mid = MIDDLE.find(m => m.id === midId)!;
            const src = SOURCES.find(s => s.id === mid.from[0])!;
            const isActive = active.midIds.has(midId) && active.downIds.has(down.id);
            return (
              <path
                key={`${midId}-${down.id}`}
                d={curvePath(mid.cx, mid.cy + mid.r, down.cx, down.cy - 13)}
                fill="none"
                stroke={src.color}
                strokeWidth={isHovering && isActive ? 1.5 : 0.9}
                opacity={lineOpacity(mid.from[0], isActive)}
                style={{ transition: "opacity 0.2s, stroke-width 0.2s" }}
              />
            );
          })
        )}

        {/* ── Downstream nodes ──────────────────────────────────────────── */}
        {DOWN.map(d => {
          const isActive = !isHovering || active.downIds.has(d.id);
          return (
            <g key={d.id} opacity={nodeOpacity(isActive)} style={{ transition: "opacity 0.2s" }}>
              <circle
                cx={d.cx} cy={d.cy} r={13}
                fill="white" stroke={C.silver} strokeWidth={1.2}
              />
              <text
                x={d.cx} y={d.cy + 24}
                textAnchor="middle"
                fontFamily="Inter,sans-serif" fontSize={8}
                fontWeight={600} fill={C.muted}
              >
                {d.label}
              </text>
              {d.sub && (
                <text
                  x={d.cx} y={d.cy + 34}
                  textAnchor="middle"
                  fontFamily="Inter,sans-serif" fontSize={7.5}
                  fill={C.silver}
                >
                  {d.sub}
                </text>
              )}
            </g>
          );
        })}

        {/* ── Middle tier nodes ─────────────────────────────────────────── */}
        {MIDDLE.map(m => {
          const isActive = !isHovering || active.midIds.has(m.id);
          const srcColor = SOURCES.find(s => s.id === m.from[0])?.color ?? C.silver;
          return (
            <g key={m.id} opacity={nodeOpacity(isActive)} style={{ transition: "opacity 0.2s" }}>
              <circle
                cx={m.cx} cy={m.cy} r={m.r}
                fill="white"
                stroke={srcColor} strokeWidth={1.5}
                strokeOpacity={0.6}
              />
              <text
                x={m.cx} y={m.cy - 1}
                textAnchor="middle" dominantBaseline="middle"
                fontFamily="Inter,sans-serif" fontSize={9}
                fontWeight={700} fill={srcColor}
              >
                {m.label}
              </text>
              <text
                x={m.cx} y={m.cy + 10}
                textAnchor="middle" dominantBaseline="middle"
                fontFamily="Inter,sans-serif" fontSize={7.5}
                fill={srcColor} opacity={0.7}
              >
                {m.sub}
              </text>
            </g>
          );
        })}

        {/* ── Source nodes (interactive) ────────────────────────────────── */}
        {SOURCES.map(src => {
          const isActive = !isHovering || active.srcIds.has(src.id);
          return (
            <g
              key={src.id}
              onMouseEnter={() => setHovered(src.id)}
              onMouseLeave={() => setHovered(null)}
              style={{ cursor: "pointer", transition: "opacity 0.2s" }}
              opacity={nodeOpacity(isActive)}
            >
              {/* Outer ring (hover affordance) */}
              <circle
                cx={src.cx} cy={src.cy} r={src.r + 6}
                fill="transparent"
                stroke={src.color}
                strokeWidth={1}
                strokeOpacity={hovered === src.id ? 0.25 : 0}
                style={{ transition: "stroke-opacity 0.2s" }}
              />
              {/* Main circle */}
              <circle
                cx={src.cx} cy={src.cy} r={src.r}
                fill={src.color}
                fillOpacity={hovered === src.id ? 1 : 0.88}
                stroke={src.color} strokeWidth={0}
              />
              {/* Label */}
              <text
                x={src.cx} y={src.cy - 2}
                textAnchor="middle" dominantBaseline="middle"
                fontFamily="'Fraunces Variable',Fraunces,Georgia,serif"
                fontSize={13} fontWeight={600}
                fill="white"
              >
                {src.label}
              </text>
              {/* Sub-label below circle */}
              <text
                x={src.cx} y={src.cy + src.r + 14}
                textAnchor="middle"
                fontFamily="Inter,sans-serif" fontSize={8.5}
                fill={C.muted} letterSpacing={0.3}
              >
                {src.sub}
              </text>
            </g>
          );
        })}

        {/* ── Hover prompt (desktop only) ───────────────────────────────── */}
        {!isHovering && (
          <text
            x={W / 2} y={H - 8}
            textAnchor="middle"
            fontFamily="Inter,sans-serif" fontSize={9}
            fill={C.silver} letterSpacing={1}
          >
            HOVER A MECHANISM TO TRACE ITS PATHWAYS
          </text>
        )}
      </svg>
      <figcaption className="text-center text-[11px] text-mist mt-2">
        Three primary mechanisms connect to 13 downstream metabolic effects through four biological events.
      </figcaption>
    </figure>
  );
}
