import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { getAIConfig, generateText } from "@/lib/ai-provider";

export const dynamic = "force-dynamic";



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
    const aiConfig = await getAIConfig();
    if (!aiConfig) {
      return NextResponse.json(
        { error: "AI provider not configured. Add an API key in Settings → AI Integration." }, { status: 500 });
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

    // Truncate very long transcripts to stay within token limits (~100k chars ~ 25k tokens)
    if (transcript.length > 100000) {
      transcript = transcript.slice(0, 100000) + "\n\n[TRANSCRIPT TRUNCATED — full video is longer]";
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

    const { text: rawText } = await generateText(
      aiConfig,
      [
        { role: "system", content: systemPrompt },
        { role: "user", content: `Here is the video transcript. Find the ${maxClips} best clips for these platforms: ${platforms.join(", ")}.\n\nTRANSCRIPT:\n${transcript}` },
      ],
      4096
    );

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
