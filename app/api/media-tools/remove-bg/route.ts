import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";

export const dynamic = "force-dynamic";

/**
 * POST /api/media-tools/remove-bg
 * Body: { imageId: number, threshold?: number, feather?: number (default 2), refineEdges?: boolean (default true) }
 * Returns: { id, url, filename, size, width, height } of the new image with background removed
 *
 * Uses Sharp to remove solid/near-solid backgrounds by sampling corner pixels
 * and converting matching colors to transparent. Includes edge refinement to reduce
 * halos and feathering for smoother boundaries. Works well for product photos
 * on white/solid backgrounds. Not a neural net — keep expectations calibrated.
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { imageId, threshold = 30, feather = 2, refineEdges = true } = body;

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

    // Edge refinement: reduce halos and speckles
    if (refineEdges) {
      const refined = Buffer.from(newPixels);

      for (let y = 0; y < h; y++) {
        for (let x = 0; x < w; x++) {
          const idx = (y * w + x) * channels;
          const currentAlpha = refined[idx + 3];

          // Count opaque and transparent neighbors (8-connected)
          let opaqueNeighbors = 0;
          let transparentNeighbors = 0;

          for (let dy = -1; dy <= 1; dy++) {
            for (let dx = -1; dx <= 1; dx++) {
              if (dx === 0 && dy === 0) continue;

              const ny = y + dy;
              const nx = x + dx;

              if (nx >= 0 && nx < w && ny >= 0 && ny < h) {
                const nidx = (ny * w + nx) * channels;
                const neighborAlpha = refined[nidx + 3];

                if (neighborAlpha > 200) {
                  opaqueNeighbors++;
                } else if (neighborAlpha < 50) {
                  transparentNeighbors++;
                }
              }
            }
          }

          // Speckle removal: transparent pixel surrounded mostly by opaque → make opaque
          if (currentAlpha < 50 && opaqueNeighbors >= 6) {
            refined[idx + 3] = 255;
          }

          // Halo removal: opaque pixel surrounded mostly by transparent and near background color
          if (currentAlpha > 200 && transparentNeighbors >= 5) {
            const r = refined[idx];
            const g = refined[idx + 1];
            const b = refined[idx + 2];

            const dist = Math.sqrt(
              (r - bgR) ** 2 + (g - bgG) ** 2 + (b - bgB) ** 2
            );

            if (dist < threshold * 1.5) {
              refined[idx + 3] = 0;
            }
          }
        }
      }

      // Copy refined data back
      refined.copy(newPixels);
    }

    // Feathering pass: smooth boundaries between transparent and opaque
    if (feather > 0) {
      const feathered = Buffer.from(newPixels);

      for (let y = 0; y < h; y++) {
        for (let x = 0; x < w; x++) {
          const idx = (y * w + x) * channels;
          const currentAlpha = feathered[idx + 3];

          // Only feather boundary pixels
          if (currentAlpha > 0 && currentAlpha < 255) {
            let transparentNeighborCount = 0;

            // Check neighbors
            for (let dy = -1; dy <= 1; dy++) {
              for (let dx = -1; dx <= 1; dx++) {
                if (dx === 0 && dy === 0) continue;

                const ny = y + dy;
                const nx = x + dx;

                if (nx >= 0 && nx < w && ny >= 0 && ny < h) {
                  const nidx = (ny * w + nx) * channels;
                  const neighborAlpha = feathered[nidx + 3];

                  if (neighborAlpha < 128) {
                    transparentNeighborCount++;
                  }
                }
              }
            }

            // Blend alpha based on transparent neighbors
            const blendFactor = transparentNeighborCount / 8;
            const newAlpha = Math.round(currentAlpha * (1 - blendFactor * (feather / 2)));
            feathered[idx + 3] = Math.max(0, newAlpha);
          }
        }
      }

      feathered.copy(newPixels);
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
