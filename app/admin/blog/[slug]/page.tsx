"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import RichTextEditor from "../../components/RichTextEditor";
import ImageUploadModal from "../../components/ImageUploadModal";
import VersionHistory from "../../components/VersionHistory";

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
  const [published, setPublished] = useState(true);
  const [sections, setSections] = useState<Section[]>([]);
  const [relatedSlugs, setRelatedSlugs] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [showHistory, setShowHistory] = useState(false);

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
        setPublished(!!data.published);
        const rawSections = data.sections || [];
        setSections(
          rawSections.map((s: { heading: string; body: unknown }) => ({
            heading: s.heading,
            body: migrateBody(s.body),
          }))
        );
        setRelatedSlugs((data.related_slugs || []).join(", "));
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
    published: pub,
    sections,
    related_slugs: relatedSlugs
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean),
  });

  const handleSaveDraft = async () => {
    setSaving(true);
    const res = await fetch(`/api/blog/${slug}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(buildPayload(false)),
    });
    setSaving(false);
    if (res.ok) {
      setPublished(false);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    }
  };

  const handlePublish = async () => {
    setSaving(true);
    const res = await fetch(`/api/blog/${slug}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(buildPayload(true)),
    });
    if (res.ok) {
      setPublished(true);
      // Create version snapshot
      if (postId) {
        await fetch("/api/versions", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            content_type: "blog_post",
            content_id: postId,
            version_data: { title, description, date, read_time: readTime, tag, gradient, featured_image: featuredImage, sections, related_slugs: relatedSlugs.split(",").map((s) => s.trim()).filter(Boolean) },
          }),
        });
      }
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    }
    setSaving(false);
  };

  const handleRestore = (data: Record<string, unknown>) => {
    if (data.title !== undefined) setTitle(data.title as string);
    if (data.description !== undefined) setDescription(data.description as string);
    if (data.date !== undefined) setDate(data.date as string);
    if (data.read_time !== undefined) setReadTime(data.read_time as string);
    if (data.tag !== undefined) setTag(data.tag as string);
    if (data.gradient !== undefined) setGradient(data.gradient as string);
    if (data.featured_image !== undefined) setFeaturedImage(data.featured_image as string);
    if (data.sections !== undefined) setSections(data.sections as Section[]);
    if (data.related_slugs !== undefined) setRelatedSlugs((data.related_slugs as string[]).join(", "));
    setShowHistory(false);
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

  if (!loaded) return <p className="text-sm text-gray-500">Loading...</p>;

  return (
    <div className="max-w-3xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <button
            onClick={() => router.push("/admin/blog")}
            className="text-xs text-gray-500 hover:text-gray-700 mb-1"
          >
            &larr; All posts
          </button>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-semibold text-gray-900">Edit post</h1>
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
        </div>
        <div className="flex items-center gap-2">
          {postId && (
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

      <div className="space-y-4">
        <div className="bg-white border border-gray-200 rounded-xl p-5 space-y-4">
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">
              Title
            </label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">
                Date
              </label>
              <input
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">
                Read time
              </label>
              <input
                value={readTime}
                onChange={(e) => setReadTime(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">
                Tag
              </label>
              <input
                value={tag}
                onChange={(e) => setTag(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">
                Gradient
              </label>
              <input
                value={gradient}
                onChange={(e) => setGradient(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">
              Featured image
            </label>
            <div className="flex gap-2">
              <input
                value={featuredImage}
                onChange={(e) => setFeaturedImage(e.target.value)}
                placeholder="Upload or paste URL"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
              <button
                type="button"
                onClick={() => setShowFeaturedImageModal(true)}
                className="px-3 py-2 bg-gray-100 text-gray-700 text-xs rounded-lg hover:bg-gray-200 transition"
              >
                Upload
              </button>
            </div>
            {featuredImage && (
              <img
                src={featuredImage}
                alt="Featured"
                className="mt-2 rounded-lg max-h-40 object-cover"
              />
            )}
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">
              Related slugs (comma-separated)
            </label>
            <input
              value={relatedSlugs}
              onChange={(e) => setRelatedSlugs(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
        </div>

        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">Sections</h2>
          <button
            onClick={addSection}
            className="text-xs text-emerald-700 hover:text-emerald-900 font-medium"
          >
            + Add section
          </button>
        </div>

        {sections.map((section, i) => (
          <div key={i} className="bg-white border border-gray-200 rounded-xl p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-gray-400 uppercase">
                Section {i + 1}
              </span>
              <button
                onClick={() => removeSection(i)}
                className="text-xs text-red-500 hover:text-red-700"
              >
                Remove
              </button>
            </div>
            <div className="mb-3">
              <label className="block text-xs font-medium text-gray-500 mb-1">
                Heading
              </label>
              <input
                value={section.heading}
                onChange={(e) => updateSectionHeading(i, e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">
                Body
              </label>
              <RichTextEditor
                content={section.body}
                onChange={(html) => updateSectionBody(i, html)}
              />
            </div>
          </div>
        ))}
      </div>

      {showFeaturedImageModal && (
        <ImageUploadModal
          onInsert={(url) => {
            setFeaturedImage(url);
            setShowFeaturedImageModal(false);
          }}
          onClose={() => setShowFeaturedImageModal(false)}
        />
      )}

      {showHistory && postId && (
        <VersionHistory
          contentType="blog_post"
          contentId={postId}
          onRestore={handleRestore}
          onClose={() => setShowHistory(false)}
        />
      )}
    </div>
  );
}
