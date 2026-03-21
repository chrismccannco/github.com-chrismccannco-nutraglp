import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { getAIConfig, streamText } from "@/lib/ai-provider";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

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
 * Universal AI content generation endpoint — streams the response to avoid timeouts.
 * Body: { contentType, prompt, voiceId?, personaId?, existingContent? }
 */
export async function POST(req: NextRequest) {
  try {
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

    const aiConfig = await getAIConfig();
    if (!aiConfig) {
      return NextResponse.json(
        { error: "AI provider not configured. Add an API key in Settings → AI Integration." },
        { status: 500 }
      );
    }

    // Stream through the provider abstraction — keeps connection alive,
    // avoids Netlify 10s timeout, works with any provider.
    const encoder = new TextEncoder();

    const stream = new ReadableStream({
      async start(controller) {
        let fullText = "";

        try {
          for await (const chunk of streamText(
            aiConfig,
            [
              { role: "system", content: systemPrompt },
              { role: "user", content: userPrompt },
            ],
            4096
          )) {
            fullText += chunk;
            controller.enqueue(
              encoder.encode(`data: {"type":"progress","len":${fullText.length}}\n\n`)
            );
          }

          // Parse the accumulated text as JSON
          let result;
          // Strip markdown code fences if present
          let cleaned = fullText.trim();
          if (cleaned.startsWith("```")) {
            cleaned = cleaned.replace(/^```(?:json)?\s*/, "").replace(/\s*```$/, "");
          }
          try {
            result = JSON.parse(cleaned);
          } catch {
            // Try to extract the outermost JSON object or array
            const jsonMatch = cleaned.match(/[\[{][\s\S]*[\]}]/);
            if (jsonMatch) {
              try {
                result = JSON.parse(jsonMatch[0]);
              } catch {
                result = null;
              }
            }
          }

          if (!result) {
            controller.enqueue(
              encoder.encode(`data: ${JSON.stringify({ type: "error", error: "AI returned invalid JSON. Try again with a simpler prompt." })}\n\n`)
            );
          } else {
            // Send the final result as a base64-encoded payload to avoid SSE line-splitting issues
            const resultJson = JSON.stringify(result);
            const b64 = Buffer.from(resultJson).toString("base64");
            controller.enqueue(
              encoder.encode(`data: {"type":"result_b64","data":"${b64}"}\n\n`)
            );
          }
        } catch (e) {
          controller.enqueue(
            encoder.encode(`data: ${JSON.stringify({ type: "error", error: e instanceof Error ? e.message : "Stream error" })}\n\n`)
          );
        } finally {
          controller.enqueue(encoder.encode("data: [DONE]\n\n"));
          controller.close();

          // Log AI usage (fire and forget)
          try {
            const db = getDb();
            await db.execute({
              sql: `INSERT INTO ai_usage_log (action, model, input_tokens, output_tokens, duration_ms, metadata) VALUES (?, ?, ?, ?, ?, ?)`,
              args: [
                `ai_assist_${contentType}`,
                `${aiConfig.provider}/${aiConfig.model}`,
                0,
                0,
                Date.now() - startTime,
                JSON.stringify({ contentType, prompt: prompt.slice(0, 200) }),
              ],
            });
          } catch { /* non-critical */ }
        }
      },
    });

    return new NextResponse(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (err: unknown) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Unknown error" },
      { status: 500 }
    );
  }
}
