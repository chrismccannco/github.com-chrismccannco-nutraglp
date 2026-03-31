import type { MetadataRoute } from "next";
import { getDb } from "@/lib/db";

const baseUrl = "https://nutraglp.com";

const staticRoutes: MetadataRoute.Sitemap = [
  { url: baseUrl, lastModified: new Date(), changeFrequency: "weekly", priority: 1 },
  { url: `${baseUrl}/slim-shot`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.9 },
  { url: `${baseUrl}/science`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
  { url: `${baseUrl}/faq`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
  { url: `${baseUrl}/about`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
  { url: `${baseUrl}/blog`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
  { url: `${baseUrl}/privacy`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.3 },
  { url: `${baseUrl}/terms`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.3 },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Pull published blog posts from DB
  let blogRoutes: MetadataRoute.Sitemap = [];
  try {
    const db = getDb();
    const result = await db.execute(
      "SELECT slug, updated_at FROM blog_posts WHERE published = 1 ORDER BY updated_at DESC"
    );
    blogRoutes = result.rows.map((row) => {
      const r = row as unknown as { slug: string; updated_at: string };
      return {
        url: `${baseUrl}/blog/${r.slug}`,
        lastModified: r.updated_at ? new Date(r.updated_at) : new Date(),
        changeFrequency: "monthly" as const,
        priority: 0.7,
      };
    });
  } catch {
    // DB unavailable at build time — fall through with empty blog routes
  }

  // Pull published pages from DB
  let pageRoutes: MetadataRoute.Sitemap = [];
  try {
    const db = getDb();
    const result = await db.execute(
      "SELECT slug, updated_at FROM pages WHERE published = 1 ORDER BY updated_at DESC"
    );
    pageRoutes = result.rows
      .filter((row) => {
        const r = row as unknown as { slug: string };
        // Exclude slugs already covered by static routes
        const excluded = ["", "slim-shot", "science", "faq", "about", "investors", "privacy", "terms", "blog"];
        return !excluded.includes(r.slug);
      })
      .map((row) => {
        const r = row as unknown as { slug: string; updated_at: string };
        return {
          url: `${baseUrl}/${r.slug}`,
          lastModified: r.updated_at ? new Date(r.updated_at) : new Date(),
          changeFrequency: "monthly" as const,
          priority: 0.6,
        };
      });
  } catch {
    // DB unavailable at build time — fall through
  }

  return [...staticRoutes, ...blogRoutes, ...pageRoutes];
}
