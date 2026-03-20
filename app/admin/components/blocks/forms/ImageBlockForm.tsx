"use client";

import type { ImageBlockData } from "@/lib/types/blocks";
import ImageUploadModal from "../../ImageUploadModal";
import { useState } from "react";
import { Upload } from "lucide-react";

interface Props {
  data: ImageBlockData;
  onChange: (data: ImageBlockData) => void;
}

export default function ImageBlockForm({ data, onChange }: Props) {
  const [showUpload, setShowUpload] = useState(false);
  const set = <K extends keyof ImageBlockData>(key: K, value: ImageBlockData[K]) =>
    onChange({ ...data, [key]: value });

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-xs font-medium text-neutral-500 mb-1">Image URL</label>
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={data.url}
            onChange={(e) => set("url", e.target.value)}
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
        {data.url && (
          <img src={data.url} alt={data.alt} className="mt-2 max-h-32 rounded border border-neutral-100 object-contain" />
        )}
        {showUpload && (
          <ImageUploadModal
            onInsert={(url) => { set("url", url); setShowUpload(false); }}
            onClose={() => setShowUpload(false)}
          />
        )}
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-medium text-neutral-500 mb-1">Alt Text</label>
          <input
            type="text"
            value={data.alt}
            onChange={(e) => set("alt", e.target.value)}
            className="w-full border border-neutral-200 rounded-md px-3 py-2 text-sm"
            placeholder="Describe the image"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-neutral-500 mb-1">Alignment</label>
          <select
            value={data.alignment}
            onChange={(e) => set("alignment", e.target.value as ImageBlockData["alignment"])}
            className="w-full border border-neutral-200 rounded-md px-3 py-2 text-sm"
          >
            <option value="left">Left</option>
            <option value="center">Center</option>
            <option value="right">Right</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-xs font-medium text-neutral-500 mb-1">Caption</label>
        <input
          type="text"
          value={data.caption}
          onChange={(e) => set("caption", e.target.value)}
          className="w-full border border-neutral-200 rounded-md px-3 py-2 text-sm"
          placeholder="Optional caption"
        />
      </div>
    </div>
  );
}
