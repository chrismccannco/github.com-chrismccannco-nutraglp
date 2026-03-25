import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { requireRole } from "@/lib/admin-auth";
import { randomBytes } from "crypto";

const DEFAULT_TTL_HOURS = 72;

/**
 * POST /api/preview/tokens
 * Body: { content_type: "page"|"blog_post"|"product", slug: string, label?: string, ttl_hours?: number }
 * Creates a shareable preview token for a content item.
 */
export async function POST(req: NextRequest) {
  const { user: actor, error: authError } = await requireRole(req, "editor");
  if (authError) return authError;

  const { content_type, slug, label, ttl_hours } = await req.json();

  if (!content_type || !slug) {
    return NextResponse.json({ error: "content_type and slug required" }, { status: 400 });
  }
  if (!["page", "blog_post", "product"].includes(content_type)) {
    return NextResponse.json({ error: "Invalid content_type" }, { status: 400 });
  }

  const ttl = Number(ttl_hours) || DEFAULT_TTL_HOURS;
  const token = randomBytes(24).toString("hex");
  const expiresAt = new Date(Date.now() + ttl * 60 * 60 * 1000).toISOString();

  const db = getDb();
  const result = await db.execute({
    sql: `INSERT INTO preview_tokens (token, content_type, slug, label, created_by_id, created_by_email, expires_at)
          VALUES (?, ?, ?, ?, ?, ?, ?)`,
    args: [token, content_type, slug, label || null, actor?.id ?? null, actor?.email ?? null, expiresAt],
  });

  return NextResponse.json({
    id: Number(result.lastInsertRowid),
    token,
    content_type,
    slug,
    label: label || null,
    expires_at: expiresAt,
    preview_url: buildPreviewUrl(content_type, slug, token),
  }, { status: 201 });
}

/**
 * GET /api/preview/tokens?slug=X&type=Y
 * Lists active tokens for a content item.
 */
export async function GET(req: NextRequest) {
  const { error: authError } = await requireRole(req, "editor");
  if (authError) return authError;

  const slug = req.nextUrl.searchParams.get("slug");
  const type = req.nextUrl.searchParams.get("type");

  if (!slug || !type) {
    return NextResponse.json({ error: "slug and type required" }, { status: 400 });
  }

  const db = getDb();
  const result = await db.execute({
    sql: `SELECT id, token, content_type, slug, label, created_by_email, expires_at, created_at
          FROM preview_tokens
          WHERE slug = ? AND content_type = ? AND expires_at > datetime('now')
          ORDER BY created_at DESC`,
    args: [slug, type],
  });

  const tokens = result.rows.map((r) => ({
    id: r.id,
    token: r.token,
    label: r.label,
    created_by_email: r.created_by_email,
    expires_at: r.expires_at,
    created_at: r.created_at,
    preview_url: buildPreviewUrl(type, slug, r.token as string),
  }));

  return NextResponse.json(tokens);
}

/**
 * DELETE /api/preview/tokens?id=X
 * Revokes a token by ID.
 */
export async function DELETE(req: NextRequest) {
  const { error: authError } = await requireRole(req, "editor");
  if (authError) return authError;

  const id = req.nextUrl.searchParams.get("id");
  if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });

  const db = getDb();
  // "Revoke" by setting expires_at to now
  await db.execute({
    sql: `UPDATE preview_tokens SET expires_at = datetime('now') WHERE id = ?`,
    args: [Number(id)],
  });

  return NextResponse.json({ revoked: true });
}

function buildPreviewUrl(contentType: string, slug: string, token: string): string {
  const base = process.env.NEXT_PUBLIC_SITE_URL || "";
  if (contentType === "blog_post") return `${base}/preview/blog/${slug}?token=${token}`;
  if (contentType === "product") return `${base}/preview/product/${slug}?token=${token}`;
  return `${base}/preview/${slug}?token=${token}`;
}
