import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";

export const dynamic = "force-dynamic";

const CHANNEL_PRESETS = {
  "blog-hero": { width: 1200, height: 630, label: "Blog Hero" },
  "og-image": { width: 1200, height: 630, label: "OG Image" },
  "instagram-square": { width: 1080, height: 1080, label: "Instagram Square" },
  "instagram-story": { width: 1080, height: 1920, label: "Instagram Story" },
  "twitter-card": { width: 1200, height: 675, label: "Twitter Card" },
  "linkedin-post": { width: 1200, height: 627, label: "LinkedIn Post" },
  "youtube-thumb": { width: 1280, height: 720, label: "YouTube Thumbnail" },
  "email-header": { width: 600, height: 200, label: "Email Header" },
  "favicon": { width: 512, height: 512, label: "Favicon/App Icon" },
} as const;

/**
 * POST /api/media-tools/channel-export
 * Body: { imageId: number, presets: string[] }
 * Returns: { results: [{ preset, id, url, filename, size, width, height }] }
 *
 * Generates multiple sized versions of an image optimized for different social channels.
 * Each preset is resized with cover fit and center position, then saved as JPEG with quality 85.
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { imageId, presets = [] } = body;

    if (!imageId) {
      return NextResponse.json({ error: "imageId is required" }, { status: 400 });
    }

    if (!Array.isArray(presets) || presets.length === 0) {
      return NextResponse.json(
        { error: "presets array is required and must not be empty" },
        { status: 400 }
      );
    }

    // Validate all presets exist
    for (const preset of presets) {
      if (!(preset in CHANNEL_PRESETS)) {
        return NextResponse.json(
          { error: `Invalid preset: ${preset}. Available: ${Object.keys(CHANNEL_PRESETS).join(", ")}` },
          { status: 400 }
        );
      }
    }

    const db = getDb();
    const result = await db.execute({
      sql: "SELECT data, mime_type, filename FROM media_files WHERE id = ?",
      args: [Number(imageId)],
    });

    if (result.rows.length === 0) {
      return NextResponse.json({ error: "Image not found" }, { status: 404 });
    }

    const row = result.rows[0];
    const mimeType = row.mime_type as string;

    if (mimeType === "image/svg+xml") {
      return NextResponse.json(
        { error: "Channel export is not supported for SVG files." },
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

    const results = [];
    const baseName = (row.filename as string).replace(/\.[^.]+$/, "");

    for (const presetName of presets) {
      const preset = CHANNEL_PRESETS[presetName as keyof typeof CHANNEL_PRESETS];

      // Create a new image instance for each preset
      const image = sharpFn(buffer);
      const outputBuffer = await image
        .resize(preset.width, preset.height, {
          fit: "cover",
          position: "centre",
        })
        .jpeg({ quality: 85 })
        .toBuffer();

      const newBase64 = outputBuffer.toString("base64");
      const newFilename = `${baseName}_preset-${presetName}.jpg`;

      // Save as new media file
      const insertResult = await db.execute({
        sql: "INSERT INTO media_files (filename, mime_type, size, width, height, data) VALUES (?, ?, ?, ?, ?, ?)",
        args: [newFilename, "image/jpeg", outputBuffer.length, preset.width, preset.height, newBase64],
      });

      const newId = Number(insertResult.lastInsertRowid);

      results.push({
        preset: presetName,
        id: newId,
        url: `/api/upload/${newId}`,
        filename: newFilename,
        size: outputBuffer.length,
        width: preset.width,
        height: preset.height,
      });
    }

    return NextResponse.json({ results });
  } catch (err: unknown) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Unknown error" },
      { status: 500 }
    );
  }
}
