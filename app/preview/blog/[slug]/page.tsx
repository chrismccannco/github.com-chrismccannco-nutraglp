import { notFound } from "next/navigation";
import Link from "next/link";
import BlockRenderer from "../../../components/blocks/BlockRenderer";
import { getBlogPostPreview } from "@/lib/cms";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return { title: `Preview: ${slug}`, robots: "noindex, nofollow" };
}

export default async function BlogPreviewPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = await getBlogPostPreview(slug);
  if (!article) notFound();

  const rawSections = article.sections as { heading: string; body: string | string[] }[];
  const sections = rawSections.map((s) => ({
    heading: s.heading,
    bodyHtml: typeof s.body === "string"
      ? s.body
      : s.body.map((p: string) => `<p>${p}</p>`).join(""),
  }));

  const isPublished = !!article.published;

  return (
    <>
      {/* Preview banner */}
      <div className="bg-amber-500 text-white text-center text-xs py-2 font-medium sticky top-0 z-50">
        {isPublished ? "PREVIEW" : "DRAFT — not published"} &mdash;{" "}
        <a href={`/admin/blog/${slug}`} className="underline ml-1">
          Back to editor
        </a>
        {isPublished && (
          <>
            {" · "}
            <a href={`/blog/${slug}`} className="underline">
              View live
            </a>
          </>
        )}
      </div>

      <main>
        {/* Hero */}
        <section className="bg-forest-deep px-6 md:px-12 pt-28 pb-20">
          <div className="max-w-[720px] mx-auto">
            <Link
              href="/blog"
              className="text-[11px] font-bold uppercase tracking-[2px] text-gold no-underline hover:text-gold-light transition"
            >
              &larr; Research &amp; Insights
            </Link>
            <h1 className="text-3xl md:text-[42px] font-normal text-white leading-[1.12] tracking-tight mt-6 mb-6 font-display">
              {article.title as string}
            </h1>
            <div className="flex items-center gap-4">
              {article.date && (
                <time className="text-sm text-white/40">
                  {new Date(article.date as string).toLocaleDateString("en-US", {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })}
                </time>
              )}
              {article.read_time && (
                <>
                  <span className="text-white/20">&middot;</span>
                  <span className="text-sm text-white/40">{article.read_time as string} read</span>
                </>
              )}
            </div>
          </div>
        </section>

        {/* Body */}
        {article.blocks && (article.blocks as unknown[]).length > 0 ? (
          <BlockRenderer blocks={article.blocks} />
        ) : (
          <article className="py-16 px-6 md:px-12">
            <div className="max-w-[720px] mx-auto space-y-12">
              {sections.map((section) => (
                <div key={section.heading}>
                  <h2 className="text-xl md:text-2xl font-normal tracking-tight leading-tight mb-5 text-ink font-display">
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
        )}
      </main>
    </>
  );
}
