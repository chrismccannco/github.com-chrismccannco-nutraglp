import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";

/** GET /api/templates?category=page&search=hero */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category");
    const search = searchParams.get("search");
    const premium = searchParams.get("premium");

    const db = getDb();
    let sql = "SELECT * FROM templates WHERE published = 1";
    const args: (string | number | null)[] = [];

    if (category) {
      sql += " AND category = ?";
      args.push(category);
    }
    if (premium === "true") {
      sql += " AND is_premium = 1";
    } else if (premium === "false") {
      sql += " AND is_premium = 0";
    }
    if (search) {
      sql += " AND (name LIKE ? OR description LIKE ? OR tags LIKE ?)";
      const term = `%${search}%`;
      args.push(term, term, term);
    }

    sql += " ORDER BY downloads DESC, rating DESC, created_at DESC";

    const result = await db.execute({ sql, args });
    const rows = result.rows.map((r) => {
      const row = r as unknown as Record<string, unknown>;
      return {
        ...row,
        blocks: JSON.parse((row.blocks as string) || "[]"),
        theme: JSON.parse((row.theme as string) || "{}"),
        tags: JSON.parse((row.tags as string) || "[]"),
        is_premium: !!row.is_premium,
        published: !!row.published,
      };
    });

    return NextResponse.json(rows);
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}

/** POST /api/templates — create a new template */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      slug,
      name,
      description,
      category,
      thumbnail_url,
      blocks,
      theme,
      author,
      tags,
      is_premium,
      price,
    } = body;

    if (!slug || !name) {
      return NextResponse.json({ error: "slug and name required" }, { status: 400 });
    }

    const db = getDb();
    await db.execute({
      sql: `INSERT INTO templates (slug, name, description, category, thumbnail_url, blocks, theme, author, tags, is_premium, price)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      args: [
        slug,
        name,
        description || null,
        category || "page",
        thumbnail_url || null,
        JSON.stringify(blocks || []),
        JSON.stringify(theme || {}),
        author || "NutraGLP",
        JSON.stringify(tags || []),
        is_premium ? 1 : 0,
        price || 0,
      ],
    });

    return NextResponse.json({ success: true });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
