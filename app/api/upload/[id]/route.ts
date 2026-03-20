import { getDb } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { searchParams } = new URL(request.url);
    const targetWidth = searchParams.get("w") ? Number(searchParams.get("w")) : null;
    const format = searchParams.get("format"); // "webp" or null

    const db = getDb();
    const result = await db.execute({
      sql: "SELECT data, mime_type, filename, width FROM media_files WHERE id = ?",
      args: [Number(id)],
    });

    if (result.rows.length === 0) {
      return new NextResponse("Not found", { status: 404 });
    }

    const row = result.rows[0];
    let buffer = Buffer.from(row.data as string, "base64");
    let contentType = row.mime_type as string;
    const originalWidth = (row.width as number) || 0;

    // SVGs don't get resized
    const isSvg = contentType === "image/svg+xml";
    const needsProcessing = !isSvg && (targetWidth || format === "webp");

    if (needsProcessing) {
      try {
        // Dynamic import — sharp is bundled with Next.js on Vercel
        const sharp = (await import("sharp")).default;
        let pipeline = sharp(buffer);

        // Resize if requested and smaller than original
        if (targetWidth && originalWidth && targetWidth < originalWidth) {
          pipeline = pipeline.resize(targetWidth, null, {
            withoutEnlargement: true,
            fit: "inside",
          });
        }

        // Convert to WebP if requested
        if (format === "webp") {
          pipeline = pipeline.webp({ quality: 80 });
          contentType = "image/webp";
        } else if (contentType === "image/jpeg") {
          pipeline = pipeline.jpeg({ quality: 85, progressive: true });
        } else if (contentType === "image/png") {
          pipeline = pipeline.png({ compressionLevel: 8 });
        }

        buffer = await pipeline.toBuffer() as Buffer<ArrayBuffer>;
      } catch {
        // sharp not available — serve original
      }
    }

    return new NextResponse(buffer, {
      headers: {
        "Content-Type": contentType,
        "Content-Length": String(buffer.length),
        "Cache-Control": "public, max-age=31536000, immutable",
        "Content-Disposition": `inline; filename="${row.filename}"`,
        "Vary": "Accept",
      },
    });
  } catch (error) {
    console.error("Media serve error:", error);
    return new NextResponse("Server error", { status: 500 });
  }
}
