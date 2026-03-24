"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import RichTextEditor from "../../components/RichTextEditor";
import ImageUploadModal from "../../components/ImageUploadModal";
import EditorLayout from "../../components/EditorLayout";
import MetadataPanel from "../../components/MetadataPanel";
import FormSection from "../../components/FormSection";
import FormActions from "../../components/FormActions";
import AutosaveIndicator from "../../components/AutosaveIndicator";
import WorkflowPanel from "../../components/WorkflowPanel";
import { useAutosave } from "../../hooks/useAutosave";
import { useAuth } from "../../layout";
import BlockEditor from "../../components/blocks/BlockEditor";
import type { Block } from "@/lib/types/blocks";
import { Plus, Trash2, RefreshCw } from "lucide-react";
import Link from "next/link";
import AiAssistPanel from "../../components/AiAssistPanel";
import type { AiAssistResult } from "../../components/AiAssistPanel";
import SharePreviewButton from "../../components/SharePreviewButton";
import DistributePanel from "../../components/DistributePanel";

interface Section {
  heading: string;
  body: string;
}

function migrateBody(body: unknown): string {
  if (typeof body === "string") return body;
  if (Array.isArray(body)) {
    return body.map((p: string) => `<p>${p}</p>`).join("");
  }
  return "";
}

export default function EditBlogPost() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const slug = params.slug as string;

  const [postId, setPostId] = useState<number | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [readTime, setReadTime] = useState("");
  const [tag, setTag] = useState("");
  const [gradient, setGradient] = useState("");
  const [featuredImage, setFeaturedImage] = useState("");
  const [showFeaturedImageModal, setShowFeaturedImageModal] = useState(false);
  const [metaTitle, setMetaTitle] = useState("");
  const [metaDescription, setMetaDescription] = useState("");
  const [ogImage, setOgImage] = useState("");
  const [published, setPublished] = useState(true);
  const [sections, setSections] = useState<Section[]>([]);
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [editorMode, setEditorMode] = useState<"sections" | "blocks">("sections");
  const [publishAt, setPublishAt] = useState("");
  const [relatedSlugs, setRelatedSlugs] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [updatedAt, setUpdatedAt] = useState("");

  useEffect(() => {
    fetch(`/api/blog/${slug}`)
      .then((r) => r.json())
      .then((data) => {
        setPostId(data.id || null);
        setTitle(data.title || "");
        setDescription(data.description || "");
        setDate(data.date || "");
        setReadTime(data.read_time || "");
        setTag(data.tag || "");
        setGradient(data.gradient || "");
        setFeaturedImage(data.featured_image || "");
        setMetaTitle(data.meta_title || "");
        setMetaDescription(data.meta_description || "");
        setOgImage(data.og_image || "");
        setPublished(!!data.published);
        setPublishAt(data.publish_at || "");
        setUpdatedAt(data.updated_at || "");
        const rawSections = data.sections || [];
        setSections(
          rawSections.map((s: { heading: string; body: unknown }) => ({
            heading: s.heading,
            body: migrateBody(s.body),
          }))
        );
        setRelatedSlugs((data.related_slugs || []).join(", "));
        const loadedBlocks = data.blocks || [];
        setBlocks(loadedBlocks);
        if (loadedBlocks.length > 0) setEditorMode("blocks");
        setLoaded(true);
      });
  }, [slug]);

  const buildPayload = (pub: boolean) => ({
    title,
    description,
    date,
    read_time: readTime,
    tag,
    gradient,
    featured_image: featuredImage,
    meta_title: metaTitle,
    meta_description: metaDescription,
    og_image: ogImage,
    published: pub,
    publish_at: publishAt || null,
    sections,
    blocks,
    related_slugs: relatedSlugs
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean),
  });

  const autoSaveFn = useCallback(async () => {
    if (!loaded) return;
    const res = await fetch(`/api/blog/${slug}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(buildPayload(published)),
    });
    if (!res.ok) throw new Error("Autosave failed");
    const data = await res.json();
    if (data.updated_at) setUpdatedAt(data.updated_at);
  }, [slug, title, description, date, readTime, tag, gradient, featuredImage, metaTitle, metaDescription, ogImage, published, publishAt, sections, blocks, relatedSlugs, loaded]);

  const autosaveStatus = useAutosave(autoSaveFn, [title, description, date, readTime, tag, gradient, featuredImage, metaTitle, metaDescription, ogImage, publishAt, sections, blocks, relatedSlugs]);

  const handleSaveDraft = async () => {
    setSaving(true);
    try {
      const res = await fetch(`/api/blog/${slug}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(buildPayload(false)),
      });
      if (!res.ok) throw new Error("Save failed");
      const data = await res.json();
      setPublished(false);
      if (data.updated_at) setUpdatedAt(data.updated_at);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch {
      /* handled by UI */
    } finally {
      setSaving(false);
    }
  };

  const handlePublish = async () => {
    setSaving(true);
    try {
      const res = await fetch(`/api/blog/${slug}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(buildPayload(true)),
      });
      if (!res.ok) throw new Error("Publish failed");
      const data = await res.json();
      setPublished(true);
      if (data.updated_at) setUpdatedAt(data.updated_at);
      if (postId) {
        await fetch("/api/versions", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            content_type: "blog_post",
            content_id: postId,
            version_data: buildPayload(true),
          }),
        });
      }
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch {
      /* handled by UI */
    } finally {
      setSaving(false);
    }
  };

  const handleRestore = (data: Record<string, unknown>) => {
    if (data.title !== undefined) setTitle(data.title as string);
    if (data.description !== undefined) setDescription(data.description as string);
    if (data.date !== undefined) setDate(data.date as string);
    if (data.read_time !== undefined) setReadTime(data.read_time as string);
    if (data.tag !== undefined) setTag(data.tag as string);
    if (data.gradient !== undefined) setGradient(data.gradient as string);
    if (data.featured_image !== undefined) setFeaturedImage(data.featured_image as string);
    if (data.meta_title !== undefined) setMetaTitle(data.meta_title as string);
    if (data.meta_description !== undefined) setMetaDescription(data.meta_description as string);
    if (data.og_image !== undefined) setOgImage(data.og_image as string);
    if (data.sections !== undefined) setSections(data.sections as Section[]);
    if (data.blocks !== undefined) setBlocks(data.blocks as Block[]);
    if (data.publish_at !== undefined) setPublishAt(data.publish_at as string);
    if (data.related_slugs !== undefined) setRelatedSlugs((data.related_slugs as string[]).join(", "));
  };

  const updateSectionHeading = (i: number, heading: string) => {
    setSections((prev) =>
      prev.map((s, idx) => (idx === i ? { ...s, heading } : s))
    );
  };

  const updateSectionBody = (i: number, body: string) => {
    setSections((prev) =>
      prev.map((s, idx) => (idx === i ? { ...s, body } : s))
    );
  };

  const addSection = () => {
    setSections((prev) => [...prev, { heading: "", body: "" }]);
  };

  const removeSection = (i: number) => {
    setSections((prev) => prev.filter((_, idx) => idx !== i));
  };

  if (!loaded)
    return <p className="text-sm text-neutral-400">Loading&hellip;</p>;

  return (
    <EditorLayout
      breadcrumbs={[
        { label: "Admin", href: "/admin" },
        { label: "Blog", href: "/admin/blog" },
        { label: title || slug },
      ]}
      title={title || "Untitled post"}
      actions={
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              if (published) handleSaveDraft();
              else handlePublish();
            }}
            className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-full transition ${
              publishAt && new Date(publishAt) > new Date()
                ? "bg-blue-50 text-blue-700 hover:bg-blue-100"
                : published
                  ? "bg-teal-50 text-teal-700 hover:bg-teal-100"
                  : "bg-amber-50 text-amber-700 hover:bg-amber-100"
            }`}
            title={published ? "Click to unpublish" : "Click to publish"}
          >
            <span className={`w-1.5 h-1.5 rounded-full ${
              publishAt && new Date(publishAt) > new Date()
                ? "bg-blue-500"
                : published ? "bg-teal-500" : "bg-amber-500"
            }`} />
            {publishAt && new Date(publishAt) > new Date()
              ? "Scheduled"
              : published ? "Live" : "Draft"}
          </button>
          <a
            href={`/preview/blog/${slug}`}
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-1.5 text-xs border border-neutral-300 rounded-lg text-neutral-600 hover:bg-neutral-50 transition"
          >
            Preview
          </a>
          <SharePreviewButton contentType="blog_post" slug={slug} />
          <Link
            href={`/admin/repurpose?from=${slug}`}
            className="px-3 py-1.5 text-xs font-medium text-neutral-600 bg-neutral-100 rounded-lg hover:bg-neutral-200 transition-colors no-underline flex items-center gap-1.5"
          >
            <RefreshCw size={12} />
            Repurpose
          </Link>
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
            contentType="blog_post"
            contentId={postId}
            currentUserName={user?.name || user?.email || "Unknown"}
            currentUserRole={user?.role || "viewer"}
            published={published}
            onPublish={handlePublish}
          />
          <MetadataPanel
            status={published ? "published" : "draft"}
            slug={slug}
            updatedAt={updatedAt}
            contentType="blog_post"
            contentId={postId}
            onRestore={handleRestore}
          >
            {readTime && (
              <div className="bg-white border border-neutral-200 rounded-lg shadow-sm p-4">
                <span className="text-xs text-neutral-400">Read time</span>{" "}
                <span className="text-xs text-neutral-700 font-medium">{readTime}</span>
              </div>
            )}
          </MetadataPanel>
          <DistributePanel
            title={title}
            postUrl={published ? `${typeof window !== "undefined" ? window.location.origin : ""}/blog/${slug}` : undefined}
            excerpt={metaDescription || description}
            published={published}
          />
        </>
      }
    >
      <FormSection title="Post Details">
        <div className="mb-4">
          <label className="block text-xs font-medium text-neutral-500 mb-1">
            Title
          </label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-3 py-2 border border-neutral-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
        </div>
        <div className="mb-4">
          <label className="block text-xs font-medium text-neutral-500 mb-1">
            Description
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={2}
            className="w-full px-3 py-2 border border-neutral-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
        </div>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-xs font-medium text-neutral-500 mb-1">
              Date
            </label>
            <input
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full px-3 py-2 border border-neutral-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-neutral-500 mb-1">
              Read time
            </label>
            <input
              value={readTime}
              onChange={(e) => setReadTime(e.target.value)}
              className="w-full px-3 py-2 border border-neutral-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-neutral-500 mb-1">
              Tag
            </label>
            <input
              value={tag}
              onChange={(e) => setTag(e.target.value)}
              className="w-full px-3 py-2 border border-neutral-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-neutral-500 mb-1">
              Gradient
            </label>
            <input
              value={gradient}
              onChange={(e) => setGradient(e.target.value)}
              className="w-full px-3 py-2 border border-neutral-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>
        </div>
      </FormSection>

      <FormSection title="Scheduling" collapsible defaultOpen={!!publishAt}>
        <div>
          <label className="block text-xs font-medium text-neutral-500 mb-1">
            Publish at
          </label>
          <input
            type="datetime-local"
            value={publishAt ? publishAt.slice(0, 16) : ""}
            onChange={(e) => setPublishAt(e.target.value ? new Date(e.target.value).toISOString() : "")}
            className="w-full px-3 py-2 border border-neutral-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
          <p className="text-xs text-neutral-400 mt-1">
            {publishAt
              ? `Scheduled for ${new Date(publishAt).toLocaleString()}`
              : "Leave empty to publish immediately when status is Live"}
          </p>
          {publishAt && (
            <button
              type="button"
              onClick={() => setPublishAt("")}
              className="mt-2 text-xs text-red-500 hover:text-red-600"
            >
              Clear schedule
            </button>
          )}
        </div>
      </FormSection>

      <FormSection title="Featured Image">
        <div className="flex gap-2 mb-2">
          <input
            value={featuredImage}
            onChange={(e) => setFeaturedImage(e.target.value)}
            placeholder="Upload or paste URL"
            className="flex-1 px-3 py-2 border border-neutral-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
          <button
            type="button"
            onClick={() => setShowFeaturedImageModal(true)}
            className="px-3 py-2 bg-neutral-100 text-neutral-700 text-xs rounded-lg hover:bg-neutral-200 transition"
          >
            Upload
          </button>
        </div>
        {featuredImage && (
          <img
            src={featuredImage}
            alt="Featured"
            className="rounded-lg max-h-40 object-cover"
          />
        )}
      </FormSection>

      <FormSection title="Related Posts">
        <label className="block text-xs font-medium text-neutral-500 mb-1">
          Slugs (comma-separated)
        </label>
        <input
          value={relatedSlugs}
          onChange={(e) => setRelatedSlugs(e.target.value)}
          className="w-full px-3 py-2 border border-neutral-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
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
            placeholder="Override post title for search engines"
            className="w-full px-3 py-2 border border-neutral-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
          <p className="text-xs text-neutral-400 mt-1">
            {metaTitle.length}/60 characters
          </p>
        </div>
        <div className="mb-4">
          <label className="block text-xs font-medium text-neutral-500 mb-1">
            Meta Description (SEO)
          </label>
          <textarea
            value={metaDescription}
            onChange={(e) => setMetaDescription(e.target.value)}
            rows={2}
            placeholder="Override post description for search engines"
            className="w-full px-3 py-2 border border-neutral-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
          <p className="text-xs text-neutral-400 mt-1">
            {metaDescription.length}/160 characters
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
            className="w-full px-3 py-2 border border-neutral-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
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

      <div className="mb-4">
        <AiAssistPanel
          contentType="blog_rewrite"
          placeholder="e.g. Make the tone more conversational, add a section about side effects, rewrite for the cost-conscious buyer"
          buttonLabel="Rewrite"
          existingContent={sections.map((s) => `## ${s.heading}\n${s.body}`).join("\n\n")}
          onResult={(data: AiAssistResult) => {
            if (data.title) setTitle(data.title as string);
            if (data.description) setDescription(data.description as string);
            if (data.sections && Array.isArray(data.sections)) {
              setSections(
                (data.sections as { heading: string; body: string }[]).map((s) => ({
                  heading: s.heading,
                  body: s.body,
                }))
              );
            }
          }}
        />
      </div>

      <div className="flex items-center justify-between mt-2 mb-3">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
          Content
        </h2>
        <div className="flex items-center gap-1 bg-neutral-100 rounded-md p-0.5">
          <button
            onClick={() => setEditorMode("sections")}
            className={`px-3 py-1 text-xs font-medium rounded transition ${
              editorMode === "sections"
                ? "bg-white text-neutral-900 shadow-sm"
                : "text-neutral-500 hover:text-neutral-700"
            }`}
          >
            Sections
          </button>
          <button
            onClick={() => setEditorMode("blocks")}
            className={`px-3 py-1 text-xs font-medium rounded transition ${
              editorMode === "blocks"
                ? "bg-white text-neutral-900 shadow-sm"
                : "text-neutral-500 hover:text-neutral-700"
            }`}
          >
            Blocks
          </button>
        </div>
      </div>

      {editorMode === "blocks" ? (
        <BlockEditor blocks={blocks} onChange={setBlocks} pageTitle={title} />
      ) : (
        <>
          <div className="flex items-center justify-end mb-1">
            <button
              onClick={addSection}
              className="flex items-center gap-1 text-xs text-teal-600 hover:text-teal-700 font-medium"
            >
              <Plus className="w-3.5 h-3.5" />
              Add section
            </button>
          </div>

          {sections.map((section, i) => (
            <FormSection key={i} title={`Section ${i + 1}`} collapsible>
              <div className="flex items-center justify-between mb-3">
                <label className="block text-xs font-medium text-neutral-500">
                  Heading
                </label>
                <button
                  onClick={() => removeSection(i)}
                  className="p-1 text-neutral-400 hover:text-red-600 rounded hover:bg-neutral-50 transition"
                  title="Remove section"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
              <input
                value={section.heading}
                onChange={(e) => updateSectionHeading(i, e.target.value)}
                className="w-full px-3 py-2 border border-neutral-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 mb-3"
              />
              <label className="block text-xs font-medium text-neutral-500 mb-1">
                Body
              </label>
              <RichTextEditor
                content={section.body}
                onChange={(html) => updateSectionBody(i, html)}
              />
            </FormSection>
          ))}
        </>
      )}

      {showFeaturedImageModal && (
        <ImageUploadModal
          onInsert={(url) => {
            setFeaturedImage(url);
            setShowFeaturedImageModal(false);
          }}
          onClose={() => setShowFeaturedImageModal(false)}
        />
      )}
    </EditorLayout>
  );
}
