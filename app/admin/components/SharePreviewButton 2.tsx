"use client";

import { useState, useEffect, useRef } from "react";
import { Link2, Copy, Check, Trash2, ChevronDown, Loader2 } from "lucide-react";

interface PreviewToken {
  id: number;
  token: string;
  label: string | null;
  created_by_email: string | null;
  expires_at: string;
  preview_url: string;
}

interface SharePreviewButtonProps {
  contentType: "page" | "blog_post" | "product";
  slug: string;
}

export default function SharePreviewButton({ contentType, slug }: SharePreviewButtonProps) {
  const [open, setOpen] = useState(false);
  const [tokens, setTokens] = useState<PreviewToken[]>([]);
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [copiedId, setCopiedId] = useState<number | "new" | null>(null);
  const [label, setLabel] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    function handle(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handle);
    return () => document.removeEventListener("mousedown", handle);
  }, []);

  async function loadTokens() {
    setLoading(true);
    try {
      const res = await fetch(`/api/preview/tokens?slug=${slug}&type=${contentType}`);
      if (res.ok) setTokens(await res.json());
    } finally {
      setLoading(false);
    }
  }

  function handleOpen() {
    setOpen((v) => !v);
    if (!open) loadTokens();
  }

  async function generate() {
    setGenerating(true);
    try {
      const res = await fetch("/api/preview/tokens", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content_type: contentType, slug, label: label.trim() || null }),
      });
      if (!res.ok) return;
      const token: PreviewToken = await res.json();
      await navigator.clipboard.writeText(token.preview_url);
      setCopiedId("new");
      setTimeout(() => setCopiedId(null), 2000);
      setLabel("");
      setTokens((prev) => [token, ...prev]);
    } finally {
      setGenerating(false);
    }
  }

  async function copy(token: PreviewToken) {
    await navigator.clipboard.writeText(token.preview_url);
    setCopiedId(token.id);
    setTimeout(() => setCopiedId(null), 2000);
  }

  async function revoke(id: number) {
    await fetch(`/api/preview/tokens?id=${id}`, { method: "DELETE" });
    setTokens((prev) => prev.filter((t) => t.id !== id));
  }

  function formatExpiry(iso: string) {
    const d = new Date(iso);
    const now = new Date();
    const diffH = Math.round((d.getTime() - now.getTime()) / 3_600_000);
    if (diffH < 1) return "expires soon";
    if (diffH < 24) return `${diffH}h left`;
    return `${Math.round(diffH / 24)}d left`;
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={handleOpen}
        className="flex items-center gap-1.5 px-3 py-1.5 text-xs border border-neutral-300 rounded-lg text-neutral-600 hover:bg-neutral-50 transition"
      >
        <Link2 size={12} />
        Share Preview
        <ChevronDown size={10} className={`transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-1.5 w-80 bg-white border border-neutral-200 rounded-xl shadow-lg z-50 overflow-hidden">
          {/* Generate new token */}
          <div className="p-3 border-b border-neutral-100">
            <p className="text-[11px] font-medium text-neutral-500 mb-2 uppercase tracking-wide">
              New preview link
            </p>
            <div className="flex gap-2">
              <input
                type="text"
                value={label}
                onChange={(e) => setLabel(e.target.value)}
                placeholder='Label (optional, e.g. "Client review")'
                className="flex-1 px-2 py-1.5 text-xs border border-neutral-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-amber-400 min-w-0"
                onKeyDown={(e) => e.key === "Enter" && generate()}
              />
              <button
                onClick={generate}
                disabled={generating}
                className="flex items-center gap-1 px-3 py-1.5 text-xs bg-amber-500 text-white rounded-lg hover:bg-amber-600 disabled:opacity-50 transition whitespace-nowrap"
              >
                {generating ? (
                  <Loader2 size={10} className="animate-spin" />
                ) : copiedId === "new" ? (
                  <Check size={10} />
                ) : (
                  <Copy size={10} />
                )}
                {copiedId === "new" ? "Copied!" : "Generate & Copy"}
              </button>
            </div>
            <p className="text-[10px] text-neutral-400 mt-1.5">
              Link expires in 72 hours. Anyone with the link can view the draft.
            </p>
          </div>

          {/* Existing tokens */}
          <div className="max-h-48 overflow-y-auto">
            {loading ? (
              <div className="flex items-center justify-center py-4">
                <Loader2 size={14} className="animate-spin text-neutral-400" />
              </div>
            ) : tokens.length === 0 ? (
              <p className="text-[11px] text-neutral-400 text-center py-4">No active links</p>
            ) : (
              <div className="divide-y divide-neutral-50">
                {tokens.map((t) => (
                  <div key={t.id} className="flex items-center gap-2 px-3 py-2.5 hover:bg-neutral-50">
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-neutral-700 truncate">
                        {t.label || "Unnamed link"}
                      </p>
                      <p className="text-[10px] text-neutral-400">
                        {formatExpiry(t.expires_at)}
                        {t.created_by_email && ` · ${t.created_by_email.split("@")[0]}`}
                      </p>
                    </div>
                    <button
                      onClick={() => copy(t)}
                      title="Copy link"
                      className="p-1.5 rounded-md text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 transition"
                    >
                      {copiedId === t.id ? (
                        <Check size={12} className="text-green-500" />
                      ) : (
                        <Copy size={12} />
                      )}
                    </button>
                    <button
                      onClick={() => revoke(t.id)}
                      title="Revoke link"
                      className="p-1.5 rounded-md text-neutral-400 hover:text-red-500 hover:bg-red-50 transition"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
