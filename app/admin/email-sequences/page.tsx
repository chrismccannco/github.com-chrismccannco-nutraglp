"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, Mail, Trash2, ChevronRight, CheckCircle, Circle } from "lucide-react";

interface Sequence {
  id: number;
  name: string;
  description: string;
  trigger_event: string;
  status: string;
  step_count: number;
  updated_at: string;
}

const TRIGGER_LABELS: Record<string, string> = {
  manual: "Manual",
  waitlist_signup: "Waitlist signup",
  purchase: "Purchase",
  trial_start: "Trial start",
  re_engagement: "Re-engagement",
};

const STATUS_COLORS: Record<string, string> = {
  draft: "bg-neutral-100 text-neutral-500",
  active: "bg-teal-100 text-teal-700",
  paused: "bg-amber-100 text-amber-700",
  archived: "bg-red-100 text-red-500",
};

export default function EmailSequencesPage() {
  const [sequences, setSequences] = useState<Sequence[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/email-sequences")
      .then((r) => r.json())
      .then((d) => setSequences(d.sequences ?? []))
      .finally(() => setLoading(false));
  }, []);

  async function handleDelete(id: number, name: string) {
    if (!confirm(`Delete "${name}"? This cannot be undone.`)) return;
    await fetch(`/api/email-sequences/${id}`, { method: "DELETE" });
    setSequences((prev) => prev.filter((s) => s.id !== id));
  }

  return (
    <div className="max-w-4xl mx-auto px-4 md:px-8 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-semibold text-neutral-900">Email Sequences</h1>
          <p className="text-sm text-neutral-500 mt-0.5">Multi-step drip campaigns</p>
        </div>
        <Link
          href="/admin/email-sequences/new"
          className="flex items-center gap-1.5 px-3 py-2 bg-teal-600 text-white text-sm rounded-lg hover:bg-teal-700 transition-colors no-underline"
        >
          <Plus className="w-4 h-4" />
          New sequence
        </Link>
      </div>

      {loading && (
        <div className="text-sm text-neutral-400 py-12 text-center">Loading…</div>
      )}

      {!loading && sequences.length === 0 && (
        <div className="bg-white border border-neutral-200 rounded-xl p-12 text-center shadow-sm">
          <Mail className="w-8 h-8 text-neutral-300 mx-auto mb-3" />
          <p className="text-sm text-neutral-500 mb-4">No sequences yet.</p>
          <Link
            href="/admin/email-sequences/new"
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-teal-600 text-white text-sm rounded-lg hover:bg-teal-700 transition-colors no-underline"
          >
            <Plus className="w-4 h-4" />
            Create your first sequence
          </Link>
        </div>
      )}

      <div className="space-y-3">
        {sequences.map((seq) => (
          <div
            key={seq.id}
            className="bg-white border border-neutral-200 rounded-xl shadow-sm hover:border-teal-200 transition-colors group"
          >
            <Link
              href={`/admin/email-sequences/${seq.id}`}
              className="flex items-center gap-4 px-5 py-4 no-underline"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-semibold text-neutral-800 truncate">{seq.name}</span>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium flex-shrink-0 ${STATUS_COLORS[seq.status] ?? STATUS_COLORS.draft}`}>
                    {seq.status}
                  </span>
                </div>
                {seq.description && (
                  <p className="text-xs text-neutral-500 truncate mb-1">{seq.description}</p>
                )}
                <div className="flex items-center gap-3 text-[11px] text-neutral-400">
                  <span>{seq.step_count} {Number(seq.step_count) === 1 ? "step" : "steps"}</span>
                  <span>·</span>
                  <span>{TRIGGER_LABELS[seq.trigger_event] ?? seq.trigger_event}</span>
                  <span>·</span>
                  <span>Updated {new Date(seq.updated_at).toLocaleDateString("en-US", { month: "short", day: "numeric" })}</span>
                </div>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                {/* Step dots */}
                <div className="hidden sm:flex items-center gap-1">
                  {Array.from({ length: Math.min(Number(seq.step_count), 6) }).map((_, i) => (
                    <div key={i} className="w-1.5 h-1.5 rounded-full bg-teal-400" />
                  ))}
                  {Number(seq.step_count) > 6 && (
                    <span className="text-[10px] text-neutral-400">+{Number(seq.step_count) - 6}</span>
                  )}
                </div>
                <ChevronRight className="w-4 h-4 text-neutral-300 group-hover:text-teal-400 transition-colors" />
              </div>
            </Link>
            <div className="flex items-center justify-end px-5 pb-3 -mt-2">
              <button
                onClick={() => handleDelete(seq.id, seq.name)}
                className="text-[11px] text-neutral-300 hover:text-red-400 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
