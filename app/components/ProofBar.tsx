const stats = [
  { value: "GRAS", label: "Certified" },
  { value: "0", label: "Injections" },
  { value: "$149", label: "Per Month" },
  { value: "No Rx", label: "Required" },
];

export default function ProofBar() {
  return (
    <section className="bg-forest px-6 md:px-12 py-8 flex justify-center gap-6 sm:gap-12 flex-wrap">
      {stats.map((s) => (
        <div key={s.label} className="text-center">
          <div
            className="font-semibold tracking-tight text-gold font-display"
            style={{ fontSize: "clamp(40px, 4vw, 48px)", lineHeight: 1, letterSpacing: "-0.03em" }}
          >
            {s.value}
          </div>
          <div className="text-xs text-white/50 uppercase tracking-wider mt-2.5">
            {s.label}
          </div>
        </div>
      ))}
    </section>
  );
}
