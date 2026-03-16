import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";

type Context = { params: Promise<{ slug: string }> };

async function getSiteId(slug: string): Promise<number | null> {
  const db = getDb();
  const result = await db.execute({ sql: "SELECT id FROM sites WHERE slug = ?", args: [slug] });
  return result.rows.length ? (result.rows[0] as unknown as { id: number }).id : null;
}

/** GET /api/sites/:slug/content?type=page */
export async function GET(req: NextRequest, ctx: Context) {
  try {
    const { slug } = await ctx.params;
    const contentType = new URL(req.url).searchParams.get("type");
    const siteId = await getSiteId(slug);
    if (!siteId) return NextResponse.json({ error: "Site not found" }, { status: 404 });

    const db = getDb();
    let sql = "SELECT * FROM site_content WHERE site_id = ?";
    const args: (string | number | null)[] = [siteId];
    if (contentType) {
      sql += " AND content_type = ?";
      args.push(contentType);
    }
    sql += " ORDER BY sort_order ASC";

    const result = await db.execute({ sql, args });
    const rows = result.rows.map((r) => {
      const row = r as unknown as Record<string, unknown>;
      return { ...row, overrides: JSON.parse((row.overrides as string) || "{}"), hidden: !!row.hidden };
    });
    return NextResponse.json(rows);
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}

/** POST /api/sites/:slug/content — associate content with site */
export async function POST(req: NextRequest, ctx: Context) {
  try {
    const { slug } = await ctx.params;
    const siteId = await getSiteId(slug);
    if (!siteId) return NextResponse.json({ error: "Site not found" }, { status: 404 });

    const body = await req.json();
    const { content_type, content_id, overrides, sort_order } = body;
    if (!content_type || content_id == null) {
      return NextResponse.json({ error: "content_type and content_id required" }, { status: 400 });
    }

    const db = getDb();
    await db.execute({
      sql: `INSERT INTO site_content (site_id, content_type, content_id, overrides, sort_order)
            VALUES (?, ?, ?, ?, ?)
            ON CONFLICT(site_id, content_type, content_id)
            DO UPDATE SET overrides = excluded.overrides, sort_order = excluded.sort_order`,
      args: [siteId, content_type, content_id, JSON.stringify(overrides || {}), sort_order ?? 0],
    });
    return NextResponse.json({ success: true });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}

/** DELETE /api/sites/:slug/content — remove content association */
export async function DELETE(req: NextRequest, ctx: Context) {
  try {
    const { slug } = await ctx.params;
    const siteId = await getSiteId(slug);
    if (!siteId) return NextResponse.json({ error: "Site not found" }, { status: 404 });

    const { searchParams } = new URL(req.url);
    const contentType = searchParams.get("type");
    const contentId = searchParams.get("id");

    if (!contentType || !contentId) {
      return NextResponse.json({ error: "type and id required" }, { status: 400 });
    }

    const db = getDb();
    await db.execute({
      sql: "DELETE FROM site_content WHERE site_id = ? AND content_type = ? AND content_id = ?",
      args: [siteId, contentType, Number(contentId)],
    });
    return NextResponse.json({ success: true });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
