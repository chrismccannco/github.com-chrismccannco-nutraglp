"use client";

import { useEffect, useState } from "react";
import Breadcrumbs from "../../components/Breadcrumbs";

interface Summary {
  total_calls: number;
  total_input_tokens: number;
  total_output_tokens: number;
  total_tokens: number;
  avg_duration_ms: number;
}

interface ActionRow {
  action: string;
  count: number;
  input_tokens: number;
  output_tokens: number;
  avg_duration: number;
}

interface DailyRow {
  date: string;
  calls: number;
  input_tokens: number;
  output_tokens: number;
}

interface TemplateRow {
  template_name: string;
  count: number;
  total_tokens: number;
}

interface RecentRow {
  id: number;
  action: string;
  template_name: string | null;
  model: string;
  input_tokens: number;
  output_tokens: number;
  duration_ms: number | null;
  created_at: string;
}

interface AnalyticsData {
  summary: Summary;
  by_action: ActionRow[];
  daily: DailyRow[];
  top_templates: TemplateRow[];
  recent: RecentRow[];
}

const ACTION_LABELS: Record<string, string> = {
  template_execute: "AI Template",
  content_repurpose: "Repurpose",
  content_score: "Content Score",
};

function formatTokens(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return String(n);
}

function StatCard({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div className="bg-white rounded-xl border border-neutral-200 p-5">
      <p className="text-[11px] font-medium text-neutral-400 uppercase tracking-wide">{label}</p>
      <p className="text-2xl font-semibold text-neutral-900 mt-1">{value}</p>
      {sub && <p className="text-xs text-neutral-400 mt-1">{sub}</p>}
    </div>
  );
}

function MiniBar({ value, max }: { value: number; max: number }) {
  const pct = max > 0 ? Math.round((value / max) * 100) : 0;
  return (
    <div className="w-24 h-2 bg-neutral-100 rounded-full overflow-hidden">
      <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${pct}%` }} />
    </div>
  );
}

export default function AIAnalytics() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [days, setDays] = useState(30);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/analytics/ai?days=${days}`)
      .then((r) => r.json())
      .then((d) => { setData(d); setLoading(false); })
      .catch(() => setLoading(false));
  }, [days]);

  if (loading) return <p className="text-sm text-neutral-400 p-4">Loading analytics&hellip;</p>;
  if (!data) return <p className="text-sm text-red-500 p-4">Failed to load analytics.</p>;

  const maxDaily = Math.max(...data.daily.map((d) => d.calls), 1);
  const maxAction = Math.max(...data.by_action.map((a) => a.count), 1);

  // Estimate cost (Sonnet 4.6: $3/M input, $15/M output)
  const estimatedCost =
    (data.summary.total_input_tokens / 1_000_000) * 3 +
    (data.summary.total_output_tokens / 1_000_000) * 15;

  return (
    <div>
      <Breadcrumbs
        items={[
          { label: "Admin", href: "/admin" },
          { label: "Analytics", href: "/admin/analytics" },
          { label: "AI Usage" },
        ]}
      />

      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-semibold text-neutral-900">AI Usage Analytics</h1>
          <p className="text-xs text-neutral-400 mt-1">
            Token consumption, call frequency, and cost estimates
          </p>
        </div>
        <select
          value={days}
          onChange={(e) => setDays(Number(e.target.value))}
          className="text-sm border border-neutral-300 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <option value={7}>Last 7 days</option>
          <option value={14}>Last 14 days</option>
          <option value={30}>Last 30 days</option>
          <option value={90}>Last 90 days</option>
        </select>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard label="Total AI Calls" value={String(data.summary.total_calls)} />
        <StatCard
          label="Total Tokens"
          value={formatTokens(data.summary.total_tokens)}
          sub={`${formatTokens(data.summary.total_input_tokens)} in / ${formatTokens(data.summary.total_output_tokens)} out`}
        />
        <StatCard
          label="Est. Cost"
          value={`$${estimatedCost.toFixed(2)}`}
          sub="Based on Sonnet 4.6 pricing"
        />
        <StatCard
          label="Avg Latency"
          value={data.summary.avg_duration_ms > 0 ? `${(data.summary.avg_duration_ms / 1000).toFixed(1)}s` : "—"}
        />
      </div>

      {/* Daily Usage Chart (simple bar chart) */}
      {data.daily.length > 0 && (
        <div className="bg-white rounded-xl border border-neutral-200 p-5 mb-8">
          <h2 className="text-sm font-semibold text-neutral-700 mb-4">Daily Calls</h2>
          <div className="flex items-end gap-1 h-32">
            {data.daily.map((d) => {
              const pct = (d.calls / maxDaily) * 100;
              return (
                <div
                  key={d.date}
                  className="flex-1 group relative"
                  title={`${d.date}: ${d.calls} calls`}
                >
                  <div
                    className="bg-indigo-500 rounded-t w-full min-h-[2px] transition-all hover:bg-indigo-600"
                    style={{ height: `${pct}%` }}
                  />
                  <div className="absolute -top-8 left-1/2 -translate-x-1/2 hidden group-hover:block bg-neutral-800 text-white text-[10px] px-2 py-1 rounded whitespace-nowrap z-10">
                    {d.date}: {d.calls} calls
                  </div>
                </div>
              );
            })}
          </div>
          <div className="flex justify-between mt-2">
            <span className="text-[10px] text-neutral-400">{data.daily[0]?.date}</span>
            <span className="text-[10px] text-neutral-400">{data.daily[data.daily.length - 1]?.date}</span>
          </div>
        </div>
      )}

      <div className="grid lg:grid-cols-2 gap-6 mb-8">
        {/* By Action */}
        <div className="bg-white rounded-xl border border-neutral-200 p-5">
          <h2 className="text-sm font-semibold text-neutral-700 mb-4">By Action</h2>
          <div className="space-y-3">
            {data.by_action.map((a) => (
              <div key={a.action} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <MiniBar value={a.count} max={maxAction} />
                  <span className="text-sm text-neutral-700">{ACTION_LABELS[a.action] || a.action}</span>
                </div>
                <div className="flex items-center gap-4 text-xs text-neutral-500">
                  <span>{a.count} calls</span>
                  <span>{formatTokens(a.input_tokens + a.output_tokens)} tokens</span>
                </div>
              </div>
            ))}
            {data.by_action.length === 0 && (
              <p className="text-xs text-neutral-400">No usage recorded yet.</p>
            )}
          </div>
        </div>

        {/* Top Templates */}
        <div className="bg-white rounded-xl border border-neutral-200 p-5">
          <h2 className="text-sm font-semibold text-neutral-700 mb-4">Top Templates</h2>
          <div className="space-y-3">
            {data.top_templates.map((t, i) => (
              <div key={t.template_name} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="w-5 h-5 flex items-center justify-center rounded-full bg-neutral-100 text-[10px] font-semibold text-neutral-500">
                    {i + 1}
                  </span>
                  <span className="text-sm text-neutral-700">{t.template_name}</span>
                </div>
                <div className="flex items-center gap-4 text-xs text-neutral-500">
                  <span>{t.count}x</span>
                  <span>{formatTokens(t.total_tokens)} tokens</span>
                </div>
              </div>
            ))}
            {data.top_templates.length === 0 && (
              <p className="text-xs text-neutral-400">No template usage yet.</p>
            )}
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-xl border border-neutral-200 p-5">
        <h2 className="text-sm font-semibold text-neutral-700 mb-4">Recent Activity</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-neutral-100">
                <th className="text-left text-[11px] font-medium text-neutral-400 uppercase tracking-wide py-2 pr-4">Action</th>
                <th className="text-left text-[11px] font-medium text-neutral-400 uppercase tracking-wide py-2 pr-4">Template</th>
                <th className="text-right text-[11px] font-medium text-neutral-400 uppercase tracking-wide py-2 pr-4">In</th>
                <th className="text-right text-[11px] font-medium text-neutral-400 uppercase tracking-wide py-2 pr-4">Out</th>
                <th className="text-right text-[11px] font-medium text-neutral-400 uppercase tracking-wide py-2 pr-4">Duration</th>
                <th className="text-right text-[11px] font-medium text-neutral-400 uppercase tracking-wide py-2">Time</th>
              </tr>
            </thead>
            <tbody>
              {data.recent.slice(0, 20).map((r) => (
                <tr key={r.id} className="border-b border-neutral-50 hover:bg-neutral-25">
                  <td className="py-2 pr-4">
                    <span className="inline-flex items-center px-2 py-0.5 text-[11px] font-medium rounded-full bg-neutral-100 text-neutral-600">
                      {ACTION_LABELS[r.action] || r.action}
                    </span>
                  </td>
                  <td className="py-2 pr-4 text-neutral-600">{r.template_name || "—"}</td>
                  <td className="py-2 pr-4 text-right text-neutral-500 tabular-nums">{formatTokens(r.input_tokens)}</td>
                  <td className="py-2 pr-4 text-right text-neutral-500 tabular-nums">{formatTokens(r.output_tokens)}</td>
                  <td className="py-2 pr-4 text-right text-neutral-500 tabular-nums">
                    {r.duration_ms ? `${(r.duration_ms / 1000).toFixed(1)}s` : "—"}
                  </td>
                  <td className="py-2 text-right text-neutral-400 text-xs">
                    {new Date(r.created_at).toLocaleString("en-US", {
                      month: "short", day: "numeric", hour: "numeric", minute: "2-digit",
                    })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {data.recent.length === 0 && (
            <p className="text-xs text-neutral-400 py-4 text-center">No AI usage recorded yet. Use templates, repurpose content, or trigger scoring to see data here.</p>
          )}
        </div>
      </div>
    </div>
  );
}
