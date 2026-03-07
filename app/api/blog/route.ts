import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";

export async function GET() {
  try {
    const db = getDb();
    const result = await db.execute(
      "SELECT * FROM blog_posts ORDER BY date DESC"
    );
    const posts = result.rows.map((r) => ({
      id: r.id,
      slug: r.slug,
      title: r.title,
      description: r.description,
      date: r.date,
      read_time: r.read_time,
      tag: r.tag,
      gradient: r.gradient,
      sections: JSON.parse(r.sections as string),
      related_slugs: JSON.parse(r.related_slugs as string),
      meta_title: r.meta_title,
      meta_description: r.meta_description,
      og_image: r.og_image,
      published: r.published,
      created_at: r.created_at,
      updated_at: r.updated_at,
    }));
    return NextResponse.json(posts);
  } catch (e: unknown) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const db = getDb();

    const insertResult = await db.execute({
      sql: `INSERT INTO blog_posts (slug, title, description, date, read_time, tag, gradient, sections, related_slugs, published, meta_title, meta_description, og_image)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      args: [
        body.slug,
        body.title,
        body.description || "",
        body.date || new Date().toISOString().split("T")[0],
        body.read_time || "",
        body.tag || "",
        body.gradient || "from-emerald-900 to-green-800",
        JSON.stringify(body.sections || []),
        JSON.stringify(body.related_slugs || []),
        body.published !== undefined ? (body.published ? 1 : 0) : 1,
        body.meta_title || null,
        body.meta_description || null,
        body.og_image || null,
      ],
    });

    const result = await db.execute({
      sql: "SELECT * FROM blog_posts WHERE id = ?",
      args: [insertResult.lastInsertRowid!],
    });
    const r = result.rows[0];
    return NextResponse.json(
      {
        id: r.id, slug: r.slug, title: r.title, description: r.description,
        date: r.date, read_time: r.read_time, tag: r.tag, gradient: r.gradient,
        meta_title: r.meta_title, meta_description: r.meta_description, og_image: r.og_image,
        sections: JSON.parse(r.sections as string),
        related_slugs: JSON.parse(r.related_slugs as string),
        published: r.published, created_at: r.created_at, updated_at: r.updated_at,
      },
      { status: 201 }
    );
  } catch (e: unknown) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
