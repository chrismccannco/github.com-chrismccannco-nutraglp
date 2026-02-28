import Link from "next/link";

const posts = [
  {
    slug: "natural-glp1-activation",
    title: "Natural GLP-1 Activation: What the Research Shows",
    excerpt:
      "AMPK activation in intestinal L-cells stimulates endogenous GLP-1 secretion. The clinical evidence behind natural incretin production.",
  },
  {
    slug: "nanoemulsion-vs-capsules",
    title: "Nanoemulsion vs. Capsules: Why Delivery Format Matters",
    excerpt:
      "Most oral supplements fail at absorption. Nanoemulsion technology solves the bioavailability problem.",
  },
  {
    slug: "endogenous-vs-exogenous-glp1",
    title: "Endogenous vs. Exogenous GLP-1: Two Approaches",
    excerpt:
      "Pharmaceutical GLP-1 drugs inject synthetic peptides. Endogenous activation amplifies what the gut already produces.",
  },
];

export default function LatestResearch() {
  return (
    <section className="py-24 px-6 md:px-12 bg-cream-warm">
      <div className="max-w-[900px] mx-auto">
        <p className="text-[11px] font-bold uppercase tracking-[2px] text-forest-mid mb-4">
          Research &amp; Insights
        </p>
        <h2
          className="text-3xl md:text-4xl font-normal tracking-tight leading-tight mb-10 text-ink"
          style={{ fontFamily: "'Fraunces', Georgia, serif" }}
        >
          The evidence behind the formula
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {posts.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="block p-6 bg-white border border-rule rounded-xl hover:border-forest-mid/40 transition no-underline group"
            >
              <h3
                className="text-[17px] font-normal tracking-tight text-ink mb-3 leading-snug group-hover:text-forest transition"
                style={{ fontFamily: "'Fraunces', Georgia, serif" }}
              >
                {post.title}
              </h3>
              <p className="text-sm text-mist leading-relaxed">
                {post.excerpt}
              </p>
            </Link>
          ))}
        </div>
        <div className="mt-8">
          <Link
            href="/blog"
            className="text-sm text-forest-mid hover:text-forest transition no-underline border-b border-forest-mid/30 pb-0.5"
          >
            All research articles &rarr;
          </Link>
        </div>
      </div>
    </section>
  );
}
