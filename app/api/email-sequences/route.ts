import { NextRequest, NextResponse } from "next/server";
import { initDb } from "@/lib/db";

// GET /api/email-sequences — list all sequences with step counts
export async function GET() {
  try {
    const db = await initDb();
    const result = await db.execute(`
      SELECT s.*, COUNT(st.id) as step_count
      FROM email_sequences s
      LEFT JOIN email_sequence_steps st ON st.sequence_id = s.id
      GROUP BY s.id
      ORDER BY s.updated_at DESC
    `);
    return NextResponse.json({ sequences: result.rows });
  } catch (err) {
    console.error("GET /api/email-sequences:", err);
    return NextResponse.json({ error: "Failed to load sequences" }, { status: 500 });
  }
}

// POST /api/email-sequences — create new sequence
export async function POST(req: NextRequest) {
  try {
    const { name, description, trigger_event = "manual" } = await req.json();
    if (!name?.trim()) return NextResponse.json({ error: "name is required" }, { status: 400 });
    const db = await initDb();
    const r = await db.execute({
      sql: "INSERT INTO email_sequences (name, description, trigger_event) VALUES (?, ?, ?)",
      args: [name.trim(), description || null, trigger_event],
    });
    const row = await db.execute({
      sql: "SELECT * FROM email_sequences WHERE id = ?",
      args: [Number(r.lastInsertRowid)],
    });
    return NextResponse.json({ sequence: row.rows[0] }, { status: 201 });
  } catch (err) {
    console.error("POST /api/email-sequences:", err);
    return NextResponse.json({ error: "Failed to create sequence" }, { status: 500 });
  }
}
