"use client";

import { useEffect, useState } from "react";
import { RotateCcw, X, ChevronRight, GitCompare } from "lucide-react";

interface Version {
  id: number;
  content_type: string;
  content_id: number;
  version_data: Record<string, unknown>;
  created_at: string;
  created_by: string;
}

interface VersionHistoryProps {
  contentType: string;
  contentId: number;
  onRestore: (data: Record<string, unknown>) => void;
  onClose: () => void;
}

type DiffEntry = {
  key: string;
  type: "added" | "removed" | "changed" | "unchanged";
  oldValue?: string;
  newValue?: string;
};

function computeDiff(
  older: Record<string, unknown>,
  newer: Record<string, unknown>
): DiffEntry[] {
  const allKeys = new Set([...Object.keys(older), ...Object.keys(newer)]);
  const entries: DiffEntry[] = [];

  for (const key of allKeys) {
    // Skip blocks array for summary — too large
    if (key === "blocks") {
      const oldLen = Array.isArray(older[key]) ? (older[key] as unknown[]).length : 0;
      const newLen = Array.isArray(newer[key]) ? (newer[key] as unknown[]).length : 0;
      const oldStr = JSON.stringify(older[key] || []);
      const newStr = JSON.stringify(newer[key] || []);
      if (oldStr !== newStr) {
        entries.push({
          key: "blocks",
          type: "changed",
          oldValue: `${oldLen} block${oldLen !== 1 ? "s" : ""}`,
          newValue: `${newLen} block${newLen !== 1 ? "s" : ""}`,
        });
      }
      continue;
    }

    const oldVal = older[key];
    const newVal = newer[key];
    const oldStr = typeof oldVal === "object" ? JSON.stringify(oldVal) : String(oldVal ?? "");
    const newStr = typeof newVal === "object" ? JSON.stringify(newVal) : String(newVal ?? "");

    if (!(key in older)) {
      entries.push({ key, type: "added", newValue: newStr });
    } else if (!(key in newer)) {
      entries.push({ key, type: "removed", oldValue: oldStr });
    } else if (oldStr !== newStr) {
      entries.push({ key, type: "changed", oldValue: oldStr, newValue: newStr });
    }
  }

  return entries;
}

function truncate(s: string, max: number = 120): string {
  return s.length > max ? s.slice(0, max) + "..." : s;
}

export default function VersionHistory({
  contentType,
  contentId,
  onRestore,
  onClose,
}: VersionHistoryProps) {
  const [versions, setVersions] = useState<Version[]>([]);
  const [selected, setSelected] = useState<number | null>(null);
  const [compareMode, setCompareMode] = useState(false);
  const [compareWith, setCompareWith] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/versions?type=${contentType}&id=${contentId}`)
      .then((r) => r.json())
      .then((data) => {
        setVersions(Array.isArray(data) ? data : []);
        setLoading(false);
      });
  }, [contentType, contentId]);

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  };

  const timeAgo = (dateStr: string) => {
    const ms = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(ms / 60000);
    if (mins < 1) return "just now";
    if (mins < 60) return `${mins}m ago`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  };

  const handleRestore = (version: Version) => {
    if (!confirm("Restore this version? Current unsaved changes will be lost.")) return;
    onRestore(version.version_data);
    onClose();
  };

  const selectedVersion = selected !== null ? versions.find((v) => v.id === selected) : null;
  const compareVersion = compareWith !== null ? versions.find((v) => v.id === compareWith) : null;

  // Auto-diff with the next older version
  const getAutoDiff = (version: Version): DiffEntry[] => {
    const idx = versions.findIndex((v) => v.id === version.id);
    const older = versions[idx + 1];
    if (!older) return [];
    return computeDiff(older.version_data, version.version_data);
  };

  const diff =
    compareMode && selectedVersion && compareVersion
      ? computeDiff(compareVersion.version_data, selectedVersion.version_data)
      : selectedVersion
        ? getAutoDiff(selectedVersion)
        : [];

  const changedCount = diff.filter((d) => d.type !== "unchanged").length;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-start justify-end z-50">
      <div className="bg-white w-full max-w-lg h-full shadow-lg flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-neutral-200">
          <div>
            <h3 className="text-sm font-semibold text-neutral-900">Version history</h3>
            <p className="text-xs text-neutral-400 mt-0.5">
              {versions.length} version{versions.length !== 1 ? "s" : ""} saved
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setCompareMode(!compareMode);
                setCompareWith(null);
              }}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 text-xs rounded-lg transition ${
                compareMode
                  ? "bg-blue-50 text-blue-700 border border-blue-200"
                  : "text-neutral-500 hover:bg-neutral-100 border border-neutral-200"
              }`}
            >
              <GitCompare className="w-3.5 h-3.5" />
              Compare
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-neutral-400 hover:text-neutral-600 hover:bg-neutral-100 rounded-lg transition"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <p className="text-sm text-neutral-500 p-5">Loading...</p>
          ) : versions.length === 0 ? (
            <div className="p-8 text-center">
              <p className="text-sm text-neutral-400">
                No versions saved yet. Versions are created each time you publish.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-neutral-100">
              {versions.map((v, i) => {
                const isSelected = selected === v.id;
                const isCompare = compareWith === v.id;
                const autoDiff = getAutoDiff(v);
                const changes = autoDiff.filter((d) => d.type !== "unchanged").length;

                return (
                  <div
                    key={v.id}
                    className={`px-5 py-3 cursor-pointer transition ${
                      isSelected
                        ? "bg-emerald-50 border-l-2 border-emerald-600"
                        : isCompare
                          ? "bg-blue-50 border-l-2 border-blue-600"
                          : "hover:bg-neutral-50 border-l-2 border-transparent"
                    }`}
                    onClick={() => {
                      if (compareMode && selected !== null && selected !== v.id) {
                        setCompareWith(v.id);
                      } else {
                        setSelected(isSelected ? null : v.id);
                      }
                    }}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium text-neutral-900">
                          {i === 0 ? "Latest" : `Version ${versions.length - i}`}
                        </p>
                        {changes > 0 && i < versions.length - 1 && (
                          <span className="text-[10px] px-1.5 py-0.5 bg-amber-100 text-amber-700 rounded-full">
                            {changes} change{changes !== 1 ? "s" : ""}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] text-neutral-400">{timeAgo(v.created_at)}</span>
                        <ChevronRight
                          className={`w-3.5 h-3.5 text-neutral-300 transition-transform ${
                            isSelected ? "rotate-90" : ""
                          }`}
                        />
                      </div>
                    </div>
                    <p className="text-xs text-neutral-500 mt-0.5">{formatDate(v.created_at)}</p>
                    {typeof v.version_data.title === "string" && (
                      <p className="text-xs text-neutral-400 mt-0.5 truncate">
                        {v.version_data.title}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Detail panel */}
        {selectedVersion && (
          <div className="border-t border-neutral-200 max-h-[45%] flex flex-col">
            <div className="px-5 py-3 border-b border-neutral-100 flex items-center justify-between">
              <p className="text-xs font-medium text-neutral-500 uppercase tracking-wider">
                {compareMode && compareVersion
                  ? "Diff"
                  : diff.length > 0
                    ? `Changes (${changedCount})`
                    : "Details"}
              </p>
              <button
                onClick={() => handleRestore(selectedVersion)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 text-white text-xs font-medium rounded-lg hover:bg-emerald-700 transition"
              >
                <RotateCcw className="w-3 h-3" />
                Restore
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-5 space-y-2">
              {diff.length > 0 ? (
                diff.map((entry) => (
                  <div key={entry.key} className="text-xs">
                    <span className="font-medium text-neutral-600">{entry.key}</span>
                    {entry.type === "added" && (
                      <div className="mt-1 px-2 py-1 bg-blue-50 border border-blue-200 rounded text-blue-800">
                        + {truncate(entry.newValue || "")}
                      </div>
                    )}
                    {entry.type === "removed" && (
                      <div className="mt-1 px-2 py-1 bg-red-50 border border-red-200 rounded text-red-800">
                        - {truncate(entry.oldValue || "")}
                      </div>
                    )}
                    {entry.type === "changed" && (
                      <div className="mt-1 space-y-1">
                        <div className="px-2 py-1 bg-red-50 border border-red-200 rounded text-red-700">
                          - {truncate(entry.oldValue || "")}
                        </div>
                        <div className="px-2 py-1 bg-blue-50 border border-blue-200 rounded text-blue-700">
                          + {truncate(entry.newValue || "")}
                        </div>
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <p className="text-xs text-neutral-400 text-center py-4">
                  {versions.indexOf(selectedVersion) === versions.length - 1
                    ? "First version — no previous version to compare."
                    : "No changes detected."}
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
