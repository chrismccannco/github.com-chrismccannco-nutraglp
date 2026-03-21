import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { requireRole } from "@/lib/admin-auth";

/**
 * GET /api/audit
 * Query params: entity_type, action, limit (default 100), offset (default 0)
 */
export async function GET(req: NextRequest) {
  const { error: authError } = await requireRole(req, "admin");
  if (authError) return authError;
  try {
    const { searchParams } = new URL(req.url);
    const entityType = searchParams.get("entity_type");
    const action = searchParams.get("action");
    const limit = Math.min(parseInt(searchParams.get("limit") || "100"), 500);
    const offset = parseInt(searchParams.get("offset") || "0");

    const db = getDb();
    const conditions: string[] = [];
    const args: (string | number)[] = [];

    if (entityType) { conditions.push("entity_type = ?"); args.push(entityType); }
    if (action) { conditions.push("action = ?"); args.push(action); }

    const where = conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";

    const [rows, countResult] = await Promise.all([
      db.execute({
        sql: `SELECT * FROM audit_log ${where} ORDER BY created_at DESC LIMIT ? OFFSET ?`,
        args: [...args, limit, offset],
      }),
      db.execute({
        sql: `SELECT COUNT(*) as total FROM audit_log ${where}`,
        args,
      }),
    ]);

    return NextResponse.json({
      data: rows.rows.map((r) => ({
        id: Number(r.id),
        action: r.action,
        entity_type: r.entity_type,
        entity_id: r.entity_id,
        entity_label: r.entity_label,
        metadata: JSON.parse((r.metadata as string) || "{}"),
        created_at: r.created_at,
      })),
      total: Number(countResult.rows[0].total),
      limit,
      offset,
    });
  } catch (e: unknown) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
