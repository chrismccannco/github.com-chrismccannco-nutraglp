import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";

/**
 * POST /api/performance/beacon
 * Receives Core Web Vitals and performance metrics from the browser.
 * Lightweight endpoint — no auth required, accepts sendBeacon payloads.
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const {
      url = "",
      path = "",
      deviceType = "desktop",
      connectionType = "",
      lcp = null,
      fid = null,
      cls = null,
      fcp = null,
      ttfb = null,
      inp = null,
      domLoad = null,
      pageLoad = null,
      transferSize = null,
      domElements = null,
    } = body;

    if (!path) {
      return NextResponse.json({ error: "path required" }, { status: 400 });
    }

    const db = getDb();
    await db.execute({
      sql: `INSERT INTO performance_metrics
            (url, path, device_type, connection_type, lcp, fid, cls, fcp, ttfb, inp, dom_load, page_load, transfer_size, dom_elements, user_agent)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      args: [
        url,
        path,
        deviceType,
        connectionType,
        lcp,
        fid,
        cls,
        fcp,
        ttfb,
        inp,
        domLoad,
        pageLoad,
        transferSize,
        domElements,
        req.headers.get("user-agent") || "",
      ],
    });

    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}

/** CORS preflight */
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
}
