import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";

export const dynamic = "force-dynamic";

/**
 * POST /api/media-tools/remove-bg
 * Body: { imageId: number, threshold?: number }
 * Returns: { id, url } of the new image with background removed
 *
 * Uses Sharp to remove solid/near-solid backgrounds by sampling corner pixels
 * and converting matching colors to transparent. Works well for product photos
 * on white/solid backgrounds. Not a neural net — keep expectations calibrated.
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { imageId, threshold = 30 } = body;

    if (!imageId) {
      return NextResponse.json({ error: "imageId is required" }, { status: 400 });
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

    const image = sharpFn(buffer);
    const metadata = await image.metadata();
    const w = metadata.width || 1;
    const h = metadata.height || 1;

    // Get raw pixel data
    const { data: rawPixels, info } = await image
      .ensureAlpha()
      .raw()
      .toBuffer({ resolveWithObject: true });

    const channels = info.channels; // 4 (RGBA)

    // Sample corner pixels to estimate background color
    const corners = [
      [0, 0],
      [w - 1, 0],
      [0, h - 1],
      [w - 1, h - 1],
    ];
    let rSum = 0, gSum = 0, bSum = 0;
    for (const [cx, cy] of corners) {
      const idx = (cy * w + cx) * channels;
      rSum += rawPixels[idx];
      gSum += rawPixels[idx + 1];
      bSum += rawPixels[idx + 2];
    }
    const bgR = Math.round(rSum / 4);
    const bgG = Math.round(gSum / 4);
    const bgB = Math.round(bSum / 4);

    // Create new pixel buffer with background pixels made transparent
    const newPixels = Buffer.from(rawPixels);
    for (let i = 0; i < newPixels.length; i += channels) {
      const r = newPixels[i];
      const g = newPixels[i + 1];
      const b = newPixels[i + 2];

      const dist = Math.sqrt(
        (r - bgR) ** 2 + (g - bgG) ** 2 + (b - bgB) ** 2
      );

      if (dist < threshold) {
        newPixels[i + 3] = 0; // fully transparent
      } else if (dist < threshold * 2) {
        // Soft edge — partial transparency
        const alpha = Math.round(((dist - threshold) / threshold) * 255);
        newPixels[i + 3] = Math.min(newPixels[i + 3], alpha);
      }
    }

    const outputBuffer = await sharpFn(newPixels, {
        raw: { width: w, height: h, channels: 4 },
      })
      .png()
      .toBuffer();

    const newBase64 = outputBuffer.toString("base64");
    const newFilename = `${(row.filename as string).replace(/\.[^.]+$/, "")}_nobg.png`;

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
