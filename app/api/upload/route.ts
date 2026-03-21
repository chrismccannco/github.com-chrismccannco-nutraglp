import { getDb } from "@/lib/db";
import { getImageDimensions } from "@/lib/image";
import { NextRequest, NextResponse } from "next/server";

const ALLOWED_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/svg+xml",
];
const MAX_SIZE = 4 * 1024 * 1024; // 4MB

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const parentId = formData.get("parent_id") as string | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: "File type not allowed. Use JPEG, PNG, WebP, GIF, or SVG." },
        { status: 400 }
      );
    }

    if (file.size > MAX_SIZE) {
      return NextResponse.json(
        { error: "File too large. Maximum 4MB." },
        { status: 400 }
      );
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const base64 = buffer.toString("base64");

    // Extract dimensions from binary header
    const { width, height } = getImageDimensions(buffer, file.type);

    const db = getDb();

    const result = await db.execute({
      sql: "INSERT INTO media_files (filename, mime_type, size, width, height, data, parent_id) VALUES (?, ?, ?, ?, ?, ?, ?)",
      args: [file.name, file.type, file.size, width, height, base64, parentId ? Number(parentId) : null],
    });

    const id = Number(result.lastInsertRowid);

    return NextResponse.json({
      id,
      url: `/api/upload/${id}`,
      pathname: file.name,
      size: file.size,
      width,
      height,
      type: file.type,
    });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: "Upload failed" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const db = getDb();
    const { searchParams } = new URL(request.url);
    const showTrash = searchParams.get("trash") === "1";

    let result;
    if (showTrash) {
      result = await db.execute(
        "SELECT id, filename, mime_type, size, width, height, parent_id, deleted_at, created_at FROM media_files WHERE deleted_at IS NOT NULL ORDER BY deleted_at DESC"
      );
    } else {
      result = await db.execute(
        "SELECT id, filename, mime_type, size, width, height, parent_id, created_at FROM media_files WHERE deleted_at IS NULL ORDER BY created_at DESC"
      );
    }

    const blobs = result.rows.map((r) => ({
      url: `/api/upload/${r.id}`,
      pathname: r.filename as string,
      size: r.size as number,
      width: (r.width as number) || 0,
      height: (r.height as number) || 0,
      mimeType: r.mime_type as string,
      parentId: r.parent_id as number | null,
      deletedAt: r.deleted_at as string | null,
      uploadedAt: r.created_at as string,
    }));

    return NextResponse.json(blobs);
  } catch (error) {
    console.error("List error:", error);
    return NextResponse.json(
      { error: "Failed to list uploads" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { url, permanent } = await request.json();
    if (!url) {
      return NextResponse.json({ error: "No URL provided" }, { status: 400 });
    }

    const id = url.split("/").pop();
    if (!id) {
      return NextResponse.json({ error: "Invalid URL" }, { status: 400 });
    }

    const db = getDb();

    if (permanent) {
      // Hard delete — only from trash
      await db.execute({ sql: "DELETE FROM media_files WHERE id = ? AND deleted_at IS NOT NULL", args: [Number(id)] });
    } else {
      // Soft delete
      await db.execute({
        sql: "UPDATE media_files SET deleted_at = CURRENT_TIMESTAMP WHERE id = ?",
        args: [Number(id)],
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete error:", error);
    return NextResponse.json(
      { error: "Delete failed" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const { url, action } = await request.json();
    if (!url) {
      return NextResponse.json({ error: "No URL provided" }, { status: 400 });
    }

    const id = url.split("/").pop();
    if (!id) {
      return NextResponse.json({ error: "Invalid URL" }, { status: 400 });
    }

    const db = getDb();

    if (action === "restore") {
      await db.execute({
        sql: "UPDATE media_files SET deleted_at = NULL WHERE id = ?",
        args: [Number(id)],
      });
      return NextResponse.json({ success: true, restored: true });
    }

    return NextResponse.json({ error: "Unknown action" }, { status: 400 });
  } catch (error) {
    console.error("Patch error:", error);
    return NextResponse.json(
      { error: "Operation failed" },
      { status: 500 }
    );
  }
}
