/**
 * Server-side image processing utilities.
 * Uses pure JS approach (no sharp dependency) to keep Vercel serverless compatible.
 * For raster images: stores original + generates thumbnail via canvas-less base64 crop.
 * On-the-fly resizing happens at serve time using the /api/upload/[id] route with ?w= param.
 */

// Parse image dimensions from binary data without external libs
// Supports JPEG, PNG, GIF, WebP
export function getImageDimensions(
  buffer: Buffer,
  mimeType: string
): { width: number; height: number } {
  try {
    if (mimeType === "image/png") {
      // PNG: width at byte 16, height at byte 20 (both 4-byte big-endian)
      if (buffer.length >= 24) {
        return {
          width: buffer.readUInt32BE(16),
          height: buffer.readUInt32BE(20),
        };
      }
    }

    if (mimeType === "image/jpeg") {
      // JPEG: scan for SOF0/SOF2 markers (0xFF 0xC0 or 0xFF 0xC2)
      let i = 2; // skip SOI marker
      while (i < buffer.length - 8) {
        if (buffer[i] !== 0xff) break;
        const marker = buffer[i + 1];
        if (marker === 0xc0 || marker === 0xc2) {
          return {
            height: buffer.readUInt16BE(i + 5),
            width: buffer.readUInt16BE(i + 7),
          };
        }
        // Skip to next marker
        const segLen = buffer.readUInt16BE(i + 2);
        i += 2 + segLen;
      }
    }

    if (mimeType === "image/gif") {
      // GIF: width at byte 6, height at byte 8 (both 2-byte little-endian)
      if (buffer.length >= 10) {
        return {
          width: buffer.readUInt16LE(6),
          height: buffer.readUInt16LE(8),
        };
      }
    }

    if (mimeType === "image/webp") {
      // WebP: check for VP8 or VP8L chunk
      if (buffer.length >= 30 && buffer.toString("ascii", 0, 4) === "RIFF") {
        const format = buffer.toString("ascii", 12, 16);
        if (format === "VP8 " && buffer.length >= 30) {
          // Lossy WebP
          return {
            width: buffer.readUInt16LE(26) & 0x3fff,
            height: buffer.readUInt16LE(28) & 0x3fff,
          };
        }
        if (format === "VP8L" && buffer.length >= 25) {
          // Lossless WebP
          const bits = buffer.readUInt32LE(21);
          return {
            width: (bits & 0x3fff) + 1,
            height: ((bits >> 14) & 0x3fff) + 1,
          };
        }
      }
    }
  } catch {
    // Parsing failed
  }

  return { width: 0, height: 0 };
}

/**
 * Generate a srcset string for responsive images.
 * Returns widths: 320, 640, 960, 1280, original
 */
export function generateSrcSet(id: number, originalWidth: number): string {
  const widths = [320, 640, 960, 1280].filter((w) => w < originalWidth);
  const entries = widths.map((w) => `/api/upload/${id}?w=${w} ${w}w`);
  entries.push(`/api/upload/${id} ${originalWidth}w`);
  return entries.join(", ");
}
