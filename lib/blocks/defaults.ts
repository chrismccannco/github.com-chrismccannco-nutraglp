/* Default data for each block type — used when creating new blocks */

import type {
  BlockType,
  HeroBlockData,
  RichTextBlockData,
  ImageBlockData,
  ImageTextBlockData,
  CTAButtonBlockData,
  TestimonialsBlockData,
  FAQBlockData,
  SpacerBlockData,
  VideoEmbedBlockData,
  StatsGridBlockData,
  CardGridBlockData,
  DividerBlockData,
} from "../types/blocks";

const defaults: Record<BlockType, unknown> = {
  hero: {
    headline: "",
    subheadline: "",
    ctaText: "",
    ctaUrl: "",
    bgImage: "",
    bgColor: "forest",
    textAlign: "center",
  } satisfies HeroBlockData,

  rich_text: {
    html: "",
  } satisfies RichTextBlockData,

  image: {
    url: "",
    alt: "",
    caption: "",
    alignment: "center",
  } satisfies ImageBlockData,

  image_text: {
    imageUrl: "",
    imageAlt: "",
    imagePosition: "left",
    html: "",
    heading: "",
    bgColor: "",
  } satisfies ImageTextBlockData,

  cta_button: {
    text: "",
    url: "",
    style: "primary",
    centered: true,
  } satisfies CTAButtonBlockData,

  testimonials: {
    style: "cards",
    columns: 3,
  } satisfies TestimonialsBlockData,

  faq_accordion: {} satisfies FAQBlockData,

  spacer: {
    height: "md",
  } satisfies SpacerBlockData,

  video_embed: {
    url: "",
    title: "",
  } satisfies VideoEmbedBlockData,

  stats_grid: {
    stats: [
      { id: crypto.randomUUID(), label: "Stat", value: "0" },
    ],
    columns: 3,
    bgColor: "",
  } satisfies StatsGridBlockData,

  card_grid: {
    cards: [],
    columns: 3,
    bgColor: "",
  } satisfies CardGridBlockData,

  divider: {
    style: "solid",
    spacing: "md",
  } satisfies DividerBlockData,
};

export function getBlockDefault<T>(type: BlockType): T {
  return JSON.parse(JSON.stringify(defaults[type])) as T;
}

export function createBlock(type: BlockType, order: number) {
  return {
    id: crypto.randomUUID(),
    type,
    order,
    data: getBlockDefault(type),
  };
}
