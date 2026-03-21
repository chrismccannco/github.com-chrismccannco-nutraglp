import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

/**
 * POST /api/media-tools/remove-bg
 *
 * Background removal has been moved to client-side processing using
 * @imgly/background-removal (WASM). This route is kept as a stub
 * for backwards compatibility.
 */
export async function POST(req: NextRequest) {
  return NextResponse.json(
    { error: "Background removal now runs client-side. Please update your client." },
    { status: 410 }
  );
}
