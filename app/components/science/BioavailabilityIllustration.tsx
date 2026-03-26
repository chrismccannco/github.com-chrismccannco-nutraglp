"use client";
import { useEffect, useRef, useState } from "react";

// Current palette: forest-mid #2B5EA7, mist #8a8a80, ink #1a1a18

const STAGES = [
  { label: "Ingested",        std: 100, nano: 100 },
  { label: "Post-gastric",    std: 35,  nano: 92  },
  { label: "Post-absorption", std: 22,  nano: 85  },
  { label: "Post-liver",      std: 12,  nano: 78  },
  { label: "At target",       std: 9,   nano: 72  },
];

const R_MAX = 44;
const rOf = (v: number) => Math.sqrt(v / 100) * R_MAX;

const LX = 195;
const RX = 565;
const SY = [80, 190, 300, 410, 498];
const W = 760;
const H = 590;

function streamD(x: number, y1: number, r1: number, y2: number, r2: number) {
  const my = (y1 + y2) / 2;
  return [
    `M${x - r1} ${y1 + r1}`,
    `C${x - r1} ${my},${x - r2} ${my},${x - r2} ${y2 - r2}`,
    `L${x + r2} ${y2 - r2}`,
    `C${x + r2} ${my},${x + r1} ${my},${x + r1} ${y1 + r1}`,
    "Z",
  ].join(" ");
}

export default function BioavailabilityIllustration() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [on, setOn] = useState(false);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setOn(true); },
      { threshold: 0.1 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const tr = (i: number) =>
    `transform 0.6s cubic-bezier(0.34,1.56,0.64,1) ${i * 0.12}s`;

  return (
    <figure ref={wrapRef} className="w-full max-w-[720px] mx-auto select-none">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="w-full h-auto"
        aria-label="Bioavailability comparison: standard capsule loses 91% of active compound; NutraGLP nanoemulsion retains 72%"
      >
        {/* Column headers */}
        <text
          x={LX} y={24} textAnchor="middle"
          fontFamily="'DM Sans',Inter,sans-serif" fontSize={9} letterSpacing={2}
          fontWeight={700} fill="#8a8a80"
        >
          STANDARD CAPSULE
        </text>
        <text
          x={RX} y={24} textAnchor="middle"
          fontFamily="'DM Sans',Inter,sans-serif" fontSize={9} letterSpacing={2}
          fontWeight={700} fill="#2B5EA7"
        >
          NUTRAGLP NANOEMULSION
        </text>

        {/* Stage labels */}
        {STAGES.map((s, i) => (
          <text
            key={i} x={10} y={SY[i] + 4} textAnchor="start"
            fontFamily="'DM Sans',Inter,sans-serif" fontSize={9} letterSpacing={1.5}
            fill="#8a8a80"
          >
            {s.label.toUpperCase()}
          </text>
        ))}

        {/* Stream fills */}
        {STAGES.slice(0, -1).map((_, i) => (
          <g key={i} opacity={0.09}>
            <path
              d={streamD(LX, SY[i], rOf(STAGES[i].std), SY[i + 1], rOf(STAGES[i + 1].std))}
              fill="#8a8a80"
            />
            <path
              d={streamD(RX, SY[i], rOf(STAGES[i].nano), SY[i + 1], rOf(STAGES[i + 1].nano))}
              fill="#2B5EA7"
            />
          </g>
        ))}

        {/* Circles */}
        {STAGES.map((s, i) => {
          const sr = rOf(s.std);
          const nr = rOf(s.nano);
          return (
            <g key={i}>
              <circle
                cx={LX} cy={SY[i]} r={sr}
                fill="#8a8a80" fillOpacity={0.12}
                stroke="#8a8a80" strokeWidth={1.5}
                style={{
                  transformBox: "fill-box",
                  transformOrigin: "center",
                  transform: on ? "scale(1)" : "scale(0)",
                  transition: tr(i),
                }}
              />
              <circle
                cx={RX} cy={SY[i]} r={nr}
                fill="#2B5EA7" fillOpacity={0.08}
                stroke="#2B5EA7" strokeWidth={1.5}
                style={{
                  transformBox: "fill-box",
                  transformOrigin: "center",
                  transform: on ? "scale(1)" : "scale(0)",
                  transition: tr(i),
                }}
              />
            </g>
          );
        })}

        {/* Final percentages */}
        <text
          x={LX} y={SY[4] + rOf(9) + 17} textAnchor="middle"
          fontFamily="'DM Sans',Inter,sans-serif" fontSize={13} fontWeight={700}
          fill="#8a8a80"
          style={{ opacity: on ? 1 : 0, transition: "opacity 0.5s ease-out 0.65s" }}
        >
          9%
        </text>
        <text
          x={RX} y={SY[4] + rOf(72) + 17} textAnchor="middle"
          fontFamily="'DM Sans',Inter,sans-serif" fontSize={13} fontWeight={700}
          fill="#2B5EA7"
          style={{ opacity: on ? 1 : 0, transition: "opacity 0.5s ease-out 0.65s" }}
        >
          72%
        </text>

        {/* 8x callout */}
        <line
          x1={LX} y1={H - 28} x2={RX} y2={H - 28}
          stroke="#1a1a18" strokeWidth={0.5} opacity={0.15}
          style={{ opacity: on ? 0.15 : 0, transition: "opacity 0.4s ease-out 0.8s" }}
        />
        <text
          x={W / 2} y={H - 10} textAnchor="middle"
          fontFamily="'DM Sans',Inter,sans-serif" fontSize={12} fontWeight={600}
          fill="#1a1a18"
          style={{ opacity: on ? 1 : 0, transition: "opacity 0.4s ease-out 0.85s" }}
        >
          8× greater bioavailability — 72% vs 9% of active compound reaches target pathways
        </text>
      </svg>
      <figcaption className="text-center text-[11px] text-mist mt-2">
        Active compound remaining at each stage of oral absorption. Area is proportional to quantity.
      </figcaption>
    </figure>
  );
}
