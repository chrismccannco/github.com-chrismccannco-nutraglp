"use client";

/**
 * Simpler block forms grouped in one file:
 * Testimonials, FAQ, Spacer, Video, Divider
 */

import type {
  TestimonialsBlockData,
  FAQBlockData,
  SpacerBlockData,
  VideoEmbedBlockData,
  DividerBlockData,
} from "@/lib/types/blocks";

/* ── Testimonials ── */
interface TestimonialsProps {
  data: TestimonialsBlockData;
  onChange: (data: TestimonialsBlockData) => void;
}
export function TestimonialsBlockForm({ data, onChange }: TestimonialsProps) {
  return (
    <div className="grid grid-cols-2 gap-3">
      <div>
        <label className="block text-xs font-medium text-neutral-500 mb-1">Layout</label>
        <select
          value={data.style}
          onChange={(e) => onChange({ ...data, style: e.target.value as "cards" | "carousel" })}
          className="w-full border border-neutral-200 rounded-md px-3 py-2 text-sm"
        >
          <option value="cards">Cards Grid</option>
          <option value="carousel">Carousel</option>
        </select>
      </div>
      <div>
        <label className="block text-xs font-medium text-neutral-500 mb-1">Columns</label>
        <select
          value={data.columns}
          onChange={(e) => onChange({ ...data, columns: Number(e.target.value) as 1 | 2 | 3 })}
          className="w-full border border-neutral-200 rounded-md px-3 py-2 text-sm"
        >
          <option value={1}>1</option>
          <option value={2}>2</option>
          <option value={3}>3</option>
        </select>
      </div>
      <p className="col-span-2 text-xs text-neutral-400">
        Pulls published testimonials from your database automatically.
      </p>
    </div>
  );
}

/* ── FAQ ── */
interface FAQProps {
  data: FAQBlockData;
  onChange: (data: FAQBlockData) => void;
}
export function FAQBlockForm({ data, onChange }: FAQProps) {
  const d = { display: data?.display || "open", heading: data?.heading || "Frequently Asked Questions" };
  return (
    <div className="space-y-3">
      <div>
        <label className="block text-xs font-medium text-neutral-500 mb-1">Section Heading</label>
        <input
          type="text"
          value={d.heading}
          onChange={(e) => onChange({ ...d, heading: e.target.value })}
          className="w-full border border-neutral-200 rounded-md px-3 py-2 text-sm"
          placeholder="Frequently Asked Questions"
        />
      </div>
      <div>
        <label className="block text-xs font-medium text-neutral-500 mb-1">Display Mode</label>
        <select
          value={d.display}
          onChange={(e) => onChange({ ...d, display: e.target.value as "accordion" | "open" })}
          className="w-full border border-neutral-200 rounded-md px-3 py-2 text-sm"
        >
          <option value="open">Open (AEO optimized)</option>
          <option value="accordion">Accordion (click to expand)</option>
        </select>
        <p className="text-xs text-neutral-400 mt-1">
          {d.display === "open"
            ? "All answers visible. Best for AI/search engine indexing."
            : "Answers hidden behind click. Saves vertical space."}
        </p>
      </div>
      <p className="text-xs text-neutral-400">
        Pulls published FAQs from your database. Includes FAQPage schema.org markup.
      </p>
    </div>
  );
}

/* ── Spacer ── */
interface SpacerProps {
  data: SpacerBlockData;
  onChange: (data: SpacerBlockData) => void;
}
export function SpacerBlockForm({ data, onChange }: SpacerProps) {
  return (
    <div>
      <label className="block text-xs font-medium text-neutral-500 mb-1">Height</label>
      <select
        value={data.height}
        onChange={(e) => onChange({ height: e.target.value as SpacerBlockData["height"] })}
        className="w-full border border-neutral-200 rounded-md px-3 py-2 text-sm"
      >
        <option value="sm">Small (1rem)</option>
        <option value="md">Medium (2rem)</option>
        <option value="lg">Large (4rem)</option>
        <option value="xl">Extra Large (6rem)</option>
      </select>
    </div>
  );
}

/* ── Video Embed ── */
interface VideoProps {
  data: VideoEmbedBlockData;
  onChange: (data: VideoEmbedBlockData) => void;
}
export function VideoEmbedBlockForm({ data, onChange }: VideoProps) {
  return (
    <div className="space-y-3">
      <div>
        <label className="block text-xs font-medium text-neutral-500 mb-1">Video URL</label>
        <input
          type="text"
          value={data.url}
          onChange={(e) => onChange({ ...data, url: e.target.value })}
          className="w-full border border-neutral-200 rounded-md px-3 py-2 text-sm"
          placeholder="https://youtube.com/watch?v=..."
        />
      </div>
      <div>
        <label className="block text-xs font-medium text-neutral-500 mb-1">Title / Accessible Label</label>
        <input
          type="text"
          value={data.title}
          onChange={(e) => onChange({ ...data, title: e.target.value })}
          className="w-full border border-neutral-200 rounded-md px-3 py-2 text-sm"
          placeholder="Video title for accessibility"
        />
      </div>
    </div>
  );
}

/* ── Divider ── */
interface DividerProps {
  data: DividerBlockData;
  onChange: (data: DividerBlockData) => void;
}
export function DividerBlockForm({ data, onChange }: DividerProps) {
  return (
    <div className="grid grid-cols-2 gap-3">
      <div>
        <label className="block text-xs font-medium text-neutral-500 mb-1">Style</label>
        <select
          value={data.style}
          onChange={(e) => onChange({ ...data, style: e.target.value as DividerBlockData["style"] })}
          className="w-full border border-neutral-200 rounded-md px-3 py-2 text-sm"
        >
          <option value="solid">Solid</option>
          <option value="dashed">Dashed</option>
          <option value="dotted">Dotted</option>
        </select>
      </div>
      <div>
        <label className="block text-xs font-medium text-neutral-500 mb-1">Spacing</label>
        <select
          value={data.spacing}
          onChange={(e) => onChange({ ...data, spacing: e.target.value as DividerBlockData["spacing"] })}
          className="w-full border border-neutral-200 rounded-md px-3 py-2 text-sm"
        >
          <option value="sm">Small</option>
          <option value="md">Medium</option>
          <option value="lg">Large</option>
        </select>
      </div>
    </div>
  );
}
