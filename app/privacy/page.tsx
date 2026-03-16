import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPage } from "@/lib/cms";
import BlockRenderer from "../components/blocks/BlockRenderer";
import Footer from "../components/Footer";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPage("privacy");
  if (!page) return { title: "Privacy Policy" };

  const seoTitle = page.meta_title || page.title;
  const seoDescription = page.meta_description || "";

  return {
    title: seoTitle,
    description: seoDescription,
    alternates: { canonical: "https://nutraglp.com/privacy" },
    openGraph: {
      title: seoTitle,
      description: seoDescription,
      url: "https://nutraglp.com/privacy",
      ...(page.og_image
        ? { images: [{ url: page.og_image, width: 1200, height: 630, alt: seoTitle }] }
        : {}),
    },
  };
}

export default async function PrivacyPage() {
  const page = await getPage("privacy");
  if (!page) notFound();

  return (
    <main>
      <BlockRenderer blocks={page.blocks} />
      <Footer />
    </main>
  );
}
