"use client";

import { useState, useEffect } from "react";
import { useAuth } from "../layout";
import { UserPlus, Pencil, Trash2, Shield, Eye, Edit3 } from "lucide-react";

interface AdminUser {
  id: number;
  email: string;
  name: string;
  role: "admin" | "editor" | "viewer";
  created_at: string;
}

const roleMeta: Record<string, { label: string; icon: typeof Shield; color: string }> = {
  admin: { label: "Admin", icon: Shield, color: "text-red-600 bg-red-50" },
  editor: { label: "Editor", icon: Edit3, color: "text-blue-600 bg-blue-50" },
  viewer: { label: "Viewer", icon: Eye, color: "text-neutral-600 bg-neutral-100" },
};

export default function UsersPage() {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);

  // Form state
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formEmail, setFormEmail] = useState("");
  const [formName, setFormName] = useState("");
  const [formPassword, setFormPassword] = useState("");
  const [formRole, setFormRole] = useState<"admin" | "editor" | "viewer">("editor");
  const [formError, setFormError] = useState("");
  const [saving, setSaving] = useState(false);

  const fetchUsers = async () => {
    try {
      const res = await fetch("/api/admin/users");
      const data = await res.json();
      if (data.users) setUsers(data.users);
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const resetForm = () => {
    setShowForm(false);
    setEditingId(null);
    setFormEmail("");
    setFormName("");
    setFormPassword("");
    setFormRole("editor");
    setFormError("");
  };

  const startEdit = (u: AdminUser) => {
    setEditingId(u.id);
    setFormEmail(u.email);
    setFormName(u.name);
    setFormPassword("");
    setFormRole(u.role);
    setFormError("");
    setShowForm(true);
  };

  const handleSave = async () => {
    setFormError("");
    setSaving(true);

    try {
      if (editingId) {
        // Update
        const body: Record<string, string> = { id: String(editingId), role: formRole };
        if (formName) body.name = formName;
        if (formPassword) body.password = formPassword;

        const res = await fetch("/api/admin/users", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
        const data = await res.json();
        if (!res.ok) {
          setFormError(data.error || "Update failed");
          return;
        }
      } else {
        // Create
        if (!formEmail || !formName || !formPassword) {
          setFormError("All fields are required");
          return;
        }
        const res = await fetch("/api/admin/users", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: formEmail,
            name: formName,
            password: formPassword,
            role: formRole,
          }),
        });
        const data = await res.json();
        if (!res.ok) {
          setFormError(data.error || "Create failed");
          return;
        }
      }
      resetForm();
      fetchUsers();
    } catch {
      setFormError("Network error");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Remove this user? They will lose access immediately.")) return;
    try {
      await fetch("/api/admin/users", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      fetchUsers();
    } catch {
      // ignore
    }
  };

  if (currentUser?.role !== "admin") {
    return (
      <div className="text-center py-20">
        <p className="text-sm text-neutral-400">You don't have permission to manage users.</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-semibold text-neutral-900">Users</h1>
          <p className="text-sm text-neutral-500 mt-1">
            Manage who can access the CMS and what they can do.
          </p>
        </div>
        {!showForm && (
          <button
            onClick={() => { resetForm(); setShowForm(true); }}
            className="flex items-center gap-2 px-4 py-2 bg-teal-600 text-white text-sm font-medium rounded-lg hover:bg-teal-700 transition"
          >
            <UserPlus className="w-4 h-4" />
            Add user
          </button>
        )}
      </div>

      {/* Create / Edit form */}
      {showForm && (
        <div className="bg-white border border-neutral-200 rounded-xl p-5 mb-6">
          <h2 className="text-sm font-semibold text-neutral-900 mb-4">
            {editingId ? "Edit user" : "New user"}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
            <div>
              <label className="block text-xs text-neutral-500 mb-1">Email</label>
              <input
                type="email"
                value={formEmail}
                onChange={(e) => setFormEmail(e.target.value)}
                disabled={!!editingId}
                className="w-full px-3 py-2 border border-neutral-300 rounded-lg text-sm disabled:bg-neutral-50 disabled:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                placeholder="user@example.com"
              />
            </div>
            <div>
              <label className="block text-xs text-neutral-500 mb-1">Name</label>
              <input
                type="text"
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
                className="w-full px-3 py-2 border border-neutral-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                placeholder="Full name"
              />
            </div>
            <div>
              <label className="block text-xs text-neutral-500 mb-1">
                {editingId ? "New password (leave blank to keep)" : "Password"}
              </label>
              <input
                type="password"
                value={formPassword}
                onChange={(e) => setFormPassword(e.target.value)}
                className="w-full px-3 py-2 border border-neutral-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                placeholder={editingId ? "••••••••" : "Set password"}
              />
            </div>
            <div>
              <label className="block text-xs text-neutral-500 mb-1">Role</label>
              <select
                value={formRole}
                onChange={(e) => setFormRole(e.target.value as "admin" | "editor" | "viewer")}
                className="w-full px-3 py-2 border border-neutral-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              >
                <option value="admin">Admin — full access</option>
                <option value="editor">Editor — manage content</option>
                <option value="viewer">Viewer — read only</option>
              </select>
            </div>
          </div>

          {formError && (
            <p className="text-xs text-red-600 mb-3">{formError}</p>
          )}

          <div className="flex items-center gap-2">
            <button
              onClick={handleSave}
              disabled={saving}
              className="px-4 py-2 bg-teal-600 text-white text-sm font-medium rounded-lg hover:bg-teal-700 disabled:opacity-50 transition"
            >
              {saving ? "Saving…" : editingId ? "Update" : "Create user"}
            </button>
            <button
              onClick={resetForm}
              className="px-4 py-2 text-sm text-neutral-600 hover:text-neutral-900 transition"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* User list */}
      {loading ? (
        <p className="text-sm text-neutral-400">Loading…</p>
      ) : users.length === 0 ? (
        <div className="bg-white border border-neutral-200 rounded-xl p-8 text-center">
          <p className="text-sm text-neutral-500">No users yet. Add your first team member above.</p>
        </div>
      ) : (
        <div className="bg-white border border-neutral-200 rounded-xl divide-y divide-neutral-100">
          {users.map((u) => {
            const meta = roleMeta[u.role] || roleMeta.viewer;
            const RoleIcon = meta.icon;
            const isSelf = currentUser?.id === u.id;

            return (
              <div key={u.id} className="flex items-center justify-between px-5 py-4">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-9 h-9 rounded-full bg-neutral-100 flex items-center justify-center flex-shrink-0">
                    <span className="text-sm font-medium text-neutral-600">
                      {u.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-neutral-900 truncate">
                      {u.name}
                      {isSelf && (
                        <span className="ml-2 text-[10px] uppercase tracking-wider text-neutral-400">
                          you
                        </span>
                      )}
                    </p>
                    <p className="text-xs text-neutral-400 truncate">{u.email}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 flex-shrink-0">
                  <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium ${meta.color}`}>
                    <RoleIcon className="w-3 h-3" />
                    {meta.label}
                  </span>

                  <button
                    onClick={() => startEdit(u)}
                    className="p-1.5 text-neutral-400 hover:text-neutral-600 transition"
                    title="Edit"
                  >
                    <Pencil className="w-3.5 h-3.5" />
                  </button>

                  {!isSelf && (
                    <button
                      onClick={() => handleDelete(u.id)}
                      className="p-1.5 text-neutral-400 hover:text-red-600 transition"
                      title="Remove"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Role reference */}
      <div className="mt-8 text-xs text-neutral-400 space-y-1">
        <p className="font-medium text-neutral-500">Role permissions</p>
        <p>Admin — full access to all content, settings, and user management.</p>
        <p>Editor — create and edit pages, blog posts, products, and media.</p>
        <p>Viewer — read-only access to the dashboard.</p>
      </div>
    </div>
  );
}
