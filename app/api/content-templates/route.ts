import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";

function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 80);
}

// GET /api/content-templates
export async function GET(req: NextRequest) {
  try {
    const db = getDb();
    const url = new URL(req.url);
    const category = url.searchParams.get("category");

    let sql = "SELECT * FROM content_templates";
    const args: string[] = [];
    if (category) {
      sql += " WHERE category = ?";
      args.push(category);
    }
    sql += " ORDER BY sort_order ASC, name ASC";

    const result = await db.execute({ sql, args });
    return NextResponse.json(result.rows);
  } catch (e: unknown) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}

// POST /api/content-templates
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const db = getDb();

    if (!body.name || !body.prompt_template) {
      return NextResponse.json(
        { error: "name and prompt_template are required" },
        { status: 400 }
      );
    }

    const slug = generateSlug(body.name);
    const variables = body.variables ? JSON.stringify(body.variables) : "[]";
    const knowledgeDocIds = body.knowledge_doc_ids ? JSON.stringify(body.knowledge_doc_ids) : "[]";

    const insertResult = await db.execute({
      sql: `INSERT INTO content_templates (name, slug, description, category, prompt_template, voice_id, knowledge_doc_ids, output_format, max_tokens, variables, sort_order)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      args: [
        body.name,
        slug,
        body.description || null,
        body.category || "general",
        body.prompt_template,
        body.voice_id || null,
        knowledgeDocIds,
        body.output_format || "prose",
        body.max_tokens || 1024,
        variables,
        body.sort_order || 0,
      ],
    });

    const result = await db.execute({
      sql: "SELECT * FROM content_templates WHERE id = ?",
      args: [Number(insertResult.lastInsertRowid)],
    });
    return NextResponse.json(result.rows[0], { status: 201 });
  } catch (e: unknown) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
