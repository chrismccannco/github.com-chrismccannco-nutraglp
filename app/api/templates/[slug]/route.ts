import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";

type Context = { params: Promise<{ slug: string }> };

/** GET /api/templates/:slug */
export async function GET(_req: NextRequest, ctx: Context) {
  try {
    const { slug } = await ctx.params;
    const db = getDb();
    const result = await db.execute({ sql: "SELECT * FROM templates WHERE slug = ?", args: [slug] });

    if (!result.rows.length) {
      return NextResponse.json({ error: "Template not found" }, { status: 404 });
    }

    const row = result.rows[0] as unknown as Record<string, unknown>;
    return NextResponse.json({
      ...row,
      blocks: JSON.parse((row.blocks as string) || "[]"),
      theme: JSON.parse((row.theme as string) || "{}"),
      tags: JSON.parse((row.tags as string) || "[]"),
      is_premium: !!row.is_premium,
      published: !!row.published,
    });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}

/** PUT /api/templates/:slug */
export async function PUT(req: NextRequest, ctx: Context) {
  try {
    const { slug } = await ctx.params;
    const body = await req.json();
    const db = getDb();

    const fields: string[] = [];
    const args: (string | number | null)[] = [];

    const updatable: Record<string, (v: unknown) => string | number | null> = {
      name: (v) => v as string,
      description: (v) => v as string,
      category: (v) => v as string,
      thumbnail_url: (v) => v as string,
      blocks: (v) => JSON.stringify(v),
      theme: (v) => JSON.stringify(v),
      author: (v) => v as string,
      version: (v) => v as string,
      tags: (v) => JSON.stringify(v),
      is_premium: (v) => (v ? 1 : 0),
      price: (v) => v as number,
      published: (v) => (v ? 1 : 0),
    };

    for (const [key, transform] of Object.entries(updatable)) {
      if (body[key] !== undefined) {
        fields.push(`${key} = ?`);
        args.push(transform(body[key]));
      }
    }

    if (!fields.length) {
      return NextResponse.json({ error: "No fields to update" }, { status: 400 });
    }

    fields.push("updated_at = datetime('now')");
    args.push(slug);

    await db.execute({
      sql: `UPDATE templates SET ${fields.join(", ")} WHERE slug = ?`,
      args,
    });

    return NextResponse.json({ success: true });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}

/** DELETE /api/templates/:slug */
export async function DELETE(_req: NextRequest, ctx: Context) {
  try {
    const { slug } = await ctx.params;
    const db = getDb();

    // Get template id for cascade
    const tpl = await db.execute({ sql: "SELECT id FROM templates WHERE slug = ?", args: [slug] });
    if (tpl.rows.length) {
      const id = (tpl.rows[0] as unknown as { id: number }).id;
      await db.execute({ sql: "DELETE FROM template_installs WHERE template_id = ?", args: [id] });
    }

    await db.execute({ sql: "DELETE FROM templates WHERE slug = ?", args: [slug] });
    return NextResponse.json({ success: true });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
