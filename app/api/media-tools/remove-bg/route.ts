import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";

export const dynamic = "force-dynamic";

// Increase timeout — ML model needs time on first run (downloads ~30MB ONNX model)
export const maxDuration = 60;

/**
 * POST /api/media-tools/remove-bg
 * Body: { imageId: number }
 * Returns: { id, url, filename, size, width, height } of the new image with background removed
 *
 * Uses @imgly/background-removal-node (U2-Net ONNX model) for proper
 * ML-based segmentation. Replaces the old corner-sampling heuristic.
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { imageId } = body;

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

    // Use ML-based background removal
    let removeBackground: (input: Blob, config?: Record<string, unknown>) => Promise<Blob>;
    try {
      const mod = await import("@imgly/background-removal-node");
      removeBackground = mod.removeBackground;
    } catch {
      return NextResponse.json(
        { error: "@imgly/background-removal-node is not available." },
        { status: 500 }
      );
    }

    // Convert buffer to Blob for the library
    const inputBlob = new Blob([buffer], { type: mimeType });

    const resultBlob = await removeBackground(inputBlob, {
      model: "medium",
      output: { format: "image/png", quality: 0.9 },
    });

    const outputBuffer = Buffer.from(await resultBlob.arrayBuffer());

    // Get dimensions from the output using sharp
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

    // Save as new media file
    const insertResult = await db.execute({
      sql: "INSERT INTO media_files (filename, mime_type, size, width, height, data) VALUES (?, ?, ?, ?, ?, ?)",
      args: [newFilename, "image/png", outputBuffer.length, width, height, newBase64],
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
