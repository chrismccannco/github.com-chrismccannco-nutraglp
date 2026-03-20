"use client";

import { useEffect, useState, useCallback } from "react";
import {
  Plus,
  Globe,
  Trash2,
  Star,
  ChevronRight,
  Languages,
  Save,
  Check,
} from "lucide-react";
import type { Locale } from "@/lib/types/i18n";
import { LOCALE_PRESETS, TRANSLATABLE_FIELDS, type TranslatableContentType } from "@/lib/types/i18n";

export default function LocalizationPage() {
  const [locales, setLocales] = useState<Locale[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [addCode, setAddCode] = useState("");
  const [tab, setTab] = useState<"locales" | "content" | "ui">("locales");

  // Content translation state
  const [contentType, setContentType] = useState<TranslatableContentType>("page");
  const [contentItems, setContentItems] = useState<{ id: number; title: string }[]>([]);
  const [selectedItem, setSelectedItem] = useState<number | null>(null);
  const [selectedLocale, setSelectedLocale] = useState("");
  const [translations, setTranslations] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  // UI translations state
  const [uiLocale, setUiLocale] = useState("");
  const [uiStrings, setUiStrings] = useState<Record<string, string>>({});
  const [newKey, setNewKey] = useState("");
  const [newValue, setNewValue] = useState("");

  const loadLocales = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/locales");
      if (res.ok) setLocales(await res.json());
    } catch (e) { console.error(e); }
    setLoading(false);
  }, []);

  useEffect(() => { loadLocales(); }, [loadLocales]);

  const addLocale = async () => {
    const preset = LOCALE_PRESETS.find((p) => p.code === addCode);
    if (!preset) return;
    await fetch("/api/locales", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        code: preset.code,
        name: preset.name,
        native_name: preset.native_name,
        direction: preset.direction,
        is_default: locales.length === 0,
      }),
    });
    setShowAdd(false);
    setAddCode("");
    loadLocales();
  };

  const deleteLocale = async (code: string) => {
    if (!confirm(`Delete locale "${code}" and all its translations?`)) return;
    await fetch(`/api/locales/${code}`, { method: "DELETE" });
    loadLocales();
  };

  const setDefault = async (code: string) => {
    await fetch(`/api/locales/${code}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ is_default: true }),
    });
    loadLocales();
  };

  const toggleEnabled = async (code: string, enabled: boolean) => {
    await fetch(`/api/locales/${code}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ enabled: !enabled }),
    });
    loadLocales();
  };

  // Load content items for translation
  const loadContentItems = useCallback(async () => {
    const endpoint = contentType === "page" ? "/api/pages"
      : contentType === "blog_post" ? "/api/blog"
      : contentType === "product" ? "/api/products"
      : contentType === "faq" ? "/api/faq"
      : contentType === "testimonial" ? "/api/testimonials"
      : contentType === "form" ? "/api/form-builder"
      : null;
    if (!endpoint) return;
    try {
      const res = await fetch(endpoint);
      if (res.ok) {
        const data = await res.json();
        const items = (Array.isArray(data) ? data : data.pages || data.posts || data.products || data.faqs || data.testimonials || data.forms || [])
          .map((item: Record<string, unknown>) => ({
            id: item.id as number,
            title: (item.title || item.name || item.question || `#${item.id}`) as string,
          }));
        setContentItems(items);
      }
    } catch (e) { console.error(e); }
  }, [contentType]);

  useEffect(() => {
    if (tab === "content") loadContentItems();
  }, [tab, contentType, loadContentItems]);

  // Load translations for selected content + locale
  const loadTranslations = useCallback(async () => {
    if (!selectedItem || !selectedLocale) return;
    try {
      const res = await fetch(`/api/translations?type=${contentType}&id=${selectedItem}&locale=${selectedLocale}`);
      if (res.ok) {
        const data = await res.json();
        const fields = data[selectedLocale] || {};
        const map: Record<string, string> = {};
        for (const [k, v] of Object.entries(fields)) {
          map[k] = (v as { value: string }).value;
        }
        setTranslations(map);
      }
    } catch (e) { console.error(e); }
  }, [selectedItem, selectedLocale, contentType]);

  useEffect(() => { loadTranslations(); }, [loadTranslations]);

  const saveTranslations = async () => {
    if (!selectedItem || !selectedLocale) return;
    setSaving(true);
    await fetch("/api/translations", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type: contentType,
        id: selectedItem,
        locale: selectedLocale,
        fields: translations,
      }),
    });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  // UI translations
  const loadUiStrings = useCallback(async () => {
    if (!uiLocale) return;
    try {
      const res = await fetch(`/api/translations/ui?locale=${uiLocale}`);
      if (res.ok) setUiStrings(await res.json());
    } catch (e) { console.error(e); }
  }, [uiLocale]);

  useEffect(() => { loadUiStrings(); }, [loadUiStrings]);

  const saveUiString = async (key: string, value: string) => {
    await fetch("/api/translations/ui", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ locale: uiLocale, strings: { [key]: value } }),
    });
  };

  const addUiString = async () => {
    if (!newKey.trim() || !newValue.trim() || !uiLocale) return;
    await saveUiString(newKey, newValue);
    setUiStrings({ ...uiStrings, [newKey]: newValue });
    setNewKey("");
    setNewValue("");
  };

  const enabledLocales = locales.filter((l) => l.enabled);
  const nonDefaultLocales = enabledLocales.filter((l) => !l.is_default);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Localization</h1>
          <p className="text-sm text-gray-500 mt-1">
            {enabledLocales.length} locale{enabledLocales.length !== 1 ? "s" : ""} enabled
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 border-b mb-6">
        {(["locales", "content", "ui"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2.5 text-sm font-medium border-b-2 transition ${
              tab === t
                ? "border-[#1B3A5C] text-[#1B3A5C]"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            {t === "locales" ? "Languages" : t === "content" ? "Content Translations" : "UI Strings"}
          </button>
        ))}
      </div>

      {/* Locales Tab */}
      {tab === "locales" && (
        <div>
          <div className="flex justify-end mb-4">
            <button
              onClick={() => setShowAdd(true)}
              className="flex items-center gap-2 px-4 py-2 bg-[#1B3A5C] text-white rounded-lg text-sm hover:bg-[#132D4A]"
            >
              <Plus size={16} />
              Add Language
            </button>
          </div>

          {showAdd && (
            <div className="bg-white border rounded-xl p-4 mb-4 flex items-end gap-3">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">Language</label>
                <select
                  value={addCode}
                  onChange={(e) => setAddCode(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg text-sm"
                >
                  <option value="">Select a language…</option>
                  {LOCALE_PRESETS.filter(
                    (p) => !locales.some((l) => l.code === p.code)
                  ).map((p) => (
                    <option key={p.code} value={p.code}>
                      {p.name} ({p.native_name})
                    </option>
                  ))}
                </select>
              </div>
              <button
                onClick={addLocale}
                disabled={!addCode}
                className="px-4 py-2 bg-[#1B3A5C] text-white rounded-lg text-sm hover:bg-[#132D4A] disabled:opacity-50"
              >
                Add
              </button>
              <button
                onClick={() => { setShowAdd(false); setAddCode(""); }}
                className="px-4 py-2 border rounded-lg text-sm hover:bg-gray-50"
              >
                Cancel
              </button>
            </div>
          )}

          {loading ? (
            <div className="text-center py-12 text-gray-500">Loading…</div>
          ) : locales.length === 0 ? (
            <div className="text-center py-12 bg-white border rounded-xl">
              <Globe size={32} className="mx-auto text-gray-400 mb-3" />
              <p className="text-gray-600 font-medium">No languages configured</p>
              <p className="text-sm text-gray-500 mt-1">Add your first language to start translating content.</p>
            </div>
          ) : (
            <div className="bg-white border rounded-xl overflow-hidden">
              {locales.map((locale) => (
                <div
                  key={locale.code}
                  className="flex items-center justify-between px-4 py-3 border-b last:border-0 hover:bg-gray-50"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-lg">{locale.direction === "rtl" ? "🔄" : "🌐"}</span>
                    <div>
                      <div className="font-medium text-gray-900 flex items-center gap-2">
                        {locale.name}
                        <span className="text-xs text-gray-400">{locale.code}</span>
                        {locale.is_default && (
                          <span className="px-1.5 py-0.5 bg-amber-100 text-amber-700 text-xs rounded">Default</span>
                        )}
                      </div>
                      <div className="text-sm text-gray-500">{locale.native_name}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => toggleEnabled(locale.code, locale.enabled)}
                      className={`px-2 py-1 text-xs rounded ${
                        locale.enabled ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"
                      }`}
                    >
                      {locale.enabled ? "Enabled" : "Disabled"}
                    </button>
                    {!locale.is_default && (
                      <>
                        <button
                          onClick={() => setDefault(locale.code)}
                          className="p-1.5 text-gray-400 hover:text-amber-500"
                          title="Set as default"
                        >
                          <Star size={14} />
                        </button>
                        <button
                          onClick={() => deleteLocale(locale.code)}
                          className="p-1.5 text-gray-400 hover:text-red-500"
                        >
                          <Trash2 size={14} />
                        </button>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Content Translations Tab */}
      {tab === "content" && (
        <div>
          {nonDefaultLocales.length === 0 ? (
            <div className="text-center py-12 bg-white border rounded-xl">
              <Languages size={32} className="mx-auto text-gray-400 mb-3" />
              <p className="text-gray-600">Add at least two languages to start translating content.</p>
            </div>
          ) : (
            <div className="grid grid-cols-12 gap-4">
              {/* Left: Content type + item selector */}
              <div className="col-span-4 space-y-3">
                <select
                  value={contentType}
                  onChange={(e) => { setContentType(e.target.value as TranslatableContentType); setSelectedItem(null); }}
                  className="w-full px-3 py-2 border rounded-lg text-sm"
                >
                  <option value="page">Pages</option>
                  <option value="blog_post">Blog Posts</option>
                  <option value="product">Products</option>
                  <option value="faq">FAQ</option>
                  <option value="testimonial">Testimonials</option>
                  <option value="form">Forms</option>
                </select>

                <div className="bg-white border rounded-xl overflow-hidden max-h-[400px] overflow-y-auto">
                  {contentItems.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => setSelectedItem(item.id)}
                      className={`w-full flex items-center justify-between px-3 py-2.5 text-sm border-b last:border-0 text-left ${
                        selectedItem === item.id ? "bg-[#1B3A5C]/5 text-[#1B3A5C]" : "hover:bg-gray-50"
                      }`}
                    >
                      <span className="truncate">{item.title}</span>
                      <ChevronRight size={14} className="text-gray-400 shrink-0" />
                    </button>
                  ))}
                  {contentItems.length === 0 && (
                    <p className="px-3 py-4 text-sm text-gray-500 text-center">No items found.</p>
                  )}
                </div>
              </div>

              {/* Right: Translation editor */}
              <div className="col-span-8">
                {!selectedItem ? (
                  <div className="bg-white border rounded-xl p-8 text-center text-gray-500">
                    Select a content item to translate.
                  </div>
                ) : (
                  <div className="bg-white border rounded-xl p-4">
                    <div className="flex items-center justify-between mb-4">
                      <select
                        value={selectedLocale}
                        onChange={(e) => setSelectedLocale(e.target.value)}
                        className="px-3 py-2 border rounded-lg text-sm"
                      >
                        <option value="">Select language…</option>
                        {nonDefaultLocales.map((l) => (
                          <option key={l.code} value={l.code}>
                            {l.name} ({l.native_name})
                          </option>
                        ))}
                      </select>

                      {selectedLocale && (
                        <button
                          onClick={saveTranslations}
                          disabled={saving}
                          className="flex items-center gap-2 px-4 py-2 bg-[#1B3A5C] text-white rounded-lg text-sm hover:bg-[#132D4A] disabled:opacity-50"
                        >
                          {saved ? <Check size={14} /> : <Save size={14} />}
                          {saved ? "Saved" : saving ? "Saving…" : "Save"}
                        </button>
                      )}
                    </div>

                    {selectedLocale ? (
                      <div className="space-y-4">
                        {(TRANSLATABLE_FIELDS[contentType] || []).map((field) => (
                          <div key={field}>
                            <label className="block text-sm font-medium text-gray-700 mb-1 capitalize">
                              {field.replace(/_/g, " ")}
                            </label>
                            {field === "description" || field === "answer" || field === "quote" ? (
                              <textarea
                                value={translations[field] || ""}
                                onChange={(e) => setTranslations({ ...translations, [field]: e.target.value })}
                                className="w-full px-3 py-2 border rounded-lg text-sm min-h-[100px]"
                                placeholder={`Translated ${field}…`}
                              />
                            ) : (
                              <input
                                type="text"
                                value={translations[field] || ""}
                                onChange={(e) => setTranslations({ ...translations, [field]: e.target.value })}
                                className="w-full px-3 py-2 border rounded-lg text-sm"
                                placeholder={`Translated ${field}…`}
                              />
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-gray-500 text-center py-4">
                        Select a language to start translating.
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* UI Strings Tab */}
      {tab === "ui" && (
        <div>
          {nonDefaultLocales.length === 0 ? (
            <div className="text-center py-12 bg-white border rounded-xl">
              <Languages size={32} className="mx-auto text-gray-400 mb-3" />
              <p className="text-gray-600">Add at least two languages to manage UI translations.</p>
            </div>
          ) : (
            <div>
              <div className="mb-4">
                <select
                  value={uiLocale}
                  onChange={(e) => setUiLocale(e.target.value)}
                  className="px-3 py-2 border rounded-lg text-sm"
                >
                  <option value="">Select language…</option>
                  {nonDefaultLocales.map((l) => (
                    <option key={l.code} value={l.code}>
                      {l.name} ({l.native_name})
                    </option>
                  ))}
                </select>
              </div>

              {uiLocale && (
                <div className="bg-white border rounded-xl overflow-hidden">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50 border-b">
                      <tr>
                        <th className="px-4 py-2.5 text-left font-medium text-gray-600">Key</th>
                        <th className="px-4 py-2.5 text-left font-medium text-gray-600">Translation</th>
                      </tr>
                    </thead>
                    <tbody>
                      {Object.entries(uiStrings).map(([key, value]) => (
                        <tr key={key} className="border-b">
                          <td className="px-4 py-2.5 font-mono text-xs text-gray-600">{key}</td>
                          <td className="px-4 py-2.5">
                            <input
                              type="text"
                              value={value}
                              onChange={(e) => setUiStrings({ ...uiStrings, [key]: e.target.value })}
                              onBlur={(e) => saveUiString(key, e.target.value)}
                              className="w-full px-2 py-1 border rounded text-sm"
                            />
                          </td>
                        </tr>
                      ))}
                      {/* Add new */}
                      <tr className="bg-gray-50">
                        <td className="px-4 py-2.5">
                          <input
                            type="text"
                            value={newKey}
                            onChange={(e) => setNewKey(e.target.value)}
                            placeholder="nav.home"
                            className="w-full px-2 py-1 border rounded text-sm font-mono"
                          />
                        </td>
                        <td className="px-4 py-2.5 flex gap-2">
                          <input
                            type="text"
                            value={newValue}
                            onChange={(e) => setNewValue(e.target.value)}
                            placeholder="Translated value…"
                            className="flex-1 px-2 py-1 border rounded text-sm"
                          />
                          <button
                            onClick={addUiString}
                            disabled={!newKey || !newValue}
                            className="px-3 py-1 bg-[#1B3A5C] text-white rounded text-xs hover:bg-[#132D4A] disabled:opacity-50"
                          >
                            Add
                          </button>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                  {Object.keys(uiStrings).length === 0 && (
                    <p className="px-4 py-6 text-sm text-gray-500 text-center">
                      No UI strings yet. Add keys like &quot;nav.home&quot;, &quot;btn.submit&quot;, etc.
                    </p>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
