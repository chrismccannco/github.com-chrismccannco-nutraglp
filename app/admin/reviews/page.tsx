"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { CheckCircle2, XCircle, Clock, FileText, BookOpen } from "lucide-react";
import { useAuth } from "../layout";

interface WorkflowItem {
  id: number;
  content_type: string;
  content_id: number;
  status: string;
  submitted_by: string | null;
  reviewed_by: string | null;
  review_note: string | null;
  submitted_at: string | null;
  reviewed_at: string | null;
  created_at: string;
  content_title: string;
  content_slug: string;
}

type Tab = "pending" | "approved" | "rejected" | "all";

export default function ReviewsPage() {
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";
  const [items, setItems] = useState<WorkflowItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<Tab>("pending");
  const [actionLoading, setActionLoading] = useState<number | null>(null);

  const load = (status?: string) => {
    setLoading(true);
    const url = status
      ? `/api/workflows?status=${status}`
      : `/api/workflows?limit=100`;
    fetch(url)
      .then((r) => r.json())
      .then((data) => {
        // Deduplicate: keep only the latest entry per content_type+content_id
        if (!status) {
          const seen = new Map<string, WorkflowItem>();
          for (const item of data) {
            const key = `${item.content_type}:${item.content_id}`;
            if (!seen.has(key)) seen.set(key, item);
          }
          setItems(Array.from(seen.values()));
        } else {
          setItems(Array.isArray(data) ? data : []);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    if (tab === "pending") load("pending_review");
    else if (tab === "approved") load("approved");
    else if (tab === "rejected") load("rejected");
    else load();
  }, [tab]);

  const submitAction = async (item: WorkflowItem, status: string) => {
    setActionLoading(item.id);
    try {
      await fetch("/api/workflows", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content_type: item.content_type,
          content_id: item.content_id,
          status,
          reviewed_by: user?.name || user?.email,
        }),
      });
      // Refresh
      if (tab === "pending") load("pending_review");
      else if (tab === "approved") load("approved");
      else if (tab === "rejected") load("rejected");
      else load();
    } catch {
      // ignore
    }
    setActionLoading(null);
  };

  const getEditUrl = (item: WorkflowItem) => {
    if (item.content_type === "page") return `/admin/pages/${item.content_slug}`;
    if (item.content_type === "blog_post") return `/admin/blog/${item.content_slug}`;
    return "#";
  };

  const ContentIcon = ({ type }: { type: string }) => {
    if (type === "blog_post") return <BookOpen className="w-4 h-4 text-blue-500" />;
    return <FileText className="w-4 h-4 text-neutral-500" />;
  };

  const formatDate = (d: string | null) => {
    if (!d) return "";
    return new Date(d).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  };

  const tabs: { key: Tab; label: string; count?: number }[] = [
    { key: "pending", label: "Pending Review" },
    { key: "approved", label: "Approved" },
    { key: "rejected", label: "Needs Changes" },
    { key: "all", label: "All Activity" },
  ];

  return (
    <div className="max-w-4xl">
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-neutral-900">Reviews</h1>
        <p className="text-sm text-neutral-500 mt-1">
          Content approval workflow
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-6 bg-neutral-100 p-1 rounded-lg w-fit">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition ${
              tab === t.key
                ? "bg-white text-neutral-900 shadow-sm"
                : "text-neutral-500 hover:text-neutral-700"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* List */}
      {loading ? (
        <p className="text-sm text-neutral-400 py-12 text-center">Loading...</p>
      ) : items.length === 0 ? (
        <div className="text-center py-16 bg-white border border-neutral-200 rounded-xl">
          <Clock className="w-8 h-8 text-neutral-300 mx-auto mb-3" />
          <p className="text-sm text-neutral-500">
            {tab === "pending"
              ? "No items pending review."
              : tab === "approved"
                ? "No approved items awaiting publish."
                : tab === "rejected"
                  ? "No rejected items."
                  : "No workflow activity yet."}
          </p>
        </div>
      ) : (
        <div className="bg-white border border-neutral-200 rounded-xl divide-y divide-neutral-100 overflow-hidden">
          {items.map((item) => (
            <div key={item.id} className="px-5 py-4 flex items-center gap-4">
              {/* Icon + title */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <ContentIcon type={item.content_type} />
                  <Link
                    href={getEditUrl(item)}
                    className="text-sm font-medium text-neutral-900 hover:text-teal-700 no-underline truncate"
                  >
                    {item.content_title || "Untitled"}
                  </Link>
                  <span className="text-[10px] text-neutral-400 px-1.5 py-0.5 bg-neutral-100 rounded-full">
                    {item.content_type === "blog_post" ? "Blog" : "Page"}
                  </span>
                </div>
                <p className="text-xs text-neutral-500 mt-1">
                  {item.submitted_by && (
                    <span>
                      Submitted by <span className="font-medium text-neutral-700">{item.submitted_by}</span>
                    </span>
                  )}
                  {item.reviewed_by && (
                    <span>
                      Reviewed by <span className="font-medium text-neutral-700">{item.reviewed_by}</span>
                    </span>
                  )}
                  {(item.submitted_at || item.reviewed_at || item.created_at) && (
                    <span className="text-neutral-400">
                      {" · "}
                      {formatDate(item.submitted_at || item.reviewed_at || item.created_at)}
                    </span>
                  )}
                </p>
                {item.review_note && item.status === "rejected" && (
                  <p className="text-xs text-red-600 mt-1 italic">
                    &ldquo;{item.review_note}&rdquo;
                  </p>
                )}
              </div>

              {/* Actions */}
              {tab === "pending" && isAdmin && (
                <div className="flex items-center gap-2 flex-shrink-0">
                  <Link
                    href={getEditUrl(item)}
                    className="px-3 py-1.5 text-xs text-neutral-600 border border-neutral-200 rounded-lg hover:bg-neutral-50 transition no-underline"
                  >
                    Review
                  </Link>
                  <button
                    onClick={() => submitAction(item, "approved")}
                    disabled={actionLoading === item.id}
                    className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium bg-teal-50 text-teal-700 rounded-lg hover:bg-teal-100 transition disabled:opacity-50"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Approve
                  </button>
                  <button
                    onClick={() => submitAction(item, "rejected")}
                    disabled={actionLoading === item.id}
                    className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium bg-red-50 text-red-700 rounded-lg hover:bg-red-100 transition disabled:opacity-50"
                  >
                    <XCircle className="w-3.5 h-3.5" />
                    Reject
                  </button>
                </div>
              )}

              {tab === "approved" && isAdmin && (
                <div className="flex items-center gap-2 flex-shrink-0">
                  <button
                    onClick={() => submitAction(item, "published")}
                    disabled={actionLoading === item.id}
                    className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition disabled:opacity-50"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Publish
                  </button>
                </div>
              )}

              {(tab === "rejected" || tab === "all") && (
                <Link
                  href={getEditUrl(item)}
                  className="px-3 py-1.5 text-xs text-neutral-600 border border-neutral-200 rounded-lg hover:bg-neutral-50 transition no-underline flex-shrink-0"
                >
                  View
                </Link>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
