"use client";

import { useEffect, useState, useCallback } from "react";
import { ChevronDown } from "lucide-react";
import Breadcrumbs from "../components/Breadcrumbs";
import FormSection from "../components/FormSection";
import AutosaveIndicator from "../components/AutosaveIndicator";
import { useAutosave } from "../hooks/useAutosave";

// ── API key help accordions ────────────────────────────────────────────────
const API_KEY_HELP: Record<string, { title: string; pricing: string; steps: string[] }> = {
  anthropic_api_key: {
    title: "How to get your Claude (Anthropic) API key",
    pricing: "No free tier — pay-as-you-go from $5",
    steps: [
      "Go to console.anthropic.com and sign up or log in.",
      "Add a payment method under Billing.",
      "Open API Keys → Create Key. Copy it — you won't see it again.",
      "Paste it here. Recommended model: claude-3-5-sonnet-20241022.",
    ],
  },
  openai_api_key: {
    title: "How to get your ChatGPT (OpenAI) API key",
    pricing: "Free trial credits included — pay-as-you-go after",
    steps: [
      "Go to platform.openai.com and sign up or log in.",
      "Navigate to API Keys in the left sidebar.",
      "Click Create new secret key. Copy it immediately.",
      "Add billing under Settings → Billing when trial credits run out.",
      "Paste the key here. Recommended model: gpt-4o.",
    ],
  },
  google_api_key: {
    title: "How to get your Gemini (Google) API key",
    pricing: "Free tier available — pay-as-you-go above limits",
    steps: [
      "Go to aistudio.google.com and sign in with your Google account.",
      "Click Get API key → Create API key in new project.",
      "Copy the key shown.",
      "Paste it here. Recommended model: gemini-1.5-pro.",
    ],
  },
  perplexity_api_key: {
    title: "How to get your Perplexity API key",
    pricing: "No free tier — pay-as-you-go, starts at $5 credit",
    steps: [
      "Go to perplexity.ai and create an account.",
      "Open Settings → API.",
      "Add a payment method, then click Generate.",
      "Copy the key and paste it here. Best used for research-mode prompts.",
    ],
  },
};

function ApiKeyHelp({ fieldKey }: { fieldKey: string }) {
  const [open, setOpen] = useState(false);
  const help = API_KEY_HELP[fieldKey];
  if (!help) return null;
  return (
    <div className="mt-2 border border-teal-200 rounded-lg overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between px-4 py-3 bg-teal-50 hover:bg-teal-100 transition text-left"
      >
        <div>
          <p className="text-xs font-semibold text-teal-900">{help.title}</p>
          <p className="text-xs text-teal-600 mt-0.5">{help.pricing}</p>
        </div>
        <ChevronDown
          className={`w-4 h-4 text-teal-600 flex-shrink-0 transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>
      {open && (
        <ol className="px-4 py-3 bg-white space-y-1.5">
          {help.steps.map((step, i) => (
            <li key={i} className="flex gap-2.5 text-xs text-neutral-600">
              <span className="flex-shrink-0 w-4 h-4 rounded-full bg-teal-100 text-teal-700 font-semibold text-[10px] flex items-center justify-center">
                {i + 1}
              </span>
              {step}
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}

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

const aiFields = [
  { key: "anthropic_api_key",  label: "Anthropic API key",  password: true, placeholder: "sk-ant-api03-…" },
  { key: "openai_api_key",     label: "OpenAI API key",      password: true, placeholder: "sk-…" },
  { key: "google_api_key",     label: "Google (Gemini) API key", password: true, placeholder: "AIza…" },
  { key: "perplexity_api_key", label: "Perplexity API key",  password: true, placeholder: "pplx-…" },
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

  const renderField = (f: { key: string; label: string; multiline?: boolean; password?: boolean; placeholder?: string }) => (
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
          <p className="text-xs text-neutral-400 mb-4">
            Add keys for the providers you want to use. At least one is required. You can switch active provider anytime in the AI panel.
          </p>
          {aiFields.map((f) => (
            <div key={f.key} className="mb-5 last:mb-0">
              {renderField(f)}
              <ApiKeyHelp fieldKey={f.key} />
            </div>
          ))}
        </FormSection>
      </div>
    </div>
  );
}
