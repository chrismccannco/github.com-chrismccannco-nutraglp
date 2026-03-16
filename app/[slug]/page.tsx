import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPage } from "@/lib/cms";
import BlockRenderer from "../components/blocks/BlockRenderer";
import Footer from "../components/Footer";

export const dynamic = "force-dynamic";

/* Exclude slugs that have their own app directory route */
const RESERVED = new Set([
  "blog",
  "faq",
  "admin",
  "preview",
]);

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  if (RESERVED.has(slug)) return {};
  const page = await getPage(slug);
  if (!page) return {};

  const seoTitle = page.meta_title || page.title;
  const seoDescription = page.meta_description || "";

  return {
    title: seoTitle,
    description: seoDescription,
    alternates: { canonical: `https://nutraglp.com/${slug}` },
    openGraph: {
      title: seoTitle,
      description: seoDescription,
      url: `https://nutraglp.com/${slug}`,
      ...(page.og_image
        ? { images: [{ url: page.og_image, width: 1200, height: 630, alt: seoTitle }] }
        : {}),
    },
  };
}

export default async function CMSPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  if (RESERVED.has(slug)) notFound();

  const page = await getPage(slug);
  if (!page) notFound();

  const hasBlocks = page.blocks && page.blocks.length > 0;

  return (
    <main>
      {hasBlocks ? (
        <BlockRenderer blocks={page.blocks} />
      ) : (
        /* Legacy fallback: render flat content fields */
        <section className="max-w-3xl mx-auto px-6 py-16">
          <h1 className="font-fraunces text-3xl md:text-4xl text-[#1A1A1A] mb-6">
            {page.title}
          </h1>
          {page.content && typeof page.content === "object" && (
            <div className="prose prose-lg max-w-none">
              {Object.entries(page.content).map(([key, val]) => (
                <div key={key}>
                  {typeof val === "string" && (
                    <div dangerouslySetInnerHTML={{ __html: val }} />
                  )}
                </div>
              ))}
            </div>
          )}
        </section>
      )}
      <Footer />
    </main>
  );
}
