import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Footer from "../../components/Footer";
import WaitlistForm from "../../components/WaitlistForm";
import BlockRenderer from "../../components/blocks/BlockRenderer";
import { getBlogPost, getBlogPosts } from "@/lib/cms";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = await getBlogPost(slug);
  if (!article) return {};
  // Strip trailing "| NutraGLP" if present — the root layout template already appends it
  const rawTitle = (article.meta_title as string) || (article.title as string);
  const seoTitle = rawTitle.replace(/\s*\|\s*NutraGLP\s*$/, "");
  const seoDescription = (article.meta_description as string) || (article.description as string);
  const ogImage = article.og_image as string | undefined;

  return {
    title: seoTitle,
    description: seoDescription,
    alternates: {
      canonical: `https://nutraglp.com/blog/${slug}`,
    },
    openGraph: {
      title: seoTitle,
      description: seoDescription,
      url: `https://nutraglp.com/blog/${slug}`,
      type: "article",
      ...(ogImage ? { images: [{ url: ogImage, width: 1200, height: 630, alt: seoTitle }] } : {}),
    },
  };
}

export default async function BlogPost({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = await getBlogPost(slug);
  if (!article) notFound();

  const rawSections = article.sections as { heading: string; body: string | string[] }[];

  // Normalize body: wrap plain-text double-newlines in <p> tags so prose spacing works
  function normalizeBody(body: string | string[]): string {
    if (Array.isArray(body)) return body.map((p) => `<p>${p}</p>`).join("");
    const trimmed = body.trim();
    // Already has block-level HTML — use as-is
    if (/^<(p|h[1-6]|ul|ol|blockquote|div|section)/i.test(trimmed)) return trimmed;
    // Plain text: split on double newlines and wrap each block in <p>
    return trimmed
      .split(/\n{2,}/)
      .filter(Boolean)
      .map((block) => `<p>${block.replace(/\n/g, "<br>")}</p>`)
      .join("");
  }

  const sections = rawSections.map((s) => ({
    heading: s.heading,
    bodyHtml: normalizeBody(s.body),
  }));
  const relatedSlugs = article.related_slugs as string[];

  // Fetch related articles
  const allPosts = await getBlogPosts();
  const relatedMap: Record<string, { title: string; description: string }> = {};
  for (const p of allPosts) {
    relatedMap[p.slug as string] = {
      title: p.title as string,
      description: p.description as string,
    };
  }

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.description,
    datePublished: article.date,
    url: `https://nutraglp.com/blog/${slug}`,
    publisher: {
      "@type": "Organization",
      name: "NutraGLP",
      url: "https://nutraglp.com",
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `https://nutraglp.com/blog/${slug}`,
    },
  };

  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />

      {/* Hero */}
      <section className="bg-forest-deep px-6 md:px-12 pt-28 pb-20">
        <div className="max-w-[720px] mx-auto">
          <Link
            href="/blog"
            className="text-[10px] font-bold uppercase tracking-[1.5px] text-teal-light no-underline hover:text-white/70 transition"
          >
            &larr; Research &amp; Insights
          </Link>
          <h1
            className="text-[30px] md:text-[44px] font-normal text-white leading-[1.1] tracking-tight mt-6 mb-6 font-heading"
          >
            {article.title as string}
          </h1>
          <div className="flex items-center gap-4">
            <time className="text-sm text-white/40">
              {new Date(article.date as string).toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            </time>
            <span className="text-white/20">&middot;</span>
            <span className="text-sm text-white/40">{article.read_time as string} read</span>
          </div>
        </div>
      </section>

      {/* Article body */}
      {article.blocks && article.blocks.length > 0 ? (
        <BlockRenderer blocks={article.blocks} />
      ) : (
        <article className="py-16 px-6 md:px-12">
          <div className="max-w-[720px] mx-auto space-y-12">
            {sections.map((section) => (
              <div key={section.heading}>
                <h2
                  className="text-xl md:text-2xl font-normal tracking-tight leading-tight mb-5 text-white font-heading"
                >
                  {section.heading}
                </h2>
                <div
                  className="prose prose-lg max-w-none text-white/60 prose-p:text-[16px] prose-p:leading-[1.75] prose-headings:text-white prose-headings:font-heading prose-a:text-teal-light"
                  dangerouslySetInnerHTML={{ __html: section.bodyHtml }}
                />
              </div>
            ))}
          </div>
        </article>
      )}

      {/* Related reading */}
      {relatedSlugs.length > 0 && (
        <section className="py-12 px-6 md:px-12">
          <div className="max-w-[720px] mx-auto">
            <p className="text-[10px] font-bold uppercase tracking-[1.5px] text-teal-light mb-6">
              Related reading
            </p>
            <div className="space-y-4">
              {relatedSlugs.map((rs) => {
                const related = relatedMap[rs];
                if (!related) return null;
                return (
                  <Link
                    key={rs}
                    href={`/blog/${rs}`}
                    className="block p-5 bg-white/[0.07] border border-white/[0.12] rounded-lg hover:border-teal-light/30 transition no-underline"
                  >
                    <p
                      className="text-[17px] font-normal tracking-tight text-white mb-1 font-heading"
                    >
                      {related.title}
                    </p>
                    <p className="text-sm text-white/60 leading-relaxed line-clamp-2">
                      {related.description}
                    </p>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      )}

      <hr className="max-w-[720px] mx-auto border-t border-white/[0.10]" />

      {/* Cross-links */}
      <section className="py-12 px-6 md:px-12">
        <div className="max-w-[720px] mx-auto flex flex-wrap gap-6">
          <Link
            href="/blog"
            className="text-sm text-teal-light hover:text-white transition no-underline border-b border-teal-light/40 pb-0.5"
          >
            All articles &rarr;
          </Link>
          <Link
            href="/science"
            className="text-sm text-teal-light hover:text-white transition no-underline border-b border-teal-light/40 pb-0.5"
          >
            Full science breakdown &rarr;
          </Link>
          <Link
            href="/slim-shot"
            className="text-sm text-teal-light hover:text-white transition no-underline border-b border-teal-light/40 pb-0.5"
          >
            Slim SHOT product details &rarr;
          </Link>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-forest py-20 px-6 md:px-12 text-center">
        <h2
          className="text-[26px] md:text-[36px] font-normal text-white tracking-tight leading-tight mb-4 font-heading"
        >
          Ready to try a different approach?
        </h2>
        <p className="text-[17px] text-white/50 max-w-[520px] mx-auto mb-8">
          $155/mo. No prescription. No commitment. Join the waitlist for
          early access and launch pricing.
        </p>
        <WaitlistForm variant="cta" />
      </section>

      <Footer />
    </main>
  );
}
