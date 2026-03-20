"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Plus, FileInput, Inbox, Trash2, ExternalLink } from "lucide-react";

interface FormRow {
  id: number;
  slug: string;
  name: string;
  description: string | null;
  published: number;
  submission_count: number;
  created_at: string;
  updated_at: string;
}

export default function FormListPage() {
  const router = useRouter();
  const [forms, setForms] = useState<FormRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [newName, setNewName] = useState("");

  const load = () => {
    setLoading(true);
    fetch("/api/form-builder")
      .then((r) => r.json())
      .then((data) => setForms(Array.isArray(data) ? data : []))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const handleCreate = async () => {
    if (!newName.trim()) return;
    setCreating(true);
    try {
      const res = await fetch("/api/form-builder", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newName.trim() }),
      });
      const data = await res.json();
      if (data.slug) {
        router.push(`/admin/form-builder/${data.slug}`);
      }
    } catch {
      setCreating(false);
    }
  };

  const handleDelete = async (slug: string) => {
    if (!confirm("Delete this form and all its submissions?")) return;
    await fetch(`/api/form-builder/${slug}`, { method: "DELETE" });
    load();
  };

  return (
    <div className="max-w-4xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-semibold text-neutral-900 flex items-center gap-2">
            <FileInput className="w-5 h-5 text-indigo-600" />
            Form Builder
          </h1>
          <p className="text-sm text-neutral-500 mt-1">
            Create forms with conditional logic and track submissions
          </p>
        </div>
      </div>

      {/* Create form */}
      <div className="bg-white border border-neutral-200 rounded-xl p-4 mb-6 flex items-center gap-3">
        <input
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          placeholder="New form name..."
          className="flex-1 px-3 py-2 text-sm border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          onKeyDown={(e) => e.key === "Enter" && handleCreate()}
        />
        <button
          onClick={handleCreate}
          disabled={creating || !newName.trim()}
          className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition disabled:opacity-50"
        >
          <Plus className="w-4 h-4" />
          Create Form
        </button>
      </div>

      {/* Form list */}
      {loading ? (
        <p className="text-sm text-neutral-400 py-12 text-center">Loading...</p>
      ) : forms.length === 0 ? (
        <div className="text-center py-16 bg-white border border-neutral-200 rounded-xl">
          <FileInput className="w-8 h-8 text-neutral-300 mx-auto mb-3" />
          <p className="text-sm text-neutral-500">No forms yet. Create your first form above.</p>
        </div>
      ) : (
        <div className="bg-white border border-neutral-200 rounded-xl divide-y divide-neutral-100 overflow-hidden">
          {forms.map((form) => (
            <div key={form.id} className="px-5 py-4 flex items-center gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <Link
                    href={`/admin/form-builder/${form.slug}`}
                    className="text-sm font-medium text-neutral-900 hover:text-indigo-700 no-underline truncate"
                  >
                    {form.name}
                  </Link>
                  <span
                    className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium ${
                      form.published
                        ? "bg-indigo-50 text-indigo-700"
                        : "bg-neutral-100 text-neutral-500"
                    }`}
                  >
                    {form.published ? "Live" : "Draft"}
                  </span>
                </div>
                <p className="text-xs text-neutral-400 mt-0.5">
                  /{form.slug} · {form.submission_count} submission{form.submission_count !== 1 ? "s" : ""}
                </p>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <Link
                  href={`/admin/form-builder/${form.slug}/submissions`}
                  className="flex items-center gap-1 px-2.5 py-1.5 text-xs text-neutral-600 border border-neutral-200 rounded-lg hover:bg-neutral-50 transition no-underline"
                >
                  <Inbox className="w-3.5 h-3.5" />
                  {form.submission_count}
                </Link>
                {form.published ? (
                  <a
                    href={`/form/${form.slug}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1.5 text-neutral-400 hover:text-neutral-600 transition"
                    title="View live form"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                ) : null}
                <button
                  onClick={() => handleDelete(form.slug)}
                  className="p-1.5 text-neutral-400 hover:text-red-600 transition"
                  title="Delete form"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
