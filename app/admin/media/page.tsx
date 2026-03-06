"use client";

import { useEffect, useState, useRef } from "react";

interface BlobItem {
  url: string;
  pathname: string;
  size: number;
  uploadedAt: string;
}

export default function MediaLibrary() {
  const [blobs, setBlobs] = useState<BlobItem[]>([]);
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const load = () => {
    fetch("/api/upload")
      .then((r) => r.json())
      .then((data) => setBlobs(Array.isArray(data) ? data : []));
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

  const handleDelete = async (url: string) => {
    if (!confirm("Delete this image?")) return;
    await fetch("/api/upload", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url }),
    });
    load();
  };

  const copyUrl = (url: string) => {
    navigator.clipboard.writeText(url);
    setCopied(url);
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

  return (
    <div className="max-w-4xl">
      <h1 className="text-2xl font-semibold text-gray-900 mb-1">Media</h1>
      <p className="text-sm text-gray-500 mb-8">
        {blobs.length} file{blobs.length !== 1 ? "s" : ""} uploaded
      </p>

      {/* Upload dropzone */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-xl p-8 text-center mb-8 transition ${
          dragOver
            ? "border-emerald-500 bg-emerald-50"
            : "border-gray-300 bg-white"
        }`}
      >
        <input
          ref={fileRef}
          type="file"
          multiple
          accept="image/*"
          onChange={(e) => handleUpload(e.target.files)}
          className="hidden"
        />
        <p className="text-sm text-gray-600 mb-2">
          {uploading
            ? "Uploading..."
            : "Drag images here or click to upload"}
        </p>
        <button
          onClick={() => fileRef.current?.click()}
          disabled={uploading}
          className="px-4 py-2 bg-[#0f2d20] text-white text-sm rounded-lg hover:bg-[#1a4a33] transition disabled:opacity-50"
        >
          {uploading ? "Uploading..." : "Choose files"}
        </button>
        <p className="text-xs text-gray-400 mt-2">
          JPEG, PNG, WebP, GIF, SVG. Max 4MB each.
        </p>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {blobs.map((blob) => (
          <div
            key={blob.url}
            className="bg-white border border-gray-200 rounded-xl overflow-hidden group"
          >
            <div className="aspect-square bg-gray-100 relative">
              <img
                src={blob.url}
                alt={blob.pathname}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition flex items-center justify-center opacity-0 group-hover:opacity-100">
                <div className="flex gap-2">
                  <button
                    onClick={() => copyUrl(blob.url)}
                    className="px-3 py-1.5 bg-white text-gray-900 text-xs rounded-lg font-medium"
                  >
                    {copied === blob.url ? "Copied!" : "Copy URL"}
                  </button>
                  <button
                    onClick={() => handleDelete(blob.url)}
                    className="px-3 py-1.5 bg-red-600 text-white text-xs rounded-lg font-medium"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
            <div className="px-3 py-2">
              <p className="text-xs text-gray-700 truncate">{blob.pathname}</p>
              <p className="text-[10px] text-gray-400">
                {formatSize(blob.size)}
              </p>
            </div>
          </div>
        ))}
      </div>

      {blobs.length === 0 && !uploading && (
        <p className="text-sm text-gray-400 text-center py-12">
          No images uploaded yet.
        </p>
      )}
    </div>
  );
}
