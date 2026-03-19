import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";

function generateSlug(title: string): string {
  return title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "").slice(0, 80);
}

export async function GET() {
  try {
    const db = getDb();
    const result = await db.execute("SELECT * FROM videos ORDER BY created_at DESC");
    return NextResponse.json(result.rows);
  } catch (e: unknown) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const db = getDb();

    if (!body.title) {
      return NextResponse.json({ error: "title is required" }, { status: 400 });
    }

    const slug = generateSlug(body.title);

    const insertResult = await db.execute({
      sql: `INSERT INTO videos (title, slug, source_url, transcript, transcript_status, voice_id, persona_id)
            VALUES (?, ?, ?, ?, ?, ?, ?)`,
      args: [
        body.title, slug,
        body.source_url || null,
        body.transcript || null,
        body.transcript ? "complete" : "pending",
        body.voice_id || null,
        body.persona_id || null,
      ],
    });

    const result = await db.execute({
      sql: "SELECT * FROM videos WHERE id = ?",
      args: [Number(insertResult.lastInsertRowid)],
    });
    return NextResponse.json(result.rows[0], { status: 201 });
  } catch (e: unknown) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
