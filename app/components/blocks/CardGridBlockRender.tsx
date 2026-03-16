import type { CardGridBlockData } from "@/lib/types/blocks";
import Link from "next/link";

const BG: Record<string, string> = {
  forest: "bg-[#1B3A5C] text-white",
  cream: "bg-[#F5F0E8] text-[#1A1A1A]",
  sage: "bg-[#4A90C4] text-[#1A1A1A]",
  ink: "bg-[#1A1A1A] text-white",
  white: "bg-white text-[#1A1A1A]",
};

const COLS: Record<number, string> = {
  2: "grid-cols-1 sm:grid-cols-2",
  3: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
  4: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4",
};

export default function CardGridBlockRender({ data }: { data: CardGridBlockData }) {
  if (!data.cards?.length) return null;

  return (
    <section className={`px-6 py-14 ${BG[data.bgColor] || BG.white}`}>
      <div className={`max-w-6xl mx-auto grid gap-6 ${COLS[data.columns] || COLS[3]}`}>
        {data.cards.map((card, i) => (
          <div
            key={i}
            className="rounded-lg border border-neutral-200 overflow-hidden bg-white text-[#1A1A1A]"
          >
            {card.imageUrl && (
              <img
                src={card.imageUrl}
                alt={card.title}
                className="w-full h-48 object-cover"
              />
            )}
            <div className="p-5">
              <h3 className="font-fraunces text-lg font-semibold">{card.title}</h3>
              {card.description && (
                <p className="mt-2 text-sm text-neutral-600 leading-relaxed">
                  {card.description}
                </p>
              )}
              {card.ctaText && card.ctaUrl && (
                <Link
                  href={card.ctaUrl}
                  className="inline-block mt-4 text-sm font-medium text-[#1B3A5C] hover:underline"
                >
                  {card.ctaText} &rarr;
                </Link>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
