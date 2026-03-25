import type { Metadata } from "next";
import Link from "next/link";
import Footer from "../../components/Footer";

export const metadata: Metadata = {
  title: "Order Confirmed | NutraGLP",
  description: "Your Slim SHOT subscription is confirmed.",
};

export default function CheckoutSuccessPage() {
  return (
    <main>
      <section className="bg-forest-deep px-6 md:px-12 pt-32 pb-24 text-center">
        <div className="max-w-[560px] mx-auto">
          <div className="w-16 h-16 rounded-full bg-gold/20 flex items-center justify-center mx-auto mb-6">
            <svg
              className="w-8 h-8 text-gold"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h1 className="text-3xl md:text-4xl font-normal text-white tracking-tight mb-4 font-heading">
            Order confirmed.
          </h1>
          <p className="text-[17px] text-white/50 leading-relaxed mb-4">
            Your Slim SHOT subscription is active. A confirmation email is on
            its way with tracking details once your first shipment goes out.
          </p>
          <p className="text-sm text-white/30 mb-10">
            Manage your subscription, update payment, or cancel anytime from
            your account.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/"
              className="inline-block px-8 py-3 bg-[#c8962e] text-white font-semibold rounded-full hover:bg-[#a87a24] transition-colors text-sm no-underline"
            >
              Back to home
            </Link>
            <Link
              href="/science"
              className="inline-block px-8 py-3 border border-white/20 text-white/70 rounded-full hover:bg-white/5 transition-colors text-sm no-underline"
            >
              Read the science
            </Link>
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}
