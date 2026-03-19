import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const db = getDb();
    const result = await db.execute({
      sql: "SELECT * FROM videos WHERE id = ?",
      args: [Number(id)],
    });
    if (result.rows.length === 0) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    // Also fetch clips
    const clips = await db.execute({
      sql: "SELECT * FROM video_clips WHERE video_id = ? ORDER BY start_time ASC",
      args: [Number(id)],
    });

    return NextResponse.json({ ...result.rows[0], clips: clips.rows });
  } catch (e: unknown) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const db = getDb();

    const fields: Record<string, unknown> = {};
    const allowed = ["title", "slug", "source_url", "transcript", "transcript_status", "duration_seconds", "voice_id", "persona_id"];
    for (const key of allowed) {
      if (body[key] !== undefined) fields[key] = body[key];
    }

    if (Object.keys(fields).length === 0) {
      return NextResponse.json({ error: "No fields to update" }, { status: 400 });
    }

    const setClauses = Object.keys(fields).map((k) => `${k} = ?`);
    const values = [...Object.values(fields), Number(id)];

    await db.execute({
      sql: `UPDATE videos SET ${setClauses.join(", ")}, updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
      args: values as (string | number | null)[],
    });

    const result = await db.execute({
      sql: "SELECT * FROM videos WHERE id = ?",
      args: [Number(id)],
    });
    return NextResponse.json(result.rows[0]);
  } catch (e: unknown) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const db = getDb();
    await db.execute({ sql: "DELETE FROM video_clips WHERE video_id = ?", args: [Number(id)] });
    const result = await db.execute({ sql: "DELETE FROM videos WHERE id = ?", args: [Number(id)] });
    if (result.rowsAffected === 0) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    return NextResponse.json({ deleted: true });
  } catch (e: unknown) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
