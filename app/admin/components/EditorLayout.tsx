"use client";

import { ReactNode } from "react";
import Breadcrumbs from "./Breadcrumbs";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface EditorLayoutProps {
  breadcrumbs: BreadcrumbItem[];
  title?: string;
  actions?: ReactNode;
  sidebar?: ReactNode;
  children: ReactNode;
}

export default function EditorLayout({
  breadcrumbs,
  title,
  actions,
  sidebar,
  children,
}: EditorLayoutProps) {
  return (
    <div>
      <Breadcrumbs items={breadcrumbs} />
      {(title || actions) && (
        <div className="flex items-center justify-between mb-6">
          {title && (
            <h1 className="text-xl font-semibold text-neutral-900">{title}</h1>
          )}
          {actions && <div>{actions}</div>}
        </div>
      )}
      <div className="flex gap-6">
        <div className="flex-1 min-w-0 space-y-5">{children}</div>
        {sidebar && (
          <div className="hidden lg:block w-72 flex-shrink-0 sticky top-6 self-start">
            {sidebar}
          </div>
        )}
      </div>
    </div>
  );
}
