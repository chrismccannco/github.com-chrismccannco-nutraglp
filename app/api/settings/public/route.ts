import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";

const SENSITIVE_KEYS = [
  "admin_password",
  "anthropic_api_key",
  "removebg_api_key",
  "unsplash_api_key",
  "sendgrid_api_key",
  "cloudinary_api_key",
  "cloudinary_api_secret",
  "elevenlabs_api_key",
];

export async function GET() {
  try {
    const db = getDb();
    const result = await db.execute("SELECT key, value FROM site_settings");
    const settings: Record<string, string> = {};
    for (const row of result.rows) {
      const key = row.key as string;
      if (!SENSITIVE_KEYS.includes(key)) {
        settings[key] = row.value as string;
      }
    }
    return NextResponse.json(settings);
  } catch (e: unknown) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
