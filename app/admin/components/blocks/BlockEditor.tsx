"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Undo2, Redo2, Eye, Pencil } from "lucide-react";
import type { Block, BlockType } from "@/lib/types/blocks";
import { createBlock } from "@/lib/blocks/defaults";
import BlockCanvas from "./BlockCanvas";
import BlockPalette from "./BlockPalette";
import AIAssistPanel from "./AIAssistPanel";
import BlockRenderer from "@/app/components/blocks/BlockRenderer";

const MAX_HISTORY = 50;

interface Props {
  blocks: Block[];
  onChange: (blocks: Block[]) => void;
  pageTitle?: string;
}

export default function BlockEditor({ blocks, onChange, pageTitle = "" }: Props) {
  const [preview, setPreview] = useState(false);

  // Undo/redo stacks stored as refs to avoid re-render cycles
  const pastRef = useRef<Block[][]>([]);
  const futureRef = useRef<Block[][]>([]);
  const [undoCount, setUndoCount] = useState(0); // trigger re-renders for button state

  const pushHistory = useCallback(() => {
    pastRef.current = [...pastRef.current, blocks].slice(-MAX_HISTORY);
    futureRef.current = [];
    setUndoCount(pastRef.current.length);
  }, [blocks]);

  const handleChange = useCallback(
    (next: Block[]) => {
      pushHistory();
      onChange(next);
    },
    [pushHistory, onChange]
  );

  const handleUndo = useCallback(() => {
    if (pastRef.current.length === 0) return;
    const prev = [...pastRef.current];
    const restored = prev.pop()!;
    pastRef.current = prev;
    futureRef.current = [blocks, ...futureRef.current].slice(0, MAX_HISTORY);
    setUndoCount(prev.length);
    onChange(restored);
  }, [blocks, onChange]);

  const handleRedo = useCallback(() => {
    if (futureRef.current.length === 0) return;
    const fut = [...futureRef.current];
    const next = fut.shift()!;
    futureRef.current = fut;
    pastRef.current = [...pastRef.current, blocks].slice(-MAX_HISTORY);
    setUndoCount(pastRef.current.length);
    onChange(next);
  }, [blocks, onChange]);

  const canUndo = pastRef.current.length > 0;
  const canRedo = futureRef.current.length > 0;

  // Keyboard shortcuts
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const mod = e.metaKey || e.ctrlKey;
      if (!mod) return;
      if (e.key === "z" && !e.shiftKey) {
        e.preventDefault();
        handleUndo();
      }
      if ((e.key === "z" && e.shiftKey) || e.key === "y") {
        e.preventDefault();
        handleRedo();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [handleUndo, handleRedo]);

  const handleAdd = useCallback(
    (type: BlockType) => {
      const newBlock = createBlock(type, blocks.length) as Block;
      handleChange([...blocks, newBlock]);
    },
    [blocks, handleChange]
  );

  const handleAddBlocks = useCallback(
    (newBlocks: Block[]) => {
      handleChange([...blocks, ...newBlocks]);
    },
    [blocks, handleChange]
  );

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex items-center gap-2 bg-white border border-neutral-200 rounded-lg px-3 py-2">
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={handleUndo}
            disabled={!canUndo}
            className="p-1.5 rounded text-neutral-500 hover:bg-neutral-100 disabled:opacity-30 disabled:cursor-not-allowed transition"
            title="Undo (Ctrl+Z)"
          >
            <Undo2 className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={handleRedo}
            disabled={!canRedo}
            className="p-1.5 rounded text-neutral-500 hover:bg-neutral-100 disabled:opacity-30 disabled:cursor-not-allowed transition"
            title="Redo (Ctrl+Shift+Z)"
          >
            <Redo2 className="w-4 h-4" />
          </button>
        </div>

        <div className="w-px h-5 bg-neutral-200" />

        <span className="text-xs text-neutral-400 flex-1">
          {blocks.length} block{blocks.length !== 1 ? "s" : ""}
          {undoCount > 0 && ` · ${undoCount} change${undoCount !== 1 ? "s" : ""}`}
        </span>

        <div className="flex items-center bg-neutral-100 rounded-lg p-0.5">
          <button
            type="button"
            onClick={() => setPreview(false)}
            className={`flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded-md transition ${
              !preview
                ? "bg-white text-neutral-900 shadow-sm"
                : "text-neutral-500 hover:text-neutral-700"
            }`}
          >
            <Pencil className="w-3 h-3" />
            Edit
          </button>
          <button
            type="button"
            onClick={() => setPreview(true)}
            className={`flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded-md transition ${
              preview
                ? "bg-white text-neutral-900 shadow-sm"
                : "text-neutral-500 hover:text-neutral-700"
            }`}
          >
            <Eye className="w-3 h-3" />
            Preview
          </button>
        </div>
      </div>

      {/* Content */}
      {preview ? (
        <div className="border border-neutral-200 rounded-lg overflow-hidden bg-white">
          <div className="px-3 py-1.5 bg-neutral-50 border-b border-neutral-200 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-red-400" />
            <span className="w-2 h-2 rounded-full bg-amber-400" />
            <span className="w-2 h-2 rounded-full bg-green-400" />
            <span className="text-[10px] text-neutral-400 ml-2">Preview</span>
          </div>
          <div className="max-h-[70vh] overflow-y-auto">
            {blocks.length === 0 ? (
              <p className="text-sm text-neutral-400 text-center py-12">
                No blocks to preview.
              </p>
            ) : (
              <BlockRenderer blocks={blocks} />
            )}
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-[1fr_220px] gap-6 items-start">
          <BlockCanvas blocks={blocks} onChange={handleChange} />
          <div className="sticky top-6 space-y-4">
            <BlockPalette onAdd={handleAdd} />
            <AIAssistPanel
              pageTitle={pageTitle}
              blocks={blocks}
              onAddBlocks={handleAddBlocks}
            />
          </div>
        </div>
      )}
    </div>
  );
}
