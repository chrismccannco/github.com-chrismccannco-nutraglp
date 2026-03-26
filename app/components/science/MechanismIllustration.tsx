// Mechanism of action — clean horizontal flow
// Style reference: Moderna, Alnylam, Metsera mechanism pages
// Minimal. Typographic. No clip art.

const W = 960;
const H = 320;

// Palette
const BLUE = "#2B5EA7";
const GOLD = "#b8955a";
const NAVY = "#1B3A5C";
const MIST = "#8a8a80";
const RULE = "#ddd8ce";
const CREAM = "#f5f2eb";

// Stage positions (5 stages, evenly spaced)
const stages = [
  {
    n: "01",
    title: "Nanoemulsion",
    body: "Lipid nanoparticles\n< 200nm diameter",
    x: 96,
  },
  {
    n: "02",
    title: "Epithelial Crossing",
    body: "Enhanced membrane\npermeability",
    x: 288,
  },
  {
    n: "03",
    title: "L-Cell Activation",
    body: "AMPK · GPR120\nInsulin receptor",
    x: 480,
  },
  {
    n: "04",
    title: "DPP-4 Inhibition",
    body: "Half-life extension\nof endogenous GLP-1",
    x: 672,
  },
  {
    n: "05",
    title: "13 Pathways",
    body: "Appetite · Glucose\nLipid · Insulin · Satiety",
    x: 864,
  },
];

const CY = 160; // vertical center for the flow
const CIRCLE_R = 36;

function MultilineText({
  text,
  x,
  y,
  fontSize,
  fill,
  opacity = 1,
  fontWeight = 400,
}: {
  text: string;
  x: number;
  y: number;
  fontSize: number;
  fill: string;
  opacity?: number;
  fontWeight?: number;
}) {
  const lines = text.split("\n");
  const lineHeight = fontSize * 1.5;
  const startY = y - ((lines.length - 1) * lineHeight) / 2;
  return (
    <>
      {lines.map((line, i) => (
        <text
          key={i}
          x={x}
          y={startY + i * lineHeight}
          textAnchor="middle"
          dominantBaseline="middle"
          fontFamily="'DM Sans', Inter, sans-serif"
          fontSize={fontSize}
          fontWeight={fontWeight}
          fill={fill}
          opacity={opacity}
        >
          {line}
        </text>
      ))}
    </>
  );
}

export default function MechanismIllustration() {
  return (
    <figure className="w-full select-none overflow-hidden">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="w-full h-auto"
        role="img"
        aria-label="Five-stage mechanism of action: nanoemulsion delivery through to 13 downstream metabolic pathways"
      >
        {/* Subtle horizontal track line */}
        <line
          x1={stages[0].x + CIRCLE_R + 8}
          y1={CY}
          x2={stages[stages.length - 1].x - CIRCLE_R - 8}
          y2={CY}
          stroke={RULE}
          strokeWidth={1}
        />

        {/* Connector arrows between stages */}
        {stages.slice(0, -1).map((s, i) => {
          const next = stages[i + 1];
          const x1 = s.x + CIRCLE_R + 4;
          const x2 = next.x - CIRCLE_R - 4;
          const mx = (x1 + x2) / 2;
          return (
            <g key={i}>
              {/* Arrow head */}
              <line
                x1={mx + 3}
                y1={CY - 4}
                x2={mx + 9}
                y2={CY}
                stroke={MIST}
                strokeWidth={1}
                opacity={0.4}
              />
              <line
                x1={mx + 3}
                y1={CY + 4}
                x2={mx + 9}
                y2={CY}
                stroke={MIST}
                strokeWidth={1}
                opacity={0.4}
              />
            </g>
          );
        })}

        {/* Stage circles + labels */}
        {stages.map((s, i) => {
          // First two stages are delivery (blue), middle is activation (gold),
          // DPP-4 is mist, final pathways is navy
          const color =
            i <= 1 ? BLUE : i === 2 ? GOLD : i === 3 ? MIST : NAVY;
          const fillOpacity = i === stages.length - 1 ? 0.06 : 0.04;
          const strokeOpacity = i === stages.length - 1 ? 0.5 : 0.3;

          return (
            <g key={s.n}>
              {/* Circle */}
              <circle
                cx={s.x}
                cy={CY}
                r={CIRCLE_R}
                fill={color}
                fillOpacity={fillOpacity}
                stroke={color}
                strokeWidth={1.2}
                strokeOpacity={strokeOpacity}
              />

              {/* Stage number */}
              <text
                x={s.x}
                y={CY - 8}
                textAnchor="middle"
                dominantBaseline="middle"
                fontFamily="'DM Sans', Inter, sans-serif"
                fontSize={10}
                fontWeight={700}
                letterSpacing={1}
                fill={color}
                opacity={0.5}
              >
                {s.n}
              </text>

              {/* Stage title — below circle */}
              <text
                x={s.x}
                y={CY + CIRCLE_R + 20}
                textAnchor="middle"
                fontFamily="'Fraunces Variable', Fraunces, Georgia, serif"
                fontSize={12}
                fontWeight={600}
                fill={NAVY}
                letterSpacing={-0.2}
              >
                {s.title}
              </text>

              {/* Description — below title */}
              <MultilineText
                text={s.body}
                x={s.x}
                y={CY + CIRCLE_R + 46}
                fontSize={9}
                fill={MIST}
              />
            </g>
          );
        })}

        {/* Horizontal label: what enters vs what results */}
        <text
          x={stages[0].x}
          y={42}
          textAnchor="middle"
          fontFamily="'DM Sans', Inter, sans-serif"
          fontSize={8}
          letterSpacing={2}
          fontWeight={700}
          fill={MIST}
          opacity={0.6}
        >
          INGESTION
        </text>
        <text
          x={stages[stages.length - 1].x}
          y={42}
          textAnchor="middle"
          fontFamily="'DM Sans', Inter, sans-serif"
          fontSize={8}
          letterSpacing={2}
          fontWeight={700}
          fill={NAVY}
          opacity={0.4}
        >
          METABOLIC EFFECT
        </text>

        {/* Thin connecting line from Ingestion to Metabolic Effect labels */}
        <line
          x1={stages[0].x + 44}
          y1={38}
          x2={stages[stages.length - 1].x - 70}
          y2={38}
          stroke={RULE}
          strokeWidth={0.5}
        />
      </svg>
      <figcaption className="text-center text-[11px] text-mist mt-3">
        Five stages from nanoemulsion ingestion to downstream metabolic effect.
        One daily dose.
      </figcaption>
    </figure>
  );
}
