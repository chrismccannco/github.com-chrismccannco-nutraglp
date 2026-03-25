import type { Metadata } from "next";
import Link from "next/link";
import Footer from "../components/Footer";

export const metadata: Metadata = {
  title: "Privacy Policy | NutraGLP",
  description: "NutraGLP Biosciences privacy policy — how we collect, use, and protect your information.",
};

export default function PrivacyPage() {
  return (
    <main>
      <section className="bg-charcoal px-6 md:px-12 pt-28 pb-16 text-center">
        <p className="text-xs font-semibold tracking-widest uppercase text-teal mb-4">Legal</p>
        <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight font-serif">
          Privacy Policy
        </h1>
        <p className="text-sm text-white/40 mt-3">Last updated: March 2026</p>
      </section>

      <section className="py-16 px-6 md:px-12 max-w-[720px] mx-auto">
        <div className="prose-custom space-y-0">

          <p className="text-[16px] leading-relaxed text-gray-500 mb-8">
            NutraGLP Biosciences (&ldquo;NutraGLP,&rdquo; &ldquo;we,&rdquo; &ldquo;our,&rdquo; or &ldquo;us&rdquo;)
            operates nutraglp.com and associated subdomains. This Privacy Policy explains what personal information we
            collect, how we use it, and the rights available to you. By using our website or submitting your contact
            information, you agree to the practices described in this policy. If you do not agree, please do not use
            our website or submit your information.
          </p>
          <p className="text-[16px] leading-relaxed text-gray-500 mb-10">
            This policy does not cover information collected offline, through third-party websites, or through channels
            not expressly linked to nutraglp.com.
          </p>

          <h2 className="text-lg font-bold text-charcoal mt-10 mb-3">1. Information We Collect</h2>
          <p className="text-[16px] leading-relaxed text-gray-500 mb-4">
            We collect information in the following categories:
          </p>
          <p className="text-[16px] leading-relaxed text-gray-500 mb-3">
            <strong className="text-charcoal font-semibold">Contact information.</strong> When you join our waitlist,
            request our investor deck, or submit a science brief request, we collect your email address. If you
            optionally provide a phone number and consent to SMS communications, we also collect that phone number.
          </p>
          <p className="text-[16px] leading-relaxed text-gray-500 mb-3">
            <strong className="text-charcoal font-semibold">Usage and analytics data.</strong> We may collect
            information about how you interact with our website, including pages visited, time on page, scroll depth,
            referring URL, browser type, device type, operating system, and approximate geographic location derived
            from IP address. This data is collected through cookies, web beacons, and third-party analytics services.
          </p>
          <p className="text-[16px] leading-relaxed text-gray-500 mb-3">
            <strong className="text-charcoal font-semibold">Communications data.</strong> If you contact us by email
            or through a contact form, we retain records of that correspondence.
          </p>
          <p className="text-[16px] leading-relaxed text-gray-500 mb-6">
            <strong className="text-charcoal font-semibold">What we do not collect.</strong> We do not collect
            payment card data, bank account information, Social Security numbers, health records, or biometric data
            through this website. We do not knowingly collect information from children under the age of 18.
          </p>

          <h2 className="text-lg font-bold text-charcoal mt-10 mb-3">2. How We Use Your Information</h2>
          <p className="text-[16px] leading-relaxed text-gray-500 mb-3">
            We use the information we collect for the following purposes:
          </p>
          <p className="text-[16px] leading-relaxed text-gray-500 mb-3">
            <strong className="text-charcoal font-semibold">Waitlist and pre-launch communications.</strong> Email
            addresses collected through the waitlist form are used to notify you of product availability, launch
            pricing, and related NutraGLP product updates. You may unsubscribe at any time by clicking the
            unsubscribe link in any email we send or by contacting us at privacy@nutraglpbio.com.
          </p>
          <p className="text-[16px] leading-relaxed text-gray-500 mb-3">
            <strong className="text-charcoal font-semibold">SMS communications.</strong> If you provide a phone
            number and check the SMS consent box, we may send you text messages related to product launch timing and
            availability. Message frequency will vary. Standard message and data rates may apply. You may opt out at
            any time by replying STOP to any message or contacting us at privacy@nutraglpbio.com. After opting out
            you will receive a single confirmation message. We do not use your phone number for any purpose other
            than the communications you consented to.
          </p>
          <p className="text-[16px] leading-relaxed text-gray-500 mb-3">
            <strong className="text-charcoal font-semibold">Investor and science brief requests.</strong> Contact
            information submitted through the investor deck request form or the science brief form is used to
            respond to your specific request and to follow up regarding NutraGLP&rsquo;s fundraising or research
            activities.
          </p>
          <p className="text-[16px] leading-relaxed text-gray-500 mb-3">
            <strong className="text-charcoal font-semibold">Analytics and site improvement.</strong> Usage data
            is used to understand how visitors interact with our site, improve content and navigation, and measure
            the effectiveness of our communications.
          </p>
          <p className="text-[16px] leading-relaxed text-gray-500 mb-6">
            <strong className="text-charcoal font-semibold">Legal and compliance.</strong> We may use your
            information to comply with applicable laws, respond to legal processes, enforce our terms, or protect
            the rights and safety of NutraGLP or others.
          </p>

          <h2 className="text-lg font-bold text-charcoal mt-10 mb-3">3. Legal Basis for Processing (EEA/UK Visitors)</h2>
          <p className="text-[16px] leading-relaxed text-gray-500 mb-3">
            If you are located in the European Economic Area or the United Kingdom, we process your personal data
            on the following legal bases:
          </p>
          <p className="text-[16px] leading-relaxed text-gray-500 mb-3">
            <strong className="text-charcoal font-semibold">Consent.</strong> For marketing emails and SMS
            communications, we rely on your affirmative consent, which you may withdraw at any time.
          </p>
          <p className="text-[16px] leading-relaxed text-gray-500 mb-3">
            <strong className="text-charcoal font-semibold">Legitimate interests.</strong> For analytics, site
            security, fraud prevention, and improving our website, we process data on the basis of our legitimate
            business interests, provided those interests are not overridden by your rights and interests.
          </p>
          <p className="text-[16px] leading-relaxed text-gray-500 mb-6">
            <strong className="text-charcoal font-semibold">Legal obligation.</strong> Where required by law.
          </p>

          <h2 className="text-lg font-bold text-charcoal mt-10 mb-3">4. How We Share Your Information</h2>
          <p className="text-[16px] leading-relaxed text-gray-500 mb-3">
            We do not sell, rent, or trade your personal information to third parties for their own marketing
            purposes.
          </p>
          <p className="text-[16px] leading-relaxed text-gray-500 mb-3">
            We may share your information with the following categories of service providers who assist us in
            operating our website and conducting our business, under appropriate data protection agreements:
          </p>
          <p className="text-[16px] leading-relaxed text-gray-500 mb-3">
            <strong className="text-charcoal font-semibold">Hosting and form processing.</strong> Our website is
            hosted on Netlify, Inc. Form submissions are processed through Netlify Forms and may be relayed to
            internal systems for follow-up.
          </p>
          <p className="text-[16px] leading-relaxed text-gray-500 mb-3">
            <strong className="text-charcoal font-semibold">Analytics.</strong> We may use third-party analytics
            services that collect usage data through cookies and similar technologies. These services operate under
            their own privacy policies.
          </p>
          <p className="text-[16px] leading-relaxed text-gray-500 mb-3">
            <strong className="text-charcoal font-semibold">Email delivery.</strong> We may use a third-party
            email service provider to send waitlist notifications and product updates.
          </p>
          <p className="text-[16px] leading-relaxed text-gray-500 mb-3">
            <strong className="text-charcoal font-semibold">SMS delivery.</strong> If you have consented to SMS,
            we may use a third-party messaging platform to deliver those messages. That provider may receive your
            phone number solely for message delivery purposes.
          </p>
          <p className="text-[16px] leading-relaxed text-gray-500 mb-6">
            We may also disclose information when required by law, court order, or governmental authority, or when
            we believe disclosure is necessary to protect the safety of any person, to address fraud or security
            concerns, or to protect the rights or property of NutraGLP.
          </p>

          <h2 className="text-lg font-bold text-charcoal mt-10 mb-3">5. Cookies and Tracking Technologies</h2>
          <p className="text-[16px] leading-relaxed text-gray-500 mb-3">
            Our website may use cookies, web beacons, pixel tags, and similar tracking technologies to collect
            usage data and improve your experience.
          </p>
          <p className="text-[16px] leading-relaxed text-gray-500 mb-3">
            <strong className="text-charcoal font-semibold">Essential cookies</strong> are required for core
            website functionality and cannot be disabled.
          </p>
          <p className="text-[16px] leading-relaxed text-gray-500 mb-3">
            <strong className="text-charcoal font-semibold">Analytics cookies</strong> help us understand how
            visitors use our site. These may be set by third-party providers.
          </p>
          <p className="text-[16px] leading-relaxed text-gray-500 mb-6">
            You can control non-essential cookies through your browser settings. Disabling cookies may affect
            certain features of the website. Most browsers also allow you to opt out of interest-based advertising
            through industry opt-out pages.
          </p>

          <h2 className="text-lg font-bold text-charcoal mt-10 mb-3">6. Data Retention</h2>
          <p className="text-[16px] leading-relaxed text-gray-500 mb-6">
            We retain your email address and any other contact information for as long as your waitlist
            subscription is active, plus a reasonable period thereafter to comply with legal obligations and
            resolve disputes. Phone numbers are retained only while SMS consent is active and deleted within
            90 days of opt-out. Analytics data is retained in aggregated or anonymized form for up to 26 months.
          </p>

          <h2 className="text-lg font-bold text-charcoal mt-10 mb-3">7. Your Rights and Choices</h2>
          <p className="text-[16px] leading-relaxed text-gray-500 mb-3">
            Depending on your location, you may have the following rights regarding your personal information:
          </p>
          <p className="text-[16px] leading-relaxed text-gray-500 mb-3">
            <strong className="text-charcoal font-semibold">Access and portability.</strong> You may request a
            copy of the personal information we hold about you.
          </p>
          <p className="text-[16px] leading-relaxed text-gray-500 mb-3">
            <strong className="text-charcoal font-semibold">Correction.</strong> You may request that we correct
            inaccurate personal information.
          </p>
          <p className="text-[16px] leading-relaxed text-gray-500 mb-3">
            <strong className="text-charcoal font-semibold">Deletion.</strong> You may request that we delete
            your personal information, subject to applicable legal obligations.
          </p>
          <p className="text-[16px] leading-relaxed text-gray-500 mb-3">
            <strong className="text-charcoal font-semibold">Opt out of marketing.</strong> You may unsubscribe
            from marketing emails at any time via the unsubscribe link in any message or by emailing
            privacy@nutraglpbio.com. You may opt out of SMS by replying STOP.
          </p>
          <p className="text-[16px] leading-relaxed text-gray-500 mb-3">
            <strong className="text-charcoal font-semibold">California residents (CCPA).</strong> California
            residents have the right to know what personal information is collected, used, or disclosed; the right
            to request deletion; the right to opt out of the sale of personal information (we do not sell personal
            information); and the right not to be discriminated against for exercising these rights. To submit a
            CCPA request, contact us at privacy@nutraglpbio.com.
          </p>
          <p className="text-[16px] leading-relaxed text-gray-500 mb-6">
            <strong className="text-charcoal font-semibold">EEA/UK residents (GDPR).</strong> In addition to the
            rights above, you have the right to object to processing, the right to restrict processing, and where
            processing is based on consent, the right to withdraw consent at any time without affecting the
            lawfulness of prior processing. You also have the right to lodge a complaint with a supervisory
            authority in your jurisdiction.
          </p>

          <h2 className="text-lg font-bold text-charcoal mt-10 mb-3">8. Children&rsquo;s Privacy</h2>
          <p className="text-[16px] leading-relaxed text-gray-500 mb-6">
            Our website and products are intended for adults aged 18 and older. We do not knowingly collect
            personal information from anyone under the age of 18. If you believe we have inadvertently collected
            information from a minor, please contact us immediately at privacy@nutraglpbio.com and we will take
            steps to delete it promptly.
          </p>

          <h2 className="text-lg font-bold text-charcoal mt-10 mb-3">9. Security</h2>
          <p className="text-[16px] leading-relaxed text-gray-500 mb-6">
            We implement reasonable technical and organizational measures designed to protect your personal
            information against unauthorized access, disclosure, alteration, and destruction. These measures
            include encrypted data transmission (TLS/SSL), access controls, and vendor data processing agreements.
            However, no method of transmission over the internet or electronic storage is 100% secure. We cannot
            guarantee absolute security, and we encourage you to use caution when sharing information online.
          </p>

          <h2 className="text-lg font-bold text-charcoal mt-10 mb-3">10. International Data Transfers</h2>
          <p className="text-[16px] leading-relaxed text-gray-500 mb-6">
            NutraGLP is based in the United States. If you are visiting from outside the United States, please be
            aware that information we collect is transferred to, processed in, and stored in the United States.
            Data protection laws in the United States may differ from those in your country. By using our website
            and submitting your information, you consent to this transfer. Where required by applicable law, we
            implement appropriate safeguards for cross-border data transfers, such as Standard Contractual Clauses
            approved by the European Commission.
          </p>

          <h2 className="text-lg font-bold text-charcoal mt-10 mb-3">11. Third-Party Links</h2>
          <p className="text-[16px] leading-relaxed text-gray-500 mb-6">
            Our website may contain links to third-party websites. We are not responsible for the privacy
            practices of those sites. We encourage you to review the privacy policies of any third-party sites
            you visit.
          </p>

          <h2 className="text-lg font-bold text-charcoal mt-10 mb-3">12. Changes to This Policy</h2>
          <p className="text-[16px] leading-relaxed text-gray-500 mb-6">
            We may update this Privacy Policy periodically to reflect changes in our practices or applicable law.
            We will post the updated policy on this page with a revised &ldquo;Last updated&rdquo; date. For material
            changes, we will provide additional notice where required by law. Continued use of our website
            following the posting of changes constitutes your acceptance of the revised policy.
          </p>

          <h2 className="text-lg font-bold text-charcoal mt-10 mb-3">13. Contact</h2>
          <p className="text-[16px] leading-relaxed text-gray-500 mb-6">
            For questions, requests, or complaints regarding this Privacy Policy or our data practices, contact us:
          </p>
          <p className="text-[16px] leading-relaxed text-gray-500 mb-2">
            <strong className="text-charcoal font-semibold">NutraGLP Biosciences</strong>
          </p>
          <p className="text-[16px] leading-relaxed text-gray-500 mb-2">privacy@nutraglpbio.com</p>
          <p className="text-[16px] leading-relaxed text-gray-500 mb-10">
            We will respond to verifiable requests within 30 days, or as required by applicable law.
          </p>

          <div className="mt-12 pt-8 border-t border-gray-200">
            <Link
              href="/"
              className="text-teal text-sm font-medium hover:underline transition no-underline"
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
