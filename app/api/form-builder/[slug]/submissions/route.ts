import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";

interface RouteContext {
  params: Promise<{ slug: string }>;
}

/** GET /api/form-builder/:slug/submissions — list submissions */
export async function GET(req: NextRequest, ctx: RouteContext) {
  try {
    const { slug } = await ctx.params;
    const { searchParams } = new URL(req.url);
    const limit = Math.min(Number(searchParams.get("limit")) || 50, 500);
    const offset = Number(searchParams.get("offset")) || 0;

    const db = getDb();

    // Get form
    const form = await db.execute({
      sql: "SELECT id FROM forms WHERE slug = ?",
      args: [slug],
    });
    if (!form.rows.length) {
      return NextResponse.json({ error: "Form not found" }, { status: 404 });
    }
    const formId = (form.rows[0] as unknown as Record<string, unknown>).id as number;

    // Count
    const countResult = await db.execute({
      sql: "SELECT COUNT(*) as total FROM form_submissions WHERE form_id = ?",
      args: [formId],
    });
    const total = (countResult.rows[0] as unknown as Record<string, unknown>).total as number;

    // Submissions
    const result = await db.execute({
      sql: "SELECT * FROM form_submissions WHERE form_id = ? ORDER BY created_at DESC LIMIT ? OFFSET ?",
      args: [formId, limit, offset],
    });

    const submissions = result.rows.map((row) => {
      const r = row as unknown as Record<string, unknown>;
      return {
        ...r,
        data: JSON.parse((r.data as string) || "{}"),
        metadata: JSON.parse((r.metadata as string) || "{}"),
      };
    });

    return NextResponse.json({ submissions, total, limit, offset });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}

/** POST /api/form-builder/:slug/submissions — submit a form (public) */
export async function POST(req: NextRequest, ctx: RouteContext) {
  try {
    const { slug } = await ctx.params;
    const body = await req.json();

    const db = getDb();

    // Get form
    const form = await db.execute({
      sql: "SELECT * FROM forms WHERE slug = ? AND published = 1",
      args: [slug],
    });
    if (!form.rows.length) {
      return NextResponse.json({ error: "Form not found" }, { status: 404 });
    }

    const formRow = form.rows[0] as unknown as Record<string, unknown>;
    const formId = formRow.id as number;
    const settings = JSON.parse((formRow.settings as string) || "{}");

    // Check submission limit
    if (settings.limitSubmissions) {
      const count = formRow.submission_count as number;
      if (count >= settings.limitSubmissions) {
        return NextResponse.json({ error: "This form is no longer accepting submissions" }, { status: 403 });
      }
    }

    // Honeypot check
    if (settings.honeypot && body._hp_check) {
      // Bot detected — silently succeed
      return NextResponse.json({ ok: true });
    }

    // Remove honeypot field from data
    const data = { ...body };
    delete data._hp_check;

    const metadata = {
      userAgent: req.headers.get("user-agent") || "",
      referrer: req.headers.get("referer") || "",
      submittedAt: new Date().toISOString(),
    };

    await db.execute({
      sql: "INSERT INTO form_submissions (form_id, data, metadata) VALUES (?, ?, ?)",
      args: [formId, JSON.stringify(data), JSON.stringify(metadata)],
    });

    // Increment submission count
    await db.execute({
      sql: "UPDATE forms SET submission_count = submission_count + 1 WHERE id = ?",
      args: [formId],
    });

    return NextResponse.json({
      ok: true,
      message: settings.successMessage || "Thank you for your submission.",
      redirectUrl: settings.redirectUrl || null,
    });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
