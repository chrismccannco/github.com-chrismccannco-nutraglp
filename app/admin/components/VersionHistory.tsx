"use client";

import { useEffect, useState } from "react";

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

export default function VersionHistory({
  contentType,
  contentId,
  onRestore,
  onClose,
}: VersionHistoryProps) {
  const [versions, setVersions] = useState<Version[]>([]);
  const [preview, setPreview] = useState<Version | null>(null);
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

  const handleRestore = (version: Version) => {
    if (!confirm("Restore this version? Current unsaved changes will be lost."))
      return;
    onRestore(version.version_data);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-start justify-end z-50">
      <div className="bg-white w-full max-w-md h-full shadow-lg flex flex-col">
        <div className="flex items-center justify-between px-5 py-4 border-b border-neutral-200">
          <h3 className="text-sm font-semibold text-neutral-900">
            Version history
          </h3>
          <button
            onClick={onClose}
            className="text-neutral-400 hover:text-neutral-600 text-lg leading-none"
          >
            &times;
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <p className="text-sm text-neutral-500 p-5">Loading...</p>
          ) : versions.length === 0 ? (
            <p className="text-sm text-neutral-400 p-5 text-center">
              No versions saved yet. Versions are created each time you publish.
            </p>
          ) : (
            <div className="divide-y divide-neutral-100">
              {versions.map((v, i) => (
                <div
                  key={v.id}
                  className={`px-5 py-3 cursor-pointer transition ${
                    preview?.id === v.id
                      ? "bg-emerald-50 border-l-2 border-emerald-600"
                      : "hover:bg-neutral-50"
                  }`}
                  onClick={() => setPreview(v)}
                >
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-neutral-900">
                      {i === 0 ? "Latest" : `Version ${versions.length - i}`}
                    </p>
                    <p className="text-[10px] text-neutral-400">
                      {formatDate(v.created_at)}
                    </p>
                  </div>
                  {typeof v.version_data.title === "string" && (
                    <p className="text-xs text-neutral-500 mt-0.5 truncate">
                      {v.version_data.title}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Preview/restore panel */}
        {preview && (
          <div className="border-t border-neutral-200 p-5 space-y-3">
            <p className="text-xs font-medium text-neutral-500 uppercase tracking-wider">
              Preview
            </p>
            <pre className="text-[11px] text-neutral-600 bg-neutral-50 rounded-lg p-3 max-h-48 overflow-y-auto whitespace-pre-wrap">
              {JSON.stringify(preview.version_data, null, 2).slice(0, 2000)}
            </pre>
            <button
              onClick={() => handleRestore(preview)}
              className="w-full px-4 py-2 bg-emerald-600 text-white text-xs rounded-lg hover:bg-emerald-700 transition"
            >
              Restore this version
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
