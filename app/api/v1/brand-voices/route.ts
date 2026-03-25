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
      sql: "SELECT * FROM brand_voices WHERE slug = ?",
      args: [slug],
    });
    if (result.rows.length === 0) {
      return NextResponse.json({ error: "Brand voice not found" }, { status: 404 });
    }
    return NextResponse.json(formatVoice(result.rows[0]));
  }

  const result = await db.execute(
    "SELECT * FROM brand_voices ORDER BY is_default DESC, name ASC"
  );

  return NextResponse.json({
    data: result.rows.map(formatVoice),
    total: result.rows.length,
  });
});

function formatVoice(row: Record<string, unknown>) {
  return {
    id: Number(row.id),
    name: String(row.name),
    slug: String(row.slug),
    is_default: Boolean(row.is_default),
    tagline: row.tagline ? String(row.tagline) : null,
    mission: row.mission ? String(row.mission) : null,
    audience: row.audience ? String(row.audience) : null,
    tone: row.tone ? String(row.tone) : null,
    dos: row.dos ? String(row.dos) : null,
    donts: row.donts ? String(row.donts) : null,
    exemplar: row.exemplar ? String(row.exemplar) : null,
    created_at: String(row.created_at || ""),
  };
}
