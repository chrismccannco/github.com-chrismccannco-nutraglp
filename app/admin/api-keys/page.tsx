"use client";

import { useEffect, useState } from "react";
import { Key, Plus, Trash2, Ban, Copy, Check, Eye, EyeOff } from "lucide-react";
import { useAuth } from "../layout";

interface ApiKeyData {
  id: number;
  name: string;
  key_prefix: string;
  permissions: string[];
  rate_limit: number;
  last_used_at: string | null;
  requests_today: number;
  requests_total: number;
  revoked: boolean;
  revoked_at: string | null;
  created_at: string;
}

export default function ApiKeysPage() {
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";
  const [keys, setKeys] = useState<ApiKeyData[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [newKeyName, setNewKeyName] = useState("");
  const [newKeyPerms, setNewKeyPerms] = useState<string[]>(["read"]);
  const [newKeyLimit, setNewKeyLimit] = useState(1000);
  const [creating, setCreating] = useState(false);
  const [revealedKey, setRevealedKey] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const load = () => {
    fetch("/api/admin/api-keys")
      .then((r) => r.json())
      .then((data) => {
        setKeys(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  const handleCreate = async () => {
    if (!newKeyName.trim()) return;
    setCreating(true);
    try {
      const res = await fetch("/api/admin/api-keys", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newKeyName,
          permissions: newKeyPerms,
          rate_limit: newKeyLimit,
        }),
      });
      const data = await res.json();
      if (data.rawKey) {
        setRevealedKey(data.rawKey);
      }
      setNewKeyName("");
      setNewKeyPerms(["read"]);
      setNewKeyLimit(1000);
      setShowCreate(false);
      load();
    } catch {
      // ignore
    }
    setCreating(false);
  };

  const handleRevoke = async (id: number) => {
    await fetch("/api/admin/api-keys", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, action: "revoke" }),
    });
    load();
  };

  const handleDelete = async (id: number) => {
    await fetch("/api/admin/api-keys", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, action: "delete" }),
    });
    load();
  };

  const copyKey = () => {
    if (revealedKey) {
      navigator.clipboard.writeText(revealedKey);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const formatDate = (d: string | null) => {
    if (!d) return "Never";
    return new Date(d).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  };

  const togglePerm = (perm: string) => {
    setNewKeyPerms((prev) =>
      prev.includes(perm) ? prev.filter((p) => p !== perm) : [...prev, perm]
    );
  };

  if (!isAdmin) {
    return (
      <div className="max-w-4xl">
        <p className="text-sm text-neutral-500">Only admins can manage API keys.</p>
      </div>
    );
  }

  const activeKeys = keys.filter((k) => !k.revoked);
  const revokedKeys = keys.filter((k) => k.revoked);

  return (
    <div className="max-w-4xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-semibold text-neutral-900">API Keys</h1>
          <p className="text-sm text-neutral-500 mt-1">
            Manage access to the public REST API
          </p>
        </div>
        <div className="flex gap-2">
          <a
            href="/admin/api-docs"
            className="px-3 py-2 text-xs font-medium border border-neutral-300 rounded-lg text-neutral-600 hover:bg-neutral-50 transition no-underline"
          >
            API Docs
          </a>
          <button
            onClick={() => setShowCreate(true)}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
          >
            <Plus className="w-3.5 h-3.5" />
            Create Key
          </button>
        </div>
      </div>

      {/* New key revealed */}
      {revealedKey && (
        <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-xl">
          <p className="text-sm font-medium text-amber-800 mb-2">
            Your new API key (copy it now — it won&apos;t be shown again):
          </p>
          <div className="flex items-center gap-2">
            <code className="flex-1 px-3 py-2 bg-white border border-amber-300 rounded-lg text-sm font-mono text-amber-900 break-all">
              {revealedKey}
            </code>
            <button
              onClick={copyKey}
              className="flex items-center gap-1 px-3 py-2 text-xs font-medium bg-amber-100 text-amber-800 rounded-lg hover:bg-amber-200 transition"
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? "Copied" : "Copy"}
            </button>
          </div>
          <button
            onClick={() => setRevealedKey(null)}
            className="mt-2 text-xs text-amber-600 hover:text-amber-800"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Create form */}
      {showCreate && (
        <div className="mb-6 p-5 bg-white border border-neutral-200 rounded-xl space-y-4">
          <h2 className="text-sm font-semibold text-neutral-900">Create API Key</h2>

          <div>
            <label className="block text-xs font-medium text-neutral-500 mb-1">Name</label>
            <input
              value={newKeyName}
              onChange={(e) => setNewKeyName(e.target.value)}
              placeholder="e.g. Mobile App, Marketing Site"
              className="w-full px-3 py-2 border border-neutral-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-neutral-500 mb-1">Permissions</label>
            <div className="flex gap-3">
              {["read", "write", "delete"].map((perm) => (
                <label key={perm} className="flex items-center gap-1.5 text-xs text-neutral-700">
                  <input
                    type="checkbox"
                    checked={newKeyPerms.includes(perm)}
                    onChange={() => togglePerm(perm)}
                    className="rounded border-neutral-300"
                  />
                  {perm}
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-neutral-500 mb-1">
              Daily Rate Limit
            </label>
            <input
              type="number"
              value={newKeyLimit}
              onChange={(e) => setNewKeyLimit(Number(e.target.value))}
              className="w-32 px-3 py-2 border border-neutral-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <span className="text-xs text-neutral-400 ml-2">requests/day</span>
          </div>

          <div className="flex gap-2">
            <button
              onClick={handleCreate}
              disabled={creating || !newKeyName.trim()}
              className="px-4 py-2 text-xs font-medium bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition disabled:opacity-50"
            >
              {creating ? "Creating..." : "Create Key"}
            </button>
            <button
              onClick={() => setShowCreate(false)}
              className="px-4 py-2 text-xs text-neutral-600 border border-neutral-200 rounded-lg hover:bg-neutral-50 transition"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Active keys */}
      {loading ? (
        <p className="text-sm text-neutral-400 py-12 text-center">Loading...</p>
      ) : activeKeys.length === 0 && !showCreate ? (
        <div className="text-center py-16 bg-white border border-neutral-200 rounded-xl">
          <Key className="w-8 h-8 text-neutral-300 mx-auto mb-3" />
          <p className="text-sm text-neutral-500 mb-3">No API keys yet.</p>
          <button
            onClick={() => setShowCreate(true)}
            className="text-xs text-indigo-600 hover:text-indigo-700 font-medium"
          >
            Create your first key
          </button>
        </div>
      ) : (
        <div className="bg-white border border-neutral-200 rounded-xl divide-y divide-neutral-100 overflow-hidden">
          {activeKeys.map((k) => (
            <div key={k.id} className="px-5 py-4 flex items-center gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <Key className="w-4 h-4 text-indigo-500 flex-shrink-0" />
                  <span className="text-sm font-medium text-neutral-900">{k.name}</span>
                  <code className="text-[11px] px-1.5 py-0.5 bg-neutral-100 rounded text-neutral-500 font-mono">
                    {k.key_prefix}...
                  </code>
                </div>
                <div className="flex items-center gap-3 mt-1 text-[11px] text-neutral-500">
                  <span>
                    Permissions: {k.permissions.join(", ")}
                  </span>
                  <span>
                    Rate: {k.requests_today}/{k.rate_limit}/day
                  </span>
                  <span>
                    Total: {k.requests_total.toLocaleString()}
                  </span>
                  <span>
                    Last used: {formatDate(k.last_used_at)}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-1.5 flex-shrink-0">
                <button
                  onClick={() => handleRevoke(k.id)}
                  className="flex items-center gap-1 px-2.5 py-1.5 text-[11px] text-amber-700 bg-amber-50 rounded-lg hover:bg-amber-100 transition"
                  title="Revoke key"
                >
                  <Ban className="w-3 h-3" />
                  Revoke
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Revoked keys */}
      {revokedKeys.length > 0 && (
        <div className="mt-6">
          <p className="text-xs font-semibold uppercase tracking-widest text-neutral-400 mb-3">
            Revoked Keys
          </p>
          <div className="bg-white border border-neutral-200 rounded-xl divide-y divide-neutral-100 overflow-hidden opacity-60">
            {revokedKeys.map((k) => (
              <div key={k.id} className="px-5 py-3 flex items-center gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <Key className="w-3.5 h-3.5 text-neutral-400" />
                    <span className="text-sm text-neutral-500 line-through">{k.name}</span>
                    <code className="text-[10px] px-1.5 py-0.5 bg-neutral-100 rounded text-neutral-400 font-mono">
                      {k.key_prefix}...
                    </code>
                  </div>
                  <p className="text-[10px] text-neutral-400 mt-0.5">
                    Revoked {formatDate(k.revoked_at)} · {k.requests_total.toLocaleString()} total requests
                  </p>
                </div>
                <button
                  onClick={() => handleDelete(k.id)}
                  className="p-1.5 text-neutral-400 hover:text-red-500 transition"
                  title="Delete permanently"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
