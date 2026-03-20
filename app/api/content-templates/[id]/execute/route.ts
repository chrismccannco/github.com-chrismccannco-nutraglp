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

async function getBrandVoice(voiceId: number | null) {
  if (!voiceId) return {};
  const db = getDb();
  try {
    const result = await db.execute({
      sql: "SELECT * FROM brand_voices WHERE id = ?",
      args: [voiceId],
    });
    const row = result.rows[0];
    if (!row) return {};
    const mapped: Record<string, string> = {};
    if (row.mission) mapped.mission = row.mission as string;
    if (row.audience) mapped.audience = row.audience as string;
    if (row.tone) mapped.tone = row.tone as string;
    if (row.dos) mapped.dos = row.dos as string;
    if (row.donts) mapped.donts = row.donts as string;
    if (row.exemplar) mapped.exemplar = row.exemplar as string;
    return mapped;
  } catch {
    return {};
  }
}

async function getKnowledgeDocs(docIds: number[]) {
  if (docIds.length === 0) return [];
  const db = getDb();
  try {
    const placeholders = docIds.map(() => "?").join(",");
    const result = await db.execute({
      sql: `SELECT title, content FROM knowledge_docs WHERE id IN (${placeholders}) AND enabled = 1`,
      args: docIds.map(Number),
    });
    return result.rows.map((r) => `[${r.title}]\n${r.content}`);
  } catch {
    return [];
  }
}

// POST /api/content-templates/:id/execute
// Body: { variables: { key: value } }
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const apiKey = await getAnthropicKey();
    if (!apiKey) {
      return NextResponse.json(
        { error: "Anthropic API key not configured." },
        { status: 500 }
      );
    }

    const db = getDb();
    const templateResult = await db.execute({
      sql: "SELECT * FROM content_templates WHERE id = ?",
      args: [Number(id)],
    });
    if (templateResult.rows.length === 0) {
      return NextResponse.json({ error: "Template not found" }, { status: 404 });
    }
    const template = templateResult.rows[0];

    const body = await req.json();
    const vars = (body.variables || {}) as Record<string, string>;

    // Substitute variables into prompt template
    let prompt = template.prompt_template as string;
    for (const [key, value] of Object.entries(vars)) {
      prompt = prompt.replace(new RegExp(`\\{\\{${key}\\}\\}`, "g"), value);
    }

    // Build system prompt with voice + persona + knowledge
    const voice = await getBrandVoice(template.voice_id as number | null);
    const knowledgeDocIds = JSON.parse((template.knowledge_doc_ids as string) || "[]");
    const knowledgeDocs = await getKnowledgeDocs(knowledgeDocIds);

    // Load persona if set on template or passed in request
    const personaId = (body.personaId as number | undefined) || (template.persona_id as number | null);
    let persona: Record<string, string> | null = null;
    if (personaId) {
      try {
        const pResult = await db.execute({
          sql: "SELECT * FROM audience_personas WHERE id = ?",
          args: [Number(personaId)],
        });
        const pRow = pResult.rows[0];
        if (pRow) {
          persona = {};
          if (pRow.name) persona.name = pRow.name as string;
          if (pRow.description) persona.description = pRow.description as string;
          if (pRow.demographics) persona.demographics = pRow.demographics as string;
          if (pRow.goals) persona.goals = pRow.goals as string;
          if (pRow.pain_points) persona.pain_points = pRow.pain_points as string;
          if (pRow.communication_style) persona.communication_style = pRow.communication_style as string;
          if (pRow.objections) persona.objections = pRow.objections as string;
        }
      } catch { /* ignore */ }
    }

    const systemParts = [
      "You are a skilled content writer embedded in a headless CMS.",
      "Write content that is publication-ready.",
    ];
    if (voice.mission) systemParts.push(`Brand mission: ${voice.mission}`);
    if (voice.audience) systemParts.push(`Audience: ${voice.audience}`);
    if (voice.tone) systemParts.push(`Tone: ${voice.tone}`);
    if (voice.dos) systemParts.push(`Do:\n${voice.dos}`);
    if (voice.donts) systemParts.push(`Don't:\n${voice.donts}`);
    if (voice.exemplar) systemParts.push(`Style anchor:\n"${voice.exemplar}"`);
    if (persona) {
      const pp = [`TARGET AUDIENCE PERSONA: ${persona.name}`];
      if (persona.description) pp.push(`Profile: ${persona.description}`);
      if (persona.demographics) pp.push(`Demographics: ${persona.demographics}`);
      if (persona.goals) pp.push(`Goals: ${persona.goals}`);
      if (persona.pain_points) pp.push(`Pain points: ${persona.pain_points}`);
      if (persona.communication_style) pp.push(`Communication preferences: ${persona.communication_style}`);
      if (persona.objections) pp.push(`Common objections: ${persona.objections}`);
      pp.push("Tailor the content to speak directly to this persona.");
      systemParts.push(pp.join("\n"));
    }
    if (knowledgeDocs.length > 0) {
      systemParts.push(
        "KNOWLEDGE BASE — use these as source of truth:",
        knowledgeDocs.join("\n\n---\n\n")
      );
    }
    const outputFormat = template.output_format as string;
    if (outputFormat === "json") {
      systemParts.push("Return valid JSON only. No markdown wrapping.");
    } else if (outputFormat === "html") {
      systemParts.push("Return clean HTML. No markdown. No wrapping code blocks.");
    }
    systemParts.push(
      'Return only the content itself. No preamble, no "Here is your content:".'
    );

    // Stream response
    const anthropicResp = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
        "anthropic-beta": "messages-2023-12-15",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-6",
        max_tokens: (template.max_tokens as number) || 1024,
        system: systemParts.join("\n\n"),
        stream: true,
        messages: [{ role: "user", content: prompt }],
      }),
    });

    if (!anthropicResp.ok) {
      const err = await anthropicResp.text();
      return NextResponse.json({ error: err }, { status: 500 });
    }

    // Wrap the stream to capture usage from the final SSE event
    const startTime = Date.now();
    const reader = anthropicResp.body!.getReader();
    const stream = new ReadableStream({
      async start(controller) {
        const decoder = new TextDecoder();
        let usageData: { input_tokens?: number; output_tokens?: number } = {};
        try {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            controller.enqueue(value);
            // Parse SSE chunks to extract usage from message_delta or message_stop
            const text = decoder.decode(value, { stream: true });
            const lines = text.split("\n");
            for (const line of lines) {
              if (line.startsWith("data: ")) {
                try {
                  const data = JSON.parse(line.slice(6));
                  if (data.type === "message_start" && data.message?.usage) {
                    usageData.input_tokens = data.message.usage.input_tokens;
                  }
                  if (data.type === "message_delta" && data.usage) {
                    usageData.output_tokens = data.usage.output_tokens;
                  }
                } catch { /* not valid JSON line */ }
              }
            }
          }
        } finally {
          controller.close();
          // Log AI usage after stream completes
          try {
            const duration = Date.now() - startTime;
            const db = getDb();
            await db.execute({
              sql: `INSERT INTO ai_usage_log (action, template_id, template_name, voice_id, persona_id, model, input_tokens, output_tokens, duration_ms, metadata) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
              args: [
                "template_execute",
                Number(id),
                (template.name as string) || null,
                (template.voice_id as number) || null,
                personaId || null,
                "claude-sonnet-4-6",
                usageData.input_tokens || 0,
                usageData.output_tokens || 0,
                duration,
                JSON.stringify({ max_tokens: (template.max_tokens as number) || 1024 }),
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
