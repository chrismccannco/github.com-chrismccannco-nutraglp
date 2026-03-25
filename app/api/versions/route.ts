import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { createVersion, type ContentType } from "@/lib/versions";
import { writeAudit } from "@/lib/audit";
import { requireRole } from "@/lib/admin-auth";

export async function GET(req: NextRequest) {
  const type = req.nextUrl.searchParams.get("type");
  const id = req.nextUrl.searchParams.get("id");

  if (!type || !id) {
    return NextResponse.json(
      { error: "type and id params required" },
      { status: 400 }
    );
  }

  try {
    const db = getDb();
    const result = await db.execute({
      sql: "SELECT * FROM content_versions WHERE content_type = ? AND content_id = ? ORDER BY created_at DESC LIMIT 50",
      args: [type, parseInt(id)],
    });

    const versions = result.rows.map((r) => ({
      id: r.id,
      content_type: r.content_type,
      content_id: r.content_id,
      version_data: JSON.parse(r.version_data as string),
      created_at: r.created_at,
      created_by: r.created_by,
    }));

    return NextResponse.json(versions);
  } catch (e: unknown) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { content_type, content_id, version_data } = await req.json();

    if (!content_type || !content_id || !version_data) {
      return NextResponse.json(
        { error: "content_type, content_id, and version_data required" },
        { status: 400 }
      );
    }

    const db = getDb();
    await db.execute({
      sql: "INSERT INTO content_versions (content_type, content_id, version_data) VALUES (?, ?, ?)",
      args: [content_type, content_id, JSON.stringify(version_data)],
    });

    return NextResponse.json({ success: true });
  } catch (e: unknown) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}

/**
 * PUT /api/versions — restore a specific version
 * Body: { version_id: number }
 *
 * Looks up the version, determines the content type, applies the snapshot
 * back to the live table, and writes an audit entry.
 */
export async function PUT(req: NextRequest) {
  const { user: actor, error: authError } = await requireRole(req, "editor");
  if (authError) return authError;
  try {
    const { version_id } = await req.json();
    if (!version_id) {
      return NextResponse.json({ error: "version_id required" }, { status: 400 });
    }

    const db = getDb();

    // Load the version snapshot
    const vResult = await db.execute({
      sql: "SELECT * FROM content_versions WHERE id = ?",
      args: [Number(version_id)],
    });
    if (vResult.rows.length === 0) {
      return NextResponse.json({ error: "Version not found" }, { status: 404 });
    }

    const v = vResult.rows[0];
    const contentType = v.content_type as ContentType;
    const contentId = Number(v.content_id);
    const data = JSON.parse(v.version_data as string);

    // Fetch current live state so we can snapshot it first
    const tableMap: Record<ContentType, string> = {
      page: "pages",
      blog_post: "blog_posts",
      product: "products",
    };
    const table = tableMap[contentType];
    if (!table) {
      return NextResponse.json({ error: "Unsupported content type" }, { status: 400 });
    }

    const liveResult = await db.execute({
      sql: `SELECT * FROM ${table} WHERE id = ?`,
      args: [contentId],
    });
    if (liveResult.rows.length === 0) {
      return NextResponse.json({ error: "Content not found" }, { status: 404 });
    }

    // Snapshot current state before overwriting
    const live = liveResult.rows[0];
    await createVersion(contentType, contentId, live as unknown as Record<string, unknown>, "pre-restore");

    // Apply the restored snapshot — only restore safe content fields
    if (contentType === "page") {
      await db.execute({
        sql: "UPDATE pages SET title = ?, meta_title = ?, meta_description = ?, og_image = ?, content = ?, blocks = ?, published = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?",
        args: [data.title ?? live.title, data.meta_title ?? live.meta_title, data.meta_description ?? live.meta_description, data.og_image ?? live.og_image, data.content ?? live.content, data.blocks ?? live.blocks, data.published ?? live.published, contentId],
      });
    } else if (contentType === "blog_post") {
      await db.execute({
        sql: "UPDATE blog_posts SET title = ?, description = ?, date = ?, sections = ?, blocks = ?, featured_image = ?, published = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?",
        args: [data.title ?? live.title, data.description ?? live.description, data.date ?? live.date, data.sections ?? live.sections, data.blocks ?? live.blocks, data.featured_image ?? live.featured_image, data.published ?? live.published, contentId],
      });
    } else if (contentType === "product") {
      await db.execute({
        sql: "UPDATE products SET name = ?, tagline = ?, price = ?, description = ?, features = ?, status = ?, published = ? WHERE id = ?",
        args: [data.name ?? live.name, data.tagline ?? live.tagline, data.price ?? live.price, data.description ?? live.description, data.features ?? live.features, data.status ?? live.status, data.published ?? live.published, contentId],
      });
    }

    // Audit
    writeAudit("version_restored", contentType as "page" | "blog_post" | "product", String(contentId), String(live.title ?? live.name ?? contentId), { version_id, restored_at: v.created_at }, actor ?? undefined);

    return NextResponse.json({ success: true, restored: true, version_id, content_type: contentType, content_id: contentId });
  } catch (e: unknown) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
