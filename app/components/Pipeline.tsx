const products = [
  {
    name: "Slim SHOT",
    format: "60ml Nanoemulsion",
    status: "Lead Product",
    statusColor: "bg-gold text-white",
    description:
      "Daily liquid formula. Drink half in the morning, half in the evening. GRAS-certified compounds in a patent-pending nanoemulsion delivery system that naturally modulates GLP-1 and GIP signals.",
    price: "$145/mo",
  },
  {
    name: "NutraGLP Sweetener",
    format: "Non-Caloric Powder",
    status: "In Development",
    statusColor: "bg-forest-mid/20 text-forest-mid",
    description:
      "A zero-calorie sweetener formulated with incretin-supportive compounds. Designed to replace artificial sweeteners while actively supporting metabolic health with every use.",
    price: null,
  },
  {
    name: "NutraGLP Protein",
    format: "Protein & Meal Replacement",
    status: "In Development",
    statusColor: "bg-forest-mid/20 text-forest-mid",
    description:
      "Protein powder with integrated GLP-1 activation. Appetite control, muscle preservation, and metabolic support in a single serving. Built for the post-GLP-1-drug consumer.",
    price: null,
  },
  {
    name: "NutraGLP Energy",
    format: "Drink & Gel",
    status: "In Development",
    statusColor: "bg-forest-mid/20 text-forest-mid",
    description:
      "Thermogenic energy products with embedded incretin signaling. Clean energy plus metabolic activation in ready-to-drink and portable gel formats.",
    price: null,
  },
];

export default function Pipeline() {
  return (
    <section className="py-24 px-6 md:px-12 bg-cream-warm">
      <div className="max-w-[1000px] mx-auto">
        <p className="text-[11px] font-bold uppercase tracking-[2px] text-forest-mid mb-4">
          Product Pipeline
        </p>
        <h2
          className="text-3xl md:text-4xl font-normal tracking-tight leading-tight mb-4 text-ink"
          style={{ fontFamily: "'Fraunces', Georgia, serif" }}
        >
          One platform. Multiple products.
        </h2>
        <p className="text-[17px] leading-relaxed text-mist max-w-[640px] mb-14">
          Every product in the NutraGLP Sync ecosystem is built on the same
          patent-pending incretin activation and nanoemulsion delivery
          technology. Slim SHOT is first. It won&apos;t be the last.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {products.map((p) => (
            <div
              key={p.name}
              className="bg-white border border-rule rounded-xl p-8 flex flex-col"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3
                    className="text-xl font-normal tracking-tight text-ink mb-1"
                    style={{ fontFamily: "'Fraunces', Georgia, serif" }}
                  >
                    {p.name}
                  </h3>
                  <p className="text-xs uppercase tracking-wider text-mist">
                    {p.format}
                  </p>
                </div>
                <span
                  className={`text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full whitespace-nowrap ${p.statusColor}`}
                >
                  {p.status}
                </span>
              </div>
              <p className="text-sm text-mist leading-relaxed flex-1">
                {p.description}
              </p>
              {p.price && (
                <div className="mt-5 pt-4 border-t border-rule">
                  <span className="text-sm text-ink font-semibold">
                    {p.price}
                  </span>
                  <span className="text-xs text-mist ml-1">subscription</span>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-10 bg-forest-deep/[0.04] border border-rule rounded-xl p-8 flex flex-col md:flex-row items-start md:items-center gap-6">
          <div className="w-12 h-12 bg-forest rounded-xl flex items-center justify-center text-gold text-xl shrink-0">
            <svg
              width="24"
              height="24"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="1.5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 20.25V3.75a2.25 2.25 0 00-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3"
              />
            </svg>
          </div>
          <div>
            <h3
              className="text-lg font-normal tracking-tight text-ink mb-1"
              style={{ fontFamily: "'Fraunces', Georgia, serif" }}
            >
              NutraGLP Companion App
            </h3>
            <p className="text-sm text-mist leading-relaxed">
              AI-driven personalized recommendations for aligning diet and
              lifestyle to maximize metabolic effects. Hydration tracking, macro
              guidance, weight monitoring, cravings and energy logging. The
              platform&apos;s intelligence layer.
            </p>
          </div>
          <span className="text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-forest-mid/20 text-forest-mid whitespace-nowrap shrink-0">
            In Development
          </span>
        </div>
      </div>
    </section>
  );
}
