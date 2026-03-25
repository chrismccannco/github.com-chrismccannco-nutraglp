"use client";

import { useEffect, useState } from "react";
import Breadcrumbs from "../components/Breadcrumbs";
import { ExternalLink } from "lucide-react";

interface AnalyticsData {
  days: number;
  total: number;
  unique_pages: number;
  avg_per_day: number;
  per_day: { day: string; views: number }[];
  top_pages: { path: string; views: number }[];
  top_referrers: { referrer: string; views: number }[];
}

export default function AnalyticsPage() {
  const [days, setDays] = useState(7);
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [gaId, setGaId] = useState("");
  const [plausibleDomain, setPlausibleDomain] = useState("");

  useEffect(() => {
    setLoading(true);
    fetch(`/api/analytics?days=${days}`)
      .then((r) => r.json())
      .then((d) => {
        setData(d);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [days]);

  useEffect(() => {
    fetch("/api/settings")
      .then((r) => r.json())
      .then((s) => {
        setGaId(s.ga_measurement_id || "");
        setPlausibleDomain(s.plausible_domain || "");
      })
      .catch(() => {});
  }, []);

  const maxViews = data ? Math.max(...data.per_day.map((d) => Number(d.views)), 1) : 1;

  return (
    <div className="max-w-4xl">
      <Breadcrumbs
        items={[{ label: "Admin", href: "/admin" }, { label: "Analytics" }]}
      />

      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-semibold text-neutral-900">Analytics</h1>
          <p className="text-xs text-neutral-400 mt-1">Page view tracking</p>
        </div>
        <div className="flex gap-1">
          {[7, 30, 90].map((d) => (
            <button
              key={d}
              onClick={() => setDays(d)}
              className={`px-3 py-1.5 text-xs rounded-lg transition ${
                days === d
                  ? "bg-teal-600 text-white"
                  : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
              }`}
            >
              {d}d
            </button>
          ))}
        </div>
      </div>

      {(gaId || plausibleDomain) && (
        <div className="flex gap-3 mb-6">
          {gaId && (
            <a
              href={`https://analytics.google.com/analytics/web/#/?measurementId=${gaId}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs border border-neutral-200 rounded-lg text-neutral-600 hover:bg-neutral-50 transition"
            >
              <ExternalLink className="w-3 h-3" />
              Google Analytics
            </a>
          )}
          {plausibleDomain && (
            <a
              href={`https://plausible.io/${plausibleDomain}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs border border-neutral-200 rounded-lg text-neutral-600 hover:bg-neutral-50 transition"
            >
              <ExternalLink className="w-3 h-3" />
              Plausible
            </a>
          )}
        </div>
      )}

      {loading ? (
        <p className="text-sm text-neutral-400">Loading&hellip;</p>
      ) : !data ? (
        <p className="text-sm text-red-600">Failed to load analytics</p>
      ) : (
        <>
          {/* Stats row */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            {[
              { label: "Total views", value: data.total },
              { label: "Unique pages", value: data.unique_pages },
              { label: "Avg / day", value: data.avg_per_day },
            ].map((s) => (
              <div
                key={s.label}
                className="bg-white border border-neutral-200 rounded-xl p-4 shadow-sm"
              >
                <p className="text-xs text-neutral-400">{s.label}</p>
                <p className="text-2xl font-semibold text-neutral-900 mt-1">
                  {s.value.toLocaleString()}
                </p>
              </div>
            ))}
          </div>

          {/* Chart */}
          <div className="bg-white border border-neutral-200 rounded-xl p-4 shadow-sm mb-6">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-neutral-500 mb-4">
              Views per day
            </h2>
            {data.per_day.length === 0 ? (
              <p className="text-sm text-neutral-400 py-8 text-center">
                No data yet
              </p>
            ) : (
              <div className="flex items-end gap-1 h-40">
                {data.per_day.map((d) => {
                  const h = (Number(d.views) / maxViews) * 100;
                  return (
                    <div
                      key={d.day}
                      className="flex-1 flex flex-col items-center group relative"
                    >
                      <div
                        className="w-full bg-teal-500 rounded-t opacity-80 hover:opacity-100 transition min-h-[2px]"
                        style={{ height: `${Math.max(h, 1)}%` }}
                      />
                      <span className="text-[9px] text-neutral-400 mt-1 truncate w-full text-center">
                        {d.day.slice(5)}
                      </span>
                      <div className="absolute -top-6 bg-neutral-900 text-white text-[10px] px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition pointer-events-none">
                        {Number(d.views).toLocaleString()}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Tables */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white border border-neutral-200 rounded-xl p-4 shadow-sm">
              <h2 className="text-xs font-semibold uppercase tracking-wider text-neutral-500 mb-3">
                Top pages
              </h2>
              {data.top_pages.length === 0 ? (
                <p className="text-sm text-neutral-400">No data</p>
              ) : (
                <table className="w-full text-sm">
                  <tbody>
                    {data.top_pages.map((p) => (
                      <tr key={p.path} className="border-b border-neutral-100 last:border-0">
                        <td className="py-1.5 text-neutral-700 truncate max-w-[200px]">
                          {p.path}
                        </td>
                        <td className="py-1.5 text-right text-neutral-500 tabular-nums">
                          {Number(p.views).toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>

            <div className="bg-white border border-neutral-200 rounded-xl p-4 shadow-sm">
              <h2 className="text-xs font-semibold uppercase tracking-wider text-neutral-500 mb-3">
                Top referrers
              </h2>
              {data.top_referrers.length === 0 ? (
                <p className="text-sm text-neutral-400">No data</p>
              ) : (
                <table className="w-full text-sm">
                  <tbody>
                    {data.top_referrers.map((r) => (
                      <tr key={r.referrer} className="border-b border-neutral-100 last:border-0">
                        <td className="py-1.5 text-neutral-700 truncate max-w-[200px]">
                          {r.referrer}
                        </td>
                        <td className="py-1.5 text-right text-neutral-500 tabular-nums">
                          {Number(r.views).toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
