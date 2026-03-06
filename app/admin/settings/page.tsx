"use client";

import { useEffect, useState } from "react";

const settingFields = [
  { key: "site_name", label: "Site name" },
  { key: "tagline", label: "Tagline" },
  { key: "fda_disclaimer", label: "FDA disclaimer", multiline: true },
  { key: "supplement_disclaimer", label: "Supplement disclaimer", multiline: true },
  { key: "copyright", label: "Copyright" },
  { key: "social_instagram", label: "Instagram URL" },
  { key: "social_twitter", label: "Twitter URL" },
  { key: "social_linkedin", label: "LinkedIn URL" },
  { key: "admin_password", label: "Admin password" },
];

export default function SettingsAdmin() {
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch("/api/settings")
      .then((r) => r.json())
      .then((data) => setSettings(data));
  }, []);

  const handleSave = async () => {
    setSaving(true);
    await fetch("/api/settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(settings),
    });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="max-w-2xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 mb-1">Settings</h1>
          <p className="text-sm text-gray-500">Global site configuration</p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="px-4 py-2 bg-[#0f2d20] text-white text-sm rounded-lg hover:bg-[#1a4a33] transition disabled:opacity-50"
        >
          {saving ? "Saving..." : saved ? "Saved!" : "Save settings"}
        </button>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl p-5 space-y-4">
        {settingFields.map((f) => (
          <div key={f.key}>
            <label className="block text-xs font-medium text-gray-500 mb-1">{f.label}</label>
            {f.multiline ? (
              <textarea
                value={settings[f.key] || ""}
                onChange={(e) => setSettings({ ...settings, [f.key]: e.target.value })}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            ) : (
              <input
                type={f.key === "admin_password" ? "password" : "text"}
                value={settings[f.key] || ""}
                onChange={(e) => setSettings({ ...settings, [f.key]: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
