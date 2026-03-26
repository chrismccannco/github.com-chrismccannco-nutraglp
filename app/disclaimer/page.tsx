import type { Metadata } from "next";
import Link from "next/link";
import Footer from "../components/Footer";

export const metadata: Metadata = {
  title: "Health Disclaimer | NutraGLP",
  description: "Important health and regulatory information about NutraGLP dietary supplements.",
};

export default function DisclaimerPage() {
  return (
    <main>
      <section className="bg-charcoal px-6 md:px-12 pt-28 pb-16 text-center">
        <p className="text-xs font-semibold tracking-widest uppercase text-teal-light mb-4">Legal</p>
        <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight font-serif">
          Health Disclaimer
        </h1>
        <p className="text-sm text-white/40 mt-3">Last updated: March 2026</p>
      </section>

      <section className="py-16 px-6 md:px-12 max-w-[720px] mx-auto">
        <div className="prose-custom space-y-0">

          {/* FDA Required Statement */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 mb-10">
            <p className="text-[15px] font-semibold text-charcoal mb-2">
              FDA Required Disclosure
            </p>
            <p className="text-[15px] leading-relaxed text-gray-600">
              These statements have not been evaluated by the Food and Drug Administration. NutraGLP products
              are not intended to diagnose, treat, cure, or prevent any disease. NutraGLP is classified as a
              dietary supplement under the Dietary Supplement Health and Education Act of 1994 (DSHEA).
            </p>
          </div>

          <h2 className="text-lg font-bold text-charcoal mt-10 mb-3">Not a Drug. Not a Medical Treatment.</h2>
          <p className="text-[16px] leading-relaxed text-gray-500 mb-3">
            NutraGLP Slim SHOT and all NutraGLP products are dietary supplements. They are not pharmaceutical
            drugs, are not regulated as drugs, and have not received FDA approval or clearance for any
            therapeutic use. Dietary supplements do not undergo the same pre-market safety and efficacy review
            required for pharmaceutical drugs.
          </p>
          <p className="text-[16px] leading-relaxed text-gray-500 mb-6">
            Nothing on this website or in NutraGLP marketing materials constitutes medical advice, a medical
            recommendation, or a substitute for consultation with a licensed healthcare provider. Do not
            discontinue, reduce, or modify any prescribed medication based on information from this website
            without first consulting your physician.
          </p>

          <h2 className="text-lg font-bold text-charcoal mt-10 mb-3">Relationship to GLP-1 Pharmaceuticals</h2>
          <p className="text-[16px] leading-relaxed text-gray-500 mb-3">
            NutraGLP products are designed to support the body&rsquo;s natural incretin production and are
            positioned in relation to GLP-1 receptor agonist drugs (such as semaglutide and tirzepatide) as
            a non-prescription alternative for individuals who cannot access, afford, or tolerate pharmaceutical
            options. This positioning does not imply that NutraGLP products are clinically equivalent to, as
            effective as, or a replacement for these medications.
          </p>
          <p className="text-[16px] leading-relaxed text-gray-500 mb-3">
            GLP-1 receptor agonists are FDA-approved prescription drugs with substantial randomized controlled
            trial data supporting their efficacy. NutraGLP products are dietary supplements. The underlying
            biological mechanisms are related, but the regulatory status, evidentiary base, and expected
            magnitude of effect are different.
          </p>
          <p className="text-[16px] leading-relaxed text-gray-500 mb-6">
            If you have been prescribed a GLP-1 receptor agonist or are considering one, consult your
            prescribing physician before using NutraGLP or any other dietary supplement.
          </p>

          <h2 className="text-lg font-bold text-charcoal mt-10 mb-3">Scientific Claims and Research References</h2>
          <p className="text-[16px] leading-relaxed text-gray-500 mb-3">
            This website references published scientific research on the mechanisms of action of individual
            compounds used in NutraGLP formulations, including AMPK activation, GPR120 signaling, DPP-4
            inhibition, and nanoemulsion bioavailability. These references are provided to support
            transparency about the scientific rationale underlying our formulation approach.
          </p>
          <p className="text-[16px] leading-relaxed text-gray-500 mb-3">
            References to individual compound research do not constitute clinical proof of efficacy for
            NutraGLP finished products. Research on isolated compounds, in vitro models, or single-ingredient
            studies may not translate to the same outcomes in the context of a multi-compound formulation
            taken by humans.
          </p>
          <p className="text-[16px] leading-relaxed text-gray-500 mb-3">
            The bioavailability comparison described on this website (comparing nanoemulsion delivery to
            standard oral formats) reflects data from NutraGLP&rsquo;s delivery platform research and
            published nanoemulsion literature. These figures represent comparative delivery efficiency and
            do not constitute a claim about therapeutic outcome.
          </p>
          <p className="text-[16px] leading-relaxed text-gray-500 mb-6">
            NutraGLP is committed to conducting biomarker-based mechanistic validation studies. Until
            controlled clinical data specific to NutraGLP finished products is published and peer-reviewed,
            claims about efficacy should be understood as based on the mechanistic rationale of individual
            ingredients, not on product-level RCT evidence.
          </p>

          <h2 className="text-lg font-bold text-charcoal mt-10 mb-3">Observational Study Statement</h2>
          <p className="text-[16px] leading-relaxed text-gray-500 mb-3">
            NutraGLP references an observational study of 503 participants who used a licensed NutraGLP
            formulation over 6 months. This study was observational in design: it was not a randomized
            controlled trial, did not include a placebo control group, and was not conducted under blinded
            conditions. Observational data is subject to confounding variables and cannot establish causation.
          </p>
          <p className="text-[16px] leading-relaxed text-gray-500 mb-6">
            Results from this study are presented as directionally interesting and as support for proceeding
            to controlled studies. They should not be interpreted as clinical proof of efficacy equivalent to
            data from randomized controlled trials. Any comparison to pharmaceutical benchmark outcomes is
            descriptive and contextual, not a claim of therapeutic equivalence.
          </p>

          <h2 className="text-lg font-bold text-charcoal mt-10 mb-3">Individual Results</h2>
          <p className="text-[16px] leading-relaxed text-gray-500 mb-6">
            Individual results from using NutraGLP products will vary based on factors including but not
            limited to: baseline metabolic health, diet and caloric intake, physical activity level, baseline
            GLP-1 production, gut microbiome composition, concurrent supplement or medication use, consistency
            of use, and individual genetics. No specific outcome is guaranteed. The product is intended as
            part of a healthy lifestyle, not as a standalone intervention.
          </p>

          <h2 className="text-lg font-bold text-charcoal mt-10 mb-3">Who Should Not Use NutraGLP</h2>
          <p className="text-[16px] leading-relaxed text-gray-500 mb-3">
            NutraGLP products are intended for healthy adults aged 18 and older. Do not use NutraGLP if you:
          </p>
          <p className="text-[16px] leading-relaxed text-gray-500 mb-2 pl-4">
            — Are pregnant or nursing;
          </p>
          <p className="text-[16px] leading-relaxed text-gray-500 mb-2 pl-4">
            — Have type 1 or type 2 diabetes and are taking insulin or oral hypoglycemic medications,
            without first consulting your physician (certain active compounds may affect blood glucose);
          </p>
          <p className="text-[16px] leading-relaxed text-gray-500 mb-2 pl-4">
            — Are taking prescription medications metabolized by CYP450 liver enzymes, as certain active
            compounds may affect drug metabolism;
          </p>
          <p className="text-[16px] leading-relaxed text-gray-500 mb-2 pl-4">
            — Have a known allergy to any ingredient in the formula;
          </p>
          <p className="text-[16px] leading-relaxed text-gray-500 mb-2 pl-4">
            — Have a serious medical condition, including but not limited to liver disease, kidney disease,
            gastrointestinal disorders, or cardiovascular conditions, without physician clearance;
          </p>
          <p className="text-[16px] leading-relaxed text-gray-500 mb-6 pl-4">
            — Are under 18 years of age.
          </p>

          <h2 className="text-lg font-bold text-charcoal mt-10 mb-3">GRAS and cGMP Status</h2>
          <p className="text-[16px] leading-relaxed text-gray-500 mb-6">
            All active compounds in NutraGLP formulations hold Generally Recognized as Safe (GRAS) status
            with the FDA at the dosages used. GRAS designation reflects a determination of safety, not
            efficacy. NutraGLP products are manufactured in FDA-registered, cGMP-certified facilities with
            documented quality controls and third-party purity and potency testing for each batch.
          </p>

          <h2 className="text-lg font-bold text-charcoal mt-10 mb-3">Regulatory Compliance</h2>
          <p className="text-[16px] leading-relaxed text-gray-500 mb-6">
            NutraGLP operates within the dietary supplement regulatory framework established by DSHEA (1994).
            Our formulation, labeling, and marketing practices are designed to comply with FDA dietary
            supplement regulations, FTC guidelines on health claims in advertising, and applicable state laws.
            We do not make disease claims. Structure/function claims made about NutraGLP products, where
            applicable, have been notified to the FDA as required.
          </p>

          <h2 className="text-lg font-bold text-charcoal mt-10 mb-3">Contact</h2>
          <p className="text-[16px] leading-relaxed text-gray-500 mb-10">
            For questions about NutraGLP products, ingredients, or health information, contact us at
            science@nutraglpbio.com. For adverse event reports or product safety concerns, contact
            safety@nutraglpbio.com.
          </p>

          <div className="mt-12 pt-8 border-t border-gray-200 flex gap-8">
            <Link href="/" className="text-teal text-sm font-medium hover:underline transition no-underline">
              &larr; Back to home
            </Link>
            <Link href="/terms" className="text-teal text-sm font-medium hover:underline transition no-underline">
              Terms of Use
            </Link>
            <Link href="/privacy" className="text-teal text-sm font-medium hover:underline transition no-underline">
              Privacy Policy
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
