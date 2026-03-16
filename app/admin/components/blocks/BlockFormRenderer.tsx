"use client";

import type { Block } from "@/lib/types/blocks";
import HeroBlockForm from "./forms/HeroBlockForm";
import RichTextBlockForm from "./forms/RichTextBlockForm";
import ImageBlockForm from "./forms/ImageBlockForm";
import ImageTextBlockForm from "./forms/ImageTextBlockForm";
import CTAButtonBlockForm from "./forms/CTAButtonBlockForm";
import StatsGridBlockForm from "./forms/StatsGridBlockForm";
import CardGridBlockForm from "./forms/CardGridBlockForm";
import {
  TestimonialsBlockForm,
  FAQBlockForm,
  SpacerBlockForm,
  VideoEmbedBlockForm,
  DividerBlockForm,
} from "./forms/SimpleBlockForms";
import FormBlockForm from "./forms/FormBlockForm";

interface Props {
  block: Block;
  onChange: (block: Block) => void;
}

export default function BlockFormRenderer({ block, onChange }: Props) {
  const updateData = (data: unknown) => onChange({ ...block, data } as Block);

  switch (block.type) {
    case "hero":
      return <HeroBlockForm data={block.data} onChange={updateData} />;
    case "rich_text":
      return <RichTextBlockForm data={block.data} onChange={updateData} />;
    case "image":
      return <ImageBlockForm data={block.data} onChange={updateData} />;
    case "image_text":
      return <ImageTextBlockForm data={block.data} onChange={updateData} />;
    case "cta_button":
      return <CTAButtonBlockForm data={block.data} onChange={updateData} blockId={block.id} />;
    case "testimonials":
      return <TestimonialsBlockForm data={block.data} onChange={updateData} />;
    case "faq_accordion":
      return <FAQBlockForm data={block.data} onChange={updateData} />;
    case "spacer":
      return <SpacerBlockForm data={block.data} onChange={updateData} />;
    case "video_embed":
      return <VideoEmbedBlockForm data={block.data} onChange={updateData} />;
    case "stats_grid":
      return <StatsGridBlockForm data={block.data} onChange={updateData} />;
    case "card_grid":
      return <CardGridBlockForm data={block.data} onChange={updateData} />;
    case "divider":
      return <DividerBlockForm data={block.data} onChange={updateData} />;
    case "form":
      return <FormBlockForm data={block.data} onChange={updateData} />;
    default:
      return <p className="text-xs text-neutral-400">Unknown block type</p>;
  }
}
