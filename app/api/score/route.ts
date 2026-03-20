import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

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

async function getBrandVoice(): Promise<Record<string, string>> {
  const db = getDb();
  try {
    // Try brand_voices table first (default voice)
    const voiceResult = await db.execute(
      "SELECT * FROM brand_voices WHERE is_default = 1 LIMIT 1"
    );
    const v = voiceResult.rows[0];
    if (v) {
      const parts: Record<string, string> = {};
      if (v.tone) parts.tone = v.tone as string;
      if (v.mission) parts.mission = v.mission as string;
      if (v.audience) parts.audience = v.audience as string;
      if (v.dos) parts.dos = v.dos as string;
      if (v.donts) parts.donts = v.donts as string;
      if (v.exemplar) parts.exemplar = v.exemplar as string;
      return parts;
    }
    // Fallback to site_settings
    const settings = await db.execute(
      "SELECT key, value FROM site_settings WHERE key LIKE 'brand_voice_%'"
    );
    const map: Record<string, string> = {};
    for (const row of settings.rows) {
      const k = (row.key as string).replace("brand_voice_", "");
      map[k] = row.value as string;
    }
    return map;
  } catch {
    return {};
  }
}

/**
 * POST /api/score
 * Body: { content_type: "blog_post" | "page", content_id: number, content: string }
 * Scores the content against brand guidelines and stores the result on the record.
 */
export async function POST(req: NextRequest) {
  try {
    const apiKey = await getAnthropicKey();
    if (!apiKey) {
      return NextResponse.json({ error: "No API key" }, { status: 500 });
    }

    const body = await req.json();
    const { content_type, content_id, content } = body;

    if (!content?.trim() || !content_type || !content_id) {
      return NextResponse.json({ error: "content, content_type, content_id required" }, { status: 400 });
    }

    const voice = await getBrandVoice();
    const brandContext = [
      voice.mission && `Mission: ${voice.mission}`,
      voice.audience && `Audience: ${voice.audience}`,
      voice.tone && `Tone keywords: ${voice.tone}`,
      voice.dos && `Do:\n${voice.dos}`,
      voice.donts && `Don't:\n${voice.donts}`,
      voice.exemplar && `Style anchor:\n"${voice.exemplar}"`,
    ].filter(Boolean).join("\n\n");

    const prompt = `You are a brand consistency analyst. Score this content quickly.

${brandContext ? `BRAND GUIDELINES:\n${brandContext}\n\n` : "(No brand voice configured — score on general clarity and professionalism.)\n\n"}

CONTENT:
${content.slice(0, 4000)}

Return ONLY valid JSON, no markdown:
{
  "overall": <integer 0-100>,
  "voice": <integer 0-100>,
  "clarity": <integer 0-100>,
  "summary": "<one sentence verdict>"
}`;

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-6",
        max_tokens: 256,
        messages: [{ role: "user", content: prompt }],
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      return NextResponse.json({ error: err }, { status: 500 });
    }

    const data = await response.json();
    const text = data.content?.[0]?.text || "";
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      return NextResponse.json({ error: "No JSON in response" }, { status: 500 });
    }

    const scores = JSON.parse(jsonMatch[0]);
    const db = getDb();
    const table = content_type === "page" ? "pages" : "blog_posts";
    const now = new Date().toISOString();

    await db.execute({
      sql: `UPDATE ${table} SET brand_score = ?, voice_score = ?, clarity_score = ?, score_summary = ?, scored_at = ? WHERE id = ?`,
      args: [scores.overall, scores.voice, scores.clarity, scores.summary, now, content_id],
    });

    // Log AI usage
    try {
      const inputTokens = data.usage?.input_tokens || 0;
      const outputTokens = data.usage?.output_tokens || 0;
      await db.execute({
        sql: `INSERT INTO ai_usage_log (action, model, input_tokens, output_tokens, metadata) VALUES (?, ?, ?, ?, ?)`,
        args: ["content_score", "claude-sonnet-4-6", inputTokens, outputTokens, JSON.stringify({ content_type, content_id })],
      });
    } catch { /* non-critical */ }

    return NextResponse.json({
      overall: scores.overall,
      voice: scores.voice,
      clarity: scores.clarity,
      summary: scores.summary,
      scored_at: now,
    });
  } catch (err: unknown) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Unknown error" },
      { status: 500 }
    );
  }
}
