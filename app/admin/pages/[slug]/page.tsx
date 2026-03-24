"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import EditorLayout from "../../components/EditorLayout";
import MetadataPanel from "../../components/MetadataPanel";
import FormSection from "../../components/FormSection";
import FormActions from "../../components/FormActions";
import AutosaveIndicator from "../../components/AutosaveIndicator";
import WorkflowPanel from "../../components/WorkflowPanel";
import { useAutosave } from "../../hooks/useAutosave";
import { useAuth } from "../../layout";
import BlockEditor from "../../components/blocks/BlockEditor";
import AiAssistPanel from "../../components/AiAssistPanel";
import type { AiAssistResult } from "../../components/AiAssistPanel";
import SharePreviewButton from "../../components/SharePreviewButton";
import type { Block } from "@/lib/types/blocks";

export default function EditPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const slug = params.slug as string;

  const [pageId, setPageId] = useState<number | null>(null);
  const [page, setPage] = useState<Record<string, unknown> | null>(null);
  const [title, setTitle] = useState("");
  const [metaDesc, setMetaDesc] = useState("");
  const [metaTitle, setMetaTitle] = useState("");
  const [ogImage, setOgImage] = useState("");
  const [blocks, setBlocks] = useState<Block[]>([]);
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
        setBlocks(data.blocks || []);
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
    blocks,
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
  }, [slug, title, metaDesc, metaTitle, ogImage, blocks, content, published, page]);

  const autosaveStatus = useAutosave(autoSaveFn, [title, metaDesc, metaTitle, ogImage, blocks]);

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
            version_data: { title, meta_description: metaDesc, meta_title: metaTitle, og_image: ogImage, blocks },
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
    if (data.meta_title !== undefined) setMetaTitle(data.meta_title as string);
    if (data.og_image !== undefined) setOgImage(data.og_image as string);
    if (data.blocks !== undefined) setBlocks(data.blocks as Block[]);
    if (data.content !== undefined) setContent(data.content as Record<string, unknown>);
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

  if (!page) return <p className="text-sm text-neutral-400">Loading&hellip;</p>;

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
          <button
            onClick={() => {
              if (published) handleSaveDraft();
              else handlePublish();
            }}
            className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-full transition ${
              published
                ? "bg-teal-50 text-teal-700 hover:bg-teal-100"
                : "bg-amber-50 text-amber-700 hover:bg-amber-100"
            }`}
            title={published ? "Click to unpublish" : "Click to publish"}
          >
            <span className={`w-1.5 h-1.5 rounded-full ${published ? "bg-teal-500" : "bg-amber-500"}`} />
            {published ? "Live" : "Draft"}
          </button>
          <a
            href={`/preview/${slug}`}
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-1.5 text-xs border border-neutral-300 rounded-lg text-neutral-600 hover:bg-neutral-50 transition"
          >
            Preview
          </a>
          <SharePreviewButton contentType="page" slug={slug} />
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
        <>
          <WorkflowPanel
            contentType="page"
            contentId={pageId}
            currentUserName={user?.name || user?.email || "Unknown"}
            currentUserRole={user?.role || "viewer"}
            published={published}
            onPublish={handlePublish}
          />
          <MetadataPanel
            status={published ? "published" : "draft"}
            slug={slug}
            updatedAt={updatedAt}
            contentType="page"
            contentId={pageId}
            onRestore={handleRestore}
          />
        </>
      }
    >
      {error && <p className="text-red-600 text-sm mb-4">{error}</p>}

      <FormSection title="Page Title">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full px-3 py-2 border border-neutral-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
        />
      </FormSection>

      <FormSection title="SEO" collapsible defaultOpen={false}>
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-neutral-500 mb-1">Meta Description</label>
            <textarea
              value={metaDesc}
              onChange={(e) => setMetaDesc(e.target.value)}
              rows={2}
              className="w-full px-3 py-2 border border-neutral-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-neutral-500 mb-1">Meta Title</label>
            <input
              value={metaTitle}
              onChange={(e) => setMetaTitle(e.target.value)}
              placeholder="Override page title for search engines"
              className="w-full px-3 py-2 border border-neutral-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
            <p className="text-xs text-neutral-400 mt-1">{metaTitle.length}/60 characters</p>
          </div>
          <div>
            <label className="block text-xs font-medium text-neutral-500 mb-1">OG Image URL</label>
            <input
              value={ogImage}
              onChange={(e) => setOgImage(e.target.value)}
              placeholder="https://..."
              className="w-full px-3 py-2 border border-neutral-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
            {ogImage && (
              <img src={ogImage} alt="OG preview" className="mt-2 rounded-lg max-h-32 object-cover border border-neutral-200" />
            )}
          </div>
        </div>
      </FormSection>

      <div className="mb-4">
        <AiAssistPanel
          contentType="page"
          placeholder="e.g. Create a landing page for our new product launch, or Write an FAQ page about onboarding"
          buttonLabel="Generate"
          onResult={(data: AiAssistResult) => {
            if (data.title) setTitle(data.title as string);
            if (data.meta_description) setMetaDesc(data.meta_description as string);
            if (data.meta_title) setMetaTitle(data.meta_title as string);
            if (data.sections && Array.isArray(data.sections)) {
              // Convert AI sections to rich_text blocks
              const newBlocks: Block[] = (data.sections as { heading: string; body: string }[]).map((s, i) => ({
                id: `rt_${Math.random().toString(36).slice(2, 8)}`,
                type: "rich_text" as const,
                order: i,
                data: { html: `<h2>${s.heading}</h2>${s.body}` },
              }));
              setBlocks(newBlocks);
            }
          }}
        />
      </div>

      <div className="mt-6">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-neutral-500 mb-3">
          Page Content
        </h2>
        <BlockEditor blocks={blocks} onChange={setBlocks} pageTitle={title} />
      </div>
    </EditorLayout>
  );
}
