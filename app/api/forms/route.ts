import { NextRequest, NextResponse } from "next/server";
import { getDb, initDb } from "@/lib/db";
import { sendNotification, formSubmissionEmail } from "@/lib/email";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { form_name, email, name, data } = body;

    if (!email || !email.includes("@")) {
      return NextResponse.json({ error: "Valid email required" }, { status: 400 });
    }

    await initDb();
    const db = getDb();

    await db.execute({
      sql: `INSERT INTO form_submissions (form_name, email, name, data) VALUES (?, ?, ?, ?)`,
      args: [
        form_name || "waitlist",
        email.trim(),
        name?.trim() || null,
        JSON.stringify(data || {}),
      ],
    });

    // Fire-and-forget email notification
    sendNotification(
      formSubmissionEmail({
        form_name: form_name || "waitlist",
        email: email.trim(),
        name: name?.trim() || null,
        data: data || {},
      })
    ).catch(() => {});

    return NextResponse.json({ ok: true });
  } catch (e: unknown) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}

export async function GET() {
  try {
    await initDb();
    const db = getDb();
    const result = await db.execute(
      "SELECT * FROM form_submissions ORDER BY created_at DESC LIMIT 500"
    );
    return NextResponse.json(result.rows);
  } catch (e: unknown) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
