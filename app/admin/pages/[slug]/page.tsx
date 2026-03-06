"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import RichTextEditor from "../../components/RichTextEditor";
import VersionHistory from "../../components/VersionHistory";

export default function EditPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;

  const [pageId, setPageId] = useState<number | null>(null);
  const [page, setPage] = useState<Record<string, unknown> | null>(null);
  const [title, setTitle] = useState("");
  const [metaDesc, setMetaDesc] = useState("");
  const [content, setContent] = useState<Record<string, unknown>>({});
  const [published, setPublished] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");
  const [showHistory, setShowHistory] = useState(false);

  useEffect(() => {
    fetch(`/api/pages/${slug}`)
      .then((r) => {
        if (!r.ok) throw new Error("Page not found");
        return r.json();
      })
      .then((data) => {
        setPage(data);
        setPageId(data.id || null);
        setTitle(data.title || "");
        setMetaDesc(data.meta_description || "");
        setContent(data.content || {});
        setPublished(data.published !== 0);
      })
      .catch((e) => setError(e.message));
  }, [slug]);

  const buildPayload = (pub: boolean) => ({
    title,
    meta_description: metaDesc,
    content,
    published: pub,
  });

  const handleSaveDraft = async () => {
    setSaving(true);
    try {
      const res = await fetch(`/api/pages/${slug}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(buildPayload(false)),
      });
      if (!res.ok) throw new Error("Save failed");
      setPublished(false);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (e: unknown) {
      setError(String(e));
    } finally {
      setSaving(false);
    }
  };

  const handlePublish = async () => {
    setSaving(true);
    try {
      const res = await fetch(`/api/pages/${slug}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(buildPayload(true)),
      });
      if (!res.ok) throw new Error("Publish failed");
      setPublished(true);
      if (pageId) {
        await fetch("/api/versions", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            content_type: "page",
            content_id: pageId,
            version_data: { title, meta_description: metaDesc, content },
          }),
        });
      }
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (e: unknown) {
      setError(String(e));
    } finally {
      setSaving(false);
    }
  };

  const handleRestore = (data: Record<string, unknown>) => {
    if (data.title !== undefined) setTitle(data.title as string);
    if (data.meta_description !== undefined) setMetaDesc(data.meta_description as string);
    if (data.content !== undefined) setContent(data.content as Record<string, unknown>);
    setShowHistory(false);
  };

  const updateSection = (sectionKey: string, field: string, value: unknown) => {
    setContent((prev) => ({
      ...prev,
      [sectionKey]: {
        ...((prev[sectionKey] as Record<string, unknown>) || {}),
        [field]: value,
      },
    }));
  };

  if (error && !page) {
    return (
      <div>
        <p className="text-red-600 text-sm">{error}</p>
        <button
          onClick={() => router.push("/admin/pages")}
          className="text-sm text-gray-500 mt-2 underline"
        >
          Back to pages
        </button>
      </div>
    );
  }

  if (!page) return <p className="text-sm text-gray-500">Loading...</p>;

  return (
    <div className="max-w-3xl">
      <div className="mb-6">
        <button
          onClick={() => router.push("/admin/pages")}
          className="inline-block text-sm text-gray-500 hover:text-gray-700 py-1 mb-2"
        >
          &larr; Back to pages
        </button>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-semibold text-gray-900">
              Edit: {title}
            </h1>
            <span
              className={`px-2 py-0.5 text-[10px] font-medium rounded-full ${
                published
                  ? "bg-emerald-100 text-emerald-800"
                  : "bg-amber-100 text-amber-800"
              }`}
            >
              {published ? "Published" : "Draft"}
            </span>
          </div>
          <div className="flex items-center gap-2">
          {pageId && (
            <button
              onClick={() => setShowHistory(true)}
              className="px-3 py-2 text-xs text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition"
            >
              History
            </button>
          )}
          <button
            onClick={handleSaveDraft}
            disabled={saving}
            className="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition disabled:opacity-50"
          >
            {saving ? "Saving..." : "Save draft"}
          </button>
          <button
            onClick={handlePublish}
            disabled={saving}
            className="px-4 py-2 bg-[#0f2d20] text-white text-sm rounded-lg hover:bg-[#1a4a33] transition disabled:opacity-50"
          >
            {saving ? "Publishing..." : saved ? "Published!" : "Publish"}
          </button>
        </div>
      </div>

      {error && <p className="text-red-600 text-sm mb-4">{error}</p>}

      <div className="space-y-6">
        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">
            Page Title
          </label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">
            Meta Description
          </label>
          <textarea
            value={metaDesc}
            onChange={(e) => setMetaDesc(e.target.value)}
            rows={2}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        {Object.entries(content).map(([sectionKey, sectionData]) => {
          const section = sectionData as Record<string, unknown>;
          return (
            <div
              key={sectionKey}
              className="bg-white border border-gray-200 rounded-xl p-5"
            >
              <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-700 mb-4">
                {sectionKey.replace(/([A-Z])/g, " $1").trim()}
              </h3>
              {Object.entries(section).map(([field, value]) => {
                if (typeof value === "string") {
                  const isLong = value.length > 120;
                  return (
                    <div key={field} className="mb-4">
                      <label className="block text-xs font-medium text-gray-500 mb-1">
                        {field.replace(/([A-Z])/g, " $1").trim()}
                      </label>
                      {isLong ? (
                        <RichTextEditor
                          content={value}
                          onChange={(html) =>
                            updateSection(sectionKey, field, html)
                          }
                        />
                      ) : (
                        <input
                          value={value}
                          onChange={(e) =>
                            updateSection(sectionKey, field, e.target.value)
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        />
                      )}
                    </div>
                  );
                }
                if (Array.isArray(value)) {
                  return (
                    <div key={field} className="mb-4">
                      <label className="block text-xs font-medium text-gray-500 mb-1">
                        {field.replace(/([A-Z])/g, " $1").trim()} (JSON)
                      </label>
                      <textarea
                        value={JSON.stringify(value, null, 2)}
                        onChange={(e) => {
                          try {
                            updateSection(
                              sectionKey,
                              field,
                              JSON.parse(e.target.value)
                            );
                          } catch {
                            /* ignore parse errors while typing */
                          }
                        }}
                        rows={6}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm font-mono focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>
                  );
                }
                return null;
              })}
            </div>
          );
        })}
      </div>

      {showHistory && pageId && (
        <VersionHistory
          contentType="page"
          contentId={pageId}
          onRestore={handleRestore}
          onClose={() => setShowHistory(false)}
        />
      )}
    </div>
  );
}
