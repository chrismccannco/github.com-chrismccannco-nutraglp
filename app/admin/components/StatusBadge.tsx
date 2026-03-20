"use client";

type Status = "published" | "draft" | "archived";

const styles: Record<Status, string> = {
  published: "bg-indigo-50 text-indigo-700 ring-indigo-600/20",
  draft: "bg-amber-50 text-amber-700 ring-amber-600/20",
  archived: "bg-neutral-100 text-neutral-500 ring-neutral-500/20",
};

const labels: Record<Status, string> = {
  published: "Published",
  draft: "Draft",
  archived: "Archived",
};

export default function StatusBadge({ status }: { status: Status }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium ring-1 ring-inset ${styles[status]}`}
    >
      {labels[status]}
    </span>
  );
}
