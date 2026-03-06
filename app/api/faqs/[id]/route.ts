import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const body = await req.json();
    const db = getDb();
    const existing = await db.execute({
      sql: "SELECT id FROM faqs WHERE id = ?",
      args: [id],
    });
    if (existing.rows.length === 0)
      return NextResponse.json({ error: "Not found" }, { status: 404 });

    const updates: string[] = [];
    const values: (string | number | null)[] = [];

    if (body.category !== undefined) { updates.push("category = ?"); values.push(body.category); }
    if (body.question !== undefined) { updates.push("question = ?"); values.push(body.question); }
    if (body.answer !== undefined) { updates.push("answer = ?"); values.push(body.answer); }
    if (body.sort_order !== undefined) { updates.push("sort_order = ?"); values.push(body.sort_order); }
    if (body.published !== undefined) { updates.push("published = ?"); values.push(body.published ? 1 : 0); }

    if (updates.length === 0)
      return NextResponse.json({ error: "No fields to update" }, { status: 400 });

    values.push(id);
    await db.execute({
      sql: `UPDATE faqs SET ${updates.join(", ")} WHERE id = ?`,
      args: values,
    });

    const result = await db.execute({
      sql: "SELECT * FROM faqs WHERE id = ?",
      args: [id],
    });
    return NextResponse.json(result.rows[0]);
  } catch (e: unknown) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const db = getDb();
    const result = await db.execute({
      sql: "DELETE FROM faqs WHERE id = ?",
      args: [id],
    });
    if (result.rowsAffected === 0)
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ deleted: true });
  } catch (e: unknown) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
