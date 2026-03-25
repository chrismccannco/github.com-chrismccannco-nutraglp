import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { withApiKey, corsOptions } from "@/lib/api-middleware";

export const OPTIONS = () => corsOptions();

export const GET = withApiKey("read", async (req: NextRequest) => {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  const limit = Math.min(Number(searchParams.get("limit") || 50), 100);
  const offset = Number(searchParams.get("offset") || 0);

  const db = getDb();

  if (id) {
    const result = await db.execute({
      sql: "SELECT id, filename, mime_type, size, width, height, parent_id, created_at FROM media_files WHERE id = ? AND deleted_at IS NULL",
      args: [Number(id)],
    });
    if (result.rows.length === 0) {
      return NextResponse.json({ error: "Media not found" }, { status: 404 });
    }
    const row = result.rows[0];
    return NextResponse.json(formatMedia(row, req));
  }

  const result = await db.execute({
    sql: "SELECT id, filename, mime_type, size, width, height, parent_id, created_at FROM media_files WHERE deleted_at IS NULL ORDER BY created_at DESC LIMIT ? OFFSET ?",
    args: [limit, offset],
  });

  const countResult = await db.execute(
    "SELECT COUNT(*) as total FROM media_files WHERE deleted_at IS NULL"
  );
  const total = Number(countResult.rows[0]?.total || 0);

  return NextResponse.json({
    data: result.rows.map((row) => formatMedia(row, req)),
    total,
    limit,
    offset,
  });
});

function formatMedia(row: Record<string, unknown>, req: NextRequest) {
  const origin = new URL(req.url).origin;
  const id = Number(row.id);
  return {
    id,
    filename: String(row.filename),
    mime_type: String(row.mime_type),
    size: Number(row.size),
    width: Number(row.width || 0),
    height: Number(row.height || 0),
    parent_id: row.parent_id ? Number(row.parent_id) : null,
    url: `${origin}/api/upload/${id}`,
    variants: {
      original: `${origin}/api/upload/${id}`,
      webp: `${origin}/api/upload/${id}?format=webp`,
      w640: `${origin}/api/upload/${id}?w=640`,
      w960: `${origin}/api/upload/${id}?w=960`,
      w1280: `${origin}/api/upload/${id}?w=1280`,
    },
    created_at: String(row.created_at || ""),
  };
}
