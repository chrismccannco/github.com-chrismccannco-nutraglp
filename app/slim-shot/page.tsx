import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPage } from "@/lib/cms";
import BlockRenderer from "../components/blocks/BlockRenderer";
import Footer from "../components/Footer";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPage("slim-shot");
  if (!page) return { title: "Slim SHOT" };

  const seoTitle = page.meta_title || page.title;
  const seoDescription = page.meta_description || "";

<<<<<<< HEAD
  return {
    title: seoTitle,
    description: seoDescription,
    alternates: { canonical: "https://nutraglp.com/slim-shot" },
    openGraph: {
      title: seoTitle,
      description: seoDescription,
      url: "https://nutraglp.com/slim-shot",
      ...(page.og_image
        ? { images: [{ url: page.og_image, width: 1200, height: 630, alt: seoTitle }] }
        : {}),
    },
  };
}

export default async function SlimShotPage() {
  const page = await getPage("slim-shot");
  if (!page) notFound();

  return (
    <main>
      <BlockRenderer blocks={page.blocks} />
      <Footer />
    </main>
  );
}
