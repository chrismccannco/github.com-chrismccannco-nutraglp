/** Locale definition */
export interface Locale {
  id: number;
  code: string;
  name: string;
  native_name: string;
  direction: "ltr" | "rtl";
  is_default: boolean;
  enabled: boolean;
  sort_order: number;
  created_at: string;
}

/** A translation record for a specific content field */
export interface Translation {
  id: number;
  content_type: string;
  content_id: number;
  locale: string;
  field_name: string;
  value: string;
  auto_translated: boolean;
  updated_at: string;
}

/** A UI string translation (navigation, buttons, labels) */
export interface UITranslation {
  id: number;
  locale: string;
  key: string;
  value: string;
  updated_at: string;
}

/** Content types that support translation */
export type TranslatableContentType =
  | "page"
  | "blog_post"
  | "product"
  | "faq"
  | "testimonial"
  | "form";

/** Map of field names to translated values for a single locale */
export type TranslationMap = Record<string, string>;

/** All translations for a content item, keyed by locale code */
export type ContentTranslations = Record<string, TranslationMap>;

/** Translatable fields per content type */
export const TRANSLATABLE_FIELDS: Record<TranslatableContentType, string[]> = {
  page: ["title", "meta_description", "meta_title"],
  blog_post: ["title", "description", "meta_title", "meta_description"],
  product: ["name", "tagline", "description"],
  faq: ["question", "answer"],
  testimonial: ["quote", "name", "title"],
  form: ["name", "description"],
};

/** Common locale presets */
export const LOCALE_PRESETS: { code: string; name: string; native_name: string; direction: "ltr" | "rtl" }[] = [
  { code: "en", name: "English", native_name: "English", direction: "ltr" },
  { code: "es", name: "Spanish", native_name: "Español", direction: "ltr" },
  { code: "fr", name: "French", native_name: "Français", direction: "ltr" },
  { code: "de", name: "German", native_name: "Deutsch", direction: "ltr" },
  { code: "it", name: "Italian", native_name: "Italiano", direction: "ltr" },
  { code: "pt", name: "Portuguese", native_name: "Português", direction: "ltr" },
  { code: "ja", name: "Japanese", native_name: "日本語", direction: "ltr" },
  { code: "ko", name: "Korean", native_name: "한국어", direction: "ltr" },
  { code: "zh", name: "Chinese", native_name: "中文", direction: "ltr" },
  { code: "ar", name: "Arabic", native_name: "العربية", direction: "rtl" },
  { code: "hi", name: "Hindi", native_name: "हिन्दी", direction: "ltr" },
  { code: "nl", name: "Dutch", native_name: "Nederlands", direction: "ltr" },
  { code: "ru", name: "Russian", native_name: "Русский", direction: "ltr" },
  { code: "tr", name: "Turkish", native_name: "Türkçe", direction: "ltr" },
  { code: "he", name: "Hebrew", native_name: "עברית", direction: "rtl" },
];
