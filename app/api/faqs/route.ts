import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";

export async function GET() {
  try {
    const db = getDb();
    const result = await db.execute(
      "SELECT * FROM faqs ORDER BY sort_order ASC, id ASC"
    );
    return NextResponse.json(result.rows);
  } catch (e: unknown) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const db = getDb();

    const maxResult = await db.execute(
      "SELECT MAX(sort_order) as max_order FROM faqs"
    );
    const maxOrder = (maxResult.rows[0]?.max_order as number | null) ?? 0;

    const insertResult = await db.execute({
      sql: `INSERT INTO faqs (category, question, answer, sort_order, published)
            VALUES (?, ?, ?, ?, ?)`,
      args: [
        body.category || "",
        body.question,
        body.answer,
        body.sort_order ?? maxOrder + 1,
        body.published !== undefined ? (body.published ? 1 : 0) : 1,
      ],
    });

    const result = await db.execute({
      sql: "SELECT * FROM faqs WHERE id = ?",
      args: [Number(insertResult.lastInsertRowid)],
    });
    return NextResponse.json(result.rows[0], { status: 201 });
  } catch (e: unknown) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
