import { NextRequest, NextResponse } from "next/server";
import { getAIConfig, generateText, DEFAULT_MODELS, type AIProvider } from "@/lib/ai-provider";

export const dynamic = "force-dynamic";

/**
 * POST /api/ai/test
 * Verifies that the configured (or supplied) API key works by sending
 * a minimal generation request. Returns { ok, provider, model, latency_ms }.
 *
 * Body (all optional — falls back to site_settings):
 *   { provider, apiKey }
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const { provider: providerOverride, apiKey: keyOverride } = body as {
      provider?: string;
      apiKey?: string;
    };

    // If a key override is passed, build a temporary config directly
    // (so users can test a key before saving it)
    let config;
    const ALL_PROVIDERS: AIProvider[] = ["anthropic", "openai", "gemini", "perplexity"];

    if (providerOverride && keyOverride) {
      if (!ALL_PROVIDERS.includes(providerOverride as AIProvider)) {
        return NextResponse.json({ ok: false, error: "Unknown provider" }, { status: 400 });
      }
      config = {
        provider: providerOverride as AIProvider,
        model: DEFAULT_MODELS[providerOverride as AIProvider],
        apiKey: keyOverride,
      };
    } else {
      config = await getAIConfig({ providerOverride });
    }

    if (!config) {
      return NextResponse.json(
        { ok: false, error: "No API key configured for this provider." },
        { status: 400 }
      );
    }

    const start = Date.now();
    const { text } = await generateText(
      config,
      [{ role: "user", content: 'Reply with exactly the word "ok".' }],
      10
    );
    const latency = Date.now() - start;

    return NextResponse.json({
      ok: true,
      provider: config.provider,
      model: config.model,
      latency_ms: latency,
      response: text.trim().slice(0, 50),
    });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e);
    return NextResponse.json({ ok: false, error: msg }, { status: 200 });
  }
}
