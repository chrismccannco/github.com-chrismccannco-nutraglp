import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { dispatchWebhook } from "@/lib/webhooks";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  try {
    const db = getDb();
    const result = await db.execute({
      sql: "SELECT * FROM blog_posts WHERE slug = ?",
      args: [slug],
    });
    if (result.rows.length === 0)
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    const r = result.rows[0];
    return NextResponse.json({
      id: r.id, slug: r.slug, title: r.title, description: r.description,
      date: r.date, read_time: r.read_time, tag: r.tag, gradient: r.gradient,
      featured_image: r.featured_image,
      meta_title: r.meta_title, meta_description: r.meta_description, og_image: r.og_image,
      sections: JSON.parse(r.sections as string),
      related_slugs: JSON.parse(r.related_slugs as string),
      blocks: JSON.parse((r.blocks as string) || "[]"),
      blocks_draft: JSON.parse((r.blocks_draft as string) || "[]"),
      published: r.published, publish_at: r.publish_at || null,
      created_at: r.created_at, updated_at: r.updated_at,
    });
  } catch (e: unknown) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  try {
    const body = await req.json();
    const db = getDb();
    const existing = await db.execute({
      sql: "SELECT id FROM blog_posts WHERE slug = ?",
      args: [slug],
    });
    if (existing.rows.length === 0)
      return NextResponse.json({ error: "Not found" }, { status: 404 });

    const fields: Record<string, unknown> = {};
    const allowed = [
      "title", "description", "date", "read_time", "tag",
      "gradient", "featured_image", "published",
      "meta_title", "meta_description", "og_image", "publish_at",
    ];
    for (const key of allowed) {
      if (body[key] !== undefined) {
        if (key === "published") fields[key] = body[key] ? 1 : 0;
        else fields[key] = body[key];
      }
    }
    if (body.sections !== undefined) fields.sections = JSON.stringify(body.sections);
    if (body.related_slugs !== undefined) fields.related_slugs = JSON.stringify(body.related_slugs);
    if (body.blocks !== undefined) fields.blocks = JSON.stringify(body.blocks);
    if (body.blocks_draft !== undefined) fields.blocks_draft = JSON.stringify(body.blocks_draft);
    if (body.slug !== undefined && body.slug !== slug) fields.slug = body.slug;

    if (Object.keys(fields).length === 0)
      return NextResponse.json({ error: "No fields to update" }, { status: 400 });

    fields.updated_at = new Date().toISOString();

    const setClauses = Object.keys(fields).map((k) => `${k} = ?`);
    const values = [...Object.values(fields), slug];

    await db.execute({
      sql: `UPDATE blog_posts SET ${setClauses.join(", ")} WHERE slug = ?`,
      args: values as (string | number | null)[],
    });

    const newSlug = (fields.slug as string) || slug;
    const result = await db.execute({
      sql: "SELECT * FROM blog_posts WHERE slug = ?",
      args: [newSlug],
    });
    const r = result.rows[0];

    // Dispatch webhook (non-blocking)
    const isPublishToggle = body.published !== undefined;
    const webhookEvent = isPublishToggle && body.published ? "blog.published" : isPublishToggle && !body.published ? "blog.unpublished" : "blog.updated";
    dispatchWebhook(webhookEvent, { slug: newSlug, id: r.id, title: r.title }).catch(() => {});

    // Auto-score in the background (non-blocking)
    if (body.sections || body.description) {
      try {
        const sections = JSON.parse(r.sections as string);
        const textContent = [
          r.title,
          r.description,
          ...sections.flatMap((s: { heading?: string; body?: string | string[] }) => {
            const h = s.heading || "";
            const b = Array.isArray(s.body) ? s.body.join("\n") : s.body || "";
            return [h, b];
          }),
        ].filter(Boolean).join("\n\n");

        if (textContent.length > 100) {
          const baseUrl = req.nextUrl.origin;
          fetch(`${baseUrl}/api/score`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              content_type: "blog_post",
              content_id: r.id,
              content: textContent,
            }),
          }).catch(() => { /* fire and forget */ });
        }
      } catch { /* non-critical */ }
    }

    return NextResponse.json({
      id: r.id, slug: r.slug, title: r.title, description: r.description,
      date: r.date, read_time: r.read_time, tag: r.tag, gradient: r.gradient,
      featured_image: r.featured_image,
      meta_title: r.meta_title, meta_description: r.meta_description, og_image: r.og_image,
      sections: JSON.parse(r.sections as string),
      related_slugs: JSON.parse(r.related_slugs as string),
      blocks: JSON.parse((r.blocks as string) || "[]"),
      blocks_draft: JSON.parse((r.blocks_draft as string) || "[]"),
      published: r.published, publish_at: r.publish_at || null,
      brand_score: r.brand_score, voice_score: r.voice_score, clarity_score: r.clarity_score,
      score_summary: r.score_summary, scored_at: r.scored_at,
      created_at: r.created_at, updated_at: r.updated_at,
    });
  } catch (e: unknown) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  try {
    const db = getDb();
    const result = await db.execute({
      sql: "DELETE FROM blog_posts WHERE slug = ?",
      args: [slug],
    });
    if (result.rowsAffected === 0)
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ deleted: true });
  } catch (e: unknown) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
