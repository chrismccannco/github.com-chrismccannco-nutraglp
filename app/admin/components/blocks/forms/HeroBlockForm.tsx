"use client";

import type { HeroBlockData } from "@/lib/types/blocks";
import ImageUploadModal from "../../ImageUploadModal";
import { useState } from "react";
import { Upload } from "lucide-react";

interface Props {
  data: HeroBlockData;
  onChange: (data: HeroBlockData) => void;
}

const COLORS = [
  { value: "forest", label: "Forest" },
  { value: "cream", label: "Cream" },
  { value: "white", label: "White" },
  { value: "sage", label: "Sage" },
  { value: "ink", label: "Ink" },
];

export default function HeroBlockForm({ data, onChange }: Props) {
  const [showUpload, setShowUpload] = useState(false);
  const set = <K extends keyof HeroBlockData>(key: K, value: HeroBlockData[K]) =>
    onChange({ ...data, [key]: value });

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-xs font-medium text-neutral-500 mb-1">Headline</label>
        <input
          type="text"
          value={data.headline}
          onChange={(e) => set("headline", e.target.value)}
          className="w-full border border-neutral-200 rounded-md px-3 py-2 text-sm"
          placeholder="Your headline here"
        />
      </div>

      <div>
        <label className="block text-xs font-medium text-neutral-500 mb-1">Subheadline</label>
        <input
          type="text"
          value={data.subheadline}
          onChange={(e) => set("subheadline", e.target.value)}
          className="w-full border border-neutral-200 rounded-md px-3 py-2 text-sm"
          placeholder="Optional subheadline"
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-medium text-neutral-500 mb-1">CTA Text</label>
          <input
            type="text"
            value={data.ctaText}
            onChange={(e) => set("ctaText", e.target.value)}
            className="w-full border border-neutral-200 rounded-md px-3 py-2 text-sm"
            placeholder="Shop Now"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-neutral-500 mb-1">CTA URL</label>
          <input
            type="text"
            value={data.ctaUrl}
            onChange={(e) => set("ctaUrl", e.target.value)}
            className="w-full border border-neutral-200 rounded-md px-3 py-2 text-sm"
            placeholder="/products"
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-medium text-neutral-500 mb-1">Background Image</label>
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={data.bgImage}
            onChange={(e) => set("bgImage", e.target.value)}
            className="flex-1 border border-neutral-200 rounded-md px-3 py-2 text-sm"
            placeholder="https://..."
          />
          <button
            type="button"
            onClick={() => setShowUpload(true)}
            className="p-2 border border-neutral-200 rounded-md hover:bg-neutral-50"
          >
            <Upload className="w-4 h-4 text-neutral-500" />
          </button>
        </div>
        {showUpload && (
          <ImageUploadModal
            onInsert={(url) => { set("bgImage", url); setShowUpload(false); }}
            onClose={() => setShowUpload(false)}
          />
        )}
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-medium text-neutral-500 mb-1">Background Color</label>
          <select
            value={data.bgColor}
            onChange={(e) => set("bgColor", e.target.value)}
            className="w-full border border-neutral-200 rounded-md px-3 py-2 text-sm"
          >
            {COLORS.map((c) => (
              <option key={c.value} value={c.value}>{c.label}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium text-neutral-500 mb-1">Text Align</label>
          <select
            value={data.textAlign}
            onChange={(e) => set("textAlign", e.target.value as HeroBlockData["textAlign"])}
            className="w-full border border-neutral-200 rounded-md px-3 py-2 text-sm"
          >
            <option value="left">Left</option>
            <option value="center">Center</option>
            <option value="right">Right</option>
          </select>
        </div>
      </div>
    </div>
  );
}
