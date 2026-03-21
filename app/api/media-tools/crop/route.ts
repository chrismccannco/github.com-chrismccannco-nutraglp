import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";

export const dynamic = "force-dynamic";

/**
 * POST /api/media-tools/crop
 * Body: { imageId: number, crop: { x: number, y: number, width: number, height: number }, outputWidth?: number, format?: string }
 * Returns: { id, url, filename, size, width, height } of the cropped image
 *
 * Crops and optionally resizes an image. Uses sharp's extract for cropping,
 * then optionally resizes to the specified outputWidth.
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { imageId, crop, outputWidth, format = "png" } = body;

    if (!imageId) {
      return NextResponse.json({ error: "imageId is required" }, { status: 400 });
    }

    if (!crop || typeof crop.x !== "number" || typeof crop.y !== "number" ||
        typeof crop.width !== "number" || typeof crop.height !== "number") {
      return NextResponse.json(
        { error: "crop object with x, y, width, height is required" },
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
        { error: "Crop is not supported for SVG files." },
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

    // Extract the cropped region
    image = image.extract({
      left: crop.x,
      top: crop.y,
      width: crop.width,
      height: crop.height,
    });

    // Optionally resize
    let finalWidth = crop.width;
    let finalHeight = crop.height;
    if (outputWidth && outputWidth > 0) {
      image = image.resize(outputWidth, undefined, { withoutEnlargement: true });
      const metadata = await image.metadata();
      finalWidth = metadata.width || crop.width;
      finalHeight = metadata.height || crop.height;
    }

    // Convert to requested format
    const mimeMap: { [key: string]: string } = {
      png: "image/png",
      jpg: "image/jpeg",
      jpeg: "image/jpeg",
      webp: "image/webp",
    };
    const outputMime = mimeMap[format.toLowerCase()] || "image/png";
    const formatMethod = format.toLowerCase() === "jpg" || format.toLowerCase() === "jpeg"
      ? "jpeg"
      : format.toLowerCase();

    const outputBuffer = await image[formatMethod]().toBuffer();

    const newBase64 = outputBuffer.toString("base64");
    const baseName = (row.filename as string).replace(/\.[^.]+$/, "");
    const newFilename = `${baseName}_cropped.${format.toLowerCase()}`;

    // Save as new media file
    const insertResult = await db.execute({
      sql: "INSERT INTO media_files (filename, mime_type, size, width, height, data) VALUES (?, ?, ?, ?, ?, ?)",
      args: [newFilename, outputMime, outputBuffer.length, finalWidth, finalHeight, newBase64],
    });

    const newId = Number(insertResult.lastInsertRowid);

    return NextResponse.json({
      id: newId,
      url: `/api/upload/${newId}`,
      filename: newFilename,
      size: outputBuffer.length,
      width: finalWidth,
      height: finalHeight,
    });
  } catch (err: unknown) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Unknown error" },
      { status: 500 }
    );
  }
}
