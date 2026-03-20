import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";

const TRIAL_DAYS = 7;

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

function corsJson(data: unknown, status = 200) {
  return NextResponse.json(data, { status, headers: CORS_HEADERS });
}

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: CORS_HEADERS });
}

/**
 * POST /api/trial/register
 * Body: { email }
 * Registers a new trial signup or returns existing trial info.
 */
export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    if (!email || typeof email !== "string" || !email.includes("@")) {
      return corsJson({ error: "Valid email required" }, 400);
    }

    const normalizedEmail = email.trim().toLowerCase();
    const db = getDb();

    // Ensure table exists
    await db.execute(`CREATE TABLE IF NOT EXISTS trial_signups (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE NOT NULL,
      started_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      expires_at DATETIME NOT NULL,
      active INTEGER DEFAULT 1
    )`);

    // Check if trial already exists
    const existing = await db.execute({
      sql: "SELECT * FROM trial_signups WHERE email = ?",
      args: [normalizedEmail],
    });

    if (existing.rows.length > 0) {
      const row = existing.rows[0];
      const expiresAt = new Date(String(row.expires_at));
      const now = new Date();
      const expired = now > expiresAt;
      const daysLeft = expired
        ? 0
        : Math.ceil((expiresAt.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

      return corsJson({
        email: normalizedEmail,
        started_at: row.started_at,
        expires_at: row.expires_at,
        expired,
        days_left: daysLeft,
        already_registered: true,
      });
    }

    // Create new trial
    const now = new Date();
    const expiresAt = new Date(now.getTime() + TRIAL_DAYS * 24 * 60 * 60 * 1000);

    await db.execute({
      sql: "INSERT INTO trial_signups (email, started_at, expires_at) VALUES (?, ?, ?)",
      args: [normalizedEmail, now.toISOString(), expiresAt.toISOString()],
    });

    return corsJson({
      email: normalizedEmail,
      started_at: now.toISOString(),
      expires_at: expiresAt.toISOString(),
      expired: false,
      days_left: TRIAL_DAYS,
      already_registered: false,
    });
  } catch (e: unknown) {
    return corsJson({ error: String(e) }, 500);
  }
}
