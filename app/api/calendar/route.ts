import { NextResponse } from "next/server";
import { initDb } from "@/lib/db";

export async function GET() {
  try {
    const db = await initDb();
    const result = await db.execute(
      `SELECT id, slug, title, description, tag, published, date, publish_at, created_at
       FROM blog_posts
       ORDER BY COALESCE(publish_at, date, created_at) DESC
       LIMIT 200`
    );
    const posts = result.rows.map((r) => ({
      id: r.id,
      slug: r.slug,
      title: r.title,
      description: r.description,
      tag: r.tag,
      published: !!r.published,
      date: r.date,
      publish_at: r.publish_at,
      // Effective display date: scheduled > published date > created
      effective_date: (r.publish_at || r.date || r.created_at) as string,
    }));
    return NextResponse.json({ posts });
  } catch (err) {
    console.error("GET /api/calendar error:", err);
    return NextResponse.json({ error: "Failed to load calendar" }, { status: 500 });
  }
}
