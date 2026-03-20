import type { RichTextBlockData } from "@/lib/types/blocks";

export default function RichTextBlockRender({ data }: { data: RichTextBlockData }) {
  if (!data.html) return null;
  return (
    <section className="max-w-3xl mx-auto px-6 py-8">
      <div
        className="prose prose-neutral prose-headings:font-fraunces prose-a:text-[#1B3A5C] max-w-none"
        dangerouslySetInnerHTML={{ __html: data.html }}
      />
    </section>
  );
}
