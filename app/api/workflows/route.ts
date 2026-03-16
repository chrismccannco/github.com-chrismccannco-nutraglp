import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";

/**
 * GET /api/workflows
 * Query params:
 *   type + id  → latest workflow for a specific content item
 *   status     → list all workflows with this status (e.g. "pending_review")
 *   limit      → max results (default 50)
 */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const contentType = searchParams.get("type");
    const contentId = searchParams.get("id");
    const status = searchParams.get("status");
    const limit = Math.min(Number(searchParams.get("limit") || "50"), 200);
    const db = getDb();

    // Single content item — return latest workflow entry
    if (contentType && contentId) {
      const result = await db.execute({
        sql: `SELECT w.*,
              COALESCE(
                CASE WHEN w.content_type = 'page' THEN (SELECT title FROM pages WHERE id = w.content_id)
                     WHEN w.content_type = 'blog_post' THEN (SELECT title FROM blog_posts WHERE id = w.content_id)
                END, 'Untitled'
              ) as content_title
              FROM content_workflows w
              WHERE w.content_type = ? AND w.content_id = ?
              ORDER BY w.id DESC LIMIT 1`,
        args: [contentType, Number(contentId)],
      });
      if (result.rows.length === 0) return NextResponse.json(null);
      return NextResponse.json(result.rows[0]);
    }

    // List by status (review queue)
    if (status) {
      const result = await db.execute({
        sql: `SELECT w.*,
              COALESCE(
                CASE WHEN w.content_type = 'page' THEN (SELECT title FROM pages WHERE id = w.content_id)
                     WHEN w.content_type = 'blog_post' THEN (SELECT title FROM blog_posts WHERE id = w.content_id)
                END, 'Untitled'
              ) as content_title,
              COALESCE(
                CASE WHEN w.content_type = 'page' THEN (SELECT slug FROM pages WHERE id = w.content_id)
                     WHEN w.content_type = 'blog_post' THEN (SELECT slug FROM blog_posts WHERE id = w.content_id)
                END, ''
              ) as content_slug
              FROM content_workflows w
              WHERE w.status = ?
              ORDER BY w.submitted_at DESC
              LIMIT ?`,
        args: [status, limit],
      });
      return NextResponse.json(result.rows);
    }

    // All recent workflows
    const result = await db.execute({
      sql: `SELECT w.*,
            COALESCE(
              CASE WHEN w.content_type = 'page' THEN (SELECT title FROM pages WHERE id = w.content_id)
                   WHEN w.content_type = 'blog_post' THEN (SELECT title FROM blog_posts WHERE id = w.content_id)
              END, 'Untitled'
            ) as content_title,
            COALESCE(
              CASE WHEN w.content_type = 'page' THEN (SELECT slug FROM pages WHERE id = w.content_id)
                   WHEN w.content_type = 'blog_post' THEN (SELECT slug FROM blog_posts WHERE id = w.content_id)
              END, ''
            ) as content_slug
            FROM content_workflows w
            ORDER BY w.id DESC
            LIMIT ?`,
      args: [limit],
    });
    return NextResponse.json(result.rows);
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}

/**
 * POST /api/workflows
 * Body: { content_type, content_id, status, submitted_by, review_note? }
 *
 * Creates a new workflow entry. Used for:
 * - Submit for review (status: "pending_review")
 * - Approve (status: "approved")
 * - Reject (status: "rejected")
 * - Publish (status: "published")
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { content_type, content_id, status, submitted_by, reviewed_by, review_note } = body;

    if (!content_type || !content_id || !status) {
      return NextResponse.json(
        { error: "content_type, content_id, and status are required" },
        { status: 400 }
      );
    }

    const validStatuses = ["draft", "pending_review", "approved", "rejected", "published"];
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { error: `Invalid status. Must be one of: ${validStatuses.join(", ")}` },
        { status: 400 }
      );
    }

    const db = getDb();

    const now = new Date().toISOString();
    const isReview = status === "approved" || status === "rejected";
    const isSubmit = status === "pending_review";

    const result = await db.execute({
      sql: `INSERT INTO content_workflows
            (content_type, content_id, status, submitted_by, reviewed_by, review_note, submitted_at, reviewed_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      args: [
        content_type,
        content_id,
        status,
        submitted_by || null,
        reviewed_by || null,
        review_note || null,
        isSubmit ? now : null,
        isReview ? now : null,
      ],
    });

    // If approved or published, also update the content's published flag
    if (status === "published") {
      const table = content_type === "page" ? "pages" : content_type === "blog_post" ? "blog_posts" : null;
      if (table) {
        await db.execute({
          sql: `UPDATE ${table} SET published = 1, updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
          args: [content_id],
        });
      }
    }

    // Fetch the created row
    const created = await db.execute({
      sql: "SELECT * FROM content_workflows WHERE id = ?",
      args: [Number(result.lastInsertRowid)],
    });

    return NextResponse.json(created.rows[0], { status: 201 });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
