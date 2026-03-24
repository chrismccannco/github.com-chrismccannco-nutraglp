import { NextRequest, NextResponse } from "next/server";
import { initDb } from "@/lib/db";
import { requireRole } from "@/lib/admin-auth";

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { error: authError } = await requireRole(req, "editor");
  if (authError) return authError;
  try {
    const { id: rawId } = await params;
    const id = parseInt(rawId, 10);
    if (isNaN(id)) return NextResponse.json({ error: "Invalid id" }, { status: 400 });
    const { title, prompt, category } = await req.json();
    const db = await initDb();
    await db.execute({
      sql: "UPDATE saved_prompts SET title = COALESCE(?, title), prompt = COALESCE(?, prompt), category = COALESCE(?, category), updated_at = CURRENT_TIMESTAMP WHERE id = ?",
      args: [title ?? null, prompt ?? null, category ?? null, id],
    });
    const row = await db.execute({
      sql: "SELECT id, title, prompt, category, created_by, sort_order, created_at FROM saved_prompts WHERE id = ?",
      args: [id],
    });
    if (row.rows.length === 0) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ prompt: row.rows[0] });
  } catch (err) {
    console.error("PATCH /api/prompts/[id] error:", err);
    return NextResponse.json({ error: "Failed to update prompt" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { error: authError } = await requireRole(req, "editor");
  if (authError) return authError;
  try {
    const { id: rawId } = await params;
    const id = parseInt(rawId, 10);
    if (isNaN(id)) return NextResponse.json({ error: "Invalid id" }, { status: 400 });
    const db = await initDb();
    await db.execute({ sql: "DELETE FROM saved_prompts WHERE id = ?", args: [id] });
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("DELETE /api/prompts/[id] error:", err);
    return NextResponse.json({ error: "Failed to delete prompt" }, { status: 500 });
  }
}
