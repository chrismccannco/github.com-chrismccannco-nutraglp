"use client";

import { BLOCK_CATALOG, type BlockType } from "@/lib/types/blocks";
import * as Icons from "lucide-react";

interface BlockPaletteProps {
  onAdd: (type: BlockType) => void;
}

export default function BlockPalette({ onAdd }: BlockPaletteProps) {
  return (
    <div className="bg-white border border-neutral-200 rounded-lg shadow-sm">
      <div className="px-5 py-3.5 border-b border-neutral-100">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
          Add Block
        </h3>
      </div>
      <div className="p-3 grid grid-cols-2 gap-2">
        {BLOCK_CATALOG.map((meta) => {
          const Icon = (Icons as unknown as Record<string, React.ComponentType<{ className?: string }>>)[meta.icon] ?? Icons.Box;
          return (
            <button
              key={meta.type}
              type="button"
              onClick={() => onAdd(meta.type)}
              className="flex flex-col items-center gap-1.5 p-3 rounded-md border border-neutral-100 hover:border-teal-300 hover:bg-teal-50/40 transition-colors text-center group"
            >
              <Icon className="w-5 h-5 text-neutral-400 group-hover:text-teal-600 transition-colors" />
              <span className="text-[11px] font-medium text-neutral-600 group-hover:text-teal-700 leading-tight">
                {meta.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
