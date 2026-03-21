/**
 * Audit log helpers.
 * Append-only. Every significant action writes a row.
 */

import { getDb } from "./db";

export type AuditAction =
  | "created"
  | "updated"
  | "published"
  | "unpublished"
  | "deleted"
  | "restored"
  | "api_key_created"
  | "api_key_revoked"
  | "setting_changed"
  | "media_uploaded"
  | "media_deleted"
  | "version_restored";

export type AuditEntityType =
  | "page"
  | "blog_post"
  | "product"
  | "media"
  | "api_key"
  | "setting"
  | "brand_voice"
  | "persona"
  | "webhook";

/**
 * Write an audit log entry. Fire-and-forget — never throws.
 */
export function writeAudit(
  action: AuditAction,
  entityType: AuditEntityType,
  entityId: string | number | null,
  entityLabel: string | null,
  metadata?: Record<string, unknown>
): void {
  const db = getDb();
  db.execute({
    sql: "INSERT INTO audit_log (action, entity_type, entity_id, entity_label, metadata) VALUES (?, ?, ?, ?, ?)",
    args: [
      action,
      entityType,
      entityId !== null ? String(entityId) : null,
      entityLabel,
      JSON.stringify(metadata || {}),
    ],
  }).catch((err) => {
    console.error("writeAudit failed:", err);
  });
}
