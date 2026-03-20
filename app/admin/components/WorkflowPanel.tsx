"use client";

import { useEffect, useState, useCallback } from "react";
import { Send, CheckCircle2, XCircle, Clock, ChevronDown } from "lucide-react";

interface WorkflowEntry {
  id: number;
  content_type: string;
  content_id: number;
  status: "draft" | "pending_review" | "approved" | "rejected" | "published";
  submitted_by: string | null;
  reviewed_by: string | null;
  review_note: string | null;
  submitted_at: string | null;
  reviewed_at: string | null;
  created_at: string;
}

interface WorkflowPanelProps {
  contentType: string;
  contentId: number | null;
  currentUserName: string;
  currentUserRole: "admin" | "editor" | "viewer";
  published: boolean;
  onPublish: () => void;
}

const STATUS_CONFIG = {
  draft: { label: "Draft", color: "text-neutral-600 bg-neutral-100", icon: Clock },
  pending_review: { label: "Pending Review", color: "text-amber-700 bg-amber-50", icon: Clock },
  approved: { label: "Approved", color: "text-indigo-700 bg-indigo-50", icon: CheckCircle2 },
  rejected: { label: "Needs Changes", color: "text-red-700 bg-red-50", icon: XCircle },
  published: { label: "Published", color: "text-indigo-700 bg-indigo-50", icon: CheckCircle2 },
};

export default function WorkflowPanel({
  contentType,
  contentId,
  currentUserName,
  currentUserRole,
  published,
  onPublish,
}: WorkflowPanelProps) {
  const [workflow, setWorkflow] = useState<WorkflowEntry | null>(null);
  const [history, setHistory] = useState<WorkflowEntry[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [note, setNote] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [loaded, setLoaded] = useState(false);

  const isAdmin = currentUserRole === "admin";

  const load = useCallback(async () => {
    if (!contentId) return;
    try {
      const res = await fetch(`/api/workflows?type=${contentType}&id=${contentId}`);
      const data = await res.json();
      setWorkflow(data);
      setLoaded(true);
    } catch {
      setLoaded(true);
    }
  }, [contentType, contentId]);

  useEffect(() => {
    load();
  }, [load]);

  const submitAction = async (status: string, reviewedBy?: string) => {
    if (!contentId) return;
    setSubmitting(true);
    try {
      await fetch("/api/workflows", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content_type: contentType,
          content_id: contentId,
          status,
          submitted_by: status === "pending_review" ? currentUserName : undefined,
          reviewed_by: reviewedBy,
          review_note: note || undefined,
        }),
      });
      setNote("");
      await load();

      // If approving + publishing, trigger the parent publish
      if (status === "published") {
        onPublish();
      }
    } catch {
      // ignore
    }
    setSubmitting(false);
  };

  const formatDate = (d?: string | null) => {
    if (!d) return "";
    return new Date(d).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  };

  const currentStatus = workflow?.status || (published ? "published" : "draft");
  const config = STATUS_CONFIG[currentStatus as keyof typeof STATUS_CONFIG] || STATUS_CONFIG.draft;
  const StatusIcon = config.icon;

  if (!loaded && !contentId) return null;

  return (
    <div className="bg-white border border-neutral-200 rounded-lg shadow-sm overflow-hidden">
      <div className="px-4 py-3 border-b border-neutral-100">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-neutral-400 mb-2">
          Workflow
        </p>
        <div className="flex items-center gap-2">
          <StatusIcon className="w-4 h-4 flex-shrink-0" />
          <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${config.color}`}>
            {config.label}
          </span>
        </div>

        {/* Show reviewer info */}
        {workflow?.reviewed_by && (workflow.status === "approved" || workflow.status === "rejected") && (
          <p className="text-[11px] text-neutral-500 mt-2">
            {workflow.status === "approved" ? "Approved" : "Rejected"} by{" "}
            <span className="font-medium text-neutral-700">{workflow.reviewed_by}</span>
            {workflow.reviewed_at && <span> on {formatDate(workflow.reviewed_at)}</span>}
          </p>
        )}

        {workflow?.submitted_by && workflow.status === "pending_review" && (
          <p className="text-[11px] text-neutral-500 mt-2">
            Submitted by{" "}
            <span className="font-medium text-neutral-700">{workflow.submitted_by}</span>
            {workflow.submitted_at && <span> on {formatDate(workflow.submitted_at)}</span>}
          </p>
        )}

        {/* Rejection note */}
        {workflow?.review_note && workflow.status === "rejected" && (
          <div className="mt-2 px-2.5 py-2 bg-red-50 border border-red-100 rounded-lg">
            <p className="text-[11px] text-red-700">{workflow.review_note}</p>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="px-4 py-3 space-y-2">
        {/* Editor: Submit for review */}
        {(currentStatus === "draft" || currentStatus === "rejected") && (
          <button
            onClick={() => submitAction("pending_review")}
            disabled={submitting || !contentId}
            className="w-full flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-medium bg-amber-50 text-amber-700 rounded-lg hover:bg-amber-100 transition disabled:opacity-50"
          >
            <Send className="w-3.5 h-3.5" />
            {submitting ? "Submitting..." : "Submit for Review"}
          </button>
        )}

        {/* Admin: Approve + Publish */}
        {currentStatus === "pending_review" && isAdmin && (
          <>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Review note (optional)"
              rows={2}
              className="w-full px-2.5 py-1.5 text-xs border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
            />
            <div className="flex gap-2">
              <button
                onClick={() => submitAction("approved", currentUserName)}
                disabled={submitting}
                className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-medium bg-indigo-50 text-indigo-700 rounded-lg hover:bg-indigo-100 transition disabled:opacity-50"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                Approve
              </button>
              <button
                onClick={() => submitAction("rejected", currentUserName)}
                disabled={submitting}
                className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-medium bg-red-50 text-red-700 rounded-lg hover:bg-red-100 transition disabled:opacity-50"
              >
                <XCircle className="w-3.5 h-3.5" />
                Reject
              </button>
            </div>
          </>
        )}

        {/* Admin: Publish approved content */}
        {currentStatus === "approved" && isAdmin && (
          <button
            onClick={() => submitAction("published", currentUserName)}
            disabled={submitting}
            className="w-full flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-medium bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition disabled:opacity-50"
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            {submitting ? "Publishing..." : "Publish"}
          </button>
        )}

        {/* Admin bypass: direct publish from any state */}
        {isAdmin && currentStatus !== "published" && currentStatus !== "approved" && (
          <button
            onClick={() => submitAction("published", currentUserName)}
            disabled={submitting}
            className="w-full flex items-center justify-center gap-1.5 px-3 py-1.5 text-[11px] text-neutral-500 hover:text-neutral-700 transition disabled:opacity-50"
          >
            Skip review and publish
          </button>
        )}

        {/* Published state: allow unpublish */}
        {currentStatus === "published" && (
          <button
            onClick={() => submitAction("draft")}
            disabled={submitting}
            className="w-full flex items-center justify-center gap-1.5 px-3 py-1.5 text-[11px] text-neutral-500 hover:text-neutral-700 transition disabled:opacity-50"
          >
            Unpublish (return to draft)
          </button>
        )}
      </div>

      {/* History toggle */}
      {contentId && (
        <div className="border-t border-neutral-100">
          <button
            onClick={() => setShowHistory(!showHistory)}
            className="w-full flex items-center justify-between px-4 py-2.5 text-[10px] font-semibold uppercase tracking-widest text-neutral-400 hover:bg-neutral-50 transition"
          >
            Activity
            <ChevronDown
              className={`w-3 h-3 transition-transform ${showHistory ? "" : "-rotate-90"}`}
            />
          </button>
          {showHistory && <WorkflowHistory contentType={contentType} contentId={contentId} />}
        </div>
      )}
    </div>
  );
}

/* ── Inline activity log ── */

function WorkflowHistory({
  contentType,
  contentId,
}: {
  contentType: string;
  contentId: number;
}) {
  const [events, setEvents] = useState<WorkflowEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/workflows/history?type=${contentType}&id=${contentId}`)
      .then((r) => r.json())
      .then((data) => setEvents(Array.isArray(data) ? data : []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [contentType, contentId]);

  if (loading) return <p className="text-xs text-neutral-400 px-4 py-3">Loading...</p>;
  if (events.length === 0) return <p className="text-xs text-neutral-400 px-4 py-3">No activity yet.</p>;

  const statusLabel = (s: string) => {
    const map: Record<string, string> = {
      draft: "Returned to draft",
      pending_review: "Submitted for review",
      approved: "Approved",
      rejected: "Changes requested",
      published: "Published",
    };
    return map[s] || s;
  };

  const statusDot = (s: string) => {
    const map: Record<string, string> = {
      draft: "bg-neutral-300",
      pending_review: "bg-amber-400",
      approved: "bg-indigo-400",
      rejected: "bg-red-400",
      published: "bg-indigo-600",
    };
    return map[s] || "bg-neutral-300";
  };

  return (
    <div className="max-h-48 overflow-y-auto px-4 pb-3">
      <div className="relative ml-1.5 border-l border-neutral-200 space-y-3 pl-4">
        {events.map((ev) => (
          <div key={ev.id} className="relative">
            <div
              className={`absolute -left-[21px] top-1 w-2 h-2 rounded-full ${statusDot(ev.status)}`}
            />
            <p className="text-[11px] font-medium text-neutral-700">
              {statusLabel(ev.status)}
            </p>
            <p className="text-[10px] text-neutral-400">
              {ev.submitted_by || ev.reviewed_by || "System"}
              {" · "}
              {new Date(ev.created_at).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                hour: "numeric",
                minute: "2-digit",
              })}
            </p>
            {ev.review_note && (
              <p className="text-[10px] text-neutral-500 mt-0.5 italic">
                &ldquo;{ev.review_note}&rdquo;
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
