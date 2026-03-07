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
        const val = trimmed.slice(eq + 1).trim();
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
  } catch {
    // Index may already exist
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
