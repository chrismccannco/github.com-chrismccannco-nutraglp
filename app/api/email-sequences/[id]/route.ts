import { NextRequest, NextResponse } from "next/server";
import { initDb } from "@/lib/db";

// GET /api/email-sequences/[id] — sequence + all steps
export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: rawId } = await params;
    const id = parseInt(rawId, 10);
    const db = await initDb();
    const [seqResult, stepsResult] = await Promise.all([
      db.execute({ sql: "SELECT * FROM email_sequences WHERE id = ?", args: [id] }),
      db.execute({
        sql: "SELECT * FROM email_sequence_steps WHERE sequence_id = ? ORDER BY step_number ASC",
        args: [id],
      }),
    ]);
    if (seqResult.rows.length === 0) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ sequence: seqResult.rows[0], steps: stepsResult.rows });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}

// PATCH /api/email-sequences/[id] — update sequence metadata
export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: rawId } = await params;
    const id = parseInt(rawId, 10);
    const { name, description, trigger_event, status } = await req.json();
    const db = await initDb();
    await db.execute({
      sql: `UPDATE email_sequences
            SET name = COALESCE(?, name),
                description = COALESCE(?, description),
                trigger_event = COALESCE(?, trigger_event),
                status = COALESCE(?, status),
                updated_at = CURRENT_TIMESTAMP
            WHERE id = ?`,
      args: [name ?? null, description ?? null, trigger_event ?? null, status ?? null, id],
    });
    const row = await db.execute({ sql: "SELECT * FROM email_sequences WHERE id = ?", args: [id] });
    return NextResponse.json({ sequence: row.rows[0] });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}

// DELETE /api/email-sequences/[id]
export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: rawId } = await params;
    const id = parseInt(rawId, 10);
    const db = await initDb();
    await db.execute({ sql: "DELETE FROM email_sequences WHERE id = ?", args: [id] });
    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
