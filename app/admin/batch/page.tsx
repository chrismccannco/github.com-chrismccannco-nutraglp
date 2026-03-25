"use client";

import { useState, useCallback } from "react";
import { Plus, Trash2, Play, Copy, Check, Save, RefreshCw, ChevronDown } from "lucide-react";
import { useAIProviders } from "../hooks/useAIProviders";

interface BatchItem {
  id: string;
  topic: string;
  status: "idle" | "generating" | "done" | "error";
  result: string;
  saved: boolean;
  copied: boolean;
  error?: string;
}

const CONTENT_TYPES = [
  { value: "blog", label: "Blog Post Draft" },
  { value: "page", label: "Page Copy" },
  { value: "social", label: "Social Caption" },
  { value: "email", label: "Email Draft" },
] as const;

type ContentType = typeof CONTENT_TYPES[number]["value"];

const PROMPTS: Record<ContentType, (topic: string) => string> = {
  blog: (t) => `Write a complete blog post about: ${t}. Include a compelling title, introduction, 3-4 sections with subheadings, and a conclusion. Format in HTML.`,
  page: (t) => `Write compelling landing page copy for: ${t}. Include headline, subheadline, key benefits, and a CTA. Format in HTML.`,
  social: (t) => `Write 3 social media captions for: ${t}. One for LinkedIn (professional), one for Twitter/X (short, punchy), one for Instagram (conversational). Label each platform.`,
  email: (t) => `Write a marketing email about: ${t}. Include subject line, preheader, body, and CTA. Format clearly.`,
};

function uid() {
  return Math.random().toString(36).slice(2);
}

const CONCURRENCY = 3;

export default function BatchGeneratePage() {
  const [items, setItems] = useState<BatchItem[]>([
    { id: uid(), topic: "", status: "idle", result: "", saved: false, copied: false },
    { id: uid(), topic: "", status: "idle", result: "", saved: false, copied: false },
    { id: uid(), topic: "", status: "idle", result: "", saved: false, copied: false },
  ]);
  const [contentType, setContentType] = useState<ContentType>("blog");
  const [voiceId, setVoiceId] = useState<string>("");
  const [personaId, setPersonaId] = useState<string>("");
  const [running, setRunning] = useState(false);
  const [bulkInput, setBulkInput] = useState("");
  const [showBulk, setShowBulk] = useState(false);
  const { providers, selectedProvider, setSelectedProvider, providerOverride } = useAIProviders();

  function updateItem(id: string, patch: Partial<BatchItem>) {
    setItems((prev) => prev.map((it) => (it.id === id ? { ...it, ...patch } : it)));
  }

  function addRow() {
    setItems((prev) => [...prev, { id: uid(), topic: "", status: "idle", result: "", saved: false, copied: false }]);
  }

  function removeRow(id: string) {
    setItems((prev) => prev.filter((it) => it.id !== id));
  }

  function applyBulk() {
    const lines = bulkInput.split("\n").map((l) => l.trim()).filter(Boolean);
    if (lines.length === 0) return;
    setItems(lines.map((topic) => ({ id: uid(), topic, status: "idle", result: "", saved: false, copied: false })));
    setBulkInput("");
    setShowBulk(false);
  }

  async function generateOne(item: BatchItem): Promise<void> {
    if (!item.topic.trim()) return;
    updateItem(item.id, { status: "generating", error: undefined });
    try {
      const res = await fetch("/api/ai-assist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contentType,
          prompt: PROMPTS[contentType](item.topic),
          voiceId: voiceId ? Number(voiceId) : undefined,
          personaId: personaId ? Number(personaId) : undefined,
          providerOverride,
        }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: `HTTP ${res.status}` }));
        throw new Error(err.error || `HTTP ${res.status}`);
      }

      // Stream response
      const reader = res.body?.getReader();
      const decoder = new TextDecoder();
      let full = "";
      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          const chunk = decoder.decode(value);
          const lines = chunk.split("\n");
          for (const line of lines) {
            if (line.startsWith("data: ")) {
              const data = line.slice(6).trim();
              if (data === "[DONE]") break;
              try {
                const parsed = JSON.parse(data);
                if (parsed.text) {
                  full += parsed.text;
                  updateItem(item.id, { result: full });
                } else if (parsed.result) {
                  full = parsed.result;
                  updateItem(item.id, { result: full });
                }
              } catch { /* non-JSON chunk */ }
            }
          }
        }
      }
      if (!full) {
        // Fallback: parse as JSON
        const data = await res.json().catch(() => null);
        full = data?.result || data?.content || "";
      }
      updateItem(item.id, { status: "done", result: full });
    } catch (e: unknown) {
      updateItem(item.id, { status: "error", error: String(e) });
    }
  }

  async function runAll() {
    const pending = items.filter((it) => it.topic.trim() && it.status !== "done");
    if (pending.length === 0) return;
    setRunning(true);

    // Reset pending items
    pending.forEach((it) => updateItem(it.id, { status: "idle", result: "", error: undefined, saved: false }));

    // Process with concurrency limit
    let index = 0;
    async function worker() {
      while (index < pending.length) {
        const item = pending[index++];
        await generateOne(item);
      }
    }
    const workers = Array.from({ length: Math.min(CONCURRENCY, pending.length) }, worker);
    await Promise.allSettled(workers);
    setRunning(false);
  }

  async function saveAsDraft(item: BatchItem) {
    if (contentType !== "blog") return;
    // Extract a title from the first line or use the topic
    const titleMatch = item.result.match(/<h1[^>]*>(.*?)<\/h1>/i) || item.result.match(/<h2[^>]*>(.*?)<\/h2>/i);
    const title = titleMatch ? titleMatch[1].replace(/<[^>]+>/g, "") : item.topic;
    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 80);

    try {
      const res = await fetch("/api/blog", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          slug: `${slug}-${Date.now()}`,
          title,
          description: item.topic,
          sections: [{ heading: "Draft", body: item.result }],
          published: false,
        }),
      });
      if (res.ok) updateItem(item.id, { saved: true });
    } catch {
      // Silently fail — user can copy manually
    }
  }

  async function copyResult(item: BatchItem) {
    await navigator.clipboard.writeText(item.result).catch(() => {});
    updateItem(item.id, { copied: true });
    setTimeout(() => updateItem(item.id, { copied: false }), 2000);
  }

  const filledItems = items.filter((it) => it.topic.trim());
  const doneCount = items.filter((it) => it.status === "done").length;
  const generatingCount = items.filter((it) => it.status === "generating").length;

  return (
    <div className="max-w-4xl mx-auto px-4 md:px-8 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-semibold text-neutral-900">Batch Generate</h1>
          <p className="text-sm text-neutral-500 mt-0.5">Generate multiple pieces of content at once</p>
        </div>
        <div className="flex items-center gap-2">
          {running && (
            <span className="text-sm text-teal-600 animate-pulse">
              {generatingCount > 0 ? `Generating ${generatingCount}…` : "Processing…"}
            </span>
          )}
          {!running && doneCount > 0 && (
            <span className="text-sm text-teal-600">{doneCount} done</span>
          )}
          <button
            onClick={runAll}
            disabled={running || filledItems.length === 0}
            className="flex items-center gap-2 px-4 py-2 bg-teal-600 text-white text-sm rounded-lg hover:bg-teal-700 disabled:opacity-50 transition-colors"
          >
            {running ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
            {running ? "Running…" : `Generate All (${filledItems.length})`}
          </button>
        </div>
      </div>

      {/* Config bar */}
      <div className="bg-white border border-neutral-200 rounded-xl p-4 mb-4 flex flex-wrap items-end gap-4">
        <div>
          <label className="block text-xs font-medium text-neutral-500 mb-1">Content type</label>
          <select
            value={contentType}
            onChange={(e) => setContentType(e.target.value as ContentType)}
            className="px-3 py-2 text-sm border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white"
          >
            {CONTENT_TYPES.map((ct) => (
              <option key={ct.value} value={ct.value}>{ct.label}</option>
            ))}
          </select>
        </div>
        {providers.length > 1 && (
          <div>
            <label className="block text-xs font-medium text-neutral-500 mb-1">Model</label>
            <div className="relative">
              <select
                value={selectedProvider}
                onChange={(e) => setSelectedProvider(e.target.value)}
                className="appearance-none px-3 py-2 pr-7 text-sm border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white"
              >
                {providers.map((p) => (
                  <option key={p.id} value={p.id}>{p.label.split(" (")[0]}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-neutral-400 pointer-events-none" />
            </div>
          </div>
        )}
        <div className="flex items-end gap-2 ml-auto">
          <button
            onClick={() => setShowBulk((v) => !v)}
            className="px-3 py-2 text-sm border border-neutral-300 rounded-lg text-neutral-600 hover:bg-neutral-50 transition-colors"
          >
            Paste topics
          </button>
          <button
            onClick={addRow}
            className="flex items-center gap-1.5 px-3 py-2 text-sm border border-neutral-300 rounded-lg text-neutral-600 hover:bg-neutral-50 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add row
          </button>
        </div>
      </div>

      {/* Bulk input */}
      {showBulk && (
        <div className="bg-white border border-teal-200 rounded-xl p-4 mb-4">
          <p className="text-xs text-neutral-500 mb-2">One topic per line — replaces current rows</p>
          <textarea
            value={bulkInput}
            onChange={(e) => setBulkInput(e.target.value)}
            rows={6}
            placeholder={"Natural GLP-1 activation explained\nHow Slim SHOT compares to Ozempic\nThe science behind nanoemulsion delivery\n..."}
            className="w-full px-3 py-2 text-sm border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 resize-none mb-2"
          />
          <div className="flex gap-2">
            <button onClick={applyBulk} className="px-4 py-2 bg-teal-600 text-white text-sm rounded-lg hover:bg-teal-700 transition-colors">
              Import {bulkInput.split("\n").filter((l) => l.trim()).length} topics
            </button>
            <button onClick={() => setShowBulk(false)} className="px-4 py-2 text-sm border border-neutral-200 rounded-lg text-neutral-600 hover:bg-neutral-50 transition-colors">
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Items */}
      <div className="space-y-3">
        {items.map((item, i) => (
          <div key={item.id} className="bg-white border border-neutral-200 rounded-xl overflow-hidden shadow-sm">
            {/* Topic row */}
            <div className="flex items-center gap-3 px-4 py-3 border-b border-neutral-100">
              <span className="text-xs font-medium text-neutral-400 w-5 text-right flex-shrink-0">{i + 1}</span>
              <input
                type="text"
                value={item.topic}
                onChange={(e) => updateItem(item.id, { topic: e.target.value, status: "idle", result: "", error: undefined })}
                placeholder="Topic or prompt…"
                disabled={item.status === "generating"}
                className="flex-1 text-sm border-0 outline-none text-neutral-800 placeholder:text-neutral-300 bg-transparent"
              />
              <div className="flex items-center gap-2 flex-shrink-0">
                {item.status === "generating" && (
                  <span className="flex items-center gap-1 text-xs text-teal-600 animate-pulse">
                    <RefreshCw className="w-3 h-3 animate-spin" />
                    Generating
                  </span>
                )}
                {item.status === "done" && (
                  <span className="text-xs text-teal-600 font-medium">Done</span>
                )}
                {item.status === "error" && (
                  <span className="text-xs text-red-500">Error</span>
                )}
                <button
                  onClick={() => generateOne(item)}
                  disabled={running || !item.topic.trim() || item.status === "generating"}
                  className="p-1.5 text-neutral-400 hover:text-teal-600 disabled:opacity-30 transition-colors"
                  title="Generate this item"
                >
                  <Play className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => removeRow(item.id)}
                  disabled={items.length === 1}
                  className="p-1.5 text-neutral-300 hover:text-red-400 disabled:opacity-20 transition-colors"
                  title="Remove"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Result */}
            {item.status === "generating" && !item.result && (
              <div className="px-4 py-4">
                <div className="space-y-2 animate-pulse">
                  <div className="h-3 bg-neutral-100 rounded w-3/4" />
                  <div className="h-3 bg-neutral-100 rounded w-full" />
                  <div className="h-3 bg-neutral-100 rounded w-5/6" />
                </div>
              </div>
            )}
            {item.result && (
              <div className="px-4 py-3">
                <div
                  className="text-sm text-neutral-700 prose prose-sm max-w-none prose-headings:text-neutral-800 prose-p:text-neutral-600 prose-p:my-1 leading-relaxed max-h-48 overflow-y-auto"
                  dangerouslySetInnerHTML={{ __html: item.result }}
                />
                <div className="flex items-center gap-2 mt-3 pt-3 border-t border-neutral-100">
                  <button
                    onClick={() => copyResult(item)}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs border border-neutral-200 rounded-lg text-neutral-600 hover:bg-neutral-50 transition-colors"
                  >
                    {item.copied ? <Check className="w-3.5 h-3.5 text-teal-500" /> : <Copy className="w-3.5 h-3.5" />}
                    {item.copied ? "Copied" : "Copy"}
                  </button>
                  {contentType === "blog" && (
                    <button
                      onClick={() => saveAsDraft(item)}
                      disabled={item.saved}
                      className="flex items-center gap-1.5 px-3 py-1.5 text-xs bg-teal-50 border border-teal-200 text-teal-700 rounded-lg hover:bg-teal-100 disabled:opacity-60 transition-colors"
                    >
                      {item.saved ? <Check className="w-3.5 h-3.5" /> : <Save className="w-3.5 h-3.5" />}
                      {item.saved ? "Saved as draft" : "Save as draft"}
                    </button>
                  )}
                  <button
                    onClick={() => generateOne(item)}
                    disabled={item.status === "generating"}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs border border-neutral-200 rounded-lg text-neutral-500 hover:bg-neutral-50 transition-colors ml-auto"
                  >
                    <RefreshCw className="w-3 h-3" />
                    Regenerate
                  </button>
                </div>
              </div>
            )}
            {item.status === "error" && (
              <div className="px-4 py-3 bg-red-50 border-t border-red-100">
                <p className="text-xs text-red-600">{item.error}</p>
                <button
                  onClick={() => generateOne(item)}
                  className="mt-2 text-xs text-red-500 hover:text-red-700 underline"
                >
                  Retry
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Footer add row */}
      <button
        onClick={addRow}
        className="mt-3 w-full py-3 border-2 border-dashed border-neutral-200 rounded-xl text-sm text-neutral-400 hover:border-teal-300 hover:text-teal-500 transition-colors"
      >
        + Add row
      </button>
    </div>
  );
}
