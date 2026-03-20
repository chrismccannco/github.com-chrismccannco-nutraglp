import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";

export async function GET(req: NextRequest) {
  try {
    const days = parseInt(req.nextUrl.searchParams.get("days") || "7", 10);
    const db = getDb();

    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - days);
    const cutoffStr = cutoff.toISOString();

    // Views per day
    const perDay = await db.execute({
      sql: `SELECT DATE(created_at) as day, COUNT(*) as views
            FROM page_views WHERE created_at >= ?
            GROUP BY DATE(created_at) ORDER BY day ASC`,
      args: [cutoffStr],
    });

    // Top pages
    const topPages = await db.execute({
      sql: `SELECT path, COUNT(*) as views
            FROM page_views WHERE created_at >= ?
            GROUP BY path ORDER BY views DESC LIMIT 10`,
      args: [cutoffStr],
    });

    // Top referrers
    const topReferrers = await db.execute({
      sql: `SELECT referrer, COUNT(*) as views
            FROM page_views WHERE created_at >= ? AND referrer IS NOT NULL AND referrer != ''
            GROUP BY referrer ORDER BY views DESC LIMIT 10`,
      args: [cutoffStr],
    });

    // Totals
    const totals = await db.execute({
      sql: `SELECT COUNT(*) as total, COUNT(DISTINCT path) as unique_pages
            FROM page_views WHERE created_at >= ?`,
      args: [cutoffStr],
    });

    const total = Number(totals.rows[0]?.total ?? 0);
    const uniquePages = Number(totals.rows[0]?.unique_pages ?? 0);
    const avgPerDay = days > 0 ? Math.round(total / days) : 0;

    return NextResponse.json({
      days,
      total,
      unique_pages: uniquePages,
      avg_per_day: avgPerDay,
      per_day: perDay.rows,
      top_pages: topPages.rows,
      top_referrers: topReferrers.rows,
    });
  } catch (e: unknown) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
