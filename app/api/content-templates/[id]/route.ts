import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";

// GET /api/content-templates/:id
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const db = getDb();
    const result = await db.execute({
      sql: "SELECT * FROM content_templates WHERE id = ?",
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

// PUT /api/content-templates/:id
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const db = getDb();

    const fields: Record<string, unknown> = {};
    const allowed = [
      "name", "slug", "description", "category", "prompt_template",
      "voice_id", "output_format", "max_tokens", "sort_order",
    ];
    for (const key of allowed) {
      if (body[key] !== undefined) fields[key] = body[key];
    }
    if (body.variables !== undefined) {
      fields.variables = JSON.stringify(body.variables);
    }
    if (body.knowledge_doc_ids !== undefined) {
      fields.knowledge_doc_ids = JSON.stringify(body.knowledge_doc_ids);
    }

    if (Object.keys(fields).length === 0) {
      return NextResponse.json({ error: "No fields to update" }, { status: 400 });
    }

    const setClauses = Object.keys(fields).map((k) => `${k} = ?`);
    const values = [...Object.values(fields), Number(id)];

    await db.execute({
      sql: `UPDATE content_templates SET ${setClauses.join(", ")}, updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
      args: values as (string | number | null)[],
    });

    const result = await db.execute({
      sql: "SELECT * FROM content_templates WHERE id = ?",
      args: [Number(id)],
    });
    return NextResponse.json(result.rows[0]);
  } catch (e: unknown) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}

// DELETE /api/content-templates/:id
export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const db = getDb();
    const result = await db.execute({
      sql: "DELETE FROM content_templates WHERE id = ? AND is_system = 0",
      args: [Number(id)],
    });
    if (result.rowsAffected === 0) {
      return NextResponse.json({ error: "Not found or system template" }, { status: 404 });
    }
    return NextResponse.json({ deleted: true });
  } catch (e: unknown) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
