import { NextRequest, NextResponse } from "next/server";

/**
 * AI Content Generation API
 * Proxies requests to Anthropic Claude API for content generation.
 * Requires ANTHROPIC_API_KEY in environment variables.
 */

const BRAND_CONTEXT = `
You are an AI content assistant for NutraGLP, a biotech supplement company.

BRAND VOICE:
- Scientific credibility without clinical coldness
- Confident but never salesy. Earned authority.
- Speaks to intelligent consumers who do their own research
- Short declarative sentences. Paragraphs are tight.
- No guru energy. No hype words.

PRODUCT CONTEXT:
- NutraGLP makes Slim SHOT, a daily liquid supplement that activates the body's natural GLP-1 production
- Uses patented nanoemulsion delivery technology for bioavailability
- Positioned between pharmaceutical GLP-1 drugs (Ozempic, Wegovy) and typical supplements
- Key differentiators: natural ingredients, no injection, no prescription, patent-pending delivery system
- Founded by Richard Kaufman PhD (nanoemulsion expert) and Chris McCann (enterprise sales)
- Brand colors: forest green (#2D5F2B), cream (#F5F0E8), sage (#A8C5A0), ink (#1A1A1A)
- Fonts: Fraunces (headings), DM Sans (body)

IMPORTANT RULES:
- Never make medical claims. Always position as a dietary supplement.
- Use "may support" or "designed to" language, never "will" or "guarantees"
- Reference published research when possible
- Keep copy concise and scannable
- No exclamation marks in body copy
`;

interface GenerateRequest {
  action: "generate_block" | "rewrite" | "meta_description" | "page_from_brief" | "expand" | "shorten";
  blockType?: string;
  pageTitle?: string;
  existingContent?: string;
  existingBlocks?: Array<{ type: string; data: Record<string, unknown> }>;
  brief?: string;
  targetLength?: "short" | "medium" | "long";
}

function buildPrompt(req: GenerateRequest): string {
  const pageCtx = req.pageTitle ? `\nPage title: "${req.pageTitle}"` : "";
  const blocksCtx = req.existingBlocks?.length
    ? `\nExisting blocks on this page: ${req.existingBlocks.map((b) => b.type).join(", ")}`
    : "";

  switch (req.action) {
    case "generate_block":
      return `${BRAND_CONTEXT}${pageCtx}${blocksCtx}

Generate content for a "${req.blockType}" block.
${req.brief ? `Brief: ${req.brief}` : ""}

Return ONLY valid JSON matching this block's data schema. No markdown, no explanation.

Block schemas:
- hero: { "headline": string, "subheadline": string, "ctaText": string, "ctaUrl": string, "bgColor": "#2D5F2B", "textAlign": "center" }
- rich_text: { "html": string (HTML content with <h2>, <p>, <ul>, <strong> tags) }
- image_text: { "heading": string, "html": string, "imagePosition": "left"|"right", "bgColor": "" }
- cta_button: { "text": string, "url": string, "style": "primary"|"secondary"|"outline", "centered": true }
- stats_grid: { "stats": [{ "id": "1", "label": string, "value": string }], "columns": 3, "bgColor": "" }
- card_grid: { "cards": [{ "id": "1", "title": string, "description": string, "imageUrl": "", "ctaText": string, "ctaUrl": string }], "columns": 3, "bgColor": "" }
- faq_accordion: {}
- testimonials: { "style": "cards", "columns": 3 }
- spacer: { "height": "md" }
- divider: { "style": "solid", "spacing": "md" }
- video_embed: { "url": string, "title": string }

Return JSON only.`;

    case "rewrite":
      return `${BRAND_CONTEXT}${pageCtx}

Rewrite the following content in the NutraGLP brand voice. Keep the same structure and intent but improve clarity, tone, and persuasiveness.
${req.brief ? `Additional direction: ${req.brief}` : ""}

Content to rewrite:
${req.existingContent}

Return ONLY the rewritten content in the same format (HTML if the input was HTML, plain text if plain text). No explanation.`;

    case "meta_description":
      return `${BRAND_CONTEXT}${pageCtx}${blocksCtx}

Write an SEO meta description for this page. Requirements:
- 150-160 characters
- Include primary keyword naturally
- Compelling but not clickbaity
- Ends with a subtle call to action or value proposition

Return ONLY the meta description text. No quotes, no explanation.`;

    case "page_from_brief":
      return `${BRAND_CONTEXT}

Create a complete page layout from this brief:
${req.brief}

Return a JSON array of blocks. Each block: { "type": string, "data": object }

Use the block schemas listed above. Create a compelling page with appropriate block variety.
Target ${req.targetLength === "short" ? "3-5" : req.targetLength === "long" ? "8-12" : "5-8"} blocks.

Return ONLY the JSON array. No explanation.`;

    case "expand":
      return `${BRAND_CONTEXT}${pageCtx}

Expand the following content. Add more detail, examples, or supporting points while maintaining the brand voice.

Content to expand:
${req.existingContent}

Return ONLY the expanded content in the same format. No explanation.`;

    case "shorten":
      return `${BRAND_CONTEXT}${pageCtx}

Shorten the following content to roughly half its length. Keep the key message and brand voice intact. Cut redundancy, tighten sentences.

Content to shorten:
${req.existingContent}

Return ONLY the shortened content in the same format. No explanation.`;

    default:
      return `${BRAND_CONTEXT}\n${req.brief || "Generate helpful content for NutraGLP."}`;
  }
}

export async function POST(req: NextRequest) {
  try {
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "ANTHROPIC_API_KEY not configured. Add it to your environment variables." },
        { status: 500 }
      );
    }

    const body: GenerateRequest = await req.json();
    const prompt = buildPrompt(body);

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 2048,
        messages: [{ role: "user", content: prompt }],
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      return NextResponse.json(
        { error: `Anthropic API error: ${response.status} ${err}` },
        { status: 502 }
      );
    }

    const data = await response.json();
    const text = data.content?.[0]?.text || "";

    return NextResponse.json({ result: text });
  } catch (e: unknown) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
