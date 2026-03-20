"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Plus,
  GripVertical,
  Trash2,
  ChevronDown,
  ChevronRight,
  Copy,
  Settings2,
  Eye,
  Save,
  ArrowLeft,
  Zap,
} from "lucide-react";
import type { FormField, FieldType, FormSettings, ConditionOperator } from "@/lib/types/forms";
import AiAssistPanel from "../../components/AiAssistPanel";
import type { AiAssistResult } from "../../components/AiAssistPanel";

const fieldTypes: { type: FieldType; label: string; icon: string }[] = [
  { type: "text", label: "Text", icon: "Aa" },
  { type: "email", label: "Email", icon: "@" },
  { type: "phone", label: "Phone", icon: "#" },
  { type: "textarea", label: "Text Area", icon: "¶" },
  { type: "number", label: "Number", icon: "1" },
  { type: "select", label: "Dropdown", icon: "▾" },
  { type: "radio", label: "Radio", icon: "◉" },
  { type: "checkbox", label: "Checkbox", icon: "☑" },
  { type: "date", label: "Date", icon: "📅" },
  { type: "hidden", label: "Hidden", icon: "…" },
  { type: "heading", label: "Heading", icon: "H" },
  { type: "paragraph", label: "Paragraph", icon: "T" },
];

const conditionOperators: { value: ConditionOperator; label: string }[] = [
  { value: "equals", label: "equals" },
  { value: "not_equals", label: "does not equal" },
  { value: "contains", label: "contains" },
  { value: "not_contains", label: "does not contain" },
  { value: "greater_than", label: "is greater than" },
  { value: "less_than", label: "is less than" },
  { value: "is_empty", label: "is empty" },
  { value: "is_not_empty", label: "is not empty" },
];

function uuid() {
  return "f" + Math.random().toString(36).slice(2, 10);
}

function defaultField(type: FieldType): FormField {
  const base: FormField = {
    id: uuid(),
    type,
    label: type === "heading" ? "Section Title" : type === "paragraph" ? "Description text" : `New ${type} field`,
    placeholder: "",
    helpText: "",
    defaultValue: "",
    validation: { required: false },
    width: "full",
  };
  if (type === "select" || type === "radio" || type === "checkbox") {
    base.options = [
      { label: "Option 1", value: "option-1" },
      { label: "Option 2", value: "option-2" },
    ];
  }
  return base;
}

export default function FormEditorPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [fields, setFields] = useState<FormField[]>([]);
  const [settings, setSettings] = useState<FormSettings>({
    submitLabel: "Submit",
    successMessage: "Thank you for your submission.",
    honeypot: true,
  });
  const [published, setPublished] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);
  const [expandedField, setExpandedField] = useState<string | null>(null);
  const [showSettings, setShowSettings] = useState(false);
  const [showPalette, setShowPalette] = useState(false);
  const [dragIdx, setDragIdx] = useState<number | null>(null);

  useEffect(() => {
    fetch(`/api/form-builder/${slug}`)
      .then((r) => r.json())
      .then((data) => {
        setName(data.name || "");
        setDescription(data.description || "");
        setFields(data.fields || []);
        setSettings(data.settings || {});
        setPublished(!!data.published);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [slug]);

  const save = useCallback(
    async (pub?: boolean) => {
      setSaving(true);
      try {
        const res = await fetch(`/api/form-builder/${slug}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name,
            description,
            fields,
            settings,
            published: pub !== undefined ? pub : published,
          }),
        });
        if (res.ok && pub !== undefined) setPublished(pub);
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
      } catch {}
      setSaving(false);
    },
    [slug, name, description, fields, settings, published]
  );

  const addField = (type: FieldType) => {
    const f = defaultField(type);
    setFields([...fields, f]);
    setExpandedField(f.id);
    setShowPalette(false);
  };

  const updateField = (id: string, updates: Partial<FormField>) => {
    setFields(fields.map((f) => (f.id === id ? { ...f, ...updates } : f)));
  };

  const removeField = (id: string) => {
    setFields(fields.filter((f) => f.id !== id));
    if (expandedField === id) setExpandedField(null);
  };

  const duplicateField = (id: string) => {
    const idx = fields.findIndex((f) => f.id === id);
    if (idx < 0) return;
    const copy = { ...fields[idx], id: uuid(), label: fields[idx].label + " (copy)" };
    const next = [...fields];
    next.splice(idx + 1, 0, copy);
    setFields(next);
  };

  const moveField = (from: number, to: number) => {
    const next = [...fields];
    const [item] = next.splice(from, 1);
    next.splice(to, 0, item);
    setFields(next);
  };

  if (loading) return <p className="text-sm text-neutral-400 py-12 text-center">Loading...</p>;

  return (
    <div className="max-w-4xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.push("/admin/form-builder")}
            className="p-1.5 text-neutral-400 hover:text-neutral-600 transition"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="text-xl font-semibold text-neutral-900 bg-transparent border-none outline-none focus:ring-0 p-0"
              placeholder="Form name"
            />
            <input
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="block text-sm text-neutral-500 bg-transparent border-none outline-none focus:ring-0 p-0 mt-0.5"
              placeholder="Optional description"
            />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setPublished(!published)}
            className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-full transition ${
              published
                ? "bg-teal-50 text-teal-700 hover:bg-teal-100"
                : "bg-amber-50 text-amber-700 hover:bg-amber-100"
            }`}
          >
            <span className={`w-1.5 h-1.5 rounded-full ${published ? "bg-teal-500" : "bg-amber-500"}`} />
            {published ? "Live" : "Draft"}
          </button>
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="p-1.5 text-neutral-400 hover:text-neutral-600 transition"
            title="Form settings"
          >
            <Settings2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => save()}
            disabled={saving}
            className="flex items-center gap-1.5 px-4 py-1.5 text-sm font-medium bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition disabled:opacity-50"
          >
            <Save className="w-3.5 h-3.5" />
            {saved ? "Saved!" : saving ? "Saving..." : "Save"}
          </button>
        </div>
      </div>

      {/* Settings panel */}
      {showSettings && (
        <div className="bg-white border border-neutral-200 rounded-xl p-5 mb-6">
          <h3 className="text-sm font-semibold text-neutral-900 mb-4">Form Settings</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-neutral-500 mb-1">Submit Button Text</label>
              <input
                value={settings.submitLabel || ""}
                onChange={(e) => setSettings({ ...settings, submitLabel: e.target.value })}
                className="w-full px-3 py-2 text-sm border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-neutral-500 mb-1">Notification Email</label>
              <input
                value={settings.notifyEmail || ""}
                onChange={(e) => setSettings({ ...settings, notifyEmail: e.target.value })}
                placeholder="admin@example.com"
                className="w-full px-3 py-2 text-sm border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-xs font-medium text-neutral-500 mb-1">Success Message</label>
              <textarea
                value={settings.successMessage || ""}
                onChange={(e) => setSettings({ ...settings, successMessage: e.target.value })}
                rows={2}
                className="w-full px-3 py-2 text-sm border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-neutral-500 mb-1">Redirect URL (after submit)</label>
              <input
                value={settings.redirectUrl || ""}
                onChange={(e) => setSettings({ ...settings, redirectUrl: e.target.value })}
                placeholder="/thank-you"
                className="w-full px-3 py-2 text-sm border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-neutral-500 mb-1">Submission Limit</label>
              <input
                type="number"
                value={settings.limitSubmissions || ""}
                onChange={(e) => setSettings({ ...settings, limitSubmissions: Number(e.target.value) || undefined })}
                placeholder="Unlimited"
                className="w-full px-3 py-2 text-sm border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={settings.honeypot !== false}
                onChange={(e) => setSettings({ ...settings, honeypot: e.target.checked })}
                className="rounded border-neutral-300"
              />
              <label className="text-xs text-neutral-600">Enable honeypot spam protection</label>
            </div>
          </div>
        </div>
      )}

      {/* AI Assist */}
      <div className="mb-6">
        <AiAssistPanel
          contentType="form"
          placeholder="e.g. Contact form with name, email, and message, or Lead capture form for free supplement guide download"
          buttonLabel="Generate Fields"
          showSelectors={false}
          onResult={(data: AiAssistResult) => {
            if (data.name && !name) setName(data.name as string);
            if (data.description && !description) setDescription(data.description as string);
            if (data.fields && Array.isArray(data.fields)) {
              setFields(data.fields as FormField[]);
            }
            if (data.settings) {
              const s = data.settings as Partial<FormSettings>;
              setSettings((prev) => ({ ...prev, ...s }));
            }
          }}
        />
      </div>

      {/* Field list */}
      <div className="space-y-2 mb-4">
        {fields.map((field, idx) => (
          <FieldRow
            key={field.id}
            field={field}
            index={idx}
            expanded={expandedField === field.id}
            onToggle={() => setExpandedField(expandedField === field.id ? null : field.id)}
            onUpdate={(u) => updateField(field.id, u)}
            onRemove={() => removeField(field.id)}
            onDuplicate={() => duplicateField(field.id)}
            allFields={fields}
            dragIdx={dragIdx}
            onDragStart={() => setDragIdx(idx)}
            onDragOver={(e: React.DragEvent) => {
              e.preventDefault();
              if (dragIdx !== null && dragIdx !== idx) {
                moveField(dragIdx, idx);
                setDragIdx(idx);
              }
            }}
            onDragEnd={() => setDragIdx(null)}
          />
        ))}
      </div>

      {/* Add field */}
      {showPalette ? (
        <div className="bg-white border border-neutral-200 rounded-xl p-4 mb-6">
          <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-3">Add Field</p>
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
            {fieldTypes.map((ft) => (
              <button
                key={ft.type}
                onClick={() => addField(ft.type)}
                className="flex items-center gap-2 px-3 py-2 text-xs text-neutral-700 bg-neutral-50 rounded-lg hover:bg-teal-50 hover:text-teal-700 transition"
              >
                <span className="w-5 text-center font-mono text-neutral-400">{ft.icon}</span>
                {ft.label}
              </button>
            ))}
          </div>
        </div>
      ) : (
        <button
          onClick={() => setShowPalette(true)}
          className="w-full py-3 border-2 border-dashed border-neutral-300 rounded-xl text-sm text-neutral-400 hover:border-teal-400 hover:text-teal-600 transition flex items-center justify-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Add field
        </button>
      )}

      {/* Preview link */}
      {published && (
        <div className="mt-6 text-center">
          <a
            href={`/form/${slug}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs text-teal-600 hover:text-teal-700"
          >
            <Eye className="w-3.5 h-3.5" />
            Preview live form
          </a>
        </div>
      )}
    </div>
  );
}

function FieldRow({
  field,
  index,
  expanded,
  onToggle,
  onUpdate,
  onRemove,
  onDuplicate,
  allFields,
  dragIdx,
  onDragStart,
  onDragOver,
  onDragEnd,
}: {
  field: FormField;
  index: number;
  expanded: boolean;
  onToggle: () => void;
  onUpdate: (u: Partial<FormField>) => void;
  onRemove: () => void;
  onDuplicate: () => void;
  allFields: FormField[];
  dragIdx: number | null;
  onDragStart: () => void;
  onDragOver: (e: React.DragEvent) => void;
  onDragEnd: () => void;
}) {
  const hasConditions = field.conditional?.enabled && (field.conditional.rules?.length || 0) > 0;
  const ft = fieldTypes.find((t) => t.type === field.type);

  return (
    <div
      className={`bg-white border rounded-xl overflow-hidden transition ${
        dragIdx === index ? "border-teal-400 shadow-sm" : "border-neutral-200"
      }`}
      draggable
      onDragStart={onDragStart}
      onDragOver={onDragOver}
      onDragEnd={onDragEnd}
    >
      {/* Collapsed row */}
      <div className="flex items-center gap-2 px-3 py-2.5">
        <GripVertical className="w-4 h-4 text-neutral-300 cursor-grab flex-shrink-0" />
        <button onClick={onToggle} className="flex-1 flex items-center gap-2 text-left min-w-0">
          {expanded ? (
            <ChevronDown className="w-3.5 h-3.5 text-neutral-400 flex-shrink-0" />
          ) : (
            <ChevronRight className="w-3.5 h-3.5 text-neutral-400 flex-shrink-0" />
          )}
          <span className="w-5 text-center text-xs font-mono text-neutral-400">{ft?.icon}</span>
          <span className="text-sm font-medium text-neutral-900 truncate">{field.label}</span>
          <span className="text-[10px] text-neutral-400 px-1.5 py-0.5 bg-neutral-100 rounded-full">
            {field.type}
          </span>
          {field.validation?.required && (
            <span className="text-[10px] text-red-500">*</span>
          )}
          {hasConditions && (
            <span title="Has conditional logic"><Zap className="w-3 h-3 text-amber-500" /></span>
          )}
        </button>
        <div className="flex items-center gap-1 flex-shrink-0">
          <button onClick={onDuplicate} className="p-1 text-neutral-300 hover:text-neutral-500 transition">
            <Copy className="w-3.5 h-3.5" />
          </button>
          <button onClick={onRemove} className="p-1 text-neutral-300 hover:text-red-500 transition">
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Expanded editor */}
      {expanded && (
        <div className="border-t border-neutral-100 px-4 py-4 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-neutral-500 mb-1">Label</label>
              <input
                value={field.label}
                onChange={(e) => onUpdate({ label: e.target.value })}
                className="w-full px-3 py-1.5 text-sm border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-neutral-500 mb-1">Width</label>
              <select
                value={field.width || "full"}
                onChange={(e) => onUpdate({ width: e.target.value as "full" | "half" })}
                className="w-full px-3 py-1.5 text-sm border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
              >
                <option value="full">Full width</option>
                <option value="half">Half width</option>
              </select>
            </div>
          </div>

          {!["heading", "paragraph", "hidden"].includes(field.type) && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-neutral-500 mb-1">Placeholder</label>
                <input
                  value={field.placeholder || ""}
                  onChange={(e) => onUpdate({ placeholder: e.target.value })}
                  className="w-full px-3 py-1.5 text-sm border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-neutral-500 mb-1">Help Text</label>
                <input
                  value={field.helpText || ""}
                  onChange={(e) => onUpdate({ helpText: e.target.value })}
                  className="w-full px-3 py-1.5 text-sm border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
            </div>
          )}

          {/* Options for select/radio/checkbox */}
          {["select", "radio", "checkbox"].includes(field.type) && (
            <div>
              <label className="block text-xs font-medium text-neutral-500 mb-2">Options</label>
              <div className="space-y-1.5">
                {(field.options || []).map((opt, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <input
                      value={opt.label}
                      onChange={(e) => {
                        const next = [...(field.options || [])];
                        next[i] = { ...next[i], label: e.target.value, value: e.target.value.toLowerCase().replace(/\s+/g, "-") };
                        onUpdate({ options: next });
                      }}
                      className="flex-1 px-2 py-1 text-sm border border-neutral-300 rounded focus:outline-none focus:ring-1 focus:ring-teal-500"
                    />
                    <button
                      onClick={() => {
                        const next = (field.options || []).filter((_, j) => j !== i);
                        onUpdate({ options: next });
                      }}
                      className="p-0.5 text-neutral-300 hover:text-red-500"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                ))}
                <button
                  onClick={() => {
                    const next = [...(field.options || []), { label: `Option ${(field.options?.length || 0) + 1}`, value: `option-${(field.options?.length || 0) + 1}` }];
                    onUpdate({ options: next });
                  }}
                  className="text-xs text-teal-600 hover:text-teal-700"
                >
                  + Add option
                </button>
              </div>
            </div>
          )}

          {/* Validation */}
          {!["heading", "paragraph"].includes(field.type) && (
            <div>
              <label className="block text-xs font-medium text-neutral-500 mb-2">Validation</label>
              <div className="flex items-center gap-4">
                <label className="flex items-center gap-1.5 text-xs text-neutral-600">
                  <input
                    type="checkbox"
                    checked={field.validation?.required || false}
                    onChange={(e) =>
                      onUpdate({ validation: { ...field.validation, required: e.target.checked } })
                    }
                    className="rounded border-neutral-300"
                  />
                  Required
                </label>
                {["text", "textarea", "email"].includes(field.type) && (
                  <>
                    <label className="flex items-center gap-1 text-xs text-neutral-600">
                      Min
                      <input
                        type="number"
                        value={field.validation?.minLength || ""}
                        onChange={(e) =>
                          onUpdate({
                            validation: { ...field.validation, minLength: Number(e.target.value) || undefined },
                          })
                        }
                        className="w-14 px-1.5 py-0.5 text-xs border border-neutral-300 rounded"
                      />
                    </label>
                    <label className="flex items-center gap-1 text-xs text-neutral-600">
                      Max
                      <input
                        type="number"
                        value={field.validation?.maxLength || ""}
                        onChange={(e) =>
                          onUpdate({
                            validation: { ...field.validation, maxLength: Number(e.target.value) || undefined },
                          })
                        }
                        className="w-14 px-1.5 py-0.5 text-xs border border-neutral-300 rounded"
                      />
                    </label>
                  </>
                )}
              </div>
            </div>
          )}

          {/* Conditional Logic */}
          <ConditionalEditor
            field={field}
            allFields={allFields}
            onUpdate={onUpdate}
          />
        </div>
      )}
    </div>
  );
}

function ConditionalEditor({
  field,
  allFields,
  onUpdate,
}: {
  field: FormField;
  allFields: FormField[];
  onUpdate: (u: Partial<FormField>) => void;
}) {
  const cond = field.conditional || { enabled: false, action: "show" as const, match: "all" as const, rules: [] };
  const otherFields = allFields.filter(
    (f) => f.id !== field.id && !["heading", "paragraph"].includes(f.type)
  );

  const toggle = () => {
    onUpdate({
      conditional: { ...cond, enabled: !cond.enabled },
    });
  };

  const updateCond = (u: Partial<typeof cond>) => {
    onUpdate({ conditional: { ...cond, ...u } });
  };

  return (
    <div>
      <button
        onClick={toggle}
        className="flex items-center gap-1.5 text-xs font-medium text-neutral-500 hover:text-neutral-700"
      >
        <Zap className={`w-3.5 h-3.5 ${cond.enabled ? "text-amber-500" : ""}`} />
        Conditional Logic
        {cond.enabled ? " (active)" : ""}
      </button>

      {cond.enabled && (
        <div className="mt-3 p-3 bg-amber-50 rounded-lg border border-amber-100">
          <div className="flex items-center gap-2 text-xs mb-3">
            <select
              value={cond.action}
              onChange={(e) => updateCond({ action: e.target.value as "show" | "hide" })}
              className="px-2 py-1 border border-amber-200 rounded text-xs bg-white"
            >
              <option value="show">Show</option>
              <option value="hide">Hide</option>
            </select>
            <span className="text-neutral-600">this field when</span>
            <select
              value={cond.match}
              onChange={(e) => updateCond({ match: e.target.value as "all" | "any" })}
              className="px-2 py-1 border border-amber-200 rounded text-xs bg-white"
            >
              <option value="all">all</option>
              <option value="any">any</option>
            </select>
            <span className="text-neutral-600">of these conditions are met:</span>
          </div>

          <div className="space-y-2">
            {(cond.rules || []).map((rule, i) => (
              <div key={i} className="flex items-center gap-2">
                <select
                  value={rule.fieldId}
                  onChange={(e) => {
                    const next = [...(cond.rules || [])];
                    next[i] = { ...next[i], fieldId: e.target.value };
                    updateCond({ rules: next });
                  }}
                  className="flex-1 px-2 py-1 text-xs border border-amber-200 rounded bg-white"
                >
                  <option value="">Select field...</option>
                  {otherFields.map((f) => (
                    <option key={f.id} value={f.id}>
                      {f.label}
                    </option>
                  ))}
                </select>
                <select
                  value={rule.operator}
                  onChange={(e) => {
                    const next = [...(cond.rules || [])];
                    next[i] = { ...next[i], operator: e.target.value as ConditionOperator };
                    updateCond({ rules: next });
                  }}
                  className="px-2 py-1 text-xs border border-amber-200 rounded bg-white"
                >
                  {conditionOperators.map((op) => (
                    <option key={op.value} value={op.value}>
                      {op.label}
                    </option>
                  ))}
                </select>
                {!["is_empty", "is_not_empty"].includes(rule.operator) && (
                  <input
                    value={rule.value}
                    onChange={(e) => {
                      const next = [...(cond.rules || [])];
                      next[i] = { ...next[i], value: e.target.value };
                      updateCond({ rules: next });
                    }}
                    placeholder="Value"
                    className="w-28 px-2 py-1 text-xs border border-amber-200 rounded bg-white"
                  />
                )}
                <button
                  onClick={() => {
                    const next = (cond.rules || []).filter((_, j) => j !== i);
                    updateCond({ rules: next });
                  }}
                  className="p-0.5 text-amber-400 hover:text-red-500"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>

          <button
            onClick={() => {
              updateCond({
                rules: [...(cond.rules || []), { fieldId: "", operator: "equals" as ConditionOperator, value: "" }],
              });
            }}
            className="mt-2 text-xs text-amber-700 hover:text-amber-800"
          >
            + Add condition
          </button>
        </div>
      )}
    </div>
  );
}
