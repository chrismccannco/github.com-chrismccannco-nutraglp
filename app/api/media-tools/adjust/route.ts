import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";

export const dynamic = "force-dynamic";

/**
 * POST /api/media-tools/adjust
 * Body: { imageId: number, brightness?: number (0.5-2.0, default 1), contrast?: number (0.5-2.0, default 1), sharpen?: boolean }
 * Returns: { id, url, filename, size, width, height } of the adjusted image
 *
 * Adjusts image brightness, contrast, and sharpness. All adjustments are optional.
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { imageId, brightness = 1, contrast = 1, sharpen = false } = body;

    if (!imageId) {
      return NextResponse.json({ error: "imageId is required" }, { status: 400 });
    }

    // Validate ranges
    if (brightness < 0.5 || brightness > 2.0) {
      return NextResponse.json(
        { error: "brightness must be between 0.5 and 2.0" },
        { status: 400 }
      );
    }

    if (contrast < 0.5 || contrast > 2.0) {
      return NextResponse.json(
        { error: "contrast must be between 0.5 and 2.0" },
        { status: 400 }
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

    if (mimeType === "image/svg+xml") {
      return NextResponse.json(
        { error: "Adjustments are not supported for SVG files." },
        { status: 400 }
      );
    }

    const buffer = Buffer.from(row.data as string, "base64");

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let sharpFn: any;
    try {
      const mod = await import("sharp");
      sharpFn = mod.default;
    } catch {
      return NextResponse.json(
        { error: "Sharp is not available in this environment." },
        { status: 500 }
      );
    }

    let image = sharpFn(buffer);
    const metadata = await image.metadata();
    const w = metadata.width || 1;
    const h = metadata.height || 1;

    // Apply brightness adjustment via modulate
    if (brightness !== 1) {
      image = image.modulate({ brightness });
    }

    // Apply contrast adjustment via linear function
    if (contrast !== 1) {
      image = image.linear(contrast, -(128 * (contrast - 1)));
    }

    // Apply sharpening if requested
    if (sharpen) {
      image = image.sharpen({ sigma: 1.5 });
    }

    const outputBuffer = await image.png().toBuffer();

    const newBase64 = outputBuffer.toString("base64");
    const baseName = (row.filename as string).replace(/\.[^.]+$/, "");
    const newFilename = `${baseName}_edited.png`;

    // Save as new media file
    const insertResult = await db.execute({
      sql: "INSERT INTO media_files (filename, mime_type, size, width, height, data) VALUES (?, ?, ?, ?, ?, ?)",
      args: [newFilename, "image/png", outputBuffer.length, w, h, newBase64],
    });

    const newId = Number(insertResult.lastInsertRowid);

    return NextResponse.json({
      id: newId,
      url: `/api/upload/${newId}`,
      filename: newFilename,
      size: outputBuffer.length,
      width: w,
      height: h,
    });
  } catch (err: unknown) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Unknown error" },
      { status: 500 }
    );
  }
}
