/**
 * Server-side CMS data fetching (Turso / libsql).
 * All functions are async.
 * Use in Server Components and generateMetadata.
 */
import { getDb } from "./db";
import type { Row } from "@libsql/client";

/* ── Types ── */

export interface BlogPost {
  id: number;
  slug: string;
  title: string;
  description: string | null;
  date: string | null;
  read_time: string | null;
  tag: string | null;
  gradient: string | null;
  featured_image: string | null;
  sections: { heading: string; body: string | string[] }[];
  related_slugs: string[];
  published: number;
  created_at: string;
  updated_at: string;
}

export interface Page {
  id: number;
  slug: string;
  title: string;
  meta_description: string | null;
  content: Record<string, unknown>;
  published: number;
  updated_at: string;
}

export interface Faq {
  id: number;
  category: string;
  question: string;
  answer: string;
  sort_order: number;
}

export interface Product {
  id: number;
  slug: string;
  name: string;
  tagline: string | null;
  price: string | null;
  description: string | null;
  features: string[];
  status: string;
  launch_date: string | null;
  sort_order: number;
  published: number;
}

/* ── Helpers ── */

function rowToObject(row: Row): Record<string, unknown> {
  const obj: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(row)) {
    obj[key] = value;
  }
  return obj;
}

/* ── Queries ── */

export async function getPage(slug: string): Promise<Page | null> {
  const db = getDb();
  const result = await db.execute({
    sql: "SELECT * FROM pages WHERE slug = ? AND published = 1",
    args: [slug],
  });
  if (result.rows.length === 0) return null;
  const row = rowToObject(result.rows[0]);
  return {
    ...(row as unknown as Page),
    content: JSON.parse(row.content as string),
  };
}

export async function getBlogPosts(): Promise<BlogPost[]> {
  const db = getDb();
  const result = await db.execute(
    "SELECT * FROM blog_posts WHERE published = 1 ORDER BY date DESC"
  );
  return result.rows.map((r) => {
    const row = rowToObject(r);
    return {
      ...(row as unknown as BlogPost),
      sections: JSON.parse(row.sections as string),
      related_slugs: JSON.parse(row.related_slugs as string),
    };
  });
}

export async function getBlogPost(slug: string): Promise<BlogPost | null> {
  const db = getDb();
  const result = await db.execute({
    sql: "SELECT * FROM blog_posts WHERE slug = ? AND published = 1",
    args: [slug],
  });
  if (result.rows.length === 0) return null;
  const row = rowToObject(result.rows[0]);
  return {
    ...(row as unknown as BlogPost),
    sections: JSON.parse(row.sections as string),
    related_slugs: JSON.parse(row.related_slugs as string),
  };
}

export async function getFaqs(): Promise<Faq[]> {
  const db = getDb();
  const result = await db.execute(
    "SELECT * FROM faqs WHERE published = 1 ORDER BY sort_order ASC, id ASC"
  );
  return result.rows.map((r) => rowToObject(r) as unknown as Faq);
}

export async function getProducts(): Promise<Product[]> {
  const db = getDb();
  const result = await db.execute(
    "SELECT * FROM products WHERE published = 1 ORDER BY sort_order ASC, id ASC"
  );
  return result.rows.map((r) => {
    const row = rowToObject(r);
    return {
      ...(row as unknown as Product),
      features: JSON.parse(row.features as string),
    };
  });
}

export async function getSetting(key: string): Promise<string | null> {
  const db = getDb();
  const result = await db.execute({
    sql: "SELECT value FROM site_settings WHERE key = ?",
    args: [key],
  });
  if (result.rows.length === 0) return null;
  return result.rows[0].value as string;
}

export async function getSettings(): Promise<Record<string, string>> {
  const db = getDb();
  const result = await db.execute("SELECT * FROM site_settings");
  const settings: Record<string, string> = {};
  for (const row of result.rows) {
    settings[row.key as string] = row.value as string;
  }
  return settings;
}
