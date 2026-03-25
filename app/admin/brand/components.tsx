'use client';
import { Check, Loader2 } from 'lucide-react';

export function SaveIndicator({ saving, saved }: { saving: boolean; saved: boolean }) {
  if (saving) return (
    <span className="flex items-center gap-1.5 text-xs text-neutral-400">
      <Loader2 size={12} className="animate-spin" /> Saving…
    </span>
  );
  if (saved) return (
    <span className="flex items-center gap-1.5 text-xs text-teal-600">
      <Check size={12} /> Saved
    </span>
  );
  return null;
}

export function SaveButton({
  onSave,
  saving,
  saved,
}: {
  onSave: () => void;
  saving: boolean;
  saved: boolean;
}) {
  return (
    <button
      onClick={onSave}
      disabled={saving}
      className="flex items-center gap-2 px-4 py-2 bg-neutral-900 text-white text-sm font-medium rounded-lg hover:bg-neutral-700 disabled:opacity-50 transition-colors"
    >
      {saving ? (
        <><Loader2 size={13} className="animate-spin" /> Saving…</>
      ) : saved ? (
        <><Check size={13} /> Saved</>
      ) : (
        'Save changes'
      )}
    </button>
  );
}

export function SectionHeader({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex items-start justify-between mb-6">
      <div>
        <h2 className="text-base font-semibold text-neutral-900">{title}</h2>
        {description && <p className="text-sm text-neutral-500 mt-0.5">{description}</p>}
      </div>
      {action}
    </div>
  );
}

export function Card({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`bg-white rounded-xl border border-neutral-200 ${className}`}>
      {children}
    </div>
  );
}
