"use client";

import { useEffect, useState } from "react";
import RichTextEditor from "../components/RichTextEditor";
import Breadcrumbs from "../components/Breadcrumbs";
import StatusBadge from "../components/StatusBadge";
import { Plus, Pencil, Trash2, Copy, Check } from "lucide-react";

interface FAQ {
  id: number;
  category: string;
  question: string;
  answer: string;
  sort_order: number;
  published: number;
}

export default function FAQAdmin() {
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [editing, setEditing] = useState<number | null>(null);
  const [editQ, setEditQ] = useState("");
  const [editA, setEditA] = useState("");
  const [editCat, setEditCat] = useState("");
  const [editPublished, setEditPublished] = useState(true);
  const [showNew, setShowNew] = useState(false);
  const [newQ, setNewQ] = useState("");
  const [newA, setNewA] = useState("");
  const [newCat, setNewCat] = useState("");
  const [copiedNew, setCopiedNew] = useState(false);
  const [copiedEdit, setCopiedEdit] = useState(false);

  const copyAnswer = (text: string, which: "new" | "edit") => {
    const plain = text.replace(/<[^>]+>/g, "").trim();
    navigator.clipboard.writeText(plain);
    if (which === "new") { setCopiedNew(true); setTimeout(() => setCopiedNew(false), 2000); }
    else { setCopiedEdit(true); setTimeout(() => setCopiedEdit(false), 2000); }
  };

  const load = () => {
    fetch("/api/faqs")
      .then((r) => r.json())
      .then((data) => setFaqs(Array.isArray(data) ? data : []));
  };

  useEffect(() => {
    load();
  }, []);

  const startEdit = (faq: FAQ) => {
    setEditing(faq.id);
    setEditQ(faq.question);
    setEditA(faq.answer);
    setEditCat(faq.category);
    setEditPublished(!!faq.published);
  };

  const saveEdit = async (id: number) => {
    await fetch(`/api/faqs/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        question: editQ,
        answer: editA,
        category: editCat,
        published: editPublished,
      }),
    });
    setEditing(null);
    load();
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this FAQ?")) return;
    await fetch(`/api/faqs/${id}`, { method: "DELETE" });
    load();
  };

  const handleCreate = async () => {
    if (!newQ || !newA) return;
    await fetch("/api/faqs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        question: newQ,
        answer: newA,
        category: newCat,
      }),
    });
    setNewQ("");
    setNewA("");
    setNewCat("");
    setShowNew(false);
    load();
  };

  const categories = [...new Set(faqs.map((f) => f.category))];

  return (
    <div className="max-w-3xl">
      <Breadcrumbs items={[{ label: "Admin", href: "/admin" }, { label: "FAQ" }]} />
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-semibold text-neutral-900">FAQs</h1>
          <p className="text-xs text-neutral-400 mt-1">
            {faqs.length} question{faqs.length !== 1 ? "s" : ""} across{" "}
            {categories.length} categor{categories.length !== 1 ? "ies" : "y"}
          </p>
        </div>
        <button
          onClick={() => setShowNew(!showNew)}
          className="flex items-center gap-1.5 px-4 py-2 bg-teal-600 text-white text-sm rounded-lg hover:bg-teal-700 transition"
        >
          {showNew ? (
            "Cancel"
          ) : (
            <>
              <Plus className="w-4 h-4" />
              New FAQ
            </>
          )}
        </button>
      </div>

      {showNew && (
        <div className="bg-white border border-neutral-200 rounded-lg shadow-sm p-5 mb-6 space-y-3">
          <div>
            <label className="block text-xs font-medium text-neutral-500 mb-1">
              Category
            </label>
            <input
              value={newCat}
              onChange={(e) => setNewCat(e.target.value)}
              placeholder="e.g. Getting Started"
              className="w-full px-3 py-2 border border-neutral-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-neutral-500 mb-1">
              Question
            </label>
            <input
              value={newQ}
              onChange={(e) => setNewQ(e.target.value)}
              className="w-full px-3 py-2 border border-neutral-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-medium text-neutral-500">
                Answer
              </label>
              {newA && (
                <button onClick={() => copyAnswer(newA, "new")} className="flex items-center gap-1 text-xs text-neutral-400 hover:text-neutral-700 transition">
                  {copiedNew ? <Check className="w-3 h-3 text-teal-600" /> : <Copy className="w-3 h-3" />}
                  {copiedNew ? "Copied" : "Copy"}
                </button>
              )}
            </div>
            <RichTextEditor
              content={newA}
              onChange={(html) => setNewA(html)}
              placeholder="Write the answer..."
            />
          </div>
          <button
            onClick={handleCreate}
            className="px-4 py-2 bg-teal-600 text-white text-sm rounded-lg hover:bg-teal-700 transition"
          >
            Create FAQ
          </button>
        </div>
      )}

      {categories.map((cat) => (
        <div key={cat} className="mb-8">
          <h2 className="text-[10px] font-semibold uppercase tracking-widest text-neutral-400 mb-3 px-1">
            {cat}
          </h2>
          <div className="space-y-2">
            {faqs
              .filter((f) => f.category === cat)
              .map((faq) =>
                editing === faq.id ? (
                  <div
                    key={faq.id}
                    className="bg-white border border-teal-200 rounded-lg shadow-sm p-5 space-y-3"
                  >
                    <input
                      value={editCat}
                      onChange={(e) => setEditCat(e.target.value)}
                      placeholder="Category"
                      className="w-full px-3 py-2 border border-neutral-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                    <input
                      value={editQ}
                      onChange={(e) => setEditQ(e.target.value)}
                      placeholder="Question"
                      className="w-full px-3 py-2 border border-neutral-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-medium text-neutral-500">Answer</span>
                      {editA && (
                        <button onClick={() => copyAnswer(editA, "edit")} className="flex items-center gap-1 text-xs text-neutral-400 hover:text-neutral-700 transition">
                          {copiedEdit ? <Check className="w-3 h-3 text-teal-600" /> : <Copy className="w-3 h-3" />}
                          {copiedEdit ? "Copied" : "Copy"}
                        </button>
                      )}
                    </div>
                    <RichTextEditor
                      content={editA}
                      onChange={(html) => setEditA(html)}
                    />
                    <label className="flex items-center gap-2 text-xs text-neutral-600">
                      <input
                        type="checkbox"
                        checked={editPublished}
                        onChange={(e) => setEditPublished(e.target.checked)}
                        className="rounded border-neutral-300"
                      />
                      Published
                    </label>
                    <div className="flex gap-2">
                      <button
                        onClick={() => saveEdit(faq.id)}
                        className="px-3 py-1.5 bg-teal-600 text-white text-xs rounded-lg hover:bg-teal-700 transition"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setEditing(null)}
                        className="px-3 py-1.5 text-neutral-500 text-xs hover:text-neutral-700"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div
                    key={faq.id}
                    className="bg-white border border-neutral-200 rounded-lg shadow-sm px-5 py-4"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1 mr-4">
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-medium text-neutral-900">
                            {faq.question}
                          </p>
                          {!faq.published && <StatusBadge status="draft" />}
                        </div>
                        <p className="text-xs text-neutral-500 mt-1 line-clamp-2">
                          {faq.answer.replace(/<[^>]*>/g, "").slice(0, 120)}
                        </p>
                      </div>
                      <div className="flex gap-1">
                        <button
                          onClick={() => startEdit(faq)}
                          className="p-1.5 text-neutral-400 hover:text-neutral-600 rounded hover:bg-neutral-50 transition"
                          title="Edit"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(faq.id)}
                          className="p-1.5 text-neutral-400 hover:text-red-600 rounded hover:bg-neutral-50 transition"
                          title="Delete"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                )
              )}
          </div>
        </div>
      ))}
    </div>
  );
}
