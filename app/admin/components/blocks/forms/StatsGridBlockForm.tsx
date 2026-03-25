"use client";

import type { StatsGridBlockData } from "@/lib/types/blocks";
import { Plus, Trash2 } from "lucide-react";

interface Props {
  data: StatsGridBlockData;
  onChange: (data: StatsGridBlockData) => void;
}

const COLORS = [
  { value: "", label: "None" },
  { value: "forest", label: "Forest" },
  { value: "cream", label: "Cream" },
  { value: "sage", label: "Sage" },
];

export default function StatsGridBlockForm({ data, onChange }: Props) {
  const updateStat = (id: string, field: "label" | "value", val: string) => {
    onChange({
      ...data,
      stats: data.stats.map((s) => (s.id === id ? { ...s, [field]: val } : s)),
    });
  };

  const addStat = () => {
    onChange({
      ...data,
      stats: [...data.stats, { id: crypto.randomUUID(), label: "Stat", value: "0" }],
    });
  };

  const removeStat = (id: string) => {
    onChange({ ...data, stats: data.stats.filter((s) => s.id !== id) });
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

      <div className="space-y-2">
        <label className="block text-xs font-medium text-neutral-500">Stats</label>
        {data.stats.map((stat) => (
          <div key={stat.id} className="flex items-center gap-2">
            <input
              type="text"
              value={stat.value}
              onChange={(e) => updateStat(stat.id, "value", e.target.value)}
              className="w-24 border border-neutral-200 rounded-md px-3 py-1.5 text-sm font-semibold"
              placeholder="99%"
            />
            <input
              type="text"
              value={stat.label}
              onChange={(e) => updateStat(stat.id, "label", e.target.value)}
              className="flex-1 border border-neutral-200 rounded-md px-3 py-1.5 text-sm"
              placeholder="Label"
            />
            <button
              type="button"
              onClick={() => removeStat(stat.id)}
              className="p-1 text-neutral-400 hover:text-red-500"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={addStat}
          className="flex items-center gap-1 text-xs text-teal-600 hover:text-teal-700 mt-1"
        >
          <Plus className="w-3.5 h-3.5" /> Add stat
        </button>
      </div>
    </div>
  );
}
