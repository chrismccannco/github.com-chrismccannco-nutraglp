import WaitlistForm from "./WaitlistForm";

export default function CTA() {
  return (
    <section className="bg-forest py-20 px-6 md:px-12 text-center">
      <p className="text-[11px] font-bold uppercase tracking-[2px] text-gold mb-4">
        Launching Fall 2026
      </p>
      <h2
        className="text-3xl md:text-4xl font-normal text-white tracking-tight mb-4 font-heading"
      >
        Reserve your spot.
      </h2>
      <p className="text-[17px] text-white/50 max-w-[520px] mx-auto mb-2">
        Founding members get first access, locked-in pricing at $149/mo,
        and ship before anyone else.
      </p>
      <p className="text-sm text-white/30 max-w-[440px] mx-auto mb-8">
        No prescription. No commitment. Cancel anytime.
      </p>
      <WaitlistForm variant="cta" />
    </section>
  );
}
