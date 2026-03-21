import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { getAIConfig, generateText } from "@/lib/ai-provider";

export const dynamic = "force-dynamic";



async function getVoicePrompt(voiceId: number | null): Promise<string> {
  if (!voiceId) return "";
  const db = getDb();
  try {
    const result = await db.execute({ sql: "SELECT * FROM brand_voices WHERE id = ?", args: [voiceId] });
    const row = result.rows[0];
    if (!row) return "";
    const parts: string[] = [];
    if (row.tone) parts.push(`Tone: ${row.tone}`);
    if (row.dos) parts.push(`Do:\n${row.dos}`);
    if (row.donts) parts.push(`Don't:\n${row.donts}`);
    return parts.join("\n\n");
  } catch { return ""; }
}

/**
 * POST /api/videos/:id/generate-captions
 * Body: { clip_ids: number[] } or { clip_id: number, platform: string }
 *
 * Generates platform-specific captions for video clips.
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
    const body = await req.json();

    // Get video for voice context
    const videoResult = await db.execute({ sql: "SELECT * FROM videos WHERE id = ?", args: [Number(id)] });
    if (videoResult.rows.length === 0) {
      return NextResponse.json({ error: "Video not found" }, { status: 404 });
    }
    const video = videoResult.rows[0];
    const voicePrompt = await getVoicePrompt(video.voice_id as number | null);

    // Get clips to generate captions for
    const clipIds = body.clip_ids || (body.clip_id ? [body.clip_id] : []);
    if (clipIds.length === 0) {
      return NextResponse.json({ error: "clip_ids or clip_id required" }, { status: 400 });
    }

    const placeholders = clipIds.map(() => "?").join(",");
    const clipsResult = await db.execute({
      sql: `SELECT * FROM video_clips WHERE id IN (${placeholders}) AND video_id = ?`,
      args: [...clipIds.map(Number), Number(id)],
    });

    if (clipsResult.rows.length === 0) {
      return NextResponse.json({ error: "No clips found" }, { status: 404 });
    }

    const platformInstructions: Record<string, string> = {
      linkedin: "Professional but not stiff. Hook in the first line. 150-250 words. End with a thought-provoking observation. No hashtags unless they add real value.",
      twitter: "Punchy. Under 280 characters for the main tweet. Add a thread if the insight deserves it. No hashtags.",
      tiktok: "Casual, direct, hook in the first 3 words. Under 150 characters for the overlay text. Include 3-5 relevant hashtags.",
      instagram: "Visual storytelling tone. 150-200 words. Break into short paragraphs. End with a call to action. 5-10 relevant hashtags at the end.",
      youtube_shorts: "Clear, informative title. 2-3 sentence description that makes people want to watch. Include 3-5 search-friendly tags.",
    };

    const results: { clip_id: number; platform: string; caption: string }[] = [];

    for (const clip of clipsResult.rows) {
      const platform = clip.platform as string;
      const instruction = platformInstructions[platform] || platformInstructions.linkedin;

      const systemPrompt = [
        "You are a social media copywriter. Generate a caption for a video clip being posted on social media.",
        voicePrompt,
        `PLATFORM: ${platform}`,
        `STYLE: ${instruction}`,
        "Return only the caption text. No preamble.",
      ].filter(Boolean).join("\n\n");

      let caption = "";
      try {
        const { text } = await generateText(
          aiConfig,
          [
            { role: "system", content: systemPrompt },
            { role: "user", content: `Video title: "${video.title}"\n\nClip transcript:\n${clip.transcript_segment}\n\nWrite the ${platform} caption.` },
          ],
          500
        );
        caption = text.trim();
      } catch { caption = ""; }

      if (caption) {

        // Save caption to clip
        await db.execute({
          sql: "UPDATE video_clips SET caption = ? WHERE id = ?",
          args: [caption, Number(clip.id)],
        });

        results.push({ clip_id: Number(clip.id), platform, caption });
      }
    }

    return NextResponse.json({ results });
  } catch (err: unknown) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Unknown error" },
      { status: 500 }
    );
  }

}
