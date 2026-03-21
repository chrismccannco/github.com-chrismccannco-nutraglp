"use client";

import { useState } from "react";
import { useAI } from "../../hooks/useAI";
import type { Block, BlockType } from "@/lib/types/blocks";
import { createBlock } from "@/lib/blocks/defaults";

interface Props {
  pageTitle: string;
  blocks: Block[];
  onAddBlocks: (newBlocks: Block[]) => void;
  onUpdateBlock?: (blockId: string, data: Record<string, unknown>) => void;
}

export default function AIAssistPanel({ pageTitle, blocks, onAddBlocks }: Props) {
  const { generate, loading, error } = useAI();
  const [brief, setBrief] = useState("");
  const [mode, setMode] = useState<"generate" | "page">("generate");
  const [lastResult, setLastResult] = useState<string | null>(null);

  const handleGenerateBlock = async (blockType: BlockType) => {
    const result = await generate({
      action: "generate_block",
      blockType,
      pageTitle,
      brief: brief || undefined,
      existingBlocks: blocks.map((b) => ({ type: b.type, data: b.data as unknown as Record<string, unknown> })),
    });
    if (!result) return;

    try {
      const data = JSON.parse(result);
      const newBlock = createBlock(blockType, blocks.length) as Block;
      (newBlock as Block & { data: Record<string, unknown> }).data = {
        ...(newBlock as Block & { data: Record<string, unknown> }).data,
        ...data,
      };
      onAddBlocks([newBlock]);
      setLastResult(`Added ${blockType} block`);
      setBrief("");
    } catch {
      setLastResult("Failed to parse AI response. Try again.");
    }
  };

  const handlePageFromBrief = async () => {
    if (!brief.trim()) return;
    const result = await generate({
      action: "page_from_brief",
      pageTitle,
      brief,
      targetLength: "medium",
    });
    if (!result) return;

    try {
      const parsed = JSON.parse(result);
      if (!Array.isArray(parsed)) throw new Error("Expected array");
      const newBlocks: Block[] = parsed.map(
        (item: { type: BlockType; data: Record<string, unknown> }, i: number) => {
          const block = createBlock(item.type, blocks.length + i) as Block;
          (block as Block & { data: Record<string, unknown> }).data = {
            ...(block as Block & { data: Record<string, unknown> }).data,
            ...item.data,
          };
          return block;
        }
      );
      onAddBlocks(newBlocks);
      setLastResult(`Generated ${newBlocks.length} blocks`);
      setBrief("");
    } catch {
      setLastResult("Failed to parse page layout. Try a more specific brief.");
    }
  };

  const handleMetaDescription = async () => {
    const result = await generate({
      action: "meta_description",
      pageTitle,
      existingBlocks: blocks.map((b) => ({ type: b.type, data: b.data as unknown as Record<string, unknown> })),
    });
    if (result) {
      setLastResult(result);
      // Copy to clipboard
      navigator.clipboard?.writeText(result);
    }
  };

  const quickBlocks: { type: BlockType; label: string }[] = [
    { type: "hero", label: "Hero" },
    { type: "rich_text", label: "Text" },
    { type: "image_text", label: "Image+Text" },
    { type: "cta_button", label: "CTA" },
    { type: "stats_grid", label: "Stats" },
    { type: "card_grid", label: "Cards" },
  ];

  return (
    <div className="bg-gradient-to-b from-teal-50 to-white border border-teal-200 rounded-xl p-4">
      <div className="flex items-center gap-2 mb-3">
        <div className="w-5 h-5 rounded-full bg-teal-500 flex items-center justify-center">
          <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </div>
        <h3 className="text-sm font-semibold text-teal-900">AI Assist</h3>
      </div>

      {/* Mode Toggle */}
      <div className="flex gap-1 mb-3 bg-teal-100 rounded-lg p-0.5">
        <button
          onClick={() => setMode("generate")}
          className={`flex-1 text-xs py-1.5 rounded-md transition-colors ${
            mode === "generate" ? "bg-white text-teal-900 shadow-sm" : "text-teal-600"
          }`}
        >
          Block
        </button>
        <button
          onClick={() => setMode("page")}
          className={`flex-1 text-xs py-1.5 rounded-md transition-colors ${
            mode === "page" ? "bg-white text-teal-900 shadow-sm" : "text-teal-600"
          }`}
        >
          Full Page
        </button>
      </div>

      {/* Brief Input */}
      <textarea
        value={brief}
        onChange={(e) => setBrief(e.target.value)}
        placeholder={
          mode === "generate"
            ? "Describe what you want\u2026"
            : "Describe the page\u2026\ne.g. Landing page for Slim SHOT targeting women 35-55 who want natural weight management"
        }
        rows={mode === "page" ? 4 : 2}
        className="w-full px-3 py-2 text-xs border border-teal-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-400 resize-none mb-3"
      />

      {mode === "generate" ? (
        <>
          {/* Quick Generate Buttons */}
          <div className="grid grid-cols-2 gap-1.5 mb-3">
            {quickBlocks.map((qb) => (
              <button
                key={qb.type}
                onClick={() => handleGenerateBlock(qb.type)}
                disabled={loading}
                className="text-xs px-2 py-1.5 bg-white border border-teal-200 rounded-md hover:bg-teal-50 text-teal-700 transition-colors disabled:opacity-50"
              >
                {qb.label}
              </button>
            ))}
          </div>

          {/* Meta Description */}
          <button
            onClick={handleMetaDescription}
            disabled={loading}
            className="w-full text-xs px-3 py-1.5 bg-white border border-teal-200 rounded-md hover:bg-teal-50 text-teal-700 transition-colors disabled:opacity-50"
          >
            Generate Meta Description
          </button>
        </>
      ) : (
        <button
          onClick={handlePageFromBrief}
          disabled={loading || !brief.trim()}
          className="w-full text-xs px-3 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors disabled:opacity-50 font-medium"
        >
          {loading ? "Generating\u2026" : "Generate Page Layout"}
        </button>
      )}

      {/* Loading */}
      {loading && (
        <div className="mt-3 flex items-center gap-2 text-xs text-teal-600">
          <div className="w-3 h-3 border-2 border-teal-300 border-t-teal-600 rounded-full animate-spin" />
          Thinking&hellip;
        </div>
      )}

      {/* Result */}
      {lastResult && !loading && (
        <div className="mt-3 p-2 bg-white rounded-lg border border-teal-100">
          <p className="text-xs text-neutral-700 break-words">{lastResult}</p>
        </div>
      )}

      {/* Error */}
      {error && !loading && (
        <div className="mt-3 p-2 bg-red-50 rounded-lg border border-red-200">
          <p className="text-xs text-red-700">{error}</p>
        </div>
      )}
    </div>
  );
}
