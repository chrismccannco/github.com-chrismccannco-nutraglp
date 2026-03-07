/* ── Block type definitions for the page builder ── */

export type BlockType =
  | "hero"
  | "rich_text"
  | "image"
  | "image_text"
  | "cta_button"
  | "testimonials"
  | "faq_accordion"
  | "spacer"
  | "video_embed"
  | "stats_grid"
  | "card_grid"
  | "divider";

export interface BlockBase {
  id: string;
  type: BlockType;
  order: number;
  hidden?: boolean;
}

export interface HeroBlockData {
  headline: string;
  subheadline: string;
  ctaText: string;
  ctaUrl: string;
  bgImage: string;
  bgColor: string;
  textAlign: "left" | "center" | "right";
}

export interface RichTextBlockData {
  html: string;
}

export interface ImageBlockData {
  url: string;
  alt: string;
  caption: string;
  alignment: "left" | "center" | "right";
}

export interface ImageTextBlockData {
  imageUrl: string;
  imageAlt: string;
  imagePosition: "left" | "right";
  html: string;
  heading: string;
  bgColor: string;
}

export interface CTAButtonBlockData {
  text: string;
  url: string;
  style: "primary" | "secondary" | "outline";
  centered: boolean;
}

export interface TestimonialsBlockData {
  style: "cards" | "carousel";
  columns: 1 | 2 | 3;
}

export interface FAQBlockData {
  /* pulls all published FAQs — no config needed */
}

export interface SpacerBlockData {
  height: "sm" | "md" | "lg" | "xl";
}

export interface VideoEmbedBlockData {
  url: string;
  title: string;
}

export interface StatsGridBlockData {
  stats: { id: string; label: string; value: string }[];
  columns: 2 | 3 | 4;
  bgColor: string;
}

export interface CardGridBlockData {
  cards: {
    id: string;
    title: string;
    description: string;
    imageUrl: string;
    ctaText: string;
    ctaUrl: string;
  }[];
  columns: 2 | 3 | 4;
  bgColor: string;
}

export interface DividerBlockData {
  style: "solid" | "dashed" | "dotted";
  spacing: "sm" | "md" | "lg";
}

/* ── Typed block variants ── */

export interface HeroBlock extends BlockBase {
  type: "hero";
  data: HeroBlockData;
}
export interface RichTextBlock extends BlockBase {
  type: "rich_text";
  data: RichTextBlockData;
}
export interface ImageBlock extends BlockBase {
  type: "image";
  data: ImageBlockData;
}
export interface ImageTextBlock extends BlockBase {
  type: "image_text";
  data: ImageTextBlockData;
}
export interface CTAButtonBlock extends BlockBase {
  type: "cta_button";
  data: CTAButtonBlockData;
}
export interface TestimonialsBlock extends BlockBase {
  type: "testimonials";
  data: TestimonialsBlockData;
}
export interface FAQBlock extends BlockBase {
  type: "faq_accordion";
  data: FAQBlockData;
}
export interface SpacerBlock extends BlockBase {
  type: "spacer";
  data: SpacerBlockData;
}
export interface VideoEmbedBlock extends BlockBase {
  type: "video_embed";
  data: VideoEmbedBlockData;
}
export interface StatsGridBlock extends BlockBase {
  type: "stats_grid";
  data: StatsGridBlockData;
}
export interface CardGridBlock extends BlockBase {
  type: "card_grid";
  data: CardGridBlockData;
}
export interface DividerBlock extends BlockBase {
  type: "divider";
  data: DividerBlockData;
}

export type Block =
  | HeroBlock
  | RichTextBlock
  | ImageBlock
  | ImageTextBlock
  | CTAButtonBlock
  | TestimonialsBlock
  | FAQBlock
  | SpacerBlock
  | VideoEmbedBlock
  | StatsGridBlock
  | CardGridBlock
  | DividerBlock;

/* ── Block metadata (labels, icons) ── */

export interface BlockMeta {
  type: BlockType;
  label: string;
  icon: string; // lucide-react icon name
  description: string;
}

export const BLOCK_CATALOG: BlockMeta[] = [
  { type: "hero", label: "Hero", icon: "Sparkles", description: "Full-width headline with optional CTA and background" },
  { type: "rich_text", label: "Text", icon: "Type", description: "Rich text with headings, lists, links, and images" },
  { type: "image", label: "Image", icon: "Image", description: "Single image with optional caption" },
  { type: "image_text", label: "Image + Text", icon: "Columns2", description: "Side-by-side image and text" },
  { type: "cta_button", label: "Button", icon: "MousePointerClick", description: "Call-to-action button" },
  { type: "testimonials", label: "Testimonials", icon: "Star", description: "Customer testimonials from your database" },
  { type: "faq_accordion", label: "FAQ", icon: "HelpCircle", description: "FAQ accordion from your database" },
  { type: "spacer", label: "Spacer", icon: "ArrowDownUp", description: "Vertical spacing between blocks" },
  { type: "video_embed", label: "Video", icon: "Play", description: "Embedded video (YouTube, Vimeo)" },
  { type: "stats_grid", label: "Stats", icon: "BarChart3", description: "Metrics or stats in a grid" },
  { type: "card_grid", label: "Cards", icon: "LayoutGrid", description: "Grid of content cards" },
  { type: "divider", label: "Divider", icon: "Minus", description: "Horizontal rule" },
];
