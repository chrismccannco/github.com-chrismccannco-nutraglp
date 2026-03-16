"use client";

import { useEffect, useState, useRef } from "react";
import {
  Upload,
  Trash2,
  Copy,
  Check,
  X,
  Image as ImageIcon,
  Download,
  Maximize2,
} from "lucide-react";

interface MediaItem {
  url: string;
  pathname: string;
  size: number;
  width: number;
  height: number;
  mimeType: string;
  uploadedAt: string;
}

export default function MediaLibrary() {
  const [items, setItems] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);
  const [selected, setSelected] = useState<MediaItem | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const load = () => {
    fetch("/api/upload")
      .then((r) => r.json())
      .then((data) => {
        setItems(Array.isArray(data) ? data : []);
        setLoading(false);
      });
  };

  useEffect(() => {
    load();
  }, []);

  const handleUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setUploading(true);

    for (const file of Array.from(files)) {
      const form = new FormData();
      form.append("file", file);
      try {
        const res = await fetch("/api/upload", { method: "POST", body: form });
        if (!res.ok) {
          const err = await res.json();
          alert(err.error || "Upload failed");
        }
      } catch {
        alert("Upload failed");
      }
    }

    setUploading(false);
    load();
    if (fileRef.current) fileRef.current.value = "";
  };

  const handleDelete = async (item: MediaItem) => {
    if (!confirm(`Delete "${item.pathname}"?`)) return;
    await fetch("/api/upload", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url: item.url }),
    });
    if (selected?.url === item.url) setSelected(null);
    load();
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopied(label);
    setTimeout(() => setCopied(null), 1500);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    handleUpload(e.dataTransfer.files);
  };

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const getAbsoluteUrl = (path: string) => {
    if (typeof window === "undefined") return path;
    return `${window.location.origin}${path}`;
  };

  return (
    <div className="flex gap-6 max-w-6xl">
      {/* Main column */}
      <div className={selected ? "flex-1 min-w-0" : "w-full"}>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-xl font-semibold text-neutral-900">Media</h1>
            <p className="text-sm text-neutral-500 mt-1">
              {items.length} file{items.length !== 1 ? "s" : ""}
            </p>
          </div>
          <button
            onClick={() => fileRef.current?.click()}
            disabled={uploading}
            className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white text-sm font-medium rounded-lg hover:bg-emerald-700 transition disabled:opacity-50"
          >
            <Upload className="w-4 h-4" />
            {uploading ? "Uploading..." : "Upload"}
          </button>
        </div>

        {/* Dropzone */}
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          className={`border-2 border-dashed rounded-xl p-6 text-center mb-6 transition cursor-pointer ${
            dragOver
              ? "border-emerald-500 bg-emerald-50"
              : "border-neutral-200 bg-neutral-50 hover:border-neutral-300"
          }`}
          onClick={() => fileRef.current?.click()}
        >
          <input
            ref={fileRef}
            type="file"
            multiple
            accept="image/*"
            onChange={(e) => handleUpload(e.target.files)}
            className="hidden"
          />
          <ImageIcon className="w-8 h-8 text-neutral-300 mx-auto mb-2" />
          <p className="text-sm text-neutral-500">
            {uploading ? "Uploading..." : "Drop images here or click to browse"}
          </p>
          <p className="text-xs text-neutral-400 mt-1">
            JPEG, PNG, WebP, GIF, SVG. Max 4MB each.
          </p>
        </div>

        {/* Grid */}
        {loading ? (
          <p className="text-sm text-neutral-400 text-center py-12">Loading...</p>
        ) : items.length === 0 ? (
          <p className="text-sm text-neutral-400 text-center py-12">
            No images uploaded yet.
          </p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {items.map((item) => (
              <div
                key={item.url}
                onClick={() => setSelected(item)}
                className={`bg-white border rounded-xl overflow-hidden cursor-pointer group transition ${
                  selected?.url === item.url
                    ? "border-emerald-500 ring-2 ring-emerald-100"
                    : "border-neutral-200 hover:border-neutral-300"
                }`}
              >
                <div className="aspect-square bg-neutral-100 relative">
                  <img
                    src={item.url}
                    alt={item.pathname}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <Maximize2 className="w-5 h-5 text-white" />
                  </div>
                </div>
                <div className="px-3 py-2">
                  <p className="text-xs text-neutral-700 truncate">{item.pathname}</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-[10px] text-neutral-400">
                      {formatSize(item.size)}
                    </span>
                    {item.width > 0 && (
                      <span className="text-[10px] text-neutral-400">
                        {item.width} x {item.height}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Detail panel */}
      {selected && (
        <div className="w-80 flex-shrink-0">
          <div className="bg-white border border-neutral-200 rounded-xl overflow-hidden sticky top-4">
            {/* Preview */}
            <div className="aspect-video bg-neutral-100 relative">
              <img
                src={selected.url}
                alt={selected.pathname}
                className="w-full h-full object-contain"
              />
              <button
                onClick={() => setSelected(null)}
                className="absolute top-2 right-2 p-1 bg-white/80 rounded-lg hover:bg-white transition"
              >
                <X className="w-4 h-4 text-neutral-600" />
              </button>
            </div>

            <div className="p-4 space-y-4">
              {/* File info */}
              <div>
                <p className="text-sm font-medium text-neutral-900 truncate">
                  {selected.pathname}
                </p>
                <div className="flex items-center gap-3 mt-1 text-xs text-neutral-500">
                  <span>{formatSize(selected.size)}</span>
                  {selected.width > 0 && (
                    <span>
                      {selected.width} x {selected.height}px
                    </span>
                  )}
                  <span>{selected.mimeType?.split("/")[1]?.toUpperCase()}</span>
                </div>
              </div>

              {/* URL actions */}
              <div className="space-y-2">
                <p className="text-[11px] font-medium text-neutral-500 uppercase tracking-wider">
                  Copy URL
                </p>

                {/* Original */}
                <button
                  onClick={() =>
                    copyToClipboard(getAbsoluteUrl(selected.url), "original")
                  }
                  className="w-full flex items-center justify-between px-3 py-2 text-xs bg-neutral-50 rounded-lg hover:bg-neutral-100 transition"
                >
                  <span className="text-neutral-700">Original</span>
                  {copied === "original" ? (
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                  ) : (
                    <Copy className="w-3.5 h-3.5 text-neutral-400" />
                  )}
                </button>

                {/* WebP */}
                {selected.mimeType !== "image/svg+xml" && (
                  <button
                    onClick={() =>
                      copyToClipboard(
                        getAbsoluteUrl(`${selected.url}?format=webp`),
                        "webp"
                      )
                    }
                    className="w-full flex items-center justify-between px-3 py-2 text-xs bg-neutral-50 rounded-lg hover:bg-neutral-100 transition"
                  >
                    <span className="text-neutral-700">WebP</span>
                    {copied === "webp" ? (
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                    ) : (
                      <Copy className="w-3.5 h-3.5 text-neutral-400" />
                    )}
                  </button>
                )}

                {/* Responsive sizes */}
                {selected.width > 640 &&
                  selected.mimeType !== "image/svg+xml" && (
                    <>
                      {[640, 960, 1280]
                        .filter((w) => w < selected.width)
                        .map((w) => (
                          <button
                            key={w}
                            onClick={() =>
                              copyToClipboard(
                                getAbsoluteUrl(`${selected.url}?w=${w}`),
                                `w${w}`
                              )
                            }
                            className="w-full flex items-center justify-between px-3 py-2 text-xs bg-neutral-50 rounded-lg hover:bg-neutral-100 transition"
                          >
                            <span className="text-neutral-700">{w}px wide</span>
                            {copied === `w${w}` ? (
                              <Check className="w-3.5 h-3.5 text-emerald-600" />
                            ) : (
                              <Copy className="w-3.5 h-3.5 text-neutral-400" />
                            )}
                          </button>
                        ))}
                    </>
                  )}

                {/* Srcset */}
                {selected.width > 640 &&
                  selected.mimeType !== "image/svg+xml" && (
                    <button
                      onClick={() => {
                        const widths = [320, 640, 960, 1280].filter(
                          (w) => w < selected.width
                        );
                        const entries = widths.map(
                          (w) =>
                            `${getAbsoluteUrl(`${selected.url}?w=${w}`)} ${w}w`
                        );
                        entries.push(
                          `${getAbsoluteUrl(selected.url)} ${selected.width}w`
                        );
                        copyToClipboard(entries.join(", "), "srcset");
                      }}
                      className="w-full flex items-center justify-between px-3 py-2 text-xs bg-emerald-50 rounded-lg hover:bg-emerald-100 transition"
                    >
                      <span className="text-emerald-700 font-medium">
                        Copy srcset
                      </span>
                      {copied === "srcset" ? (
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                      ) : (
                        <Copy className="w-3.5 h-3.5 text-emerald-600" />
                      )}
                    </button>
                  )}
              </div>

              {/* Actions */}
              <div className="flex gap-2 pt-2 border-t border-neutral-100">
                <a
                  href={selected.url}
                  target="_blank"
                  rel="noopener"
                  className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 text-xs text-neutral-700 bg-neutral-50 rounded-lg hover:bg-neutral-100 transition"
                >
                  <Download className="w-3.5 h-3.5" />
                  Open
                </a>
                <button
                  onClick={() => handleDelete(selected)}
                  className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 text-xs text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
