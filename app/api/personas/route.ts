import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";

function generateSlug(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "").slice(0, 80);
}

export async function GET() {
  try {
    const db = getDb();
    const result = await db.execute(
      "SELECT * FROM audience_personas ORDER BY is_default DESC, name ASC"
    );
    return NextResponse.json(result.rows);
  } catch (e: unknown) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const db = getDb();

    if (!body.name) {
      return NextResponse.json({ error: "name is required" }, { status: 400 });
    }

    const slug = generateSlug(body.name);
    const channels = body.channels ? JSON.stringify(body.channels) : "[]";

    const insertResult = await db.execute({
      sql: `INSERT INTO audience_personas (name, slug, description, demographics, goals, pain_points, communication_style, objections, channels, is_default)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      args: [
        body.name, slug,
        body.description || null, body.demographics || null,
        body.goals || null, body.pain_points || null,
        body.communication_style || null, body.objections || null,
        channels, body.is_default ? 1 : 0,
      ],
    });

    const result = await db.execute({
      sql: "SELECT * FROM audience_personas WHERE id = ?",
      args: [Number(insertResult.lastInsertRowid)],
    });
    return NextResponse.json(result.rows[0], { status: 201 });
  } catch (e: unknown) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
