import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const db = getDb();
    const result = await db.execute({
      sql: "SELECT * FROM brand_voices WHERE id = ?",
      args: [Number(id)],
    });
    if (result.rows.length === 0) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    return NextResponse.json(result.rows[0]);
  } catch (e: unknown) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const db = getDb();

    // If setting is_default to 1, first set all others to 0
    if (body.is_default === 1 || body.is_default === true) {
      await db.execute({
        sql: "UPDATE brand_voices SET is_default = 0 WHERE id != ?",
        args: [Number(id)],
      });
    }

    const fields: Record<string, unknown> = {};
    const allowed = [
      "name",
      "slug",
      "tagline",
      "mission",
      "audience",
      "tone",
      "dos",
      "donts",
      "exemplar",
    ];
    for (const key of allowed) {
      if (body[key] !== undefined) fields[key] = body[key];
    }
    if (body.is_default !== undefined) {
      fields.is_default = body.is_default ? 1 : 0;
    }

    if (Object.keys(fields).length === 0) {
      return NextResponse.json(
        { error: "No fields to update" },
        { status: 400 }
      );
    }

    const setClauses = Object.keys(fields).map((k) => `${k} = ?`);
    const values = [...Object.values(fields), Number(id)];

    await db.execute({
      sql: `UPDATE brand_voices SET ${setClauses.join(", ")}, updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
      args: values as (string | number | null)[],
    });

    const result = await db.execute({
      sql: "SELECT * FROM brand_voices WHERE id = ?",
      args: [Number(id)],
    });
    return NextResponse.json(result.rows[0]);
  } catch (e: unknown) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const db = getDb();

    // Check if this is the default voice
    const result = await db.execute({
      sql: "SELECT is_default FROM brand_voices WHERE id = ?",
      args: [Number(id)],
    });

    if (result.rows.length === 0) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    if (result.rows[0].is_default === 1) {
      return NextResponse.json(
        { error: "Cannot delete the default brand voice" },
        { status: 400 }
      );
    }

    const deleteResult = await db.execute({
      sql: "DELETE FROM brand_voices WHERE id = ?",
      args: [Number(id)],
    });

    if (deleteResult.rowsAffected === 0) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    return NextResponse.json({ deleted: true });
  } catch (e: unknown) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
