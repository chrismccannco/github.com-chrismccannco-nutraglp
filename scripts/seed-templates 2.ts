/**
 * Seed starter AI templates.
 * Run: npx tsx scripts/seed-templates.ts
 */

import { initDb } from "../lib/db";

const TEMPLATES = [
  // ── Blog ──────────────────────────────────────────────────────────────────
  {
    name: "Blog Post: Research-Backed Article",
    slug: "blog-research-backed",
    description: "A full blog post with a scientific angle, structured sections, and SEO-ready headings.",
    category: "blog",
    output_format: "html",
    max_tokens: 2000,
    sort_order: 10,
    variables: [
      { name: "topic", label: "Article topic", default: "" },
      { name: "audience", label: "Target audience", default: "health-conscious adults" },
    ],
    prompt_template: `Write a research-backed blog post about: {{topic}}

Target audience: {{audience}}

Structure:
1. Compelling headline (use an <h1> tag)
2. Hook introduction (2-3 sentences — lead with a surprising fact or observation)
3. 3-4 sections, each with an <h2> heading and 2-3 paragraphs
4. One "Key takeaway" callout block (wrap in a <blockquote>)
5. Brief conclusion with a natural next step

Tone: Confident but not salesy. Earned authority. Short declarative sentences carry the weight.
Format: Return full HTML body (no <html>/<body> wrappers). No markdown.`,
  },

  {
    name: "Blog Post: Product Education",
    slug: "blog-product-education",
    description: "Educates readers on how/why a product works. Good for building trust and SEO.",
    category: "blog",
    output_format: "html",
    max_tokens: 1800,
    sort_order: 11,
    variables: [
      { name: "product", label: "Product name", default: "Slim SHOT" },
      { name: "mechanism", label: "Core mechanism to explain", default: "GLP-1 activation" },
    ],
    prompt_template: `Write an educational blog post explaining how {{product}} works, focused on {{mechanism}}.

Structure:
1. Headline (h1) — make it specific and curiosity-driven
2. Opening: what problem this solves and why existing options fall short
3. "How it works" section with clear explanation of the science
4. What makes this approach different (without being braggy)
5. What readers should realistically expect
6. Closing: honest, no hype

Rules: No exclamation marks. Use "may support" not "will". Position as a dietary supplement.
Format: Return full HTML. No markdown.`,
  },

  // ── Social ────────────────────────────────────────────────────────────────
  {
    name: "LinkedIn Post: Thought Leadership",
    slug: "social-linkedin-thought-leadership",
    description: "First-person LinkedIn post that builds authority without sounding like a press release.",
    category: "social",
    output_format: "prose",
    max_tokens: 400,
    sort_order: 20,
    variables: [
      { name: "insight", label: "Core insight or observation", default: "" },
    ],
    prompt_template: `Write a LinkedIn post based on this insight: {{insight}}

Voice: First person. Spare. Observational. Earned authority, never declared.
Structure:
- Hook: 1-2 short sentences (no rhetorical questions, no "I've been thinking about...")
- Body: 3-5 short paragraphs, each one idea
- Ending: a quiet observation or open question — not a CTA

Rules: No bullet points. No bold headers. No "excited to share". No emojis unless they land naturally.
Max 250 words.`,
  },

  {
    name: "Twitter/X Thread",
    slug: "social-twitter-thread",
    description: "A punchy 5-tweet thread. Each tweet is a standalone idea that earns the next click.",
    category: "social",
    output_format: "prose",
    max_tokens: 600,
    sort_order: 21,
    variables: [
      { name: "topic", label: "Thread topic", default: "" },
    ],
    prompt_template: `Write a 5-tweet thread about: {{topic}}

Format each tweet as:
Tweet 1/5: [hook — the most counterintuitive or surprising angle]
Tweet 2/5: [establish the problem or tension]
Tweet 3/5: [key insight or mechanism]
Tweet 4/5: [concrete example or evidence]
Tweet 5/5: [takeaway — keep it understated]

Rules:
- Each tweet max 240 characters
- No hashtags
- Short sentences
- The hook must earn the scroll without being clickbait
- No "Here's a thread 🧵"`,
  },

  // ── Email ─────────────────────────────────────────────────────────────────
  {
    name: "Email: Welcome / Nurture",
    slug: "email-welcome-nurture",
    description: "Onboarding email that builds trust without a hard sell. Works for new subscribers or trial users.",
    category: "email",
    output_format: "html",
    max_tokens: 800,
    sort_order: 30,
    variables: [
      { name: "first_name_var", label: "First name variable placeholder", default: "{{first_name}}" },
      { name: "context", label: "What they signed up for / what you want to say", default: "" },
    ],
    prompt_template: `Write a welcome email for: {{context}}

Personalization token for first name: {{first_name_var}}

Structure:
- Subject line: personal, specific, no promotional language
- Preheader: complements the subject
- Body: 3 short paragraphs
  1. Acknowledge what they did (signed up, bought, etc.) — no fanfare
  2. One concrete thing they can do or know right now
  3. What comes next — set expectation, no promises
- Sign-off: human, not corporate

Rules: No exclamation marks. No "We're thrilled". Short sentences. Feels written, not templated.
Format: Return subject, preheader, and body as labeled sections. Body in plain paragraphs (no HTML needed).`,
  },

  {
    name: "Email: Re-engagement",
    slug: "email-reengagement",
    description: "Brings back lapsed users or subscribers. Honest, no guilt-trip.",
    category: "email",
    output_format: "prose",
    max_tokens: 500,
    sort_order: 31,
    variables: [
      { name: "product_or_brand", label: "Product or brand name", default: "Slim SHOT" },
      { name: "time_away", label: "How long they've been inactive", default: "a while" },
    ],
    prompt_template: `Write a re-engagement email for someone who hasn't engaged with {{product_or_brand}} in {{time_away}}.

Tone: Honest. No guilt. No "We miss you!" Don't beg. Acknowledge the gap plainly.

Structure:
- Subject: honest, not dramatic
- Opening: acknowledge directly that it's been a while — one sentence
- Body: remind them of the one most valuable thing — no list of features
- Offer or nudge: something concrete, low friction
- Out: let them opt out gracefully if this isn't for them anymore

Max 200 words body. Write like a person, not a marketing team.`,
  },

  // ── SEO / Meta ────────────────────────────────────────────────────────────
  {
    name: "Meta Description + Title Tag",
    slug: "seo-meta-description",
    description: "SEO title tag and meta description pair for any page or blog post.",
    category: "seo",
    output_format: "prose",
    max_tokens: 200,
    sort_order: 40,
    variables: [
      { name: "page_topic", label: "Page topic or title", default: "" },
      { name: "primary_keyword", label: "Primary keyword", default: "" },
    ],
    prompt_template: `Write an SEO title tag and meta description for a page about: {{page_topic}}
Primary keyword: {{primary_keyword}}

Output format:
Title: [50-60 chars, include keyword, compelling]
Meta: [150-160 chars, include keyword naturally, subtle CTA or value prop, no hype]

Rules: No clickbait. No "ultimate guide" unless it genuinely is. Title should read like a headline, not a keyword list.`,
  },

  // ── Ad Copy ───────────────────────────────────────────────────────────────
  {
    name: "Ad Copy: Problem/Solution",
    slug: "ad-problem-solution",
    description: "Direct response ad copy — hook on the problem, introduce the solution cleanly.",
    category: "advertising",
    output_format: "prose",
    max_tokens: 400,
    sort_order: 50,
    variables: [
      { name: "problem", label: "Problem the ad addresses", default: "" },
      { name: "product", label: "Product or solution", default: "Slim SHOT" },
      { name: "platform", label: "Ad platform", default: "Meta (Facebook/Instagram)" },
    ],
    prompt_template: `Write {{platform}} ad copy for a product that solves: {{problem}}
Product: {{product}}

Deliver:
1. Primary text (125 words max): open on the pain without over-dramatizing it, introduce the product, one proof point, CTA
2. Headline (40 chars): specific benefit, not a slogan
3. Description (25 chars): secondary hook

Rules: No before/after body language. No "miracle" or "revolutionary". Position as a dietary supplement. No medical claims.`,
  },
];

async function seed() {
  const db = await initDb();

  let created = 0;
  let skipped = 0;

  for (const t of TEMPLATES) {
    // Check if slug already exists
    const exists = await db.execute({
      sql: "SELECT id FROM content_templates WHERE slug = ?",
      args: [t.slug],
    });

    if (exists.rows.length > 0) {
      console.log(`  skip  ${t.slug}`);
      skipped++;
      continue;
    }

    await db.execute({
      sql: `INSERT INTO content_templates
              (name, slug, description, category, prompt_template, output_format, max_tokens, variables, sort_order, is_system)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 1)`,
      args: [
        t.name,
        t.slug,
        t.description,
        t.category,
        t.prompt_template,
        t.output_format,
        t.max_tokens,
        JSON.stringify(t.variables),
        t.sort_order,
      ],
    });
    console.log(`  added ${t.slug}`);
    created++;
  }

  console.log(`\nDone. ${created} added, ${skipped} skipped.`);
  process.exit(0);
}

seed().catch((e) => { console.error(e); process.exit(1); });
