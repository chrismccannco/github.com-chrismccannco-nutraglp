"use client";

import { useState, useRef } from "react";

interface ImageUploadModalProps {
  onInsert: (url: string) => void;
  onClose: () => void;
}

export default function ImageUploadModal({
  onInsert,
  onClose,
}: ImageUploadModalProps) {
  const [tab, setTab] = useState<"upload" | "url">("upload");
  const [url, setUrl] = useState("");
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (file: File) => {
    setUploading(true);
    const form = new FormData();
    form.append("file", file);

    try {
      const res = await fetch("/api/upload", { method: "POST", body: form });
      if (res.ok) {
        const data = await res.json();
        onInsert(data.url);
      } else {
        const err = await res.json();
        alert(err.error || "Upload failed");
      }
    } catch {
      alert("Upload failed");
    }
    setUploading(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleUpload(file);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-md mx-4">
        <div className="flex items-center justify-between px-5 py-4 border-b border-neutral-200">
          <h3 className="text-sm font-semibold text-neutral-900">Insert image</h3>
          <button
            onClick={onClose}
            className="text-neutral-400 hover:text-neutral-600 text-lg leading-none"
          >
            &times;
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-neutral-200">
          <button
            onClick={() => setTab("upload")}
            className={`flex-1 px-4 py-2.5 text-xs font-medium transition ${
              tab === "upload"
                ? "text-emerald-700 border-b-2 border-emerald-600"
                : "text-neutral-500 hover:text-neutral-700"
            }`}
          >
            Upload
          </button>
          <button
            onClick={() => setTab("url")}
            className={`flex-1 px-4 py-2.5 text-xs font-medium transition ${
              tab === "url"
                ? "text-emerald-700 border-b-2 border-emerald-600"
                : "text-neutral-500 hover:text-neutral-700"
            }`}
          >
            Paste URL
          </button>
        </div>

        <div className="p-5">
          {tab === "upload" ? (
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setDragOver(true);
              }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
              className={`border-2 border-dashed rounded-lg p-8 text-center transition ${
                dragOver
                  ? "border-emerald-500 bg-emerald-50"
                  : "border-neutral-300"
              }`}
            >
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleUpload(file);
                }}
                className="hidden"
              />
              <p className="text-sm text-neutral-600 mb-3">
                {uploading ? "Uploading..." : "Drag an image here"}
              </p>
              <button
                onClick={() => fileRef.current?.click()}
                disabled={uploading}
                className="px-4 py-2 bg-emerald-600 text-white text-xs rounded-lg hover:bg-emerald-700 transition disabled:opacity-50"
              >
                {uploading ? "Uploading..." : "Choose file"}
              </button>
              <p className="text-[10px] text-neutral-400 mt-2">Max 4MB</p>
            </div>
          ) : (
            <div className="space-y-3">
              <input
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://example.com/image.jpg"
                className="w-full px-3 py-2 border border-neutral-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
              <button
                onClick={() => {
                  if (url.trim()) onInsert(url.trim());
                }}
                disabled={!url.trim()}
                className="w-full px-4 py-2 bg-emerald-600 text-white text-xs rounded-lg hover:bg-emerald-700 transition disabled:opacity-50"
              >
                Insert
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
