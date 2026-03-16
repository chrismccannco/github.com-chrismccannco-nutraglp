import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";

/**
 * GET /api/translations?type=page&id=1&locale=es
 * Returns translations for a content item. If locale is omitted, returns all locales.
 */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const type = searchParams.get("type");
    const id = searchParams.get("id");
    const locale = searchParams.get("locale");

    if (!type || !id) {
      return NextResponse.json({ error: "type and id required" }, { status: 400 });
    }

    const db = getDb();
    let result;
    if (locale) {
      result = await db.execute({
        sql: "SELECT * FROM translations WHERE content_type = ? AND content_id = ? AND locale = ?",
        args: [type, Number(id), locale],
      });
    } else {
      result = await db.execute({
        sql: "SELECT * FROM translations WHERE content_type = ? AND content_id = ?",
        args: [type, Number(id)],
      });
    }

    // Group by locale
    const grouped: Record<string, Record<string, { value: string; auto: boolean }>> = {};
    for (const row of result.rows) {
      const r = row as unknown as { locale: string; field_name: string; value: string; auto_translated: number };
      if (!grouped[r.locale]) grouped[r.locale] = {};
      grouped[r.locale][r.field_name] = { value: r.value, auto: !!r.auto_translated };
    }

    return NextResponse.json(grouped);
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}

/**
 * PUT /api/translations
 * Upsert translations for a content item.
 * Body: { type, id, locale, fields: { field_name: value } }
 */
export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { type, id, locale, fields, auto } = body;

    if (!type || !id || !locale || !fields) {
      return NextResponse.json({ error: "type, id, locale, and fields required" }, { status: 400 });
    }

    const db = getDb();
    for (const [fieldName, value] of Object.entries(fields)) {
      await db.execute({
        sql: `INSERT INTO translations (content_type, content_id, locale, field_name, value, auto_translated, updated_at)
              VALUES (?, ?, ?, ?, ?, ?, datetime('now'))
              ON CONFLICT(content_type, content_id, locale, field_name)
              DO UPDATE SET value = excluded.value, auto_translated = excluded.auto_translated, updated_at = datetime('now')`,
        args: [type, Number(id), locale, fieldName, String(value), auto ? 1 : 0],
      });
    }

    return NextResponse.json({ success: true });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}

/**
 * DELETE /api/translations?type=page&id=1&locale=es
 * Delete all translations for a content item in a locale.
 */
export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const type = searchParams.get("type");
    const id = searchParams.get("id");
    const locale = searchParams.get("locale");

    if (!type || !id || !locale) {
      return NextResponse.json({ error: "type, id, and locale required" }, { status: 400 });
    }

    const db = getDb();
    await db.execute({
      sql: "DELETE FROM translations WHERE content_type = ? AND content_id = ? AND locale = ?",
      args: [type, Number(id), locale],
    });

    return NextResponse.json({ success: true });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
