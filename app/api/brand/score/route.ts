import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';

export const dynamic = 'force-dynamic';

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

interface BrandVoice {
  tagline: string;
  mission: string;
  tone: string;
  dos: string;
  donts: string;
  audience: string;
  example: string;
}

export async function POST(req: NextRequest) {
  try {
    const { content, brand } = (await req.json()) as { content: string; brand: BrandVoice };

    if (!content?.trim()) {
      return NextResponse.json({ error: 'No content provided' }, { status: 400 });
    }

    const apiKey = await getAnthropicKey();
    if (!apiKey) {
      return NextResponse.json(
        { error: 'Anthropic API key not configured. Add it in Admin → Settings → AI Integration.' },
        { status: 500 }
      );
    }

    const brandContext = [
      brand.tagline  && `Tagline: ${brand.tagline}`,
      brand.mission  && `Mission: ${brand.mission}`,
      brand.audience && `Audience: ${brand.audience}`,
      brand.tone     && `Tone keywords: ${brand.tone}`,
      brand.dos      && `Do:\n${brand.dos}`,
      brand.donts    && `Don't:\n${brand.donts}`,
      brand.example  && `Exemplar paragraph (the style anchor):\n"${brand.example}"`,
    ].filter(Boolean).join('\n\n');

    const prompt = `You are a brand consistency analyst. Analyze the content below against the brand guidelines and return a JSON score object.

${brandContext ? `BRAND GUIDELINES:\n${brandContext}\n\n` : '(No brand voice guidelines configured — score on general clarity and professionalism.)\n\n'}

CONTENT TO ANALYZE:
${content}

Return ONLY valid JSON with this exact shape — no markdown, no explanation:
{
  "overall": <integer 0-100>,
  "voice": <integer 0-100>,
  "clarity": <integer 0-100>,
  "summary": "<one sentence overall verdict, direct and specific>",
  "strengths": ["<specific strength>", "<specific strength>", "<specific strength>"],
  "improvements": ["<specific actionable fix>", "<specific actionable fix>", "<specific actionable fix>"],
  "rewrite": "<rewrite of the single weakest sentence, in the brand voice>"
}`;

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-6',
        max_tokens: 1024,
        messages: [{ role: 'user', content: prompt }],
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      throw new Error(`Anthropic API error: ${err}`);
    }

    const data = await response.json();
    const text = data.content?.[0]?.text || '';

    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error('No JSON found in Claude response');

    const result = JSON.parse(jsonMatch[0]);
    return NextResponse.json(result);
  } catch (err: unknown) {
    console.error('brand/score error:', err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
