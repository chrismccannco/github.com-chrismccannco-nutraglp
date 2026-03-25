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
  | "version_restored"
  | "user_created"
  | "user_updated"
  | "user_deleted"
  | "login"
  | "logout";

export type AuditEntityType =
  | "page"
  | "blog_post"
  | "product"
  | "media"
  | "api_key"
  | "setting"
  | "brand_voice"
  | "persona"
  | "webhook"
  | "user"
  | "session";

export interface AuditActor {
  id?: number;
  email?: string;
}

/**
 * Write an audit log entry. Fire-and-forget — never throws.
 * Pass `actor` to record which user performed the action.
 */
export function writeAudit(
  action: AuditAction,
  entityType: AuditEntityType,
  entityId: string | number | null,
  entityLabel: string | null,
  metadata?: Record<string, unknown>,
  actor?: AuditActor
): void {
  const db = getDb();
  db.execute({
    sql: "INSERT INTO audit_log (user_id, user_email, action, entity_type, entity_id, entity_label, metadata) VALUES (?, ?, ?, ?, ?, ?, ?)",
    args: [
      actor?.id ?? null,
      actor?.email ?? null,
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
