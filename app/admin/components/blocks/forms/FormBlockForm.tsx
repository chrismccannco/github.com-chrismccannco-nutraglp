"use client";

import type { FormBlockData } from "@/lib/types/blocks";

const BG_OPTIONS = [
  { value: "", label: "Default (white)" },
  { value: "cream", label: "Cream" },
  { value: "forest", label: "Forest" },
  { value: "sage", label: "Sage" },
  { value: "ink", label: "Ink" },
];

interface Props {
  data: FormBlockData;
  onChange: (data: FormBlockData) => void;
}

export default function FormBlockForm({ data, onChange }: Props) {
  const set = <K extends keyof FormBlockData>(key: K, value: FormBlockData[K]) =>
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
          placeholder="Join the Waitlist"
        />
      </div>

      <div>
        <label className="block text-xs font-medium text-neutral-500 mb-1">Description</label>
        <textarea
          value={data.description}
          onChange={(e) => set("description", e.target.value)}
          rows={2}
          className="w-full border border-neutral-200 rounded-md px-3 py-2 text-sm"
          placeholder="Optional supporting text above the form"
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-medium text-neutral-500 mb-1">Button Text</label>
          <input
            type="text"
            value={data.buttonText}
            onChange={(e) => set("buttonText", e.target.value)}
            className="w-full border border-neutral-200 rounded-md px-3 py-2 text-sm"
            placeholder="Join the Waitlist"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-neutral-500 mb-1">Form Name</label>
          <input
            type="text"
            value={data.formName}
            onChange={(e) => set("formName", e.target.value)}
            className="w-full border border-neutral-200 rounded-md px-3 py-2 text-sm"
            placeholder="waitlist"
          />
          <p className="text-[10px] text-neutral-400 mt-1">Internal identifier for submissions</p>
        </div>
      </div>

      <div>
        <label className="block text-xs font-medium text-neutral-500 mb-1">Success Message</label>
        <input
          type="text"
          value={data.successMessage}
          onChange={(e) => set("successMessage", e.target.value)}
          className="w-full border border-neutral-200 rounded-md px-3 py-2 text-sm"
          placeholder="You're on the list. We'll be in touch."
        />
      </div>

      <div>
        <label className="block text-xs font-medium text-neutral-500 mb-1">Background Color</label>
        <select
          value={data.bgColor}
          onChange={(e) => set("bgColor", e.target.value)}
          className="w-full border border-neutral-200 rounded-md px-3 py-2 text-sm"
        >
          {BG_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
      </div>
    </div>
  );
}
