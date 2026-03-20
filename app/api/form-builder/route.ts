import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";

/** GET /api/form-builder — list all forms */
export async function GET() {
  try {
    const db = getDb();
    const result = await db.execute(
      "SELECT id, slug, name, description, published, submission_count, created_at, updated_at FROM forms ORDER BY updated_at DESC"
    );
    return NextResponse.json(result.rows);
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}

/** POST /api/form-builder — create a new form */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, description = "", fields = [], settings = {} } = body;

    if (!name) {
      return NextResponse.json({ error: "name is required" }, { status: 400 });
    }

    const slug = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "")
      || `form-${Date.now()}`;

    const db = getDb();
    const result = await db.execute({
      sql: `INSERT INTO forms (slug, name, description, fields, settings) VALUES (?, ?, ?, ?, ?)`,
      args: [slug, name, description, JSON.stringify(fields), JSON.stringify(settings)],
    });

    return NextResponse.json({
      id: Number(result.lastInsertRowid),
      slug,
      name,
    });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
