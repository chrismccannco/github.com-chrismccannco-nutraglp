"use client";

import type { CardGridBlockData } from "@/lib/types/blocks";
import ImageUploadModal from "../../ImageUploadModal";
import { Plus, Trash2, Upload } from "lucide-react";
import { useState } from "react";

interface Props {
  data: CardGridBlockData;
  onChange: (data: CardGridBlockData) => void;
}

const COLORS = [
  { value: "", label: "None" },
  { value: "forest", label: "Forest" },
  { value: "cream", label: "Cream" },
  { value: "sage", label: "Sage" },
];

export default function CardGridBlockForm({ data, onChange }: Props) {
  const [uploadFor, setUploadFor] = useState<string | null>(null);

  const updateCard = (id: string, field: string, val: string) => {
    onChange({
      ...data,
      cards: data.cards.map((c) => (c.id === id ? { ...c, [field]: val } : c)),
    });
  };

  const addCard = () => {
    onChange({
      ...data,
      cards: [
        ...data.cards,
        {
          id: crypto.randomUUID(),
          title: "",
          description: "",
          imageUrl: "",
          ctaText: "",
          ctaUrl: "",
        },
      ],
    });
  };

  const removeCard = (id: string) => {
    onChange({ ...data, cards: data.cards.filter((c) => c.id !== id) });
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-medium text-neutral-500 mb-1">Columns</label>
          <select
            value={data.columns}
            onChange={(e) => onChange({ ...data, columns: Number(e.target.value) as 2 | 3 | 4 })}
            className="w-full border border-neutral-200 rounded-md px-3 py-2 text-sm"
          >
            <option value={2}>2</option>
            <option value={3}>3</option>
            <option value={4}>4</option>
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium text-neutral-500 mb-1">Background</label>
          <select
            value={data.bgColor}
            onChange={(e) => onChange({ ...data, bgColor: e.target.value })}
            className="w-full border border-neutral-200 rounded-md px-3 py-2 text-sm"
          >
            {COLORS.map((c) => (
              <option key={c.value} value={c.value}>{c.label}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="space-y-3">
        <label className="block text-xs font-medium text-neutral-500">Cards</label>
        {data.cards.map((card) => (
          <div key={card.id} className="border border-neutral-100 rounded-md p-3 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-neutral-400">Card</span>
              <button
                type="button"
                onClick={() => removeCard(card.id)}
                className="p-1 text-neutral-400 hover:text-red-500"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
            <input
              type="text"
              value={card.title}
              onChange={(e) => updateCard(card.id, "title", e.target.value)}
              className="w-full border border-neutral-200 rounded-md px-3 py-1.5 text-sm"
              placeholder="Card title"
            />
            <textarea
              value={card.description}
              onChange={(e) => updateCard(card.id, "description", e.target.value)}
              className="w-full border border-neutral-200 rounded-md px-3 py-1.5 text-sm"
              placeholder="Description"
              rows={2}
            />
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={card.imageUrl}
                onChange={(e) => updateCard(card.id, "imageUrl", e.target.value)}
                className="flex-1 border border-neutral-200 rounded-md px-3 py-1.5 text-sm"
                placeholder="Image URL"
              />
              <button
                type="button"
                onClick={() => setUploadFor(card.id)}
                className="p-1.5 border border-neutral-200 rounded-md hover:bg-neutral-50"
              >
                <Upload className="w-3.5 h-3.5 text-neutral-500" />
              </button>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <input
                type="text"
                value={card.ctaText}
                onChange={(e) => updateCard(card.id, "ctaText", e.target.value)}
                className="border border-neutral-200 rounded-md px-3 py-1.5 text-sm"
                placeholder="CTA text"
              />
              <input
                type="text"
                value={card.ctaUrl}
                onChange={(e) => updateCard(card.id, "ctaUrl", e.target.value)}
                className="border border-neutral-200 rounded-md px-3 py-1.5 text-sm"
                placeholder="CTA URL"
              />
            </div>
          </div>
        ))}
        <button
          type="button"
          onClick={addCard}
          className="flex items-center gap-1 text-xs text-indigo-600 hover:text-indigo-700"
        >
          <Plus className="w-3.5 h-3.5" /> Add card
        </button>
      </div>

      {uploadFor && (
        <ImageUploadModal
          onInsert={(url) => { updateCard(uploadFor, "imageUrl", url); setUploadFor(null); }}
          onClose={() => setUploadFor(null)}
        />
      )}
    </div>
  );
}
