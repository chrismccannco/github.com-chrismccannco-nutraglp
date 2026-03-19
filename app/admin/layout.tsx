"use client";

import { useState, useEffect, createContext, useContext } from "react";
import { Menu, LogOut } from "lucide-react";
import Sidebar from "./components/Sidebar";
import { useCmsBranding } from "./hooks/useCmsBranding";

interface CurrentUser {
  id: number;
  email: string;
  name: string;
  role: "admin" | "editor" | "viewer";
}

interface AuthContextValue {
  user: CurrentUser | null;
}

const AuthContext = createContext<AuthContextValue>({ user: null });
export function useAuth() {
  return useContext(AuthContext);
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const branding = useCmsBranding();

  // Override browser tab title for admin
  useEffect(() => {
    document.title = `${branding.name} — Admin`;
  }, [branding.name]);

  const [authed, setAuthed] = useState(false);
  const [user, setUser] = useState<CurrentUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Login form state
  const [loginMode, setLoginMode] = useState<"email" | "legacy">("email");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  // Check existing session on mount
  useEffect(() => {
    fetch("/api/admin/me")
      .then((r) => r.json())
      .then((d) => {
        if (d.user) {
          setUser(d.user);
          setAuthed(true);
        }
        setLoading(false);
      })
      .catch(() => {
        // Fallback: check legacy sessionStorage
        const legacy = sessionStorage.getItem("cms_auth");
        if (legacy === "1") {
          setAuthed(true);
          setUser({ id: 0, email: "", name: "Admin", role: "admin" });
        }
        setLoading(false);
      });
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const body: Record<string, string> = { password };
      if (loginMode === "email" && email) {
        body.email = email;
      }

      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Login failed");
        return;
      }

      if (data.user) {
        setUser(data.user);
      } else {
        setUser({ id: 0, email: "", name: "Admin", role: "admin" });
      }
      sessionStorage.setItem("cms_auth", "1");
      setAuthed(true);
    } catch {
      setError("Could not connect to CMS");
    }
  };

  const handleLogout = async () => {
    try {
      await fetch("/api/admin/me", { method: "DELETE" });
    } catch {
      // ignore
    }
    sessionStorage.removeItem("cms_auth");
    setAuthed(false);
    setUser(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-50">
        <p className="text-sm text-neutral-400">Loading&hellip;</p>
      </div>
    );
  }

  if (!authed) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-50">
        <form
          onSubmit={handleLogin}
          className="bg-white p-8 rounded-xl shadow-sm border border-neutral-200 w-80"
        >
          <div className="flex items-center gap-2.5 mb-6">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: branding.accentColor }}>
              <span className="text-white text-xs font-bold">{branding.logoLetter}</span>
            </div>
            <div>
              <h1 className="text-lg font-semibold text-neutral-900 leading-tight truncate max-w-[200px]">
                {branding.name}
              </h1>
              <p className="text-[10px] uppercase tracking-widest text-neutral-400">
                CMS
              </p>
            </div>
          </div>

          {loginMode === "email" && (
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border border-neutral-300 rounded-lg text-sm mb-3 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              placeholder="Email"
              autoFocus
            />
          )}

          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3 py-2 border border-neutral-300 rounded-lg text-sm mb-3 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            placeholder="Password"
            autoFocus={loginMode === "legacy"}
          />

          {error && (
            <p className="text-xs text-red-600 mb-3">{error}</p>
          )}

          <button
            type="submit"
            className="w-full bg-emerald-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-emerald-700 transition"
          >
            Sign in
          </button>

          <button
            type="button"
            onClick={() => setLoginMode(loginMode === "email" ? "legacy" : "email")}
            className="w-full mt-3 text-xs text-neutral-400 hover:text-neutral-600 transition"
          >
            {loginMode === "email" ? "Use shared password" : "Use email login"}
          </button>
        </form>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ user }}>
      <div className="flex min-h-screen bg-neutral-50">
        <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        <div className="flex-1 flex flex-col min-w-0">
          {/* Header */}
          <header className="sticky top-0 z-40 bg-white border-b border-neutral-200 px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setSidebarOpen(true)}
                className="md:hidden p-1 -ml-1 text-neutral-600 hover:text-neutral-900"
              >
                <Menu className="w-5 h-5" />
              </button>
              <span className="md:hidden text-sm font-semibold text-neutral-900">
                {branding.name}
              </span>
            </div>

            <div className="flex items-center gap-3">
              {user && (
                <div className="text-right">
                  <p className="text-xs font-medium text-neutral-700">
                    {user.name || user.email}
                  </p>
                  <p className="text-[10px] text-neutral-400 uppercase tracking-wider">
                    {user.role}
                  </p>
                </div>
              )}
              <button
                onClick={handleLogout}
                className="p-1.5 text-neutral-400 hover:text-neutral-600 transition"
                title="Sign out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </header>

          <main className="flex-1 p-5 md:p-8 lg:p-10 overflow-auto">
            {children}
          </main>
        </div>
      </div>
    </AuthContext.Provider>
  );
}
