import { getDb } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

/**
 * GET /api/upload/versions?id=123
 * Returns the version chain for a media file — walks up to the root via parent_id,
 * then returns all descendants of that root ordered by creation date.
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "id is required" }, { status: 400 });
    }

    const db = getDb();

    // Walk up to find the root ancestor
    let rootId = Number(id);
    const visited = new Set<number>();
    while (true) {
      if (visited.has(rootId)) break; // safety: prevent cycles
      visited.add(rootId);

      const row = await db.execute({
        sql: "SELECT parent_id FROM media_files WHERE id = ?",
        args: [rootId],
      });

      if (row.rows.length === 0) break;
      const parentId = row.rows[0].parent_id as number | null;
      if (!parentId) break;
      rootId = parentId;
    }

    // Now get all files in this version chain (root + all descendants)
    // Using a recursive CTE to walk the tree
    const result = await db.execute({
      sql: `
        WITH RECURSIVE version_tree AS (
          SELECT id, filename, mime_type, size, width, height, parent_id, deleted_at, created_at
          FROM media_files WHERE id = ?
          UNION ALL
          SELECT m.id, m.filename, m.mime_type, m.size, m.width, m.height, m.parent_id, m.deleted_at, m.created_at
          FROM media_files m
          JOIN version_tree vt ON m.parent_id = vt.id
        )
        SELECT * FROM version_tree ORDER BY created_at ASC
      `,
      args: [rootId],
    });

    const versions = result.rows.map((r) => ({
      id: r.id as number,
      url: `/api/upload/${r.id}`,
      pathname: r.filename as string,
      size: r.size as number,
      width: (r.width as number) || 0,
      height: (r.height as number) || 0,
      mimeType: r.mime_type as string,
      parentId: r.parent_id as number | null,
      deletedAt: r.deleted_at as string | null,
      createdAt: r.created_at as string,
    }));

    return NextResponse.json({ rootId, versions });
  } catch (error) {
    console.error("Version history error:", error);
    return NextResponse.json(
      { error: "Failed to load version history" },
      { status: 500 }
    );
  }
}
