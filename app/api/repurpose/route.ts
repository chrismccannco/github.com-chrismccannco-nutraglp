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

async function getBrandVoicePrompt(voiceId?: number): Promise<string> {
  const db = getDb();
  try {
    let row;
    if (voiceId) {
      const result = await db.execute({
        sql: "SELECT * FROM brand_voices WHERE id = ?",
        args: [voiceId],
      });
      row = result.rows[0];
    } else {
      const result = await db.execute(
        "SELECT * FROM brand_voices WHERE is_default = 1 LIMIT 1"
      );
      row = result.rows[0];
    }
    if (!row) return "";
    const parts: string[] = [];
    if (row.tone) parts.push(`Tone: ${row.tone}`);
    if (row.dos) parts.push(`Do:\n${row.dos}`);
    if (row.donts) parts.push(`Don't:\n${row.donts}`);
    if (row.exemplar) parts.push(`Style anchor:\n"${row.exemplar}"`);
    return parts.join("\n\n");
  } catch {
    return "";
  }
}

const FORMATS = {
  linkedin: {
    label: "LinkedIn Post",
    instruction: "Write a LinkedIn post based on this article. 150-250 words. Professional but not stiff. Hook in the first line. End with a thought-provoking question or observation. No hashtags unless they add real value. No emojis.",
  },
  twitter_thread: {
    label: "Twitter/X Thread",
    instruction: "Write a 4-6 tweet thread based on this article. Each tweet under 280 characters. First tweet is the hook. Number them (1/). Make each tweet stand alone but build momentum. No hashtags.",
  },
  email_subject: {
    label: "Email Subject Lines",
    instruction: "Write 5 email subject line options for a newsletter featuring this article. Under 60 characters each. Vary the approaches: curiosity, specificity, urgency, benefit. No clickbait. Return as a numbered list.",
  },
  meta_description: {
    label: "Meta Description",
    instruction: "Write a meta description for this article. 150-160 characters. Accurate and compelling. No filler words. Return only the description text.",
  },
  summary: {
    label: "Executive Summary",
    instruction: "Write a 2-3 sentence executive summary of this article. Direct, factual, no marketing language. Suitable for a busy reader who needs the core takeaway in 10 seconds.",
  },
  newsletter_blurb: {
    label: "Newsletter Blurb",
    instruction: "Write a short blurb (50-80 words) to introduce this article in an email newsletter. Make the reader want to click through. Casual but substantive.",
  },
};

type FormatKey = keyof typeof FORMATS;

/**
 * POST /api/repurpose
 * Body: { content: string, title: string, formats: string[], voiceId?: number }
 * Returns: { results: { format: string, label: string, output: string }[] }
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
    const { content, title, formats, voiceId } = body;

    if (!content || !formats || formats.length === 0) {
      return NextResponse.json(
        { error: "content and formats are required" },
        { status: 400 }
      );
    }

    const voicePrompt = await getBrandVoicePrompt(voiceId);

    // Build a single prompt that generates all formats at once
    const formatInstructions = (formats as FormatKey[])
      .filter((f) => FORMATS[f])
      .map((f) => `## ${FORMATS[f].label}\n${FORMATS[f].instruction}`)
      .join("\n\n");

    const systemPrompt = [
      "You are a content repurposing engine embedded in a CMS.",
      "You take a long-form article and produce multiple output formats from it.",
      "Each output should be independently excellent — not just a summary, but adapted for its specific channel and audience.",
      voicePrompt,
      "Return your response as valid JSON: an array of objects with { format: string, output: string }. The format field should match the section headers exactly. No markdown wrapping around the JSON.",
    ]
      .filter(Boolean)
      .join("\n\n");

    const userPrompt = `ARTICLE TITLE: ${title || "Untitled"}\n\nARTICLE CONTENT:\n${content}\n\n---\n\nGenerate the following formats:\n\n${formatInstructions}\n\nReturn as JSON array: [{ "format": "format_key", "output": "..." }, ...]`;

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
        messages: [{ role: "user", content: userPrompt }],
      }),
    });

    if (!anthropicResp.ok) {
      const err = await anthropicResp.text();
      return NextResponse.json({ error: err }, { status: 500 });
    }

    const data = await anthropicResp.json();
    const rawText = data.content?.[0]?.text || "[]";

    // Parse the JSON response
    let results;
    try {
      results = JSON.parse(rawText);
    } catch {
      // If JSON parsing fails, try to extract JSON from the text
      const jsonMatch = rawText.match(/\[[\s\S]*\]/);
      results = jsonMatch ? JSON.parse(jsonMatch[0]) : [];
    }

    // Enrich with labels
    const enriched = (results as { format: string; output: string }[]).map(
      (r: { format: string; output: string }) => ({
        ...r,
        label: FORMATS[r.format as FormatKey]?.label || r.format,
      })
    );

    return NextResponse.json({
      results: enriched,
      available_formats: Object.entries(FORMATS).map(([key, val]) => ({
        key,
        label: val.label,
      })),
    });
  } catch (err: unknown) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Unknown error" },
      { status: 500 }
    );
  }
}

// GET /api/repurpose — returns available formats
export async function GET() {
  return NextResponse.json({
    formats: Object.entries(FORMATS).map(([key, val]) => ({
      key,
      label: val.label,
    })),
  });
}
