export const dynamic = "force-static";
import { ImageResponse } from "next/og";

export const runtime = "nodejs";
export const alt = "NutraGLP Research";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const titles: Record<string, { title: string; description: string }> = {
  "natural-glp1-activation": {
    title: "Natural GLP-1 Activation: What the Research Shows",
    description:
      "AMPK activation in intestinal L-cells, clinical evidence, and bioavailability.",
  },
  "nanoemulsion-vs-capsules": {
    title: "Nanoemulsion vs. Capsules: Why Delivery Format Matters",
    description:
      "How lipid-based nanoparticles solve the bioavailability problem that limits most oral supplements.",
  },
  "natural-dpp4-inhibition": {
    title: "Natural DPP-4 Inhibition: Extending Your Body's Own GLP-1",
    description:
      "The enzyme that degrades GLP-1 in minutes, and the natural compounds that slow it down.",
  },
  "endogenous-vs-exogenous-glp1": {
    title: "Endogenous vs. Exogenous GLP-1: Two Approaches",
    description:
      "Pharmaceutical GLP-1 drugs vs. endogenous activation. Different mechanisms, same biological target.",
  },
};

export async function generateStaticParams() {
  return Object.keys(titles).map((slug) => ({ slug }));
}

export default async function OGImage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = titles[slug] || {
    title: "NutraGLP Research",
    description: "Evidence-based articles on natural GLP-1 activation.",
  };

  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "flex-start",
          width: "100%",
          height: "100%",
          backgroundColor: "#0f2d20",
          padding: "80px",
        }}
      >
        <div
          style={{
            display: "flex",
            fontSize: 13,
            fontWeight: 700,
            letterSpacing: "3px",
            color: "#b8955a",
            textTransform: "uppercase" as const,
            marginBottom: 16,
          }}
        >
          NUTRAGLP · RESEARCH
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 46,
            fontWeight: 400,
            color: "#ffffff",
            lineHeight: 1.15,
            maxWidth: 950,
          }}
        >
          {article.title}
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 20,
            color: "rgba(255,255,255,0.45)",
            marginTop: 20,
            lineHeight: 1.5,
            maxWidth: 750,
          }}
        >
          {article.description}
        </div>
      </div>
    ),
    { ...size }
  );
}
