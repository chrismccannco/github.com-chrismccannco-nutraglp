import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';

export const dynamic = 'force-dynamic';

async function getAnthropicKey(): Promise<string | null> {
  try {
    const db = getDb();
    const result = await db.execute(
      "SELECT value FROM settings WHERE key = 'anthropic_api_key'"
    );
    if (result.rows.length > 0 && result.rows[0].value) {
      return result.rows[0].value as string;
    }
  } catch { /* fall through */ }
  return process.env.ANTHROPIC_API_KEY || null;
}

type WriteMode =
  | 'full_post'
  | 'introduction'
  | 'outline'
  | 'headlines'
  | 'meta_description'
  | 'continue'
  | 'rewrite'
  | 'shorter'
  | 'expand';

interface WriteRequest {
  mode: WriteMode;
  topic?: string;
  existing?: string;
  keywords?: string;
  tone?: string;
  voiceId?: number;
  knowledgeDocIds?: number[];
}

async function getBrandVoice(voiceId?: number): Promise<Record<string, string>> {
  const db = getDb();
  try {
    // Try brand_voices table first
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
    if (row) {
      const mapped: Record<string, string> = {};
      if (row.mission) mapped.brand_voice_mission = row.mission as string;
      if (row.audience) mapped.brand_voice_audience = row.audience as string;
      if (row.tone) mapped.brand_voice_tone = row.tone as string;
      if (row.dos) mapped.brand_voice_dos = row.dos as string;
      if (row.donts) mapped.brand_voice_donts = row.donts as string;
      if (row.exemplar) mapped.brand_voice_example = row.exemplar as string;
      return mapped;
    }
  } catch {
    /* fall through to legacy */
  }

  // Legacy: read from site_settings
  try {
    const result = await db.execute(
      "SELECT key, value FROM settings WHERE key LIKE 'brand_voice_%'"
    );
    const s: Record<string, string> = {};
    for (const r of result.rows) {
      if (r.key && r.value) s[r.key as string] = r.value as string;
    }
    return s;
  } catch {
    return {};
  }
}

async function getKnowledgeDocs(docIds?: number[]): Promise<string[]> {
  if (!docIds || docIds.length === 0) return [];
  const db = getDb();
  try {
    const placeholders = docIds.map(() => '?').join(',');
    const result = await db.execute({
      sql: `SELECT title, content FROM knowledge_docs WHERE id IN (${placeholders}) AND enabled = 1`,
      args: docIds.map(Number),
    });
    return result.rows.map(r => `[${r.title}]\n${r.content}`);
  } catch {
    return [];
  }
}

function buildSystemPrompt(voice: Record<string, string>, knowledgeDocs: string[]): string {
  const parts = [
    'You are a skilled content writer embedded in a headless CMS.',
    'Write content that is publication-ready — not a draft, not an outline unless asked.',
  ];

  if (voice.brand_voice_mission)  parts.push(`Brand mission: ${voice.brand_voice_mission}`);
  if (voice.brand_voice_audience) parts.push(`Audience: ${voice.brand_voice_audience}`);
  if (voice.brand_voice_tone)     parts.push(`Tone: ${voice.brand_voice_tone}`);
  if (voice.brand_voice_dos)      parts.push(`Do:\n${voice.brand_voice_dos}`);
  if (voice.brand_voice_donts)    parts.push(`Don't:\n${voice.brand_voice_donts}`);
  if (voice.brand_voice_example)  parts.push(`Style anchor — write like this:\n"${voice.brand_voice_example}"`);

  if (knowledgeDocs.length > 0) {
    parts.push('KNOWLEDGE BASE — use the following reference documents as your source of truth. Cite facts from them. Do not invent information that contradicts them.');
    parts.push(knowledgeDocs.join('\n\n---\n\n'));
  }

  parts.push('Return only the content itself. No preamble, no "Here is your post:", no markdown headers unless the content calls for them.');

  return parts.join('\n\n');
}

function buildUserPrompt(req: WriteRequest): string {
  const { mode, topic, existing, keywords, tone } = req;
  const kw = keywords ? ` Target keywords: ${keywords}.` : '';
  const tn = tone ? ` Tone override: ${tone}.` : '';

  switch (mode) {
    case 'full_post':
      return `Write a complete blog post about: ${topic}.${kw}${tn}\n\nInclude a compelling headline, introduction, 3-5 substantive sections, and a closing paragraph. No filler.`;

    case 'introduction':
      return `Write a strong opening paragraph for a blog post about: ${topic}.${kw}${tn}\n\nMake the reader need to keep reading. No rhetorical questions as hooks.`;

    case 'outline':
      return `Create a detailed blog post outline for: ${topic}.${kw}${tn}\n\nInclude headline options, section headings, and 2-3 bullet points per section describing what each covers.`;

    case 'headlines':
      return `Generate 8 headline options for a blog post about: ${topic}.${kw}${tn}\n\nVary the formats — some direct, some specific, some with numbers. No clickbait.`;

    case 'meta_description':
      return `Write a meta description (150-160 characters) for a page about: ${topic}.${kw}\n\nMake it accurate and compelling. Return only the description text.`;

    case 'continue':
      return `Continue writing from where this stops. Match the style and momentum exactly:\n\n${existing}`;

    case 'rewrite':
      return `Rewrite the following in the brand voice. Keep all the information, improve the expression:\n\n${existing}`;

    case 'shorter':
      return `Make this shorter and tighter. Cut filler, keep the substance:\n\n${existing}`;

    case 'expand':
      return `Expand this into a fuller treatment. Add depth, examples, and texture without padding:\n\n${existing}`;

    default:
      return `Write about: ${topic}`;
  }
}

export async function POST(req: NextRequest) {
  try {
    const apiKey = await getAnthropicKey();
    if (!apiKey) {
      return NextResponse.json(
        { error: 'Anthropic API key not configured. Add it in Admin → Settings → AI Integration.' },
        { status: 500 }
      );
    }

    const body = (await req.json()) as WriteRequest;
    const voice = await getBrandVoice(body.voiceId);
    const knowledgeDocs = await getKnowledgeDocs(body.knowledgeDocIds);

    const systemPrompt = buildSystemPrompt(voice, knowledgeDocs);
    const userPrompt = buildUserPrompt(body);

    // Stream the response
    const anthropicResp = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
        'anthropic-beta': 'messages-2023-12-15',
      },
      body: JSON.stringify({
        model: 'claude-opus-4-5',
        max_tokens: 2048,
        system: systemPrompt,
        stream: true,
        messages: [{ role: 'user', content: userPrompt }],
      }),
    });

    if (!anthropicResp.ok) {
      const err = await anthropicResp.text();
      return NextResponse.json({ error: err }, { status: 500 });
    }

    // Pass the stream straight through to the client
    return new NextResponse(anthropicResp.body, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
        'Access-Control-Allow-Origin': '*',
      },
    });
  } catch (err: unknown) {
    console.error('ai/write error:', err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
