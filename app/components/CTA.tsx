import WaitlistForm from "./WaitlistForm";

export default function CTA() {
  return (
    <section className="bg-forest py-20 px-6 md:px-12 text-center">
      <h2
        className="text-3xl md:text-4xl font-normal text-white tracking-tight mb-4"
        style={{ fontFamily: "'Fraunces', Georgia, serif" }}
      >
        Ready to try a different approach?
      </h2>
      <p className="text-[17px] text-white/50 max-w-[520px] mx-auto mb-8">
        Join the waitlist for early access and pricing.
        Slim SHOT ships direct. $145/mo. No prescription. No commitment.
      </p>
      <WaitlistForm variant="cta" />
    </section>
  );
}
