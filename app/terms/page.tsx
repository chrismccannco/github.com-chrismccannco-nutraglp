import type { Metadata } from "next";
import Link from "next/link";
import Footer from "../components/Footer";

export const metadata: Metadata = {
  title: "Terms of Use | NutraGLP",
  description: "NutraGLP Biosciences terms of use — governing your access to our website and products.",
};

export default function TermsPage() {
  return (
    <main>
      <section className="bg-charcoal px-6 md:px-12 pt-28 pb-16 text-center">
        <p className="text-xs font-semibold tracking-widest uppercase text-teal mb-4">Legal</p>
        <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight font-serif">
          Terms of Use
        </h1>
        <p className="text-sm text-white/40 mt-3">Last updated: March 2026</p>
      </section>

      <section className="py-16 px-6 md:px-12 max-w-[720px] mx-auto">
        <div className="prose-custom space-y-0">

          <p className="text-[16px] leading-relaxed text-gray-500 mb-8">
            These Terms of Use (&ldquo;Terms&rdquo;) govern your access to and use of the website located at
            nutraglp.com (the &ldquo;Site&rdquo;) and any related services operated by NutraGLP Biosciences
            (&ldquo;NutraGLP,&rdquo; &ldquo;we,&rdquo; &ldquo;our,&rdquo; or &ldquo;us&rdquo;). By accessing or
            using the Site, you agree to be bound by these Terms. If you do not agree, please do not access or
            use the Site.
          </p>
          <p className="text-[16px] leading-relaxed text-gray-500 mb-10">
            You must be at least 18 years of age to use this Site or purchase NutraGLP products. By using the
            Site, you represent and warrant that you are 18 or older.
          </p>

          <h2 className="text-lg font-bold text-charcoal mt-10 mb-3">1. Dietary Supplement Disclosure</h2>
          <p className="text-[16px] leading-relaxed text-gray-500 mb-3">
            NutraGLP products are dietary supplements regulated under the Dietary Supplement Health and Education
            Act of 1994 (DSHEA). They are not drugs, are not intended to treat, cure, or prevent any disease or
            medical condition, and have not been evaluated or approved by the U.S. Food and Drug Administration
            for safety or efficacy.
          </p>
          <p className="text-[16px] leading-relaxed text-gray-500 mb-3">
            <strong className="text-charcoal font-semibold">These statements have not been evaluated by the Food
            and Drug Administration. This product is not intended to diagnose, treat, cure, or prevent any
            disease.</strong>
          </p>
          <p className="text-[16px] leading-relaxed text-gray-500 mb-3">
            References to clinical research, published studies, and scientific literature on this Site describe
            the properties of individual compounds or delivery systems and do not constitute claims about the
            efficacy of NutraGLP finished products. Individual results will vary based on metabolism, diet,
            activity level, and other factors.
          </p>
          <p className="text-[16px] leading-relaxed text-gray-500 mb-3">
            NutraGLP products are not intended as a substitute for pharmaceutical GLP-1 receptor agonists,
            prescription medications, or professional medical treatment. NutraGLP does not claim to replicate
            the efficacy of any pharmaceutical drug.
          </p>
          <p className="text-[16px] leading-relaxed text-gray-500 mb-6">
            You should consult a qualified healthcare provider before starting NutraGLP or any new dietary
            supplement regimen, particularly if you are pregnant, nursing, under a physician&rsquo;s care, or
            taking prescription medications. Certain active compounds in NutraGLP formulations may interact
            with medications metabolized by CYP enzymes or medications that affect blood sugar. This is not
            optional advice.
          </p>

          <h2 className="text-lg font-bold text-charcoal mt-10 mb-3">2. No Medical Advice</h2>
          <p className="text-[16px] leading-relaxed text-gray-500 mb-6">
            All content on this Site — including text, graphics, scientific summaries, mechanism explanations,
            FAQs, and blog articles — is provided for general informational purposes only and does not
            constitute medical advice, diagnosis, or treatment recommendations. Nothing on this Site should be
            construed as a recommendation to discontinue or modify any prescription medication or treatment
            program. Always seek the advice of a qualified healthcare professional regarding any questions
            about your health or medical condition.
          </p>

          <h2 className="text-lg font-bold text-charcoal mt-10 mb-3">3. Accuracy of Information</h2>
          <p className="text-[16px] leading-relaxed text-gray-500 mb-6">
            We make reasonable efforts to ensure that information on this Site is accurate and current.
            However, we make no representation or warranty regarding the completeness, accuracy, reliability,
            or availability of any information. Scientific understanding evolves; information that is accurate
            at the time of publication may become outdated. We reserve the right to modify or remove content
            at any time without notice.
          </p>

          <h2 className="text-lg font-bold text-charcoal mt-10 mb-3">4. Waitlist and Pre-Order</h2>
          <p className="text-[16px] leading-relaxed text-gray-500 mb-3">
            By joining the NutraGLP waitlist, you are expressing interest in purchasing our product when it
            becomes available. Joining the waitlist does not constitute a purchase, contract of sale, or
            guarantee of product availability. We reserve the right to limit quantities, modify pricing,
            or decline to sell to any individual.
          </p>
          <p className="text-[16px] leading-relaxed text-gray-500 mb-6">
            Waitlist pricing communicated at time of signup (&ldquo;launch pricing&rdquo;) is intended to represent
            our planned pricing at launch and is subject to change. We will communicate any material pricing
            changes prior to billing.
          </p>

          <h2 className="text-lg font-bold text-charcoal mt-10 mb-3">5. Subscription Terms</h2>
          <p className="text-[16px] leading-relaxed text-gray-500 mb-3">
            NutraGLP products are sold on a recurring subscription basis. By enrolling in a subscription, you
            authorize us to charge your payment method on a recurring cycle (monthly or as otherwise specified
            at checkout) until you cancel.
          </p>
          <p className="text-[16px] leading-relaxed text-gray-500 mb-3">
            <strong className="text-charcoal font-semibold">Cancellation.</strong> You may cancel your
            subscription at any time through your account dashboard or by contacting us at
            support@nutraglpbio.com. Cancellation takes effect at the end of the current billing period.
            No cancellation fees apply. We do not offer prorated refunds for partial months.
          </p>
          <p className="text-[16px] leading-relaxed text-gray-500 mb-3">
            <strong className="text-charcoal font-semibold">Returns and refunds.</strong> If you are
            dissatisfied with your purchase, please contact us within 30 days of delivery at
            support@nutraglpbio.com. Refund eligibility is evaluated on a case-by-case basis. We reserve
            the right to request return of unused product before issuing a refund.
          </p>
          <p className="text-[16px] leading-relaxed text-gray-500 mb-6">
            <strong className="text-charcoal font-semibold">Price changes.</strong> We reserve the right to
            change subscription pricing with 30 days&rsquo; advance notice. Continued subscription after a
            price change takes effect constitutes acceptance of the new pricing.
          </p>

          <h2 className="text-lg font-bold text-charcoal mt-10 mb-3">6. SMS Communications</h2>
          <p className="text-[16px] leading-relaxed text-gray-500 mb-3">
            By providing your phone number and checking the SMS consent box, you expressly consent to receive
            recurring automated text messages from NutraGLP at the number provided, regarding product launch
            timing, availability, and updates. Consent is not a condition of purchase. Message frequency varies.
            Message and data rates may apply.
          </p>
          <p className="text-[16px] leading-relaxed text-gray-500 mb-6">
            To opt out, reply STOP to any message. For help, reply HELP. You may also contact us at
            privacy@nutraglpbio.com to opt out. These SMS terms are subject to our Privacy Policy and
            applicable provisions of the Telephone Consumer Protection Act (TCPA).
          </p>

          <h2 className="text-lg font-bold text-charcoal mt-10 mb-3">7. Intellectual Property</h2>
          <p className="text-[16px] leading-relaxed text-gray-500 mb-3">
            All content on this Site — including text, graphics, logos, product imagery, scientific
            diagrams, illustrations, and formulation information — is owned by NutraGLP Biosciences or its
            licensors and is protected by copyright, trademark, trade secret, patent, and other intellectual
            property laws.
          </p>
          <p className="text-[16px] leading-relaxed text-gray-500 mb-3">
            The NutraGLP nanoemulsion delivery platform, multi-pathway activation architecture, and related
            formulations are covered by patent-pending applications. Unauthorized copying, reverse engineering,
            or commercial use of any NutraGLP formulation concept, delivery system, or related technology is
            strictly prohibited.
          </p>
          <p className="text-[16px] leading-relaxed text-gray-500 mb-6">
            You may view and print material from this Site for your personal, non-commercial use only.
            No content may be reproduced, distributed, published, modified, uploaded, or used for any
            commercial purpose without our prior written permission.
          </p>

          <h2 className="text-lg font-bold text-charcoal mt-10 mb-3">8. Investor Information Disclaimer</h2>
          <p className="text-[16px] leading-relaxed text-gray-500 mb-3">
            Certain pages of this Site contain information directed to prospective investors in NutraGLP
            Biosciences. This information includes forward-looking statements, projections, market estimates,
            and descriptions of planned activities. Such statements involve known and unknown risks,
            uncertainties, and other factors that may cause actual results to differ materially from those
            expressed or implied.
          </p>
          <p className="text-[16px] leading-relaxed text-gray-500 mb-3">
            Nothing on this Site constitutes an offer to sell or solicitation of an offer to buy any security.
            Any offering of securities by NutraGLP Biosciences will be made only through formal offering
            documents to qualified investors, and only in jurisdictions where such offers are permitted by
            applicable law.
          </p>
          <p className="text-[16px] leading-relaxed text-gray-500 mb-6">
            The observational study referenced on the Investors page was not a randomized controlled trial.
            Results from observational data require appropriate scientific qualification and cannot be
            generalized without controlled study confirmation. Past or projected performance does not
            guarantee future results.
          </p>

          <h2 className="text-lg font-bold text-charcoal mt-10 mb-3">9. Prohibited Uses</h2>
          <p className="text-[16px] leading-relaxed text-gray-500 mb-3">You agree not to:</p>
          <p className="text-[16px] leading-relaxed text-gray-500 mb-2 pl-4">
            — Use this Site for any unlawful purpose or in violation of these Terms;
          </p>
          <p className="text-[16px] leading-relaxed text-gray-500 mb-2 pl-4">
            — Attempt to gain unauthorized access to any portion of this Site or its infrastructure;
          </p>
          <p className="text-[16px] leading-relaxed text-gray-500 mb-2 pl-4">
            — Use any robot, spider, scraper, or automated tool to access or extract content from this Site;
          </p>
          <p className="text-[16px] leading-relaxed text-gray-500 mb-2 pl-4">
            — Reproduce, distribute, or create derivative works from NutraGLP content without written permission;
          </p>
          <p className="text-[16px] leading-relaxed text-gray-500 mb-2 pl-4">
            — Impersonate NutraGLP or any of its personnel;
          </p>
          <p className="text-[16px] leading-relaxed text-gray-500 mb-6 pl-4">
            — Transmit malicious code or interfere with the operation of the Site.
          </p>

          <h2 className="text-lg font-bold text-charcoal mt-10 mb-3">10. Disclaimer of Warranties</h2>
          <p className="text-[16px] leading-relaxed text-gray-500 mb-6">
            THIS SITE AND ALL CONTENT, PRODUCTS, AND SERVICES MADE AVAILABLE THROUGH IT ARE PROVIDED
            &ldquo;AS IS&rdquo; AND &ldquo;AS AVAILABLE&rdquo; WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
            IMPLIED, INCLUDING BUT NOT LIMITED TO WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR
            PURPOSE, NON-INFRINGEMENT, AND ANY WARRANTIES ARISING FROM COURSE OF DEALING OR USAGE OF TRADE.
            WE DO NOT WARRANT THAT THE SITE WILL BE UNINTERRUPTED, ERROR-FREE, OR FREE OF VIRUSES OR OTHER
            HARMFUL COMPONENTS.
          </p>

          <h2 className="text-lg font-bold text-charcoal mt-10 mb-3">11. Limitation of Liability</h2>
          <p className="text-[16px] leading-relaxed text-gray-500 mb-6">
            TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, NUTRAGLP BIOSCIENCES, ITS OFFICERS,
            DIRECTORS, EMPLOYEES, AGENTS, LICENSORS, AND SUPPLIERS SHALL NOT BE LIABLE FOR ANY INDIRECT,
            INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES ARISING OUT OF OR RELATED TO YOUR USE
            OF THIS SITE OR OUR PRODUCTS, INCLUDING BUT NOT LIMITED TO LOSS OF REVENUE, LOSS OF DATA,
            PERSONAL INJURY, OR PROPERTY DAMAGE, WHETHER BASED ON WARRANTY, CONTRACT, TORT, OR ANY OTHER
            LEGAL THEORY, EVEN IF WE HAVE BEEN ADVISED OF THE POSSIBILITY OF SUCH DAMAGES. OUR TOTAL
            CUMULATIVE LIABILITY ARISING OUT OF OR RELATED TO THESE TERMS OR YOUR USE OF THE SITE AND
            PRODUCTS SHALL NOT EXCEED THE GREATER OF (A) THE AMOUNTS YOU PAID TO NUTRAGLP IN THE THREE
            MONTHS PRECEDING THE CLAIM OR (B) ONE HUNDRED DOLLARS ($100).
          </p>

          <h2 className="text-lg font-bold text-charcoal mt-10 mb-3">12. Indemnification</h2>
          <p className="text-[16px] leading-relaxed text-gray-500 mb-6">
            You agree to defend, indemnify, and hold harmless NutraGLP Biosciences and its officers,
            directors, employees, agents, and successors from and against any and all claims, liabilities,
            damages, losses, and expenses (including reasonable attorneys&rsquo; fees) arising out of or
            relating to your use of the Site, your violation of these Terms, or your violation of any
            applicable law or the rights of any third party.
          </p>

          <h2 className="text-lg font-bold text-charcoal mt-10 mb-3">13. Dispute Resolution and Arbitration</h2>
          <p className="text-[16px] leading-relaxed text-gray-500 mb-3">
            <strong className="text-charcoal font-semibold">Informal resolution.</strong> Before initiating
            formal proceedings, you agree to attempt to resolve any dispute informally by contacting us at
            legal@nutraglpbio.com. We will attempt in good faith to resolve the dispute within 30 days.
          </p>
          <p className="text-[16px] leading-relaxed text-gray-500 mb-3">
            <strong className="text-charcoal font-semibold">Binding arbitration.</strong> If informal
            resolution fails, any dispute arising out of or relating to these Terms or the Site shall be
            resolved by binding arbitration administered by the American Arbitration Association (AAA) under
            its Consumer Arbitration Rules, rather than in court. The arbitration shall be conducted in
            Delaware, or remotely if agreed. The arbitrator&rsquo;s decision shall be final and binding and
            may be entered as a judgment in any court of competent jurisdiction.
          </p>
          <p className="text-[16px] leading-relaxed text-gray-500 mb-3">
            <strong className="text-charcoal font-semibold">Class action waiver.</strong> YOU AGREE THAT ANY
            DISPUTE RESOLUTION PROCEEDINGS, WHETHER IN ARBITRATION OR IN COURT, WILL BE CONDUCTED ONLY ON
            AN INDIVIDUAL BASIS AND NOT IN A CLASS, CONSOLIDATED, OR REPRESENTATIVE ACTION. If this class
            action waiver is found unenforceable, then the arbitration agreement above shall be null and void
            with respect to that dispute.
          </p>
          <p className="text-[16px] leading-relaxed text-gray-500 mb-3">
            <strong className="text-charcoal font-semibold">Exceptions.</strong> Nothing in this section
            prevents either party from seeking injunctive or other equitable relief in a court of competent
            jurisdiction to protect intellectual property rights or prevent irreparable harm, nor does it
            prevent you from filing a complaint with a consumer protection agency.
          </p>
          <p className="text-[16px] leading-relaxed text-gray-500 mb-6">
            <strong className="text-charcoal font-semibold">EU/UK residents.</strong> If you are located in
            the European Union or United Kingdom, the arbitration clause and class action waiver above may
            not apply to you to the extent prohibited by applicable law.
          </p>

          <h2 className="text-lg font-bold text-charcoal mt-10 mb-3">14. Governing Law</h2>
          <p className="text-[16px] leading-relaxed text-gray-500 mb-6">
            These Terms are governed by the laws of the State of Delaware, United States, without regard to
            its conflict of law provisions. Subject to the arbitration clause above, you consent to the
            exclusive jurisdiction of the state and federal courts located in Delaware for any dispute not
            subject to arbitration.
          </p>

          <h2 className="text-lg font-bold text-charcoal mt-10 mb-3">15. Modifications</h2>
          <p className="text-[16px] leading-relaxed text-gray-500 mb-6">
            We reserve the right to modify these Terms at any time. We will post the revised Terms on this
            page with an updated &ldquo;Last updated&rdquo; date. For material changes, we will provide advance
            notice where required by law. Your continued use of the Site following the posting of changes
            constitutes your acceptance of the revised Terms.
          </p>

          <h2 className="text-lg font-bold text-charcoal mt-10 mb-3">16. Severability</h2>
          <p className="text-[16px] leading-relaxed text-gray-500 mb-6">
            If any provision of these Terms is found to be invalid or unenforceable, that provision shall
            be modified to the minimum extent necessary to make it enforceable, and the remaining provisions
            shall continue in full force and effect.
          </p>

          <h2 className="text-lg font-bold text-charcoal mt-10 mb-3">17. Contact</h2>
          <p className="text-[16px] leading-relaxed text-gray-500 mb-2">
            <strong className="text-charcoal font-semibold">NutraGLP Biosciences</strong>
          </p>
          <p className="text-[16px] leading-relaxed text-gray-500 mb-2">legal@nutraglpbio.com</p>
          <p className="text-[16px] leading-relaxed text-gray-500 mb-10">
            For product support: support@nutraglpbio.com
          </p>

          <div className="mt-12 pt-8 border-t border-gray-200 flex gap-8">
            <Link href="/" className="text-teal text-sm font-medium hover:underline transition no-underline">
              &larr; Back to home
            </Link>
            <Link href="/privacy" className="text-teal text-sm font-medium hover:underline transition no-underline">
              Privacy Policy
            </Link>
            <Link href="/disclaimer" className="text-teal text-sm font-medium hover:underline transition no-underline">
              Health Disclaimer
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
