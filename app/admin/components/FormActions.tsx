"use client";

import { Trash2 } from "lucide-react";

interface FormActionsProps {
  onSaveDraft?: () => void;
  onPublish?: () => void;
  onDelete?: () => void;
  saving?: boolean;
  saved?: boolean;
  published?: boolean;
}

export default function FormActions({
  onSaveDraft,
  onPublish,
  onDelete,
  saving = false,
  saved = false,
  published = false,
}: FormActionsProps) {
  return (
    <div className="flex items-center gap-2">
      {onDelete && (
        <button
          onClick={onDelete}
          className="mr-auto p-2 text-neutral-400 hover:text-red-600 transition"
          title="Delete"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      )}
      {onSaveDraft && (
        <button
          onClick={onSaveDraft}
          disabled={saving}
          className="px-4 py-2 text-sm border border-neutral-300 rounded-lg hover:bg-neutral-50 transition disabled:opacity-50 whitespace-nowrap"
        >
          {saving ? "Saving\u2026" : "Save draft"}
        </button>
      )}
      {onPublish && (
        <button
          onClick={onPublish}
          disabled={saving}
          className="px-4 py-2 bg-teal-600 text-white text-sm rounded-lg hover:bg-teal-700 transition disabled:opacity-50"
        >
          {saving ? "Publishing\u2026" : saved ? "Published!" : published ? "Update" : "Publish"}
        </button>
      )}
    </div>
  );
}
