import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { withApiKey, corsOptions } from "@/lib/api-middleware";

export const OPTIONS = () => corsOptions();

export const GET = withApiKey("read", async (req: NextRequest) => {
  const { searchParams } = new URL(req.url);
  const featured = searchParams.get("featured");

  const db = getDb();

  let sql = "SELECT id, name, title, quote, rating, avatar_url, featured, sort_order FROM testimonials WHERE published = 1";
  const args: number[] = [];

  if (featured === "true") {
    sql += " AND featured = 1";
  }

  sql += " ORDER BY sort_order ASC, id DESC";

  const result = await db.execute({ sql, args });

  return NextResponse.json({
    data: result.rows.map((row) => ({
      id: Number(row.id),
      name: String(row.name),
      title: String(row.title || ""),
      quote: String(row.quote),
      rating: Number(row.rating || 5),
      avatar_url: String(row.avatar_url || ""),
      featured: Boolean(row.featured),
    })),
    total: result.rows.length,
  });
});
