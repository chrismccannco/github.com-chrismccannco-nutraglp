import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { requireRole } from "@/lib/admin-auth";

export async function GET(req: NextRequest) {
  try {
    const db = getDb();
    const published = req.nextUrl.searchParams.get("published");
    const sql = published === "1"
      ? "SELECT * FROM testimonials WHERE published = 1 ORDER BY sort_order ASC, id ASC"
      : "SELECT * FROM testimonials ORDER BY sort_order ASC, id ASC";
    const result = await db.execute(sql);
    return NextResponse.json(result.rows);
  } catch (e: unknown) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const { error: authError } = await requireRole(req, "editor");
  if (authError) return authError;
  try {
    const body = await req.json();
    const db = getDb();

    const insertResult = await db.execute({
      sql: `INSERT INTO testimonials (name, title, quote, rating, avatar_url, featured, sort_order, published)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      args: [
        body.name,
        body.title || null,
        body.quote,
        body.rating ?? 5,
        body.avatar_url || null,
        body.featured ? 1 : 0,
        body.sort_order ?? 0,
        body.published !== undefined ? (body.published ? 1 : 0) : 1,
      ],
    });

    const result = await db.execute({
      sql: "SELECT * FROM testimonials WHERE id = ?",
      args: [Number(insertResult.lastInsertRowid)],
    });
    return NextResponse.json(result.rows[0], { status: 201 });
  } catch (e: unknown) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  const { error: authError } = await requireRole(req, "editor");
  if (authError) return authError;
  try {
    const body = await req.json();
    if (!body.id) return NextResponse.json({ error: "id required" }, { status: 400 });

    const db = getDb();
    const fields: Record<string, unknown> = {};
    const allowed = ["name", "title", "quote", "rating", "avatar_url", "sort_order"];
    for (const key of allowed) {
      if (body[key] !== undefined) fields[key] = body[key];
    }
    if (body.featured !== undefined) fields.featured = body.featured ? 1 : 0;
    if (body.published !== undefined) fields.published = body.published ? 1 : 0;

    if (Object.keys(fields).length === 0)
      return NextResponse.json({ error: "No fields to update" }, { status: 400 });

    const setClauses = Object.keys(fields).map((k) => `${k} = ?`);
    const values = [...Object.values(fields), body.id];

    await db.execute({
      sql: `UPDATE testimonials SET ${setClauses.join(", ")} WHERE id = ?`,
      args: values as (string | number | null)[],
    });

    const result = await db.execute({
      sql: "SELECT * FROM testimonials WHERE id = ?",
      args: [body.id],
    });
    return NextResponse.json(result.rows[0]);
  } catch (e: unknown) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const { error: authError } = await requireRole(req, "editor");
  if (authError) return authError;
  try {
    const body = await req.json();
    if (!body.id) return NextResponse.json({ error: "id required" }, { status: 400 });

    const db = getDb();
    const result = await db.execute({
      sql: "DELETE FROM testimonials WHERE id = ?",
      args: [body.id],
    });
    if (result.rowsAffected === 0)
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ deleted: true });
  } catch (e: unknown) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
