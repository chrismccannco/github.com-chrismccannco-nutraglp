import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "NutraGLP Biosciences — Natural GLP-1 Amplification",
  description:
    "A patent-pending metabolic amplification platform that coordinates endogenous incretin pathways through GRAS-certified bioactives and proprietary nanoemulsion delivery.",
  alternates: {
    canonical: "https://nutraglp.com",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export { default } from "./investors/page";
