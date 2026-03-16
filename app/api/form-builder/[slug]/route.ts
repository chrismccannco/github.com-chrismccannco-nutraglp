import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";

interface RouteContext {
  params: Promise<{ slug: string }>;
}

/** GET /api/form-builder/:slug — get form by slug */
export async function GET(_req: NextRequest, ctx: RouteContext) {
  try {
    const { slug } = await ctx.params;
    const db = getDb();
    const result = await db.execute({
      sql: "SELECT * FROM forms WHERE slug = ?",
      args: [slug],
    });

    if (!result.rows.length) {
      return NextResponse.json({ error: "Form not found" }, { status: 404 });
    }

    const row = result.rows[0] as unknown as Record<string, unknown>;
    return NextResponse.json({
      ...row,
      fields: JSON.parse((row.fields as string) || "[]"),
      settings: JSON.parse((row.settings as string) || "{}"),
      published: row.published !== 0,
    });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}

/** PUT /api/form-builder/:slug — update form */
export async function PUT(req: NextRequest, ctx: RouteContext) {
  try {
    const { slug } = await ctx.params;
    const body = await req.json();
    const { name, description, fields, settings, published } = body;

    const db = getDb();

    const sets: string[] = [];
    const args: (string | number | null)[] = [];

    if (name !== undefined) {
      sets.push("name = ?");
      args.push(name);
    }
    if (description !== undefined) {
      sets.push("description = ?");
      args.push(description);
    }
    if (fields !== undefined) {
      sets.push("fields = ?");
      args.push(JSON.stringify(fields));
    }
    if (settings !== undefined) {
      sets.push("settings = ?");
      args.push(JSON.stringify(settings));
    }
    if (published !== undefined) {
      sets.push("published = ?");
      args.push(published ? 1 : 0);
    }
    sets.push("updated_at = datetime('now')");
    args.push(slug);

    await db.execute({
      sql: `UPDATE forms SET ${sets.join(", ")} WHERE slug = ?`,
      args,
    });

    // Return updated form
    const result = await db.execute({
      sql: "SELECT * FROM forms WHERE slug = ?",
      args: [slug],
    });

    const row = result.rows[0] as unknown as Record<string, unknown>;
    return NextResponse.json({
      ...row,
      fields: JSON.parse((row.fields as string) || "[]"),
      settings: JSON.parse((row.settings as string) || "{}"),
      published: row.published !== 0,
    });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}

/** DELETE /api/form-builder/:slug — delete form */
export async function DELETE(_req: NextRequest, ctx: RouteContext) {
  try {
    const { slug } = await ctx.params;
    const db = getDb();

    // Get form ID first
    const form = await db.execute({
      sql: "SELECT id FROM forms WHERE slug = ?",
      args: [slug],
    });

    if (!form.rows.length) {
      return NextResponse.json({ error: "Form not found" }, { status: 404 });
    }

    const formId = (form.rows[0] as unknown as Record<string, unknown>).id;

    // Delete submissions
    await db.execute({
      sql: "DELETE FROM form_submissions WHERE form_id = ?",
      args: [formId as number],
    });

    // Delete form
    await db.execute({
      sql: "DELETE FROM forms WHERE slug = ?",
      args: [slug],
    });

    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
