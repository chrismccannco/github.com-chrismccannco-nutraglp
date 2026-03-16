import type { ImageBlockData } from "@/lib/types/blocks";

const alignMap: Record<string, string> = {
  left: "mr-auto",
  center: "mx-auto",
  right: "ml-auto",
};

export default function ImageBlockRender({ data }: { data: ImageBlockData }) {
  if (!data.url) return null;
  return (
    <figure className={`max-w-4xl px-6 py-6 ${alignMap[data.alignment] || "mx-auto"}`}>
      <img
        src={data.url}
        alt={data.alt}
        className="rounded-lg w-full"
        loading="lazy"
      />
      {data.caption && (
        <figcaption className="mt-2 text-sm text-neutral-500 text-center">
          {data.caption}
        </figcaption>
      )}
    </figure>
  );
}
