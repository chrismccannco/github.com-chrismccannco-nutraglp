import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { requireRole } from "@/lib/admin-auth";

export async function GET(req: NextRequest) {
  const { error } = await requireRole(req, "admin");
  if (error) return error;
  try {
    const db = getDb();
    const result = await db.execute("SELECT * FROM site_settings");
    const settings: Record<string, string> = {};
    for (const row of result.rows) {
      settings[row.key as string] = row.value as string;
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
      await db.execute({
        sql: `INSERT INTO site_settings (key, value) VALUES (?, ?)
              ON CONFLICT(key) DO UPDATE SET value = excluded.value`,
        args: [key, value as string],
      });
    }

    const result = await db.execute("SELECT * FROM site_settings");
    const settings: Record<string, string> = {};
    for (const row of result.rows) {
      settings[row.key as string] = row.value as string;
    }
    return NextResponse.json(settings);
  } catch (e: unknown) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
