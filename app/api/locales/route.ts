import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";

/** GET /api/locales — list all locales */
export async function GET() {
  try {
    const db = getDb();
    const result = await db.execute(
      "SELECT * FROM locales ORDER BY sort_order ASC, code ASC"
    );
    return NextResponse.json(result.rows);
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}

/** POST /api/locales — create a new locale */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { code, name, native_name, direction, is_default } = body;
    if (!code || !name || !native_name) {
      return NextResponse.json({ error: "code, name, and native_name required" }, { status: 400 });
    }

    const db = getDb();

    // If setting as default, unset existing default
    if (is_default) {
      await db.execute("UPDATE locales SET is_default = 0 WHERE is_default = 1");
    }

    // Get next sort order
    const maxSort = await db.execute("SELECT MAX(sort_order) as m FROM locales");
    const nextSort = ((maxSort.rows[0] as unknown as { m: number | null })?.m ?? -1) + 1;

    await db.execute({
      sql: `INSERT INTO locales (code, name, native_name, direction, is_default, sort_order)
            VALUES (?, ?, ?, ?, ?, ?)`,
      args: [code, name, native_name, direction || "ltr", is_default ? 1 : 0, nextSort],
    });

    return NextResponse.json({ success: true });
  } catch (e) {
    const msg = String(e);
    if (msg.includes("UNIQUE")) {
      return NextResponse.json({ error: "Locale already exists" }, { status: 409 });
    }
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
