import Image from "next/image";
import Link from "next/link";
import WaitlistForm from "./WaitlistForm";

export default function Hero() {
  return (
    <section id="waitlist" className="bg-forest-deep px-6 md:px-12 pt-28 pb-24">
      <div className="max-w-[1100px] mx-auto md:flex md:items-start md:gap-16">
        <div className="flex-1 text-center md:text-left">
          <h1 className="text-4xl md:text-[56px] font-normal text-white leading-[1.08] tracking-tight max-w-[800px] md:max-w-none mb-3 font-heading">
            The supplement aisle has a delivery problem.
            <br />
            <span className="text-gold italic heading-wonk">No needle. No prescription. No side effects.</span>
          </h1>

          <p className="text-[17px] text-white/55 max-w-[580px] mx-auto md:mx-0 mb-4 leading-relaxed">
            Ozempic, Wegovy, and Zepbound work. But $800–$1,600/month, a prescription most people can&apos;t
            get, a weekly injection, and side effects that drive 70% to quit within a year — that&apos;s not
            a solution for most people.
          </p>

          <p className="text-[17px] text-white/70 max-w-[580px] mx-auto md:mx-0 mb-12 leading-relaxed font-medium">
            Your body already makes GLP-1. Slim SHOT helps it make more. Daily drinkable liquid.
            Patent-pending nanoemulsion delivery. $155/mo.
          </p>

          <WaitlistForm variant="hero" />
          <div className="mt-6">
            <Link
              href="/science"
              className="text-white/40 text-sm hover:text-white/70 transition no-underline border-b border-white/20 pb-0.5"
            >
              Read the Science &rarr;
            </Link>
          </div>
        </div>

        {/* Product image */}
        <div className="hidden md:flex flex-1 items-center justify-center max-w-[400px] pt-[56px]">
          <div className="relative">
            <div className="absolute -inset-10 bg-gold/[0.05] rounded-full blur-3xl" />
            <Image
              src="/images/slim-shot-bottle-alt.png"
              alt="Slim SHOT daily nanoemulsion supplement bottle"
              width={600}
              height={600}
              className="relative drop-shadow-2xl max-h-[400px] w-auto"
              priority
            />
          </div>
        </div>
      </div>
    </section>
  );
}
