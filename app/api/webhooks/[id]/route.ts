import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";

/**
 * PUT /api/webhooks/:id — update a webhook endpoint
 */
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const body = await req.json();
    const db = getDb();

    const existing = await db.execute({
      sql: "SELECT id FROM webhook_endpoints WHERE id = ?",
      args: [Number(id)],
    });
    if (existing.rows.length === 0)
      return NextResponse.json({ error: "Not found" }, { status: 404 });

    const updates: string[] = [];
    const values: (string | number | null)[] = [];

    if (body.url !== undefined) { updates.push("url = ?"); values.push(body.url); }
    if (body.events !== undefined) { updates.push("events = ?"); values.push(JSON.stringify(body.events)); }
    if (body.secret !== undefined) { updates.push("secret = ?"); values.push(body.secret || null); }
    if (body.enabled !== undefined) { updates.push("enabled = ?"); values.push(body.enabled ? 1 : 0); }

    if (updates.length === 0)
      return NextResponse.json({ error: "No fields to update" }, { status: 400 });

    values.push(Number(id));
    await db.execute({
      sql: `UPDATE webhook_endpoints SET ${updates.join(", ")} WHERE id = ?`,
      args: values,
    });

    const result = await db.execute({
      sql: "SELECT * FROM webhook_endpoints WHERE id = ?",
      args: [Number(id)],
    });
    const row = result.rows[0];
    return NextResponse.json({
      ...row,
      events: JSON.parse((row.events as string) || "[]"),
    });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}

/**
 * DELETE /api/webhooks/:id
 */
export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const db = getDb();
    const result = await db.execute({
      sql: "DELETE FROM webhook_endpoints WHERE id = ?",
      args: [Number(id)],
    });
    if (result.rowsAffected === 0)
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ deleted: true });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
