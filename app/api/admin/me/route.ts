import { NextRequest, NextResponse } from "next/server";
import { validateSession, deleteSession } from "@/lib/auth";

/**
 * GET /api/admin/me — Get current user from session cookie
 */
export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get("admin_token")?.value;
    if (!token) {
      return NextResponse.json({ user: null }, { status: 401 });
    }
    const user = await validateSession(token);
    if (!user) {
      return NextResponse.json({ user: null }, { status: 401 });
    }
    return NextResponse.json({ user });
  } catch (e: unknown) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}

/**
 * DELETE /api/admin/me — Logout (delete session)
 */
export async function DELETE(req: NextRequest) {
  try {
    const token = req.cookies.get("admin_token")?.value;
    if (token) {
      await deleteSession(token);
    }
    const res = NextResponse.json({ ok: true });
    res.cookies.delete("admin_token");
    return res;
  } catch (e: unknown) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
