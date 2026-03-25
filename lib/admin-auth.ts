/**
 * Server-side admin auth helpers for Next.js route handlers.
 *
 * Usage:
 *   const { user, error } = await getSessionUser(req);
 *   if (error) return error;          // 401 or 403 response
 *
 *   const { user, error } = await requireRole(req, "editor");
 *   if (error) return error;
 */

import { NextRequest, NextResponse } from "next/server";
import { validateSession, type UserRole } from "./auth";

const ROLE_RANK: Record<UserRole, number> = { viewer: 0, editor: 1, admin: 2 };

export async function getSessionUser(req: NextRequest) {
  const token = req.cookies.get("admin_token")?.value;
  if (!token) {
    return {
      user: null,
      error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }),
    };
  }
  const user = await validateSession(token);
  if (!user) {
    return {
      user: null,
      error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }),
    };
  }
  return { user, error: null };
}

/**
 * Require a minimum role. Returns 401 if not logged in, 403 if insufficient role.
 */
export async function requireRole(req: NextRequest, minRole: UserRole) {
  const { user, error } = await getSessionUser(req);
  if (error) return { user: null, error };
  if (ROLE_RANK[user!.role] < ROLE_RANK[minRole]) {
    return {
      user: null,
      error: NextResponse.json(
        { error: "Forbidden — insufficient permissions" },
        { status: 403 }
      ),
    };
  }
  return { user, error: null };
}
