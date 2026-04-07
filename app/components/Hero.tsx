import Image from "next/image";
import Link from "next/link";
import WaitlistForm from "./WaitlistForm";

export default function Hero() {
  return (
    <section id="waitlist" className="bg-forest-deep px-6 md:px-12 pt-28 pb-20">
      <div className="max-w-[1000px] mx-auto md:flex md:items-center md:gap-16">
        <div className="flex-1 text-center md:text-left">
          <p className="text-xs font-semibold uppercase tracking-[3px] text-gold/70 mb-6">
            Launching Summer 2026 &middot; Limited First Batch
          </p>
          <h1 className="text-4xl md:text-[56px] font-normal text-white leading-[1.08] tracking-tight max-w-[800px] md:max-w-none mb-6 font-heading">
            No needle. No prescription.
            <br />
            <span className="text-gold italic">No catch.</span>
          </h1>
          <p className="text-lg md:text-xl text-white/50 max-w-[580px] mx-auto md:mx-0 mb-8 leading-relaxed">
            Slim SHOT is a daily drinkable liquid that works with your
            body&apos;s own biology. Appetite control, metabolic support,
            and sustained energy. A different approach to GLP-1.
          </p>
          <p className="text-sm text-gold/80 mb-8 max-w-[480px] mx-auto md:mx-0">
            Founding members lock in $149/mo for life and ship first. Join the waitlist to reserve your spot.
          </p>
          <WaitlistForm variant="hero" />
          <div className="mt-6">
            <Link
              href="/science"
              className="text-white/40 text-sm hover:text-white/70 transition no-underline border-b border-white/20 pb-0.5"
            >
              How it works &rarr;
            </Link>
          </div>
        </div>

        {/* Product image */}
        <div className="hidden md:flex flex-1 items-center justify-center">
          <Image
            src="/images/slim-shot-bottle-alt.png"
            alt="Slim SHOT daily liquid formula bottle"
            width={380}
            height={380}
            className="drop-shadow-2xl object-contain"
            style={{ width: "380px", height: "380px" }}
            priority
          />
        </div>
      </div>
    </section>
  );
}
