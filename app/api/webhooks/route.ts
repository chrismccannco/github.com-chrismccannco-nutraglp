import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";

/**
 * GET /api/webhooks — list all webhook endpoints
 */
export async function GET() {
  try {
    const db = getDb();
    const result = await db.execute(
      "SELECT * FROM webhook_endpoints ORDER BY created_at DESC"
    );
    const rows = result.rows.map((r) => ({
      ...r,
      events: JSON.parse((r.events as string) || "[]"),
    }));
    return NextResponse.json(rows);
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}

/**
 * POST /api/webhooks — create a new webhook endpoint
 * Body: { url, events: string[], secret? }
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { url, events, secret } = body;

    if (!url || !events || !Array.isArray(events) || events.length === 0) {
      return NextResponse.json(
        { error: "url and events (array) are required" },
        { status: 400 }
      );
    }

    const db = getDb();
    const now = new Date().toISOString();
    const result = await db.execute({
      sql: `INSERT INTO webhook_endpoints (url, events, secret, enabled, created_at) VALUES (?, ?, ?, 1, ?)`,
      args: [url, JSON.stringify(events), secret || null, now],
    });

    const created = await db.execute({
      sql: "SELECT * FROM webhook_endpoints WHERE id = ?",
      args: [Number(result.lastInsertRowid)],
    });
    const row = created.rows[0];
    return NextResponse.json({
      ...row,
      events: JSON.parse((row.events as string) || "[]"),
    }, { status: 201 });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
