import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";

/**
 * POST /api/ab — Track an A/B event (impression or click)
 * Body: { block_id, variant ("A" | "B"), event_type ("impression" | "click"), page_path?, session_id? }
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { block_id, variant, event_type, page_path, session_id } = body;
    if (!block_id || !variant || !event_type) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }
    const db = getDb();
    await db.execute({
      sql: "INSERT INTO ab_events (block_id, variant, event_type, page_path, session_id) VALUES (?, ?, ?, ?, ?)",
      args: [block_id, variant, event_type, page_path || null, session_id || null],
    });
    return NextResponse.json({ tracked: true });
  } catch (e: unknown) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}

/**
 * GET /api/ab?block_id=xxx — Get A/B results for a block
 * GET /api/ab — Get all A/B results grouped by block
 */
export async function GET(req: NextRequest) {
  try {
    const db = getDb();
    const blockId = req.nextUrl.searchParams.get("block_id");

    if (blockId) {
      const result = await db.execute({
        sql: `SELECT variant, event_type, COUNT(*) as count
              FROM ab_events WHERE block_id = ?
              GROUP BY variant, event_type
              ORDER BY variant, event_type`,
        args: [blockId],
      });
      return NextResponse.json({ block_id: blockId, results: result.rows });
    }

    // All blocks with A/B data
    const result = await db.execute(
      `SELECT block_id, variant, event_type, COUNT(*) as count
       FROM ab_events
       GROUP BY block_id, variant, event_type
       ORDER BY block_id, variant, event_type`
    );
    return NextResponse.json({ results: result.rows });
  } catch (e: unknown) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
