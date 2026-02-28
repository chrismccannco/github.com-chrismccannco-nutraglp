import type { Metadata } from "next";
import Link from "next/link";
import Footer from "../components/Footer";

export const metadata: Metadata = {
  title: "Frequently Asked Questions",
  description:
    "Common questions about natural GLP-1 activation, nanoemulsion delivery, DPP-4 inhibition, and how NutraGLP's Slim SHOT works.",
  alternates: {
    canonical: "https://nutraglp.com/faq",
  },
};

const faqCategories = [
  {
    category: "GLP-1 Basics",
    faqs: [
      {
        q: "What is GLP-1 and why does it matter for weight management?",
        a: "GLP-1 (glucagon-like peptide-1) is an incretin hormone produced naturally in your gut after eating. It signals your brain to reduce appetite, slows gastric emptying so you feel full longer, and stimulates insulin secretion to regulate blood sugar. GLP-1 is the same hormone targeted by prescription drugs like Ozempic and Wegovy. The difference is how you increase it: those drugs inject synthetic versions, while natural approaches aim to boost your body's own production.",
      },
      {
        q: "Can you increase GLP-1 naturally without injections?",
        a: "Yes. Your intestinal L-cells produce GLP-1 in response to specific nutrients and compounds. Research shows that AMPK pathway activation stimulates GLP-1 secretion from L-cells. GPR120 receptor signaling on the same cells triggers additional incretin release. Insulin receptor sensitization supports glucose-dependent GLP-1 output. The challenge has always been bioavailability — getting these compounds to their target pathways at effective concentrations through oral delivery.",
      },
      {
        q: "What is DPP-4 and how does it affect GLP-1 levels?",
        a: "DPP-4 (dipeptidyl peptidase-4) is an enzyme that rapidly degrades GLP-1 after it's produced. Natural GLP-1 has a half-life of about 2 minutes because DPP-4 breaks it down almost immediately. This is why pharmaceutical GLP-1 drugs use synthetic analogs that resist DPP-4 degradation. An alternative approach is to inhibit DPP-4 itself, extending the window your naturally produced GLP-1 remains active. This is one of the three mechanisms in the Slim SHOT formula.",
      },
      {
        q: "What is the difference between endogenous and exogenous GLP-1?",
        a: "Endogenous GLP-1 is what your body produces on its own, primarily from L-cells in the small intestine. Exogenous GLP-1 is introduced from outside the body, like the synthetic semaglutide in Ozempic. Endogenous activation works with your body's existing feedback loops and dose-response mechanisms. Exogenous injection overrides those loops with pharmaceutical-grade concentrations, which is why it's more powerful but also carries more side effects.",
      },
    ],
  },
  {
    category: "Nanoemulsion Technology",
    faqs: [
      {
        q: "What is a nanoemulsion and how does it improve supplement absorption?",
        a: "A nanoemulsion is a delivery system that encapsulates active compounds in lipid-based nanoparticles, typically 20-200 nanometers in diameter. This dramatically increases surface area, protects compounds from enzymatic degradation in the GI tract, and enhances cellular uptake through improved membrane permeability. Most oral supplements have bioavailability problems — the compounds degrade before reaching their target pathways. Nanoemulsion technology solves this by creating a stable, absorbable carrier for each active compound.",
      },
      {
        q: "Why do most oral supplements have low bioavailability?",
        a: "Three main reasons. First, stomach acid and digestive enzymes degrade many compounds before they can be absorbed. Second, the intestinal lining is selective about what it lets through — large or hydrophobic molecules often can't cross efficiently. Third, first-pass metabolism in the liver further reduces the amount of active compound that reaches systemic circulation. A compound can show strong effects in a lab study but deliver almost nothing when swallowed as a standard capsule or tablet.",
      },
      {
        q: "How is nanoemulsion different from liposomal delivery?",
        a: "Both use lipid-based carriers, but the structures differ. Liposomes are spherical vesicles with a water-filled core surrounded by a lipid bilayer. Nanoemulsions are thermodynamically stable droplets of oil dispersed in water (or vice versa) stabilized by surfactants. Nanoemulsions generally offer better physical stability, longer shelf life, and more consistent particle size distribution. For the specific compounds in the Slim SHOT formula, nanoemulsion was selected for superior bioavailability and manufacturing reproducibility.",
      },
    ],
  },
  {
    category: "Formulation & Science",
    faqs: [
      {
        q: "How does AMPK activation stimulate GLP-1 production?",
        a: "AMP-activated protein kinase (AMPK) is a key metabolic sensor in intestinal L-cells. When activated, it stimulates the secretion of GLP-1. Multiple randomized controlled trials have demonstrated significant increases in postprandial GLP-1 levels through AMPK-mediated pathways. AMPK activation also has independent effects on glucose metabolism, lipid profiles, and insulin sensitivity. The mechanism of action on GLP-1 has been well characterized in recent clinical research.",
      },
      {
        q: "What role does GPR120 receptor activation play in GLP-1 signaling?",
        a: "GPR120 (also called FFAR4) is a free fatty acid receptor expressed on intestinal L-cells. When GPR120 is activated, it triggers intracellular signaling cascades that result in GLP-1 secretion. This is a distinct pathway from AMPK activation, which is why the two mechanisms work synergistically. GPR120-mediated signaling also supports anti-inflammatory effects and healthy lipid metabolism.",
      },
      {
        q: "How does insulin receptor sensitization contribute to the formula?",
        a: "Insulin receptor sensitization enhances the binding of insulin to its receptor, facilitating glucose uptake into cells via GLUT4 translocation. This complements direct GLP-1 activation through AMPK and GPR120 pathways by improving the downstream metabolic response. The compounds used for this mechanism hold GRAS status and have extensive clinical literature supporting their role in glucose metabolism.",
      },
      {
        q: "How many metabolic pathways does the formula target?",
        a: "Thirteen distinct pathways across three primary mechanisms: GLP-1 and GIP activation, DPP-4 enzyme inhibition, and complementary metabolic support including insulin sensitivity enhancement, appetite regulation via the gut-brain axis, and AMPK-mediated lipid metabolism. The formula is designed as an integrated system rather than a single-mechanism product. Each compound contributes to multiple pathways, and the combinations produce synergistic effects documented in published research.",
      },
    ],
  },
  {
    category: "Safety & Quality",
    faqs: [
      {
        q: "Are natural GLP-1 supplements safe?",
        a: "All compounds in the Slim SHOT formula hold GRAS (Generally Recognized as Safe) status and have extensive safety profiles in clinical literature. The key safety consideration is drug interactions — certain active compounds can interact with medications metabolized by CYP enzymes and blood sugar-lowering drugs. Anyone on prescription medication should consult their healthcare provider before starting any GLP-1-targeting nutraceutical.",
      },
      {
        q: "What does GRAS status mean?",
        a: "GRAS stands for Generally Recognized as Safe. It's an FDA designation indicating that a substance is generally recognized, among qualified experts, as safe under its intended conditions of use. GRAS status requires substantial evidence of safety through scientific procedures or, for substances used in food before 1958, through experience based on common use. All compounds in Slim SHOT hold GRAS status at the dosages used in the formula.",
      },
      {
        q: "What is cGMP manufacturing and why does it matter?",
        a: "cGMP stands for current Good Manufacturing Practice. These are FDA-enforced regulations that ensure products are consistently produced and controlled according to quality standards. cGMP covers everything from facility design and equipment maintenance to raw material testing, production processes, and final product testing. Manufacturing in cGMP-certified facilities means every batch of Slim SHOT meets the same purity, potency, and composition specifications.",
      },
    ],
  },
  {
    category: "Comparison & Context",
    faqs: [
      {
        q: "How does Slim SHOT compare to prescription GLP-1 drugs like Ozempic?",
        a: "They target the same biological pathway through fundamentally different mechanisms. Ozempic (semaglutide) injects a synthetic peptide that mimics GLP-1 and resists DPP-4 degradation, delivering sustained supraphysiological GLP-1 receptor activation. Slim SHOT amplifies your body's own GLP-1 production and inhibits DPP-4 to extend its natural half-life. The pharmaceutical approach is more potent. The endogenous approach works within your body's existing feedback loops with a different risk-benefit profile. They are not equivalent and Slim SHOT is not a replacement for prescribed medication.",
      },
      {
        q: "Why is Slim SHOT a liquid instead of a capsule or pill?",
        a: "The nanoemulsion delivery system requires a liquid format to maintain the integrity and stability of the lipid-based nanoparticles. Compressing a nanoemulsion into a dry capsule or tablet would destroy the nanoparticle structure that makes it effective. The liquid format also allows for faster absorption since there's no dissolution step — the active compounds are already in a bioavailable form when they reach the intestinal lining.",
      },
      {
        q: "What is the difference between a supplement and a drug?",
        a: "Under U.S. law, dietary supplements are regulated under the Dietary Supplement Health and Education Act (DSHEA) and are classified as food products, not drugs. Supplements cannot claim to diagnose, treat, cure, or prevent any disease. They do not require pre-market FDA approval, though they must contain compounds that are safe and the products must be manufactured according to cGMP standards. Drugs undergo a different regulatory pathway including clinical trials and FDA pre-market approval. Slim SHOT is a dietary supplement.",
      },
    ],
  },
];

const allFaqs = faqCategories.flatMap((cat) => cat.faqs);

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: allFaqs.map((faq) => ({
    "@type": "Question",
    name: faq.q,
    acceptedAnswer: {
      "@type": "Answer",
      text: faq.a,
    },
  })),
};

export default function FAQPage() {
  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      {/* Hero */}
      <section className="bg-forest-deep px-6 md:px-12 pt-28 pb-20 text-center">
        <p className="text-[11px] font-bold uppercase tracking-[2px] text-gold mb-4">
          FAQ
        </p>
        <h1
          className="text-3xl md:text-[48px] font-normal text-white leading-[1.1] tracking-tight max-w-[720px] mx-auto mb-6"
          style={{ fontFamily: "'Fraunces', Georgia, serif" }}
        >
          Common questions about natural GLP-1 activation
        </h1>
        <p className="text-lg text-white/50 max-w-[560px] mx-auto leading-relaxed">
          The science, the technology, and how it all fits together.
        </p>
      </section>

      {/* FAQ Sections */}
      {faqCategories.map((cat, catIndex) => (
        <section
          key={cat.category}
          className={`py-16 px-6 md:px-12 ${catIndex % 2 === 1 ? "bg-white" : ""}`}
        >
          <div className="max-w-[720px] mx-auto">
            <p className="text-[11px] font-bold uppercase tracking-[2px] text-forest-mid mb-8">
              {cat.category}
            </p>
            <div className="space-y-10">
              {cat.faqs.map((faq) => (
                <div key={faq.q}>
                  <h2
                    className="text-xl md:text-2xl font-normal tracking-tight leading-tight mb-4 text-ink"
                    style={{ fontFamily: "'Fraunces', Georgia, serif" }}
                  >
                    {faq.q}
                  </h2>
                  <p className="text-[16px] leading-relaxed text-mist">
                    {faq.a}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      ))}

      {/* Cross-links */}
      <section className="py-12 px-6 md:px-12 border-t border-rule">
        <div className="max-w-[720px] mx-auto flex flex-wrap gap-6">
          <Link
            href="/slim-shot"
            className="text-sm text-forest-mid hover:text-forest transition no-underline border-b border-forest-mid/30 pb-0.5"
          >
            Product details, dosing, and pricing &rarr;
          </Link>
          <Link
            href="/science"
            className="text-sm text-forest-mid hover:text-forest transition no-underline border-b border-forest-mid/30 pb-0.5"
          >
            Read the full science &rarr;
          </Link>
        </div>
      </section>

      <Footer />
    </main>
  );
}
