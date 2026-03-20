/** Form field types */
export type FieldType =
  | "text"
  | "email"
  | "phone"
  | "textarea"
  | "number"
  | "select"
  | "radio"
  | "checkbox"
  | "date"
  | "file"
  | "hidden"
  | "heading"
  | "paragraph";

/** Conditional logic operator */
export type ConditionOperator =
  | "equals"
  | "not_equals"
  | "contains"
  | "not_contains"
  | "greater_than"
  | "less_than"
  | "is_empty"
  | "is_not_empty";

/** A single condition rule */
export interface ConditionRule {
  fieldId: string;
  operator: ConditionOperator;
  value: string;
}

/** Conditional logic for showing/hiding a field */
export interface ConditionalLogic {
  enabled: boolean;
  action: "show" | "hide";
  match: "all" | "any";
  rules: ConditionRule[];
}

/** Validation rules for a field */
export interface FieldValidation {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  min?: number;
  max?: number;
  pattern?: string;
  patternMessage?: string;
}

/** A form field definition */
export interface FormField {
  id: string;
  type: FieldType;
  label: string;
  placeholder?: string;
  helpText?: string;
  defaultValue?: string;
  options?: { label: string; value: string }[];
  validation?: FieldValidation;
  conditional?: ConditionalLogic;
  width?: "full" | "half";
}

/** Form settings */
export interface FormSettings {
  submitLabel?: string;
  successMessage?: string;
  redirectUrl?: string;
  notifyEmail?: string;
  honeypot?: boolean;
  recaptcha?: boolean;
  limitSubmissions?: number;
}

/** Full form definition */
export interface Form {
  id: number;
  slug: string;
  name: string;
  description: string | null;
  fields: FormField[];
  settings: FormSettings;
  published: boolean;
  submission_count: number;
  created_at: string;
  updated_at: string;
}

/** A form submission */
export interface FormSubmission {
  id: number;
  form_id: number;
  data: Record<string, unknown>;
  metadata: {
    ip?: string;
    userAgent?: string;
    referrer?: string;
    submittedAt?: string;
  };
  created_at: string;
}
