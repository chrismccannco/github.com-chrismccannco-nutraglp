import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";

export async function GET(req: NextRequest) {
  const type = req.nextUrl.searchParams.get("type");
  const id = req.nextUrl.searchParams.get("id");

  if (!type || !id) {
    return NextResponse.json(
      { error: "type and id params required" },
      { status: 400 }
    );
  }

  try {
    const db = getDb();
    const result = await db.execute({
      sql: "SELECT * FROM content_versions WHERE content_type = ? AND content_id = ? ORDER BY created_at DESC LIMIT 50",
      args: [type, parseInt(id)],
    });

    const versions = result.rows.map((r) => ({
      id: r.id,
      content_type: r.content_type,
      content_id: r.content_id,
      version_data: JSON.parse(r.version_data as string),
      created_at: r.created_at,
      created_by: r.created_by,
    }));

    return NextResponse.json(versions);
  } catch (e: unknown) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { content_type, content_id, version_data } = await req.json();

    if (!content_type || !content_id || !version_data) {
      return NextResponse.json(
        { error: "content_type, content_id, and version_data required" },
        { status: 400 }
      );
    }

    const db = getDb();
    await db.execute({
      sql: "INSERT INTO content_versions (content_type, content_id, version_data) VALUES (?, ?, ?)",
      args: [content_type, content_id, JSON.stringify(version_data)],
    });

    return NextResponse.json({ success: true });
  } catch (e: unknown) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
