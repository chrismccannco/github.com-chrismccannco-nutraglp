import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";

export async function GET() {
  try {
    const db = getDb();
    const result = await db.execute(
      "SELECT id, slug, title, meta_description, published, updated_at FROM pages ORDER BY id ASC"
    );
    return NextResponse.json(result.rows);
  } catch (e: unknown) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { title, slug } = body;
    if (!title || !slug) {
      return NextResponse.json({ error: "Title and slug are required" }, { status: 400 });
    }
    const cleanSlug = slug
      .toLowerCase()
      .replace(/[^a-z0-9-]/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "");

    const db = getDb();

    // Check for duplicate slug
    const existing = await db.execute({
      sql: "SELECT id FROM pages WHERE slug = ?",
      args: [cleanSlug],
    });
    if (existing.rows.length > 0) {
      return NextResponse.json({ error: "A page with this slug already exists" }, { status: 409 });
    }

    await db.execute({
      sql: `INSERT INTO pages (slug, title, meta_description, content, blocks, blocks_draft, published)
            VALUES (?, ?, ?, '{}', '[]', '[]', 0)`,
      args: [cleanSlug, title, body.meta_description || ""],
    });

    const result = await db.execute({
      sql: "SELECT * FROM pages WHERE slug = ?",
      args: [cleanSlug],
    });
    const row = result.rows[0];
    return NextResponse.json(
      {
        id: row.id,
        slug: row.slug,
        title: row.title,
        published: row.published,
        updated_at: row.updated_at,
      },
      { status: 201 }
    );
  } catch (e: unknown) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
