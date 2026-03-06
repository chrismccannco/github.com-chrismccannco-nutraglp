"use client";

import { useEffect, useState } from "react";
import RichTextEditor from "../components/RichTextEditor";

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
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 mb-1">FAQs</h1>
          <p className="text-sm text-gray-500">
            {faqs.length} questions across {categories.length} categories
          </p>
        </div>
        <button
          onClick={() => setShowNew(!showNew)}
          className="px-4 py-2 bg-[#0f2d20] text-white text-sm rounded-lg hover:bg-[#1a4a33] transition"
        >
          {showNew ? "Cancel" : "New FAQ"}
        </button>
      </div>

      {showNew && (
        <div className="bg-white border border-gray-200 rounded-xl p-5 mb-6 space-y-3">
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">
              Category
            </label>
            <input
              value={newCat}
              onChange={(e) => setNewCat(e.target.value)}
              placeholder="e.g. GLP-1 Basics"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">
              Question
            </label>
            <input
              value={newQ}
              onChange={(e) => setNewQ(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">
              Answer
            </label>
            <RichTextEditor
              content={newA}
              onChange={(html) => setNewA(html)}
              placeholder="Write the answer..."
            />
          </div>
          <button
            onClick={handleCreate}
            className="px-4 py-2 bg-emerald-600 text-white text-sm rounded-lg hover:bg-emerald-700 transition"
          >
            Create FAQ
          </button>
        </div>
      )}

      {categories.map((cat) => (
        <div key={cat} className="mb-8">
          <h2 className="text-xs font-bold uppercase tracking-wider text-emerald-700 mb-3">
            {cat}
          </h2>
          <div className="space-y-2">
            {faqs
              .filter((f) => f.category === cat)
              .map((faq) =>
                editing === faq.id ? (
                  <div
                    key={faq.id}
                    className="bg-white border border-emerald-300 rounded-xl p-5 space-y-3"
                  >
                    <input
                      value={editCat}
                      onChange={(e) => setEditCat(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                    <input
                      value={editQ}
                      onChange={(e) => setEditQ(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                    <RichTextEditor
                      content={editA}
                      onChange={(html) => setEditA(html)}
                    />
                    <label className="flex items-center gap-2 text-xs text-gray-600">
                      <input
                        type="checkbox"
                        checked={editPublished}
                        onChange={(e) => setEditPublished(e.target.checked)}
                        className="rounded"
                      />
                      Published
                    </label>
                    <div className="flex gap-2">
                      <button
                        onClick={() => saveEdit(faq.id)}
                        className="px-3 py-1.5 bg-emerald-600 text-white text-xs rounded-lg"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setEditing(null)}
                        className="px-3 py-1.5 bg-gray-100 text-gray-700 text-xs rounded-lg"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div
                    key={faq.id}
                    className="bg-white border border-gray-200 rounded-xl px-5 py-4"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1 mr-4">
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-medium text-gray-900">
                            {faq.question}
                          </p>
                          {!faq.published && (
                            <span className="px-1.5 py-0.5 text-[9px] font-medium rounded bg-amber-100 text-amber-800">
                              Draft
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                          {faq.answer.replace(/<[^>]*>/g, "").slice(0, 120)}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => startEdit(faq)}
                          className="text-xs text-gray-500 hover:text-gray-700"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(faq.id)}
                          className="text-xs text-red-500 hover:text-red-700"
                        >
                          Delete
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
