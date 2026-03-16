import type { Metadata } from "next";
import Link from "next/link";
import Footer from "../components/Footer";

export const metadata: Metadata = {
  title: "Terms of Use",
};

export default function TermsPage() {
  return (
    <main>
      <section className="bg-charcoal px-6 md:px-12 pt-28 pb-16 text-center">
        <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">
          Terms of Use
        </h1>
        <p className="text-sm text-gray-500 mt-3">Last updated: February 2026</p>
      </section>

      <section className="py-16 px-6 md:px-12 max-w-[720px] mx-auto">
        <div className="prose-custom">
          <p className="text-[17px] leading-relaxed text-gray-500 mb-6">
            By accessing nutraglp.com, you agree to be bound by these terms. If
            you do not agree, please do not use this website.
          </p>

          <h2 className="text-xl font-bold text-charcoal mt-10 mb-4">Product Information</h2>
          <p className="text-[17px] leading-relaxed text-gray-500 mb-4">
            NutraGLP is a dietary supplement. The information on this website is
            provided for general informational purposes and is not intended as
            medical advice. Always consult your healthcare provider before
            starting any new supplement.
          </p>

          <h2 className="text-xl font-bold text-charcoal mt-10 mb-4">FDA Disclaimer</h2>
          <p className="text-[17px] leading-relaxed text-gray-500 mb-4">
            These statements have not been evaluated by the Food and Drug
            Administration. This product is not intended to diagnose, treat,
            cure, or prevent any disease. NutraGLP is classified as a dietary
            supplement under the Dietary Supplement Health and Education Act
            (DSHEA) of 1994.
          </p>

          <h2 className="text-xl font-bold text-charcoal mt-10 mb-4">Intellectual Property</h2>
          <p className="text-[17px] leading-relaxed text-gray-500 mb-4">
            All content on this website, including text, graphics, logos, and
            formulation details, is the property of NutraGLP or its licensors.
            The NutraGLP nanoemulsion delivery system is patent-pending. No
            content may be reproduced, distributed, or used without written
            permission.
          </p>

          <h2 className="text-xl font-bold text-charcoal mt-10 mb-4">No Medical Claims</h2>
          <p className="text-[17px] leading-relaxed text-gray-500 mb-4">
            NutraGLP does not claim to replace pharmaceutical GLP-1 receptor
            agonists or any prescription medication. References to scientific
            research describe the properties of individual compounds and do
            not constitute claims about the finished product. Individual results
            may vary.
          </p>

          <h2 className="text-xl font-bold text-charcoal mt-10 mb-4">Limitation of Liability</h2>
          <p className="text-[17px] leading-relaxed text-gray-500 mb-4">
            NutraGLP is not liable for any damages arising from the use of this
            website or reliance on information provided herein. This website is
            provided &ldquo;as is&rdquo; without warranties of any kind.
          </p>

          <h2 className="text-xl font-bold text-charcoal mt-10 mb-4">Governing Law</h2>
          <p className="text-[17px] leading-relaxed text-gray-500 mb-4">
            These terms are governed by the laws of the State of Delaware,
            without regard to conflict of law provisions.
          </p>

          <h2 className="text-xl font-bold text-charcoal mt-10 mb-4">Contact</h2>
          <p className="text-[17px] leading-relaxed text-gray-500 mb-4">
            For questions about these terms, contact legal@nutraglp.com.
          </p>

          <div className="mt-12">
            <Link
              href="/"
              className="text-emerald text-sm font-medium hover:text-emerald-deep transition no-underline"
            >
              &larr; Back to home
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
