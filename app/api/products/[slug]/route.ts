import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { dispatchWebhook } from "@/lib/webhooks";
import { createVersion } from "@/lib/versions";
import { writeAudit } from "@/lib/audit";
import { requireRole } from "@/lib/admin-auth";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  try {
    const db = getDb();
    const result = await db.execute({
      sql: "SELECT * FROM products WHERE slug = ?",
      args: [slug],
    });
    if (result.rows.length === 0)
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    const r = result.rows[0];
    return NextResponse.json({
      id: r.id, slug: r.slug, name: r.name, tagline: r.tagline,
      price: r.price, description: r.description,
      features: JSON.parse(r.features as string),
      status: r.status, launch_date: r.launch_date, sort_order: r.sort_order,
      published: r.published,
    });
  } catch (e: unknown) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { user: actor, error: authError } = await requireRole(req, "editor");
  if (authError) return authError;
  const { slug } = await params;
  try {
    const body = await req.json();
    const db = getDb();
    const existing = await db.execute({
      sql: "SELECT * FROM products WHERE slug = ?",
      args: [slug],
    });
    if (existing.rows.length === 0)
      return NextResponse.json({ error: "Not found" }, { status: 404 });

    // Snapshot before update
    const cur = existing.rows[0];
    await createVersion("product", Number(cur.id), {
      name: cur.name, tagline: cur.tagline, price: cur.price,
      description: cur.description, features: cur.features,
      status: cur.status, published: cur.published,
    });

    const fields: Record<string, unknown> = {};
    const allowed = [
      "name", "tagline", "price", "description", "status",
      "launch_date", "sort_order", "published",
    ];
    for (const key of allowed) {
      if (body[key] !== undefined) fields[key] = body[key];
    }
    if (body.features !== undefined) fields.features = JSON.stringify(body.features);
    if (body.slug !== undefined && body.slug !== slug) fields.slug = body.slug;

    if (Object.keys(fields).length === 0)
      return NextResponse.json({ error: "No fields to update" }, { status: 400 });

    const setClauses = Object.keys(fields).map((k) => `${k} = ?`);
    const values = [...Object.values(fields), slug];

    await db.execute({
      sql: `UPDATE products SET ${setClauses.join(", ")} WHERE slug = ?`,
      args: values as (string | number | null)[],
    });

    const newSlug = (fields.slug as string) || slug;
    const result = await db.execute({
      sql: "SELECT * FROM products WHERE slug = ?",
      args: [newSlug],
    });
    const r = result.rows[0];

    // Audit + webhook (non-blocking)
    writeAudit("updated", "product", newSlug, r.name as string, { changedFields: Object.keys(fields) }, actor ?? undefined);
    dispatchWebhook("product.updated", { slug: newSlug, id: r.id, name: r.name }).catch(() => {});

    return NextResponse.json({
      id: r.id, slug: r.slug, name: r.name, tagline: r.tagline,
      price: r.price, description: r.description,
      features: JSON.parse(r.features as string),
      status: r.status, launch_date: r.launch_date, sort_order: r.sort_order,
      published: r.published,
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
      sql: "DELETE FROM products WHERE slug = ?",
      args: [slug],
    });
    if (result.rowsAffected === 0)
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ deleted: true });
  } catch (e: unknown) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
