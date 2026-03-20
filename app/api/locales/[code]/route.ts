import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";

type Context = { params: Promise<{ code: string }> };

/** PUT /api/locales/:code — update locale */
export async function PUT(req: NextRequest, ctx: Context) {
  try {
    const { code } = await ctx.params;
    const body = await req.json();
    const db = getDb();

    const sets: string[] = [];
    const args: (string | number | null)[] = [];

    if (body.name !== undefined) { sets.push("name = ?"); args.push(body.name); }
    if (body.native_name !== undefined) { sets.push("native_name = ?"); args.push(body.native_name); }
    if (body.direction !== undefined) { sets.push("direction = ?"); args.push(body.direction); }
    if (body.enabled !== undefined) { sets.push("enabled = ?"); args.push(body.enabled ? 1 : 0); }
    if (body.sort_order !== undefined) { sets.push("sort_order = ?"); args.push(body.sort_order); }

    if (body.is_default) {
      await db.execute("UPDATE locales SET is_default = 0 WHERE is_default = 1");
      sets.push("is_default = 1");
    }

    if (!sets.length) {
      return NextResponse.json({ error: "No fields to update" }, { status: 400 });
    }

    args.push(code);
    await db.execute({ sql: `UPDATE locales SET ${sets.join(", ")} WHERE code = ?`, args });

    return NextResponse.json({ success: true });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}

/** DELETE /api/locales/:code — remove locale and its translations */
export async function DELETE(_req: NextRequest, ctx: Context) {
  try {
    const { code } = await ctx.params;
    const db = getDb();

    // Don't delete the default locale
    const check = await db.execute({ sql: "SELECT is_default FROM locales WHERE code = ?", args: [code] });
    if (check.rows.length && (check.rows[0] as unknown as { is_default: number }).is_default) {
      return NextResponse.json({ error: "Cannot delete the default locale" }, { status: 400 });
    }

    await db.execute({ sql: "DELETE FROM translations WHERE locale = ?", args: [code] });
    await db.execute({ sql: "DELETE FROM ui_translations WHERE locale = ?", args: [code] });
    await db.execute({ sql: "DELETE FROM locales WHERE code = ?", args: [code] });

    return NextResponse.json({ success: true });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
