import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { requireRole } from "@/lib/admin-auth";
import { encryptApiKey, decryptApiKey } from "@/lib/auth";

// Keys whose values are encrypted at rest (AES-GCM via ENCRYPTION_KEY env var)
const SENSITIVE_KEYS = new Set([
  "admin_password",
  "anthropic_api_key",
  "openai_api_key",
  "gemini_api_key",
  "perplexity_api_key",
  "removebg_api_key",
  "unsplash_api_key",
  "sendgrid_api_key",
  "cloudinary_api_key",
  "cloudinary_api_secret",
  "elevenlabs_api_key",
]);

export async function GET(req: NextRequest) {
  const { error } = await requireRole(req, "admin");
  if (error) return error;
  try {
    const db = getDb();
    const result = await db.execute("SELECT * FROM site_settings");
    const settings: Record<string, string> = {};
    for (const row of result.rows) {
      const key = row.key as string;
      const raw = row.value as string;
      // Decrypt sensitive values before returning to admin UI
      settings[key] = SENSITIVE_KEYS.has(key) ? await decryptApiKey(raw) : raw;
    }
    return NextResponse.json(settings);
  } catch (e: unknown) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  const { error } = await requireRole(req, "admin");
  if (error) return error;
  try {
    const body = await req.json();
    const db = getDb();

    for (const [key, value] of Object.entries(body)) {
      // Encrypt sensitive values before storing
      const stored = SENSITIVE_KEYS.has(key)
        ? await encryptApiKey(value as string)
        : (value as string);
      await db.execute({
        sql: `INSERT INTO site_settings (key, value) VALUES (?, ?)
              ON CONFLICT(key) DO UPDATE SET value = excluded.value`,
        args: [key, stored],
      });
    }

    const result = await db.execute("SELECT * FROM site_settings");
    const settings: Record<string, string> = {};
    for (const row of result.rows) {
      const key = row.key as string;
      const raw = row.value as string;
      settings[key] = SENSITIVE_KEYS.has(key) ? await decryptApiKey(raw) : raw;
    }
    return NextResponse.json(settings);
  } catch (e: unknown) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
