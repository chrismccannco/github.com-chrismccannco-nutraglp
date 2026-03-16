import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";

/**
 * POST /api/templates/install
 * Install a template — copies blocks to a new or existing page/post.
 * Body: { template_id, target_type?: "page"|"blog_post", target_slug?: string, new_title?: string }
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { template_id, target_type, target_slug, new_title } = body;

    if (!template_id) {
      return NextResponse.json({ error: "template_id required" }, { status: 400 });
    }

    const db = getDb();

    // Fetch template
    const tplResult = await db.execute({ sql: "SELECT * FROM templates WHERE id = ?", args: [template_id] });
    if (!tplResult.rows.length) {
      return NextResponse.json({ error: "Template not found" }, { status: 404 });
    }

    const tpl = tplResult.rows[0] as unknown as Record<string, unknown>;
    const blocks = (tpl.blocks as string) || "[]";

    // Increment download count
    await db.execute({
      sql: "UPDATE templates SET downloads = downloads + 1 WHERE id = ?",
      args: [template_id],
    });

    const type = target_type || "page";
    let targetId: number | null = null;

    if (target_slug) {
      // Apply blocks to existing content
      if (type === "page") {
        const existing = await db.execute({ sql: "SELECT id FROM pages WHERE slug = ?", args: [target_slug] });
        if (existing.rows.length) {
          targetId = (existing.rows[0] as unknown as { id: number }).id;
          await db.execute({
            sql: "UPDATE pages SET blocks = ?, updated_at = datetime('now') WHERE slug = ?",
            args: [blocks, target_slug],
          });
        }
      } else if (type === "blog_post") {
        const existing = await db.execute({ sql: "SELECT id FROM blog_posts WHERE slug = ?", args: [target_slug] });
        if (existing.rows.length) {
          targetId = (existing.rows[0] as unknown as { id: number }).id;
          await db.execute({
            sql: "UPDATE blog_posts SET blocks = ?, updated_at = datetime('now') WHERE slug = ?",
            args: [blocks, target_slug],
          });
        }
      }
    } else {
      // Create new page from template
      const title = new_title || (tpl.name as string);
      const slug = title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "")
        + "-" + Date.now().toString(36);

      if (type === "page") {
        const ins = await db.execute({
          sql: `INSERT INTO pages (slug, title, meta_description, content, blocks, published, updated_at)
                VALUES (?, ?, ?, '{}', ?, 0, datetime('now'))`,
          args: [slug, title, (tpl.description as string) || "", blocks],
        });
        targetId = Number(ins.lastInsertRowid);
      } else if (type === "blog_post") {
        const ins = await db.execute({
          sql: `INSERT INTO blog_posts (slug, title, description, sections, blocks, published, created_at, updated_at)
                VALUES (?, ?, ?, '[]', ?, 0, datetime('now'), datetime('now'))`,
          args: [slug, title, (tpl.description as string) || "", blocks],
        });
        targetId = Number(ins.lastInsertRowid);
      }

      // Record install
      await db.execute({
        sql: `INSERT OR IGNORE INTO template_installs (template_id, target_type, target_id)
              VALUES (?, ?, ?)`,
        args: [template_id, type, targetId],
      });

      return NextResponse.json({ success: true, target_type: type, target_id: targetId, slug });
    }

    // Record install for existing target
    if (targetId) {
      await db.execute({
        sql: `INSERT OR IGNORE INTO template_installs (template_id, target_type, target_id)
              VALUES (?, ?, ?)`,
        args: [template_id, type, targetId],
      });
    }

    return NextResponse.json({ success: true, target_type: type, target_id: targetId });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
