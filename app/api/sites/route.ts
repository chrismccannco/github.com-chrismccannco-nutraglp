import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";

/** GET /api/sites — list all sites */
export async function GET() {
  try {
    const db = getDb();
    const result = await db.execute("SELECT * FROM sites ORDER BY name ASC");
    const sites = result.rows.map((row) => {
      const r = row as unknown as Record<string, unknown>;
      return {
        ...r,
        theme: JSON.parse((r.theme as string) || "{}"),
        settings: JSON.parse((r.settings as string) || "{}"),
        enabled: !!r.enabled,
      };
    });
    return NextResponse.json(sites);
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}

/** POST /api/sites — create a new site */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { slug, name, domain, theme, settings } = body;
    if (!slug || !name) {
      return NextResponse.json({ error: "slug and name required" }, { status: 400 });
    }
    const db = getDb();
    await db.execute({
      sql: `INSERT INTO sites (slug, name, domain, theme, settings)
            VALUES (?, ?, ?, ?, ?)`,
      args: [
        slug,
        name,
        domain || null,
        JSON.stringify(theme || {}),
        JSON.stringify(settings || {}),
      ],
    });
    return NextResponse.json({ success: true });
  } catch (e) {
    const msg = String(e);
    if (msg.includes("UNIQUE")) {
      return NextResponse.json({ error: "Site slug already exists" }, { status: 409 });
    }
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
