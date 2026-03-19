import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";

function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const db = getDb();

    // Fetch the original voice
    const result = await db.execute({
      sql: "SELECT * FROM brand_voices WHERE id = ?",
      args: [Number(id)],
    });

    if (result.rows.length === 0) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const original = result.rows[0];
    const newName = `${original.name as string} (Copy)`;
    const newSlug = `${generateSlug(original.name as string)}-copy`;

    // Insert the duplicate
    const insertResult = await db.execute({
      sql: `INSERT INTO brand_voices (name, slug, is_default, tagline, mission, audience, tone, dos, donts, exemplar)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      args: [
        newName,
        newSlug,
        0, // is_default always 0 for copies
        original.tagline || null,
        original.mission || null,
        original.audience || null,
        original.tone || null,
        original.dos || null,
        original.donts || null,
        original.exemplar || null,
      ],
    });

    const duplicated = await db.execute({
      sql: "SELECT * FROM brand_voices WHERE id = ?",
      args: [Number(insertResult.lastInsertRowid)],
    });

    return NextResponse.json(duplicated.rows[0], { status: 201 });
  } catch (e: unknown) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
