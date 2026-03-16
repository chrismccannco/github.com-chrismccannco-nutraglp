import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { withApiKey, corsOptions } from "@/lib/api-middleware";

export const OPTIONS = () => corsOptions();

export const GET = withApiKey("read", async (req: NextRequest) => {
  const { searchParams } = new URL(req.url);
  const slug = searchParams.get("slug");

  const db = getDb();

  if (slug) {
    const result = await db.execute({
      sql: `SELECT id, slug, title, meta_description, meta_title, og_image, content, blocks, published, updated_at
            FROM pages WHERE slug = ? AND published = 1`,
      args: [slug],
    });
    if (result.rows.length === 0) {
      return NextResponse.json({ error: "Page not found" }, { status: 404 });
    }
    const row = result.rows[0];
    return NextResponse.json(formatPage(row));
  }

  const result = await db.execute(
    "SELECT id, slug, title, meta_description, meta_title, og_image, published, updated_at FROM pages WHERE published = 1 ORDER BY id ASC"
  );

  return NextResponse.json({
    data: result.rows.map((row) => ({
      id: Number(row.id),
      slug: String(row.slug),
      title: String(row.title),
      meta_description: String(row.meta_description || ""),
      meta_title: String(row.meta_title || ""),
      og_image: String(row.og_image || ""),
      updated_at: String(row.updated_at || ""),
    })),
    total: result.rows.length,
  });
});

function formatPage(row: Record<string, unknown>) {
  let blocks = [];
  try { blocks = JSON.parse(String(row.blocks || "[]")); } catch { /* */ }
  let content = {};
  try { content = JSON.parse(String(row.content || "{}")); } catch { /* */ }

  return {
    id: Number(row.id),
    slug: String(row.slug),
    title: String(row.title),
    meta_description: String(row.meta_description || ""),
    meta_title: String(row.meta_title || ""),
    og_image: String(row.og_image || ""),
    blocks,
    content,
    updated_at: String(row.updated_at || ""),
  };
}
