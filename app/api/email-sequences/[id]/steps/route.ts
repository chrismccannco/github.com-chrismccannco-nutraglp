import { NextRequest, NextResponse } from "next/server";
import { initDb } from "@/lib/db";

// POST /api/email-sequences/[id]/steps — add a step
export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: rawId } = await params;
    const sequence_id = parseInt(rawId, 10);
    const { step_number, delay_days = 0, subject, preheader, body } = await req.json();
    if (!subject?.trim() || !body?.trim()) {
      return NextResponse.json({ error: "subject and body are required" }, { status: 400 });
    }
    const db = await initDb();
    // Auto step_number if not provided
    let stepNum = step_number;
    if (!stepNum) {
      const max = await db.execute({
        sql: "SELECT MAX(step_number) as mx FROM email_sequence_steps WHERE sequence_id = ?",
        args: [sequence_id],
      });
      stepNum = ((max.rows[0]?.mx as number) || 0) + 1;
    }
    const r = await db.execute({
      sql: `INSERT INTO email_sequence_steps (sequence_id, step_number, delay_days, subject, preheader, body)
            VALUES (?, ?, ?, ?, ?, ?)`,
      args: [sequence_id, stepNum, delay_days, subject.trim(), preheader || null, body.trim()],
    });
    const row = await db.execute({
      sql: "SELECT * FROM email_sequence_steps WHERE id = ?",
      args: [Number(r.lastInsertRowid)],
    });
    // Touch parent updated_at
    await db.execute({
      sql: "UPDATE email_sequences SET updated_at = CURRENT_TIMESTAMP WHERE id = ?",
      args: [sequence_id],
    });
    return NextResponse.json({ step: row.rows[0] }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
