import type { ImageTextBlockData } from "@/lib/types/blocks";

const bgClasses: Record<string, string> = {
  forest: "bg-[#1B3A5C] text-white",
  cream: "bg-[#F5F0E8]",
  sage: "bg-[#4A90C4]",
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
