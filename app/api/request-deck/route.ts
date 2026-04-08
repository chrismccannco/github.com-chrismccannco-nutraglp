import { NextRequest, NextResponse } from "next/server";
import { getDb, initDb } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, company } = body;

    if (!email || !email.includes("@")) {
      return NextResponse.json({ error: "Valid email required" }, { status: 400 });
    }

    await initDb();
    const db = getDb();
    await db.execute({
      sql: `INSERT INTO form_submissions (form_name, email, name, data) VALUES (?, ?, ?, ?)`,
      args: [
        "request-deck",
        email.trim(),
        name?.trim() || null,
        JSON.stringify({ company: company?.trim() || "" }),
      ],
    });

    const apiKey = process.env.RESEND_API_KEY;
    if (apiKey) {
      await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: "NutraGLP <notifications@nutraglp.com>",
          to: ["richard@nutraglpbio.com", "chris@nutraglpbio.com"],
          subject: "Requesting the Deck",
          html: `
            <div style="font-family:-apple-system,system-ui,sans-serif;max-width:480px">
              <h2 style="color:#1B3A5C;font-size:18px;margin-bottom:16px">New Deck Request</h2>
              <table style="width:100%;border-collapse:collapse">
                <tr><td style="padding:4px 12px 4px 0;color:#666;font-size:13px">Name</td><td style="padding:4px 0;font-size:13px;font-weight:600">${name || "Not provided"}</td></tr>
                <tr><td style="padding:4px 12px 4px 0;color:#666;font-size:13px">Email</td><td style="padding:4px 0;font-size:13px">${email.trim()}</td></tr>
                ${company ? `<tr><td style="padding:4px 12px 4px 0;color:#666;font-size:13px">Fund / Firm</td><td style="padding:4px 0;font-size:13px">${company}</td></tr>` : ""}
              </table>
              <hr style="margin:20px 0;border:none;border-top:1px solid #eee" />
              <p style="font-size:12px;color:#999">Added to investor mailing list.</p>
            </div>
          `,
        }),
      }).catch(() => {});
    }

    return NextResponse.json({ ok: true });
  } catch (e: unknown) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
