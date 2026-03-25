import { NextRequest, NextResponse } from "next/server";

import { getAIConfig, generateText } from "@/lib/ai-provider";
import { requireRole } from "@/lib/admin-auth";
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
- Brand colors: deep indigo (#0a2463), blue (#0066cc), teal (#1585b5), gold (#c8962e)
- Fonts: Playfair Display (headings), Inter (body)

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
- hero: { "headline": string, "subheadline": string, "ctaText": string, "ctaUrl": string, "bgColor": "#1B3A5C", "textAlign": "center" }
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
  const { error: authError } = await requireRole(req, "editor");
  if (authError) return authError;
  try {
    const body: GenerateRequest & { providerOverride?: string; modelOverride?: string } = await req.json();
    const aiConfig = await getAIConfig({
      providerOverride: body.providerOverride,
      modelOverride: body.modelOverride,
    });
    if (!aiConfig) {
      return NextResponse.json(
        { error: "AI provider not configured. Add an API key in Settings → AI Integration." },
        { status: 500 }
      );
    }

    const prompt = buildPrompt(body);

    const { text } = await generateText(
      aiConfig,
      [{ role: "user", content: prompt }],
      2048
    );

    return NextResponse.json({ result: text });
  } catch (e: unknown) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
