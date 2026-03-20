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

async function loadVoice(voiceId?: number | null): Promise<string> {
  const db = getDb();
  try {
    let row;
    if (voiceId) {
      const r = await db.execute({ sql: "SELECT * FROM brand_voices WHERE id = ?", args: [voiceId] });
      row = r.rows[0];
    } else {
      const r = await db.execute("SELECT * FROM brand_voices WHERE is_default = 1 LIMIT 1");
      row = r.rows[0];
    }
    if (!row) return "";
    const parts: string[] = [];
    if (row.mission) parts.push(`Brand mission: ${row.mission}`);
    if (row.audience) parts.push(`Audience: ${row.audience}`);
    if (row.tone) parts.push(`Tone: ${row.tone}`);
    if (row.dos) parts.push(`Do:\n${row.dos}`);
    if (row.donts) parts.push(`Don't:\n${row.donts}`);
    if (row.exemplar) parts.push(`Style anchor:\n"${row.exemplar}"`);
    return parts.length > 0 ? `BRAND VOICE:\n${parts.join("\n")}` : "";
  } catch { return ""; }
}

async function loadPersona(personaId?: number | null): Promise<string> {
  const db = getDb();
  try {
    let row;
    if (personaId) {
      const r = await db.execute({ sql: "SELECT * FROM audience_personas WHERE id = ?", args: [personaId] });
      row = r.rows[0];
    } else {
      const r = await db.execute("SELECT * FROM audience_personas WHERE is_default = 1 LIMIT 1");
      row = r.rows[0];
    }
    if (!row) return "";
    const parts = [`TARGET AUDIENCE PERSONA: ${row.name}`];
    if (row.description) parts.push(`Profile: ${row.description}`);
    if (row.demographics) parts.push(`Demographics: ${row.demographics}`);
    if (row.goals) parts.push(`Goals: ${row.goals}`);
    if (row.pain_points) parts.push(`Pain points: ${row.pain_points}`);
    if (row.communication_style) parts.push(`Communication preferences: ${row.communication_style}`);
    if (row.objections) parts.push(`Common objections: ${row.objections}`);
    parts.push("Tailor the content to speak directly to this persona.");
    return parts.join("\n");
  } catch { return ""; }
}

async function loadKnowledge(): Promise<string> {
  try {
    const db = getDb();
    const kr = await db.execute("SELECT title, content FROM knowledge_docs WHERE enabled = 1 LIMIT 5");
    if (kr.rows.length === 0) return "";
    const docs = kr.rows.map((r) => `[${r.title}]\n${(r.content as string || "").slice(0, 1500)}`);
    return `KNOWLEDGE BASE (use as factual source):\n${docs.join("\n\n---\n\n")}`;
  } catch { return ""; }
}

const CONTENT_TYPE_PROMPTS: Record<string, { system: string; jsonShape: string }> = {
  blog: {
    system: "You are a blog writing engine for a GLP-1 supplement company's CMS. Produce publication-ready blog content. Avoid drug claims. Be evidence-aware.",
    jsonShape: `{
  "title": "string",
  "slug": "string (lowercase, hyphens only)",
  "description": "string (1-2 sentence summary)",
  "tag": "string (single category)",
  "meta_title": "string (under 60 chars)",
  "meta_description": "string (under 160 chars)",
  "read_time": "string (e.g. '5 min')",
  "sections": [{ "heading": "string", "body": "string (HTML with <p> tags)" }]
}
Generate 4-6 sections with 2-4 paragraphs each.`,
  },
  blog_rewrite: {
    system: "You are a content editor for a GLP-1 supplement company's CMS. Improve or rewrite the provided blog content based on the user's instructions. Keep the same section structure unless told otherwise.",
    jsonShape: `{
  "title": "string",
  "description": "string (1-2 sentence summary)",
  "sections": [{ "heading": "string", "body": "string (HTML with <p> tags)" }]
}`,
  },
  page: {
    system: "You are a landing page content engine for a GLP-1 supplement company's CMS. Create compelling page content that drives action.",
    jsonShape: `{
  "title": "string",
  "meta_description": "string (under 160 chars)",
  "meta_title": "string (under 60 chars)",
  "sections": [{ "heading": "string", "body": "string (HTML with <p> tags)" }]
}
Generate 3-5 sections suited for a landing/info page.`,
  },
  testimonial: {
    system: "You are a testimonial copywriter for a GLP-1 supplement company. Take rough customer feedback or a scenario and produce a polished, authentic-sounding testimonial. Keep the voice genuine, not marketing-speak. The testimonial should feel like a real person wrote it.",
    jsonShape: `{
  "name": "string (realistic first name and last initial)",
  "title": "string (a short headline that captures the transformation, e.g. 'Finally found something that works')",
  "quote": "string (2-4 sentences, first person, conversational)",
  "rating": 5
}`,
  },
  form: {
    system: "You are a form design expert for a GLP-1 supplement company's CMS. Design forms that maximize completion rates while collecting the right data. Consider UX best practices: logical field ordering, appropriate field types, clear labels, helpful placeholders, and minimal required fields.",
    jsonShape: `{
  "name": "string (form name)",
  "description": "string (brief purpose)",
  "fields": [
    {
      "id": "string (unique, e.g. 'f_' + random)",
      "type": "text|email|phone|textarea|number|select|radio|checkbox|date|heading|paragraph",
      "label": "string",
      "placeholder": "string",
      "helpText": "string (optional guidance)",
      "defaultValue": "",
      "validation": { "required": boolean },
      "width": "full|half",
      "options": [{ "label": "string", "value": "string" }]
    }
  ],
  "settings": {
    "submitLabel": "string",
    "successMessage": "string"
  }
}
Use heading and paragraph fields to create logical sections. Use half-width for name pairs, city/state, etc. Only mark truly essential fields as required. Include appropriate field types (email for email, phone for phone, etc).`,
  },
};

/**
 * POST /api/ai-assist
 * Universal AI content generation endpoint.
 * Body: { contentType, prompt, voiceId?, personaId?, existingContent? }
 */
export async function POST(req: NextRequest) {
  try {
    const apiKey = await getAnthropicKey();
    if (!apiKey) {
      return NextResponse.json({ error: "Anthropic API key not configured." }, { status: 500 });
    }

    const body = await req.json();
    const { contentType, prompt, voiceId, personaId, existingContent } = body;

    if (!contentType || !prompt?.trim()) {
      return NextResponse.json({ error: "contentType and prompt are required" }, { status: 400 });
    }

    const config = CONTENT_TYPE_PROMPTS[contentType];
    if (!config) {
      return NextResponse.json({ error: `Unknown contentType: ${contentType}` }, { status: 400 });
    }

    const [voice, persona, knowledge] = await Promise.all([
      loadVoice(voiceId),
      loadPersona(personaId),
      loadKnowledge(),
    ]);

    const systemPrompt = [
      config.system,
      voice,
      persona,
      knowledge,
      `Return ONLY valid JSON with this structure (no markdown wrapping):\n${config.jsonShape}`,
    ].filter(Boolean).join("\n\n");

    const userPrompt = existingContent
      ? `EXISTING CONTENT:\n${existingContent}\n\nINSTRUCTIONS: ${prompt}`
      : prompt;

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
        messages: [{ role: "user", content: userPrompt }],
      }),
    });

    if (!anthropicResp.ok) {
      const err = await anthropicResp.text();
      return NextResponse.json({ error: err }, { status: 500 });
    }

    const data = await anthropicResp.json();
    const rawText = data.content?.[0]?.text || "{}";

    let result;
    try {
      result = JSON.parse(rawText);
    } catch {
      const jsonMatch = rawText.match(/[\[{][\s\S]*[\]}]/);
      result = jsonMatch ? JSON.parse(jsonMatch[0]) : null;
    }

    if (!result) {
      return NextResponse.json({ error: "AI returned invalid JSON" }, { status: 500 });
    }

    // Log usage
    try {
      const db = getDb();
      await db.execute({
        sql: `INSERT INTO ai_usage_log (action, model, input_tokens, output_tokens, duration_ms, metadata) VALUES (?, ?, ?, ?, ?, ?)`,
        args: [
          `ai_assist_${contentType}`,
          "claude-sonnet-4-6",
          data.usage?.input_tokens || 0,
          data.usage?.output_tokens || 0,
          Date.now() - startTime,
          JSON.stringify({ contentType, prompt: prompt.slice(0, 200) }),
        ],
      });
    } catch { /* non-critical */ }

    return NextResponse.json(result);
  } catch (err: unknown) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Unknown error" },
      { status: 500 }
    );
  }
}
