import type { ImageTextBlockData } from "@/lib/types/blocks";

const bgClasses: Record<string, string> = {
  forest: "bg-[#0e3078] text-white",
  cream: "bg-[#f5f2eb]",
  sage: "bg-[#1585b5]",
  white: "bg-white",
  "": "",
};

export default function ImageTextBlockRender({ data }: { data: ImageTextBlockData }) {
  const bg = bgClasses[data.bgColor] || "";
  const imageFirst = data.imagePosition === "left";

  return (
    <section className={`py-12 px-6 ${bg}`}>
      <div className={`max-w-6xl mx-auto grid md:grid-cols-2 gap-10 items-center ${!imageFirst ? "md:[direction:rtl] md:*:[direction:ltr]" : ""}`}>
        {data.imageUrl && (
          <div>
            <img
              src={data.imageUrl}
              alt={data.imageAlt}
              className="rounded-lg w-full object-cover"
              loading="lazy"
            />
          </div>
        )}
        <div>
          {data.heading && (
            <h2 className="font-fraunces text-3xl font-semibold mb-4">{data.heading}</h2>
          )}
          {data.html && (
            <div
              className="prose prose-neutral max-w-none"
              dangerouslySetInnerHTML={{ __html: data.html }}
            />
          )}
        </div>
      </div>
    </section>
  );
}
