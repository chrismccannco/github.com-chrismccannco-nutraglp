"use client";

import { useState, useMemo } from "react";
import { Search, ChevronUp, ChevronDown, MoreHorizontal } from "lucide-react";

export interface Column<T> {
  key: string;
  label: string;
  sortable?: boolean;
  render?: (row: T) => React.ReactNode;
  className?: string;
}

interface Action<T> {
  label: string;
  onClick: (row: T) => void;
  destructive?: boolean;
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  actions?: Action<T>[];
  searchable?: boolean;
  searchKeys?: string[];
  pageSize?: number;
  onRowClick?: (row: T) => void;
  emptyMessage?: string;
}

export default function DataTable<T extends Record<string, any>>({
  data,
  columns,
  actions,
  searchable = true,
  searchKeys = [],
  pageSize = 20,
  onRowClick,
  emptyMessage = "No items found.",
}: DataTableProps<T>) {
  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");
  const [page, setPage] = useState(0);
  const [openMenu, setOpenMenu] = useState<number | null>(null);

  const filtered = useMemo(() => {
    if (!search) return data;
    const q = search.toLowerCase();
    return data.filter((row) => {
      const keys = searchKeys.length > 0 ? searchKeys : Object.keys(row);
      return keys.some((k) => {
        const v = row[k];
        return typeof v === "string" && v.toLowerCase().includes(q);
      });
    });
  }, [data, search, searchKeys]);

  const sorted = useMemo(() => {
    if (!sortKey) return filtered;
    return [...filtered].sort((a, b) => {
      const av = a[sortKey];
      const bv = b[sortKey];
      if (av == null && bv == null) return 0;
      if (av == null) return 1;
      if (bv == null) return -1;
      const cmp =
        typeof av === "number" && typeof bv === "number"
          ? av - bv
          : String(av).localeCompare(String(bv));
      return sortDir === "asc" ? cmp : -cmp;
    });
  }, [filtered, sortKey, sortDir]);

  const totalPages = Math.max(1, Math.ceil(sorted.length / pageSize));
  const paged = sorted.slice(page * pageSize, (page + 1) * pageSize);

  const handleSort = (key: string) => {
    if (sortKey === key) {
      setSortDir(sortDir === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
  };

  return (
    <div>
      {searchable && (
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
          <input
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(0);
            }}
            placeholder="Search\u2026"
            className="w-full pl-9 pr-4 py-2 border border-neutral-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white"
          />
        </div>
      )}

      <div className="bg-white border border-neutral-200 rounded-lg shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-neutral-100">
              {columns.map((col) => (
                <th
                  key={col.key}
                  className={`text-left text-[11px] font-semibold uppercase tracking-wider text-neutral-400 px-4 py-3 ${
                    col.sortable ? "cursor-pointer select-none hover:text-neutral-600" : ""
                  } ${col.className || ""}`}
                  onClick={col.sortable ? () => handleSort(col.key) : undefined}
                >
                  <span className="flex items-center gap-1">
                    {col.label}
                    {col.sortable && sortKey === col.key && (
                      sortDir === "asc" ? (
                        <ChevronUp className="w-3 h-3" />
                      ) : (
                        <ChevronDown className="w-3 h-3" />
                      )
                    )}
                  </span>
                </th>
              ))}
              {actions && actions.length > 0 && (
                <th className="w-10 px-4 py-3" />
              )}
            </tr>
          </thead>
          <tbody>
            {paged.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length + (actions ? 1 : 0)}
                  className="text-center text-neutral-400 py-12 text-sm"
                >
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              paged.map((row, idx) => (
                <tr
                  key={idx}
                  className={`border-b border-neutral-50 last:border-0 transition ${
                    onRowClick
                      ? "cursor-pointer hover:bg-neutral-50"
                      : "hover:bg-neutral-50/50"
                  }`}
                  onClick={() => onRowClick?.(row)}
                >
                  {columns.map((col) => (
                    <td
                      key={col.key}
                      className={`px-4 py-3 text-neutral-700 ${col.className || ""}`}
                    >
                      {col.render
                        ? col.render(row)
                        : (row[col.key] as React.ReactNode) ?? "\u2014"}
                    </td>
                  ))}
                  {actions && actions.length > 0 && (
                    <td className="px-4 py-3 text-right relative">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setOpenMenu(openMenu === idx ? null : idx);
                        }}
                        className="p-1 rounded hover:bg-neutral-100 transition"
                      >
                        <MoreHorizontal className="w-4 h-4 text-neutral-400" />
                      </button>
                      {openMenu === idx && (
                        <div
                          className="absolute right-4 top-full mt-1 bg-white border border-neutral-200 rounded-lg shadow-md py-1 z-20 min-w-[120px]"
                          onMouseLeave={() => setOpenMenu(null)}
                        >
                          {actions.map((action, ai) => (
                            <button
                              key={ai}
                              onClick={(e) => {
                                e.stopPropagation();
                                setOpenMenu(null);
                                action.onClick(row);
                              }}
                              className={`block w-full text-left px-3 py-1.5 text-xs hover:bg-neutral-50 transition ${
                                action.destructive
                                  ? "text-red-600"
                                  : "text-neutral-700"
                              }`}
                            >
                              {action.label}
                            </button>
                          ))}
                        </div>
                      )}
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-3 text-xs text-neutral-500">
          <span>
            {sorted.length} item{sorted.length !== 1 ? "s" : ""}
          </span>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setPage(Math.max(0, page - 1))}
              disabled={page === 0}
              className="px-2 py-1 rounded hover:bg-neutral-100 disabled:opacity-30 transition"
            >
              Prev
            </button>
            <span className="px-2">
              {page + 1} / {totalPages}
            </span>
            <button
              onClick={() => setPage(Math.min(totalPages - 1, page + 1))}
              disabled={page >= totalPages - 1}
              className="px-2 py-1 rounded hover:bg-neutral-100 disabled:opacity-30 transition"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
