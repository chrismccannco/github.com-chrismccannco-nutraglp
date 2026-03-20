import type { Block } from "@/lib/types/blocks";
import HeroBlockRender from "./HeroBlockRender";
import RichTextBlockRender from "./RichTextBlockRender";
import ImageBlockRender from "./ImageBlockRender";
import ImageTextBlockRender from "./ImageTextBlockRender";
import CTAButtonBlockRender from "./CTAButtonBlockRender";
import TestimonialsBlockRender from "./TestimonialsBlockRender";
import FAQBlockRender from "./FAQBlockRender";
import SpacerBlockRender from "./SpacerBlockRender";
import VideoEmbedBlockRender from "./VideoEmbedBlockRender";
import StatsGridBlockRender from "./StatsGridBlockRender";
import CardGridBlockRender from "./CardGridBlockRender";
import DividerBlockRender from "./DividerBlockRender";
import FormBlockRender from "./FormBlockRender";

interface Props {
  blocks: Block[];
}

function RenderBlock({ block }: { block: Block }) {
  if (block.hidden) return null;

  switch (block.type) {
    case "hero":
      return <HeroBlockRender data={block.data} />;
    case "rich_text":
      return <RichTextBlockRender data={block.data} />;
    case "image":
      return <ImageBlockRender data={block.data} />;
    case "image_text":
      return <ImageTextBlockRender data={block.data} />;
    case "cta_button":
      return <CTAButtonBlockRender data={block.data} blockId={block.id} />;
    case "testimonials":
      return <TestimonialsBlockRender data={block.data} />;
    case "faq_accordion":
      return <FAQBlockRender data={block.data} />;
    case "spacer":
      return <SpacerBlockRender data={block.data} />;
    case "video_embed":
      return <VideoEmbedBlockRender data={block.data} />;
    case "stats_grid":
      return <StatsGridBlockRender data={block.data} />;
    case "card_grid":
      return <CardGridBlockRender data={block.data} />;
    case "divider":
      return <DividerBlockRender data={block.data} />;
    case "form":
      return <FormBlockRender data={block.data} />;
    default:
      return null;
  }
}

export default function BlockRenderer({ blocks }: Props) {
  const sorted = [...blocks].sort((a, b) => a.order - b.order);

  return (
    <div className="block-renderer">
      {sorted.map((block) => (
        <RenderBlock key={block.id} block={block} />
      ))}
    </div>
  );
}
