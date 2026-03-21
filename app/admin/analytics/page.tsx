"use client";

import { useEffect, useState } from "react";
import Breadcrumbs from "../components/Breadcrumbs";
import { ExternalLink, TrendingUp, Users, MousePointerClick, Clock } from "lucide-react";

interface AnalyticsData {
  days: number;
  total: number;
  unique_pages: number;
  avg_per_day: number;
  per_day: { day: string; views: number }[];
  top_pages: { path: string; views: number }[];
  top_referrers: { referrer: string; views: number }[];
}

interface GA4Data {
  configured: boolean;
  error?: string;
  days?: number;
  overview?: {
    sessions: number;
    users: number;
    pageViews: number;
    bounceRate: number;
    avgSessionDuration: number;
  };
  topPages?: { path: string; title: string; views: number; users: number }[];
  channels?: { channel: string; sessions: number; users: number }[];
}

function fmtDuration(secs: number) {
  const m = Math.floor(secs / 60);
  const s = Math.floor(secs % 60);
  return m > 0 ? `${m}m ${s}s` : `${s}s`;
}

export default function AnalyticsPage() {
  const [days, setDays] = useState(28);
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [gaId, setGaId] = useState("");
  const [plausibleDomain, setPlausibleDomain] = useState("");
  const [ga4, setGa4] = useState<GA4Data | null>(null);
  const [ga4Loading, setGa4Loading] = useState(false);

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

  useEffect(() => {
    setGa4Loading(true);
    fetch(`/api/analytics/ga4?days=${days}`)
      .then((r) => r.json())
      .then((d: GA4Data) => setGa4(d))
      .catch(() => setGa4({ configured: false }))
      .finally(() => setGa4Loading(false));
  }, [days]);

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

      {/* GA4 Section */}
      <div className="mt-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-semibold text-neutral-800">Google Analytics (GA4)</h2>
          {ga4?.configured && !ga4.error && gaId && (
            <a
              href={`https://analytics.google.com`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-xs text-neutral-400 hover:text-neutral-600 no-underline"
            >
              Open GA4 <ExternalLink className="w-3 h-3" />
            </a>
          )}
        </div>

        {ga4Loading && (
          <div className="bg-white border border-neutral-200 rounded-xl p-8 text-center text-sm text-neutral-400 shadow-sm">
            Loading GA4 data…
          </div>
        )}

        {!ga4Loading && ga4 && !ga4.configured && (
          <div className="bg-white border border-neutral-200 rounded-xl p-6 shadow-sm">
            <p className="text-sm text-neutral-500 mb-3">GA4 is not connected. To enable in-app GA4 analytics:</p>
            <ol className="text-sm text-neutral-600 space-y-1.5 list-decimal list-inside">
              <li>Create a service account in <a href="https://console.cloud.google.com/iam-admin/serviceaccounts" target="_blank" className="text-teal-600 hover:underline">Google Cloud Console</a></li>
              <li>Grant it <strong>Viewer</strong> access to your GA4 property</li>
              <li>Download the JSON key and add to environment:<br />
                <code className="text-xs bg-neutral-100 px-2 py-0.5 rounded ml-4">GA4_PROPERTY_ID=123456789</code><br />
                <code className="text-xs bg-neutral-100 px-2 py-0.5 rounded ml-4">GA4_SERVICE_ACCOUNT_EMAIL=...</code><br />
                <code className="text-xs bg-neutral-100 px-2 py-0.5 rounded ml-4">GA4_SERVICE_ACCOUNT_KEY=...</code>
              </li>
            </ol>
          </div>
        )}

        {!ga4Loading && ga4?.configured && ga4.error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 shadow-sm">
            <p className="text-sm font-medium text-red-700 mb-1">GA4 error</p>
            <p className="text-xs text-red-600 font-mono">{ga4.error}</p>
          </div>
        )}

        {!ga4Loading && ga4?.configured && !ga4.error && ga4.overview && (
          <>
            {/* Overview metrics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
              {[
                { label: "Sessions", value: ga4.overview.sessions.toLocaleString(), icon: TrendingUp, color: "text-teal-600" },
                { label: "Users", value: ga4.overview.users.toLocaleString(), icon: Users, color: "text-blue-600" },
                { label: "Page Views", value: ga4.overview.pageViews.toLocaleString(), icon: MousePointerClick, color: "text-violet-600" },
                { label: "Avg Duration", value: fmtDuration(ga4.overview.avgSessionDuration), icon: Clock, color: "text-amber-600" },
              ].map(({ label, value, icon: Icon, color }) => (
                <div key={label} className="bg-white border border-neutral-200 rounded-xl p-4 shadow-sm">
                  <div className={`mb-1 ${color}`}><Icon className="w-4 h-4" /></div>
                  <div className="text-lg font-semibold text-neutral-800">{value}</div>
                  <div className="text-xs text-neutral-400">{label}</div>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Top pages */}
              {ga4.topPages && ga4.topPages.length > 0 && (
                <div className="bg-white border border-neutral-200 rounded-xl p-4 shadow-sm">
                  <h3 className="text-xs font-semibold text-neutral-500 uppercase tracking-wide mb-3">Top Pages</h3>
                  <table className="w-full text-sm">
                    <tbody>
                      {ga4.topPages.map((p) => (
                        <tr key={p.path} className="border-b border-neutral-100 last:border-0">
                          <td className="py-1.5 text-neutral-700 truncate max-w-[180px]">
                            <span className="text-[11px] text-neutral-400 block truncate">{p.path}</span>
                            <span className="text-xs truncate block">{p.title || p.path}</span>
                          </td>
                          <td className="py-1.5 text-right tabular-nums">
                            <span className="text-sm text-neutral-700">{p.views.toLocaleString()}</span>
                            <span className="text-[10px] text-neutral-400 block">{p.users.toLocaleString()} users</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Channels */}
              {ga4.channels && ga4.channels.length > 0 && (
                <div className="bg-white border border-neutral-200 rounded-xl p-4 shadow-sm">
                  <h3 className="text-xs font-semibold text-neutral-500 uppercase tracking-wide mb-3">Traffic Channels</h3>
                  <div className="space-y-2">
                    {ga4.channels.map((ch) => {
                      const totalSessions = ga4.channels!.reduce((s, c) => s + c.sessions, 0);
                      const pct = totalSessions > 0 ? Math.round((ch.sessions / totalSessions) * 100) : 0;
                      return (
                        <div key={ch.channel}>
                          <div className="flex justify-between text-xs mb-0.5">
                            <span className="text-neutral-700">{ch.channel}</span>
                            <span className="text-neutral-500 tabular-nums">{ch.sessions.toLocaleString()} ({pct}%)</span>
                          </div>
                          <div className="w-full bg-neutral-100 rounded-full h-1.5">
                            <div className="bg-teal-500 h-1.5 rounded-full" style={{ width: `${pct}%` }} />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
