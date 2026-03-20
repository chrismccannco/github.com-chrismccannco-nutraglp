"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  GripVertical,
  Trash2,
  Eye,
  EyeOff,
  ChevronDown,
  Copy,
  ChevronUp,
  ArrowUp,
  ArrowDown,
} from "lucide-react";
import * as Icons from "lucide-react";
import { useState, type ReactNode } from "react";
import { BLOCK_CATALOG, type Block } from "@/lib/types/blocks";

interface BlockItemProps {
  block: Block;
  children: ReactNode;
  index: number;
  total: number;
  onRemove: () => void;
  onToggleHidden: () => void;
  onDuplicate: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
}

export default function BlockItem({
  block,
  children,
  index,
  total,
  onRemove,
  onToggleHidden,
  onDuplicate,
  onMoveUp,
  onMoveDown,
}: BlockItemProps) {
  const [expanded, setExpanded] = useState(true);
  const meta = BLOCK_CATALOG.find((m) => m.type === block.type);
  const Icon = meta
    ? ((Icons as unknown as Record<string, React.ComponentType<{ className?: string }>>)[meta.icon] ?? Icons.Box)
    : Icons.Box;

  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: block.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`bg-white border rounded-lg shadow-sm ${
        block.hidden ? "border-neutral-200 opacity-60" : "border-neutral-200"
      }`}
    >
      {/* Header */}
      <div className="flex items-center gap-1.5 px-3 py-2.5 border-b border-neutral-100">
        <button
          type="button"
          className="cursor-grab active:cursor-grabbing p-0.5 text-neutral-300 hover:text-neutral-500"
          {...attributes}
          {...listeners}
        >
          <GripVertical className="w-4 h-4" />
        </button>

        <Icon className="w-4 h-4 text-neutral-400 flex-shrink-0" />
        <span className="text-sm font-medium text-neutral-700 flex-1 truncate">
          {meta?.label ?? block.type}
        </span>

        {/* Move up/down */}
        <button
          type="button"
          onClick={onMoveUp}
          disabled={index === 0}
          className="p-1 rounded text-neutral-400 hover:text-neutral-600 hover:bg-neutral-100 disabled:opacity-30 disabled:cursor-not-allowed"
          title="Move up"
        >
          <ArrowUp className="w-3.5 h-3.5" />
        </button>
        <button
          type="button"
          onClick={onMoveDown}
          disabled={index === total - 1}
          className="p-1 rounded text-neutral-400 hover:text-neutral-600 hover:bg-neutral-100 disabled:opacity-30 disabled:cursor-not-allowed"
          title="Move down"
        >
          <ArrowDown className="w-3.5 h-3.5" />
        </button>

        <div className="w-px h-4 bg-neutral-100" />

        <button
          type="button"
          onClick={onDuplicate}
          className="p-1 rounded text-neutral-400 hover:text-neutral-600 hover:bg-neutral-100"
          title="Duplicate block"
        >
          <Copy className="w-3.5 h-3.5" />
        </button>

        <button
          type="button"
          onClick={onToggleHidden}
          className="p-1 rounded text-neutral-400 hover:text-neutral-600 hover:bg-neutral-100"
          title={block.hidden ? "Show block" : "Hide block"}
        >
          {block.hidden ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
        </button>

        <button
          type="button"
          onClick={onRemove}
          className="p-1 rounded text-neutral-400 hover:text-red-500 hover:bg-red-50"
          title="Remove block"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>

        <button
          type="button"
          onClick={() => setExpanded(!expanded)}
          className="p-1 rounded text-neutral-400 hover:text-neutral-600"
        >
          <ChevronUp className={`w-4 h-4 transition-transform ${expanded ? "" : "rotate-180"}`} />
        </button>
      </div>

      {/* Body */}
      {expanded && <div className="p-4">{children}</div>}
    </div>
  );
}
