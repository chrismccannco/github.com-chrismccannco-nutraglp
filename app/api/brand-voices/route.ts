import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { requireRole } from "@/lib/admin-auth";
import { writeAudit } from "@/lib/audit";

function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export async function GET() {
  try {
    const db = getDb();
    const result = await db.execute(
      "SELECT * FROM brand_voices ORDER BY is_default DESC, name ASC"
    );
    return NextResponse.json(result.rows);
  } catch (e: unknown) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const { user: actor, error: authError } = await requireRole(req, "admin");
  if (authError) return authError;
  try {
    const body = await req.json();
    const db = getDb();

    if (!body.name) {
      return NextResponse.json(
        { error: "name is required" },
        { status: 400 }
      );
    }

    const slug = generateSlug(body.name);

    const insertResult = await db.execute({
      sql: `INSERT INTO brand_voices (name, slug, is_default, tagline, mission, audience, tone, dos, donts, exemplar)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      args: [
        body.name,
        slug,
        body.is_default ? 1 : 0,
        body.tagline || null,
        body.mission || null,
        body.audience || null,
        body.tone || null,
        body.dos || null,
        body.donts || null,
        body.exemplar || null,
      ],
    });

    const result = await db.execute({
      sql: "SELECT * FROM brand_voices WHERE id = ?",
      args: [Number(insertResult.lastInsertRowid)],
    });
    const row = result.rows[0];
    writeAudit("created", "brand_voice", Number(insertResult.lastInsertRowid), body.name, {}, actor ?? undefined);
    return NextResponse.json(row, { status: 201 });
  } catch (e: unknown) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
