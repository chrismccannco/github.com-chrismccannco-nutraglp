import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";

export async function GET() {
  try {
    const db = getDb();
    const result = await db.execute(
      "SELECT * FROM products ORDER BY sort_order ASC, id ASC"
    );
    const products = result.rows.map((r) => ({
      id: r.id,
      slug: r.slug,
      name: r.name,
      tagline: r.tagline,
      price: r.price,
      description: r.description,
      features: JSON.parse(r.features as string),
      status: r.status,
      launch_date: r.launch_date,
      sort_order: r.sort_order,
      published: r.published,
    }));
    return NextResponse.json(products);
  } catch (e: unknown) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const db = getDb();

    const insertResult = await db.execute({
      sql: `INSERT INTO products (slug, name, tagline, price, description, features, status, launch_date, sort_order)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      args: [
        body.slug,
        body.name,
        body.tagline || "",
        body.price || "",
        body.description || "",
        JSON.stringify(body.features || []),
        body.status || "coming-soon",
        body.launch_date || "",
        body.sort_order ?? 0,
      ],
    });

    const result = await db.execute({
      sql: "SELECT * FROM products WHERE id = ?",
      args: [insertResult.lastInsertRowid!],
    });
    const r = result.rows[0];
    return NextResponse.json(
      {
        id: r.id, slug: r.slug, name: r.name, tagline: r.tagline,
        price: r.price, description: r.description,
        features: JSON.parse(r.features as string),
        status: r.status, launch_date: r.launch_date, sort_order: r.sort_order,
      },
      { status: 201 }
    );
  } catch (e: unknown) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
