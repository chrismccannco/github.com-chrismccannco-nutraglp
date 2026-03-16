"use client";

import type { ImageTextBlockData } from "@/lib/types/blocks";
import RichTextEditor from "../../RichTextEditor";
import ImageUploadModal from "../../ImageUploadModal";
import { useState } from "react";
import { Upload } from "lucide-react";

interface Props {
  data: ImageTextBlockData;
  onChange: (data: ImageTextBlockData) => void;
}

const COLORS = [
  { value: "", label: "None" },
  { value: "forest", label: "Forest" },
  { value: "cream", label: "Cream" },
  { value: "sage", label: "Sage" },
  { value: "white", label: "White" },
];

export default function ImageTextBlockForm({ data, onChange }: Props) {
  const [showUpload, setShowUpload] = useState(false);
  const set = <K extends keyof ImageTextBlockData>(key: K, value: ImageTextBlockData[K]) =>
    onChange({ ...data, [key]: value });

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-xs font-medium text-neutral-500 mb-1">Heading</label>
        <input
          type="text"
          value={data.heading}
          onChange={(e) => set("heading", e.target.value)}
          className="w-full border border-neutral-200 rounded-md px-3 py-2 text-sm"
          placeholder="Section heading"
        />
      </div>

      <div>
        <label className="block text-xs font-medium text-neutral-500 mb-1">Body</label>
        <RichTextEditor
          content={data.html}
          onChange={(html) => set("html", html)}
          placeholder="Write content…"
        />
      </div>

      <div>
        <label className="block text-xs font-medium text-neutral-500 mb-1">Image</label>
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={data.imageUrl}
            onChange={(e) => set("imageUrl", e.target.value)}
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
        {data.imageUrl && (
          <img src={data.imageUrl} alt={data.imageAlt} className="mt-2 max-h-32 rounded border border-neutral-100 object-contain" />
        )}
        {showUpload && (
          <ImageUploadModal
            onInsert={(url) => { set("imageUrl", url); setShowUpload(false); }}
            onClose={() => setShowUpload(false)}
          />
        )}
      </div>

      <div className="grid grid-cols-3 gap-3">
        <div>
          <label className="block text-xs font-medium text-neutral-500 mb-1">Alt Text</label>
          <input
            type="text"
            value={data.imageAlt}
            onChange={(e) => set("imageAlt", e.target.value)}
            className="w-full border border-neutral-200 rounded-md px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-neutral-500 mb-1">Image Side</label>
          <select
            value={data.imagePosition}
            onChange={(e) => set("imagePosition", e.target.value as "left" | "right")}
            className="w-full border border-neutral-200 rounded-md px-3 py-2 text-sm"
          >
            <option value="left">Left</option>
            <option value="right">Right</option>
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium text-neutral-500 mb-1">Background</label>
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
      </div>
    </div>
  );
}
