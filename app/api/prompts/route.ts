import { NextRequest, NextResponse } from "next/server";
import { initDb } from "@/lib/db";
import { requireRole } from "@/lib/admin-auth";

export async function GET() {
  try {
    const db = await initDb();
    const result = await db.execute(
      "SELECT id, title, prompt, category, created_by, sort_order, created_at FROM saved_prompts ORDER BY sort_order ASC, created_at DESC"
    );
    return NextResponse.json({ prompts: result.rows });
  } catch (err) {
    console.error("GET /api/prompts error:", err);
    return NextResponse.json({ error: "Failed to load prompts" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const { error: authError } = await requireRole(req, "editor");
  if (authError) return authError;
  try {
    const { title, prompt, category = "general", created_by } = await req.json();
    if (!title?.trim() || !prompt?.trim()) {
      return NextResponse.json({ error: "title and prompt are required" }, { status: 400 });
    }
    const db = await initDb();
    const result = await db.execute({
      sql: "INSERT INTO saved_prompts (title, prompt, category, created_by) VALUES (?, ?, ?, ?)",
      args: [title.trim(), prompt.trim(), category, created_by || null],
    });
    const row = await db.execute({
      sql: "SELECT id, title, prompt, category, created_by, sort_order, created_at FROM saved_prompts WHERE id = ?",
      args: [Number(result.lastInsertRowid)],
    });
    return NextResponse.json({ prompt: row.rows[0] }, { status: 201 });
  } catch (err) {
    console.error("POST /api/prompts error:", err);
    return NextResponse.json({ error: "Failed to save prompt" }, { status: 500 });
  }
}
