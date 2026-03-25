// Server-compatible — no "use client" needed (static SVG)
// Mechanism of action: nanoemulsion → epithelial crossing → L-cell activation
//                      → DPP-4 inhibition → 13 downstream pathways

const W = 960;
const H = 380;

// ── Shared marker defs ────────────────────────────────────────────────────────
function Defs() {
  return (
    <defs>
      <marker id="arr-teal" markerWidth="6" markerHeight="4" refX="5" refY="2" orient="auto">
        <polygon points="0 0,6 2,0 4" fill="#1585B5" />
      </marker>
      <marker id="arr-gold" markerWidth="6" markerHeight="4" refX="5" refY="2" orient="auto">
        <polygon points="0 0,6 2,0 4" fill="#C8962E" />
      </marker>
      <marker id="arr-navy" markerWidth="6" markerHeight="4" refX="5" refY="2" orient="auto">
        <polygon points="0 0,6 2,0 4" fill="#0A2463" opacity="0.5" />
      </marker>
      <marker id="arr-silver" markerWidth="6" markerHeight="4" refX="5" refY="2" orient="auto">
        <polygon points="0 0,6 2,0 4" fill="#9CA3AF" />
      </marker>
    </defs>
  );
}

// ── Stage zone label (eyebrow style) ─────────────────────────────────────────
function ZoneLabel({ n, title, x }: { n: string; title: string; x: number }) {
  return (
    <>
      <text
        x={x} y={18}
        textAnchor="middle"
        fontFamily="Inter,sans-serif" fontSize={8}
        letterSpacing={2} fontWeight={700}
        fill="#9CA3AF"
      >
        {n} · {title.toUpperCase()}
      </text>
    </>
  );
}

// ── Nanoparticle (lipid-shell visualization) ──────────────────────────────────
function Nano({ cx, cy, r = 7 }: { cx: number; cy: number; r?: number }) {
  return (
    <g>
      <circle cx={cx} cy={cy} r={r + 3} fill="#1585B5" fillOpacity={0.08} />
      <circle cx={cx} cy={cy} r={r} fill="#1585B5" fillOpacity={0.18} stroke="#1585B5" strokeWidth={0.8} />
      <circle cx={cx} cy={cy} r={r - 3} fill="#1585B5" fillOpacity={0.5} />
    </g>
  );
}

// ── Villus (intestinal projection) ────────────────────────────────────────────
function Villus({ x, y }: { x: number; y: number }) {
  const w = 13, h = 52;
  return (
    <rect
      x={x - w / 2} y={y - h} width={w} height={h}
      rx={w / 2}
      fill="#F3F4F6" stroke="#D1D5DB" strokeWidth={0.8}
    />
  );
}

// ── Component ─────────────────────────────────────────────────────────────────
export default function MechanismIllustration() {
  // Zone x boundaries
  const Z1 = { x: 0,   w: 170 };  // Nanoemulsion in lumen
  const Z2 = { x: 170, w: 165 };  // Epithelial crossing
  const Z3 = { x: 335, w: 210 };  // L-cell activation
  const Z4 = { x: 545, w: 185 };  // DPP-4 inhibition
  const Z5 = { x: 730, w: 230 };  // Downstream pathways

  // Intestinal wall y
  const WALL = 188;

  // Zone center x helpers
  const zc = (z: { x: number; w: number }) => z.x + z.w / 2;

  // Villi x positions (zone 2)
  const VILLI_X = [186, 208, 230, 252, 274, 296, 318];

  // L-cell center
  const LCX = 440, LCY = 265;

  // GLP-1 / GIP output positions
  const GLP1_X = 520, GLP1_Y = 247;
  const GIP_X = 520, GIP_Y = 278;

  // DPP-4 zone reference points
  const DPP4_CX = 618, DPP4_CY = 210;
  const GLP1_PASS_Y = 250;

  return (
    <figure className="w-full select-none overflow-hidden">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="w-full h-auto"
        aria-label="Mechanism of action: five-stage illustration from nanoemulsion ingestion to 13 downstream metabolic pathways"
      >
        <Defs />

        {/* ── Subtle zone backgrounds ───────────────────────────────────── */}
        <rect x={Z3.x} y={0} width={Z3.w} height={H} fill="#FEF9F0" opacity={0.4} />
        <rect x={Z4.x} y={0} width={Z4.w} height={H} fill="#F9FAFB" opacity={0.6} />

        {/* ── Stage labels ──────────────────────────────────────────────── */}
        <ZoneLabel n="01" title="Nanoemulsion" x={zc(Z1)} />
        <ZoneLabel n="02" title="Epithelial crossing" x={zc(Z2)} />
        <ZoneLabel n="03" title="L-cell activation" x={zc(Z3)} />
        <ZoneLabel n="04" title="DPP-4 inhibition" x={zc(Z4)} />
        <ZoneLabel n="05" title="13 pathways" x={zc(Z5)} />

        {/* ── Zone dividers ─────────────────────────────────────────────── */}
        {[Z2.x, Z3.x, Z4.x, Z5.x].map(x => (
          <line
            key={x}
            x1={x} y1={28} x2={x} y2={H - 8}
            stroke="#E5E7EB" strokeWidth={0.8}
            strokeDasharray="3,4"
          />
        ))}

        {/* ── "Intestinal lumen" label ──────────────────────────────────── */}
        <text
          x={Z1.x + 8} y={WALL - 8}
          fontFamily="Inter,sans-serif" fontSize={8}
          fill="#9CA3AF" letterSpacing={1}
        >
          INTESTINAL LUMEN
        </text>

        {/* ── Intestinal wall line ─────────────────────────────────────── */}
        <line
          x1={0} y1={WALL} x2={W} y2={WALL}
          stroke="#D1D5DB" strokeWidth={1.5}
        />

        {/* ── "Systemic" label ──────────────────────────────────────────── */}
        <text
          x={Z1.x + 8} y={WALL + 14}
          fontFamily="Inter,sans-serif" fontSize={8}
          fill="#9CA3AF" letterSpacing={1}
        >
          SUBMUCOSAL LAYER
        </text>

        {/* ── ZONE 1: Nanoparticles in lumen ───────────────────────────── */}
        <Nano cx={28}  cy={88} r={8} />
        <Nano cx={62}  cy={130} r={7} />
        <Nano cx={95}  cy={72} r={9} />
        <Nano cx={128} cy={115} r={7} />
        <Nano cx={152} cy={158} r={6} />
        <Nano cx={42}  cy={160} r={6} />

        {/* Directional arrow (nanoparticles moving right) */}
        <line
          x1={155} y1={145} x2={170} y2={175}
          stroke="#1585B5" strokeWidth={1}
          strokeOpacity={0.4}
          markerEnd="url(#arr-teal)"
          strokeDasharray="2,2"
        />

        {/* ── ZONE 2: Villi + crossing ──────────────────────────────────── */}
        {VILLI_X.map(vx => (
          <Villus key={vx} x={vx} y={WALL} />
        ))}

        {/* Nanoparticles between villi */}
        <Nano cx={197} cy={170} r={6} />
        <Nano cx={241} cy={165} r={5.5} />
        <Nano cx={285} cy={170} r={6} />

        {/* Crossing arrows */}
        <line
          x1={197} y1={178} x2={197} y2={210}
          stroke="#1585B5" strokeWidth={1.2}
          markerEnd="url(#arr-teal)"
        />
        <line
          x1={241} y1={178} x2={241} y2={210}
          stroke="#1585B5" strokeWidth={1.2}
          markerEnd="url(#arr-teal)"
        />
        <line
          x1={285} y1={178} x2={285} y2={210}
          stroke="#1585B5" strokeWidth={1.2}
          markerEnd="url(#arr-teal)"
        />

        {/* Nanoparticles below wall (absorbed) */}
        <Nano cx={215} cy={228} r={5} />
        <Nano cx={262} cy={238} r={5} />

        {/* ── ZONE 3: L-cell ───────────────────────────────────────────── */}

        {/* Three activation pathways entering L-cell */}
        {[
          { y: LCY - 24, label: "AMPK" },
          { y: LCY,      label: "GPR120" },
          { y: LCY + 24, label: "Insulin R." },
        ].map(({ y, label }) => (
          <g key={label}>
            <line
              x1={Z3.x + 6} y1={y} x2={LCX - 52} y2={y}
              stroke="#C8962E" strokeWidth={1}
              strokeOpacity={0.6}
              markerEnd="url(#arr-gold)"
            />
            <text
              x={Z3.x + 4} y={y - 5}
              fontFamily="Inter,sans-serif" fontSize={7.5}
              fill="#C8962E" opacity={0.75}
            >
              {label}
            </text>
          </g>
        ))}

        {/* L-cell body */}
        <ellipse
          cx={LCX} cy={LCY} rx={52} ry={33}
          fill="#C8962E" fillOpacity={0.1}
          stroke="#C8962E" strokeWidth={1.2}
          strokeOpacity={0.7}
        />
        <text
          x={LCX} y={LCY + 3}
          textAnchor="middle" dominantBaseline="middle"
          fontFamily="Inter,sans-serif" fontSize={9}
          fontWeight={700} fill="#C8962E"
        >
          L-cell
        </text>
        <text
          x={LCX} y={LCY + 15}
          textAnchor="middle" dominantBaseline="middle"
          fontFamily="Inter,sans-serif" fontSize={7.5}
          fill="#C8962E" opacity={0.6}
        >
          enteroendocrine
        </text>

        {/* GLP-1 output */}
        <line
          x1={LCX + 52} y1={GLP1_Y} x2={GLP1_X - 2} y2={GLP1_Y}
          stroke="#C8962E" strokeWidth={1.2}
          markerEnd="url(#arr-gold)"
        />
        <rect
          x={GLP1_X} y={GLP1_Y - 9} width={36} height={18}
          rx={9}
          fill="#C8962E" fillOpacity={0.12}
          stroke="#C8962E" strokeWidth={1}
        />
        <text
          x={GLP1_X + 18} y={GLP1_Y + 1}
          textAnchor="middle" dominantBaseline="middle"
          fontFamily="Inter,sans-serif" fontSize={8.5}
          fontWeight={700} fill="#C8962E"
        >
          GLP-1
        </text>

        {/* GIP output */}
        <line
          x1={LCX + 52} y1={GIP_Y} x2={GIP_X - 2} y2={GIP_Y}
          stroke="#C8962E" strokeWidth={1}
          strokeOpacity={0.6}
          markerEnd="url(#arr-gold)"
        />
        <rect
          x={GIP_X} y={GIP_Y - 8} width={30} height={16}
          rx={8}
          fill="#C8962E" fillOpacity={0.08}
          stroke="#C8962E" strokeWidth={0.8} strokeOpacity={0.5}
        />
        <text
          x={GIP_X + 15} y={GIP_Y + 1}
          textAnchor="middle" dominantBaseline="middle"
          fontFamily="Inter,sans-serif" fontSize={8}
          fill="#C8962E" opacity={0.7}
        >
          GIP
        </text>

        {/* ── ZONE 4: DPP-4 inhibition ─────────────────────────────────── */}

        {/* GLP-1 traveling right */}
        <line
          x1={GLP1_X + 36} y1={GLP1_PASS_Y}
          x2={Z4.x + 14} y2={GLP1_PASS_Y}
          stroke="#C8962E" strokeWidth={1.2}
          markerEnd="url(#arr-gold)"
        />

        {/* DPP-4 enzyme (descending) */}
        <ellipse
          cx={DPP4_CX} cy={DPP4_CY}
          rx={24} ry={16}
          fill="#9CA3AF" fillOpacity={0.15}
          stroke="#9CA3AF" strokeWidth={1.2}
        />
        <text
          x={DPP4_CX} y={DPP4_CY + 1}
          textAnchor="middle" dominantBaseline="middle"
          fontFamily="Inter,sans-serif" fontSize={8}
          fontWeight={600} fill="#6B7280"
        >
          DPP-4
        </text>

        {/* Inhibition line (DPP-4 can't reach GLP-1) */}
        <line
          x1={DPP4_CX} y1={DPP4_CY + 16}
          x2={DPP4_CX} y2={GLP1_PASS_Y - 10}
          stroke="#9CA3AF" strokeWidth={1}
          strokeDasharray="3,2"
        />

        {/* Block symbol */}
        <line
          x1={DPP4_CX - 10} y1={GLP1_PASS_Y - 10}
          x2={DPP4_CX + 10} y2={GLP1_PASS_Y - 10}
          stroke="#9CA3AF" strokeWidth={2}
        />

        {/* GLP-1 continues past, now labeled as "active" */}
        <line
          x1={DPP4_CX + 14} y1={GLP1_PASS_Y}
          x2={Z5.x - 6} y2={GLP1_PASS_Y}
          stroke="#C8962E" strokeWidth={1.5}
          markerEnd="url(#arr-gold)"
        />

        {/* Annotation */}
        <text
          x={DPP4_CX} y={GLP1_PASS_Y + 22}
          textAnchor="middle"
          fontFamily="Inter,sans-serif" fontSize={7.5}
          fill="#9CA3AF"
        >
          half-life extended
        </text>

        {/* ── ZONE 5: Downstream pathways ──────────────────────────────── */}

        {/* Central GLP-1 node */}
        <ellipse
          cx={Z5.x + 22} cy={GLP1_PASS_Y}
          rx={22} ry={14}
          fill="#0A2463" fillOpacity={0.08}
          stroke="#0A2463" strokeWidth={1}
          strokeOpacity={0.4}
        />
        <text
          x={Z5.x + 22} y={GLP1_PASS_Y + 1}
          textAnchor="middle" dominantBaseline="middle"
          fontFamily="Inter,sans-serif" fontSize={7.5}
          fontWeight={700} fill="#0A2463" opacity={0.6}
        >
          GLP-1
        </text>

        {/* Radiating downstream effects */}
        {[
          { label: "Appetite ↓",        dx: 68, dy: -85 },
          { label: "Glucose uptake ↑",  dx: 90, dy: -48 },
          { label: "Insulin sensitivity", dx: 96, dy: -10 },
          { label: "GLUT4 translocation", dx: 90, dy: 30 },
          { label: "Lipid metabolism",   dx: 68, dy: 68 },
          { label: "Gut-brain satiety",  dx: 30, dy: 90 },
        ].map(({ label, dx, dy }) => {
          const tx = Z5.x + 22 + dx;
          const ty = GLP1_PASS_Y + dy;
          const ex = Z5.x + 22 + dx * 0.55;
          const ey = GLP1_PASS_Y + dy * 0.55;
          return (
            <g key={label}>
              <line
                x1={Z5.x + 44} y1={GLP1_PASS_Y}
                x2={ex} y2={ey}
                stroke="#0A2463" strokeWidth={0.8}
                strokeOpacity={0.25}
              />
              <text
                x={tx} y={ty}
                textAnchor={dx > 0 ? "start" : "middle"}
                fontFamily="Inter,sans-serif" fontSize={7.5}
                fill="#0A2463" opacity={0.55}
              >
                {label}
              </text>
            </g>
          );
        })}

        {/* "+7 more" note */}
        <text
          x={Z5.x + 22 + 30} y={GLP1_PASS_Y + 110}
          fontFamily="Inter,sans-serif" fontSize={8}
          fill="#9CA3AF"
        >
          + 7 more pathways
        </text>
      </svg>
      <figcaption className="text-center text-[11px] text-mist mt-2">
        From nanoemulsion ingestion to 13 metabolic pathways — the complete mechanism of action.
      </figcaption>
    </figure>
  );
}
