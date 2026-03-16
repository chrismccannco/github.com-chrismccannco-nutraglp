import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  try {
    const db = getDb();
    const result = await db.execute({
      sql: "SELECT * FROM pages WHERE slug = ?",
      args: [slug],
    });
    if (result.rows.length === 0)
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    const row = result.rows[0];
    return NextResponse.json({
      id: row.id,
      slug: row.slug,
      title: row.title,
      meta_title: row.meta_title,
      meta_description: row.meta_description,
      og_image: row.og_image,
      content: JSON.parse(row.content as string),
      blocks: JSON.parse((row.blocks as string) || "[]"),
      blocks_draft: JSON.parse((row.blocks_draft as string) || "[]"),
      published: row.published,
      updated_at: row.updated_at,
    });
  } catch (e: unknown) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  try {
    const body = await req.json();
    const db = getDb();
    const existing = await db.execute({
      sql: "SELECT id FROM pages WHERE slug = ?",
      args: [slug],
    });
    if (existing.rows.length === 0)
      return NextResponse.json({ error: "Not found" }, { status: 404 });

    const updates: string[] = [];
    const values: (string | null)[] = [];

    if (body.title !== undefined) {
      updates.push("title = ?");
      values.push(body.title);
    }
    if (body.meta_description !== undefined) {
      updates.push("meta_description = ?");
      values.push(body.meta_description);
    }
    if (body.content !== undefined) {
      updates.push("content = ?");
      values.push(JSON.stringify(body.content));
    }
    if (body.meta_title !== undefined) {
      updates.push("meta_title = ?");
      values.push(body.meta_title);
    }
    if (body.og_image !== undefined) {
      updates.push("og_image = ?");
      values.push(body.og_image);
    }
    if (body.blocks !== undefined) {
      updates.push("blocks = ?");
      values.push(JSON.stringify(body.blocks));
    }
    if (body.blocks_draft !== undefined) {
      updates.push("blocks_draft = ?");
      values.push(JSON.stringify(body.blocks_draft));
    }
    if (body.published !== undefined) {
      updates.push("published = ?");
      values.push(String(body.published ? 1 : 0));
    }

    if (updates.length === 0)
      return NextResponse.json({ error: "No fields to update" }, { status: 400 });

    updates.push("updated_at = CURRENT_TIMESTAMP");
    values.push(slug);

    await db.execute({
      sql: `UPDATE pages SET ${updates.join(", ")} WHERE slug = ?`,
      args: values,
    });

    const result = await db.execute({
      sql: "SELECT * FROM pages WHERE slug = ?",
      args: [slug],
    });
    const row = result.rows[0];
    return NextResponse.json({
      id: row.id,
      slug: row.slug,
      title: row.title,
      meta_title: row.meta_title,
      meta_description: row.meta_description,
      og_image: row.og_image,
      content: JSON.parse(row.content as string),
      blocks: JSON.parse((row.blocks as string) || "[]"),
      blocks_draft: JSON.parse((row.blocks_draft as string) || "[]"),
      published: row.published,
      updated_at: row.updated_at,
    });
  } catch (e: unknown) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
