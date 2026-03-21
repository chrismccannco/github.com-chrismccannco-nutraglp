import { readFileSync } from "fs";
import { resolve } from "path";
import { createClient, type Client } from "@libsql/client";

// Load .env.local when running outside Next.js (e.g. npx tsx lib/db.ts)
if (!process.env.TURSO_DATABASE_URL) {
  try {
    const envPath = resolve(process.cwd(), ".env.local");
    const envFile = readFileSync(envPath, "utf-8");
    for (const line of envFile.split("\n")) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;
      const eq = trimmed.indexOf("=");
      if (eq > 0) {
        const key = trimmed.slice(0, eq).trim();
        let val = trimmed.slice(eq + 1).trim();
        // Strip surrounding quotes added by Vercel CLI
        if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
          val = val.slice(1, -1);
        }
        if (!process.env[key]) process.env[key] = val;
      }
    }
  } catch {
    // .env.local not found — rely on environment
  }
}

let client: Client | null = null;

export function getDb(): Client {
  if (!client) {
    client = createClient({
      url: process.env.TURSO_DATABASE_URL!,
      authToken: process.env.TURSO_AUTH_TOKEN!,
    });
  }
  return client;
}

export async function initDb(): Promise<Client> {
  const db = getDb();

  await db.executeMultiple(`
    CREATE TABLE IF NOT EXISTS pages (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      slug TEXT UNIQUE NOT NULL,
      title TEXT NOT NULL,
      meta_description TEXT,
      content TEXT NOT NULL DEFAULT '{}',
      published INTEGER DEFAULT 1,
      draft_content TEXT,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS blog_posts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      slug TEXT UNIQUE NOT NULL,
      title TEXT NOT NULL,
      description TEXT,
      date TEXT,
      read_time TEXT,
      tag TEXT,
      gradient TEXT,
      featured_image TEXT,
      sections TEXT NOT NULL DEFAULT '[]',
      related_slugs TEXT DEFAULT '[]',
      published INTEGER DEFAULT 1,
      draft_title TEXT,
      draft_description TEXT,
      draft_sections TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS faqs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      category TEXT,
      question TEXT NOT NULL,
      answer TEXT NOT NULL,
      sort_order INTEGER DEFAULT 0,
      published INTEGER DEFAULT 1
    );

    CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      slug TEXT UNIQUE NOT NULL,
      name TEXT NOT NULL,
      tagline TEXT,
      price TEXT,
      description TEXT,
      features TEXT DEFAULT '[]',
      status TEXT DEFAULT 'available',
      launch_date TEXT,
      sort_order INTEGER DEFAULT 0,
      published INTEGER DEFAULT 1
    );

    CREATE TABLE IF NOT EXISTS site_settings (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS content_versions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      content_type TEXT NOT NULL,
      content_id INTEGER NOT NULL,
      version_data TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      created_by TEXT DEFAULT 'admin'
    );

    CREATE TABLE IF NOT EXISTS testimonials (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      title TEXT,
      quote TEXT NOT NULL,
      rating INTEGER DEFAULT 5,
      avatar_url TEXT,
      featured INTEGER DEFAULT 0,
      sort_order INTEGER DEFAULT 0,
      published INTEGER DEFAULT 1,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS page_views (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      path TEXT NOT NULL,
      referrer TEXT,
      user_agent TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS form_submissions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      form_name TEXT NOT NULL DEFAULT 'waitlist',
      email TEXT NOT NULL,
      name TEXT,
      data TEXT DEFAULT '{}',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS ab_events (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      block_id TEXT NOT NULL,
      variant TEXT NOT NULL,
      event_type TEXT NOT NULL DEFAULT 'impression',
      page_path TEXT,
      session_id TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS content_workflows (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      content_type TEXT NOT NULL,
      content_id INTEGER NOT NULL,
      status TEXT NOT NULL DEFAULT 'draft',
      submitted_by TEXT,
      reviewed_by TEXT,
      review_note TEXT,
      submitted_at DATETIME,
      reviewed_at DATETIME,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS api_keys (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      key_prefix TEXT NOT NULL,
      key_hash TEXT NOT NULL,
      permissions TEXT NOT NULL DEFAULT '["read"]',
      rate_limit INTEGER DEFAULT 1000,
      last_used_at DATETIME,
      requests_today INTEGER DEFAULT 0,
      requests_total INTEGER DEFAULT 0,
      created_by INTEGER,
      revoked INTEGER DEFAULT 0,
      revoked_at DATETIME,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS performance_metrics (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      url TEXT NOT NULL,
      path TEXT NOT NULL,
      device_type TEXT DEFAULT 'desktop',
      connection_type TEXT,
      lcp REAL,
      fid REAL,
      cls REAL,
      fcp REAL,
      ttfb REAL,
      inp REAL,
      dom_load REAL,
      page_load REAL,
      transfer_size INTEGER,
      dom_elements INTEGER,
      user_agent TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS forms (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      slug TEXT UNIQUE NOT NULL,
      name TEXT NOT NULL,
      description TEXT,
      fields TEXT NOT NULL DEFAULT '[]',
      settings TEXT NOT NULL DEFAULT '{}',
      published INTEGER DEFAULT 0,
      submission_count INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS form_submissions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      form_id INTEGER NOT NULL,
      data TEXT NOT NULL DEFAULT '{}',
      metadata TEXT DEFAULT '{}',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS admin_users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE NOT NULL,
      name TEXT NOT NULL,
      password_hash TEXT NOT NULL,
      role TEXT NOT NULL DEFAULT 'editor',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS admin_sessions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      token TEXT UNIQUE NOT NULL,
      expires_at DATETIME NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS locales (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      code TEXT UNIQUE NOT NULL,
      name TEXT NOT NULL,
      native_name TEXT NOT NULL,
      direction TEXT DEFAULT 'ltr',
      is_default INTEGER DEFAULT 0,
      enabled INTEGER DEFAULT 1,
      sort_order INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS translations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      content_type TEXT NOT NULL,
      content_id INTEGER NOT NULL,
      locale TEXT NOT NULL,
      field_name TEXT NOT NULL,
      value TEXT NOT NULL,
      auto_translated INTEGER DEFAULT 0,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      UNIQUE(content_type, content_id, locale, field_name)
    );

    CREATE TABLE IF NOT EXISTS ui_translations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      locale TEXT NOT NULL,
      key TEXT NOT NULL,
      value TEXT NOT NULL,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      UNIQUE(locale, key)
    );

    CREATE TABLE IF NOT EXISTS sites (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      slug TEXT UNIQUE NOT NULL,
      name TEXT NOT NULL,
      domain TEXT,
      logo_url TEXT,
      favicon_url TEXT,
      theme TEXT NOT NULL DEFAULT '{}',
      settings TEXT NOT NULL DEFAULT '{}',
      enabled INTEGER DEFAULT 1,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS site_content (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      site_id INTEGER NOT NULL,
      content_type TEXT NOT NULL,
      content_id INTEGER NOT NULL,
      overrides TEXT DEFAULT '{}',
      hidden INTEGER DEFAULT 0,
      sort_order INTEGER DEFAULT 0,
      UNIQUE(site_id, content_type, content_id)
    );

    CREATE TABLE IF NOT EXISTS templates (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      slug TEXT UNIQUE NOT NULL,
      name TEXT NOT NULL,
      description TEXT,
      category TEXT NOT NULL DEFAULT 'page',
      thumbnail_url TEXT,
      blocks TEXT NOT NULL DEFAULT '[]',
      theme TEXT DEFAULT '{}',
      author TEXT DEFAULT 'NutraGLP',
      version TEXT DEFAULT '1.0.0',
      downloads INTEGER DEFAULT 0,
      rating REAL DEFAULT 0,
      rating_count INTEGER DEFAULT 0,
      tags TEXT DEFAULT '[]',
      is_premium INTEGER DEFAULT 0,
      price REAL DEFAULT 0,
      published INTEGER DEFAULT 1,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS template_installs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      template_id INTEGER NOT NULL,
      site_id INTEGER,
      target_type TEXT NOT NULL DEFAULT 'page',
      target_id INTEGER,
      installed_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      UNIQUE(template_id, site_id, target_type, target_id)
    );

    CREATE TABLE IF NOT EXISTS media_files (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      filename TEXT NOT NULL,
      mime_type TEXT NOT NULL,
      size INTEGER NOT NULL,
      width INTEGER DEFAULT 0,
      height INTEGER DEFAULT 0,
      data TEXT NOT NULL,
      thumb_data TEXT,
      parent_id INTEGER REFERENCES media_files(id) ON DELETE SET NULL,
      deleted_at DATETIME,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS brand_voices (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      slug TEXT UNIQUE NOT NULL,
      is_default INTEGER DEFAULT 0,
      tagline TEXT,
      mission TEXT,
      audience TEXT,
      tone TEXT,
      dos TEXT,
      donts TEXT,
      exemplar TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS knowledge_docs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      slug TEXT UNIQUE NOT NULL,
      doc_type TEXT NOT NULL DEFAULT 'general',
      content TEXT NOT NULL,
      summary TEXT,
      tags TEXT DEFAULT '[]',
      word_count INTEGER DEFAULT 0,
      enabled INTEGER DEFAULT 1,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS audience_personas (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      slug TEXT UNIQUE NOT NULL,
      description TEXT,
      demographics TEXT,
      goals TEXT,
      pain_points TEXT,
      communication_style TEXT,
      objections TEXT,
      channels TEXT DEFAULT '[]',
      is_default INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS content_templates (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      slug TEXT UNIQUE NOT NULL,
      description TEXT,
      category TEXT NOT NULL DEFAULT 'general',
      prompt_template TEXT NOT NULL,
      voice_id INTEGER,
      persona_id INTEGER,
      knowledge_doc_ids TEXT DEFAULT '[]',
      output_format TEXT DEFAULT 'prose',
      max_tokens INTEGER DEFAULT 1024,
      variables TEXT DEFAULT '[]',
      is_system INTEGER DEFAULT 0,
      sort_order INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS videos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      slug TEXT UNIQUE NOT NULL,
      source_url TEXT,
      duration_seconds INTEGER DEFAULT 0,
      transcript TEXT,
      transcript_status TEXT DEFAULT 'pending',
      voice_id INTEGER,
      persona_id INTEGER,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS video_clips (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      video_id INTEGER NOT NULL,
      title TEXT,
      start_time REAL NOT NULL,
      end_time REAL NOT NULL,
      transcript_segment TEXT NOT NULL,
      platform TEXT NOT NULL DEFAULT 'linkedin',
      caption TEXT,
      status TEXT DEFAULT 'draft',
      sort_order INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS ai_usage_log (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      action TEXT NOT NULL,
      template_id INTEGER,
      template_name TEXT,
      voice_id INTEGER,
      voice_name TEXT,
      persona_id INTEGER,
      persona_name TEXT,
      model TEXT DEFAULT 'claude-sonnet-4-6',
      input_tokens INTEGER DEFAULT 0,
      output_tokens INTEGER DEFAULT 0,
      duration_ms INTEGER DEFAULT 0,
      user_email TEXT,
      metadata TEXT DEFAULT '{}',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS webhook_endpoints (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      url TEXT NOT NULL,
      events TEXT NOT NULL DEFAULT '[]',
      secret TEXT,
      enabled INTEGER DEFAULT 1,
      last_triggered_at DATETIME,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS trial_signups (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE NOT NULL,
      started_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      expires_at DATETIME NOT NULL,
      active INTEGER DEFAULT 1
    );

    CREATE TABLE IF NOT EXISTS audit_log (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      action TEXT NOT NULL,
      entity_type TEXT NOT NULL,
      entity_id TEXT,
      entity_label TEXT,
      metadata TEXT DEFAULT '{}',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS saved_prompts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      prompt TEXT NOT NULL,
      category TEXT DEFAULT 'general',
      created_by TEXT,
      sort_order INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // Add columns that may not exist on older databases
  const migrations = [
    "ALTER TABLE pages ADD COLUMN published INTEGER DEFAULT 1",
    "ALTER TABLE pages ADD COLUMN draft_content TEXT",
    "ALTER TABLE blog_posts ADD COLUMN featured_image TEXT",
    "ALTER TABLE blog_posts ADD COLUMN draft_title TEXT",
    "ALTER TABLE blog_posts ADD COLUMN draft_description TEXT",
    "ALTER TABLE blog_posts ADD COLUMN draft_sections TEXT",
    "ALTER TABLE products ADD COLUMN published INTEGER DEFAULT 1",
    "ALTER TABLE pages ADD COLUMN meta_title TEXT",
    "ALTER TABLE pages ADD COLUMN og_image TEXT",
    "ALTER TABLE blog_posts ADD COLUMN meta_title TEXT",
    "ALTER TABLE blog_posts ADD COLUMN meta_description TEXT",
    "ALTER TABLE blog_posts ADD COLUMN og_image TEXT",
    // Block-based page builder columns
    "ALTER TABLE pages ADD COLUMN blocks TEXT DEFAULT '[]'",
    "ALTER TABLE pages ADD COLUMN blocks_draft TEXT DEFAULT '[]'",
    "ALTER TABLE blog_posts ADD COLUMN blocks TEXT DEFAULT '[]'",
    "ALTER TABLE blog_posts ADD COLUMN blocks_draft TEXT DEFAULT '[]'",
    // Blog scheduling
    "ALTER TABLE blog_posts ADD COLUMN publish_at TEXT",
    // Media enhancements
    "ALTER TABLE media_files ADD COLUMN width INTEGER DEFAULT 0",
    "ALTER TABLE media_files ADD COLUMN height INTEGER DEFAULT 0",
    "ALTER TABLE media_files ADD COLUMN thumb_data TEXT",
    // Content templates persona support
    "ALTER TABLE content_templates ADD COLUMN persona_id INTEGER",
    // Content scoring columns
    "ALTER TABLE blog_posts ADD COLUMN brand_score INTEGER",
    "ALTER TABLE blog_posts ADD COLUMN voice_score INTEGER",
    "ALTER TABLE blog_posts ADD COLUMN clarity_score INTEGER",
    "ALTER TABLE blog_posts ADD COLUMN score_summary TEXT",
    "ALTER TABLE blog_posts ADD COLUMN scored_at DATETIME",
    "ALTER TABLE pages ADD COLUMN brand_score INTEGER",
    "ALTER TABLE pages ADD COLUMN voice_score INTEGER",
    "ALTER TABLE pages ADD COLUMN clarity_score INTEGER",
    "ALTER TABLE pages ADD COLUMN score_summary TEXT",
    "ALTER TABLE pages ADD COLUMN scored_at DATETIME",
    // Workflow webhook URLs
    "ALTER TABLE content_workflows ADD COLUMN webhook_sent INTEGER DEFAULT 0",
    // Media soft delete + version history
    "ALTER TABLE media_files ADD COLUMN parent_id INTEGER REFERENCES media_files(id) ON DELETE SET NULL",
    "ALTER TABLE media_files ADD COLUMN deleted_at DATETIME",
  ];

  for (const sql of migrations) {
    try {
      await db.execute(sql);
    } catch {
      // Column already exists — ignore
    }
  }

  // Indexes
  try {
    await db.execute("CREATE INDEX IF NOT EXISTS idx_page_views_path_date ON page_views (path, created_at)");
    await db.execute("CREATE INDEX IF NOT EXISTS idx_ab_events_block ON ab_events (block_id, variant, event_type)");
    await db.execute("CREATE INDEX IF NOT EXISTS idx_admin_sessions_token ON admin_sessions (token)");
    await db.execute("CREATE INDEX IF NOT EXISTS idx_workflows_content ON content_workflows (content_type, content_id, status)");
    await db.execute("CREATE INDEX IF NOT EXISTS idx_api_keys_prefix ON api_keys (key_prefix)");
    await db.execute("CREATE INDEX IF NOT EXISTS idx_perf_metrics_path_date ON performance_metrics (path, created_at)");
    await db.execute("CREATE INDEX IF NOT EXISTS idx_form_submissions_form ON form_submissions (form_id, created_at)");
    await db.execute("CREATE INDEX IF NOT EXISTS idx_translations_lookup ON translations (content_type, content_id, locale)");
    await db.execute("CREATE INDEX IF NOT EXISTS idx_ui_translations_locale ON ui_translations (locale)");
    await db.execute("CREATE INDEX IF NOT EXISTS idx_site_content_site ON site_content (site_id, content_type)");
    await db.execute("CREATE INDEX IF NOT EXISTS idx_templates_category ON templates (category, published)");
    await db.execute("CREATE INDEX IF NOT EXISTS idx_template_installs_template ON template_installs (template_id)");
    await db.execute("CREATE INDEX IF NOT EXISTS idx_brand_voices_slug ON brand_voices (slug)");
    await db.execute("CREATE INDEX IF NOT EXISTS idx_knowledge_docs_type ON knowledge_docs (doc_type, enabled)");
    await db.execute("CREATE INDEX IF NOT EXISTS idx_knowledge_docs_slug ON knowledge_docs (slug)");
    await db.execute("CREATE INDEX IF NOT EXISTS idx_content_templates_category ON content_templates (category, sort_order)");
    await db.execute("CREATE INDEX IF NOT EXISTS idx_audience_personas_slug ON audience_personas (slug)");
    await db.execute("CREATE INDEX IF NOT EXISTS idx_videos_slug ON videos (slug)");
    await db.execute("CREATE INDEX IF NOT EXISTS idx_video_clips_video ON video_clips (video_id, sort_order)");
    await db.execute("CREATE INDEX IF NOT EXISTS idx_ai_usage_log_action ON ai_usage_log (action, created_at)");
    await db.execute("CREATE INDEX IF NOT EXISTS idx_ai_usage_log_template ON ai_usage_log (template_id, created_at)");
    await db.execute("CREATE INDEX IF NOT EXISTS idx_media_files_deleted ON media_files (deleted_at)");
    await db.execute("CREATE INDEX IF NOT EXISTS idx_media_files_parent ON media_files (parent_id)");
    await db.execute("CREATE INDEX IF NOT EXISTS idx_content_versions_lookup ON content_versions (content_type, content_id, created_at)");
    await db.execute("CREATE INDEX IF NOT EXISTS idx_audit_log_entity ON audit_log (entity_type, entity_id, created_at)");
    await db.execute("CREATE INDEX IF NOT EXISTS idx_audit_log_action ON audit_log (action, created_at)");
    await db.execute("CREATE INDEX IF NOT EXISTS idx_saved_prompts_category ON saved_prompts (category, sort_order)");
  } catch {
    // Index may already exist
  }

  // Seed starter AI templates (INSERT OR IGNORE — safe to run on every cold start)
  const starterTemplates = [
    {
      slug: "blog-research-backed",
      name: "Blog Post: Research-Backed Article",
      description: "A full blog post with a scientific angle, structured sections, and SEO-ready headings.",
      category: "blog",
      output_format: "html",
      max_tokens: 2000,
      sort_order: 10,
      variables: JSON.stringify([
        { name: "topic", label: "Article topic", default: "" },
        { name: "audience", label: "Target audience", default: "health-conscious adults" },
      ]),
      prompt_template: `Write a research-backed blog post about: {{topic}}

Target audience: {{audience}}

Structure:
1. Compelling headline (use an <h1> tag)
2. Hook introduction (2-3 sentences — lead with a surprising fact or observation)
3. 3-4 sections, each with an <h2> heading and 2-3 paragraphs
4. One "Key takeaway" callout block (wrap in a <blockquote>)
5. Brief conclusion with a natural next step

Tone: Confident but not salesy. Short declarative sentences. Earned authority.
Format: Return full HTML body (no <html>/<body> wrappers). No markdown.`,
    },
    {
      slug: "blog-product-education",
      name: "Blog Post: Product Education",
      description: "Educates readers on how/why a product works. Good for trust-building and SEO.",
      category: "blog",
      output_format: "html",
      max_tokens: 1800,
      sort_order: 11,
      variables: JSON.stringify([
        { name: "product", label: "Product name", default: "Slim SHOT" },
        { name: "mechanism", label: "Core mechanism to explain", default: "GLP-1 activation" },
      ]),
      prompt_template: `Write an educational blog post explaining how {{product}} works, focused on {{mechanism}}.

Structure:
1. Headline (h1) — specific and curiosity-driven
2. Opening: what problem this solves and why existing options fall short
3. How it works: clear explanation of the science
4. What makes this approach different (without being braggy)
5. What readers should realistically expect
6. Closing: honest, no hype

Rules: No exclamation marks. Use "may support" not "will". Position as a dietary supplement.
Format: Return full HTML. No markdown.`,
    },
    {
      slug: "social-linkedin-thought-leadership",
      name: "LinkedIn Post: Thought Leadership",
      description: "First-person LinkedIn post that builds authority without sounding like a press release.",
      category: "social",
      output_format: "prose",
      max_tokens: 400,
      sort_order: 20,
      variables: JSON.stringify([
        { name: "insight", label: "Core insight or observation", default: "" },
      ]),
      prompt_template: `Write a LinkedIn post based on this insight: {{insight}}

Voice: First person. Spare. Observational. Earned authority, never declared.
Structure:
- Hook: 1-2 short sentences (no rhetorical questions, no "I've been thinking about...")
- Body: 3-5 short paragraphs, each one idea
- Ending: a quiet observation or open question — not a CTA

Rules: No bullet points. No bold headers. No "excited to share". Max 250 words.`,
    },
    {
      slug: "social-twitter-thread",
      name: "Twitter/X Thread",
      description: "A 5-tweet thread. Each tweet is a standalone idea that earns the next.",
      category: "social",
      output_format: "prose",
      max_tokens: 600,
      sort_order: 21,
      variables: JSON.stringify([
        { name: "topic", label: "Thread topic", default: "" },
      ]),
      prompt_template: `Write a 5-tweet thread about: {{topic}}

Format:
Tweet 1/5: [hook — most counterintuitive or surprising angle, max 240 chars]
Tweet 2/5: [establish the problem or tension]
Tweet 3/5: [key insight or mechanism]
Tweet 4/5: [concrete example or evidence]
Tweet 5/5: [understated takeaway]

Rules: Each tweet max 240 characters. No hashtags. No "Here's a thread 🧵".`,
    },
    {
      slug: "email-welcome-nurture",
      name: "Email: Welcome / Nurture",
      description: "Onboarding email that builds trust without a hard sell.",
      category: "email",
      output_format: "prose",
      max_tokens: 800,
      sort_order: 30,
      variables: JSON.stringify([
        { name: "context", label: "What they signed up for / what you want to say", default: "" },
      ]),
      prompt_template: `Write a welcome email for: {{context}}

Structure:
- Subject line: personal, specific, no promotional language
- Preheader: complements subject
- Body (3 short paragraphs):
  1. Acknowledge what they did — no fanfare
  2. One concrete thing they can do or know right now
  3. What comes next — set expectation, no promises
- Sign-off: human, not corporate

Rules: No exclamation marks. No "We're thrilled". Short sentences. Feels written, not templated.
Output: Subject, Preheader, and Body as labeled sections.`,
    },
    {
      slug: "email-reengagement",
      name: "Email: Re-engagement",
      description: "Brings back lapsed users. Honest, no guilt-trip.",
      category: "email",
      output_format: "prose",
      max_tokens: 500,
      sort_order: 31,
      variables: JSON.stringify([
        { name: "product_or_brand", label: "Product or brand name", default: "Slim SHOT" },
        { name: "time_away", label: "How long they've been inactive", default: "a while" },
      ]),
      prompt_template: `Write a re-engagement email for someone who hasn't used {{product_or_brand}} in {{time_away}}.

Tone: Honest. No guilt. No "We miss you!" Don't beg.
- Subject: honest, not dramatic
- Opening: acknowledge the gap plainly — one sentence
- Body: remind them of the one most valuable thing
- Nudge: something concrete, low friction
- Out: let them opt out gracefully if this isn't for them

Max 200 words body. Write like a person, not a marketing team.`,
    },
    {
      slug: "seo-meta-description",
      name: "SEO: Title Tag + Meta Description",
      description: "Optimized title tag and meta description pair for any page or blog post.",
      category: "seo",
      output_format: "prose",
      max_tokens: 200,
      sort_order: 40,
      variables: JSON.stringify([
        { name: "page_topic", label: "Page topic or title", default: "" },
        { name: "primary_keyword", label: "Primary keyword", default: "" },
      ]),
      prompt_template: `Write an SEO title tag and meta description for: {{page_topic}}
Primary keyword: {{primary_keyword}}

Output:
Title: [50-60 chars, include keyword, compelling]
Meta: [150-160 chars, include keyword naturally, subtle value prop]

Rules: No clickbait. Title reads like a headline, not a keyword list.`,
    },
    {
      slug: "ad-problem-solution",
      name: "Ad Copy: Problem / Solution",
      description: "Direct response ad — hook on the pain, introduce the solution cleanly.",
      category: "advertising",
      output_format: "prose",
      max_tokens: 400,
      sort_order: 50,
      variables: JSON.stringify([
        { name: "problem", label: "Problem the ad addresses", default: "" },
        { name: "product", label: "Product name", default: "Slim SHOT" },
        { name: "platform", label: "Ad platform", default: "Meta (Facebook/Instagram)" },
      ]),
      prompt_template: `Write {{platform}} ad copy that solves: {{problem}}
Product: {{product}}

Deliver:
1. Primary text (125 words max): open on the pain, introduce product, one proof point, CTA
2. Headline (40 chars): specific benefit, not a slogan
3. Description (25 chars): secondary hook

Rules: No before/after body language. No "miracle". No medical claims. Position as dietary supplement.`,
    },
  ];

  for (const t of starterTemplates) {
    try {
      await db.execute({
        sql: `INSERT OR IGNORE INTO content_templates
                (name, slug, description, category, prompt_template, output_format, max_tokens, variables, sort_order, is_system)
              VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 1)`,
        args: [t.name, t.slug, t.description, t.category, t.prompt_template, t.output_format, t.max_tokens, t.variables, t.sort_order],
      });
    } catch {
      // Non-fatal
    }
  }

  return db;
}

// Run schema setup if called directly
const isDirectRun = process.argv[1]?.endsWith("db.ts");
if (isDirectRun) {
  initDb().then(() => {
    console.log("Database initialized.");
    process.exit(0);
  });
}
