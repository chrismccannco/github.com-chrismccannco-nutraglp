/**
 * Auth utilities for multi-user admin.
 * Uses Web Crypto API (works in Edge Runtime + Node 18+).
 */

import { getDb } from "./db";

export type UserRole = "admin" | "editor" | "viewer";

export interface AdminUser {
  id: number;
  email: string;
  name: string;
  role: UserRole;
  created_at: string;
}

/* ── Password hashing ── */

async function sha256(input: string): Promise<string> {
  const data = new TextEncoder().encode(input);
  const hash = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(hash))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

const SALT = "nutraglp_admin_v1_";

export async function hashPassword(password: string): Promise<string> {
  return sha256(SALT + password);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  const computed = await hashPassword(password);
  return computed === hash;
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
  // Expire in 7 days
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();
  await db.execute({
    sql: "INSERT INTO admin_sessions (user_id, token, expires_at) VALUES (?, ?, ?)",
    args: [userId, token, expiresAt],
  });
  return token;
}

export async function validateSession(token: string): Promise<AdminUser | null> {
  if (!token) return null;
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
    args: [email, name, passwordHash, role],
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
    args: [email],
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
