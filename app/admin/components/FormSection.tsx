"use client";

import { useState, ReactNode } from "react";
import { ChevronDown } from "lucide-react";

interface FormSectionProps {
  title?: string;
  children: ReactNode;
  collapsible?: boolean;
  defaultOpen?: boolean;
}

export default function FormSection({
  title,
  children,
  collapsible = false,
  defaultOpen = true,
}: FormSectionProps) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="bg-white border border-neutral-200 rounded-lg shadow-sm">
      {title && (
        <div
          className={`px-5 py-3.5 border-b border-neutral-100 flex items-center justify-between ${
            collapsible ? "cursor-pointer select-none" : ""
          }`}
          onClick={collapsible ? () => setOpen(!open) : undefined}
        >
          <h3 className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
            {title}
          </h3>
          {collapsible && (
            <ChevronDown
              className={`w-4 h-4 text-neutral-400 transition-transform ${
                open ? "" : "-rotate-90"
              }`}
            />
          )}
        </div>
      )}
      {open && <div className="p-5">{children}</div>}
    </div>
  );
}
