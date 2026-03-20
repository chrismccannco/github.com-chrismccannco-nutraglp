import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";

// GET /api/videos/:id/clips
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const db = getDb();
    const result = await db.execute({
      sql: "SELECT * FROM video_clips WHERE video_id = ? ORDER BY start_time ASC",
      args: [Number(id)],
    });
    return NextResponse.json(result.rows);
  } catch (e: unknown) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}

// POST /api/videos/:id/clips — create a clip
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const db = getDb();

    if (body.start_time === undefined || body.end_time === undefined || !body.transcript_segment) {
      return NextResponse.json(
        { error: "start_time, end_time, and transcript_segment are required" },
        { status: 400 }
      );
    }

    const insertResult = await db.execute({
      sql: `INSERT INTO video_clips (video_id, title, start_time, end_time, transcript_segment, platform, caption, sort_order)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      args: [
        Number(id),
        body.title || null,
        body.start_time,
        body.end_time,
        body.transcript_segment,
        body.platform || "linkedin",
        body.caption || null,
        body.sort_order || 0,
      ],
    });

    const result = await db.execute({
      sql: "SELECT * FROM video_clips WHERE id = ?",
      args: [Number(insertResult.lastInsertRowid)],
    });
    return NextResponse.json(result.rows[0], { status: 201 });
  } catch (e: unknown) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}

// PUT /api/videos/:id/clips — update a clip (pass clip id in body)
export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const db = getDb();

    if (!body.clip_id) {
      return NextResponse.json({ error: "clip_id required" }, { status: 400 });
    }

    const fields: Record<string, unknown> = {};
    const allowed = ["title", "start_time", "end_time", "transcript_segment", "platform", "caption", "status", "sort_order"];
    for (const key of allowed) {
      if (body[key] !== undefined) fields[key] = body[key];
    }

    if (Object.keys(fields).length === 0) {
      return NextResponse.json({ error: "No fields to update" }, { status: 400 });
    }

    const setClauses = Object.keys(fields).map((k) => `${k} = ?`);
    const values = [...Object.values(fields), Number(body.clip_id)];

    await db.execute({
      sql: `UPDATE video_clips SET ${setClauses.join(", ")} WHERE id = ?`,
      args: values as (string | number | null)[],
    });

    const result = await db.execute({
      sql: "SELECT * FROM video_clips WHERE id = ?",
      args: [Number(body.clip_id)],
    });
    return NextResponse.json(result.rows[0]);
  } catch (e: unknown) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}

// DELETE /api/videos/:id/clips — delete a clip (pass clip_id in body)
export async function DELETE(req: NextRequest) {
  try {
    const body = await req.json();
    if (!body.clip_id) {
      return NextResponse.json({ error: "clip_id required" }, { status: 400 });
    }
    const db = getDb();
    await db.execute({ sql: "DELETE FROM video_clips WHERE id = ?", args: [Number(body.clip_id)] });
    return NextResponse.json({ deleted: true });
  } catch (e: unknown) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
