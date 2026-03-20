import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { withApiKey, corsOptions } from "@/lib/api-middleware";

export const OPTIONS = () => corsOptions();

export const GET = withApiKey("read", async (req: NextRequest) => {
  const { searchParams } = new URL(req.url);
  const category = searchParams.get("category");

  const db = getDb();

  let sql = "SELECT id, category, question, answer, sort_order FROM faqs WHERE published = 1";
  const args: string[] = [];

  if (category) {
    sql += " AND category = ?";
    args.push(category);
  }

  sql += " ORDER BY sort_order ASC, id ASC";

  const result = await db.execute({ sql, args });

  return NextResponse.json({
    data: result.rows.map((row) => ({
      id: Number(row.id),
      category: String(row.category || ""),
      question: String(row.question),
      answer: String(row.answer),
      sort_order: Number(row.sort_order || 0),
    })),
    total: result.rows.length,
  });
});
