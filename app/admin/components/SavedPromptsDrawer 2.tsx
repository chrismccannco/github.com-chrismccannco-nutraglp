"use client";

import { useState, useEffect, useRef } from "react";
import { BookOpen, Plus, Trash2, Check, X, Search, ChevronDown } from "lucide-react";

export interface SavedPrompt {
  id: number;
  title: string;
  prompt: string;
  category: string;
  created_at: string;
}

interface SavedPromptsDrawerProps {
  /** Called when user clicks "Use" on a prompt */
  onSelect: (prompt: string) => void;
  /** Current textarea value — offered for saving */
  currentPrompt?: string;
}

const CATEGORIES = ["general", "blog", "social", "email", "seo", "product", "other"];

export default function SavedPromptsDrawer({ onSelect, currentPrompt }: SavedPromptsDrawerProps) {
  const [open, setOpen] = useState(false);
  const [prompts, setPrompts] = useState<SavedPrompt[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [filterCat, setFilterCat] = useState("all");

  // Save-new form
  const [saving, setSaving] = useState(false);
  const [showSaveForm, setShowSaveForm] = useState(false);
  const [saveTitle, setSaveTitle] = useState("");
  const [savePromptText, setSavePromptText] = useState("");
  const [saveCat, setSaveCat] = useState("general");
  const [saveMsg, setSaveMsg] = useState("");

  // Edit inline
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editPrompt, setEditPrompt] = useState("");

  const drawerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    setLoading(true);
    fetch("/api/prompts")
      .then((r) => r.json())
      .then((d) => setPrompts(d.prompts ?? []))
      .finally(() => setLoading(false));
  }, [open]);

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    function handleClick(e: MouseEvent) {
      if (drawerRef.current && !drawerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  const filtered = prompts.filter((p) => {
    const matchCat = filterCat === "all" || p.category === filterCat;
    const matchSearch =
      !search ||
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.prompt.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  async function handleSave() {
    if (!saveTitle.trim() || !savePromptText.trim()) return;
    setSaving(true);
    setSaveMsg("");
    try {
      const res = await fetch("/api/prompts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: saveTitle, prompt: savePromptText, category: saveCat }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setPrompts((prev) => [data.prompt, ...prev]);
      setSaveTitle("");
      setSavePromptText("");
      setSaveCat("general");
      setShowSaveForm(false);
      setSaveMsg("Saved.");
      setTimeout(() => setSaveMsg(""), 2000);
    } catch (e) {
      setSaveMsg("Save failed.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: number) {
    await fetch(`/api/prompts/${id}`, { method: "DELETE" });
    setPrompts((prev) => prev.filter((p) => p.id !== id));
  }

  async function handleEditSave(id: number) {
    const res = await fetch(`/api/prompts/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: editTitle, prompt: editPrompt }),
    });
    if (res.ok) {
      setPrompts((prev) =>
        prev.map((p) => (p.id === id ? { ...p, title: editTitle, prompt: editPrompt } : p))
      );
      setEditingId(null);
    }
  }

  function openSaveForm() {
    setSavePromptText(currentPrompt ?? "");
    setSaveTitle("");
    setSaveCat("general");
    setShowSaveForm(true);
  }

  return (
    <div className="relative" ref={drawerRef}>
      {/* Trigger button */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        title="Saved prompts"
        className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs text-teal-700 bg-white border border-teal-200 rounded-lg hover:bg-teal-50 transition-colors"
      >
        <BookOpen className="w-3.5 h-3.5" />
        <span className="hidden sm:inline">Prompts</span>
        <ChevronDown className={`w-3 h-3 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {/* Dropdown panel */}
      {open && (
        <div className="absolute right-0 top-full mt-1.5 w-80 bg-white border border-neutral-200 rounded-xl shadow-lg z-50 flex flex-col max-h-[480px]">
          {/* Header */}
          <div className="flex items-center justify-between px-3 py-2.5 border-b border-neutral-100">
            <span className="text-xs font-semibold text-neutral-700">Saved Prompts</span>
            <div className="flex items-center gap-1.5">
              {saveMsg && <span className="text-xs text-teal-600">{saveMsg}</span>}
              <button
                type="button"
                onClick={openSaveForm}
                className="flex items-center gap-1 px-2 py-1 text-xs text-teal-700 bg-teal-50 border border-teal-200 rounded-lg hover:bg-teal-100 transition-colors"
              >
                <Plus className="w-3 h-3" />
                Save current
              </button>
            </div>
          </div>

          {/* Save form */}
          {showSaveForm && (
            <div className="px-3 py-2.5 border-b border-neutral-100 bg-teal-50/40">
              <input
                type="text"
                placeholder="Prompt title"
                value={saveTitle}
                onChange={(e) => setSaveTitle(e.target.value)}
                className="w-full px-2.5 py-1.5 text-xs border border-neutral-300 rounded-lg mb-1.5 focus:outline-none focus:ring-1 focus:ring-teal-400"
              />
              <textarea
                placeholder="Prompt text"
                value={savePromptText}
                onChange={(e) => setSavePromptText(e.target.value)}
                rows={3}
                className="w-full px-2.5 py-1.5 text-xs border border-neutral-300 rounded-lg mb-1.5 resize-none focus:outline-none focus:ring-1 focus:ring-teal-400"
              />
              <div className="flex items-center gap-2">
                <select
                  value={saveCat}
                  onChange={(e) => setSaveCat(e.target.value)}
                  className="flex-1 px-2 py-1.5 text-xs border border-neutral-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-teal-400 bg-white"
                >
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={handleSave}
                  disabled={saving || !saveTitle.trim() || !savePromptText.trim()}
                  className="px-3 py-1.5 text-xs bg-teal-600 text-white rounded-lg hover:bg-teal-700 disabled:opacity-50 transition-colors"
                >
                  {saving ? "Saving…" : "Save"}
                </button>
                <button
                  type="button"
                  onClick={() => setShowSaveForm(false)}
                  className="p-1.5 text-neutral-400 hover:text-neutral-600 rounded-lg"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* Search + filter */}
          <div className="flex items-center gap-1.5 px-3 py-2 border-b border-neutral-100">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-3 h-3 text-neutral-400" />
              <input
                type="text"
                placeholder="Search…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-6 pr-2 py-1.5 text-xs border border-neutral-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-teal-400"
              />
            </div>
            <select
              value={filterCat}
              onChange={(e) => setFilterCat(e.target.value)}
              className="px-2 py-1.5 text-xs border border-neutral-200 rounded-lg focus:outline-none bg-white"
            >
              <option value="all">All</option>
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          {/* List */}
          <div className="overflow-y-auto flex-1">
            {loading && (
              <div className="text-xs text-neutral-400 text-center py-6">Loading…</div>
            )}
            {!loading && filtered.length === 0 && (
              <div className="text-xs text-neutral-400 text-center py-6">
                {prompts.length === 0 ? "No saved prompts yet." : "No matches."}
              </div>
            )}
            {filtered.map((p) => (
              <div
                key={p.id}
                className="px-3 py-2.5 border-b border-neutral-50 hover:bg-neutral-50 group"
              >
                {editingId === p.id ? (
                  <div className="space-y-1.5">
                    <input
                      type="text"
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      className="w-full px-2 py-1 text-xs border border-neutral-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-teal-400"
                    />
                    <textarea
                      value={editPrompt}
                      onChange={(e) => setEditPrompt(e.target.value)}
                      rows={3}
                      className="w-full px-2 py-1 text-xs border border-neutral-300 rounded-lg resize-none focus:outline-none focus:ring-1 focus:ring-teal-400"
                    />
                    <div className="flex gap-1.5">
                      <button
                        type="button"
                        onClick={() => handleEditSave(p.id)}
                        className="flex items-center gap-1 px-2 py-1 text-xs bg-teal-600 text-white rounded-lg"
                      >
                        <Check className="w-3 h-3" /> Save
                      </button>
                      <button
                        type="button"
                        onClick={() => setEditingId(null)}
                        className="flex items-center gap-1 px-2 py-1 text-xs bg-neutral-100 text-neutral-600 rounded-lg"
                      >
                        <X className="w-3 h-3" /> Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-start gap-2">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 mb-0.5">
                        <span className="text-xs font-medium text-neutral-800 truncate">{p.title}</span>
                        {p.category && p.category !== "general" && (
                          <span className="text-[10px] px-1.5 py-0.5 bg-neutral-100 text-neutral-500 rounded-full flex-shrink-0">
                            {p.category}
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-neutral-500 line-clamp-2 leading-relaxed">{p.prompt}</p>
                    </div>
                    <div className="flex items-center gap-1 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        type="button"
                        onClick={() => {
                          onSelect(p.prompt);
                          setOpen(false);
                        }}
                        className="px-2 py-1 text-[11px] text-white bg-teal-600 rounded-lg hover:bg-teal-700 transition-colors"
                      >
                        Use
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setEditingId(p.id);
                          setEditTitle(p.title);
                          setEditPrompt(p.prompt);
                        }}
                        className="p-1 text-neutral-400 hover:text-neutral-600 rounded"
                        title="Edit"
                      >
                        <Check className="w-3 h-3" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(p.id)}
                        className="p-1 text-neutral-400 hover:text-red-500 rounded"
                        title="Delete"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
