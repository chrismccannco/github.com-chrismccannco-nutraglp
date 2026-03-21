"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Plus, ExternalLink } from "lucide-react";

interface CalendarPost {
  id: number;
  slug: string;
  title: string;
  description: string;
  tag: string;
  published: boolean;
  date: string;
  publish_at: string | null;
  effective_date: string;
}

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

function toDateKey(dateStr: string): string {
  // Normalize to YYYY-MM-DD ignoring time
  return dateStr?.slice(0, 10) ?? "";
}

function getStatus(post: CalendarPost): "published" | "scheduled" | "draft" {
  if (post.published) return "published";
  if (post.publish_at) return "scheduled";
  return "draft";
}

const STATUS_COLORS = {
  published: "bg-teal-500",
  scheduled: "bg-amber-400",
  draft: "bg-neutral-300",
};

const STATUS_BADGE = {
  published: "bg-teal-100 text-teal-700",
  scheduled: "bg-amber-100 text-amber-700",
  draft: "bg-neutral-100 text-neutral-500",
};

const STATUS_LABEL = {
  published: "Published",
  scheduled: "Scheduled",
  draft: "Draft",
};

export default function ContentCalendarPage() {
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth()); // 0-indexed
  const [posts, setPosts] = useState<CalendarPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<CalendarPost[] | null>(null);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/calendar")
      .then((r) => r.json())
      .then((d) => setPosts(d.posts ?? []))
      .finally(() => setLoading(false));
  }, []);

  // Build a map: date string → posts[]
  const postsByDate = useMemo(() => {
    const map: Record<string, CalendarPost[]> = {};
    for (const p of posts) {
      const key = toDateKey(p.effective_date);
      if (!key) continue;
      if (!map[key]) map[key] = [];
      map[key].push(p);
    }
    return map;
  }, [posts]);

  // Calendar grid
  const firstDay = new Date(year, month, 1).getDay(); // 0 = Sun
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells: (number | null)[] = [
    ...Array(firstDay).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];
  // Pad to complete last row
  while (cells.length % 7 !== 0) cells.push(null);

  function prevMonth() {
    if (month === 0) { setMonth(11); setYear(y => y - 1); }
    else setMonth(m => m - 1);
  }
  function nextMonth() {
    if (month === 11) { setMonth(0); setYear(y => y + 1); }
    else setMonth(m => m + 1);
  }

  function handleDayClick(day: number) {
    const key = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    const dayPosts = postsByDate[key] ?? [];
    setSelectedDate(key);
    setSelected(dayPosts);
  }

  const todayKey = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;

  // Stats
  const publishedCount = posts.filter((p) => p.published).length;
  const scheduledCount = posts.filter((p) => !p.published && p.publish_at).length;
  const draftCount = posts.filter((p) => !p.published && !p.publish_at).length;

  return (
    <div className="max-w-5xl mx-auto px-4 md:px-8 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-semibold text-neutral-900">Content Calendar</h1>
          <p className="text-sm text-neutral-500 mt-0.5">All blog posts by publish date</p>
        </div>
        <Link
          href="/admin/blog/new"
          className="flex items-center gap-1.5 px-3 py-2 bg-teal-600 text-white text-sm rounded-lg hover:bg-teal-700 transition-colors no-underline"
        >
          <Plus className="w-4 h-4" />
          New Post
        </Link>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        {[
          { label: "Published", count: publishedCount, color: "text-teal-600", dot: "bg-teal-500" },
          { label: "Scheduled", count: scheduledCount, color: "text-amber-600", dot: "bg-amber-400" },
          { label: "Drafts", count: draftCount, color: "text-neutral-500", dot: "bg-neutral-300" },
        ].map(({ label, count, color, dot }) => (
          <div key={label} className="bg-white border border-neutral-200 rounded-xl p-4 flex items-center gap-3">
            <div className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${dot}`} />
            <div>
              <div className={`text-xl font-semibold ${color}`}>{count}</div>
              <div className="text-xs text-neutral-400">{label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Calendar card */}
      <div className="bg-white border border-neutral-200 rounded-xl overflow-hidden shadow-sm">
        {/* Month nav */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-neutral-100">
          <button
            onClick={prevMonth}
            className="p-1.5 rounded-lg hover:bg-neutral-100 transition-colors"
          >
            <ChevronLeft className="w-4 h-4 text-neutral-600" />
          </button>
          <h2 className="text-sm font-semibold text-neutral-800">
            {MONTHS[month]} {year}
          </h2>
          <button
            onClick={nextMonth}
            className="p-1.5 rounded-lg hover:bg-neutral-100 transition-colors"
          >
            <ChevronRight className="w-4 h-4 text-neutral-600" />
          </button>
        </div>

        {/* Day headers */}
        <div className="grid grid-cols-7 border-b border-neutral-100">
          {DAYS.map((d) => (
            <div key={d} className="text-center text-[11px] font-medium text-neutral-400 py-2">
              {d}
            </div>
          ))}
        </div>

        {/* Grid */}
        {loading ? (
          <div className="h-64 flex items-center justify-center text-sm text-neutral-400">
            Loading…
          </div>
        ) : (
          <div className="grid grid-cols-7">
            {cells.map((day, i) => {
              if (day === null) {
                return <div key={`empty-${i}`} className="border-r border-b border-neutral-50 min-h-[80px]" />;
              }
              const key = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
              const dayPosts = postsByDate[key] ?? [];
              const isToday = key === todayKey;
              const isSelected = key === selectedDate;

              return (
                <button
                  key={key}
                  onClick={() => handleDayClick(day)}
                  className={`relative border-r border-b border-neutral-100 min-h-[80px] p-1.5 text-left transition-colors hover:bg-teal-50/50 focus:outline-none focus:bg-teal-50
                    ${isSelected ? "bg-teal-50" : ""}
                    ${i % 7 === 6 ? "border-r-0" : ""}
                  `}
                >
                  <span
                    className={`inline-flex items-center justify-center w-6 h-6 text-xs rounded-full mb-1
                      ${isToday ? "bg-teal-600 text-white font-semibold" : "text-neutral-500"}
                    `}
                  >
                    {day}
                  </span>
                  <div className="flex flex-col gap-0.5">
                    {dayPosts.slice(0, 3).map((p) => {
                      const status = getStatus(p);
                      return (
                        <div
                          key={p.id}
                          className="flex items-center gap-1 min-w-0"
                        >
                          <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${STATUS_COLORS[status]}`} />
                          <span className="text-[10px] text-neutral-600 truncate leading-tight">{p.title}</span>
                        </div>
                      );
                    })}
                    {dayPosts.length > 3 && (
                      <span className="text-[10px] text-neutral-400 pl-2.5">+{dayPosts.length - 3} more</span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Day detail panel */}
      {selectedDate && (
        <div className="mt-4 bg-white border border-neutral-200 rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-neutral-800">
              {new Date(selectedDate + "T12:00:00").toLocaleDateString("en-US", {
                weekday: "long",
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            </h3>
            <Link
              href={`/admin/blog/new`}
              className="flex items-center gap-1 text-xs text-teal-600 hover:text-teal-700 no-underline"
            >
              <Plus className="w-3.5 h-3.5" />
              Schedule post
            </Link>
          </div>
          {!selected || selected.length === 0 ? (
            <p className="text-sm text-neutral-400">No posts on this day.</p>
          ) : (
            <div className="space-y-2">
              {selected.map((p) => {
                const status = getStatus(p);
                return (
                  <div
                    key={p.id}
                    className="flex items-start gap-3 p-3 bg-neutral-50 rounded-lg border border-neutral-100"
                  >
                    <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${STATUS_COLORS[status]}`} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="text-sm font-medium text-neutral-800 truncate">{p.title}</span>
                        <span className={`text-[10px] px-1.5 py-0.5 rounded-full flex-shrink-0 ${STATUS_BADGE[status]}`}>
                          {STATUS_LABEL[status]}
                        </span>
                        {p.tag && (
                          <span className="text-[10px] px-1.5 py-0.5 bg-neutral-100 text-neutral-500 rounded-full flex-shrink-0">
                            {p.tag}
                          </span>
                        )}
                      </div>
                      {p.description && (
                        <p className="text-xs text-neutral-500 line-clamp-2">{p.description}</p>
                      )}
                      {p.publish_at && !p.published && (
                        <p className="text-[11px] text-amber-600 mt-1">
                          Scheduled for {new Date(p.publish_at).toLocaleString("en-US", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" })}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center gap-1.5 flex-shrink-0">
                      <Link
                        href={`/admin/blog/${p.slug}`}
                        className="px-2 py-1 text-xs text-neutral-600 bg-white border border-neutral-200 rounded-lg hover:bg-neutral-50 transition-colors no-underline"
                      >
                        Edit
                      </Link>
                      {p.published && (
                        <Link
                          href={`/blog/${p.slug}`}
                          target="_blank"
                          className="p-1 text-neutral-400 hover:text-teal-600 transition-colors no-underline"
                          title="View live"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </Link>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Legend */}
      <div className="flex items-center gap-4 mt-4 px-1">
        {(["published", "scheduled", "draft"] as const).map((s) => (
          <div key={s} className="flex items-center gap-1.5">
            <div className={`w-2 h-2 rounded-full ${STATUS_COLORS[s]}`} />
            <span className="text-xs text-neutral-400">{STATUS_LABEL[s]}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
