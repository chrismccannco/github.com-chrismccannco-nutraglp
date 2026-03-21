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

const cmsBrandingFields = [
  { key: "cms_name", label: "Admin display name", placeholder: "ContentFoundry" },
  { key: "cms_logo_letter", label: "Logo letter (single character)", placeholder: "C" },
  { key: "cms_accent_color", label: "Accent color (hex)", placeholder: "#0f2d20" },
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

const analyticsFields = [
  { key: "ga_measurement_id", label: "GA4 Measurement ID", placeholder: "G-XXXXXXXXXX" },
  { key: "plausible_domain", label: "Plausible domain", placeholder: "yourdomain.com" },
];

const securityFields = [
  { key: "admin_password", label: "Admin password", password: true },
];

const aiKeyFields = [
  {
    key: "anthropic_api_key",
    label: "Anthropic API key",
    password: true,
    placeholder: "sk-ant-api03-…",
    hint: "Used when provider is set to Claude. console.anthropic.com",
  },
  {
    key: "openai_api_key",
    label: "OpenAI API key",
    password: true,
    placeholder: "sk-…",
    hint: "Used when provider is set to ChatGPT (GPT-4o). platform.openai.com",
  },
  {
    key: "gemini_api_key",
    label: "Gemini API key",
    password: true,
    placeholder: "AIza…",
    hint: "Used when provider is set to Gemini. aistudio.google.com/apikey",
  },
  {
    key: "perplexity_api_key",
    label: "Perplexity API key",
    password: true,
    placeholder: "pplx-…",
    hint: "Used when provider is set to Perplexity. perplexity.ai/settings/api",
  },
];

const integrationFields = [
  {
    key: "removebg_api_key",
    label: "remove.bg API key",
    password: true,
    placeholder: "Your remove.bg API key",
    hint: "Background removal. 50 free images/month. Get a key at remove.bg/api",
  },
  {
    key: "unsplash_api_key",
    label: "Unsplash Access Key",
    password: true,
    placeholder: "Your Unsplash access key",
    hint: "Stock photo search. Free. Get a key at unsplash.com/developers",
  },
  {
    key: "sendgrid_api_key",
    label: "SendGrid API key",
    password: true,
    placeholder: "SG.…",
    hint: "Email delivery for form submissions and notifications.",
  },
  {
    key: "cloudinary_cloud_name",
    label: "Cloudinary Cloud Name",
    password: false,
    placeholder: "your-cloud-name",
    hint: "",
  },
  {
    key: "cloudinary_api_key",
    label: "Cloudinary API Key",
    password: true,
    placeholder: "123456789012345",
    hint: "",
  },
  {
    key: "cloudinary_api_secret",
    label: "Cloudinary API Secret",
    password: true,
    placeholder: "Your Cloudinary secret",
    hint: "Image CDN and transformation. Free tier: 25k transformations/month. cloudinary.com",
  },
  {
    key: "elevenlabs_api_key",
    label: "ElevenLabs API key",
    password: true,
    placeholder: "Your ElevenLabs API key",
    hint: "Text-to-speech and voice cloning. elevenlabs.io",
  },
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

  const renderField = (f: { key: string; label: string; multiline?: boolean; password?: boolean; placeholder?: string; hint?: string }) => (
    <div key={f.key} className="mb-4 last:mb-0">
      <label className="block text-xs font-medium text-neutral-500 mb-1">
        {f.label}
      </label>
      {f.multiline ? (
        <textarea
          value={settings[f.key] || ""}
          onChange={(e) => update(f.key, e.target.value)}
          rows={3}
          placeholder={f.placeholder}
          className="w-full px-3 py-2 border border-neutral-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
        />
      ) : (
        <input
          type={f.password ? "password" : "text"}
          value={settings[f.key] || ""}
          onChange={(e) => update(f.key, e.target.value)}
          placeholder={f.placeholder}
          className="w-full px-3 py-2 border border-neutral-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
        />
      )}
      {f.hint && (
        <p className="text-xs text-neutral-400 mt-1">{f.hint}</p>
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
        <FormSection title="CMS Branding">
          {cmsBrandingFields.map(renderField)}
          <p className="text-xs text-neutral-400 mt-2">
            Customize how the admin panel looks. Changes appear on next page load.
          </p>
        </FormSection>

        <FormSection title="General">
          {generalFields.map(renderField)}
        </FormSection>

        <FormSection title="Disclaimers">
          {disclaimerFields.map(renderField)}
        </FormSection>

        <FormSection title="Social Links">
          {socialFields.map(renderField)}
        </FormSection>

        <FormSection title="Analytics Tracking">
          {analyticsFields.map(renderField)}
          <p className="text-xs text-neutral-400 mt-2">
            Add a GA4 measurement ID or Plausible domain to inject tracking scripts site-wide. Leave blank to disable.
          </p>
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
                className="w-full px-3 py-2 border border-neutral-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
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
                className="w-full px-3 py-2 border border-neutral-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
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
              className="w-full px-3 py-2 border border-neutral-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
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
              className="w-full px-3 py-2 border border-neutral-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>
          <div className="mb-4">
            <label className="block text-xs font-medium text-neutral-500 mb-1">
              CTA button text
            </label>
            <input
              value={settings.popup_cta_text || ""}
              onChange={(e) => update("popup_cta_text", e.target.value)}
              className="w-full px-3 py-2 border border-neutral-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
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

        <FormSection title="AI Integration">
          {/* Provider selection */}
          <div className="mb-4">
            <label className="block text-xs font-semibold text-neutral-500 mb-1.5 uppercase tracking-wide">
              AI Provider
            </label>
            <select
              value={settings.ai_provider || "anthropic"}
              onChange={(e) => update("ai_provider", e.target.value)}
              className="w-full border border-neutral-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="anthropic">Claude (Anthropic)</option>
              <option value="openai">ChatGPT (OpenAI)</option>
              <option value="gemini">Gemini (Google)</option>
              <option value="perplexity">Perplexity</option>
            </select>
            <p className="text-xs text-neutral-400 mt-1">
              All AI features — drafts, repurpose, assist, scoring — use this provider.
            </p>
          </div>

          {/* Optional model override */}
          <div className="mb-6">
            <label className="block text-xs font-semibold text-neutral-500 mb-1.5 uppercase tracking-wide">
              Model override <span className="font-normal normal-case">(optional)</span>
            </label>
            <input
              type="text"
              value={settings.ai_model || ""}
              onChange={(e) => update("ai_model", e.target.value)}
              placeholder={
                settings.ai_provider === "openai" ? "gpt-4o" :
                settings.ai_provider === "gemini" ? "gemini-2.0-flash" :
                settings.ai_provider === "perplexity" ? "llama-3.1-sonar-large-128k-online" :
                "claude-sonnet-4-20250514"
              }
              className="w-full border border-neutral-200 rounded-lg px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
            <p className="text-xs text-neutral-400 mt-1">
              Leave blank to use the default model for the selected provider.
            </p>
          </div>

          {/* API keys */}
          {aiKeyFields.map(renderField)}
        </FormSection>

        <FormSection title="Integrations">
          <p className="text-xs text-neutral-400 mb-4">
            Connect third-party services. Each key is stored securely and never exposed via the public API.
          </p>
          {integrationFields.map(renderField)}
        </FormSection>
      </div>
    </div>
  );
}
