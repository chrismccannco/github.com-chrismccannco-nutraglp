"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams } from "next/navigation";
import {
  ArrowLeft,
  Download,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Search,
  Calendar,
} from "lucide-react";
import Link from "next/link";
import type { FormField } from "@/lib/types/forms";

interface Submission {
  id: number;
  data: Record<string, unknown>;
  metadata: { userAgent?: string; referrer?: string; submittedAt?: string };
  created_at: string;
}

export default function SubmissionsPage() {
  const params = useParams();
  const slug = params?.slug as string;

  const [formName, setFormName] = useState("");
  const [fields, setFields] = useState<FormField[]>([]);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(0);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Set<number>>(new Set());
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const limit = 25;

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [formRes, subRes] = await Promise.all([
        fetch(`/api/form-builder/${slug}`),
        fetch(`/api/form-builder/${slug}/submissions?limit=${limit}&offset=${page * limit}`),
      ]);
      if (formRes.ok) {
        const form = await formRes.json();
        setFormName(form.name);
        setFields(JSON.parse(form.fields || "[]"));
      }
      if (subRes.ok) {
        const data = await subRes.json();
        setSubmissions(data.submissions || []);
        setTotal(data.total || 0);
      }
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  }, [slug, page]);

  useEffect(() => { load(); }, [load]);

  const visibleFields = fields.filter(
    (f) => !["heading", "paragraph", "hidden"].includes(f.type)
  );

  const filteredSubmissions = search
    ? submissions.filter((s) =>
        Object.values(s.data).some((v) =>
          String(v).toLowerCase().includes(search.toLowerCase())
        )
      )
    : submissions;

  const toggleSelect = (id: number) => {
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const toggleAll = () => {
    if (selected.size === filteredSubmissions.length) {
      setSelected(new Set());
    } else {
      setSelected(new Set(filteredSubmissions.map((s) => s.id)));
    }
  };

  const exportCsv = () => {
    const headers = visibleFields.map((f) => f.label);
    headers.push("Submitted At");
    const rows = filteredSubmissions.map((s) => {
      const row = visibleFields.map((f) => {
        const val = s.data[f.id];
        return typeof val === "string" ? val : JSON.stringify(val ?? "");
      });
      row.push(new Date(s.created_at).toLocaleString());
      return row;
    });
    const csv = [headers, ...rows]
      .map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(","))
      .join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${slug}-submissions.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const totalPages = Math.ceil(total / limit);

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <Link
          href={`/admin/form-builder/${slug}`}
          className="p-2 hover:bg-gray-100 rounded"
        >
          <ArrowLeft size={18} />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Submissions</h1>
          <p className="text-sm text-gray-500">{formName} — {total} total</p>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex items-center gap-3 mb-4">
        <div className="relative flex-1 max-w-xs">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search submissions…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 border rounded-lg text-sm"
          />
        </div>
        <button
          onClick={exportCsv}
          className="flex items-center gap-2 px-3 py-2 text-sm border rounded-lg hover:bg-gray-50"
        >
          <Download size={14} />
          Export CSV
        </button>
        {selected.size > 0 && (
          <span className="text-sm text-gray-500">{selected.size} selected</span>
        )}
      </div>

      {loading ? (
        <div className="text-center py-12 text-gray-500">Loading…</div>
      ) : filteredSubmissions.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          No submissions yet.
        </div>
      ) : (
        <div className="bg-white border rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="w-10 px-3 py-3">
                    <input
                      type="checkbox"
                      checked={selected.size === filteredSubmissions.length}
                      onChange={toggleAll}
                    />
                  </th>
                  {visibleFields.slice(0, 5).map((f) => (
                    <th key={f.id} className="px-3 py-3 text-left font-medium text-gray-600">
                      {f.label}
                    </th>
                  ))}
                  <th className="px-3 py-3 text-left font-medium text-gray-600">
                    <Calendar size={14} className="inline mr-1" />
                    Date
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredSubmissions.map((sub) => (
                  <>
                    <tr
                      key={sub.id}
                      className="border-b hover:bg-gray-50 cursor-pointer"
                      onClick={() => setExpandedId(expandedId === sub.id ? null : sub.id)}
                    >
                      <td className="px-3 py-3" onClick={(e) => e.stopPropagation()}>
                        <input
                          type="checkbox"
                          checked={selected.has(sub.id)}
                          onChange={() => toggleSelect(sub.id)}
                        />
                      </td>
                      {visibleFields.slice(0, 5).map((f) => (
                        <td key={f.id} className="px-3 py-3 max-w-[200px] truncate">
                          {String(sub.data[f.id] ?? "—")}
                        </td>
                      ))}
                      <td className="px-3 py-3 text-gray-500 whitespace-nowrap">
                        {new Date(sub.created_at).toLocaleDateString()}
                      </td>
                    </tr>
                    {expandedId === sub.id && (
                      <tr key={`${sub.id}-detail`} className="bg-gray-50">
                        <td colSpan={visibleFields.slice(0, 5).length + 2} className="px-6 py-4">
                          <div className="grid grid-cols-2 gap-3 text-sm">
                            {visibleFields.map((f) => (
                              <div key={f.id}>
                                <div className="font-medium text-gray-600">{f.label}</div>
                                <div className="text-gray-900 mt-0.5">
                                  {String(sub.data[f.id] ?? "—")}
                                </div>
                              </div>
                            ))}
                            {sub.metadata?.referrer && (
                              <div>
                                <div className="font-medium text-gray-600">Referrer</div>
                                <div className="text-gray-900 mt-0.5">{sub.metadata.referrer}</div>
                              </div>
                            )}
                            <div>
                              <div className="font-medium text-gray-600">Submitted</div>
                              <div className="text-gray-900 mt-0.5">
                                {new Date(sub.created_at).toLocaleString()}
                              </div>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between px-4 py-3 border-t bg-gray-50">
              <span className="text-sm text-gray-500">
                Page {page + 1} of {totalPages}
              </span>
              <div className="flex gap-2">
                <button
                  onClick={() => setPage(Math.max(0, page - 1))}
                  disabled={page === 0}
                  className="p-1.5 border rounded hover:bg-white disabled:opacity-30"
                >
                  <ChevronLeft size={16} />
                </button>
                <button
                  onClick={() => setPage(Math.min(totalPages - 1, page + 1))}
                  disabled={page >= totalPages - 1}
                  className="p-1.5 border rounded hover:bg-white disabled:opacity-30"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
