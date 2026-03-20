"use client";

import { useEffect, useState } from "react";
import Breadcrumbs from "../components/Breadcrumbs";

interface Webhook {
  id: number;
  url: string;
  events: string[];
  secret: string | null;
  enabled: number;
  last_triggered_at: string | null;
  created_at: string;
}

const ALL_EVENTS = [
  "workflow.pending_review",
  "workflow.approved",
  "workflow.rejected",
  "workflow.published",
  "workflow.*",
];

export default function WebhooksAdmin() {
  const [webhooks, setWebhooks] = useState<Webhook[]>([]);
  const [loading, setLoading] = useState(true);
  const [showNew, setShowNew] = useState(false);
  const [newUrl, setNewUrl] = useState("");
  const [newSecret, setNewSecret] = useState("");
  const [newEvents, setNewEvents] = useState<string[]>(["workflow.*"]);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState("");

  const load = () => {
    fetch("/api/webhooks")
      .then((r) => r.json())
      .then((data) => {
        setWebhooks(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(load, []);

  const handleCreate = async () => {
    if (!newUrl.trim()) return;
    setCreating(true);
    setError("");
    try {
      const res = await fetch("/api/webhooks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          url: newUrl.trim(),
          events: newEvents,
          secret: newSecret.trim() || null,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to create");
      setWebhooks((prev) => [data, ...prev]);
      setShowNew(false);
      setNewUrl("");
      setNewSecret("");
      setNewEvents(["workflow.*"]);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setCreating(false);
    }
  };

  const handleToggle = async (wh: Webhook) => {
    await fetch(`/api/webhooks/${wh.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ enabled: !wh.enabled }),
    });
    setWebhooks((prev) =>
      prev.map((w) => (w.id === wh.id ? { ...w, enabled: w.enabled ? 0 : 1 } : w))
    );
  };

  const handleDelete = async (wh: Webhook) => {
    if (!confirm("Delete this webhook?")) return;
    await fetch(`/api/webhooks/${wh.id}`, { method: "DELETE" });
    setWebhooks((prev) => prev.filter((w) => w.id !== wh.id));
  };

  const toggleEvent = (evt: string) => {
    setNewEvents((prev) =>
      prev.includes(evt) ? prev.filter((e) => e !== evt) : [...prev, evt]
    );
  };

  if (loading) return <p className="text-sm text-neutral-400 p-4">Loading webhooks&hellip;</p>;

  return (
    <div>
      <Breadcrumbs items={[{ label: "Admin", href: "/admin" }, { label: "Webhooks" }]} />

      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-semibold text-neutral-900">Webhooks</h1>
          <p className="text-xs text-neutral-400 mt-1">
            Notify external services when workflow events occur
          </p>
        </div>
        <button
          onClick={() => { setShowNew(true); setError(""); }}
          className="px-4 py-2 bg-emerald-600 text-white text-sm font-medium rounded-lg hover:bg-emerald-700 transition-colors"
        >
          + New Webhook
        </button>
      </div>

      {/* Create Modal */}
      {showNew && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md mx-4 p-6">
            <h2 className="text-lg font-semibold text-neutral-900 mb-4">New Webhook</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-neutral-500 mb-1">Endpoint URL</label>
                <input
                  value={newUrl}
                  onChange={(e) => setNewUrl(e.target.value)}
                  placeholder="https://example.com/webhook"
                  className="w-full px-3 py-2 border border-neutral-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-neutral-500 mb-1">Secret (optional)</label>
                <input
                  value={newSecret}
                  onChange={(e) => setNewSecret(e.target.value)}
                  placeholder="Shared secret for request verification"
                  className="w-full px-3 py-2 border border-neutral-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-neutral-500 mb-2">Events</label>
                <div className="space-y-2">
                  {ALL_EVENTS.map((evt) => (
                    <label key={evt} className="flex items-center gap-2 text-sm text-neutral-700 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={newEvents.includes(evt)}
                        onChange={() => toggleEvent(evt)}
                        className="rounded border-neutral-300 text-emerald-600 focus:ring-emerald-500"
                      />
                      {evt}
                    </label>
                  ))}
                </div>
              </div>
              {error && <p className="text-red-600 text-xs">{error}</p>}
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button onClick={() => setShowNew(false)} className="px-4 py-2 text-sm text-neutral-600 hover:text-neutral-900">
                Cancel
              </button>
              <button
                onClick={handleCreate}
                disabled={creating || !newUrl.trim()}
                className="px-4 py-2 bg-emerald-600 text-white text-sm font-medium rounded-lg hover:bg-emerald-700 transition-colors disabled:opacity-50"
              >
                {creating ? "Creating\u2026" : "Create Webhook"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Webhook List */}
      {webhooks.length === 0 ? (
        <div className="bg-white rounded-xl border border-neutral-200 p-8 text-center">
          <p className="text-sm text-neutral-500">No webhooks configured yet.</p>
          <p className="text-xs text-neutral-400 mt-1">
            Webhooks POST a JSON payload to your URL when workflow events fire (submit, approve, reject, publish).
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {webhooks.map((wh) => (
            <div key={wh.id} className="bg-white rounded-xl border border-neutral-200 p-4 flex items-center justify-between">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${wh.enabled ? "bg-emerald-500" : "bg-neutral-300"}`} />
                  <p className="text-sm font-medium text-neutral-900 truncate">{wh.url}</p>
                </div>
                <div className="flex items-center gap-3 mt-1.5">
                  <div className="flex flex-wrap gap-1">
                    {wh.events.map((e) => (
                      <span key={e} className="px-1.5 py-0.5 text-[10px] font-medium bg-neutral-100 text-neutral-500 rounded">
                        {e}
                      </span>
                    ))}
                  </div>
                  {wh.last_triggered_at && (
                    <span className="text-[10px] text-neutral-400">
                      Last fired: {new Date(wh.last_triggered_at).toLocaleDateString()}
                    </span>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2 ml-4">
                <button
                  onClick={() => handleToggle(wh)}
                  className={`px-3 py-1 text-xs rounded-lg transition ${
                    wh.enabled
                      ? "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
                      : "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                  }`}
                >
                  {wh.enabled ? "Disable" : "Enable"}
                </button>
                <button
                  onClick={() => handleDelete(wh)}
                  className="px-3 py-1 text-xs text-red-600 hover:bg-red-50 rounded-lg transition"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
