"use client";

import { useEffect, useState } from "react";
import Breadcrumbs from "../components/Breadcrumbs";
import { Download, Mail, Trash2 } from "lucide-react";

interface Submission {
  id: number;
  form_name: string;
  email: string;
  name: string | null;
  data: string;
  created_at: string;
}

export default function SubmissionsPage() {
  const [rows, setRows] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    fetch("/api/forms")
      .then((r) => r.json())
      .then((d) => {
        setRows(Array.isArray(d) ? d : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const formNames = Array.from(new Set(rows.map((r) => r.form_name)));
  const filtered = filter === "all" ? rows : rows.filter((r) => r.form_name === filter);

  const exportCSV = () => {
    const header = "Email,Name,Form,Date\n";
    const body = filtered
      .map((r) => `"${r.email}","${r.name || ""}","${r.form_name}","${r.created_at}"`)
      .join("\n");
    const blob = new Blob([header + body], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `submissions-${filter}-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this submission?")) return;
    await fetch(`/api/forms/${id}`, { method: "DELETE" });
    setRows((prev) => prev.filter((r) => r.id !== id));
  };

  const fmtDate = (d: string) => {
    try {
      return new Date(d + "Z").toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "numeric",
        minute: "2-digit",
      });
    } catch {
      return d;
    }
  };

  return (
    <div className="max-w-4xl">
      <Breadcrumbs
        items={[{ label: "Admin", href: "/admin" }, { label: "Submissions" }]}
      />

      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-semibold text-neutral-900">Form Submissions</h1>
          <p className="text-xs text-neutral-400 mt-1">
            {filtered.length} submission{filtered.length !== 1 ? "s" : ""}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {formNames.length > 1 && (
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="text-xs border border-neutral-200 rounded-lg px-3 py-1.5"
            >
              <option value="all">All forms</option>
              {formNames.map((n) => (
                <option key={n} value={n}>{n}</option>
              ))}
            </select>
          )}
          <button
            onClick={exportCSV}
            disabled={filtered.length === 0}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs border border-neutral-200 rounded-lg hover:bg-neutral-50 transition disabled:opacity-40"
          >
            <Download className="w-3.5 h-3.5" />
            Export CSV
          </button>
        </div>
      </div>

      {loading ? (
        <p className="text-sm text-neutral-400">Loading&hellip;</p>
      ) : filtered.length === 0 ? (
        <div className="bg-white border border-neutral-200 rounded-xl p-12 text-center">
          <Mail className="w-8 h-8 text-neutral-300 mx-auto mb-3" />
          <p className="text-sm text-neutral-500">No submissions yet</p>
          <p className="text-xs text-neutral-400 mt-1">
            Add a form block to any page to start collecting emails
          </p>
        </div>
      ) : (
        <div className="bg-white border border-neutral-200 rounded-xl shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-neutral-50 border-b border-neutral-200">
                <th className="text-left px-4 py-3 text-xs font-semibold text-neutral-500 uppercase tracking-wider">Email</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-neutral-500 uppercase tracking-wider">Name</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-neutral-500 uppercase tracking-wider">Form</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-neutral-500 uppercase tracking-wider">Date</th>
                <th className="w-10"></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((r) => (
                <tr key={r.id} className="border-b border-neutral-100 last:border-0 hover:bg-neutral-50 transition">
                  <td className="px-4 py-3 text-neutral-900 font-medium">{r.email}</td>
                  <td className="px-4 py-3 text-neutral-600">{r.name || "\u2014"}</td>
                  <td className="px-4 py-3">
                    <span className="inline-block px-2 py-0.5 bg-emerald-50 text-emerald-700 text-xs rounded-full">
                      {r.form_name}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-neutral-500 text-xs">{fmtDate(r.created_at)}</td>
                  <td className="px-2 py-3">
                    <button
                      onClick={() => handleDelete(r.id)}
                      className="p-1.5 text-neutral-300 hover:text-red-500 transition rounded"
                      title="Delete"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
