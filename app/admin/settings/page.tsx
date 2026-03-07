"use client";

import { useEffect, useState, useCallback } from "react";
import Breadcrumbs from "../components/Breadcrumbs";
import FormSection from "../components/FormSection";
import AutosaveIndicator from "../components/AutosaveIndicator";
import { useAutosave } from "../hooks/useAutosave";

const generalFields = [
  { key: "site_name", label: "Site name" },
  { key: "tagline", label: "Tagline" },
  { key: "copyright", label: "Copyright" },
];

const disclaimerFields = [
  { key: "fda_disclaimer", label: "FDA disclaimer", multiline: true },
  { key: "supplement_disclaimer", label: "Supplement disclaimer", multiline: true },
];

const socialFields = [
  { key: "social_instagram", label: "Instagram URL" },
  { key: "social_twitter", label: "Twitter URL" },
  { key: "social_linkedin", label: "LinkedIn URL" },
];

const securityFields = [
  { key: "admin_password", label: "Admin password", password: true },
];

export default function SettingsAdmin() {
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    fetch("/api/settings")
      .then((r) => r.json())
      .then((data) => {
        setSettings(data);
        setLoaded(true);
      });
  }, []);

  const autoSaveFn = useCallback(async () => {
    if (!loaded) return;
    const res = await fetch("/api/settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(settings),
    });
    if (!res.ok) throw new Error("Save failed");
  }, [settings, loaded]);

  const autosaveStatus = useAutosave(autoSaveFn, [settings]);

  const update = (key: string, value: string) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const renderField = (f: { key: string; label: string; multiline?: boolean; password?: boolean }) => (
    <div key={f.key} className="mb-4 last:mb-0">
      <label className="block text-xs font-medium text-neutral-500 mb-1">
        {f.label}
      </label>
      {f.multiline ? (
        <textarea
          value={settings[f.key] || ""}
          onChange={(e) => update(f.key, e.target.value)}
          rows={3}
          className="w-full px-3 py-2 border border-neutral-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
        />
      ) : (
        <input
          type={f.password ? "password" : "text"}
          value={settings[f.key] || ""}
          onChange={(e) => update(f.key, e.target.value)}
          className="w-full px-3 py-2 border border-neutral-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
        />
      )}
    </div>
  );

  return (
    <div className="max-w-2xl">
      <Breadcrumbs
        items={[{ label: "Admin", href: "/admin" }, { label: "Settings" }]}
      />
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-semibold text-neutral-900">Settings</h1>
          <p className="text-xs text-neutral-400 mt-1">
            Global site configuration
          </p>
        </div>
        <AutosaveIndicator status={autosaveStatus} />
      </div>

      <div className="space-y-4">
        <FormSection title="General">
          {generalFields.map(renderField)}
        </FormSection>

        <FormSection title="Disclaimers">
          {disclaimerFields.map(renderField)}
        </FormSection>

        <FormSection title="Social Links">
          {socialFields.map(renderField)}
        </FormSection>

        <FormSection title="Popup / Email Capture">
          <div className="mb-4">
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={settings.popup_enabled === "true"}
                onChange={(e) => update("popup_enabled", e.target.checked ? "true" : "false")}
                className="rounded border-neutral-300"
              />
              <span className="text-xs font-medium text-neutral-500">Enable popup</span>
            </label>
          </div>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-xs font-medium text-neutral-500 mb-1">
                Delay (seconds)
              </label>
              <input
                type="number"
                value={settings.popup_delay_seconds || ""}
                onChange={(e) => update("popup_delay_seconds", e.target.value)}
                className="w-full px-3 py-2 border border-neutral-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-neutral-500 mb-1">
                Scroll threshold (%)
              </label>
              <input
                type="number"
                value={settings.popup_scroll_threshold || ""}
                onChange={(e) => update("popup_scroll_threshold", e.target.value)}
                className="w-full px-3 py-2 border border-neutral-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>
          <div className="mb-4">
            <label className="block text-xs font-medium text-neutral-500 mb-1">
              Heading
            </label>
            <input
              value={settings.popup_heading || ""}
              onChange={(e) => update("popup_heading", e.target.value)}
              className="w-full px-3 py-2 border border-neutral-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
          <div className="mb-4">
            <label className="block text-xs font-medium text-neutral-500 mb-1">
              Subheading
            </label>
            <textarea
              value={settings.popup_subheading || ""}
              onChange={(e) => update("popup_subheading", e.target.value)}
              rows={2}
              className="w-full px-3 py-2 border border-neutral-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
          <div className="mb-4">
            <label className="block text-xs font-medium text-neutral-500 mb-1">
              CTA button text
            </label>
            <input
              value={settings.popup_cta_text || ""}
              onChange={(e) => update("popup_cta_text", e.target.value)}
              className="w-full px-3 py-2 border border-neutral-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
          <div className="flex gap-6">
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={settings.popup_show_phone === "true"}
                onChange={(e) => update("popup_show_phone", e.target.checked ? "true" : "false")}
                className="rounded border-neutral-300"
              />
              <span className="text-xs font-medium text-neutral-500">Show phone field</span>
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={settings.popup_show_sms_optin === "true"}
                onChange={(e) => update("popup_show_sms_optin", e.target.checked ? "true" : "false")}
                className="rounded border-neutral-300"
              />
              <span className="text-xs font-medium text-neutral-500">Show SMS opt-in</span>
            </label>
          </div>
        </FormSection>

        <FormSection title="Security">
          {securityFields.map(renderField)}
        </FormSection>
      </div>
    </div>
  );
}
