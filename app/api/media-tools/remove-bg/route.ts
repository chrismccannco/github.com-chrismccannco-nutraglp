import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";

export const dynamic = "force-dynamic";
export const maxDuration = 30;

/**
 * POST /api/media-tools/remove-bg
 * Body: { imageId: number }
 *
 * Uses remove.bg API for production-quality background removal.
 * Free tier: 50 images/month. Set REMOVE_BG_API_KEY env var.
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { imageId } = body;

    if (!imageId) {
      return NextResponse.json({ error: "imageId is required" }, { status: 400 });
    }

    const apiKey = process.env.REMOVE_BG_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "Background removal is not configured. Set REMOVE_BG_API_KEY in environment variables." },
        { status: 503 }
      );
    }

    const db = getDb();
    const result = await db.execute({
      sql: "SELECT data, mime_type, filename, width, height FROM media_files WHERE id = ?",
      args: [Number(imageId)],
    });

    if (result.rows.length === 0) {
      return NextResponse.json({ error: "Image not found" }, { status: 404 });
    }

    const row = result.rows[0];
    const mimeType = row.mime_type as string;

    if (mimeType === "image/svg+xml" || mimeType === "image/gif") {
      return NextResponse.json(
        { error: "Background removal is not supported for SVG or GIF files." },
        { status: 400 }
      );
    }

    const buffer = Buffer.from(row.data as string, "base64");

    // Call remove.bg API
    const formData = new FormData();
    formData.append("image_file", new Blob([buffer], { type: mimeType }), "image.png");
    formData.append("size", "auto");

    const bgRes = await fetch("https://api.remove.bg/v1.0/removebg", {
      method: "POST",
      headers: {
        "X-Api-Key": apiKey,
      },
      body: formData,
    });

    if (!bgRes.ok) {
      const errBody = await bgRes.json().catch(() => ({}));
      const errMsg = (errBody as Record<string, unknown[]>).errors
        ? ((errBody as Record<string, unknown[]>).errors[0] as Record<string, string>)?.title || "remove.bg API error"
        : `remove.bg returned ${bgRes.status}`;
      return NextResponse.json({ error: errMsg }, { status: 502 });
    }

    const outputBuffer = Buffer.from(await bgRes.arrayBuffer());

    // Get dimensions
    let width = row.width as number;
    let height = row.height as number;
    try {
      const sharp = (await import("sharp")).default;
      const meta = await sharp(outputBuffer).metadata();
      width = meta.width || width;
      height = meta.height || height;
    } catch {
      // Fall back to original dimensions
    }

    const newBase64 = outputBuffer.toString("base64");
    const newFilename = `${(row.filename as string).replace(/\.[^.]+$/, "")}_nobg.png`;

    const insertResult = await db.execute({
      sql: "INSERT INTO media_files (filename, mime_type, size, width, height, data, parent_id) VALUES (?, ?, ?, ?, ?, ?, ?)",
      args: [newFilename, "image/png", outputBuffer.length, width, height, newBase64, Number(imageId)],
    });

    const newId = Number(insertResult.lastInsertRowid);

    return NextResponse.json({
      id: newId,
      url: `/api/upload/${newId}`,
      filename: newFilename,
      size: outputBuffer.length,
      width,
      height,
    });
  } catch (err: unknown) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Unknown error" },
      { status: 500 }
    );
  }
}
