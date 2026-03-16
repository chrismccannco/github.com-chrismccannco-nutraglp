"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { CTAButtonBlockData } from "@/lib/types/blocks";

const styleClasses: Record<string, string> = {
  primary: "bg-[#1B3A5C] text-white hover:bg-[#132D4A]",
  secondary: "bg-[#F5F0E8] text-[#1B3A5C] hover:bg-[#EDE6D8]",
  outline: "border-2 border-[#1B3A5C] text-[#1B3A5C] hover:bg-[#1B3A5C] hover:text-white",
};

function getSessionId(): string {
  if (typeof window === "undefined") return "";
  let id = sessionStorage.getItem("ab_session");
  if (!id) {
    id = crypto.randomUUID();
    sessionStorage.setItem("ab_session", id);
  }
  return id;
}

function pickVariant(blockId: string): "A" | "B" {
  const key = `ab_variant_${blockId}`;
  if (typeof window !== "undefined") {
    const stored = sessionStorage.getItem(key);
    if (stored === "A" || stored === "B") return stored;
  }
  const variant: "A" | "B" = Math.random() < 0.5 ? "A" : "B";
  if (typeof window !== "undefined") {
    sessionStorage.setItem(key, variant);
  }
  return variant;
}

function trackAB(blockId: string, variant: string, eventType: "impression" | "click", pagePath: string) {
  const sessionId = getSessionId();
  fetch("/api/ab", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      block_id: blockId,
      variant,
      event_type: eventType,
      page_path: pagePath,
      session_id: sessionId,
    }),
  }).catch(() => {});
}

interface Props {
  data: CTAButtonBlockData;
  blockId?: string;
}

export default function CTAButtonBlockRender({ data, blockId }: Props) {
  const pathname = usePathname();
  const tracked = useRef(false);
  const [variant, setVariant] = useState<"A" | "B">("A");
  const abActive = data.abEnabled && data.variantB && blockId;

  useEffect(() => {
    if (!abActive || !blockId) return;
    const v = pickVariant(blockId);
    setVariant(v);
    if (!tracked.current) {
      tracked.current = true;
      trackAB(blockId, v, "impression", pathname);
    }
  }, [abActive, blockId, pathname]);

  const showB = abActive && variant === "B" && data.variantB;
  const text = showB ? data.variantB!.text || data.text : data.text;
  const url = showB ? data.variantB!.url || data.url : data.url;
  const style = showB ? data.variantB!.style || data.style : data.style;

  if (!text || !url) return null;

  const handleClick = () => {
    if (abActive && blockId) {
      trackAB(blockId, variant, "click", pathname);
    }
  };

  return (
    <div className={`py-6 px-6 ${data.centered ? "text-center" : ""}`}>
      <Link
        href={url}
        onClick={handleClick}
        className={`inline-block px-8 py-3 rounded-full font-semibold transition-colors ${styleClasses[style] || styleClasses.primary}`}
      >
        {text}
      </Link>
    </div>
  );
}
