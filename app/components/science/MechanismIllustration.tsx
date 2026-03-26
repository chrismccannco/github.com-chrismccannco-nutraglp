// Server-compatible — no "use client" needed (static SVG)
// Mechanism of action: nanoemulsion → epithelial crossing → L-cell activation
//                      → DPP-4 inhibition → 13 downstream pathways

// Current palette:
// forest-mid #2B5EA7, gold #b8955a, forest #1B3A5C, mist #8a8a80

const W = 960;
const H = 380;

function Defs() {
  return (
    <defs>
      <marker id="arr-blue" markerWidth="6" markerHeight="4" refX="5" refY="2" orient="auto">
        <polygon points="0 0,6 2,0 4" fill="#2B5EA7" />
      </marker>
      <marker id="arr-gold" markerWidth="6" markerHeight="4" refX="5" refY="2" orient="auto">
        <polygon points="0 0,6 2,0 4" fill="#b8955a" />
      </marker>
      <marker id="arr-navy" markerWidth="6" markerHeight="4" refX="5" refY="2" orient="auto">
        <polygon points="0 0,6 2,0 4" fill="#1B3A5C" opacity="0.5" />
      </marker>
      <marker id="arr-silver" markerWidth="6" markerHeight="4" refX="5" refY="2" orient="auto">
        <polygon points="0 0,6 2,0 4" fill="#8a8a80" />
      </marker>
    </defs>
  );
}

function ZoneLabel({ n, title, x }: { n: string; title: string; x: number }) {
  return (
    <text
      x={x} y={18}
      textAnchor="middle"
      fontFamily="'DM Sans',Inter,sans-serif" fontSize={8}
      letterSpacing={2} fontWeight={700}
      fill="#8a8a80"
    >
      {n} · {title.toUpperCase()}
    </text>
  );
}

function Nano({ cx, cy, r = 7 }: { cx: number; cy: number; r?: number }) {
  return (
    <g>
      <circle cx={cx} cy={cy} r={r + 3} fill="#2B5EA7" fillOpacity={0.08} />
      <circle cx={cx} cy={cy} r={r} fill="#2B5EA7" fillOpacity={0.18} stroke="#2B5EA7" strokeWidth={0.8} />
      <circle cx={cx} cy={cy} r={r - 3} fill="#2B5EA7" fillOpacity={0.5} />
    </g>
  );
}

function Villus({ x, y }: { x: number; y: number }) {
  const w = 13, h = 52;
  return (
    <rect
      x={x - w / 2} y={y - h} width={w} height={h}
      rx={w / 2}
      fill="#f5f2eb" stroke="#ddd8ce" strokeWidth={0.8}
    />
  );
}

export default function MechanismIllustration() {
  const Z1 = { x: 0,   w: 170 };
  const Z2 = { x: 170, w: 165 };
  const Z3 = { x: 335, w: 210 };
  const Z4 = { x: 545, w: 185 };
  const Z5 = { x: 730, w: 230 };

  const WALL = 188;
  const zc = (z: { x: number; w: number }) => z.x + z.w / 2;
  const VILLI_X = [186, 208, 230, 252, 274, 296, 318];
  const LCX = 440, LCY = 265;
  const GLP1_X = 520, GLP1_Y = 247;
  const GIP_X = 520, GIP_Y = 278;
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

        {/* Zone backgrounds */}
        <rect x={Z3.x} y={0} width={Z3.w} height={H} fill="#f5f2eb" opacity={0.4} />
        <rect x={Z4.x} y={0} width={Z4.w} height={H} fill="#f5f2eb" opacity={0.2} />

        {/* Stage labels */}
        <ZoneLabel n="01" title="Nanoemulsion" x={zc(Z1)} />
        <ZoneLabel n="02" title="Epithelial crossing" x={zc(Z2)} />
        <ZoneLabel n="03" title="L-cell activation" x={zc(Z3)} />
        <ZoneLabel n="04" title="DPP-4 inhibition" x={zc(Z4)} />
        <ZoneLabel n="05" title="13 pathways" x={zc(Z5)} />

        {/* Zone dividers */}
        {[Z2.x, Z3.x, Z4.x, Z5.x].map(x => (
          <line
            key={x}
            x1={x} y1={28} x2={x} y2={H - 8}
            stroke="#ddd8ce" strokeWidth={0.8}
            strokeDasharray="3,4"
          />
        ))}

        {/* Intestinal lumen label */}
        <text
          x={Z1.x + 8} y={WALL - 8}
          fontFamily="'DM Sans',Inter,sans-serif" fontSize={8}
          fill="#8a8a80" letterSpacing={1}
        >
          INTESTINAL LUMEN
        </text>

        {/* Intestinal wall */}
        <line x1={0} y1={WALL} x2={W} y2={WALL} stroke="#ddd8ce" strokeWidth={1.5} />

        {/* Submucosal label */}
        <text
          x={Z1.x + 8} y={WALL + 14}
          fontFamily="'DM Sans',Inter,sans-serif" fontSize={8}
          fill="#8a8a80" letterSpacing={1}
        >
          SUBMUCOSAL LAYER
        </text>

        {/* ZONE 1: Nanoparticles */}
        <Nano cx={28}  cy={88} r={8} />
        <Nano cx={62}  cy={130} r={7} />
        <Nano cx={95}  cy={72} r={9} />
        <Nano cx={128} cy={115} r={7} />
        <Nano cx={152} cy={158} r={6} />
        <Nano cx={42}  cy={160} r={6} />

        <line
          x1={155} y1={145} x2={170} y2={175}
          stroke="#2B5EA7" strokeWidth={1} strokeOpacity={0.4}
          markerEnd="url(#arr-blue)" strokeDasharray="2,2"
        />

        {/* ZONE 2: Villi + crossing */}
        {VILLI_X.map(vx => <Villus key={vx} x={vx} y={WALL} />)}

        <Nano cx={197} cy={170} r={6} />
        <Nano cx={241} cy={165} r={5.5} />
        <Nano cx={285} cy={170} r={6} />

        {[197, 241, 285].map(x => (
          <line
            key={x}
            x1={x} y1={178} x2={x} y2={210}
            stroke="#2B5EA7" strokeWidth={1.2}
            markerEnd="url(#arr-blue)"
          />
        ))}

        <Nano cx={215} cy={228} r={5} />
        <Nano cx={262} cy={238} r={5} />

        {/* ZONE 3: L-cell */}
        {[
          { y: LCY - 24, label: "AMPK" },
          { y: LCY,      label: "GPR120" },
          { y: LCY + 24, label: "Insulin R." },
        ].map(({ y, label }) => (
          <g key={label}>
            <line
              x1={Z3.x + 6} y1={y} x2={LCX - 52} y2={y}
              stroke="#b8955a" strokeWidth={1} strokeOpacity={0.6}
              markerEnd="url(#arr-gold)"
            />
            <text
              x={Z3.x + 4} y={y - 5}
              fontFamily="'DM Sans',Inter,sans-serif" fontSize={7.5}
              fill="#b8955a" opacity={0.75}
            >
              {label}
            </text>
          </g>
        ))}

        <ellipse
          cx={LCX} cy={LCY} rx={52} ry={33}
          fill="#b8955a" fillOpacity={0.1}
          stroke="#b8955a" strokeWidth={1.2} strokeOpacity={0.7}
        />
        <text
          x={LCX} y={LCY + 3} textAnchor="middle" dominantBaseline="middle"
          fontFamily="'DM Sans',Inter,sans-serif" fontSize={9} fontWeight={700} fill="#b8955a"
        >
          L-cell
        </text>
        <text
          x={LCX} y={LCY + 15} textAnchor="middle" dominantBaseline="middle"
          fontFamily="'DM Sans',Inter,sans-serif" fontSize={7.5} fill="#b8955a" opacity={0.6}
        >
          enteroendocrine
        </text>

        {/* GLP-1 output */}
        <line
          x1={LCX + 52} y1={GLP1_Y} x2={GLP1_X - 2} y2={GLP1_Y}
          stroke="#b8955a" strokeWidth={1.2} markerEnd="url(#arr-gold)"
        />
        <rect
          x={GLP1_X} y={GLP1_Y - 9} width={36} height={18} rx={9}
          fill="#b8955a" fillOpacity={0.12} stroke="#b8955a" strokeWidth={1}
        />
        <text
          x={GLP1_X + 18} y={GLP1_Y + 1} textAnchor="middle" dominantBaseline="middle"
          fontFamily="'DM Sans',Inter,sans-serif" fontSize={8.5} fontWeight={700} fill="#b8955a"
        >
          GLP-1
        </text>

        {/* GIP output */}
        <line
          x1={LCX + 52} y1={GIP_Y} x2={GIP_X - 2} y2={GIP_Y}
          stroke="#b8955a" strokeWidth={1} strokeOpacity={0.6} markerEnd="url(#arr-gold)"
        />
        <rect
          x={GIP_X} y={GIP_Y - 8} width={30} height={16} rx={8}
          fill="#b8955a" fillOpacity={0.08} stroke="#b8955a" strokeWidth={0.8} strokeOpacity={0.5}
        />
        <text
          x={GIP_X + 15} y={GIP_Y + 1} textAnchor="middle" dominantBaseline="middle"
          fontFamily="'DM Sans',Inter,sans-serif" fontSize={8} fill="#b8955a" opacity={0.7}
        >
          GIP
        </text>

        {/* ZONE 4: DPP-4 inhibition */}
        <line
          x1={GLP1_X + 36} y1={GLP1_PASS_Y} x2={Z4.x + 14} y2={GLP1_PASS_Y}
          stroke="#b8955a" strokeWidth={1.2} markerEnd="url(#arr-gold)"
        />

        <ellipse
          cx={DPP4_CX} cy={DPP4_CY} rx={24} ry={16}
          fill="#8a8a80" fillOpacity={0.15} stroke="#8a8a80" strokeWidth={1.2}
        />
        <text
          x={DPP4_CX} y={DPP4_CY + 1} textAnchor="middle" dominantBaseline="middle"
          fontFamily="'DM Sans',Inter,sans-serif" fontSize={8} fontWeight={600} fill="#6B7280"
        >
          DPP-4
        </text>

        <line
          x1={DPP4_CX} y1={DPP4_CY + 16} x2={DPP4_CX} y2={GLP1_PASS_Y - 10}
          stroke="#8a8a80" strokeWidth={1} strokeDasharray="3,2"
        />
        <line
          x1={DPP4_CX - 10} y1={GLP1_PASS_Y - 10} x2={DPP4_CX + 10} y2={GLP1_PASS_Y - 10}
          stroke="#8a8a80" strokeWidth={2}
        />

        <line
          x1={DPP4_CX + 14} y1={GLP1_PASS_Y} x2={Z5.x - 6} y2={GLP1_PASS_Y}
          stroke="#b8955a" strokeWidth={1.5} markerEnd="url(#arr-gold)"
        />
        <text
          x={DPP4_CX} y={GLP1_PASS_Y + 22} textAnchor="middle"
          fontFamily="'DM Sans',Inter,sans-serif" fontSize={7.5} fill="#8a8a80"
        >
          half-life extended
        </text>

        {/* ZONE 5: Downstream pathways */}
        <ellipse
          cx={Z5.x + 22} cy={GLP1_PASS_Y} rx={22} ry={14}
          fill="#1B3A5C" fillOpacity={0.08} stroke="#1B3A5C" strokeWidth={1} strokeOpacity={0.4}
        />
        <text
          x={Z5.x + 22} y={GLP1_PASS_Y + 1} textAnchor="middle" dominantBaseline="middle"
          fontFamily="'DM Sans',Inter,sans-serif" fontSize={7.5} fontWeight={700} fill="#1B3A5C" opacity={0.6}
        >
          GLP-1
        </text>

        {[
          { label: "Appetite \u2193",        dx: 68, dy: -85 },
          { label: "Glucose uptake \u2191",  dx: 90, dy: -48 },
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
                x1={Z5.x + 44} y1={GLP1_PASS_Y} x2={ex} y2={ey}
                stroke="#1B3A5C" strokeWidth={0.8} strokeOpacity={0.25}
              />
              <text
                x={tx} y={ty} textAnchor={dx > 0 ? "start" : "middle"}
                fontFamily="'DM Sans',Inter,sans-serif" fontSize={7.5} fill="#1B3A5C" opacity={0.55}
              >
                {label}
              </text>
            </g>
          );
        })}

        <text
          x={Z5.x + 22 + 30} y={GLP1_PASS_Y + 110}
          fontFamily="'DM Sans',Inter,sans-serif" fontSize={8} fill="#8a8a80"
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
