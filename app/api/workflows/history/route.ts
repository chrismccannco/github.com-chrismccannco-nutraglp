import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";

/**
 * GET /api/workflows/history?type=page&id=5
 * Returns all workflow entries for a specific content item, ordered newest first.
 */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const contentType = searchParams.get("type");
    const contentId = searchParams.get("id");

    if (!contentType || !contentId) {
      return NextResponse.json(
        { error: "type and id query params are required" },
        { status: 400 }
      );
    }

    const db = getDb();
    const result = await db.execute({
      sql: `SELECT * FROM content_workflows
            WHERE content_type = ? AND content_id = ?
            ORDER BY id DESC
            LIMIT 50`,
      args: [contentType, Number(contentId)],
    });

    return NextResponse.json(result.rows);
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
