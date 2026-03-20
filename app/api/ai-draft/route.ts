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

/**
 * POST /api/ai-draft
 * Body: { topic: string, voiceId?: number, personaId?: number }
 * Returns a full blog post draft with title, slug, description, tag, meta, and sections.
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
    const { topic, voiceId, personaId } = body;

    if (!topic || !topic.trim()) {
      return NextResponse.json(
        { error: "topic is required" },
        { status: 400 }
      );
    }

    const db = getDb();

    // Load brand voice
    const voiceParts: string[] = [];
    try {
      let voiceRow;
      if (voiceId) {
        const vr = await db.execute({ sql: "SELECT * FROM brand_voices WHERE id = ?", args: [voiceId] });
        voiceRow = vr.rows[0];
      } else {
        const vr = await db.execute("SELECT * FROM brand_voices WHERE is_default = 1 LIMIT 1");
        voiceRow = vr.rows[0];
      }
      if (voiceRow) {
        if (voiceRow.mission) voiceParts.push(`Brand mission: ${voiceRow.mission}`);
        if (voiceRow.audience) voiceParts.push(`Audience: ${voiceRow.audience}`);
        if (voiceRow.tone) voiceParts.push(`Tone: ${voiceRow.tone}`);
        if (voiceRow.dos) voiceParts.push(`Do:\n${voiceRow.dos}`);
        if (voiceRow.donts) voiceParts.push(`Don't:\n${voiceRow.donts}`);
        if (voiceRow.exemplar) voiceParts.push(`Style anchor:\n"${voiceRow.exemplar}"`);
      }
    } catch { /* no voice */ }

    // Load persona
    const personaParts: string[] = [];
    try {
      let personaRow;
      if (personaId) {
        const pr = await db.execute({ sql: "SELECT * FROM audience_personas WHERE id = ?", args: [personaId] });
        personaRow = pr.rows[0];
      } else {
        const pr = await db.execute("SELECT * FROM audience_personas WHERE is_default = 1 LIMIT 1");
        personaRow = pr.rows[0];
      }
      if (personaRow) {
        personaParts.push(`TARGET AUDIENCE PERSONA: ${personaRow.name}`);
        if (personaRow.description) personaParts.push(`Profile: ${personaRow.description}`);
        if (personaRow.demographics) personaParts.push(`Demographics: ${personaRow.demographics}`);
        if (personaRow.goals) personaParts.push(`Goals: ${personaRow.goals}`);
        if (personaRow.pain_points) personaParts.push(`Pain points: ${personaRow.pain_points}`);
        if (personaRow.communication_style) personaParts.push(`Communication preferences: ${personaRow.communication_style}`);
        if (personaRow.objections) personaParts.push(`Common objections: ${personaRow.objections}`);
        personaParts.push("Tailor the content to speak directly to this persona.");
      }
    } catch { /* no persona */ }

    // Load knowledge base (all enabled docs, truncated to avoid token explosion)
    const knowledgeParts: string[] = [];
    try {
      const kr = await db.execute("SELECT title, content FROM knowledge_docs WHERE enabled = 1 LIMIT 5");
      for (const row of kr.rows) {
        const content = (row.content as string || "").slice(0, 1500);
        knowledgeParts.push(`[${row.title}]\n${content}`);
      }
    } catch { /* no knowledge */ }

    const systemPrompt = [
      "You are a blog writing engine embedded in a headless CMS for a GLP-1 supplement company.",
      "Given a topic, produce a complete, publication-ready blog post.",
      "The post should be informative, evidence-aware, and avoid making drug claims.",
      voiceParts.length > 0 ? `BRAND VOICE:\n${voiceParts.join("\n")}` : "",
      personaParts.length > 0 ? personaParts.join("\n") : "",
      knowledgeParts.length > 0 ? `KNOWLEDGE BASE (use as factual source):\n${knowledgeParts.join("\n\n---\n\n")}` : "",
      `Return ONLY valid JSON with this exact structure (no markdown wrapping):
{
  "title": "string",
  "slug": "string (lowercase, hyphens, no special chars)",
  "description": "string (1-2 sentence summary)",
  "tag": "string (single category tag)",
  "meta_title": "string (under 60 chars)",
  "meta_description": "string (under 160 chars)",
  "read_time": "string (e.g. '5 min')",
  "sections": [
    { "heading": "string", "body": "string (HTML paragraphs, use <p> tags)" }
  ]
}
Generate 4-6 sections. Each section body should be 2-4 paragraphs of rich HTML content.`,
    ]
      .filter(Boolean)
      .join("\n\n");

    const startTime = Date.now();
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
        messages: [{ role: "user", content: `Write a blog post about: ${topic}` }],
      }),
    });

    if (!anthropicResp.ok) {
      const err = await anthropicResp.text();
      return NextResponse.json({ error: err }, { status: 500 });
    }

    const data = await anthropicResp.json();
    const rawText = data.content?.[0]?.text || "{}";

    // Parse the JSON response
    let draft;
    try {
      draft = JSON.parse(rawText);
    } catch {
      const jsonMatch = rawText.match(/\{[\s\S]*\}/);
      draft = jsonMatch ? JSON.parse(jsonMatch[0]) : null;
    }

    if (!draft || !draft.title) {
      return NextResponse.json({ error: "AI returned invalid draft format" }, { status: 500 });
    }

    // Log AI usage
    try {
      const duration = Date.now() - startTime;
      await db.execute({
        sql: `INSERT INTO ai_usage_log (action, model, input_tokens, output_tokens, duration_ms, metadata) VALUES (?, ?, ?, ?, ?, ?)`,
        args: [
          "blog_draft",
          "claude-sonnet-4-6",
          data.usage?.input_tokens || 0,
          data.usage?.output_tokens || 0,
          duration,
          JSON.stringify({ topic }),
        ],
      });
    } catch { /* non-critical */ }

    return NextResponse.json(draft);
  } catch (err: unknown) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Unknown error" },
      { status: 500 }
    );
  }
}
