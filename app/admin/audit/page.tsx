"use client";

import { useEffect, useState, useCallback } from "react";
import Breadcrumbs from "../components/Breadcrumbs";
import { RefreshCw, Filter } from "lucide-react";

interface AuditEntry {
  id: number;
  user_id: number | null;
  user_email: string | null;
  action: string;
  entity_type: string;
  entity_id: string | null;
  entity_label: string | null;
  metadata: Record<string, unknown>;
  created_at: string;
}

const ACTION_COLORS: Record<string, string> = {
  created: "bg-blue-50 text-blue-700",
  updated: "bg-amber-50 text-amber-700",
  published: "bg-teal-50 text-teal-700",
  unpublished: "bg-neutral-100 text-neutral-600",
  deleted: "bg-red-50 text-red-700",
  restored: "bg-purple-50 text-purple-700",
  version_restored: "bg-purple-50 text-purple-700",
  api_key_created: "bg-blue-50 text-blue-700",
  api_key_revoked: "bg-red-50 text-red-700",
  setting_changed: "bg-neutral-100 text-neutral-600",
  media_uploaded: "bg-blue-50 text-blue-700",
  media_deleted: "bg-red-50 text-red-700",
  user_created: "bg-blue-50 text-blue-700",
  user_updated: "bg-amber-50 text-amber-700",
  user_deleted: "bg-red-50 text-red-700",
  login: "bg-teal-50 text-teal-700",
  logout: "bg-neutral-100 text-neutral-600",
};

const ENTITY_TYPE_LABELS: Record<string, string> = {
  page: "Page",
  blog_post: "Blog post",
  product: "Product",
  media: "Media",
  api_key: "API key",
  setting: "Setting",
  brand_voice: "Brand voice",
  persona: "Persona",
  webhook: "Webhook",
  user: "User",
  session: "Session",
};

const ALL_ENTITY_TYPES = Object.keys(ENTITY_TYPE_LABELS);
const ALL_ACTIONS = [
  "created", "updated", "published", "unpublished", "deleted", "restored",
  "version_restored", "media_uploaded", "media_deleted",
  "api_key_created", "api_key_revoked", "setting_changed",
  "user_created", "user_updated", "user_deleted", "login", "logout",
];

export default function AuditLogPage() {
  const [entries, setEntries] = useState<AuditEntry[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [offset, setOffset] = useState(0);
  const [entityTypeFilter, setEntityTypeFilter] = useState("");
  const [actionFilter, setActionFilter] = useState("");
  const [userFilter, setUserFilter] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const limit = 50;

  const load = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams({ limit: String(limit), offset: String(offset) });
    if (entityTypeFilter) params.set("entity_type", entityTypeFilter);
    if (actionFilter) params.set("action", actionFilter);
    if (userFilter) params.set("user_email", userFilter);
    const res = await fetch(`/api/audit?${params}`);
    const data = await res.json();
    setEntries(data.data || []);
    setTotal(data.total || 0);
    setLoading(false);
  }, [offset, entityTypeFilter, actionFilter]);

  useEffect(() => { load(); }, [load]);

  // Reset offset when filters change
  useEffect(() => { setOffset(0); }, [entityTypeFilter, actionFilter, userFilter]);

  const formatDate = (s: string) => {
    const d = new Date(s);
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric", hour: "numeric", minute: "2-digit" });
  };

  const timeAgo = (s: string) => {
    const ms = Date.now() - new Date(s).getTime();
    const mins = Math.floor(ms / 60000);
    if (mins < 1) return "just now";
    if (mins < 60) return `${mins}m ago`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    if (days < 30) return `${days}d ago`;
    return formatDate(s);
  };

  const hasFilters = entityTypeFilter || actionFilter || userFilter;

  return (
    <div className="max-w-4xl">
      <Breadcrumbs items={[{ label: "Admin", href: "/admin" }, { label: "Audit Log" }]} />

      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-semibold text-neutral-900">Audit Log</h1>
          <p className="text-xs text-neutral-400 mt-1">
            {total.toLocaleString()} event{total !== 1 ? "s" : ""} recorded
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-lg border transition ${
              hasFilters || showFilters
                ? "bg-teal-50 text-teal-700 border-teal-200"
                : "text-neutral-500 border-neutral-200 hover:bg-neutral-50"
            }`}
          >
            <Filter className="w-3.5 h-3.5" />
            Filter
            {hasFilters && <span className="w-1.5 h-1.5 rounded-full bg-teal-500" />}
          </button>
          <button
            onClick={load}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-lg border border-neutral-200 text-neutral-500 hover:bg-neutral-50 transition"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Refresh
          </button>
        </div>
      </div>

      {/* Filters */}
      {showFilters && (
        <div className="mb-4 p-4 bg-white border border-neutral-200 rounded-xl flex items-center gap-4 flex-wrap">
          <div>
            <label className="block text-[10px] font-semibold uppercase tracking-widest text-neutral-400 mb-1">Entity type</label>
            <select
              value={entityTypeFilter}
              onChange={(e) => setEntityTypeFilter(e.target.value)}
              className="px-3 py-1.5 border border-neutral-200 rounded-lg text-sm text-neutral-700 focus:outline-none focus:ring-2 focus:ring-teal-500"
            >
              <option value="">All types</option>
              {ALL_ENTITY_TYPES.map((t) => (
                <option key={t} value={t}>{ENTITY_TYPE_LABELS[t]}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-[10px] font-semibold uppercase tracking-widest text-neutral-400 mb-1">Action</label>
            <select
              value={actionFilter}
              onChange={(e) => setActionFilter(e.target.value)}
              className="px-3 py-1.5 border border-neutral-200 rounded-lg text-sm text-neutral-700 focus:outline-none focus:ring-2 focus:ring-teal-500"
            >
              <option value="">All actions</option>
              {ALL_ACTIONS.map((a) => (
                <option key={a} value={a}>{a.replace("_", " ")}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-[10px] font-semibold uppercase tracking-widest text-neutral-400 mb-1">User</label>
            <input
              type="text"
              value={userFilter}
              onChange={(e) => setUserFilter(e.target.value)}
              placeholder="email address"
              className="px-3 py-1.5 border border-neutral-200 rounded-lg text-sm text-neutral-700 focus:outline-none focus:ring-2 focus:ring-teal-500 w-48"
            />
          </div>
          {hasFilters && (
            <button
              onClick={() => { setEntityTypeFilter(""); setActionFilter(""); setUserFilter(""); }}
              className="mt-4 text-xs text-neutral-400 hover:text-neutral-600 transition"
            >
              Clear filters
            </button>
          )}
        </div>
      )}

      {/* Table */}
      <div className="bg-white border border-neutral-200 rounded-xl overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-sm text-neutral-400">Loading...</div>
        ) : entries.length === 0 ? (
          <div className="p-12 text-center">
            <p className="text-sm text-neutral-400">No events recorded yet.</p>
            <p className="text-xs text-neutral-300 mt-1">Events appear here as you publish pages, update content, and manage media.</p>
          </div>
        ) : (
          <div className="divide-y divide-neutral-50">
            {entries.map((entry) => (
              <div key={entry.id} className="px-5 py-3.5 flex items-start gap-4 hover:bg-neutral-50 transition">
                {/* Action badge */}
                <span className={`flex-shrink-0 mt-0.5 px-2 py-0.5 text-[11px] font-medium rounded-full ${ACTION_COLORS[entry.action] || "bg-neutral-100 text-neutral-600"}`}>
                  {entry.action.replace("_", " ")}
                </span>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium text-neutral-700 truncate">
                      {entry.entity_label || entry.entity_id || "—"}
                    </span>
                    <span className="text-[10px] text-neutral-400 flex-shrink-0">
                      {ENTITY_TYPE_LABELS[entry.entity_type] || entry.entity_type}
                    </span>
                  </div>
                  {entry.metadata && Object.keys(entry.metadata).length > 0 && (
                    <p className="text-[11px] text-neutral-400 mt-0.5 truncate">
                      {entry.metadata.changedFields
                        ? `Fields: ${(entry.metadata.changedFields as string[]).join(", ")}`
                        : JSON.stringify(entry.metadata).slice(0, 80)}
                    </p>
                  )}
                </div>

                {/* Actor */}
                {entry.user_email && (
                  <button
                    onClick={() => setUserFilter(entry.user_email!)}
                    className="flex-shrink-0 text-[11px] text-neutral-400 hover:text-teal-600 transition truncate max-w-[120px]"
                    title={`Filter by ${entry.user_email}`}
                  >
                    {entry.user_email.split("@")[0]}
                  </button>
                )}

                {/* Time */}
                <span className="flex-shrink-0 text-[11px] text-neutral-400" title={formatDate(entry.created_at)}>
                  {timeAgo(entry.created_at)}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Pagination */}
      {total > limit && (
        <div className="mt-4 flex items-center justify-between text-xs text-neutral-500">
          <span>
            Showing {offset + 1}–{Math.min(offset + limit, total)} of {total.toLocaleString()}
          </span>
          <div className="flex gap-2">
            <button
              onClick={() => setOffset(Math.max(0, offset - limit))}
              disabled={offset === 0}
              className="px-3 py-1.5 border border-neutral-200 rounded-lg hover:bg-neutral-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
            >
              Previous
            </button>
            <button
              onClick={() => setOffset(offset + limit)}
              disabled={offset + limit >= total}
              className="px-3 py-1.5 border border-neutral-200 rounded-lg hover:bg-neutral-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
