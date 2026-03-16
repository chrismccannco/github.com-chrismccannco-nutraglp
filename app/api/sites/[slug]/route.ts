import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";

type Context = { params: Promise<{ slug: string }> };

/** GET /api/sites/:slug */
export async function GET(_req: NextRequest, ctx: Context) {
  try {
    const { slug } = await ctx.params;
    const db = getDb();
    const result = await db.execute({ sql: "SELECT * FROM sites WHERE slug = ?", args: [slug] });
    if (!result.rows.length) {
      return NextResponse.json({ error: "Site not found" }, { status: 404 });
    }
    const r = result.rows[0] as unknown as Record<string, unknown>;
    return NextResponse.json({
      ...r,
      theme: JSON.parse((r.theme as string) || "{}"),
      settings: JSON.parse((r.settings as string) || "{}"),
      enabled: !!r.enabled,
    });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}

/** PUT /api/sites/:slug — update site */
export async function PUT(req: NextRequest, ctx: Context) {
  try {
    const { slug } = await ctx.params;
    const body = await req.json();
    const db = getDb();

    const sets: string[] = [];
    const args: (string | number | null)[] = [];

    if (body.name !== undefined) { sets.push("name = ?"); args.push(body.name); }
    if (body.domain !== undefined) { sets.push("domain = ?"); args.push(body.domain || null); }
    if (body.logo_url !== undefined) { sets.push("logo_url = ?"); args.push(body.logo_url || null); }
    if (body.favicon_url !== undefined) { sets.push("favicon_url = ?"); args.push(body.favicon_url || null); }
    if (body.theme !== undefined) { sets.push("theme = ?"); args.push(JSON.stringify(body.theme)); }
    if (body.settings !== undefined) { sets.push("settings = ?"); args.push(JSON.stringify(body.settings)); }
    if (body.enabled !== undefined) { sets.push("enabled = ?"); args.push(body.enabled ? 1 : 0); }

    if (!sets.length) {
      return NextResponse.json({ error: "No fields to update" }, { status: 400 });
    }

    sets.push("updated_at = datetime('now')");
    args.push(slug);

    await db.execute({ sql: `UPDATE sites SET ${sets.join(", ")} WHERE slug = ?`, args });
    return NextResponse.json({ success: true });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}

/** DELETE /api/sites/:slug */
export async function DELETE(_req: NextRequest, ctx: Context) {
  try {
    const { slug } = await ctx.params;
    const db = getDb();

    // Get site ID first
    const site = await db.execute({ sql: "SELECT id FROM sites WHERE slug = ?", args: [slug] });
    if (site.rows.length) {
      const siteId = (site.rows[0] as unknown as { id: number }).id;
      await db.execute({ sql: "DELETE FROM site_content WHERE site_id = ?", args: [siteId] });
    }
    await db.execute({ sql: "DELETE FROM sites WHERE slug = ?", args: [slug] });

    return NextResponse.json({ success: true });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
