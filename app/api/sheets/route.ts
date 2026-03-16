import { NextRequest, NextResponse } from "next/server";

/**
 * Relay form submissions to Google Sheets via Apps Script web app.
 * Requires GOOGLE_SHEETS_WEBHOOK_URL env var.
 * Falls back silently if not configured.
 */
export async function POST(req: NextRequest) {
  try {
    const webhookUrl = process.env.GOOGLE_SHEETS_WEBHOOK_URL;
    if (!webhookUrl) {
      return NextResponse.json({ ok: true, note: "Sheets webhook not configured" });
    }

    const body = await req.json();

    // Fire and forget to Google Sheets
    const res = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        form: body.form || "unknown",
        email: body.email || "",
        phone: body.phone || "",
        sms_opt_in: body.sms_opt_in || false,
        source: body.source || "",
        timestamp: new Date().toISOString(),
      }),
    });

    if (!res.ok) {
      console.error("Sheets webhook error:", res.status);
    }

    return NextResponse.json({ ok: true });
  } catch (e: unknown) {
    console.error("Sheets relay error:", e);
    return NextResponse.json({ ok: true }); // Don't break form flow
  }
}
