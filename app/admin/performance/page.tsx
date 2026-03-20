"use client";

import { useEffect, useState } from "react";
import {
  Activity,
  Gauge,
  Monitor,
  Smartphone,
  Tablet,
  TrendingUp,
  TrendingDown,
  Minus,
  RefreshCw,
} from "lucide-react";

interface Summary {
  total_samples: number;
  avg_lcp: number | null;
  avg_fid: number | null;
  avg_cls: number | null;
  avg_fcp: number | null;
  avg_ttfb: number | null;
  avg_inp: number | null;
  avg_dom_load: number | null;
  avg_page_load: number | null;
}

interface TrendDay {
  day: string;
  samples: number;
  lcp: number | null;
  cls: number | null;
  fcp: number | null;
  ttfb: number | null;
  inp: number | null;
  page_load: number | null;
}

interface PageRow {
  path: string;
  samples: number;
  avg_lcp: number | null;
  avg_cls: number | null;
  avg_fcp: number | null;
  avg_ttfb: number | null;
  avg_page_load: number | null;
}

interface DeviceRow {
  device_type: string;
  samples: number;
  avg_lcp: number | null;
  avg_cls: number | null;
  avg_page_load: number | null;
}

interface CWVDist {
  lcp_good: number;
  lcp_needs: number;
  lcp_poor: number;
  cls_good: number;
  cls_needs: number;
  cls_poor: number;
  inp_good: number;
  inp_needs: number;
  inp_poor: number;
  total: number;
}

interface MetricsData {
  days: number;
  summary: Summary;
  trend: TrendDay[];
  pages: PageRow[];
  devices: DeviceRow[];
  cwvDistribution: CWVDist;
}

type CWVRating = "good" | "needs-improvement" | "poor";

function rateMetric(value: number | null, good: number, poor: number): CWVRating {
  if (value == null) return "good";
  if (value <= good) return "good";
  if (value <= poor) return "needs-improvement";
  return "poor";
}

const ratingColors: Record<CWVRating, string> = {
  good: "text-indigo-700 bg-indigo-50",
  "needs-improvement": "text-amber-700 bg-amber-50",
  poor: "text-red-700 bg-red-50",
};

const ratingDots: Record<CWVRating, string> = {
  good: "bg-indigo-500",
  "needs-improvement": "bg-amber-500",
  poor: "bg-red-500",
};

function DeviceIcon({ type }: { type: string }) {
  if (type === "mobile") return <Smartphone className="w-4 h-4" />;
  if (type === "tablet") return <Tablet className="w-4 h-4" />;
  return <Monitor className="w-4 h-4" />;
}

function DistBar({ good, needs, poor }: { good: number; needs: number; poor: number }) {
  const total = good + needs + poor;
  if (!total) return <div className="h-2 bg-neutral-100 rounded-full" />;
  const gPct = (good / total) * 100;
  const nPct = (needs / total) * 100;
  const pPct = (poor / total) * 100;
  return (
    <div className="flex h-2 rounded-full overflow-hidden">
      {gPct > 0 && <div className="bg-indigo-500" style={{ width: `${gPct}%` }} />}
      {nPct > 0 && <div className="bg-amber-400" style={{ width: `${nPct}%` }} />}
      {pPct > 0 && <div className="bg-red-500" style={{ width: `${pPct}%` }} />}
    </div>
  );
}

function SparkLine({ data, maxVal }: { data: (number | null)[]; maxVal: number }) {
  const width = 120;
  const height = 28;
  const values = data.map((v) => v ?? 0);
  if (values.length < 2) return <div className="w-[120px] h-[28px]" />;
  const max = maxVal || Math.max(...values, 1);
  const points = values
    .map((v, i) => {
      const x = (i / (values.length - 1)) * width;
      const y = height - (v / max) * height;
      return `${x},${y}`;
    })
    .join(" ");

  const last = values[values.length - 1];
  const prev = values[values.length - 2];
  const trending = last < prev ? "down" : last > prev ? "up" : "flat";

  return (
    <div className="flex items-center gap-1.5">
      <svg width={width} height={height} className="text-indigo-500">
        <polyline
          points={points}
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      {trending === "down" && <TrendingDown className="w-3 h-3 text-indigo-600" />}
      {trending === "up" && <TrendingUp className="w-3 h-3 text-red-500" />}
      {trending === "flat" && <Minus className="w-3 h-3 text-neutral-400" />}
    </div>
  );
}

export default function PerformanceDashboard() {
  const [data, setData] = useState<MetricsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [days, setDays] = useState(7);
  const [pathFilter, setPathFilter] = useState("");

  const load = () => {
    setLoading(true);
    const params = new URLSearchParams({ days: String(days) });
    if (pathFilter) params.set("path", pathFilter);
    fetch(`/api/performance/metrics?${params}`)
      .then((r) => r.json())
      .then(setData)
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, [days, pathFilter]);

  const s = data?.summary;
  const hasData = s && s.total_samples > 0;

  return (
    <div className="max-w-6xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-semibold text-neutral-900 flex items-center gap-2">
            <Activity className="w-5 h-5 text-indigo-600" />
            Performance
          </h1>
          <p className="text-sm text-neutral-500 mt-1">
            Core Web Vitals and real user metrics
          </p>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={days}
            onChange={(e) => setDays(Number(e.target.value))}
            className="text-xs border border-neutral-300 rounded-lg px-2.5 py-1.5 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value={1}>Last 24 hours</option>
            <option value={7}>Last 7 days</option>
            <option value={30}>Last 30 days</option>
            <option value={90}>Last 90 days</option>
          </select>
          <button
            onClick={load}
            className="p-1.5 text-neutral-400 hover:text-neutral-600 transition"
            title="Refresh"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          </button>
        </div>
      </div>

      {loading && !data ? (
        <p className="text-sm text-neutral-400 py-16 text-center">Loading metrics...</p>
      ) : !hasData ? (
        <div className="text-center py-16 bg-white border border-neutral-200 rounded-xl">
          <Gauge className="w-8 h-8 text-neutral-300 mx-auto mb-3" />
          <p className="text-sm text-neutral-500 mb-2">No performance data collected yet.</p>
          <p className="text-xs text-neutral-400 max-w-md mx-auto">
            Add the performance reporter to your public layout to start collecting Core Web Vitals
            from real users. Import <code className="bg-neutral-100 px-1 rounded">reportWebVitals</code> from
            <code className="bg-neutral-100 px-1 rounded">@/lib/performance-reporter</code> and call it in a
            useEffect.
          </p>
        </div>
      ) : (
        <>
          {/* CWV Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            <CWVCard
              label="Largest Contentful Paint"
              abbr="LCP"
              value={s!.avg_lcp}
              unit="ms"
              good={2500}
              poor={4000}
              description="Time until main content is visible"
              trend={data!.trend.map((t) => t.lcp)}
              maxVal={5000}
            />
            <CWVCard
              label="Cumulative Layout Shift"
              abbr="CLS"
              value={s!.avg_cls}
              unit=""
              good={0.1}
              poor={0.25}
              description="Visual stability score"
              trend={data!.trend.map((t) => t.cls)}
              maxVal={0.5}
            />
            <CWVCard
              label="Interaction to Next Paint"
              abbr="INP"
              value={s!.avg_inp}
              unit="ms"
              good={200}
              poor={500}
              description="Responsiveness to user input"
              trend={data!.trend.map((t) => t.inp)}
              maxVal={600}
            />
          </div>

          {/* Secondary metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
            <MiniCard label="FCP" value={s!.avg_fcp} unit="ms" />
            <MiniCard label="TTFB" value={s!.avg_ttfb} unit="ms" />
            <MiniCard label="DOM Load" value={s!.avg_dom_load} unit="ms" />
            <MiniCard label="Page Load" value={s!.avg_page_load} unit="ms" />
          </div>

          {/* CWV Distribution */}
          <div className="bg-white border border-neutral-200 rounded-xl p-5 mb-6">
            <h2 className="text-sm font-semibold text-neutral-900 mb-4">CWV Distribution</h2>
            <div className="space-y-4">
              <DistRow
                label="LCP"
                good={data!.cwvDistribution.lcp_good || 0}
                needs={data!.cwvDistribution.lcp_needs || 0}
                poor={data!.cwvDistribution.lcp_poor || 0}
              />
              <DistRow
                label="CLS"
                good={data!.cwvDistribution.cls_good || 0}
                needs={data!.cwvDistribution.cls_needs || 0}
                poor={data!.cwvDistribution.cls_poor || 0}
              />
              <DistRow
                label="INP"
                good={data!.cwvDistribution.inp_good || 0}
                needs={data!.cwvDistribution.inp_needs || 0}
                poor={data!.cwvDistribution.inp_poor || 0}
              />
            </div>
            <div className="flex items-center gap-4 mt-4 pt-3 border-t border-neutral-100">
              <span className="flex items-center gap-1.5 text-[10px] text-neutral-500">
                <span className="w-2 h-2 rounded-full bg-indigo-500" /> Good
              </span>
              <span className="flex items-center gap-1.5 text-[10px] text-neutral-500">
                <span className="w-2 h-2 rounded-full bg-amber-400" /> Needs improvement
              </span>
              <span className="flex items-center gap-1.5 text-[10px] text-neutral-500">
                <span className="w-2 h-2 rounded-full bg-red-500" /> Poor
              </span>
            </div>
          </div>

          {/* Per-page and device tables */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* Pages */}
            <div className="bg-white border border-neutral-200 rounded-xl overflow-hidden">
              <div className="px-5 py-4 border-b border-neutral-100">
                <h2 className="text-sm font-semibold text-neutral-900">By Page</h2>
              </div>
              <div className="divide-y divide-neutral-100">
                {data!.pages.length === 0 ? (
                  <p className="px-5 py-6 text-xs text-neutral-400 text-center">No page data</p>
                ) : (
                  data!.pages.map((p) => (
                    <button
                      key={p.path}
                      onClick={() => setPathFilter(pathFilter === p.path ? "" : p.path)}
                      className={`w-full text-left px-5 py-3 flex items-center gap-3 hover:bg-neutral-50 transition ${
                        pathFilter === p.path ? "bg-indigo-50" : ""
                      }`}
                    >
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-neutral-900 truncate">{p.path}</p>
                        <p className="text-[10px] text-neutral-400">{p.samples} samples</p>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-neutral-600">
                        <span>
                          <span className="text-neutral-400">LCP </span>
                          <span className={ratingColors[rateMetric(p.avg_lcp, 2500, 4000)] + " px-1.5 py-0.5 rounded-full text-[10px] font-medium"}>
                            {p.avg_lcp != null ? `${p.avg_lcp}ms` : "—"}
                          </span>
                        </span>
                        <span>
                          <span className="text-neutral-400">CLS </span>
                          <span className={ratingColors[rateMetric(p.avg_cls, 0.1, 0.25)] + " px-1.5 py-0.5 rounded-full text-[10px] font-medium"}>
                            {p.avg_cls != null ? p.avg_cls : "—"}
                          </span>
                        </span>
                      </div>
                    </button>
                  ))
                )}
              </div>
            </div>

            {/* Devices */}
            <div className="bg-white border border-neutral-200 rounded-xl overflow-hidden">
              <div className="px-5 py-4 border-b border-neutral-100">
                <h2 className="text-sm font-semibold text-neutral-900">By Device</h2>
              </div>
              <div className="divide-y divide-neutral-100">
                {data!.devices.length === 0 ? (
                  <p className="px-5 py-6 text-xs text-neutral-400 text-center">No device data</p>
                ) : (
                  data!.devices.map((d) => (
                    <div key={d.device_type} className="px-5 py-3 flex items-center gap-4">
                      <DeviceIcon type={d.device_type} />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-neutral-900 capitalize">{d.device_type}</p>
                        <p className="text-[10px] text-neutral-400">{d.samples} samples</p>
                      </div>
                      <div className="flex items-center gap-3 text-xs">
                        <div className="text-center">
                          <p className="text-neutral-400 text-[10px]">LCP</p>
                          <p className="font-medium">{d.avg_lcp != null ? `${d.avg_lcp}ms` : "—"}</p>
                        </div>
                        <div className="text-center">
                          <p className="text-neutral-400 text-[10px]">CLS</p>
                          <p className="font-medium">{d.avg_cls != null ? d.avg_cls : "—"}</p>
                        </div>
                        <div className="text-center">
                          <p className="text-neutral-400 text-[10px]">Load</p>
                          <p className="font-medium">{d.avg_page_load != null ? `${d.avg_page_load}ms` : "—"}</p>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Samples count */}
          <p className="text-xs text-neutral-400 text-center">
            {s!.total_samples.toLocaleString()} samples collected over the last {days} day{days > 1 ? "s" : ""}
            {pathFilter && ` for ${pathFilter}`}
            {pathFilter && (
              <button onClick={() => setPathFilter("")} className="text-indigo-600 ml-2 underline">
                Clear filter
              </button>
            )}
          </p>
        </>
      )}
    </div>
  );
}

function CWVCard({
  label,
  abbr,
  value,
  unit,
  good,
  poor,
  description,
  trend,
  maxVal,
}: {
  label: string;
  abbr: string;
  value: number | null;
  unit: string;
  good: number;
  poor: number;
  description: string;
  trend: (number | null)[];
  maxVal: number;
}) {
  const rating = rateMetric(value, good, poor);
  return (
    <div className="bg-white border border-neutral-200 rounded-xl p-5">
      <div className="flex items-start justify-between mb-3">
        <div>
          <p className="text-xs text-neutral-500">{label}</p>
          <div className="flex items-center gap-2 mt-1">
            <span className={`w-2 h-2 rounded-full ${ratingDots[rating]}`} />
            <span className="text-2xl font-semibold text-neutral-900">
              {value != null ? (unit ? `${value}` : value) : "—"}
            </span>
            {unit && value != null && <span className="text-sm text-neutral-400">{unit}</span>}
          </div>
        </div>
        <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${ratingColors[rating]}`}>
          {abbr}
        </span>
      </div>
      <SparkLine data={trend} maxVal={maxVal} />
      <p className="text-[10px] text-neutral-400 mt-2">{description}</p>
      <p className="text-[10px] text-neutral-400 mt-0.5">
        Good: ≤{good}{unit} · Poor: &gt;{poor}{unit}
      </p>
    </div>
  );
}

function MiniCard({ label, value, unit }: { label: string; value: number | null; unit: string }) {
  return (
    <div className="bg-white border border-neutral-200 rounded-xl p-4">
      <p className="text-[10px] text-neutral-400 uppercase tracking-wider">{label}</p>
      <p className="text-lg font-semibold text-neutral-900 mt-1">
        {value != null ? `${value}${unit}` : "—"}
      </p>
    </div>
  );
}

function DistRow({ label, good, needs, poor }: { label: string; good: number; needs: number; poor: number }) {
  const total = good + needs + poor;
  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-xs font-medium text-neutral-700">{label}</span>
        <div className="flex gap-3 text-[10px] text-neutral-500">
          <span>{total ? Math.round((good / total) * 100) : 0}% good</span>
          <span>{total ? Math.round((needs / total) * 100) : 0}% needs work</span>
          <span>{total ? Math.round((poor / total) * 100) : 0}% poor</span>
        </div>
      </div>
      <DistBar good={good} needs={needs} poor={poor} />
    </div>
  );
}
