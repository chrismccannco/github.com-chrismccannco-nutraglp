/**
 * Content versioning helpers.
 * Call createVersion() before any destructive update to snapshot the current state.
 */

import { getDb } from "./db";

export type ContentType = "page" | "blog_post" | "product";

/**
 * Save a snapshot of a content item.
 * Call this BEFORE applying an update so the version represents the previous state.
 */
export async function createVersion(
  contentType: ContentType,
  contentId: number,
  data: Record<string, unknown>,
  label?: string
): Promise<void> {
  try {
    const db = getDb();
    await db.execute({
      sql: "INSERT INTO content_versions (content_type, content_id, version_data, created_by) VALUES (?, ?, ?, ?)",
      args: [contentType, contentId, JSON.stringify({ ...data, _label: label || null }), "admin"],
    });

    // Prune old versions — keep last 50 per content item
    await db.execute({
      sql: `DELETE FROM content_versions WHERE content_type = ? AND content_id = ? AND id NOT IN (
        SELECT id FROM content_versions WHERE content_type = ? AND content_id = ? ORDER BY created_at DESC LIMIT 50
      )`,
      args: [contentType, contentId, contentType, contentId],
    });
  } catch (err) {
    // Non-critical — log but don't throw
    console.error("createVersion failed:", err);
  }
}

/**
 * Fetch version history for a content item.
 */
export async function getVersions(contentType: ContentType, contentId: number) {
  const db = getDb();
  const result = await db.execute({
    sql: "SELECT id, content_type, content_id, version_data, created_at, created_by FROM content_versions WHERE content_type = ? AND content_id = ? ORDER BY created_at DESC LIMIT 50",
    args: [contentType, contentId],
  });
  return result.rows.map((r) => ({
    id: Number(r.id),
    contentType: r.content_type as string,
    contentId: Number(r.content_id),
    data: JSON.parse(r.version_data as string),
    createdAt: r.created_at as string,
    createdBy: r.created_by as string,
  }));
}
