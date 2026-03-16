import type { Metadata } from "next";
import Link from "next/link";
import Footer from "../components/Footer";
import { getBlogPosts } from "@/lib/cms";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Research & Insights",
  description:
    "Evidence-based articles on natural GLP-1 amplification, nanoemulsion bioavailability, DPP-4 inhibition, and the science behind metabolic health supplements.",
  alternates: {
    canonical: "https://nutraglp.com/blog",
  },
};

export default async function BlogIndex() {
  const posts = await getBlogPosts();

  const blogSchema = {
    "@context": "https://schema.org",
    "@type": "Blog",
    name: "NutraGLP Research & Insights",
    description:
      "Evidence-based articles on natural GLP-1 activation, nanoemulsion bioavailability, and metabolic health science.",
    url: "https://nutraglp.com/blog",
    publisher: {
      "@type": "Organization",
      name: "NutraGLP",
      url: "https://nutraglp.com",
    },
    blogPost: posts.map((post) => ({
      "@type": "BlogPosting",
      headline: post.title as string,
      description: post.description as string,
      datePublished: post.date as string,
      url: `https://nutraglp.com/blog/${post.slug}`,
      publisher: {
        "@type": "Organization",
        name: "NutraGLP",
      },
    })),
  };

  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogSchema) }}
      />

      {/* Hero */}
      <section className="bg-forest-deep px-6 md:px-12 pt-28 pb-20 text-center">
        <p className="text-[11px] font-bold uppercase tracking-[2px] text-gold mb-4">
          Research &amp; Insights
        </p>
        <h1
          className="text-3xl md:text-[48px] font-normal text-white leading-[1.1] tracking-tight max-w-[720px] mx-auto mb-6 font-display"
        >
          The science behind natural GLP-1 amplification
        </h1>
        <p className="text-lg text-white/50 max-w-[560px] mx-auto leading-relaxed">
          Evidence-based articles on the compounds, delivery systems, and
          metabolic pathways that inform our formulation.
        </p>
      </section>

      {/* Posts */}
      <section className="py-20 px-6 md:px-12">
        <div className="max-w-[800px] mx-auto space-y-8">
          {posts.map((post) => (
            <Link
              key={post.slug as string}
              href={`/blog/${post.slug}`}
              className="block bg-white border border-rule rounded-xl hover:border-forest-mid/40 transition no-underline group overflow-hidden"
            >
              {/* Visual header */}
              <div className="h-32 relative flex items-end p-6" style={{ background: `linear-gradient(to bottom right, #0D1B2A, #1B3A5C)` }}>
                <span className="text-[10px] font-bold uppercase tracking-[2px] text-white/60">
                  {post.tag as string}
                </span>
              </div>
              <div className="p-8 pt-6">
                <div className="flex items-center gap-4 mb-4">
                  <time className="text-[11px] font-bold uppercase tracking-wider text-forest-mid">
                    {new Date(post.date as string).toLocaleDateString("en-US", {
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </time>
                  <span className="text-[11px] text-mist-light">&middot;</span>
                  <span className="text-[11px] text-mist-light">{post.read_time as string} read</span>
                </div>
                <h2
                  className="text-xl md:text-2xl font-normal tracking-tight text-ink mb-3 group-hover:text-forest transition font-display"
                >
                  {post.title as string}
                </h2>
                <p className="text-[15px] text-mist leading-relaxed">
                  {post.description as string}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Cross-links */}
      <section className="py-12 px-6 md:px-12 border-t border-rule">
        <div className="max-w-[720px] mx-auto flex flex-wrap gap-6">
          <Link
            href="/science"
            className="text-sm text-forest-mid hover:text-forest transition no-underline border-b border-forest-mid/30 pb-0.5"
          >
            Full science breakdown &rarr;
          </Link>
          <Link
            href="/faq"
            className="text-sm text-forest-mid hover:text-forest transition no-underline border-b border-forest-mid/30 pb-0.5"
          >
            Frequently asked questions &rarr;
          </Link>
          <Link
            href="/slim-shot"
            className="text-sm text-forest-mid hover:text-forest transition no-underline border-b border-forest-mid/30 pb-0.5"
          >
            Slim SHOT product details &rarr;
          </Link>
        </div>
      </section>

      <Footer />
    </main>
  );
}
