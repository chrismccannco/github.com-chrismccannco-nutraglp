import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { getAIConfig, generateText } from "@/lib/ai-provider";

export const dynamic = "force-dynamic";



/**
 * POST /api/media-tools/alt-text
 * Body: { imageId: number, context?: string }
 * Returns: { alt_text: string }
 *
 * Uses Anthropic vision to generate descriptive alt text for an image.
 */
export async function POST(req: NextRequest) {
  try {
    const aiConfig = await getAIConfig();
    if (!aiConfig) {
      return NextResponse.json(
        { error: "AI provider not configured. Add an API key in Settings → AI Integration." },
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

    // Alt-text uses vision — always uses Anthropic since it requires multimodal input.
    // The key is sourced from the ai-provider config (falls back to env var).
    const anthropicResp = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": aiConfig.provider === "anthropic" ? aiConfig.apiKey : (process.env.ANTHROPIC_API_KEY || aiConfig.apiKey),
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
