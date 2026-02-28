import Image from "next/image";
import Link from "next/link";

const products = [
  {
    name: "Slim SHOT",
    desc: "Daily liquid nanoemulsion. Our flagship GLP-1 activator.",
    status: "Waitlist open",
    live: true,
    image: "/images/slim-shot-bottle-alt.png",
    imgW: 600,
    imgH: 600,
    href: "/slim-shot",
  },
  {
    name: "Thermogenic",
    desc: "GLP-1 activation meets clean energy. Ready-to-drink.",
    status: "Coming 2026",
    live: false,
    image: "/images/product-thermogenic.png",
    imgW: 640,
    imgH: 1040,
    href: null,
  },
  {
    name: "GLP-1 Sweetener",
    desc: "Zero-calorie sweetener that supports incretin response.",
    status: "Coming 2026",
    live: false,
    image: "/images/product-sweetener.png",
    imgW: 760,
    imgH: 960,
    href: null,
  },
  {
    name: "GLP-1 Protein Powder",
    desc: "30g protein per serving with built-in GLP-1 support.",
    status: "Coming 2027",
    live: false,
    image: "/images/product-protein.png",
    imgW: 760,
    imgH: 960,
    href: null,
  },
];

export default function ProductLineup() {
  return (
    <section className="py-24 px-6 md:px-12 bg-cream-warm bg-dot-grid">
      <div className="max-w-[1000px] mx-auto">
        <p className="text-[11px] font-bold uppercase tracking-[2px] text-forest-mid mb-4">
          Product Pipeline
        </p>
        <h2
          className="text-3xl md:text-4xl font-normal tracking-tight leading-tight mb-4 text-ink"
          style={{ fontFamily: "'Fraunces', Georgia, serif" }}
        >
          One platform. Multiple formats.
        </h2>
        <p className="text-[17px] leading-relaxed text-mist max-w-[600px] mb-14">
          The same patent-pending nanoemulsion technology, designed into the
          products people already use every day.
        </p>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {products.map((p) => {
            const card = (
              <div
                key={p.name}
                className={`bg-white border border-rule rounded-xl p-5 flex flex-col transition ${
                  p.href ? "hover:border-forest-mid/30 hover:shadow-sm cursor-pointer" : ""
                }`}
              >
                <div className="flex items-end justify-center h-[180px] mb-5">
                  <Image
                    src={p.image}
                    alt={p.name}
                    width={p.imgW}
                    height={p.imgH}
                    className="max-h-[170px] w-auto object-contain drop-shadow-md"
                  />
                </div>
                <p
                  className="text-[17px] font-normal tracking-tight text-ink mb-1.5"
                  style={{ fontFamily: "'Fraunces', Georgia, serif" }}
                >
                  {p.name}
                </p>
                <p className="text-[13px] text-mist leading-relaxed mb-4 flex-1">
                  {p.desc}
                </p>
                <p
                  className={`text-[10px] font-bold uppercase tracking-wider ${
                    p.live ? "text-forest-mid" : "text-mist/60"
                  }`}
                >
                  {p.status}
                </p>
              </div>
            );

            if (p.href) {
              return (
                <Link key={p.name} href={p.href} className="no-underline">
                  {card}
                </Link>
              );
            }
            return card;
          })}
        </div>
      </div>
    </section>
  );
}
