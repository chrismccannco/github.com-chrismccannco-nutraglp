import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { withApiKey, corsOptions } from "@/lib/api-middleware";

export const OPTIONS = () => corsOptions();

export const GET = withApiKey("read", async (req: NextRequest) => {
  const { searchParams } = new URL(req.url);
  const slug = searchParams.get("slug");
  const tag = searchParams.get("tag");
  const limit = Math.min(Number(searchParams.get("limit") || 50), 100);
  const offset = Number(searchParams.get("offset") || 0);

  const db = getDb();

  if (slug) {
    const result = await db.execute({
      sql: `SELECT * FROM blog_posts WHERE slug = ? AND published = 1`,
      args: [slug],
    });
    if (result.rows.length === 0) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }
    return NextResponse.json(formatPost(result.rows[0]));
  }

  let sql = "SELECT id, slug, title, description, date, read_time, tag, gradient, featured_image, updated_at FROM blog_posts WHERE published = 1";
  const args: (string | number)[] = [];

  if (tag) {
    sql += " AND tag = ?";
    args.push(tag);
  }

  sql += " ORDER BY date DESC LIMIT ? OFFSET ?";
  args.push(limit, offset);

  const result = await db.execute({ sql, args });

  // Get total count
  let countSql = "SELECT COUNT(*) as total FROM blog_posts WHERE published = 1";
  const countArgs: string[] = [];
  if (tag) {
    countSql += " AND tag = ?";
    countArgs.push(tag);
  }
  const countResult = await db.execute({ sql: countSql, args: countArgs });
  const total = Number(countResult.rows[0]?.total || 0);

  return NextResponse.json({
    data: result.rows.map((row) => ({
      id: Number(row.id),
      slug: String(row.slug),
      title: String(row.title),
      description: String(row.description || ""),
      date: String(row.date || ""),
      read_time: String(row.read_time || ""),
      tag: String(row.tag || ""),
      featured_image: String(row.featured_image || ""),
      updated_at: String(row.updated_at || ""),
    })),
    total,
    limit,
    offset,
  });
});

function formatPost(row: Record<string, unknown>) {
  let sections = [];
  try { sections = JSON.parse(String(row.sections || "[]")); } catch { /* */ }
  let blocks = [];
  try { blocks = JSON.parse(String(row.blocks || "[]")); } catch { /* */ }

  return {
    id: Number(row.id),
    slug: String(row.slug),
    title: String(row.title),
    description: String(row.description || ""),
    date: String(row.date || ""),
    read_time: String(row.read_time || ""),
    tag: String(row.tag || ""),
    featured_image: String(row.featured_image || ""),
    meta_title: String(row.meta_title || ""),
    meta_description: String(row.meta_description || ""),
    og_image: String(row.og_image || ""),
    sections,
    blocks,
    updated_at: String(row.updated_at || ""),
  };
}
