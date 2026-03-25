"use client";

import { useState } from "react";
import { useAI } from "../../hooks/useAI";

interface Props {
  blockType: string;
  content: string; // HTML or text content from the block
  pageTitle: string;
  onUpdate: (newContent: string) => void;
}

/**
 * AI action buttons for individual blocks.
 * Shows rewrite/expand/shorten buttons on text-containing blocks.
 */
export default function AIBlockActions({ blockType, content, pageTitle, onUpdate }: Props) {
  const { generate, loading } = useAI();
  const [open, setOpen] = useState(false);

  // Only show for blocks with text content
  const textBlocks = ["rich_text", "hero", "image_text"];
  if (!textBlocks.includes(blockType) || !content) return null;

  const handleAction = async (action: "rewrite" | "expand" | "shorten") => {
    const result = await generate({
      action,
      existingContent: content,
      pageTitle,
    });
    if (result) {
      onUpdate(result);
      setOpen(false);
    }
  };

  return (
    <div className="relative inline-flex">
      <button
        onClick={() => setOpen(!open)}
        disabled={loading}
        className="p-1 rounded hover:bg-teal-50 text-teal-400 hover:text-teal-600 transition-colors"
        title="AI Assist"
      >
        {loading ? (
          <div className="w-3.5 h-3.5 border-2 border-teal-300 border-t-teal-600 rounded-full animate-spin" />
        ) : (
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        )}
      </button>

      {open && !loading && (
        <div className="absolute top-full right-0 mt-1 bg-white border border-teal-200 rounded-lg shadow-lg z-20 py-1 min-w-[120px]">
          <button
            onClick={() => handleAction("rewrite")}
            className="w-full text-left px-3 py-1.5 text-xs text-neutral-700 hover:bg-teal-50 transition-colors"
          >
            Rewrite
          </button>
          <button
            onClick={() => handleAction("expand")}
            className="w-full text-left px-3 py-1.5 text-xs text-neutral-700 hover:bg-teal-50 transition-colors"
          >
            Expand
          </button>
          <button
            onClick={() => handleAction("shorten")}
            className="w-full text-left px-3 py-1.5 text-xs text-neutral-700 hover:bg-teal-50 transition-colors"
          >
            Shorten
          </button>
        </div>
      )}
    </div>
  );
}
