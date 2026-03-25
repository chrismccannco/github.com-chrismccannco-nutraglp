import { NextRequest, NextResponse } from "next/server";
import {
  getUserByEmail,
  verifyPassword,
  createSession,
  hashPassword,
  checkRateLimit,
  recordFailedAttempt,
  clearLoginAttempts,
} from "@/lib/auth";
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

    // Resolve IP for rate limiting
    const ip =
      req.headers.get("x-forwarded-for")?.split(",")[0].trim() ??
      req.headers.get("x-real-ip") ??
      "unknown";

    const db = getDb();

    // Ensure tables exist on fresh deploy
    try {
      await db.execute("SELECT 1 FROM admin_users LIMIT 1");
    } catch {
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

    // ── Multi-user login (email + password) ──
    if (email) {
      const emailLower = email.toLowerCase();

      // Rate limit check
      const { allowed, remaining } = await checkRateLimit(ip, emailLower);
      if (!allowed) {
        return NextResponse.json(
          { error: "Too many failed attempts. Try again in 15 minutes." },
          { status: 429 }
        );
      }

      const user = await getUserByEmail(emailLower);
      if (!user) {
        await recordFailedAttempt(ip, emailLower);
        return NextResponse.json(
          { error: "Invalid credentials", attemptsRemaining: remaining - 1 },
          { status: 401 }
        );
      }

      const valid = await verifyPassword(password, user.password_hash);
      if (!valid) {
        await recordFailedAttempt(ip, emailLower);
        return NextResponse.json(
          { error: "Invalid credentials", attemptsRemaining: remaining - 1 },
          { status: 401 }
        );
      }

      // Re-hash legacy SHA-256 passwords with bcrypt on first successful login
      if (user.password_hash.length === 64 && !user.password_hash.startsWith("$2")) {
        const newHash = await hashPassword(password);
        await db.execute({
          sql: "UPDATE admin_users SET password_hash = ? WHERE id = ?",
          args: [newHash, user.id],
        });
      }

      // Clear rate limit on success
      await clearLoginAttempts(ip, emailLower);

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

    // ── Legacy single-password login ──
    const settingResult = await db.execute({
      sql: "SELECT value FROM site_settings WHERE key = 'admin_password'",
      args: [],
    });
    const adminPw =
      settingResult.rows.length > 0
        ? String(settingResult.rows[0].value)
        : process.env.CMS_DEFAULT_PASSWORD || "admin";

    // Rate limit legacy login by IP alone
    const { allowed } = await checkRateLimit(ip, "legacy");
    if (!allowed) {
      return NextResponse.json(
        { error: "Too many failed attempts. Try again in 15 minutes." },
        { status: 429 }
      );
    }

    if (password !== adminPw) {
      await recordFailedAttempt(ip, "legacy");
      return NextResponse.json({ error: "Wrong password" }, { status: 401 });
    }

    // Check trial expiration (skip if no trial_signups table yet)
    try {
      const trialCheck = await db.execute(
        "SELECT COUNT(*) as count FROM trial_signups"
      );
      const hasTrials = Number(trialCheck.rows[0].count) > 0;
      if (hasTrials) {
        // Find the most recent active trial
        const activeTrial = await db.execute(
          "SELECT * FROM trial_signups WHERE active = 1 ORDER BY started_at DESC LIMIT 1"
        );
        if (activeTrial.rows.length > 0) {
          const expiresAt = new Date(String(activeTrial.rows[0].expires_at));
          if (new Date() > expiresAt) {
            return NextResponse.json(
              { error: "Trial expired. Visit getcontentfoundry.com to learn about paid plans." },
              { status: 403 }
            );
          }
        }
      }
    } catch {
      // trial_signups table doesn't exist yet — skip check
    }

    // Bootstrap: create default admin user if none exist
    const usersResult = await db.execute(
      "SELECT COUNT(*) as count FROM admin_users"
    );
    if (Number(usersResult.rows[0].count) === 0) {
      const hash = await hashPassword(adminPw);
      await db.execute({
        sql: "INSERT INTO admin_users (email, name, password_hash, role) VALUES (?, ?, ?, ?)",
        args: [
          process.env.CMS_DEFAULT_ADMIN_EMAIL || "admin@admin.com",
          "Admin",
          hash,
          "admin",
        ],
      });
    }

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
