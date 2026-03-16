import type { HeroBlockData } from "@/lib/types/blocks";
import Link from "next/link";

const bgClasses: Record<string, string> = {
  forest: "bg-[#1B3A5C] text-white",
  cream: "bg-[#F5F0E8] text-[#1A1A1A]",
  white: "bg-white text-[#1A1A1A]",
  sage: "bg-[#4A90C4] text-[#1A1A1A]",
  ink: "bg-[#1A1A1A] text-white",
};

const alignClasses: Record<string, string> = {
  left: "text-left items-start",
  center: "text-center items-center",
  right: "text-right items-end",
};

export default function HeroBlockRender({ data }: { data: HeroBlockData }) {
  const bg = bgClasses[data.bgColor] || bgClasses.forest;
  const align = alignClasses[data.textAlign] || alignClasses.center;

  return (
    <section
      className={`relative py-20 px-6 ${bg}`}
      style={data.bgImage ? { backgroundImage: `url(${data.bgImage})`, backgroundSize: "cover", backgroundPosition: "center" } : undefined}
    >
      {data.bgImage && <div className="absolute inset-0 bg-black/40" />}
      <div className={`relative max-w-4xl mx-auto flex flex-col gap-4 ${align}`}>
        {data.headline && (
          <h1 className="font-fraunces text-4xl md:text-5xl lg:text-6xl font-semibold leading-tight">
            {data.headline}
          </h1>
        )}
        {data.subheadline && (
          <p className="text-lg md:text-xl opacity-90 max-w-2xl">
            {data.subheadline}
          </p>
        )}
        {data.ctaText && data.ctaUrl && (
          <Link
            href={data.ctaUrl}
            className="inline-block mt-4 px-10 py-4 bg-[#b8955a] text-white font-semibold rounded-full hover:bg-[#a07e47] transition-colors shadow-lg text-lg"
          >
            {data.ctaText}
          </Link>
        )}
      </div>
    </section>
  );
}
