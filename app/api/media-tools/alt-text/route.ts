import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";

export const dynamic = "force-dynamic";

async function getAnthropicKey(): Promise<string | null> {
  try {
    const db = getDb();
    const result = await db.execute(
      "SELECT value FROM site_settings WHERE key = 'anthropic_api_key'"
    );
    if (result.rows.length > 0 && result.rows[0].value) {
      return result.rows[0].value as string;
    }
  } catch {
    /* fall through */
  }
  return process.env.ANTHROPIC_API_KEY || null;
}

/**
 * POST /api/media-tools/alt-text
 * Body: { imageId: number, context?: string }
 * Returns: { alt_text: string }
 *
 * Uses Anthropic vision to generate descriptive alt text for an image.
 */
export async function POST(req: NextRequest) {
  try {
    const apiKey = await getAnthropicKey();
    if (!apiKey) {
      return NextResponse.json(
        { error: "Anthropic API key not configured." },
        { status: 500 }
      );
    }

    const body = await req.json();
    const { imageId, context } = body;

    if (!imageId) {
      return NextResponse.json({ error: "imageId is required" }, { status: 400 });
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
    const base64Data = row.data as string;
    const mimeType = row.mime_type as string;

    // SVGs can't be analyzed by vision
    if (mimeType === "image/svg+xml") {
      return NextResponse.json(
        { error: "Alt text generation is not supported for SVG files." },
        { status: 400 }
      );
    }

    const contextHint = context
      ? `\nAdditional context about this image: ${context}`
      : "";

    const anthropicResp = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-6",
        max_tokens: 300,
        messages: [
          {
            role: "user",
            content: [
              {
                type: "image",
                source: {
                  type: "base64",
                  media_type: mimeType,
                  data: base64Data,
                },
              },
              {
                type: "text",
                text: `Write a concise, descriptive alt text for this image. The alt text should:
- Be 1-2 sentences, under 125 characters if possible
- Describe what the image shows, not what it means
- Be useful for screen readers and SEO
- Skip phrases like "Image of" or "Photo of"
${contextHint}

Return only the alt text string. No quotes, no explanation.`,
              },
            ],
          },
        ],
      }),
    });

    if (!anthropicResp.ok) {
      const err = await anthropicResp.text();
      return NextResponse.json({ error: err }, { status: 500 });
    }

    const data = await anthropicResp.json();
    const altText =
      data.content?.[0]?.text?.trim() || "Image description unavailable";

    return NextResponse.json({ alt_text: altText });
  } catch (err: unknown) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Unknown error" },
      { status: 500 }
    );
  }
}
