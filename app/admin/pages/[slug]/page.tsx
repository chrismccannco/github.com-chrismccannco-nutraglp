"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import RichTextEditor from "../../components/RichTextEditor";
import EditorLayout from "../../components/EditorLayout";
import MetadataPanel from "../../components/MetadataPanel";
import FormSection from "../../components/FormSection";
import FormActions from "../../components/FormActions";
import AutosaveIndicator from "../../components/AutosaveIndicator";
import { useAutosave } from "../../hooks/useAutosave";

export default function EditPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;

  const [pageId, setPageId] = useState<number | null>(null);
  const [page, setPage] = useState<Record<string, unknown> | null>(null);
  const [title, setTitle] = useState("");
  const [metaDesc, setMetaDesc] = useState("");
  const [metaTitle, setMetaTitle] = useState("");
  const [ogImage, setOgImage] = useState("");
  const [content, setContent] = useState<Record<string, unknown>>({});
  const [published, setPublished] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");
  const [updatedAt, setUpdatedAt] = useState("");

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
        setMetaTitle(data.meta_title || "");
        setOgImage(data.og_image || "");
        setContent(data.content || {});
        setPublished(data.published !== 0);
        setUpdatedAt(data.updated_at || "");
      })
      .catch((e) => setError(e.message));
  }, [slug]);

  const buildPayload = (pub: boolean) => ({
    title,
    meta_description: metaDesc,
    meta_title: metaTitle,
    og_image: ogImage,
    content,
    published: pub,
  });

  const autoSaveFn = useCallback(async () => {
    if (!page) return;
    const res = await fetch(`/api/pages/${slug}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(buildPayload(published)),
    });
    if (!res.ok) throw new Error("Autosave failed");
    const data = await res.json();
    setUpdatedAt(data.updated_at || "");
  }, [slug, title, metaDesc, metaTitle, ogImage, content, published, page]);

  const autosaveStatus = useAutosave(autoSaveFn, [title, metaDesc, metaTitle, ogImage, content]);

  const handleSaveDraft = async () => {
    setSaving(true);
    try {
      const res = await fetch(`/api/pages/${slug}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(buildPayload(false)),
      });
      if (!res.ok) throw new Error("Save failed");
      const data = await res.json();
      setPublished(false);
      setUpdatedAt(data.updated_at || "");
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
      const data = await res.json();
      setPublished(true);
      setUpdatedAt(data.updated_at || "");
      if (pageId) {
        await fetch("/api/versions", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            content_type: "page",
            content_id: pageId,
            version_data: { title, meta_description: metaDesc, meta_title: metaTitle, og_image: ogImage, content },
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
    if (data.meta_description !== undefined)
      setMetaDesc(data.meta_description as string);
    if (data.meta_title !== undefined)
      setMetaTitle(data.meta_title as string);
    if (data.og_image !== undefined)
      setOgImage(data.og_image as string);
    if (data.content !== undefined)
      setContent(data.content as Record<string, unknown>);
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
          className="text-sm text-neutral-500 mt-2 underline"
        >
          Back to pages
        </button>
      </div>
    );
  }

  if (!page)
    return <p className="text-sm text-neutral-400">Loading\u2026</p>;

  return (
    <EditorLayout
      breadcrumbs={[
        { label: "Admin", href: "/admin" },
        { label: "Pages", href: "/admin/pages" },
        { label: title || slug },
      ]}
      title={title || "Untitled page"}
      actions={
        <div className="flex items-center gap-3">
          <AutosaveIndicator status={autosaveStatus} />
          <FormActions
            onSaveDraft={handleSaveDraft}
            onPublish={handlePublish}
            saving={saving}
            saved={saved}
            published={published}
          />
        </div>
      }
      sidebar={
        <MetadataPanel
          status={published ? "published" : "draft"}
          slug={slug}
          updatedAt={updatedAt}
          contentType="page"
          contentId={pageId}
          onRestore={handleRestore}
        />
      }
    >
      {error && <p className="text-red-600 text-sm mb-4">{error}</p>}

      <FormSection title="Page Title">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full px-3 py-2 border border-neutral-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
        />
      </FormSection>

      <FormSection title="Meta Description">
        <textarea
          value={metaDesc}
          onChange={(e) => setMetaDesc(e.target.value)}
          rows={2}
          className="w-full px-3 py-2 border border-neutral-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
        />
      </FormSection>

      <FormSection title="SEO" collapsible>
        <div className="mb-4">
          <label className="block text-xs font-medium text-neutral-500 mb-1">
            Meta Title
          </label>
          <input
            value={metaTitle}
            onChange={(e) => setMetaTitle(e.target.value)}
            placeholder="Override page title for search engines"
            className="w-full px-3 py-2 border border-neutral-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
          <p className="text-xs text-neutral-400 mt-1">
            {metaTitle.length}/60 characters
          </p>
        </div>
        <div>
          <label className="block text-xs font-medium text-neutral-500 mb-1">
            OG Image URL
          </label>
          <input
            value={ogImage}
            onChange={(e) => setOgImage(e.target.value)}
            placeholder="https://..."
            className="w-full px-3 py-2 border border-neutral-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
          {ogImage && (
            <img
              src={ogImage}
              alt="OG preview"
              className="mt-2 rounded-lg max-h-32 object-cover border border-neutral-200"
            />
          )}
        </div>
      </FormSection>

      {Object.entries(content).map(([sectionKey, sectionData]) => {
        const section = sectionData as Record<string, unknown>;
        return (
          <FormSection
            key={sectionKey}
            title={sectionKey.replace(/([A-Z])/g, " $1").trim()}
            collapsible
          >
            {Object.entries(section).map(([field, value]) => {
              if (typeof value === "string") {
                const isLong = value.length > 120;
                return (
                  <div key={field} className="mb-4 last:mb-0">
                    <label className="block text-xs font-medium text-neutral-500 mb-1">
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
                        className="w-full px-3 py-2 border border-neutral-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                    )}
                  </div>
                );
              }
              if (Array.isArray(value)) {
                return (
                  <div key={field} className="mb-4 last:mb-0">
                    <label className="block text-xs font-medium text-neutral-500 mb-1">
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
                      className="w-full px-3 py-2 border border-neutral-300 rounded-lg text-sm font-mono focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                );
              }
              return null;
            })}
          </FormSection>
        );
      })}
    </EditorLayout>
  );
}
