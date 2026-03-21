/**
 * Unified AI provider abstraction.
 * Supports Anthropic (Claude), OpenAI (ChatGPT), Google Gemini, and Perplexity.
 *
 * All routes that call an LLM should import `getAIConfig` and `generateText`
 * (or `streamText`) instead of calling any provider API directly.
 *
 * Provider preference and API keys are stored in site_settings:
 *   ai_provider       — "anthropic" | "openai" | "gemini" | "perplexity"
 *   ai_model          — model string (optional; falls back to DEFAULT_MODELS)
 *   anthropic_api_key
 *   openai_api_key
 *   gemini_api_key
 *   perplexity_api_key
 */

import { getDb } from "./db";

// ── Types ────────────────────────────────────────────────────────────────────

export type AIProvider = "anthropic" | "openai" | "gemini" | "perplexity";

export interface AIConfig {
  provider: AIProvider;
  model: string;
  apiKey: string;
}

export interface AIMessage {
  role: "user" | "assistant" | "system";
  content: string;
}

export interface AIResponse {
  text: string;
  provider: AIProvider;
  model: string;
}

// ── Defaults ─────────────────────────────────────────────────────────────────

export const DEFAULT_MODELS: Record<AIProvider, string> = {
  anthropic: "claude-sonnet-4-20250514",
  openai: "gpt-4o",
  gemini: "gemini-2.0-flash",
  perplexity: "llama-3.1-sonar-large-128k-online",
};

export const PROVIDER_LABELS: Record<AIProvider, string> = {
  anthropic: "Claude (Anthropic)",
  openai: "ChatGPT (OpenAI)",
  gemini: "Gemini (Google)",
  perplexity: "Perplexity",
};

// ── Config resolution ─────────────────────────────────────────────────────────

/**
 * Reads active provider + API key from site_settings, falls back to env vars.
 * Returns null if no key is configured for the active provider.
 */
export async function getAIConfig(): Promise<AIConfig | null> {
  let provider: AIProvider = "anthropic";
  let model = "";
  const keys: Partial<Record<AIProvider, string>> = {};

  try {
    const db = getDb();
    const result = await db.execute(
      `SELECT key, value FROM site_settings WHERE key IN (
        'ai_provider','ai_model',
        'anthropic_api_key','openai_api_key','gemini_api_key','perplexity_api_key'
      )`
    );
    for (const row of result.rows) {
      const k = row.key as string;
      const v = row.value as string;
      if (k === "ai_provider" && v) provider = v as AIProvider;
      else if (k === "ai_model" && v) model = v;
      else if (k === "anthropic_api_key" && v) keys.anthropic = v;
      else if (k === "openai_api_key" && v) keys.openai = v;
      else if (k === "gemini_api_key" && v) keys.gemini = v;
      else if (k === "perplexity_api_key" && v) keys.perplexity = v;
    }
  } catch {
    // DB unavailable — fall through to env vars
  }

  // Env var fallbacks
  if (!keys.anthropic) keys.anthropic = process.env.ANTHROPIC_API_KEY || "";
  if (!keys.openai) keys.openai = process.env.OPENAI_API_KEY || "";
  if (!keys.gemini) keys.gemini = process.env.GEMINI_API_KEY || "";
  if (!keys.perplexity) keys.perplexity = process.env.PERPLEXITY_API_KEY || "";

  const apiKey = keys[provider] || "";
  if (!apiKey) return null;

  return {
    provider,
    model: model || DEFAULT_MODELS[provider],
    apiKey,
  };
}

// ── Non-streaming generation ──────────────────────────────────────────────────

export async function generateText(
  config: AIConfig,
  messages: AIMessage[],
  maxTokens = 2048
): Promise<AIResponse> {
  switch (config.provider) {
    case "anthropic":
      return callAnthropic(config, messages, maxTokens);
    case "openai":
      return callOpenAI(config, messages, maxTokens);
    case "gemini":
      return callGemini(config, messages, maxTokens);
    case "perplexity":
      return callPerplexity(config, messages, maxTokens);
    default:
      throw new Error(`Unknown AI provider: ${config.provider}`);
  }
}

// ── Streaming generation ──────────────────────────────────────────────────────

/**
 * Yields text chunks as they arrive. Use for streaming responses.
 */
export async function* streamText(
  config: AIConfig,
  messages: AIMessage[],
  maxTokens = 4096
): AsyncGenerator<string> {
  switch (config.provider) {
    case "anthropic":
      yield* streamAnthropic(config, messages, maxTokens);
      break;
    case "openai":
      yield* streamOpenAI(config, messages, maxTokens);
      break;
    case "gemini":
      // Gemini streaming uses the same SSE format
      yield* streamGemini(config, messages, maxTokens);
      break;
    case "perplexity":
      // Perplexity is OpenAI-compatible
      yield* streamOpenAICompat(
        config,
        messages,
        maxTokens,
        "https://api.perplexity.ai/chat/completions"
      );
      break;
    default:
      throw new Error(`Unknown AI provider: ${config.provider}`);
  }
}

// ── Anthropic ─────────────────────────────────────────────────────────────────

async function callAnthropic(
  config: AIConfig,
  messages: AIMessage[],
  maxTokens: number
): Promise<AIResponse> {
  // Extract system message if present
  const system = messages.find((m) => m.role === "system")?.content;
  const userMessages = messages
    .filter((m) => m.role !== "system")
    .map((m) => ({ role: m.role, content: m.content }));

  const body: Record<string, unknown> = {
    model: config.model,
    max_tokens: maxTokens,
    messages: userMessages,
  };
  if (system) body.system = system;

  const resp = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": config.apiKey,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify(body),
  });

  if (!resp.ok) {
    const err = await resp.text();
    throw new Error(`Anthropic error ${resp.status}: ${err}`);
  }

  const data = await resp.json();
  return {
    text: data.content?.[0]?.text ?? "",
    provider: "anthropic",
    model: config.model,
  };
}

async function* streamAnthropic(
  config: AIConfig,
  messages: AIMessage[],
  maxTokens: number
): AsyncGenerator<string> {
  const system = messages.find((m) => m.role === "system")?.content;
  const userMessages = messages.filter((m) => m.role !== "system");

  const body: Record<string, unknown> = {
    model: config.model,
    max_tokens: maxTokens,
    stream: true,
    messages: userMessages,
  };
  if (system) body.system = system;

  const resp = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": config.apiKey,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify(body),
  });

  if (!resp.ok) {
    const err = await resp.text();
    throw new Error(`Anthropic stream error ${resp.status}: ${err}`);
  }

  const reader = resp.body!.getReader();
  const decoder = new TextDecoder();
  let buffer = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split("\n");
    buffer = lines.pop() ?? "";
    for (const line of lines) {
      if (!line.startsWith("data: ")) continue;
      const data = line.slice(6).trim();
      if (data === "[DONE]") return;
      try {
        const parsed = JSON.parse(data);
        const chunk = parsed.delta?.text ?? "";
        if (chunk) yield chunk;
      } catch {
        // skip malformed chunks
      }
    }
  }
}

// ── OpenAI ────────────────────────────────────────────────────────────────────

async function callOpenAI(
  config: AIConfig,
  messages: AIMessage[],
  maxTokens: number
): Promise<AIResponse> {
  const resp = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${config.apiKey}`,
    },
    body: JSON.stringify({
      model: config.model,
      max_tokens: maxTokens,
      messages: messages.map((m) => ({ role: m.role, content: m.content })),
    }),
  });

  if (!resp.ok) {
    const err = await resp.text();
    throw new Error(`OpenAI error ${resp.status}: ${err}`);
  }

  const data = await resp.json();
  return {
    text: data.choices?.[0]?.message?.content ?? "",
    provider: "openai",
    model: config.model,
  };
}

async function* streamOpenAI(
  config: AIConfig,
  messages: AIMessage[],
  maxTokens: number
): AsyncGenerator<string> {
  yield* streamOpenAICompat(
    config,
    messages,
    maxTokens,
    "https://api.openai.com/v1/chat/completions"
  );
}

// OpenAI-compatible streaming (OpenAI + Perplexity share the same SSE format)
async function* streamOpenAICompat(
  config: AIConfig,
  messages: AIMessage[],
  maxTokens: number,
  endpoint: string
): AsyncGenerator<string> {
  const resp = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${config.apiKey}`,
    },
    body: JSON.stringify({
      model: config.model,
      max_tokens: maxTokens,
      stream: true,
      messages: messages.map((m) => ({ role: m.role, content: m.content })),
    }),
  });

  if (!resp.ok) {
    const err = await resp.text();
    throw new Error(`AI stream error ${resp.status}: ${err}`);
  }

  const reader = resp.body!.getReader();
  const decoder = new TextDecoder();
  let buffer = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split("\n");
    buffer = lines.pop() ?? "";
    for (const line of lines) {
      if (!line.startsWith("data: ")) continue;
      const data = line.slice(6).trim();
      if (data === "[DONE]") return;
      try {
        const parsed = JSON.parse(data);
        const chunk = parsed.choices?.[0]?.delta?.content ?? "";
        if (chunk) yield chunk;
      } catch {
        // skip malformed chunks
      }
    }
  }
}

// ── Perplexity ────────────────────────────────────────────────────────────────

async function callPerplexity(
  config: AIConfig,
  messages: AIMessage[],
  maxTokens: number
): Promise<AIResponse> {
  const resp = await fetch("https://api.perplexity.ai/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${config.apiKey}`,
    },
    body: JSON.stringify({
      model: config.model,
      max_tokens: maxTokens,
      messages: messages.map((m) => ({ role: m.role, content: m.content })),
    }),
  });

  if (!resp.ok) {
    const err = await resp.text();
    throw new Error(`Perplexity error ${resp.status}: ${err}`);
  }

  const data = await resp.json();
  return {
    text: data.choices?.[0]?.message?.content ?? "",
    provider: "perplexity",
    model: config.model,
  };
}

// ── Gemini ────────────────────────────────────────────────────────────────────

async function callGemini(
  config: AIConfig,
  messages: AIMessage[],
  maxTokens: number
): Promise<AIResponse> {
  // Gemini uses a different message format — system becomes a separate field
  const systemInstruction = messages.find((m) => m.role === "system")?.content;
  const contents = messages
    .filter((m) => m.role !== "system")
    .map((m) => ({
      role: m.role === "assistant" ? "model" : "user",
      parts: [{ text: m.content }],
    }));

  const body: Record<string, unknown> = {
    contents,
    generationConfig: { maxOutputTokens: maxTokens },
  };
  if (systemInstruction) {
    body.systemInstruction = { parts: [{ text: systemInstruction }] };
  }

  const url = `https://generativelanguage.googleapis.com/v1beta/models/${config.model}:generateContent?key=${config.apiKey}`;

  const resp = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!resp.ok) {
    const err = await resp.text();
    throw new Error(`Gemini error ${resp.status}: ${err}`);
  }

  const data = await resp.json();
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text ?? "";
  return { text, provider: "gemini", model: config.model };
}

async function* streamGemini(
  config: AIConfig,
  messages: AIMessage[],
  maxTokens: number
): AsyncGenerator<string> {
  const systemInstruction = messages.find((m) => m.role === "system")?.content;
  const contents = messages
    .filter((m) => m.role !== "system")
    .map((m) => ({
      role: m.role === "assistant" ? "model" : "user",
      parts: [{ text: m.content }],
    }));

  const body: Record<string, unknown> = {
    contents,
    generationConfig: { maxOutputTokens: maxTokens },
  };
  if (systemInstruction) {
    body.systemInstruction = { parts: [{ text: systemInstruction }] };
  }

  const url = `https://generativelanguage.googleapis.com/v1beta/models/${config.model}:streamGenerateContent?alt=sse&key=${config.apiKey}`;

  const resp = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!resp.ok) {
    const err = await resp.text();
    throw new Error(`Gemini stream error ${resp.status}: ${err}`);
  }

  const reader = resp.body!.getReader();
  const decoder = new TextDecoder();
  let buffer = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split("\n");
    buffer = lines.pop() ?? "";
    for (const line of lines) {
      if (!line.startsWith("data: ")) continue;
      const data = line.slice(6).trim();
      if (data === "[DONE]") return;
      try {
        const parsed = JSON.parse(data);
        const chunk = parsed.candidates?.[0]?.content?.parts?.[0]?.text ?? "";
        if (chunk) yield chunk;
      } catch {
        // skip malformed chunks
      }
    }
  }
}
