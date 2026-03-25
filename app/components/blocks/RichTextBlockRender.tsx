import type { RichTextBlockData } from "@/lib/types/blocks";

export default function RichTextBlockRender({ data }: { data: RichTextBlockData }) {
  if (!data.html) return null;
  return (
    <section className="max-w-3xl mx-auto px-6 py-8">
      <div
        className="prose prose-neutral prose-headings:font-heading prose-a:text-[#0e3078] max-w-none"
        dangerouslySetInnerHTML={{ __html: data.html }}
      />
    </section>
  );
}
