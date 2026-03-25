import type { StatsGridBlockData } from "@/lib/types/blocks";

const BG: Record<string, string> = {
  forest: "bg-[#0e3078] text-white",
  cream: "bg-[#f5f2eb] text-[#1A1A1A]",
  sage: "bg-[#1585b5] text-[#1A1A1A]",
  ink: "bg-[#1A1A1A] text-white",
  white: "bg-white text-[#1A1A1A]",
};

const COLS: Record<number, string> = {
  2: "grid-cols-2",
  3: "grid-cols-3",
  4: "grid-cols-2 sm:grid-cols-4",
};

export default function StatsGridBlockRender({ data }: { data: StatsGridBlockData }) {
  if (!data.stats?.length) return null;

  return (
    <section className={`px-6 py-14 ${BG[data.bgColor] || BG.white}`}>
      <div className={`max-w-5xl mx-auto grid gap-8 text-center ${COLS[data.columns] || COLS[3]}`}>
        {data.stats.map((s, i) => (
          <div key={i}>
            <p className="font-fraunces text-3xl sm:text-4xl font-semibold">{s.value}</p>
            <p className="mt-1 text-sm opacity-70">{s.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
