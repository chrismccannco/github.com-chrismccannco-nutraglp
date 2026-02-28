import type { Metadata } from "next";
import Link from "next/link";
import Footer from "../components/Footer";

export const metadata: Metadata = {
  title: "Research & Insights",
  description:
    "Evidence-based articles on natural GLP-1 activation, nanoemulsion bioavailability, DPP-4 inhibition, and the science behind metabolic health supplements.",
  alternates: {
    canonical: "https://nutraglp.com/blog",
  },
};

const posts = [
  {
    slug: "natural-glp1-activation",
    title: "Natural GLP-1 Activation: What the Research Shows",
    excerpt:
      "AMPK activation in intestinal L-cells stimulates endogenous GLP-1 secretion. A look at the clinical evidence behind natural incretin production and what it means for metabolic support.",
    date: "2026-02-20",
    readTime: "8 min",
    tag: "Compound Science",
    gradient: "from-forest-deep to-forest",
  },
  {
    slug: "nanoemulsion-vs-capsules",
    title: "Nanoemulsion vs. Capsules: Why Delivery Format Matters",
    excerpt:
      "Most oral supplements fail at absorption. Nanoemulsion technology solves the bioavailability problem by encapsulating active compounds in lipid-based nanoparticles. Here is how it compares to standard capsules and liposomal delivery.",
    date: "2026-02-14",
    readTime: "7 min",
    tag: "Delivery Technology",
    gradient: "from-forest to-forest-mid",
  },
  {
    slug: "natural-dpp4-inhibition",
    title: "Natural DPP-4 Inhibition: Extending Your Body's Own GLP-1",
    excerpt:
      "DPP-4 breaks down GLP-1 within minutes of production. Natural compounds with DPP-4 inhibitory activity can extend the half-life of endogenous incretins without synthetic intervention.",
    date: "2026-02-07",
    readTime: "6 min",
    tag: "Mechanism",
    gradient: "from-forest-mid to-forest-deep",
  },
  {
    slug: "endogenous-vs-exogenous-glp1",
    title: "Endogenous vs. Exogenous GLP-1: Two Approaches to the Same Pathway",
    excerpt:
      "Pharmaceutical GLP-1 drugs inject synthetic peptides. Endogenous activation amplifies the hormones your gut already produces. Different mechanisms, different risk-benefit profiles, same biological target.",
    date: "2026-01-30",
    readTime: "9 min",
    tag: "GLP-1 Fundamentals",
    gradient: "from-forest-deep via-forest to-forest-mid",
  },
];

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
    headline: post.title,
    description: post.excerpt,
    datePublished: post.date,
    url: `https://nutraglp.com/blog/${post.slug}`,
    publisher: {
      "@type": "Organization",
      name: "NutraGLP",
    },
  })),
};

export default function BlogIndex() {
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
          className="text-3xl md:text-[48px] font-normal text-white leading-[1.1] tracking-tight max-w-[720px] mx-auto mb-6"
          style={{ fontFamily: "'Fraunces', Georgia, serif" }}
        >
          The science behind natural GLP-1 activation
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
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="block bg-white border border-rule rounded-xl hover:border-forest-mid/40 transition no-underline group overflow-hidden"
            >
              {/* Visual header */}
              <div className={`h-32 bg-gradient-to-br ${post.gradient} relative flex items-end p-6`}>
                <span className="text-[10px] font-bold uppercase tracking-[2px] text-white/60">
                  {post.tag}
                </span>
              </div>
              <div className="p-8 pt-6">
                <div className="flex items-center gap-4 mb-4">
                  <time className="text-[11px] font-bold uppercase tracking-wider text-forest-mid">
                    {new Date(post.date).toLocaleDateString("en-US", {
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </time>
                  <span className="text-[11px] text-mist-light">&middot;</span>
                  <span className="text-[11px] text-mist-light">{post.readTime} read</span>
                </div>
                <h2
                  className="text-xl md:text-2xl font-normal tracking-tight text-ink mb-3 group-hover:text-forest transition"
                  style={{ fontFamily: "'Fraunces', Georgia, serif" }}
                >
                  {post.title}
                </h2>
                <p className="text-[15px] text-mist leading-relaxed">
                  {post.excerpt}
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
