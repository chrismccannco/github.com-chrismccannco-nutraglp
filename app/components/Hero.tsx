import Image from "next/image";
import Link from "next/link";
import WaitlistForm from "./WaitlistForm";

export default function Hero() {
  return (
    <section id="waitlist" className="bg-forest-deep px-6 md:px-12 pt-28 pb-20">
      <div className="max-w-[1000px] mx-auto md:flex md:items-center md:gap-16">
        <div className="flex-1 text-center md:text-left">
          <p className="text-xs font-semibold uppercase tracking-[3px] text-teal-light mb-6">
            A different approach to GLP-1
          </p>
          <h1 className="text-4xl md:text-[56px] font-normal text-white leading-[1.08] tracking-tight max-w-[800px] md:max-w-none mb-6 font-heading">
            No needle. No prescription.
            <br />
            <span className="text-gold italic">No catch.</span>
          </h1>
          <p className="text-lg md:text-xl text-whit/50 max-w-[580px] mx-auto md:mx-0 mb-12 leading-relaxed">
            Slim SHOT is a daily drinkable liquid that works with your
            body&apos;s own biology. Appetite control, metabolic support,
            and sustained energy. $149/mo. Ships to your door.
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
          <div className="relative">
            <div className="absolute -inset-8 bg-gold/[0.06] rounded-full blur-3xl" />
            <Image
              src="/images/slim-shot-bottle-alt.webp"
              alt="Slim SHOT daily liquid formula bottle"
              width={600}
              height={600}
              className="relative drop-shadow-2xl max-h-[380px] w-auto"
              priority
            />
          </div>
        </div>
      </div>
    </section>
  );
}
