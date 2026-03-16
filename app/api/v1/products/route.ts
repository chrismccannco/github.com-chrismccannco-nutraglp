import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { withApiKey, corsOptions } from "@/lib/api-middleware";

export const OPTIONS = () => corsOptions();

export const GET = withApiKey("read", async (req: NextRequest) => {
  const { searchParams } = new URL(req.url);
  const slug = searchParams.get("slug");

  const db = getDb();

  if (slug) {
    const result = await db.execute({
      sql: "SELECT * FROM products WHERE slug = ? AND published = 1",
      args: [slug],
    });
    if (result.rows.length === 0) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }
    return NextResponse.json(formatProduct(result.rows[0]));
  }

  const result = await db.execute(
    "SELECT * FROM products WHERE published = 1 ORDER BY sort_order ASC, id ASC"
  );

  return NextResponse.json({
    data: result.rows.map(formatProduct),
    total: result.rows.length,
  });
});

function formatProduct(row: Record<string, unknown>) {
  let features = [];
  try { features = JSON.parse(String(row.features || "[]")); } catch { /* */ }

  return {
    id: Number(row.id),
    slug: String(row.slug),
    name: String(row.name),
    tagline: String(row.tagline || ""),
    price: String(row.price || ""),
    description: String(row.description || ""),
    features,
    status: String(row.status || "available"),
    launch_date: String(row.launch_date || ""),
  };
}
