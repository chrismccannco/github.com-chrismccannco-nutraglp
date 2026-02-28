const stats = [
  { value: "100%", label: "GRAS Certified" },
  { value: "0", label: "Injections" },
  { value: "$145", label: "Per Month" },
  { value: "No Rx", label: "Required" },
];

export default function ProofBar() {
  return (
    <section className="bg-forest px-6 md:px-12 py-5 flex justify-center gap-6 sm:gap-12 flex-wrap">
      {stats.map((s) => (
        <div key={s.label} className="text-center">
          <div className="text-2xl font-normal tracking-tight text-gold" style={{ fontFamily: "'Fraunces', Georgia, serif" }}>
            {s.value}
          </div>
          <div className="text-xs text-white/50 uppercase tracking-wider mt-0.5">
            {s.label}
          </div>
        </div>
      ))}
    </section>
  );
}
