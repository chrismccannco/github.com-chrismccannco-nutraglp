import { NextRequest, NextResponse } from "next/server";
import { getUserByEmail, verifyPassword, createSession, hashPassword } from "@/lib/auth";
import { getDb } from "@/lib/db";

/**
 * POST /api/admin/login
 * Body: { email, password } — multi-user login
 * Body: { password }        — legacy single-password (backward compat)
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password } = body;

    if (!password) {
      return NextResponse.json({ error: "Password required" }, { status: 400 });
    }

    const db = getDb();

    // Ensure tables exist (initDb may not have run yet on fresh deploy)
    try {
      await db.execute("SELECT 1 FROM admin_users LIMIT 1");
    } catch {
      // Tables don't exist yet — create them
      await db.execute(`CREATE TABLE IF NOT EXISTS admin_users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT UNIQUE NOT NULL,
        name TEXT NOT NULL,
        password_hash TEXT NOT NULL,
        role TEXT NOT NULL DEFAULT 'editor',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )`);
      await db.execute(`CREATE TABLE IF NOT EXISTS admin_sessions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        token TEXT UNIQUE NOT NULL,
        expires_at DATETIME NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )`);
    }

    // Multi-user login (email + password)
    if (email) {
      const user = await getUserByEmail(email);
      if (!user) {
        return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
      }
      const valid = await verifyPassword(password, user.password_hash);
      if (!valid) {
        return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
      }
      const token = await createSession(user.id);
      const res = NextResponse.json({
        user: { id: user.id, email: user.email, name: user.name, role: user.role },
      });
      res.cookies.set("admin_token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 7 * 24 * 60 * 60,
      });
      return res;
    }

    // Legacy single-password login
    const settingResult = await db.execute({
      sql: "SELECT value FROM site_settings WHERE key = 'admin_password'",
      args: [],
    });
    const adminPw = settingResult.rows.length > 0
      ? String(settingResult.rows[0].value)
      : "nutraglp2025";

    if (password !== adminPw) {
      return NextResponse.json({ error: "Wrong password" }, { status: 401 });
    }

    // Bootstrap: create default admin user if none exist
    const usersResult = await db.execute("SELECT COUNT(*) as count FROM admin_users");
    if (Number(usersResult.rows[0].count) === 0) {
      const hash = await hashPassword(adminPw);
      await db.execute({
        sql: "INSERT INTO admin_users (email, name, password_hash, role) VALUES (?, ?, ?, ?)",
        args: ["admin@nutraglp.com", "Admin", hash, "admin"],
      });
    }

    // Get first admin user for legacy login
    const adminResult = await db.execute(
      "SELECT id, email, name, role FROM admin_users WHERE role = 'admin' LIMIT 1"
    );
    if (adminResult.rows.length === 0) {
      return NextResponse.json({ error: "No admin user found" }, { status: 500 });
    }
    const adminUser = adminResult.rows[0];
    const token = await createSession(Number(adminUser.id));

    const res = NextResponse.json({
      user: {
        id: Number(adminUser.id),
        email: String(adminUser.email),
        name: String(adminUser.name),
        role: String(adminUser.role),
      },
    });
    res.cookies.set("admin_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 7 * 24 * 60 * 60,
    });
    return res;
  } catch (e: unknown) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
