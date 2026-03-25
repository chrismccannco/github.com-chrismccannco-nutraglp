"use client";

import { useEffect, useState, useCallback, FormEvent } from "react";
import { useParams } from "next/navigation";
import type { FormField, ConditionalLogic, FormSettings } from "@/lib/types/forms";

/* ──── conditional logic evaluator ──── */
function evaluateCondition(
  fields: FormField[],
  values: Record<string, string>,
  conditional?: ConditionalLogic
): boolean {
  if (!conditional?.enabled || !conditional.rules.length) return true;

  const results = conditional.rules.map((rule) => {
    const val = values[rule.fieldId] ?? "";
    switch (rule.operator) {
      case "equals":
        return val === rule.value;
      case "not_equals":
        return val !== rule.value;
      case "contains":
        return val.toLowerCase().includes(rule.value.toLowerCase());
      case "not_contains":
        return !val.toLowerCase().includes(rule.value.toLowerCase());
      case "greater_than":
        return parseFloat(val) > parseFloat(rule.value);
      case "less_than":
        return parseFloat(val) < parseFloat(rule.value);
      case "is_empty":
        return val.trim() === "";
      case "is_not_empty":
        return val.trim() !== "";
      default:
        return true;
    }
  });

  const match = conditional.match === "all"
    ? results.every(Boolean)
    : results.some(Boolean);

  return conditional.action === "show" ? match : !match;
}

/* ──── field renderer ──── */
function FieldInput({
  field,
  value,
  onChange,
  error,
}: {
  field: FormField;
  value: string;
  onChange: (v: string) => void;
  error?: string;
}) {
  const base =
    "w-full px-3 py-2.5 border rounded-lg text-sm focus:ring-2 focus:ring-[#0e3078]/20 focus:border-[#0e3078] outline-none transition";
  const errClass = error ? "border-red-400" : "border-gray-300";

  if (field.type === "heading") {
    return <h3 className="text-lg font-semibold text-gray-900 mt-4">{field.label}</h3>;
  }
  if (field.type === "paragraph") {
    return <p className="text-sm text-gray-600">{field.label}</p>;
  }
  if (field.type === "hidden") {
    return <input type="hidden" name={field.id} value={field.defaultValue || ""} />;
  }

  return (
    <div className={field.width === "half" ? "w-1/2" : "w-full"}>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {field.label}
        {field.validation?.required && <span className="text-red-500 ml-0.5">*</span>}
      </label>

      {field.type === "textarea" ? (
        <textarea
          className={`${base} ${errClass} min-h-[100px]`}
          placeholder={field.placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      ) : field.type === "select" ? (
        <select
          className={`${base} ${errClass}`}
          value={value}
          onChange={(e) => onChange(e.target.value)}
        >
          <option value="">{field.placeholder || "Select…"}</option>
          {field.options?.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      ) : field.type === "radio" ? (
        <div className="flex flex-col gap-2 mt-1">
          {field.options?.map((o) => (
            <label key={o.value} className="flex items-center gap-2 text-sm">
              <input
                type="radio"
                name={field.id}
                value={o.value}
                checked={value === o.value}
                onChange={() => onChange(o.value)}
                className="accent-[#0e3078]"
              />
              {o.label}
            </label>
          ))}
        </div>
      ) : field.type === "checkbox" ? (
        <div className="flex flex-col gap-2 mt-1">
          {field.options?.length ? (
            field.options.map((o) => {
              const checked = (value || "").split(",").includes(o.value);
              return (
                <label key={o.value} className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => {
                      const vals = (value || "").split(",").filter(Boolean);
                      const next = checked
                        ? vals.filter((v) => v !== o.value)
                        : [...vals, o.value];
                      onChange(next.join(","));
                    }}
                    className="accent-[#0e3078]"
                  />
                  {o.label}
                </label>
              );
            })
          ) : (
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={value === "true"}
                onChange={(e) => onChange(e.target.checked ? "true" : "")}
                className="accent-[#0e3078]"
              />
              {field.placeholder || field.label}
            </label>
          )}
        </div>
      ) : (
        <input
          type={field.type === "email" ? "email" : field.type === "phone" ? "tel" : field.type === "number" ? "number" : field.type === "date" ? "date" : "text"}
          className={`${base} ${errClass}`}
          placeholder={field.placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          min={field.validation?.min}
          max={field.validation?.max}
          minLength={field.validation?.minLength}
          maxLength={field.validation?.maxLength}
          pattern={field.validation?.pattern}
        />
      )}

      {field.helpText && <p className="text-xs text-gray-500 mt-1">{field.helpText}</p>}
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  );
}

/* ──── main form page ──── */
export default function PublicFormPage() {
  const params = useParams();
  const slug = params?.slug as string;

  const [fields, setFields] = useState<FormField[]>([]);
  const [settings, setSettings] = useState<FormSettings>({});
  const [formName, setFormName] = useState("");
  const [formDesc, setFormDesc] = useState("");
  const [values, setValues] = useState<Record<string, string>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [loadError, setLoadError] = useState("");

  useEffect(() => {
    fetch(`/api/form-builder/${slug}`)
      .then((r) => {
        if (!r.ok) throw new Error("Form not found");
        return r.json();
      })
      .then((form) => {
        if (!form.published) {
          setLoadError("This form is not currently available.");
          return;
        }
        setFormName(form.name);
        setFormDesc(form.description || "");
        const f = typeof form.fields === "string" ? JSON.parse(form.fields) : form.fields;
        const s = typeof form.settings === "string" ? JSON.parse(form.settings) : form.settings;
        setFields(f);
        setSettings(s);
        // Set default values
        const defaults: Record<string, string> = {};
        f.forEach((field: FormField) => {
          if (field.defaultValue) defaults[field.id] = field.defaultValue;
        });
        setValues(defaults);
      })
      .catch(() => setLoadError("Form not found."));
  }, [slug]);

  const visibleFields = fields.filter((f) => evaluateCondition(fields, values, f.conditional));

  const validate = (): boolean => {
    const errs: Record<string, string> = {};
    for (const field of visibleFields) {
      if (["heading", "paragraph", "hidden"].includes(field.type)) continue;
      const val = values[field.id] ?? "";
      if (field.validation?.required && !val.trim()) {
        errs[field.id] = "This field is required.";
      }
      if (field.validation?.minLength && val.length < field.validation.minLength) {
        errs[field.id] = `Minimum ${field.validation.minLength} characters.`;
      }
      if (field.validation?.maxLength && val.length > field.validation.maxLength) {
        errs[field.id] = `Maximum ${field.validation.maxLength} characters.`;
      }
      if (field.type === "email" && val && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) {
        errs[field.id] = "Please enter a valid email address.";
      }
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);

    // Build submission data — only visible field values
    const data: Record<string, string> = {};
    for (const f of visibleFields) {
      if (["heading", "paragraph"].includes(f.type)) continue;
      data[f.id] = values[f.id] ?? "";
    }

    // Include honeypot
    const body: Record<string, unknown> = { data };
    const hp = (document.getElementById("_hp_field") as HTMLInputElement)?.value;
    if (hp) body._hp = hp;

    try {
      const res = await fetch(`/api/form-builder/${slug}/submissions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) {
        const err = await res.json();
        setErrors({ _form: err.error || "Submission failed." });
      } else {
        if (settings.redirectUrl) {
          window.location.href = settings.redirectUrl;
          return;
        }
        setSubmitted(true);
      }
    } catch {
      setErrors({ _form: "Something went wrong. Please try again." });
    }
    setSubmitting(false);
  };

  if (loadError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f5f2eb]">
        <p className="text-gray-600">{loadError}</p>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f5f2eb]">
        <div className="bg-white rounded-2xl shadow-sm p-8 max-w-md w-full text-center">
          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Thank you!</h2>
          <p className="text-gray-600">
            {settings.successMessage || "Your submission has been received."}
          </p>
        </div>
      </div>
    );
  }

  if (!fields.length) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f5f2eb]">
        <div className="animate-pulse text-gray-500">Loading form…</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f5f2eb] py-12 px-4">
      <div className="max-w-xl mx-auto">
        <div className="bg-white rounded-2xl shadow-sm p-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-1">{formName}</h1>
          {formDesc && <p className="text-gray-600 text-sm mb-6">{formDesc}</p>}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Honeypot */}
            {settings.honeypot !== false && (
              <div style={{ position: "absolute", left: "-9999px" }} aria-hidden="true">
                <input type="text" id="_hp_field" name="_hp" tabIndex={-1} autoComplete="off" />
              </div>
            )}

            <div className="flex flex-wrap gap-4">
              {visibleFields.map((field) => (
                <FieldInput
                  key={field.id}
                  field={field}
                  value={values[field.id] ?? ""}
                  onChange={(v) => setValues({ ...values, [field.id]: v })}
                  error={errors[field.id]}
                />
              ))}
            </div>

            {errors._form && (
              <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded">{errors._form}</p>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3 bg-[#0e3078] text-white rounded-lg font-medium hover:bg-[#0a2463] transition disabled:opacity-50"
            >
              {submitting ? "Submitting…" : settings.submitLabel || "Submit"}
            </button>
          </form>
        </div>

        <p className="text-center text-xs text-gray-400 mt-4">
          Powered by NutraGLP
        </p>
      </div>
    </div>
  );
}
