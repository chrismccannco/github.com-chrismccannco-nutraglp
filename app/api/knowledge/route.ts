import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 80);
}

function countWords(text: string): number {
  return text.trim().split(/\s+/).filter(Boolean).length;
}

// GET /api/knowledge — list all docs
export async function GET(req: NextRequest) {
  try {
    const db = getDb();
    const url = new URL(req.url);
    const docType = url.searchParams.get("type");
    const search = url.searchParams.get("q");
    const enabledOnly = url.searchParams.get("enabled") !== "0";

    let sql = "SELECT id, title, slug, doc_type, summary, tags, word_count, enabled, created_at, updated_at FROM knowledge_docs";
    const conditions: string[] = [];
    const args: (string | number)[] = [];

    if (enabledOnly) {
      conditions.push("enabled = 1");
    }
    if (docType) {
      conditions.push("doc_type = ?");
      args.push(docType);
    }
    if (search) {
      conditions.push("(title LIKE ? OR content LIKE ? OR tags LIKE ?)");
      const term = `%${search}%`;
      args.push(term, term, term);
    }

    if (conditions.length > 0) {
      sql += " WHERE " + conditions.join(" AND ");
    }
    sql += " ORDER BY updated_at DESC";

    const result = await db.execute({ sql, args });
    return NextResponse.json(result.rows);
  } catch (e: unknown) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}

// POST /api/knowledge — create a doc
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const db = getDb();

    if (!body.title) {
      return NextResponse.json(
        { error: "title is required" },
        { status: 400 }
      );
    }

    const slug = generateSlug(body.title);
    const wordCount = countWords(body.content);
    const tags = body.tags ? JSON.stringify(body.tags) : "[]";

    const insertResult = await db.execute({
      sql: `INSERT INTO knowledge_docs (title, slug, doc_type, content, summary, tags, word_count, enabled)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      args: [
        body.title,
        slug,
        body.doc_type || "general",
        body.content,
        body.summary || null,
        tags,
        wordCount,
        body.enabled !== undefined ? (body.enabled ? 1 : 0) : 1,
      ],
    });

    const result = await db.execute({
      sql: "SELECT * FROM knowledge_docs WHERE id = ?",
      args: [Number(insertResult.lastInsertRowid)],
    });
    return NextResponse.json(result.rows[0], { status: 201 });
  } catch (e: unknown) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
