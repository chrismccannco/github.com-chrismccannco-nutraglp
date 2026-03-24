/**
 * Preview token validation.
 * Used by /preview/* server pages to gate access.
 */
import { getDb } from "./db";
import { validateSession } from "./auth";
import type { ReadonlyRequestCookies } from "next/dist/server/web/spec-extension/adapters/request-cookies";

export interface PreviewAccess {
  allowed: boolean;
  /** true when accessed via admin session (not token) */
  isAdmin: boolean;
  /** token row label if accessed via token */
  label?: string | null;
}

/**
 * Returns whether the request is allowed to view a preview.
 * Access is granted if either:
 *   1. The request carries a valid (non-expired) preview token matching the slug + type, OR
 *   2. The request has a valid admin session cookie.
 */
export async function validatePreviewAccess(
  token: string | null,
  contentType: "page" | "blog_post" | "product",
  slug: string,
  cookies: ReadonlyRequestCookies
): Promise<PreviewAccess> {
  // Admin session always grants access
  const adminToken = cookies.get("admin_token")?.value;
  if (adminToken) {
    const user = await validateSession(adminToken);
    if (user) return { allowed: true, isAdmin: true };
  }

  // Token-based access
  if (token) {
    const db = getDb();
    const result = await db.execute({
      sql: `SELECT label FROM preview_tokens
            WHERE token = ? AND content_type = ? AND slug = ? AND expires_at > datetime('now')
            LIMIT 1`,
      args: [token, contentType, slug],
    });
    if (result.rows.length > 0) {
      return { allowed: true, isAdmin: false, label: result.rows[0].label as string | null };
    }
  }

  return { allowed: false, isAdmin: false };
}
