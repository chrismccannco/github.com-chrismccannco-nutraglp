import type { Metadata } from "next";
import { getPage } from "@/lib/cms";
import BlockRenderer from "./components/blocks/BlockRenderer";
import Hero from "./components/Hero";
import ProofBar from "./components/ProofBar";
import Problem from "./components/Problem";
import Mechanism from "./components/Mechanism";
import Personas from "./components/Personas";
import Contrast from "./components/Contrast";
import Science from "./components/Science";
import ProductLineup from "./components/ProductLineup";
import LatestResearch from "./components/LatestResearch";
import CTA from "./components/CTA";
import Footer from "./components/Footer";
import SubscribePopup from "./components/SubscribePopup";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPage("home");
  if (!page) {
    return {
      title: "NutraGLP | GLP-1 Friendly Nutrition",
      description: "Science-backed nutritional supplements designed to support GLP-1 pathways.",
    };
  }
  const seoTitle = page.meta_title || page.title;
  const seoDescription = page.meta_description || "";
  return {
    title: seoTitle,
    description: seoDescription,
    alternates: { canonical: "https://nutraglp.com" },
    openGraph: {
      title: seoTitle,
      description: seoDescription,
      url: "https://nutraglp.com",
      ...(page.og_image
        ? { images: [{ url: page.og_image, width: 1200, height: 630, alt: seoTitle }] }
        : {}),
    },
  };
}

export default async function Home() {
  const page = await getPage("home");
  const hasBlocks = page && page.blocks && page.blocks.length > 0;

  if (hasBlocks) {
    return (
      <main>
        <BlockRenderer blocks={page.blocks} />
        <Footer />
      </main>
    );
  }

  // Fallback: hardcoded homepage layout
  return (
    <main>
      <Hero />
      <ProofBar />
      <Problem />
      <hr className="max-w-[720px] mx-auto border-t border-rule" />
      <Mechanism />
      <Personas />
      <Contrast />
      <Science />
      <ProductLineup />
      <LatestResearch />
      <CTA />
      <Footer />
      <SubscribePopup />

      {/* Hidden form for Netlify Forms detection */}
      <form name="subscribe" data-netlify="true" netlify-honeypot="bot-field" hidden>
        <input name="form-name" value="subscribe" type="hidden" />
        <input name="bot-field" />
        <input name="email" type="email" />
        <input name="phone" type="tel" />
        <input name="sms_opt_in" type="checkbox" />
      </form>
    </main>
  );
}
