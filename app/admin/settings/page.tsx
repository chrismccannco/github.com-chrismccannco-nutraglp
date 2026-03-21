"use client";

import { useEffect, useState, useCallback } from "react";
import { ExternalLink, CheckCircle2, XCircle, Loader2, ChevronDown, ChevronUp } from "lucide-react";
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

// ── Per-provider setup guide data ────────────────────────────────────────────

const PROVIDER_GUIDES: Record<string, {
  name: string;
  consoleUrl: string;
  billingUrl: string;
  keyFormat: string;
  freeOption: string;
  pricing: string;
  steps: string[];
  warning?: string;
}> = {
  anthropic: {
    name: "Claude (Anthropic)",
    consoleUrl: "https://console.anthropic.com",
    billingUrl: "https://console.anthropic.com/settings/billing",
    keyFormat: "sk-ant-api03-…",
    freeOption: "No free tier — pay-as-you-go from $5",
    pricing: "Claude Sonnet: ~$3 / million input tokens, $15 / million output",
    steps: [
      "Go to console.anthropic.com and sign in",
      'Click "API Keys" in the left sidebar',
      'Click "Create Key", give it a name',
      "Copy the key — it starts with sk-ant-",
      "Add a credit card under Settings → Billing",
      "Paste your key in the field below",
    ],
  },
  openai: {
    name: "ChatGPT (OpenAI)",
    consoleUrl: "https://platform.openai.com",
    billingUrl: "https://platform.openai.com/settings/organization/billing",
    keyFormat: "sk-proj-… or sk-…",
    freeOption: "No free tier for API — separate from ChatGPT Plus",
    pricing: "GPT-4o: ~$2.50 / million input tokens, $10 / million output",
    steps: [
      "Go to platform.openai.com and sign in",
      'Click "API Keys" in the left menu',
      'Click "Create new secret key"',
      "Copy the key immediately — you won't see it again",
      "Add billing at platform.openai.com/settings/organization/billing",
      "Paste your key in the field below",
    ],
    warning: "ChatGPT Plus / Pro subscriptions do NOT include API access. The API is billed separately through platform.openai.com.",
  },
  gemini: {
    name: "Gemini (Google)",
    consoleUrl: "https://aistudio.google.com",
    billingUrl: "https://aistudio.google.com",
    keyFormat: "AIza…",
    freeOption: "Free tier: 1,500 requests/day (Gemini Flash)",
    pricing: "Gemini 2.0 Flash: free up to limits, then ~$0.075 / million tokens",
    steps: [
      "Go to aistudio.google.com and sign in with your Google account",
      'Click "Get API key" in the top left',
      'Click "Create API key in new project"',
      "Copy the key — it starts with AIza",
      "No billing required for the free tier",
      "Paste your key in the field below",
    ],
  },
  perplexity: {
    name: "Perplexity",
    consoleUrl: "https://www.perplexity.ai/settings/api",
    billingUrl: "https://www.perplexity.ai/settings/api",
    keyFormat: "pplx-…",
    freeOption: "No free tier for API",
    pricing: "llama-3.1-sonar-large: ~$1 / million tokens",
    steps: [
      "Go to perplexity.ai and sign in",
      "Navigate to Settings → API",
      'Click "Generate" to create a new API key',
      "Copy the key — it starts with pplx-",
      "Add credits under the same API settings page",
      "Paste your key in the field below",
    ],
  },
};

// ── AI Integration section component ─────────────────────────────────────────

function AIIntegrationSection({
  settings,
  update,
}: {
  settings: Record<string, string>;
  update: (key: string, value: string) => void;
}) {
  const provider = settings.ai_provider || "anthropic";
  const guide = PROVIDER_GUIDES[provider];
  const [showGuide, setShowGuide] = useState(false);
  const [testState, setTestState] = useState<Record<string, "idle" | "loading" | "ok" | "error">>({});
  const [testMsg, setTestMsg] = useState<Record<string, string>>({});

  const keyFieldMap: Record<string, string> = {
    anthropic: "anthropic_api_key",
    openai: "openai_api_key",
    gemini: "gemini_api_key",
    perplexity: "perplexity_api_key",
  };

  async function testKey(p: string) {
    const keyField = keyFieldMap[p];
    const apiKey = settings[keyField]?.trim();
    if (!apiKey) {
      setTestState((s) => ({ ...s, [p]: "error" }));
      setTestMsg((s) => ({ ...s, [p]: "No key entered yet." }));
      return;
    }
    setTestState((s) => ({ ...s, [p]: "loading" }));
    try {
      const res = await fetch("/api/ai/test", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ provider: p, apiKey }),
      });
      const data = await res.json();
      if (data.ok) {
        setTestState((s) => ({ ...s, [p]: "ok" }));
        setTestMsg((s) => ({ ...s, [p]: `Connected · ${data.model} · ${data.latency_ms}ms` }));
      } else {
        setTestState((s) => ({ ...s, [p]: "error" }));
        setTestMsg((s) => ({ ...s, [p]: data.error || "Connection failed" }));
      }
    } catch {
      setTestState((s) => ({ ...s, [p]: "error" }));
      setTestMsg((s) => ({ ...s, [p]: "Request failed" }));
    }
  }

  const renderKeyField = (p: string, label: string, placeholder: string) => {
    const keyField = keyFieldMap[p];
    const state = testState[p] || "idle";
    return (
      <div key={p} className="mb-5 last:mb-0">
        <div className="flex items-center justify-between mb-1">
          <label className="text-xs font-medium text-neutral-500">{label}</label>
          <button
            type="button"
            onClick={() => testKey(p)}
            disabled={state === "loading"}
            className="text-[11px] text-teal-600 hover:text-teal-700 font-medium flex items-center gap-1 disabled:opacity-50"
          >
            {state === "loading" && <Loader2 className="w-3 h-3 animate-spin" />}
            {state === "ok" && <CheckCircle2 className="w-3 h-3 text-green-500" />}
            {state === "error" && <XCircle className="w-3 h-3 text-red-500" />}
            {state === "loading" ? "Testing…" : "Test connection"}
          </button>
        </div>
        <input
          type="password"
          value={settings[keyField] || ""}
          onChange={(e) => {
            update(keyField, e.target.value);
            setTestState((s) => ({ ...s, [p]: "idle" }));
          }}
          placeholder={placeholder}
          className="w-full px-3 py-2 border border-neutral-300 rounded-lg text-sm font-mono focus:outline-none focus:ring-2 focus:ring-teal-500"
        />
        {testMsg[p] && (
          <p className={`text-[11px] mt-1 ${state === "ok" ? "text-green-600" : "text-red-500"}`}>
            {testMsg[p]}
          </p>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-5">
      {/* Provider selector */}
      <div>
        <label className="block text-xs font-semibold text-neutral-500 mb-1.5 uppercase tracking-wide">
          Default AI Provider
        </label>
        <select
          value={provider}
          onChange={(e) => update("ai_provider", e.target.value)}
          className="w-full border border-neutral-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
        >
          <option value="anthropic">Claude (Anthropic)</option>
          <option value="openai">ChatGPT (OpenAI)</option>
          <option value="gemini">Gemini (Google)</option>
          <option value="perplexity">Perplexity</option>
        </select>
        <p className="text-xs text-neutral-400 mt-1">
          All AI features use this provider by default. Users can override per-request using the model picker.
        </p>
      </div>

      {/* Model override */}
      <div>
        <label className="block text-xs font-semibold text-neutral-500 mb-1.5 uppercase tracking-wide">
          Model override <span className="font-normal normal-case">(optional)</span>
        </label>
        <input
          type="text"
          value={settings.ai_model || ""}
          onChange={(e) => update("ai_model", e.target.value)}
          placeholder={
            provider === "openai" ? "gpt-4o" :
            provider === "gemini" ? "gemini-2.0-flash" :
            provider === "perplexity" ? "llama-3.1-sonar-large-128k-online" :
            "claude-sonnet-4-20250514"
          }
          className="w-full border border-neutral-200 rounded-lg px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-teal-500"
        />
        <p className="text-xs text-neutral-400 mt-1">
          Leave blank to use the default model for the selected provider.
        </p>
      </div>

      {/* Setup guide */}
      {guide && (
        <div className="border border-teal-200 rounded-xl overflow-hidden">
          <button
            type="button"
            onClick={() => setShowGuide((v) => !v)}
            className="w-full flex items-center justify-between px-4 py-3 bg-teal-50 hover:bg-teal-100 transition text-left"
          >
            <div>
              <p className="text-xs font-semibold text-teal-800">
                How to get your {guide.name} API key
              </p>
              <p className="text-[11px] text-teal-600 mt-0.5">{guide.freeOption}</p>
            </div>
            {showGuide
              ? <ChevronUp className="w-4 h-4 text-teal-500 flex-shrink-0" />
              : <ChevronDown className="w-4 h-4 text-teal-500 flex-shrink-0" />
            }
          </button>

          {showGuide && (
            <div className="px-4 py-4 bg-white space-y-4">
              {guide.warning && (
                <div className="bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
                  <p className="text-xs text-amber-800 font-medium">⚠ {guide.warning}</p>
                </div>
              )}

              <ol className="space-y-2">
                {guide.steps.map((step, i) => (
                  <li key={i} className="flex gap-3 text-xs text-neutral-700">
                    <span className="flex-shrink-0 w-5 h-5 rounded-full bg-teal-100 text-teal-700 font-semibold text-[11px] flex items-center justify-center">
                      {i + 1}
                    </span>
                    <span className="pt-0.5">{step}</span>
                  </li>
                ))}
              </ol>

              <div className="flex flex-wrap gap-3 pt-1">
                <a
                  href={guide.consoleUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-xs px-3 py-1.5 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition"
                >
                  <ExternalLink className="w-3 h-3" />
                  Open {guide.name} console
                </a>
                <a
                  href={guide.billingUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-xs px-3 py-1.5 border border-neutral-200 text-neutral-600 rounded-lg hover:bg-neutral-50 transition"
                >
                  <ExternalLink className="w-3 h-3" />
                  Billing
                </a>
              </div>

              <p className="text-[11px] text-neutral-400 border-t border-neutral-100 pt-3">
                {guide.pricing}
              </p>
            </div>
          )}
        </div>
      )}

      {/* API key fields with test buttons */}
      <div className="border-t border-neutral-100 pt-4">
        <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wide mb-4">
          API Keys
        </p>
        <p className="text-xs text-neutral-400 mb-4">
          Add keys for any providers you want to use. Keys are stored securely and never exposed via the public API.
          You can configure multiple providers and switch between them using the model picker.
        </p>
        {renderKeyField("anthropic", "Anthropic API key", "sk-ant-api03-…")}
        {renderKeyField("openai", "OpenAI API key", "sk-proj-… or sk-…")}
        {renderKeyField("gemini", "Gemini API key", "AIza…")}
        {renderKeyField("perplexity", "Perplexity API key", "pplx-…")}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────

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
          <AIIntegrationSection settings={settings} update={update} />
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
