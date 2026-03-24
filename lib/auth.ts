/**
 * Auth utilities for multi-user admin.
 * - Passwords: bcrypt (cost 12)
 * - Sessions: random 32-byte tokens stored in DB with expiry
 * - API keys: AES-GCM encryption at rest
 * - Rate limiting: DB-backed, 5 failures / 15 min per IP+email
 */

import bcrypt from "bcryptjs";
import { getDb } from "./db";

export type UserRole = "admin" | "editor" | "viewer";

export interface AdminUser {
  id: number;
  email: string;
  name: string;
  role: UserRole;
  created_at: string;
}

/* ── Password hashing (bcrypt, cost 12) ── */

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

export async function verifyPassword(
  password: string,
  hash: string
): Promise<boolean> {
  // Detect legacy SHA-256 hashes (64-char hex, no $2 prefix)
  if (hash.length === 64 && !hash.startsWith("$2")) {
    const data = new TextEncoder().encode("nutraglp_admin_v1_" + password);
    const buf = await crypto.subtle.digest("SHA-256", data);
    const legacy = Array.from(new Uint8Array(buf))
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");
    return legacy === hash;
  }
  return bcrypt.compare(password, hash);
}

/* ── Session management ── */

export function generateToken(): string {
  const bytes = new Uint8Array(32);
  crypto.getRandomValues(bytes);
  return Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export async function createSession(userId: number): Promise<string> {
  const token = generateToken();
  const db = getDb();
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();
  await db.execute({
    sql: "INSERT INTO admin_sessions (user_id, token, expires_at) VALUES (?, ?, ?)",
    args: [userId, token, expiresAt],
  });
  return token;
}

export async function validateSession(token: string): Promise<AdminUser | null> {
  if (!token || token.length !== 64) return null;
  const db = getDb();
  const result = await db.execute({
    sql: `SELECT u.id, u.email, u.name, u.role, u.created_at
          FROM admin_sessions s
          JOIN admin_users u ON u.id = s.user_id
          WHERE s.token = ? AND s.expires_at > datetime('now')`,
    args: [token],
  });
  if (result.rows.length === 0) return null;
  const row = result.rows[0];
  return {
    id: Number(row.id),
    email: String(row.email),
    name: String(row.name),
    role: String(row.role) as UserRole,
    created_at: String(row.created_at),
  };
}

export async function deleteSession(token: string): Promise<void> {
  const db = getDb();
  await db.execute({ sql: "DELETE FROM admin_sessions WHERE token = ?", args: [token] });
}

/* ── Rate limiting (5 failures / 15 min per ip+email) ── */

const RATE_LIMIT_MAX = 5;
const RATE_LIMIT_WINDOW_MIN = 15;

async function ensureLoginAttemptsTable(): Promise<void> {
  const db = getDb();
  await db.execute(`
    CREATE TABLE IF NOT EXISTS login_attempts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      ip TEXT NOT NULL,
      email TEXT NOT NULL,
      attempted_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);
}

export async function checkRateLimit(
  ip: string,
  email: string
): Promise<{ allowed: boolean; remaining: number }> {
  await ensureLoginAttemptsTable();
  const db = getDb();
  const windowStart = new Date(
    Date.now() - RATE_LIMIT_WINDOW_MIN * 60 * 1000
  ).toISOString();
  const result = await db.execute({
    sql: `SELECT COUNT(*) as count FROM login_attempts
          WHERE ip = ? AND email = ? AND attempted_at > ?`,
    args: [ip, email.toLowerCase(), windowStart],
  });
  const attempts = Number(result.rows[0].count);
  return {
    allowed: attempts < RATE_LIMIT_MAX,
    remaining: Math.max(0, RATE_LIMIT_MAX - attempts),
  };
}

export async function recordFailedAttempt(ip: string, email: string): Promise<void> {
  await ensureLoginAttemptsTable();
  const db = getDb();
  await db.execute({
    sql: "INSERT INTO login_attempts (ip, email) VALUES (?, ?)",
    args: [ip, email.toLowerCase()],
  });
}

export async function clearLoginAttempts(ip: string, email: string): Promise<void> {
  const db = getDb();
  await db.execute({
    sql: "DELETE FROM login_attempts WHERE ip = ? AND email = ?",
    args: [ip, email.toLowerCase()],
  });
}

/* ── API key encryption (AES-GCM) ── */

function getEncryptionKey(): string {
  const key = process.env.ENCRYPTION_KEY;
  if (!key || key.length < 32) {
    if (process.env.NODE_ENV === "production") {
      console.error("[auth] ENCRYPTION_KEY not set — API keys are not encrypted at rest");
    }
    return "dev-fallback-key-not-for-production!!";
  }
  return key;
}

async function importAesKey(rawKey: string): Promise<CryptoKey> {
  const keyBytes = new TextEncoder().encode(rawKey.slice(0, 32).padEnd(32, "0"));
  return crypto.subtle.importKey("raw", keyBytes, { name: "AES-GCM" }, false, [
    "encrypt",
    "decrypt",
  ]);
}

export async function encryptApiKey(plaintext: string): Promise<string> {
  if (!plaintext) return "";
  const key = await importAesKey(getEncryptionKey());
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const encoded = new TextEncoder().encode(plaintext);
  const ciphertext = await crypto.subtle.encrypt({ name: "AES-GCM", iv }, key, encoded);
  const combined = new Uint8Array(iv.byteLength + ciphertext.byteLength);
  combined.set(iv, 0);
  combined.set(new Uint8Array(ciphertext), iv.byteLength);
  return "enc:" + Buffer.from(combined).toString("base64");
}

export async function decryptApiKey(stored: string): Promise<string> {
  if (!stored) return "";
  if (!stored.startsWith("enc:")) return stored; // legacy plaintext passthrough
  const key = await importAesKey(getEncryptionKey());
  const combined = Buffer.from(stored.slice(4), "base64");
  const iv = combined.subarray(0, 12);
  const ciphertext = combined.subarray(12);
  try {
    const plaintext = await crypto.subtle.decrypt({ name: "AES-GCM", iv }, key, ciphertext);
    return new TextDecoder().decode(plaintext);
  } catch {
    return "";
  }
}

/* ── User CRUD ── */

export async function createUser(
  email: string,
  name: string,
  password: string,
  role: UserRole
): Promise<number> {
  const db = getDb();
  const passwordHash = await hashPassword(password);
  const result = await db.execute({
    sql: "INSERT INTO admin_users (email, name, password_hash, role) VALUES (?, ?, ?, ?)",
    args: [email.toLowerCase(), name, passwordHash, role],
  });
  return Number(result.lastInsertRowid);
}

export async function getUsers(): Promise<AdminUser[]> {
  const db = getDb();
  const result = await db.execute(
    "SELECT id, email, name, role, created_at FROM admin_users ORDER BY id"
  );
  return result.rows.map((row) => ({
    id: Number(row.id),
    email: String(row.email),
    name: String(row.name),
    role: String(row.role) as UserRole,
    created_at: String(row.created_at),
  }));
}

export async function getUserByEmail(email: string) {
  const db = getDb();
  const result = await db.execute({
    sql: "SELECT id, email, name, role, password_hash, created_at FROM admin_users WHERE email = ?",
    args: [email.toLowerCase()],
  });
  if (result.rows.length === 0) return null;
  const row = result.rows[0];
  return {
    id: Number(row.id),
    email: String(row.email),
    name: String(row.name),
    role: String(row.role) as UserRole,
    password_hash: String(row.password_hash),
    created_at: String(row.created_at),
  };
}

export async function updateUser(
  id: number,
  updates: { name?: string; role?: UserRole; password?: string }
): Promise<void> {
  const db = getDb();
  if (updates.name) {
    await db.execute({ sql: "UPDATE admin_users SET name = ? WHERE id = ?", args: [updates.name, id] });
  }
  if (updates.role) {
    await db.execute({ sql: "UPDATE admin_users SET role = ? WHERE id = ?", args: [updates.role, id] });
  }
  if (updates.password) {
    const hash = await hashPassword(updates.password);
    await db.execute({ sql: "UPDATE admin_users SET password_hash = ? WHERE id = ?", args: [hash, id] });
  }
}

export async function deleteUser(id: number): Promise<void> {
  const db = getDb();
  await db.execute({ sql: "DELETE FROM admin_sessions WHERE user_id = ?", args: [id] });
  await db.execute({ sql: "DELETE FROM admin_users WHERE id = ?", args: [id] });
}

/* ── Role checks ── */

export function canManageUsers(role: UserRole): boolean {
  return role === "admin";
}

export function canEditContent(role: UserRole): boolean {
  return role === "admin" || role === "editor";
}

export function canManageSettings(role: UserRole): boolean {
  return role === "admin";
}
