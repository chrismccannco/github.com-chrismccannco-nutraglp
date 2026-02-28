import type { Metadata } from "next";
import Link from "next/link";
import Footer from "../components/Footer";

export const metadata: Metadata = {
  title: "Privacy Policy",
};

export default function PrivacyPage() {
  return (
    <main>
      <section className="bg-charcoal px-6 md:px-12 pt-28 pb-16 text-center">
        <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">
          Privacy Policy
        </h1>
        <p className="text-sm text-gray-500 mt-3">Last updated: February 2026</p>
      </section>

      <section className="py-16 px-6 md:px-12 max-w-[720px] mx-auto">
        <div className="prose-custom">
          <p className="text-[17px] leading-relaxed text-gray-500 mb-6">
            NutraGLP (&ldquo;we,&rdquo; &ldquo;our,&rdquo; or &ldquo;us&rdquo;) operates nutraglp.com. This
            page explains how we collect, use, and protect information when you
            visit our website.
          </p>

          <h2 className="text-xl font-bold text-charcoal mt-10 mb-4">Information We Collect</h2>
          <p className="text-[17px] leading-relaxed text-gray-500 mb-4">
            When you join our waitlist, we collect the email address you provide.
            We may also collect standard web analytics data including pages
            visited, time on site, browser type, and referring URL. We do not
            collect financial information, health data, or any sensitive personal
            information through this website.
          </p>

          <h2 className="text-xl font-bold text-charcoal mt-10 mb-4">How We Use Your Information</h2>
          <p className="text-[17px] leading-relaxed text-gray-500 mb-4">
            Email addresses collected through the waitlist are used to send
            product updates, launch notifications, and clinical information
            related to NutraGLP. Analytics data is used to understand how
            visitors interact with our site and to improve the experience. We do
            not sell, rent, or share your personal information with third parties
            for their marketing purposes.
          </p>

          <h2 className="text-xl font-bold text-charcoal mt-10 mb-4">Cookies &amp; Analytics</h2>
          <p className="text-[17px] leading-relaxed text-gray-500 mb-4">
            This site may use cookies and similar tracking technologies to
            analyze traffic and improve functionality. You can control cookie
            settings through your browser preferences. Essential cookies
            required for site operation may not be disabled.
          </p>

          <h2 className="text-xl font-bold text-charcoal mt-10 mb-4">Data Security</h2>
          <p className="text-[17px] leading-relaxed text-gray-500 mb-4">
            We implement reasonable technical and organizational measures to
            protect information submitted through our website. However, no
            method of transmission over the Internet is completely secure.
          </p>

          <h2 className="text-xl font-bold text-charcoal mt-10 mb-4">Your Rights</h2>
          <p className="text-[17px] leading-relaxed text-gray-500 mb-4">
            You may request deletion of your email from our waitlist at any time
            by contacting us at privacy@nutraglp.com. If you are a California
            resident, you have additional rights under the CCPA including the
            right to know what personal information is collected and the right
            to request deletion.
          </p>

          <h2 className="text-xl font-bold text-charcoal mt-10 mb-4">Changes to This Policy</h2>
          <p className="text-[17px] leading-relaxed text-gray-500 mb-4">
            We may update this privacy policy from time to time. Changes will
            be posted on this page with an updated effective date.
          </p>

          <h2 className="text-xl font-bold text-charcoal mt-10 mb-4">Contact</h2>
          <p className="text-[17px] leading-relaxed text-gray-500 mb-4">
            For questions about this privacy policy, contact us at
            privacy@nutraglp.com.
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
