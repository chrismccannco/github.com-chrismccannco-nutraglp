import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

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

async function getBrandVoicePrompt(voiceId?: number): Promise<string> {
  const db = getDb();
  try {
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
    if (!row) return "";
    const parts: string[] = [];
    if (row.tone) parts.push(`Tone: ${row.tone}`);
    if (row.dos) parts.push(`Do:\n${row.dos}`);
    if (row.donts) parts.push(`Don't:\n${row.donts}`);
    if (row.exemplar) parts.push(`Style anchor:\n"${row.exemplar}"`);
    return parts.join("\n\n");
  } catch {
    return "";
  }
}

const FORMAT_CATEGORIES: Record<string, string> = {
  linkedin: "LinkedIn",
  twitter: "Twitter/X",
  instagram: "Instagram",
  tiktok: "TikTok",
  youtube: "YouTube",
  facebook: "Facebook",
  email: "Email",
  seo: "SEO & Blog",
};

const FORMATS = {
  // LinkedIn
  linkedin_post: {
    label: "LinkedIn Post",
    category: "linkedin",
    instruction: "Write a LinkedIn post. 150-250 words. Professional but not stiff. Hook in the first line. End with a thought-provoking observation. No hashtags unless they add real value. No emojis.",
  },
  linkedin_article: {
    label: "LinkedIn Article",
    category: "linkedin",
    instruction: "Write a LinkedIn article (600-1000 words). Professional tone. Strong headline. Subheadings for scannability. Personal angle — first person, draws from the source material but adds perspective. End with a clear takeaway.",
  },
  linkedin_carousel: {
    label: "LinkedIn Carousel (Slides)",
    category: "linkedin",
    instruction: "Write content for a 8-10 slide LinkedIn carousel. Slide 1 is the hook/title. Each subsequent slide has a short heading and 1-2 sentences. Last slide is CTA. Format as: [Slide 1] heading // body, [Slide 2] heading // body, etc. Keep each slide under 40 words.",
  },

  // Twitter/X
  twitter_thread: {
    label: "Twitter/X Thread",
    category: "twitter",
    instruction: "Write a 5-8 tweet thread. Each tweet under 280 characters. First tweet is the hook. Number them (1/). Each tweet stands alone but builds momentum. No hashtags. Last tweet has a takeaway or CTA.",
  },
  twitter_standalone: {
    label: "Twitter/X Standalone Tweets (5)",
    category: "twitter",
    instruction: "Write 5 standalone tweets, each under 280 characters. Each should work independently — not a thread. Vary the formats: one hot take, one data point, one question, one contrarian angle, one quotable line. No hashtags.",
  },

  // Instagram
  instagram_caption: {
    label: "Instagram Post Caption",
    category: "instagram",
    instruction: "Write an Instagram post caption. 150-200 words. Break into short paragraphs for readability. Conversational but substantive. End with a call to action (comment, save, share). Add 15-20 relevant hashtags at the very end, separated by a line break.",
  },
  instagram_carousel: {
    label: "Instagram Carousel (Slides)",
    category: "instagram",
    instruction: "Write content for a 7-10 slide Instagram carousel. Slide 1 is an attention-grabbing title. Slides 2-9 deliver one key point each with a bold heading and 1-2 sentences. Slide 10 is a CTA. Format as: [Slide 1] text, [Slide 2] text, etc. Each slide under 30 words. More visual, less text than LinkedIn.",
  },
  instagram_reel_caption: {
    label: "Instagram Reel Caption",
    category: "instagram",
    instruction: "Write a caption for an Instagram Reel. Under 125 characters for the hook line (shown before 'more'). Total caption 50-100 words. Include 10-15 hashtags. Casual, direct tone. CTA to follow or save.",
  },
  instagram_stories: {
    label: "Instagram Stories Sequence",
    category: "instagram",
    instruction: "Write a 5-7 story sequence. Each story is a single screen with minimal text (under 20 words). Story 1: hook/question. Stories 2-5: key points. Story 6: poll or question sticker prompt. Story 7: CTA (swipe up, link in bio). Format as [Story 1], [Story 2], etc.",
  },

  // TikTok
  tiktok_caption: {
    label: "TikTok Video Caption",
    category: "tiktok",
    instruction: "Write a TikTok video caption. Hook in the first 3 words. Under 150 characters for the main text. Include 3-5 relevant hashtags including one trending format hashtag. Casual, direct, slightly provocative tone.",
  },
  tiktok_hook_variations: {
    label: "TikTok Hook Variations (5)",
    category: "tiktok",
    instruction: "Write 5 different TikTok hook lines (the first thing said or shown in the video). Each under 10 words. Vary the formats: controversial take, 'nobody talks about', 'the reason why', direct challenge, pattern interrupt. These need to stop the scroll in under 2 seconds.",
  },

  // YouTube
  youtube_title_description: {
    label: "YouTube Title + Description",
    category: "youtube",
    instruction: "Write a YouTube video title (under 60 characters, compelling, slightly curiosity-driven) and full description. Description should be 200-300 words with: 2-3 sentence hook, key topics covered with timestamps placeholder (00:00 format), relevant links section placeholder, and 10-15 SEO tags. Format clearly with TITLE: and DESCRIPTION: sections.",
  },
  youtube_shorts_caption: {
    label: "YouTube Shorts Caption",
    category: "youtube",
    instruction: "Write a YouTube Shorts title (under 60 characters, hooks immediately) and a 1-2 sentence description. Include 5 hashtags. The title should work as both a search result and a scroll-stopper.",
  },
  youtube_timestamps: {
    label: "YouTube Timestamps/Chapters",
    category: "youtube",
    instruction: "Create YouTube chapter timestamps from this content. Format as 00:00 - Chapter Title. Identify 8-12 natural section breaks. First chapter must start at 00:00. Each chapter title under 50 characters, descriptive and search-friendly.",
  },
  youtube_community_post: {
    label: "YouTube Community Post",
    category: "youtube",
    instruction: "Write a YouTube community post (under 500 characters) teasing or summarizing this content. Include a question to drive comments. Casual tone that matches a creator talking to their audience.",
  },

  // Facebook
  facebook_post: {
    label: "Facebook Post",
    category: "facebook",
    instruction: "Write a Facebook post. 100-200 words. Conversational, warm tone. Hook in the first line (Facebook truncates after ~3 lines). Can be slightly longer and more narrative than other platforms. End with a question to encourage comments.",
  },
  facebook_reel_caption: {
    label: "Facebook Reel Caption",
    category: "facebook",
    instruction: "Write a caption for a Facebook Reel. Under 100 words. Direct hook. Include 3-5 hashtags. Slightly warmer tone than TikTok — Facebook skews older.",
  },

  // Email
  email_subject: {
    label: "Email Subject Lines (5)",
    category: "email",
    instruction: "Write 5 email subject line options. Under 60 characters each. Vary the approaches: curiosity, specificity, urgency, benefit, personal. No clickbait. Return as a numbered list.",
  },
  email_newsletter: {
    label: "Newsletter Feature Block",
    category: "email",
    instruction: "Write a newsletter feature block (100-150 words). Includes: bold headline, 2-3 sentence hook, key takeaway or stat, and CTA button text. Format with clear [HEADLINE], [BODY], [CTA] sections.",
  },
  email_nurture: {
    label: "Nurture Email (Full)",
    category: "email",
    instruction: "Write a full nurture email based on this content. Subject line + preview text + body (200-300 words). Personal tone, value-first, soft CTA. The reader should feel smarter after reading it, not sold to.",
  },

  // SEO & Blog
  meta_description: {
    label: "Meta Description",
    category: "seo",
    instruction: "Write a meta description. 150-160 characters. Accurate, compelling, includes primary keyword naturally. Return only the description text.",
  },
  blog_derivative: {
    label: "Derivative Blog Post Titles (5)",
    category: "seo",
    instruction: "Generate 5 derivative blog post ideas that could be spun off from this content. Each with a title and 1-sentence description of what the post would cover. These should target different search intents — informational, comparison, how-to, listicle, opinion.",
  },
  seo_faq: {
    label: "FAQ Schema Content (5 Q&As)",
    category: "seo",
    instruction: "Write 5 FAQ-style question and answer pairs derived from this content. Format as Q: and A: pairs. Questions should match how people actually search (natural language). Answers should be concise (2-3 sentences) and factual. These will be used in FAQ schema markup for SEO.",
  },
  summary: {
    label: "Executive Summary",
    category: "seo",
    instruction: "Write a 2-3 sentence executive summary. Direct, factual, no marketing language. Suitable for a busy reader who needs the core takeaway in 10 seconds.",
  },
};

type FormatKey = keyof typeof FORMATS;

async function getPersonaPrompt(personaId?: number): Promise<string> {
  const db = getDb();
  try {
    let row;
    if (personaId) {
      const result = await db.execute({
        sql: "SELECT * FROM audience_personas WHERE id = ?",
        args: [personaId],
      });
      row = result.rows[0];
    }
    if (!row) return "";
    const parts: string[] = [`TARGET AUDIENCE PERSONA: ${row.name}`];
    if (row.description) parts.push(`Profile: ${row.description}`);
    if (row.demographics) parts.push(`Demographics: ${row.demographics}`);
    if (row.goals) parts.push(`Goals: ${row.goals}`);
    if (row.pain_points) parts.push(`Pain points: ${row.pain_points}`);
    if (row.communication_style) parts.push(`Communication preferences: ${row.communication_style}`);
    if (row.objections) parts.push(`Common objections: ${row.objections}`);
    parts.push("Tailor ALL outputs to speak directly to this persona. Adapt tone, vocabulary, specificity, and emphasis to match their communication preferences and address their goals and pain points.");
    return parts.join("\n");
  } catch {
    return "";
  }
}

/**
 * POST /api/repurpose
 * Body: { content: string, title: string, formats: string[], voiceId?: number, personaId?: number }
 * Returns SSE stream with final JSON result
 */
export async function POST(req: NextRequest) {
  try {
    const apiKey = await getAnthropicKey();
    if (!apiKey) {
      return NextResponse.json(
        { error: "Anthropic API key not configured." },
        { status: 500 }
      );
    }

    const body = await req.json();
    const { content, title, formats, voiceId, personaId } = body;

    if (!content || !formats || formats.length === 0) {
      return NextResponse.json(
        { error: "content and formats are required" },
        { status: 400 }
      );
    }

    const voicePrompt = await getBrandVoicePrompt(voiceId);
    const personaPrompt = await getPersonaPrompt(personaId);

    const formatInstructions = (formats as FormatKey[])
      .filter((f) => FORMATS[f])
      .map((f) => `## ${FORMATS[f].label}\n${FORMATS[f].instruction}`)
      .join("\n\n");

    const systemPrompt = [
      "You are a content repurposing engine embedded in a CMS.",
      "You take a long-form article and produce multiple output formats from it.",
      "Each output should be independently excellent — not just a summary, but adapted for its specific channel and audience.",
      voicePrompt,
      personaPrompt,
      "Return your response as valid JSON: an array of objects with { format: string, output: string }. The format field should match the section headers exactly. No markdown wrapping around the JSON.",
    ]
      .filter(Boolean)
      .join("\n\n");

    const userPrompt = `ARTICLE TITLE: ${title || "Untitled"}\n\nARTICLE CONTENT:\n${content}\n\n---\n\nGenerate the following formats:\n\n${formatInstructions}\n\nReturn as JSON array: [{ "format": "format_key", "output": "..." }, ...]`;

    const startTime = Date.now();

    // Use streaming to avoid Netlify timeout
    const anthropicResp = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-6",
        max_tokens: 4096,
        system: systemPrompt,
        stream: true,
        messages: [{ role: "user", content: userPrompt }],
      }),
    });

    if (!anthropicResp.ok) {
      const errText = await anthropicResp.text();
      let userMessage = "AI service is temporarily unavailable. Please try again in a moment.";
      try {
        const errJson = JSON.parse(errText);
        if (errJson.error?.type === "authentication_error") {
          userMessage = "AI service not configured. Ask your admin to check the API key in Settings.";
        } else if (errJson.error?.type === "rate_limit_error") {
          userMessage = "Too many requests. Please wait a moment and try again.";
        } else if (errJson.error?.type === "overloaded_error") {
          userMessage = "AI service is busy. Please try again in a few seconds.";
        }
      } catch { /* use default message */ }
      return NextResponse.json({ error: userMessage }, { status: 500 });
    }

    const reader = anthropicResp.body!.getReader();
    const encoder = new TextEncoder();

    const stream = new ReadableStream({
      async start(controller) {
        const decoder = new TextDecoder();
        let fullText = "";
        let inputTokens = 0;
        let outputTokens = 0;
        let sseBuffer = "";

        try {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            sseBuffer += decoder.decode(value, { stream: true });
            const lines = sseBuffer.split("\n");
            sseBuffer = lines.pop() || "";

            for (const line of lines) {
              if (!line.startsWith("data: ")) continue;
              const payload = line.slice(6).trim();
              if (payload === "[DONE]") continue;

              try {
                const evt = JSON.parse(payload);
                if (evt.type === "message_start" && evt.message?.usage) {
                  inputTokens = evt.message.usage.input_tokens || 0;
                }
                if (evt.type === "content_block_delta" && evt.delta?.text) {
                  fullText += evt.delta.text;
                  controller.enqueue(
                    encoder.encode(`data: {"type":"progress","len":${fullText.length}}\n\n`)
                  );
                }
                if (evt.type === "message_delta" && evt.usage) {
                  outputTokens = evt.usage.output_tokens || 0;
                }
              } catch { /* skip */ }
            }
          }

          // Parse accumulated text
          let cleaned = fullText.trim();
          if (cleaned.startsWith("```")) {
            cleaned = cleaned.replace(/^```(?:json)?\s*/, "").replace(/\s*```$/, "");
          }
          let results;
          try {
            results = JSON.parse(cleaned);
          } catch {
            const jsonMatch = cleaned.match(/\[[\s\S]*\]/);
            if (jsonMatch) {
              try { results = JSON.parse(jsonMatch[0]); } catch { results = []; }
            } else {
              results = [];
            }
          }

          // Enrich with labels
          const enriched = (results as { format: string; output: string }[]).map(
            (r: { format: string; output: string }) => ({
              ...r,
              label: FORMATS[r.format as FormatKey]?.label || r.format,
            })
          );

          const resultPayload = JSON.stringify({
            results: enriched,
            available_formats: Object.entries(FORMATS).map(([key, val]) => ({
              key,
              label: val.label,
            })),
          });
          const b64 = Buffer.from(resultPayload).toString("base64");
          controller.enqueue(
            encoder.encode(`data: {"type":"result_b64","data":"${b64}"}\n\n`)
          );
        } catch (e) {
          controller.enqueue(
            encoder.encode(`data: ${JSON.stringify({ type: "error", error: e instanceof Error ? e.message : "Stream error" })}\n\n`)
          );
        } finally {
          controller.enqueue(encoder.encode("data: [DONE]\n\n"));
          controller.close();

          // Log AI usage
          try {
            const db = getDb();
            await db.execute({
              sql: `INSERT INTO ai_usage_log (action, model, input_tokens, output_tokens, metadata) VALUES (?, ?, ?, ?, ?)`,
              args: [
                "content_repurpose",
                "claude-sonnet-4-6",
                inputTokens,
                outputTokens,
                JSON.stringify({ formats, voice_id: voiceId || null, persona_id: personaId || null, duration_ms: Date.now() - startTime }),
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

// GET /api/repurpose — returns available formats grouped by category
export async function GET() {
  const formats = Object.entries(FORMATS).map(([key, val]) => ({
    key,
    label: val.label,
    category: val.category,
  }));

  return NextResponse.json({
    formats,
    categories: FORMAT_CATEGORIES,
  });
}
