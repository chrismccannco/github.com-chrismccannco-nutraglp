import type { Metadata } from "next";
import Link from "next/link";
import Footer from "../../components/Footer";

export const metadata: Metadata = {
  title: "Checkout Cancelled | NutraGLP",
  description: "Your checkout was cancelled. No charge was made.",
};

export default function CheckoutCancelPage() {
  return (
    <main>
      <section className="bg-forest-deep px-6 md:px-12 pt-32 pb-24 text-center">
        <div className="max-w-[560px] mx-auto">
          <h1 className="text-3xl md:text-4xl font-normal text-white tracking-tight mb-4 font-heading">
            No worries.
          </h1>
          <p className="text-[17px] text-white/50 leading-relaxed mb-4">
            Checkout was cancelled. No charge was made. Your cart isn&apos;t
            going anywhere.
          </p>
          <p className="text-sm text-white/30 mb-10">
            Questions before you subscribe? Check the FAQ or reach out.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/slim-shot"
              className="inline-block px-8 py-3 bg-[#c8962e] text-white font-semibold rounded-full hover:bg-[#a87a24] transition-colors text-sm no-underline"
            >
              Back to Slim SHOT
            </Link>
            <Link
              href="/faq"
              className="inline-block px-8 py-3 border border-white/20 text-white/70 rounded-full hover:bg-white/5 transition-colors text-sm no-underline"
            >
              Read the FAQ
            </Link>
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}
