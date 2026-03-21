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
  Wand2,
  Eraser,
  Loader2,
  SunMedium,
  Contrast,
  Sparkles,
  Crop,
  Layers,
  ArrowDownToLine,
  RotateCcw,
  Archive,
  Clock,
} from "lucide-react";

interface MediaItem {
  url: string;
  pathname: string;
  size: number;
  width: number;
  height: number;
  mimeType: string;
  parentId?: number | null;
  deletedAt?: string | null;
  uploadedAt: string;
}

interface VersionItem {
  id: number;
  url: string;
  pathname: string;
  size: number;
  width: number;
  height: number;
  mimeType: string;
  parentId: number | null;
  deletedAt: string | null;
  createdAt: string;
}

export default function MediaLibrary() {
  const [items, setItems] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);
  const [selected, setSelected] = useState<MediaItem | null>(null);
  const [generatingAlt, setGeneratingAlt] = useState(false);
  const [altText, setAltText] = useState<string | null>(null);
  const [removingBg, setRemovingBg] = useState(false);
  const [adjusting, setAdjusting] = useState(false);
  const [brightness, setBrightness] = useState(1);
  const [contrast, setContrast] = useState(1);
  const [sharpen, setSharpen] = useState(false);
  const [exporting, setExporting] = useState<string | null>(null);
  const [exportingAll, setExportingAll] = useState(false);
  const [showTrash, setShowTrash] = useState(false);
  const [versions, setVersions] = useState<VersionItem[]>([]);
  const [loadingVersions, setLoadingVersions] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const load = (trash?: boolean) => {
    const trashParam = trash !== undefined ? trash : showTrash;
    fetch(`/api/upload${trashParam ? "?trash=1" : ""}`)
      .then((r) => r.json())
      .then((data) => {
        setItems(Array.isArray(data) ? data : []);
        setLoading(false);
      });
  };

  useEffect(() => {
    setLoading(true);
    setSelected(null);
    load();
  }, [showTrash]);

  const loadVersions = async (item: MediaItem) => {
    const id = getImageId(item.url);
    if (!id) return;
    setLoadingVersions(true);
    try {
      const res = await fetch(`/api/upload/versions?id=${id}`);
      if (res.ok) {
        const data = await res.json();
        setVersions(data.versions || []);
      }
    } catch {
      setVersions([]);
    }
    setLoadingVersions(false);
  };

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

  const handleDelete = async (item: MediaItem, permanent = false) => {
    const msg = permanent
      ? `Permanently delete "${item.pathname}"? This cannot be undone.`
      : `Move "${item.pathname}" to trash?`;
    if (!confirm(msg)) return;
    await fetch("/api/upload", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url: item.url, permanent }),
    });
    if (selected?.url === item.url) setSelected(null);
    load();
  };

  const handleRestore = async (item: MediaItem) => {
    await fetch("/api/upload", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url: item.url, action: "restore" }),
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

  const getImageId = (url: string) => url.split("/").pop();

  const resetEdits = () => {
    setBrightness(1);
    setContrast(1);
    setSharpen(false);
  };

  const generateAltText = async () => {
    if (!selected) return;
    setGeneratingAlt(true);
    setAltText(null);
    try {
      const res = await fetch("/api/media-tools/alt-text", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageId: Number(getImageId(selected.url)) }),
      });
      if (res.ok) {
        const data = await res.json();
        setAltText(data.alt_text);
      } else {
        const err = await res.json();
        alert(err.error || "Failed to generate alt text");
      }
    } catch {
      alert("Failed to generate alt text");
    }
    setGeneratingAlt(false);
  };

  const removeBackground = async () => {
    if (!selected) return;
    setRemovingBg(true);
    try {
      // Run ML model client-side via WASM
      const { removeBackground: removeBg } = await import("@imgly/background-removal");

      // Fetch the image as a blob
      const imgRes = await fetch(selected.url);
      const imgBlob = await imgRes.blob();

      // Process with ISNet model in browser (full precision for clean masks)
      const resultBlob = await removeBg(imgBlob, {
        model: "isnet_fp16",
        output: { format: "image/png", quality: 0.9 },
      });

      // Upload the result back as a new media file, linked to parent
      const form = new FormData();
      const filename = selected.pathname.replace(/\.[^.]+$/, "") + "_nobg.png";
      form.append("file", new File([resultBlob], filename, { type: "image/png" }));
      const parentId = getImageId(selected.url);
      if (parentId) form.append("parent_id", parentId);

      const uploadRes = await fetch("/api/upload", { method: "POST", body: form });
      if (uploadRes.ok) {
        load();
        const data = await uploadRes.json();
        setSelected({
          url: data.url,
          pathname: data.pathname || filename,
          size: data.size,
          width: data.width || selected.width,
          height: data.height || selected.height,
          mimeType: "image/png",
          uploadedAt: new Date().toISOString(),
        });
      } else {
        const err = await uploadRes.json();
        alert(err.error || "Failed to save processed image");
      }
    } catch (e) {
      alert("Failed to remove background: " + (e instanceof Error ? e.message : "Unknown error"));
    }
    setRemovingBg(false);
  };

  const channelPresets = [
    { key: "blog-hero", name: "Blog Hero", dimensions: "1200x630" },
    { key: "og-image", name: "OG Image", dimensions: "1200x630" },
    { key: "instagram-square", name: "Instagram Square", dimensions: "1080x1080" },
    { key: "instagram-story", name: "Instagram Story", dimensions: "1080x1920" },
    { key: "twitter-card", name: "Twitter Card", dimensions: "1200x675" },
    { key: "linkedin-post", name: "LinkedIn Post", dimensions: "1200x627" },
    { key: "youtube-thumb", name: "YouTube Thumb", dimensions: "1280x720" },
    { key: "email-header", name: "Email Header", dimensions: "600x200" },
    { key: "favicon", name: "Favicon", dimensions: "512x512" },
  ];

  const exportToChannel = async (presetKey: string) => {
    if (!selected) return;
    setExporting(presetKey);
    try {
      const res = await fetch("/api/media-tools/channel-export", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          imageId: Number(getImageId(selected.url)),
          presets: [presetKey],
        }),
      });
      if (res.ok) {
        load();
      } else {
        const err = await res.json();
        alert(err.error || "Export failed");
      }
    } catch {
      alert("Export failed");
    }
    setExporting(null);
  };

  const exportAllChannels = async () => {
    if (!selected) return;
    setExportingAll(true);
    try {
      const res = await fetch("/api/media-tools/channel-export", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          imageId: Number(getImageId(selected.url)),
          presets: channelPresets.map((p) => p.key),
        }),
      });
      if (res.ok) {
        load();
      } else {
        const err = await res.json();
        alert(err.error || "Export failed");
      }
    } catch {
      alert("Export failed");
    }
    setExportingAll(false);
  };

  const applyAdjustments = async () => {
    if (!selected) return;
    setAdjusting(true);
    try {
      const res = await fetch("/api/media-tools/adjust", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          imageId: Number(getImageId(selected.url)),
          brightness,
          contrast,
          sharpen,
        }),
      });
      if (res.ok) {
        load();
        const data = await res.json();
        setSelected({
          url: data.url,
          pathname: data.filename,
          size: data.size,
          width: data.width,
          height: data.height,
          mimeType: selected.mimeType,
          uploadedAt: new Date().toISOString(),
        });
        resetEdits();
      } else {
        const err = await res.json();
        alert(err.error || "Adjustment failed");
      }
    } catch {
      alert("Adjustment failed");
    }
    setAdjusting(false);
  };

  return (
    <div className="flex gap-6 max-w-6xl">
      {/* Main column */}
      <div className={selected ? "flex-1 min-w-0" : "w-full"}>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-xl font-semibold text-neutral-900">
              {showTrash ? "Trash" : "Media"}
            </h1>
            <p className="text-sm text-neutral-500 mt-1">
              {items.length} file{items.length !== 1 ? "s" : ""}
              {showTrash ? " in trash" : ""}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowTrash(!showTrash)}
              className={`flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg transition ${
                showTrash
                  ? "bg-amber-100 text-amber-700 hover:bg-amber-200"
                  : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
              }`}
            >
              <Archive className="w-4 h-4" />
              {showTrash ? "Back to Media" : "Trash"}
            </button>
            {!showTrash && (
              <button
                onClick={() => fileRef.current?.click()}
                disabled={uploading}
                className="flex items-center gap-2 px-4 py-2 bg-teal-600 text-white text-sm font-medium rounded-lg hover:bg-teal-700 transition disabled:opacity-50"
              >
                <Upload className="w-4 h-4" />
                {uploading ? "Uploading..." : "Upload"}
              </button>
            )}
          </div>
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
              ? "border-teal-500 bg-teal-50"
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
                onClick={() => { setSelected(item); setAltText(null); resetEdits(); setVersions([]); loadVersions(item); }}
                className={`bg-white border rounded-xl overflow-hidden cursor-pointer group transition ${
                  selected?.url === item.url
                    ? "border-teal-500 ring-2 ring-teal-100"
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
                  {showTrash ? (
                    <>
                      <button
                        onClick={(e) => { e.stopPropagation(); handleRestore(item); }}
                        className="absolute bottom-1.5 left-1.5 p-1.5 bg-teal-500/90 rounded-lg opacity-0 group-hover:opacity-100 transition hover:bg-teal-600"
                        title="Restore"
                      >
                        <RotateCcw className="w-3.5 h-3.5 text-white" />
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); handleDelete(item, true); }}
                        className="absolute bottom-1.5 right-1.5 p-1.5 bg-red-500/90 rounded-lg opacity-0 group-hover:opacity-100 transition hover:bg-red-600"
                        title="Delete permanently"
                      >
                        <Trash2 className="w-3.5 h-3.5 text-white" />
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={(e) => { e.stopPropagation(); handleDelete(item); }}
                      className="absolute bottom-1.5 right-1.5 p-1.5 bg-red-500/90 rounded-lg opacity-0 group-hover:opacity-100 transition hover:bg-red-600"
                      title="Move to trash"
                    >
                      <Trash2 className="w-3.5 h-3.5 text-white" />
                    </button>
                  )}
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
          <style>{`
            input[type=range] {
              width: 100%;
              accent-color: #14b8a6;
              cursor: pointer;
            }
          `}</style>
          <div className="bg-white border border-neutral-200 rounded-xl overflow-hidden sticky top-4 max-h-[calc(100vh-2rem)] overflow-y-auto">
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
                    <Check className="w-3.5 h-3.5 text-teal-600" />
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
                      <Check className="w-3.5 h-3.5 text-teal-600" />
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
                              <Check className="w-3.5 h-3.5 text-teal-600" />
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
                      className="w-full flex items-center justify-between px-3 py-2 text-xs bg-teal-50 rounded-lg hover:bg-teal-100 transition"
                    >
                      <span className="text-teal-700 font-medium">
                        Copy srcset
                      </span>
                      {copied === "srcset" ? (
                        <Check className="w-3.5 h-3.5 text-teal-600" />
                      ) : (
                        <Copy className="w-3.5 h-3.5 text-teal-600" />
                      )}
                    </button>
                  )}
              </div>

              {/* Channel Presets */}
              <div className="space-y-2 pt-2 border-t border-neutral-100">
                <p className="text-[11px] font-medium text-neutral-500 uppercase tracking-wider">
                  Channel Presets
                </p>

                <div className="grid grid-cols-2 gap-1.5">
                  {channelPresets.map((preset) => (
                    <button
                      key={preset.key}
                      onClick={() => exportToChannel(preset.key)}
                      disabled={exporting === preset.key}
                      className={`text-[11px] px-2 py-1.5 rounded-lg transition ${
                        exporting === preset.key
                          ? "bg-teal-100 text-teal-700"
                          : "bg-neutral-50 hover:bg-neutral-100 text-neutral-700"
                      }`}
                    >
                      <div className="flex items-center justify-between gap-1">
                        <span className="font-medium">{preset.name}</span>
                        {exporting === preset.key ? (
                          <Loader2 className="w-3 h-3 animate-spin" />
                        ) : null}
                      </div>
                      <span className="text-[10px] text-neutral-400">
                        {preset.dimensions}
                      </span>
                    </button>
                  ))}
                </div>

                <button
                  onClick={exportAllChannels}
                  disabled={exportingAll}
                  className="w-full flex items-center justify-center gap-1.5 px-3 py-2 text-xs text-teal-700 bg-teal-50 rounded-lg hover:bg-teal-100 transition disabled:opacity-50"
                >
                  {exportingAll ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <ArrowDownToLine className="w-3.5 h-3.5" />
                  )}
                  {exportingAll ? "Exporting..." : "Export all channels"}
                </button>
              </div>

              {/* Adjustments */}
              <div className="space-y-2 pt-2 border-t border-neutral-100">
                <p className="text-[11px] font-medium text-neutral-500 uppercase tracking-wider">
                  Adjustments
                </p>

                <div className="space-y-3">
                  {/* Brightness */}
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="flex items-center gap-1 text-neutral-700">
                        <SunMedium className="w-3.5 h-3.5" />
                        Brightness
                      </span>
                      <span className="text-neutral-400">{brightness.toFixed(1)}</span>
                    </div>
                    <input
                      type="range"
                      min="0.5"
                      max="2.0"
                      step="0.1"
                      value={brightness}
                      onChange={(e) => setBrightness(parseFloat(e.target.value))}
                      className="w-full"
                    />
                  </div>

                  {/* Contrast */}
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="flex items-center gap-1 text-neutral-700">
                        <Contrast className="w-3.5 h-3.5" />
                        Contrast
                      </span>
                      <span className="text-neutral-400">{contrast.toFixed(1)}</span>
                    </div>
                    <input
                      type="range"
                      min="0.5"
                      max="2.0"
                      step="0.1"
                      value={contrast}
                      onChange={(e) => setContrast(parseFloat(e.target.value))}
                      className="w-full"
                    />
                  </div>

                  {/* Sharpen */}
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1.5 text-xs text-neutral-700">
                      <Sparkles className="w-3.5 h-3.5" />
                      Sharpen
                    </span>
                    <button
                      onClick={() => setSharpen(!sharpen)}
                      className={`w-5 h-5 rounded border transition ${
                        sharpen
                          ? "bg-teal-600 border-teal-600"
                          : "bg-white border-neutral-300 hover:border-neutral-400"
                      }`}
                    >
                      {sharpen && <Check className="w-3 h-3 text-white mx-auto" />}
                    </button>
                  </div>
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    onClick={applyAdjustments}
                    disabled={
                      adjusting ||
                      (brightness === 1 && contrast === 1 && !sharpen)
                    }
                    className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 text-xs text-white bg-teal-600 rounded-lg hover:bg-teal-700 transition disabled:opacity-50"
                  >
                    {adjusting ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <Layers className="w-3.5 h-3.5" />
                    )}
                    {adjusting ? "Applying..." : "Apply"}
                  </button>
                  <button
                    onClick={resetEdits}
                    className="flex-1 flex items-center justify-center px-3 py-2 text-xs text-neutral-600 bg-neutral-50 rounded-lg hover:bg-neutral-100 transition"
                  >
                    Reset
                  </button>
                </div>
              </div>

              {/* AI Tools */}
              {selected.mimeType !== "image/svg+xml" && (
                <div className="space-y-2 pt-2 border-t border-neutral-100">
                  <p className="text-[11px] font-medium text-neutral-500 uppercase tracking-wider">
                    AI Tools
                  </p>

                  <button
                    onClick={generateAltText}
                    disabled={generatingAlt}
                    className="w-full flex items-center justify-between px-3 py-2 text-xs bg-teal-50 rounded-lg hover:bg-teal-100 transition disabled:opacity-50"
                  >
                    <span className="flex items-center gap-1.5 text-teal-700 font-medium">
                      {generatingAlt ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <Wand2 className="w-3.5 h-3.5" />
                      )}
                      {generatingAlt ? "Generating..." : "Generate alt text"}
                    </span>
                  </button>

                  {altText && (
                    <div className="px-3 py-2 bg-neutral-50 rounded-lg">
                      <p className="text-xs text-neutral-700 leading-relaxed">{altText}</p>
                      <button
                        onClick={() => copyToClipboard(altText, "alt")}
                        className="flex items-center gap-1 mt-1.5 text-[10px] text-neutral-400 hover:text-neutral-600 transition"
                      >
                        {copied === "alt" ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                        {copied === "alt" ? "Copied" : "Copy"}
                      </button>
                    </div>
                  )}

                  <button
                    onClick={removeBackground}
                    disabled={removingBg}
                    className="w-full flex items-center justify-between px-3 py-2 text-xs bg-amber-50 rounded-lg hover:bg-amber-100 transition disabled:opacity-50"
                  >
                    <span className="flex items-center gap-1.5 text-amber-700 font-medium">
                      {removingBg ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <Eraser className="w-3.5 h-3.5" />
                      )}
                      {removingBg ? "Processing..." : "Remove background"}
                    </span>
                  </button>
                </div>
              )}

              {/* Version History */}
              {versions.length > 1 && (
                <div className="space-y-2 pt-2 border-t border-neutral-100">
                  <p className="text-[11px] font-medium text-neutral-500 uppercase tracking-wider">
                    Version History
                  </p>
                  <div className="space-y-1 max-h-48 overflow-y-auto">
                    {versions.map((v) => {
                      const isCurrent = selected?.url === v.url;
                      return (
                        <button
                          key={v.id}
                          onClick={() => {
                            setSelected({
                              url: v.url,
                              pathname: v.pathname,
                              size: v.size,
                              width: v.width,
                              height: v.height,
                              mimeType: v.mimeType,
                              parentId: v.parentId,
                              uploadedAt: v.createdAt,
                            });
                          }}
                          className={`w-full flex items-center gap-2 px-2 py-1.5 rounded-lg text-left transition ${
                            isCurrent
                              ? "bg-teal-50 border border-teal-200"
                              : "bg-neutral-50 hover:bg-neutral-100"
                          }`}
                        >
                          <img
                            src={v.url}
                            alt={v.pathname}
                            className="w-8 h-8 rounded object-cover flex-shrink-0"
                          />
                          <div className="min-w-0 flex-1">
                            <p className="text-[11px] text-neutral-700 truncate">{v.pathname}</p>
                            <div className="flex items-center gap-1 text-[10px] text-neutral-400">
                              <Clock className="w-2.5 h-2.5" />
                              {new Date(v.createdAt).toLocaleString()}
                            </div>
                          </div>
                          {isCurrent && (
                            <span className="text-[9px] font-medium text-teal-600 flex-shrink-0">CURRENT</span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-2 pt-2 border-t border-neutral-100">
                {showTrash ? (
                  <>
                    <button
                      onClick={() => handleRestore(selected)}
                      className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 text-xs text-teal-700 bg-teal-50 rounded-lg hover:bg-teal-100 transition"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      Restore
                    </button>
                    <button
                      onClick={() => handleDelete(selected, true)}
                      className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 text-xs text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      Delete forever
                    </button>
                  </>
                ) : (
                  <>
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
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
