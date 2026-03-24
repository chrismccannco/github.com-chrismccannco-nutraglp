import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { requireRole } from "@/lib/admin-auth";

function countWords(text: string): number {
  return text.trim().split(/\s+/).filter(Boolean).length;
}

// GET /api/knowledge/:id
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const db = getDb();
    const result = await db.execute({
      sql: "SELECT * FROM knowledge_docs WHERE id = ?",
      args: [Number(id)],
    });
    if (result.rows.length === 0) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    return NextResponse.json(result.rows[0]);
  } catch (e: unknown) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}

// PUT /api/knowledge/:id
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { error: authError } = await requireRole(req, "editor");
  if (authError) return authError;
  try {
    const { id } = await params;
    const body = await req.json();
    const db = getDb();

    const fields: Record<string, unknown> = {};
    const allowed = ["title", "slug", "doc_type", "content", "summary", "enabled"];

    for (const key of allowed) {
      if (body[key] !== undefined) {
        if (key === "enabled") {
          fields[key] = body[key] ? 1 : 0;
        } else {
          fields[key] = body[key];
        }
      }
    }

    if (body.tags !== undefined) {
      fields.tags = JSON.stringify(body.tags);
    }

    // Recalculate word count if content changed
    if (body.content) {
      fields.word_count = countWords(body.content);
    }

    if (Object.keys(fields).length === 0) {
      return NextResponse.json({ error: "No fields to update" }, { status: 400 });
    }

    const setClauses = Object.keys(fields).map((k) => `${k} = ?`);
    const values = [...Object.values(fields), Number(id)];

    await db.execute({
      sql: `UPDATE knowledge_docs SET ${setClauses.join(", ")}, updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
      args: values as (string | number | null)[],
    });

    const result = await db.execute({
      sql: "SELECT * FROM knowledge_docs WHERE id = ?",
      args: [Number(id)],
    });
    return NextResponse.json(result.rows[0]);
  } catch (e: unknown) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}

// DELETE /api/knowledge/:id
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { error: authError } = await requireRole(req, "editor");
  if (authError) return authError;
  try {
    const { id } = await params;
    const db = getDb();
    const result = await db.execute({
      sql: "DELETE FROM knowledge_docs WHERE id = ?",
      args: [Number(id)],
    });
    if (result.rowsAffected === 0) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    return NextResponse.json({ deleted: true });
  } catch (e: unknown) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
