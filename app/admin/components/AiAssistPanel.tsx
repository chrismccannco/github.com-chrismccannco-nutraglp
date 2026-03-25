"use client";

import { useState, useEffect } from "react";
import { Wand2, Settings } from "lucide-react";
import Link from "next/link";

interface BrandVoice {
  id: number;
  name: string;
  is_default: number;
}

interface Persona {
  id: number;
  name: string;
  is_default: number;
}

export interface AiAssistResult {
  [key: string]: unknown;
}

interface AiAssistPanelProps {
  /** Content type for the AI endpoint: "blog", "page", "testimonial", "form" */
  contentType: string;
  /** Placeholder text for the prompt input */
  placeholder?: string;
  /** Label for the generate button */
  buttonLabel?: string;
  /** Callback with the AI response data */
  onResult: (data: AiAssistResult) => void;
  /** Optional existing content to send as context (for rewrites/expansions) */
  existingContent?: string;
  /** Show voice/persona selectors (default true) */
  showSelectors?: boolean;
  /** Compact mode for inline/modal use */
  compact?: boolean;
}

export default function AiAssistPanel({
  contentType,
  placeholder = "Describe what you want to create\u2026",
  buttonLabel = "Draft with AI",
  onResult,
  existingContent,
  showSelectors = true,
  compact = false,
}: AiAssistPanelProps) {
  const [prompt, setPrompt] = useState("");
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState("");
  const [noApiKey, setNoApiKey] = useState(false);
  const [voices, setVoices] = useState<BrandVoice[]>([]);
  const [personas, setPersonas] = useState<Persona[]>([]);
  const [voiceId, setVoiceId] = useState<number | null>(null);
  const [personaId, setPersonaId] = useState<number | null>(null);
  const [success, setSuccess] = useState("");
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!showSelectors) return;
    fetch("/api/brand-voices").then((r) => r.json()).then((d) => setVoices(Array.isArray(d) ? d : [])).catch(() => {});
    fetch("/api/personas").then((r) => r.json()).then((d) => setPersonas(Array.isArray(d) ? d : [])).catch(() => {});
  }, [showSelectors]);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setGenerating(true);
    setError("");
    setNoApiKey(false);
    setSuccess("");
    setProgress(0);
    try {
      const res = await fetch("/api/ai-assist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contentType,
          prompt: prompt.trim(),
          voiceId,
          personaId,
          existingContent: existingContent || undefined,
        }),
      });

      if (!res.ok) {
        // Non-streaming error (validation, missing key, etc.)
        let errMsg = "Generation failed";
        try {
          const errData = await res.json();
          if (errData.error === "NO_API_KEY") {
            setNoApiKey(true);
            setGenerating(false);
            return;
          }
          errMsg = errData.error || errMsg;
        } catch {
          errMsg = `Server error (${res.status})`;
        }
        throw new Error(errMsg);
      }

      // Read the SSE stream with proper line buffering
      const reader = res.body!.getReader();
      const decoder = new TextDecoder();
      let resultData: AiAssistResult | null = null;
      let streamError = "";
      let sseBuffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        sseBuffer += decoder.decode(value, { stream: true });
        const lines = sseBuffer.split("\n");
        sseBuffer = lines.pop() || "";

        for (const line of lines) {
          if (!line.startsWith("data: ")) continue;
          const payload = line.slice(6).trim();
          if (payload === "[DONE]") continue;

          try {
            const evt = JSON.parse(payload);
            if (evt.type === "progress") {
              setProgress(evt.len || 0);
            } else if (evt.type === "result_b64") {
              // Decode base64 with proper UTF-8 handling
              const bytes = Uint8Array.from(atob(evt.data), (c) => c.charCodeAt(0));
              const json = new TextDecoder().decode(bytes);
              resultData = JSON.parse(json);
            } else if (evt.type === "result") {
              resultData = evt.data;
            } else if (evt.type === "error") {
              streamError = evt.error || "Generation failed";
            }
          } catch {
            // skip non-JSON lines
          }
        }
      }

      if (streamError) {
        throw new Error(streamError);
      }
      if (!resultData) {
        throw new Error("No result received from AI");
      }

      onResult(resultData);
      setSuccess("Done. Fields populated below.");
      setTimeout(() => setSuccess(""), 4000);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setGenerating(false);
      setProgress(0);
    }
  };

  return (
    <div className={`bg-gradient-to-br from-violet-50 to-teal-50 border border-violet-200 rounded-xl ${compact ? "p-3" : "p-5"}`}>
      <div className="flex items-center gap-2 mb-3">
        <div className={`${compact ? "w-6 h-6" : "w-7 h-7"} rounded-lg bg-teal-600 flex items-center justify-center flex-shrink-0`}>
          <Wand2 className={`${compact ? "w-3 h-3" : "w-3.5 h-3.5"} text-white`} />
        </div>
        <div className="flex-1 min-w-0">
          <p className={`${compact ? "text-xs" : "text-sm"} font-semibold text-neutral-900`}>AI Assist</p>
          {!compact && (
            <p className="text-[11px] text-neutral-500">
              {existingContent ? "Describe how to improve the existing content" : "Describe what you want to create"}
            </p>
          )}
        </div>
        <div className="flex items-center gap-1.5 flex-shrink-0">
          {providers.length > 1 && (
            <div className="relative">
              <select
                value={selectedProvider}
                onChange={(e) => setSelectedProvider(e.target.value)}
                className="appearance-none text-[10px] font-medium text-neutral-600 bg-white border border-teal-200 rounded-md pl-2 pr-5 py-1 focus:outline-none focus:ring-1 focus:ring-teal-400 cursor-pointer"
              >
                {providers.map((p) => (
                  <option key={p.id} value={p.id}>{p.label.split(" (")[0]}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-1 top-1/2 -translate-y-1/2 w-2.5 h-2.5 text-neutral-400 pointer-events-none" />
            </div>
          )}
          <SavedPromptsDrawer
            onSelect={(p) => setPrompt(p)}
            currentPrompt={prompt}
          />
        </div>
      </div>

      <textarea
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder={placeholder}
        rows={compact ? 1 : 2}
        onKeyDown={(e) => { if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) handleGenerate(); }}
        className={`w-full px-3 ${compact ? "py-2" : "py-2.5"} border border-teal-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white placeholder:text-neutral-400 mb-3`}
      />

      <div className="flex items-end gap-3">
        {showSelectors && (
          <div className="flex-1 grid grid-cols-2 gap-2">
            <div>
              <label className="block text-[10px] font-medium text-neutral-500 mb-1">Voice</label>
              <select
                value={voiceId || ""}
                onChange={(e) => setVoiceId(e.target.value ? Number(e.target.value) : null)}
                className="w-full px-2 py-1.5 border border-teal-200 rounded-lg text-xs bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
              >
                <option value="">Default</option>
                {voices.map((v) => (
                  <option key={v.id} value={v.id}>{v.name}{v.is_default ? " (default)" : ""}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-[10px] font-medium text-neutral-500 mb-1">Persona</label>
              <select
                value={personaId || ""}
                onChange={(e) => setPersonaId(e.target.value ? Number(e.target.value) : null)}
                className="w-full px-2 py-1.5 border border-teal-200 rounded-lg text-xs bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
              >
                <option value="">Default</option>
                {personas.map((p) => (
                  <option key={p.id} value={p.id}>{p.name}{p.is_default ? " (default)" : ""}</option>
                ))}
              </select>
            </div>
          </div>
        )}
        <button
          onClick={handleGenerate}
          disabled={generating || !prompt.trim()}
          className="px-4 py-2 bg-teal-600 text-white text-sm font-medium rounded-lg hover:bg-teal-700 transition disabled:opacity-50 whitespace-nowrap flex items-center gap-2"
        >
          {generating ? (
            <>
              <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              {progress > 0 ? "Generating\u2026" : "Working\u2026"}
            </>
          ) : (
            <>
              <Wand2 className="w-3.5 h-3.5" />
              {buttonLabel}
            </>
          )}
        </button>
      </div>

      {noApiKey && (
        <div className="mt-2 px-3 py-2 bg-amber-50 border border-amber-200 rounded-lg flex items-start gap-2">
          <Settings className="w-3.5 h-3.5 text-amber-600 mt-0.5 flex-shrink-0" />
          <p className="text-xs text-amber-800">
            No AI key connected.{" "}
            <Link href="/admin/settings" className="font-medium underline hover:text-amber-900">
              Add yours in Settings → AI Integration
            </Link>
            {" "}to start generating.
          </p>
        </div>
      )}
      {error && <p className="mt-2 text-xs text-red-600">{error}</p>}
      {success && (
        <div className="mt-2 px-3 py-1.5 bg-white/80 rounded-lg border border-violet-100">
          <p className="text-xs text-teal-700 font-medium">{success}</p>
        </div>
      )}
    </div>
  );
}
