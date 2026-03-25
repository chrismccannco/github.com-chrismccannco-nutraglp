import { getAIConfig, generateText } from "@/lib/ai-provider";
import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';

export const dynamic = 'force-dynamic';



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

    const aiConfig = await getAIConfig();
    if (!aiConfig) {
      return NextResponse.json(
        { error: "AI provider not configured. Add an API key in Settings → AI Integration." },
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

    const { text } = await generateText(
      aiConfig,
      [{ role: 'user', content: prompt }],
      1024
    );

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
