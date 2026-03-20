/**
 * API Key utilities for the public REST API.
 * Keys are prefixed with "nglp_" for easy identification.
 * Only the SHA-256 hash is stored; the raw key is shown once at creation.
 */

import { getDb } from "./db";

export type ApiPermission = "read" | "write" | "delete";

export interface ApiKey {
  id: number;
  name: string;
  key_prefix: string;
  permissions: ApiPermission[];
  rate_limit: number;
  last_used_at: string | null;
  requests_today: number;
  requests_total: number;
  created_by: number | null;
  revoked: boolean;
  revoked_at: string | null;
  created_at: string;
}

/* ── Key generation ── */

function generateRawKey(): string {
  const bytes = new Uint8Array(32);
  crypto.getRandomValues(bytes);
  const hex = Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
  return `nglp_${hex}`;
}

async function hashKey(raw: string): Promise<string> {
  const data = new TextEncoder().encode(raw);
  const hash = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(hash))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

function getPrefix(raw: string): string {
  // nglp_ + first 8 hex chars
  return raw.slice(0, 13);
}

/* ── CRUD ── */

export async function createApiKey(
  name: string,
  permissions: ApiPermission[] = ["read"],
  rateLimit: number = 1000,
  createdBy?: number
): Promise<{ key: ApiKey; rawKey: string }> {
  const raw = generateRawKey();
  const hash = await hashKey(raw);
  const prefix = getPrefix(raw);

  const db = getDb();
  const result = await db.execute({
    sql: `INSERT INTO api_keys (name, key_prefix, key_hash, permissions, rate_limit, created_by)
          VALUES (?, ?, ?, ?, ?, ?)`,
    args: [name, prefix, hash, JSON.stringify(permissions), rateLimit, createdBy ?? null],
  });

  const id = Number(result.lastInsertRowid);
  return {
    key: {
      id,
      name,
      key_prefix: prefix,
      permissions,
      rate_limit: rateLimit,
      last_used_at: null,
      requests_today: 0,
      requests_total: 0,
      created_by: createdBy ?? null,
      revoked: false,
      revoked_at: null,
      created_at: new Date().toISOString(),
    },
    rawKey: raw,
  };
}

export async function listApiKeys(): Promise<ApiKey[]> {
  const db = getDb();
  const result = await db.execute(
    "SELECT * FROM api_keys ORDER BY created_at DESC"
  );
  return result.rows.map(rowToKey);
}

export async function revokeApiKey(id: number): Promise<void> {
  const db = getDb();
  await db.execute({
    sql: "UPDATE api_keys SET revoked = 1, revoked_at = datetime('now') WHERE id = ?",
    args: [id],
  });
}

export async function deleteApiKey(id: number): Promise<void> {
  const db = getDb();
  await db.execute({ sql: "DELETE FROM api_keys WHERE id = ?", args: [id] });
}

/* ── Validation ── */

export async function validateApiKey(
  rawKey: string
): Promise<{ valid: boolean; key?: ApiKey; error?: string }> {
  if (!rawKey.startsWith("nglp_")) {
    return { valid: false, error: "Invalid key format" };
  }

  const hash = await hashKey(rawKey);
  const prefix = getPrefix(rawKey);
  const db = getDb();

  const result = await db.execute({
    sql: "SELECT * FROM api_keys WHERE key_prefix = ? AND key_hash = ?",
    args: [prefix, hash],
  });

  if (result.rows.length === 0) {
    return { valid: false, error: "Invalid API key" };
  }

  const key = rowToKey(result.rows[0]);

  if (key.revoked) {
    return { valid: false, error: "API key has been revoked" };
  }

  // Rate limit check (simple daily counter)
  if (key.requests_today >= key.rate_limit) {
    return { valid: false, error: "Rate limit exceeded" };
  }

  // Update usage stats
  await db.execute({
    sql: `UPDATE api_keys SET
            last_used_at = datetime('now'),
            requests_today = requests_today + 1,
            requests_total = requests_total + 1
          WHERE id = ?`,
    args: [key.id],
  });

  return { valid: true, key };
}

export function hasPermission(key: ApiKey, required: ApiPermission): boolean {
  return key.permissions.includes(required);
}

/* ── Reset daily counters (call from a cron or on first request of new day) ── */

export async function resetDailyCounters(): Promise<void> {
  const db = getDb();
  await db.execute("UPDATE api_keys SET requests_today = 0 WHERE requests_today > 0");
}

/* ── Helpers ── */

function rowToKey(row: Record<string, unknown>): ApiKey {
  let perms: ApiPermission[] = ["read"];
  try {
    perms = JSON.parse(String(row.permissions || '["read"]'));
  } catch {
    // default
  }
  return {
    id: Number(row.id),
    name: String(row.name),
    key_prefix: String(row.key_prefix),
    permissions: perms,
    rate_limit: Number(row.rate_limit || 1000),
    last_used_at: row.last_used_at ? String(row.last_used_at) : null,
    requests_today: Number(row.requests_today || 0),
    requests_total: Number(row.requests_total || 0),
    created_by: row.created_by ? Number(row.created_by) : null,
    revoked: Boolean(row.revoked),
    revoked_at: row.revoked_at ? String(row.revoked_at) : null,
    created_at: String(row.created_at),
  };
}
