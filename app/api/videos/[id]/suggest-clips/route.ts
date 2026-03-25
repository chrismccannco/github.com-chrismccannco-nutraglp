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
  } catch { /* fall through */ }
  return process.env.ANTHROPIC_API_KEY || null;
}

/**
 * POST /api/videos/:id/suggest-clips
 * Body: { platforms?: string[], max_clips?: number }
 *
 * AI reads the transcript and suggests the best clip-worthy segments.
 * Returns an array of suggested clips with timestamps, segments, and rationale.
 */
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const apiKey = await getAnthropicKey();
    if (!apiKey) {
      return NextResponse.json({ error: "Anthropic API key not configured." }, { status: 500 });
    }

    const db = getDb();
    const videoResult = await db.execute({
      sql: "SELECT * FROM videos WHERE id = ?",
      args: [Number(id)],
    });
    if (videoResult.rows.length === 0) {
      return NextResponse.json({ error: "Video not found" }, { status: 404 });
    }

    const video = videoResult.rows[0];
    let transcript = video.transcript as string;
    if (!transcript || transcript.trim().length === 0) {
      return NextResponse.json({ error: "No transcript available. Paste the transcript first, then click Save before analyzing." }, { status: 400 });
    }

    // Limit transcript to 50k chars (~12k tokens) to stay within Netlify timeout + model limits
    const TRANSCRIPT_CHAR_LIMIT = 50000;
    if (transcript.length > TRANSCRIPT_CHAR_LIMIT) {
      transcript = transcript.slice(0, TRANSCRIPT_CHAR_LIMIT) + "\n\n[TRANSCRIPT TRUNCATED — analyze only the portion above]";
    }

    const body = await req.json();
    const platforms = body.platforms || ["linkedin", "twitter", "tiktok", "instagram"];
    const maxClips = body.max_clips || 6;

    const systemPrompt = `You are a social media content strategist analyzing a video transcript to find the best moments for short-form clips.

Your job is to identify ${maxClips} segments that would make compelling social media clips. Each segment should:
- Be a complete thought or story (not cut mid-sentence)
- Be 15-90 seconds of speaking time (roughly 40-250 words)
- Have a strong hook in the first sentence
- Contain a quotable moment, surprising insight, or emotional beat
- Work as a standalone clip without requiring context from the full video

For each segment, specify which platforms it's best suited for:
- tiktok: 15-60 seconds, high energy, surprising or contrarian takes
- instagram: 15-90 seconds, polished insights, aspirational content
- linkedin: 30-90 seconds, professional insights, business lessons, leadership moments
- twitter: 15-45 seconds, punchy takes, hot takes, memorable one-liners
- youtube_shorts: 15-60 seconds, educational moments, tutorials, revelations

Return valid JSON array: [{ "title": "short clip title", "start_word_index": 0, "end_word_index": 100, "transcript_segment": "the exact text from transcript", "platforms": ["linkedin", "tiktok"], "rationale": "why this segment works" }]

Use word indices (0-based) to mark where in the transcript each segment starts and ends. Include the exact transcript text in transcript_segment.`;

    const anthropicResp = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-6",
        max_tokens: 4096,
        system: systemPrompt,
        messages: [{
          role: "user",
          content: `Here is the video transcript. Find the ${maxClips} best clips for these platforms: ${platforms.join(", ")}.\n\nTRANSCRIPT:\n${transcript}`,
        }],
      }),
    });

    if (!anthropicResp.ok) {
      const err = await anthropicResp.text();
      return NextResponse.json({ error: err }, { status: 500 });
    }

    const data = await anthropicResp.json();
    const rawText = data.content?.[0]?.text || "[]";

    let suggestions;
    try {
      suggestions = JSON.parse(rawText);
    } catch {
      const jsonMatch = rawText.match(/\[[\s\S]*\]/);
      suggestions = jsonMatch ? JSON.parse(jsonMatch[0]) : [];
    }

    return NextResponse.json({ suggestions });
  } catch (err: unknown) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Unknown error" },
      { status: 500 }
    );
  }
}
