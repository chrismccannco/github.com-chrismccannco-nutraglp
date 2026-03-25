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
      sql: "SELECT * FROM audience_personas WHERE slug = ?",
      args: [slug],
    });
    if (result.rows.length === 0) {
      return NextResponse.json({ error: "Persona not found" }, { status: 404 });
    }
    return NextResponse.json(formatPersona(result.rows[0]));
  }

  const result = await db.execute(
    "SELECT * FROM audience_personas ORDER BY is_default DESC, name ASC"
  );

  return NextResponse.json({
    data: result.rows.map(formatPersona),
    total: result.rows.length,
  });
});

function formatPersona(row: Record<string, unknown>) {
  let channels: string[] = [];
  try { channels = JSON.parse(String(row.channels || "[]")); } catch { /* */ }

  return {
    id: Number(row.id),
    name: String(row.name),
    slug: String(row.slug),
    is_default: Boolean(row.is_default),
    description: row.description ? String(row.description) : null,
    demographics: row.demographics ? String(row.demographics) : null,
    goals: row.goals ? String(row.goals) : null,
    pain_points: row.pain_points ? String(row.pain_points) : null,
    communication_style: row.communication_style ? String(row.communication_style) : null,
    objections: row.objections ? String(row.objections) : null,
    channels,
    created_at: String(row.created_at || ""),
  };
}
