import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";

export const dynamic = "force-dynamic";

async function getAnthropicKey(): Promise<string | null> {
  try {
    const db = getDb();
    const result = await db.execute(
      "SELECT value FROM settings WHERE key = 'anthropic_api_key'"
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

    // Build system prompt with voice + knowledge
    const voice = await getBrandVoice(template.voice_id as number | null);
    const knowledgeDocIds = JSON.parse((template.knowledge_doc_ids as string) || "[]");
    const knowledgeDocs = await getKnowledgeDocs(knowledgeDocIds);

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
        model: "claude-sonnet-4-5-20250514",
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

    return new NextResponse(anthropicResp.body, {
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
