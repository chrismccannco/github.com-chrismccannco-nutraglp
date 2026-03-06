import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Footer from "../../components/Footer";
import WaitlistForm from "../../components/WaitlistForm";
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
  return {
    title: article.title as string,
    description: article.description as string,
    alternates: {
      canonical: `https://nutraglp.com/blog/${slug}`,
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
  // Support both legacy string[] and new HTML string format
  const sections = rawSections.map((s) => ({
    heading: s.heading,
    bodyHtml: typeof s.body === "string"
      ? s.body
      : s.body.map((p: string) => `<p>${p}</p>`).join(""),
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
            className="text-[11px] font-bold uppercase tracking-[2px] text-gold no-underline hover:text-gold-light transition"
          >
            &larr; Research &amp; Insights
          </Link>
          <h1
            className="text-3xl md:text-[42px] font-normal text-white leading-[1.12] tracking-tight mt-6 mb-6 font-display"
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
      <article className="py-16 px-6 md:px-12">
        <div className="max-w-[720px] mx-auto space-y-12">
          {sections.map((section) => (
            <div key={section.heading}>
              <h2
                className="text-xl md:text-2xl font-normal tracking-tight leading-tight mb-5 text-ink font-display"
              >
                {section.heading}
              </h2>
              <div
                className="prose prose-lg max-w-none text-mist prose-p:text-[16px] prose-p:leading-[1.75] prose-headings:text-ink prose-headings:font-display prose-a:text-emerald-700"
                dangerouslySetInnerHTML={{ __html: section.bodyHtml }}
              />
            </div>
          ))}
        </div>
      </article>

      {/* Related reading */}
      {relatedSlugs.length > 0 && (
        <section className="py-12 px-6 md:px-12">
          <div className="max-w-[720px] mx-auto">
            <p className="text-[11px] font-bold uppercase tracking-[2px] text-forest-mid mb-6">
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
                    className="block p-5 bg-white border border-rule rounded-lg hover:border-forest-mid/40 transition no-underline"
                  >
                    <p
                      className="text-[17px] font-normal tracking-tight text-ink mb-1 font-display"
                    >
                      {related.title}
                    </p>
                    <p className="text-sm text-mist leading-relaxed line-clamp-2">
                      {related.description}
                    </p>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      )}

      <hr className="max-w-[720px] mx-auto border-t border-rule" />

      {/* Cross-links */}
      <section className="py-12 px-6 md:px-12">
        <div className="max-w-[720px] mx-auto flex flex-wrap gap-6">
          <Link
            href="/blog"
            className="text-sm text-forest-mid hover:text-forest transition no-underline border-b border-forest-mid/30 pb-0.5"
          >
            All articles &rarr;
          </Link>
          <Link
            href="/science"
            className="text-sm text-forest-mid hover:text-forest transition no-underline border-b border-forest-mid/30 pb-0.5"
          >
            Full science breakdown &rarr;
          </Link>
          <Link
            href="/slim-shot"
            className="text-sm text-forest-mid hover:text-forest transition no-underline border-b border-forest-mid/30 pb-0.5"
          >
            Slim SHOT product details &rarr;
          </Link>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-forest py-20 px-6 md:px-12 text-center">
        <h2
          className="text-3xl md:text-4xl font-normal text-white tracking-tight mb-4 font-display"
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
