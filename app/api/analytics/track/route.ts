import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const db = getDb();
    await db.execute({
      sql: "INSERT INTO page_views (path, referrer, user_agent) VALUES (?, ?, ?)",
      args: [
        body.path || "/",
        body.referrer || null,
        body.user_agent || req.headers.get("user-agent") || null,
      ],
    });
    return NextResponse.json({ tracked: true });
  } catch (e: unknown) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
