"use client";

import { useState } from "react";
import { Clock, Hash, ChevronDown } from "lucide-react";
import StatusBadge from "./StatusBadge";
import VersionHistory from "./VersionHistory";

interface MetadataPanelProps {
  status: "published" | "draft";
  slug?: string;
  createdAt?: string;
  updatedAt?: string;
  contentType?: string;
  contentId?: number | null;
  onRestore?: (data: Record<string, unknown>) => void;
  children?: React.ReactNode;
}

export default function MetadataPanel({
  status,
  slug,
  updatedAt,
  contentType,
  contentId,
  onRestore,
  children,
}: MetadataPanelProps) {
  const [showVersions, setShowVersions] = useState(false);

  const formatDate = (d?: string) => {
    if (!d) return "\u2014";
    return new Date(d).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  };

  return (
    <div className="space-y-4">
      {/* Status card */}
      <div className="bg-white border border-neutral-200 rounded-lg shadow-sm p-4 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-neutral-400">
            Status
          </span>
          <StatusBadge status={status} />
        </div>
        {slug && (
          <div className="flex items-center gap-2 text-xs text-neutral-500">
            <Hash className="w-3 h-3" />
            <span className="font-mono">{slug}</span>
          </div>
        )}
        {updatedAt && (
          <div className="flex items-center gap-2 text-xs text-neutral-500">
            <Clock className="w-3 h-3" />
            <span>{formatDate(updatedAt)}</span>
          </div>
        )}
      </div>

      {/* Version history */}
      {contentType && contentId && onRestore && (
        <div className="bg-white border border-neutral-200 rounded-lg shadow-sm overflow-hidden">
          <button
            onClick={() => setShowVersions(!showVersions)}
            className="w-full flex items-center justify-between px-4 py-3 text-xs font-semibold uppercase tracking-wider text-neutral-400 hover:bg-neutral-50 transition"
          >
            Version History
            <ChevronDown
              className={`w-3.5 h-3.5 transition-transform ${
                showVersions ? "" : "-rotate-90"
              }`}
            />
          </button>
          {showVersions && (
            <div className="border-t border-neutral-100">
              <VersionHistoryInline
                contentType={contentType}
                contentId={contentId}
                onRestore={onRestore}
              />
            </div>
          )}
        </div>
      )}

      {/* Extra content (e.g. reading time, featured image) */}
      {children}
    </div>
  );
}

/* Inline version list (no modal overlay) */
function VersionHistoryInline({
  contentType,
  contentId,
  onRestore,
}: {
  contentType: string;
  contentId: number;
  onRestore: (data: Record<string, unknown>) => void;
}) {
  const [versions, setVersions] = useState<
    { id: number; version_data: Record<string, unknown>; created_at: string }[]
  >([]);
  const [loaded, setLoaded] = useState(false);
  const [loading, setLoading] = useState(false);

  const load = async () => {
    if (loaded) return;
    setLoading(true);
    try {
      const res = await fetch(
        `/api/versions?type=${contentType}&id=${contentId}`
      );
      const data = await res.json();
      setVersions(Array.isArray(data) ? data : []);
    } catch {
      /* ignore */
    }
    setLoaded(true);
    setLoading(false);
  };

  // Load on mount
  if (!loaded && !loading) load();

  if (loading)
    return <p className="text-xs text-neutral-400 p-4">Loading\u2026</p>;
  if (versions.length === 0)
    return (
      <p className="text-xs text-neutral-400 p-4">
        No versions yet. Versions are created when you publish.
      </p>
    );

  return (
    <div className="max-h-64 overflow-y-auto divide-y divide-neutral-50">
      {versions.map((v, i) => (
        <div
          key={v.id}
          className="px-4 py-2.5 flex items-center justify-between hover:bg-neutral-50 transition"
        >
          <div>
            <p className="text-xs font-medium text-neutral-700">
              {i === 0 ? "Latest" : `Version ${versions.length - i}`}
            </p>
            <p className="text-[10px] text-neutral-400">
              {new Date(v.created_at).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                hour: "numeric",
                minute: "2-digit",
              })}
            </p>
          </div>
          <button
            onClick={() => {
              if (confirm("Restore this version? Unsaved changes will be lost."))
                onRestore(v.version_data);
            }}
            className="text-[10px] text-teal-600 hover:text-teal-700 font-medium"
          >
            Restore
          </button>
        </div>
      ))}
    </div>
  );
}
