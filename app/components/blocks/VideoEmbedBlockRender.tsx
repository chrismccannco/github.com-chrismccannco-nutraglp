import type { VideoEmbedBlockData } from "@/lib/types/blocks";

function toEmbedUrl(url: string): string | null {
  try {
    const u = new URL(url);
    if (u.hostname.includes("youtube.com") && u.searchParams.get("v")) {
      return `https://www.youtube.com/embed/${u.searchParams.get("v")}`;
    }
    if (u.hostname === "youtu.be") {
      return `https://www.youtube.com/embed${u.pathname}`;
    }
    if (u.hostname.includes("vimeo.com")) {
      const id = u.pathname.split("/").filter(Boolean).pop();
      return id ? `https://player.vimeo.com/video/${id}` : null;
    }
    return url;
  } catch {
    return null;
  }
}

export default function VideoEmbedBlockRender({ data }: { data: VideoEmbedBlockData }) {
  const src = toEmbedUrl(data.url);
  if (!src) return null;

  return (
    <section className="max-w-4xl mx-auto px-6 py-10">
      {data.title && (
        <h2 className="font-fraunces text-xl text-[#1A1A1A] mb-4">{data.title}</h2>
      )}
      <div className="relative w-full" style={{ paddingBottom: "56.25%" }}>
        <iframe
          src={src}
          title={data.title || "Video"}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="absolute inset-0 w-full h-full rounded-lg"
        />
      </div>
    </section>
  );
}
