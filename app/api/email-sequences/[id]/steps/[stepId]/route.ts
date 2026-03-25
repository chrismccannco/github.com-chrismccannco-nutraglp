import { NextRequest, NextResponse } from "next/server";
import { initDb } from "@/lib/db";

// PATCH /api/email-sequences/[id]/steps/[stepId]
export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string; stepId: string }> }) {
  try {
    const { id: rawId, stepId: rawStepId } = await params;
    const stepId = parseInt(rawStepId, 10);
    const sequenceId = parseInt(rawId, 10);
    const { step_number, delay_days, subject, preheader, body } = await req.json();
    const db = await initDb();
    await db.execute({
      sql: `UPDATE email_sequence_steps
            SET step_number = COALESCE(?, step_number),
                delay_days = COALESCE(?, delay_days),
                subject = COALESCE(?, subject),
                preheader = COALESCE(?, preheader),
                body = COALESCE(?, body),
                updated_at = CURRENT_TIMESTAMP
            WHERE id = ?`,
      args: [step_number ?? null, delay_days ?? null, subject ?? null, preheader ?? null, body ?? null, stepId],
    });
    await db.execute({
      sql: "UPDATE email_sequences SET updated_at = CURRENT_TIMESTAMP WHERE id = ?",
      args: [sequenceId],
    });
    const row = await db.execute({ sql: "SELECT * FROM email_sequence_steps WHERE id = ?", args: [stepId] });
    return NextResponse.json({ step: row.rows[0] });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}

// DELETE /api/email-sequences/[id]/steps/[stepId]
export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string; stepId: string }> }) {
  try {
    const { id: rawId, stepId: rawStepId } = await params;
    const stepId = parseInt(rawStepId, 10);
    const sequenceId = parseInt(rawId, 10);
    const db = await initDb();
    await db.execute({ sql: "DELETE FROM email_sequence_steps WHERE id = ?", args: [stepId] });
    await db.execute({
      sql: "UPDATE email_sequences SET updated_at = CURRENT_TIMESTAMP WHERE id = ?",
      args: [sequenceId],
    });
    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
