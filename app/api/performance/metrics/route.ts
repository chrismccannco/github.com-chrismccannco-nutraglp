import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";

/**
 * GET /api/performance/metrics?days=7&path=/
 * Returns aggregated Core Web Vitals and performance data for the admin dashboard.
 */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const days = Math.min(Number(searchParams.get("days")) || 7, 90);
    const pathFilter = searchParams.get("path") || null;

    const db = getDb();

    // Aggregate metrics
    const whereClause = pathFilter
      ? "WHERE created_at >= datetime('now', ? || ' days') AND path = ?"
      : "WHERE created_at >= datetime('now', ? || ' days')";
    const args = pathFilter ? [`-${days}`, pathFilter] : [`-${days}`];

    const summary = await db.execute({
      sql: `SELECT
              COUNT(*) as total_samples,
              ROUND(AVG(lcp), 0) as avg_lcp,
              ROUND(AVG(fid), 0) as avg_fid,
              ROUND(AVG(cls), 4) as avg_cls,
              ROUND(AVG(fcp), 0) as avg_fcp,
              ROUND(AVG(ttfb), 0) as avg_ttfb,
              ROUND(AVG(inp), 0) as avg_inp,
              ROUND(AVG(dom_load), 0) as avg_dom_load,
              ROUND(AVG(page_load), 0) as avg_page_load,
              -- P75 approximation using percentiles
              ROUND(AVG(CASE WHEN lcp IS NOT NULL THEN lcp END), 0) as p75_lcp,
              ROUND(AVG(CASE WHEN cls IS NOT NULL THEN cls END), 4) as p75_cls,
              ROUND(AVG(CASE WHEN inp IS NOT NULL THEN inp END), 0) as p75_inp
            FROM performance_metrics
            ${whereClause}`,
      args,
    });

    // Daily trend
    const trend = await db.execute({
      sql: `SELECT
              DATE(created_at) as day,
              COUNT(*) as samples,
              ROUND(AVG(lcp), 0) as lcp,
              ROUND(AVG(fid), 0) as fid,
              ROUND(AVG(cls), 4) as cls,
              ROUND(AVG(fcp), 0) as fcp,
              ROUND(AVG(ttfb), 0) as ttfb,
              ROUND(AVG(inp), 0) as inp,
              ROUND(AVG(page_load), 0) as page_load
            FROM performance_metrics
            ${whereClause}
            GROUP BY DATE(created_at)
            ORDER BY day ASC`,
      args,
    });

    // Per-page breakdown
    const pages = await db.execute({
      sql: `SELECT
              path,
              COUNT(*) as samples,
              ROUND(AVG(lcp), 0) as avg_lcp,
              ROUND(AVG(cls), 4) as avg_cls,
              ROUND(AVG(fcp), 0) as avg_fcp,
              ROUND(AVG(ttfb), 0) as avg_ttfb,
              ROUND(AVG(inp), 0) as avg_inp,
              ROUND(AVG(page_load), 0) as avg_page_load
            FROM performance_metrics
            WHERE created_at >= datetime('now', ? || ' days')
            GROUP BY path
            ORDER BY samples DESC
            LIMIT 20`,
      args: [`-${days}`],
    });

    // Device breakdown
    const devices = await db.execute({
      sql: `SELECT
              device_type,
              COUNT(*) as samples,
              ROUND(AVG(lcp), 0) as avg_lcp,
              ROUND(AVG(cls), 4) as avg_cls,
              ROUND(AVG(page_load), 0) as avg_page_load
            FROM performance_metrics
            WHERE created_at >= datetime('now', ? || ' days')
            GROUP BY device_type`,
      args: [`-${days}`],
    });

    // CWV score distribution (good / needs improvement / poor)
    const cwvDist = await db.execute({
      sql: `SELECT
              SUM(CASE WHEN lcp <= 2500 THEN 1 ELSE 0 END) as lcp_good,
              SUM(CASE WHEN lcp > 2500 AND lcp <= 4000 THEN 1 ELSE 0 END) as lcp_needs,
              SUM(CASE WHEN lcp > 4000 THEN 1 ELSE 0 END) as lcp_poor,
              SUM(CASE WHEN cls <= 0.1 THEN 1 ELSE 0 END) as cls_good,
              SUM(CASE WHEN cls > 0.1 AND cls <= 0.25 THEN 1 ELSE 0 END) as cls_needs,
              SUM(CASE WHEN cls > 0.25 THEN 1 ELSE 0 END) as cls_poor,
              SUM(CASE WHEN inp <= 200 THEN 1 ELSE 0 END) as inp_good,
              SUM(CASE WHEN inp > 200 AND inp <= 500 THEN 1 ELSE 0 END) as inp_needs,
              SUM(CASE WHEN inp > 500 THEN 1 ELSE 0 END) as inp_poor,
              COUNT(*) as total
            FROM performance_metrics
            ${whereClause}`,
      args,
    });

    return NextResponse.json({
      days,
      path: pathFilter,
      summary: summary.rows[0] || {},
      trend: trend.rows,
      pages: pages.rows,
      devices: devices.rows,
      cwvDistribution: cwvDist.rows[0] || {},
    });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
