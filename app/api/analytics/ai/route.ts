import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";

export const dynamic = "force-dynamic";

/**
 * GET /api/analytics/ai
 * Query params:
 *   days=30  — how far back to look (default 30)
 *   action   — filter by action type
 */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const days = Number(searchParams.get("days") || "30");
    const action = searchParams.get("action");
    const db = getDb();
    const since = new Date(Date.now() - days * 86400000).toISOString();

    // Summary stats
    const summarySQL = action
      ? "SELECT COUNT(*) as total_calls, SUM(input_tokens) as total_input, SUM(output_tokens) as total_output, AVG(duration_ms) as avg_duration FROM ai_usage_log WHERE created_at >= ? AND action = ?"
      : "SELECT COUNT(*) as total_calls, SUM(input_tokens) as total_input, SUM(output_tokens) as total_output, AVG(duration_ms) as avg_duration FROM ai_usage_log WHERE created_at >= ?";
    const summaryArgs = action ? [since, action] : [since];
    const summary = await db.execute({ sql: summarySQL, args: summaryArgs });

    // Breakdown by action
    const byAction = await db.execute({
      sql: `SELECT action, COUNT(*) as count, SUM(input_tokens) as input_tokens, SUM(output_tokens) as output_tokens, AVG(duration_ms) as avg_duration
            FROM ai_usage_log WHERE created_at >= ?
            GROUP BY action ORDER BY count DESC`,
      args: [since],
    });

    // Breakdown by model
    const byModel = await db.execute({
      sql: `SELECT model, COUNT(*) as count, SUM(input_tokens) as input_tokens, SUM(output_tokens) as output_tokens
            FROM ai_usage_log WHERE created_at >= ?
            GROUP BY model ORDER BY count DESC`,
      args: [since],
    });

    // Daily usage (for chart)
    const daily = await db.execute({
      sql: `SELECT DATE(created_at) as date, COUNT(*) as calls, SUM(input_tokens) as input_tokens, SUM(output_tokens) as output_tokens
            FROM ai_usage_log WHERE created_at >= ?
            GROUP BY DATE(created_at) ORDER BY date ASC`,
      args: [since],
    });

    // Top templates
    const topTemplates = await db.execute({
      sql: `SELECT template_name, COUNT(*) as count, SUM(input_tokens + output_tokens) as total_tokens
            FROM ai_usage_log WHERE created_at >= ? AND template_name IS NOT NULL
            GROUP BY template_name ORDER BY count DESC LIMIT 10`,
      args: [since],
    });

    // Recent activity
    const recent = await db.execute({
      sql: `SELECT * FROM ai_usage_log WHERE created_at >= ? ORDER BY created_at DESC LIMIT 50`,
      args: [since],
    });

    const s = summary.rows[0];
    return NextResponse.json({
      summary: {
        total_calls: s.total_calls || 0,
        total_input_tokens: s.total_input || 0,
        total_output_tokens: s.total_output || 0,
        total_tokens: ((s.total_input as number) || 0) + ((s.total_output as number) || 0),
        avg_duration_ms: Math.round((s.avg_duration as number) || 0),
      },
      by_action: byAction.rows,
      by_model: byModel.rows,
      daily: daily.rows,
      top_templates: topTemplates.rows,
      recent: recent.rows,
    });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
