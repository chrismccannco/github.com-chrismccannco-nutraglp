"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  Plus, Trash2, ChevronLeft, Save, Wand2, Copy, Check,
  ChevronDown, ChevronUp, Mail, Clock, RefreshCw
} from "lucide-react";
import { useAIProviders } from "../../hooks/useAIProviders";

interface Step {
  id?: number;
  step_number: number;
  delay_days: number;
  subject: string;
  preheader: string;
  body: string;
  _dirty?: boolean;
  _saving?: boolean;
  _generating?: boolean;
  _copied?: boolean;
}

interface Sequence {
  id: number;
  name: string;
  description: string;
  trigger_event: string;
  status: string;
}

const TRIGGERS = [
  { value: "manual", label: "Manual" },
  { value: "waitlist_signup", label: "Waitlist signup" },
  { value: "purchase", label: "Purchase" },
  { value: "trial_start", label: "Trial start" },
  { value: "re_engagement", label: "Re-engagement" },
];

const STATUSES = ["draft", "active", "paused", "archived"];

function uid() { return Math.random().toString(36).slice(2); }

function dayLabel(days: number) {
  if (days === 0) return "Immediately";
  if (days === 1) return "Day 1";
  return `Day ${days}`;
}

export default function SequenceEditorPage() {
  const params = useParams();
  const router = useRouter();
  const isNew = params.id === "new";
  const { providers, selectedProvider, setSelectedProvider, providerOverride } = useAIProviders();

  const [sequence, setSequence] = useState<Sequence>({
    id: 0, name: "", description: "", trigger_event: "manual", status: "draft",
  });
  const [steps, setSteps] = useState<Step[]>([]);
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [expandedStep, setExpandedStep] = useState<number | null>(0);

  useEffect(() => {
    if (isNew) return;
    fetch(`/api/email-sequences/${params.id}`)
      .then((r) => r.json())
      .then((d) => {
        setSequence(d.sequence);
        setSteps((d.steps ?? []).map((s: Step) => ({ ...s, _dirty: false })));
        if (d.steps?.length > 0) setExpandedStep(0);
      })
      .finally(() => setLoading(false));
  }, [isNew, params.id]);

  function updateStep(idx: number, patch: Partial<Step>) {
    setSteps((prev) => prev.map((s, i) => i === idx ? { ...s, ...patch, _dirty: true } : s));
  }

  function addStep() {
    const maxDelay = steps.length > 0 ? Math.max(...steps.map((s) => s.delay_days)) : -3;
    const newStep: Step = {
      step_number: steps.length + 1,
      delay_days: maxDelay + 3,
      subject: "",
      preheader: "",
      body: "",
      _dirty: true,
    };
    setSteps((prev) => [...prev, newStep]);
    setExpandedStep(steps.length);
  }

  function removeStep(idx: number) {
    setSteps((prev) => {
      const next = prev.filter((_, i) => i !== idx).map((s, i) => ({ ...s, step_number: i + 1 }));
      return next;
    });
    setExpandedStep(null);
  }

  async function saveAll() {
    setSaving(true);
    try {
      let seqId = sequence.id;

      if (isNew) {
        if (!sequence.name.trim()) { setSaving(false); return; }
        const res = await fetch("/api/email-sequences", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: sequence.name, description: sequence.description, trigger_event: sequence.trigger_event }),
        });
        const data = await res.json();
        seqId = data.sequence.id;
        setSequence((s) => ({ ...s, id: seqId }));
      } else {
        await fetch(`/api/email-sequences/${seqId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: sequence.name, description: sequence.description, trigger_event: sequence.trigger_event, status: sequence.status }),
        });
      }

      // Save dirty or new steps
      const updatedSteps: Step[] = [];
      for (const step of steps) {
        if (!step._dirty && step.id) { updatedSteps.push(step); continue; }
        if (!step.subject.trim() || !step.body.trim()) { updatedSteps.push(step); continue; }

        if (step.id) {
          await fetch(`/api/email-sequences/${seqId}/steps/${step.id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ step_number: step.step_number, delay_days: step.delay_days, subject: step.subject, preheader: step.preheader, body: step.body }),
          });
          updatedSteps.push({ ...step, _dirty: false });
        } else {
          const res = await fetch(`/api/email-sequences/${seqId}/steps`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ step_number: step.step_number, delay_days: step.delay_days, subject: step.subject, preheader: step.preheader, body: step.body }),
          });
          const data = await res.json();
          updatedSteps.push({ ...step, id: data.step?.id, _dirty: false });
        }
      }
      setSteps(updatedSteps);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
      if (isNew && seqId) router.replace(`/admin/email-sequences/${seqId}`);
    } finally {
      setSaving(false);
    }
  }

  async function deleteStep(idx: number) {
    const step = steps[idx];
    if (step.id) {
      await fetch(`/api/email-sequences/${sequence.id}/steps/${step.id}`, { method: "DELETE" });
    }
    removeStep(idx);
  }

  async function generateStep(idx: number) {
    const step = steps[idx];
    updateStep(idx, { _generating: true });
    try {
      const prompt = `Write a marketing email sequence step.
Sequence: ${sequence.name}
Trigger: ${sequence.trigger_event}
Step ${step.step_number} of ${steps.length} — sent ${dayLabel(step.delay_days)} after signup
${step.subject ? `Draft subject: ${step.subject}` : ""}

Write:
Subject: [subject line — personal, specific, no promotional language]
Preheader: [25-40 chars, complements subject]
Body:
[3 short paragraphs. Honest tone. No exclamation marks. No "We're thrilled". Short sentences. Human.]

Return as labeled sections only.`;

      const res = await fetch("/api/ai-assist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contentType: "email", prompt, providerOverride }),
      });

      if (!res.ok) throw new Error("Generation failed");

      const reader = res.body?.getReader();
      const decoder = new TextDecoder();
      let full = "";
      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          const chunk = decoder.decode(value);
          for (const line of chunk.split("\n")) {
            if (line.startsWith("data: ")) {
              const data = line.slice(6).trim();
              if (data === "[DONE]") break;
              try {
                const parsed = JSON.parse(data);
                if (parsed.text) full += parsed.text;
                else if (parsed.result) full = parsed.result;
              } catch { /* skip */ }
            }
          }
        }
      }

      // Parse the labeled sections
      const subjectMatch = full.match(/Subject:\s*(.+)/i);
      const preheaderMatch = full.match(/Preheader:\s*(.+)/i);
      const bodyMatch = full.match(/Body:\n([\s\S]+)/i);

      updateStep(idx, {
        subject: subjectMatch ? subjectMatch[1].trim() : step.subject,
        preheader: preheaderMatch ? preheaderMatch[1].trim() : step.preheader,
        body: bodyMatch ? bodyMatch[1].trim() : full,
        _generating: false,
        _dirty: true,
      });
    } catch {
      updateStep(idx, { _generating: false });
    }
  }

  async function copyStep(idx: number) {
    const step = steps[idx];
    const text = `Subject: ${step.subject}\nPreheader: ${step.preheader}\n\n${step.body}`;
    await navigator.clipboard.writeText(text).catch(() => {});
    updateStep(idx, { _copied: true });
    setTimeout(() => updateStep(idx, { _copied: false }), 2000);
  }

  if (loading) return <div className="p-8 text-sm text-neutral-400">Loading…</div>;

  return (
    <div className="max-w-3xl mx-auto px-4 md:px-8 py-8">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <Link href="/admin/email-sequences" className="p-1.5 text-neutral-400 hover:text-neutral-600 rounded-lg hover:bg-neutral-100 transition-colors no-underline">
          <ChevronLeft className="w-4 h-4" />
        </Link>
        <div className="flex-1 min-w-0">
          <input
            type="text"
            value={sequence.name}
            onChange={(e) => setSequence((s) => ({ ...s, name: e.target.value }))}
            placeholder="Sequence name…"
            className="w-full text-lg font-semibold text-neutral-900 border-0 outline-none bg-transparent placeholder:text-neutral-300"
          />
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          {providers.length > 1 && (
            <div className="relative">
              <select
                value={selectedProvider}
                onChange={(e) => setSelectedProvider(e.target.value)}
                className="appearance-none text-xs text-neutral-600 bg-white border border-neutral-200 rounded-lg pl-2 pr-6 py-1.5 focus:outline-none"
              >
                {providers.map((p) => <option key={p.id} value={p.id}>{p.label.split(" (")[0]}</option>)}
              </select>
              <ChevronDown className="absolute right-1.5 top-1/2 -translate-y-1/2 w-3 h-3 text-neutral-400 pointer-events-none" />
            </div>
          )}
          <button
            onClick={saveAll}
            disabled={saving}
            className="flex items-center gap-1.5 px-4 py-2 bg-teal-600 text-white text-sm rounded-lg hover:bg-teal-700 disabled:opacity-50 transition-colors"
          >
            {saving ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : saved ? <Check className="w-3.5 h-3.5" /> : <Save className="w-3.5 h-3.5" />}
            {saving ? "Saving…" : saved ? "Saved" : "Save"}
          </button>
        </div>
      </div>

      {/* Sequence meta */}
      <div className="bg-white border border-neutral-200 rounded-xl p-4 mb-6 shadow-sm grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div>
          <label className="block text-[10px] font-medium text-neutral-400 uppercase tracking-wide mb-1">Trigger</label>
          <select
            value={sequence.trigger_event}
            onChange={(e) => setSequence((s) => ({ ...s, trigger_event: e.target.value }))}
            className="w-full px-2.5 py-1.5 text-sm border border-neutral-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-teal-400 bg-white"
          >
            {TRIGGERS.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-[10px] font-medium text-neutral-400 uppercase tracking-wide mb-1">Status</label>
          <select
            value={sequence.status}
            onChange={(e) => setSequence((s) => ({ ...s, status: e.target.value }))}
            className="w-full px-2.5 py-1.5 text-sm border border-neutral-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-teal-400 bg-white"
          >
            {STATUSES.map((st) => <option key={st} value={st}>{st}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-[10px] font-medium text-neutral-400 uppercase tracking-wide mb-1">Description</label>
          <input
            type="text"
            value={sequence.description}
            onChange={(e) => setSequence((s) => ({ ...s, description: e.target.value }))}
            placeholder="Optional note…"
            className="w-full px-2.5 py-1.5 text-sm border border-neutral-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-teal-400"
          />
        </div>
      </div>

      {/* Steps */}
      <div className="space-y-3 mb-4">
        {steps.map((step, idx) => {
          const isExpanded = expandedStep === idx;
          return (
            <div key={idx} className={`bg-white border rounded-xl shadow-sm transition-colors ${step._dirty ? "border-teal-200" : "border-neutral-200"}`}>
              {/* Step header */}
              <button
                type="button"
                onClick={() => setExpandedStep(isExpanded ? null : idx)}
                className="w-full flex items-center gap-3 px-4 py-3 text-left"
              >
                <div className="w-7 h-7 rounded-full bg-teal-100 flex items-center justify-center flex-shrink-0">
                  <span className="text-xs font-semibold text-teal-700">{step.step_number}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-neutral-800 truncate">
                      {step.subject || <span className="text-neutral-300">No subject yet</span>}
                    </span>
                    {step._dirty && <span className="w-1.5 h-1.5 rounded-full bg-teal-400 flex-shrink-0" />}
                  </div>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <Clock className="w-3 h-3 text-neutral-300" />
                    <span className="text-[11px] text-neutral-400">{dayLabel(step.delay_days)}</span>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 flex-shrink-0">
                  {isExpanded ? <ChevronUp className="w-4 h-4 text-neutral-400" /> : <ChevronDown className="w-4 h-4 text-neutral-400" />}
                </div>
              </button>

              {/* Step body */}
              {isExpanded && (
                <div className="px-4 pb-4 border-t border-neutral-100 pt-4 space-y-3">
                  {/* Delay */}
                  <div className="flex items-center gap-3">
                    <label className="text-xs font-medium text-neutral-500 w-20 flex-shrink-0">Send after</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        min={0}
                        value={step.delay_days}
                        onChange={(e) => updateStep(idx, { delay_days: parseInt(e.target.value) || 0 })}
                        className="w-16 px-2 py-1.5 text-sm border border-neutral-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-teal-400 text-center"
                      />
                      <span className="text-sm text-neutral-500">days</span>
                    </div>
                  </div>

                  {/* Subject */}
                  <div>
                    <label className="block text-xs font-medium text-neutral-500 mb-1">Subject line</label>
                    <input
                      type="text"
                      value={step.subject}
                      onChange={(e) => updateStep(idx, { subject: e.target.value })}
                      placeholder="Email subject…"
                      className="w-full px-3 py-2 text-sm border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-400"
                    />
                  </div>

                  {/* Preheader */}
                  <div>
                    <label className="block text-xs font-medium text-neutral-500 mb-1">Preheader</label>
                    <input
                      type="text"
                      value={step.preheader}
                      onChange={(e) => updateStep(idx, { preheader: e.target.value })}
                      placeholder="Preview text (35-50 chars)…"
                      className="w-full px-3 py-2 text-sm border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-400"
                    />
                    {step.preheader && (
                      <p className={`text-[10px] mt-0.5 ${step.preheader.length > 50 ? "text-amber-500" : "text-neutral-400"}`}>
                        {step.preheader.length} chars
                      </p>
                    )}
                  </div>

                  {/* Body */}
                  <div>
                    <label className="block text-xs font-medium text-neutral-500 mb-1">Body</label>
                    <textarea
                      value={step.body}
                      onChange={(e) => updateStep(idx, { body: e.target.value })}
                      placeholder="Email body…"
                      rows={8}
                      className="w-full px-3 py-2 text-sm border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-400 resize-y font-mono text-xs leading-relaxed"
                    />
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => generateStep(idx)}
                      disabled={step._generating}
                      className="flex items-center gap-1.5 px-3 py-1.5 text-xs bg-teal-50 border border-teal-200 text-teal-700 rounded-lg hover:bg-teal-100 disabled:opacity-50 transition-colors"
                    >
                      {step._generating ? <RefreshCw className="w-3 h-3 animate-spin" /> : <Wand2 className="w-3 h-3" />}
                      {step._generating ? "Writing…" : "Draft with AI"}
                    </button>
                    <button
                      type="button"
                      onClick={() => copyStep(idx)}
                      className="flex items-center gap-1.5 px-3 py-1.5 text-xs border border-neutral-200 text-neutral-600 rounded-lg hover:bg-neutral-50 transition-colors"
                    >
                      {step._copied ? <Check className="w-3 h-3 text-teal-500" /> : <Copy className="w-3 h-3" />}
                      {step._copied ? "Copied" : "Copy"}
                    </button>
                    <button
                      type="button"
                      onClick={() => deleteStep(idx)}
                      className="ml-auto flex items-center gap-1 px-2.5 py-1.5 text-xs text-neutral-400 hover:text-red-400 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-3 h-3" />
                      Remove
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Add step */}
      <button
        onClick={addStep}
        className="w-full py-3 border-2 border-dashed border-neutral-200 rounded-xl text-sm text-neutral-400 hover:border-teal-300 hover:text-teal-500 transition-colors flex items-center justify-center gap-2"
      >
        <Plus className="w-4 h-4" />
        Add step
      </button>

      {/* Timeline preview */}
      {steps.length > 1 && (
        <div className="mt-6 bg-white border border-neutral-200 rounded-xl p-4 shadow-sm">
          <h3 className="text-xs font-semibold text-neutral-500 uppercase tracking-wide mb-3">Timeline</h3>
          <div className="flex items-center gap-0">
            {steps.map((step, idx) => (
              <div key={idx} className="flex items-center">
                <div className="flex flex-col items-center">
                  <div className="w-7 h-7 rounded-full bg-teal-100 border-2 border-teal-300 flex items-center justify-center">
                    <span className="text-[10px] font-bold text-teal-700">{step.step_number}</span>
                  </div>
                  <span className="text-[9px] text-neutral-400 mt-1 text-center w-12 truncate">{dayLabel(step.delay_days)}</span>
                </div>
                {idx < steps.length - 1 && (
                  <div className="flex flex-col items-center mx-1">
                    <div className="h-0.5 w-8 bg-neutral-200 mt-3.5" />
                    <span className="text-[9px] text-neutral-300 mt-1">
                      +{steps[idx + 1].delay_days - step.delay_days}d
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
