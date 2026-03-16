"use client";

import { useEffect, useState, useCallback } from "react";
import {
  Plus,
  Globe,
  Trash2,
  Palette,
  Settings2,
  ExternalLink,
  Check,
  Save,
  ArrowLeft,
} from "lucide-react";
import type { Site, SiteTheme } from "@/lib/types/sites";
import { DEFAULT_THEME } from "@/lib/types/sites";

export default function SitesPage() {
  const [sites, setSites] = useState<Site[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingSite, setEditingSite] = useState<Site | null>(null);
  const [showCreate, setShowCreate] = useState(false);
  const [newSlug, setNewSlug] = useState("");
  const [newName, setNewName] = useState("");
  const [newDomain, setNewDomain] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [tab, setTab] = useState<"general" | "theme" | "features">("general");

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/sites");
      if (res.ok) setSites(await res.json());
    } catch (e) { console.error(e); }
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const createSite = async () => {
    if (!newSlug || !newName) return;
    await fetch("/api/sites", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        slug: newSlug,
        name: newName,
        domain: newDomain || null,
        theme: DEFAULT_THEME,
        settings: { features: { blog: true, products: true, faq: true, testimonials: true } },
      }),
    });
    setShowCreate(false);
    setNewSlug("");
    setNewName("");
    setNewDomain("");
    load();
  };

  const deleteSite = async (slug: string) => {
    if (!confirm(`Delete site "${slug}" and all its content associations?`)) return;
    await fetch(`/api/sites/${slug}`, { method: "DELETE" });
    load();
  };

  const saveSite = async () => {
    if (!editingSite) return;
    setSaving(true);
    await fetch(`/api/sites/${editingSite.slug}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: editingSite.name,
        domain: editingSite.domain,
        logo_url: editingSite.logo_url,
        favicon_url: editingSite.favicon_url,
        theme: editingSite.theme,
        settings: editingSite.settings,
        enabled: editingSite.enabled,
      }),
    });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
    load();
  };

  const updateTheme = (key: keyof SiteTheme, value: string) => {
    if (!editingSite) return;
    setEditingSite({
      ...editingSite,
      theme: { ...editingSite.theme, [key]: value },
    });
  };

  if (editingSite) {
    return (
      <div>
        <div className="flex items-center gap-3 mb-6">
          <button onClick={() => setEditingSite(null)} className="p-2 hover:bg-gray-100 rounded">
            <ArrowLeft size={18} />
          </button>
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-gray-900">{editingSite.name}</h1>
            <p className="text-sm text-gray-500">{editingSite.slug}</p>
          </div>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={editingSite.enabled}
              onChange={(e) => setEditingSite({ ...editingSite, enabled: e.target.checked })}
              className="accent-[#2D5F2B]"
            />
            Enabled
          </label>
          <button
            onClick={saveSite}
            disabled={saving}
            className="flex items-center gap-2 px-4 py-2 bg-[#1B3A5C] text-white rounded-lg text-sm hover:bg-[#132D4A] disabled:opacity-50"
          >
            {saved ? <Check size={14} /> : <Save size={14} />}
            {saved ? "Saved" : saving ? "Saving…" : "Save"}
          </button>
        </div>

        <div className="flex gap-1 border-b mb-6">
          {(["general", "theme", "features"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-4 py-2.5 text-sm font-medium border-b-2 transition capitalize ${
                tab === t ? "border-[#1B3A5C] text-[#1B3A5C]" : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        {tab === "general" && (
          <div className="bg-white border rounded-xl p-6 space-y-4 max-w-xl">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Site Name</label>
              <input
                type="text"
                value={editingSite.name}
                onChange={(e) => setEditingSite({ ...editingSite, name: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Custom Domain</label>
              <input
                type="text"
                value={editingSite.domain || ""}
                onChange={(e) => setEditingSite({ ...editingSite, domain: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg text-sm"
                placeholder="www.example.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Logo URL</label>
              <input
                type="text"
                value={editingSite.logo_url || ""}
                onChange={(e) => setEditingSite({ ...editingSite, logo_url: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg text-sm"
                placeholder="https://…"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Favicon URL</label>
              <input
                type="text"
                value={editingSite.favicon_url || ""}
                onChange={(e) => setEditingSite({ ...editingSite, favicon_url: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg text-sm"
                placeholder="https://…"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tagline</label>
              <input
                type="text"
                value={editingSite.settings?.tagline || ""}
                onChange={(e) => setEditingSite({
                  ...editingSite,
                  settings: { ...editingSite.settings, tagline: e.target.value },
                })}
                className="w-full px-3 py-2 border rounded-lg text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Contact Email</label>
              <input
                type="email"
                value={editingSite.settings?.contactEmail || ""}
                onChange={(e) => setEditingSite({
                  ...editingSite,
                  settings: { ...editingSite.settings, contactEmail: e.target.value },
                })}
                className="w-full px-3 py-2 border rounded-lg text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Google Analytics ID</label>
              <input
                type="text"
                value={editingSite.settings?.analytics?.gaId || ""}
                onChange={(e) => setEditingSite({
                  ...editingSite,
                  settings: {
                    ...editingSite.settings,
                    analytics: { ...editingSite.settings?.analytics, gaId: e.target.value },
                  },
                })}
                className="w-full px-3 py-2 border rounded-lg text-sm"
                placeholder="G-XXXXXXXXXX"
              />
            </div>
          </div>
        )}

        {tab === "theme" && (
          <div className="bg-white border rounded-xl p-6 max-w-xl">
            <div className="space-y-4">
              {([
                ["primaryColor", "Primary Color"],
                ["secondaryColor", "Secondary Color"],
                ["accentColor", "Accent Color"],
                ["backgroundColor", "Background Color"],
                ["textColor", "Text Color"],
              ] as [keyof SiteTheme, string][]).map(([key, label]) => (
                <div key={key} className="flex items-center gap-3">
                  <input
                    type="color"
                    value={(editingSite.theme[key] as string) || "#000000"}
                    onChange={(e) => updateTheme(key, e.target.value)}
                    className="w-10 h-10 rounded border cursor-pointer"
                  />
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700">{label}</label>
                    <input
                      type="text"
                      value={(editingSite.theme[key] as string) || ""}
                      onChange={(e) => updateTheme(key, e.target.value)}
                      className="w-full px-3 py-1.5 border rounded text-xs font-mono mt-1"
                    />
                  </div>
                </div>
              ))}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Font Family</label>
                <input
                  type="text"
                  value={editingSite.theme.fontFamily || ""}
                  onChange={(e) => updateTheme("fontFamily", e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg text-sm"
                  placeholder="Inter, sans-serif"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Border Radius</label>
                <input
                  type="text"
                  value={editingSite.theme.borderRadius || ""}
                  onChange={(e) => updateTheme("borderRadius", e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg text-sm"
                  placeholder="12px"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Custom CSS</label>
                <textarea
                  value={editingSite.theme.customCss || ""}
                  onChange={(e) => updateTheme("customCss", e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg text-sm font-mono min-h-[120px]"
                  placeholder=":root { --custom-var: #fff; }"
                />
              </div>

              {/* Preview */}
              <div className="mt-6 p-4 rounded-xl border-2 border-dashed" style={{
                backgroundColor: editingSite.theme.backgroundColor || "#F5F0E8",
                color: editingSite.theme.textColor || "#1A1A1A",
                fontFamily: editingSite.theme.fontFamily || "Inter, sans-serif",
                borderRadius: editingSite.theme.borderRadius || "12px",
              }}>
                <h3 className="font-bold text-lg mb-2" style={{ color: editingSite.theme.primaryColor }}>
                  Theme Preview
                </h3>
                <p className="text-sm mb-3">This is how text will appear on the site.</p>
                <button
                  className="px-4 py-2 text-white text-sm rounded"
                  style={{ backgroundColor: editingSite.theme.primaryColor || "#2D5F2B" }}
                >
                  Primary Button
                </button>
                <button
                  className="px-4 py-2 text-white text-sm rounded ml-2"
                  style={{ backgroundColor: editingSite.theme.accentColor || "#D4A843" }}
                >
                  Accent Button
                </button>
              </div>
            </div>
          </div>
        )}

        {tab === "features" && (
          <div className="bg-white border rounded-xl p-6 max-w-xl space-y-3">
            <p className="text-sm text-gray-500 mb-4">Toggle which content types are available for this site.</p>
            {(["blog", "products", "faq", "testimonials"] as const).map((feature) => (
              <label key={feature} className="flex items-center gap-3 py-2">
                <input
                  type="checkbox"
                  checked={editingSite.settings?.features?.[feature] !== false}
                  onChange={(e) => setEditingSite({
                    ...editingSite,
                    settings: {
                      ...editingSite.settings,
                      features: { ...editingSite.settings?.features, [feature]: e.target.checked },
                    },
                  })}
                  className="accent-[#2D5F2B] w-4 h-4"
                />
                <span className="text-sm font-medium text-gray-700 capitalize">{feature}</span>
              </label>
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Sites</h1>
          <p className="text-sm text-gray-500 mt-1">Manage multi-site instances</p>
        </div>
        <button
          onClick={() => setShowCreate(true)}
          className="flex items-center gap-2 px-4 py-2 bg-[#1B3A5C] text-white rounded-lg text-sm hover:bg-[#132D4A]"
        >
          <Plus size={16} />
          New Site
        </button>
      </div>

      {showCreate && (
        <div className="bg-white border rounded-xl p-4 mb-4 space-y-3">
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Slug</label>
              <input
                type="text"
                value={newSlug}
                onChange={(e) => setNewSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""))}
                className="w-full px-3 py-2 border rounded-lg text-sm"
                placeholder="my-brand"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
              <input
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg text-sm"
                placeholder="My Brand"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Domain (optional)</label>
              <input
                type="text"
                value={newDomain}
                onChange={(e) => setNewDomain(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg text-sm"
                placeholder="www.mybrand.com"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={createSite}
              disabled={!newSlug || !newName}
              className="px-4 py-2 bg-[#2D5F2B] text-white rounded-lg text-sm hover:bg-[#244D23] disabled:opacity-50"
            >
              Create Site
            </button>
            <button
              onClick={() => setShowCreate(false)}
              className="px-4 py-2 border rounded-lg text-sm hover:bg-gray-50"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {loading ? (
        <div className="text-center py-12 text-gray-500">Loading…</div>
      ) : sites.length === 0 ? (
        <div className="text-center py-12 bg-white border rounded-xl">
          <Globe size={32} className="mx-auto text-gray-400 mb-3" />
          <p className="text-gray-600 font-medium">No sites configured</p>
          <p className="text-sm text-gray-500 mt-1">Create your first site to enable multi-site management.</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {sites.map((site) => (
            <div
              key={site.id}
              className="bg-white border rounded-xl p-4 flex items-center justify-between hover:shadow-sm transition cursor-pointer"
              onClick={() => setEditingSite(site)}
            >
              <div className="flex items-center gap-4">
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold text-sm"
                  style={{ backgroundColor: site.theme?.primaryColor || "#1B3A5C" }}
                >
                  {site.name.charAt(0)}
                </div>
                <div>
                  <div className="font-medium text-gray-900 flex items-center gap-2">
                    {site.name}
                    <span className={`px-1.5 py-0.5 text-xs rounded ${
                      site.enabled ? "bg-blue-100 text-blue-700" : "bg-gray-100 text-gray-500"
                    }`}>
                      {site.enabled ? "Active" : "Inactive"}
                    </span>
                  </div>
                  <div className="text-sm text-gray-500 flex items-center gap-2">
                    <span>{site.slug}</span>
                    {site.domain && (
                      <>
                        <span className="text-gray-300">·</span>
                        <span>{site.domain}</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {site.domain && (
                  <a
                    href={`https://${site.domain}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="p-2 text-gray-400 hover:text-gray-600"
                  >
                    <ExternalLink size={14} />
                  </a>
                )}
                <button
                  onClick={(e) => { e.stopPropagation(); deleteSite(site.slug); }}
                  className="p-2 text-gray-400 hover:text-red-500"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
