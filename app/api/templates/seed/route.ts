import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { STARTER_TEMPLATES } from "@/lib/types/templates";

/** POST /api/templates/seed — seed starter templates (idempotent) */
export async function POST() {
  try {
    const db = getDb();
    let inserted = 0;

    for (const tpl of STARTER_TEMPLATES) {
      try {
        await db.execute({
          sql: `INSERT INTO templates (slug, name, description, category, thumbnail_url, blocks, theme, author, version, tags, is_premium, price, published)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          args: [
            tpl.slug,
            tpl.name,
            tpl.description,
            tpl.category,
            tpl.thumbnail_url,
            JSON.stringify(tpl.blocks),
            JSON.stringify(tpl.theme),
            tpl.author,
            tpl.version,
            JSON.stringify(tpl.tags),
            tpl.is_premium ? 1 : 0,
            tpl.price,
            tpl.published ? 1 : 0,
          ],
        });
        inserted++;
      } catch {
        // Slug already exists — skip
      }
    }

    return NextResponse.json({ success: true, inserted, total: STARTER_TEMPLATES.length });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
