"use client";

import { useState, useCallback } from "react";

interface AIRequest {
  action: "generate_block" | "rewrite" | "meta_description" | "page_from_brief" | "expand" | "shorten";
  blockType?: string;
  pageTitle?: string;
  existingContent?: string;
  existingBlocks?: Array<{ type: string; data: Record<string, unknown> }>;
  brief?: string;
  targetLength?: "short" | "medium" | "long";
  providerOverride?: string;
  modelOverride?: string;
}

export function useAI() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generate = useCallback(async (request: AIRequest): Promise<string | null> => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/ai/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(request),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "AI generation failed");
      return data.result as string;
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : String(e);
      setError(msg);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return { generate, loading, error };
}
