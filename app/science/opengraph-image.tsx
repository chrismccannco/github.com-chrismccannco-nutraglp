import { ImageResponse } from "next/og";

export const runtime = "nodejs";
export const alt = "The Science Behind NutraGLP";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OGImage() {
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
            fontSize: 14,
            fontWeight: 700,
            letterSpacing: "3px",
            color: "#b8955a",
            textTransform: "uppercase" as const,
            marginBottom: 24,
          }}
        >
          NUTRAGLP
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 52,
            fontWeight: 400,
            color: "#ffffff",
            lineHeight: 1.15,
            maxWidth: 900,
          }}
        >
          The Science
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 22,
            color: "rgba(255,255,255,0.5)",
            marginTop: 20,
            lineHeight: 1.5,
            maxWidth: 700,
          }}
        >
          13 metabolic pathways. Patent-pending nanoemulsion delivery.
          Peer-reviewed compounds.
        </div>
      </div>
    ),
    { ...size }
  );
}
