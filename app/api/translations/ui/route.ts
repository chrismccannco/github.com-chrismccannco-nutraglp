import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";

/**
 * GET /api/translations/ui?locale=es
 * Returns all UI string translations for a locale.
 */
export async function GET(req: NextRequest) {
  try {
    const locale = new URL(req.url).searchParams.get("locale");
    if (!locale) {
      return NextResponse.json({ error: "locale required" }, { status: 400 });
    }
    const db = getDb();
    const result = await db.execute({
      sql: "SELECT key, value FROM ui_translations WHERE locale = ?",
      args: [locale],
    });
    const map: Record<string, string> = {};
    for (const row of result.rows) {
      const r = row as unknown as { key: string; value: string };
      map[r.key] = r.value;
    }
    return NextResponse.json(map);
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}

/**
 * PUT /api/translations/ui
 * Upsert UI translations. Body: { locale, strings: { key: value } }
 */
export async function PUT(req: NextRequest) {
  try {
    const { locale, strings } = await req.json();
    if (!locale || !strings) {
      return NextResponse.json({ error: "locale and strings required" }, { status: 400 });
    }
    const db = getDb();
    for (const [key, value] of Object.entries(strings)) {
      await db.execute({
        sql: `INSERT INTO ui_translations (locale, key, value, updated_at)
              VALUES (?, ?, ?, datetime('now'))
              ON CONFLICT(locale, key)
              DO UPDATE SET value = excluded.value, updated_at = datetime('now')`,
        args: [locale, key, String(value)],
      });
    }
    return NextResponse.json({ success: true });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
