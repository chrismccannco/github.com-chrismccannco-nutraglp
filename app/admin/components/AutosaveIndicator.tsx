"use client";

import { Cloud, CloudOff, Loader2 } from "lucide-react";

type SaveStatus = "idle" | "saving" | "saved" | "error";

const config: Record<SaveStatus, { icon: typeof Cloud; text: string; className: string }> = {
  idle: { icon: Cloud, text: "", className: "text-neutral-300" },
  saving: { icon: Loader2, text: "Saving\u2026", className: "text-neutral-400" },
  saved: { icon: Cloud, text: "Saved", className: "text-indigo-500" },
  error: { icon: CloudOff, text: "Error saving", className: "text-red-500" },
};

export default function AutosaveIndicator({ status }: { status: SaveStatus }) {
  if (status === "idle") return null;
  const { icon: Icon, text, className } = config[status];
  return (
    <span className={`flex items-center gap-1 text-xs ${className}`}>
      <Icon className={`w-3.5 h-3.5 ${status === "saving" ? "animate-spin" : ""}`} />
      {text}
    </span>
  );
}
