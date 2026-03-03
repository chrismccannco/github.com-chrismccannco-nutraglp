import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Footer from "../components/Footer";

export const metadata: Metadata = {
  title: "About",
  description:
    "Meet the team behind NutraGLP. Building the platform layer between pharmaceutical GLP-1 drugs and the supplement aisle with patent-pending nanoemulsion technology.",
  alternates: {
    canonical: "https://nutraglp.com/about",
  },
};

const teamSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "NutraGLP",
  url: "https://nutraglp.com",
  member: [
    {
      "@type": "Person",
      name: "Richard Kaufman, PhD",
      jobTitle: "Founder & CEO",
      description:
        "Architect of the NutraGLP platform and IP portfolio. Inventor of patented nanoparticle delivery systems across 24+ countries. Former CSO & Co-Founder of Nanosphere Health Sciences.",
    },
    {
      "@type": "Person",
      name: "Chris McCann",
      jobTitle: "Co-Founder & President",
      description:
        "15+ years leading enterprise sales organizations across SaaS, cloud infrastructure, and emerging technology. Responsible for go-to-market strategy, capital formation, and commercial operations at NutraGLP.",
    },
  ],
};

const team = [
  {
    name: "Richard Kaufman, PhD",
    role: "Founder & CEO",
    image: "/images/richard-kaufman.jpg",
    bio: [
      "Richard built the NutraGLP platform and its underlying intellectual property portfolio. He invented the patented nanoparticle delivery systems that form the basis of the company's technology, with patent protection across 24+ countries spanning nutraceutical and pharmaceutical biotechnology applications.",
      "Before NutraGLP, Richard served as Chief Science Officer and Co-Founder of Nanosphere Health Sciences, a publicly traded nanoemulsion technology company. His work in nano-encapsulation earned the Frost & Sullivan Innovation Award.",
      "His focus now is the same problem he has studied for two decades: how to get bioactive compounds past the GI tract and into the bloodstream at concentrations that matter. The nanoemulsion platform is the answer he kept arriving at.",
    ],
  },
  {
    name: "Chris McCann",
    role: "Co-Founder & President",
    image: "/images/chris-mccann.png",
    bio: [
      "Chris spent fifteen years leading enterprise sales organizations across SaaS, cloud infrastructure, and emerging technology before co-founding NutraGLP. The pattern he observed across every category was the same: the best technology means nothing without trust.",
      "At NutraGLP he is responsible for go-to-market strategy, capital formation, and commercial operations. He builds the systems that connect the science to the market, the investors to the mission, and the product to the consumer.",
      "He also studies consciousness, identity, and the structures that shape human decision-making. That work informs how he thinks about brand, positioning, and the gap between what people want and what they are willing to try.",
    ],
  },
];

export default function AboutPage() {
  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(teamSchema) }}
      />

      {/* Hero */}
      <section className="bg-forest-deep px-6 md:px-12 pt-28 pb-20 text-center">
        
        </div>
      </section>

      {/* Cross-links */}
      <section className="py-12 px-6 md:px-12 border-t border-rule">
        <div className="max-w-[720px] mx-auto flex flex-wrap gap-6">
          <Link
            href="/slim-shot"
            className="text-sm text-forest-mid hover:text-forest transition no-underline border-b border-forest-mid/30 pb-0.5"
          >
            Slim SHOT product details &rarr;
          </Link>
          <Link
            href="/science"
            className="text-sm text-forest-mid hover:text-forest transition no-underline border-b border-forest-mid/30 pb-0.5"
          >
            The science &rarr;
          </Link>
          <Link
            href="/blog"
            className="text-sm text-forest-mid hover:text-forest transition no-underline border-b border-forest-mid/30 pb-0.5"
          >
            Research &amp; insights &rarr;
          </Link>
        </div>
      </section>

      <Footer />
    </main>
  );
}
