"use client";

import { useState, useEffect, createContext, useContext } from "react";
import { useRouter, usePathname } from "next/navigation";
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
  const router = useRouter();
  const pathname = usePathname();
  const isLoginPage = pathname === "/admin/login";

  const [authed, setAuthed] = useState(false);
  const [user, setUser] = useState<CurrentUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Override browser tab title and favicon for admin
  useEffect(() => {
    document.title = `${branding.name} — Admin`;
    const existing = document.querySelector<HTMLLinkElement>("link[rel~='icon']");
    if (existing) {
      existing.href = "/cf-favicon.svg";
      existing.type = "image/svg+xml";
    } else {
      const link = document.createElement("link");
      link.rel = "icon";
      link.type = "image/svg+xml";
      link.href = "/cf-favicon.svg";
      document.head.appendChild(link);
    }
  }, [branding.name]);

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
        const legacy = sessionStorage.getItem("cms_auth");
        if (legacy === "1") {
          setAuthed(true);
          setUser({ id: 0, email: "", name: "Admin", role: "admin" });
        }
        setLoading(false);
      });
  }, []);

  // Redirect unauthenticated users — must be declared with all other hooks,
  // before any conditional returns, to satisfy React's rules of hooks.
  useEffect(() => {
    if (!loading && !authed && !isLoginPage) {
      const next = encodeURIComponent(pathname ?? "/admin");
      router.replace(`/admin/login?next=${next}`);
    }
  }, [loading, authed, isLoginPage, pathname, router]);

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

  // Login page lives inside this layout segment — render without auth wrapper
  // to avoid an infinite redirect loop. All hooks above still run.
  if (isLoginPage) {
    return <>{children}</>;
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-50">
        <p className="text-sm text-neutral-400">Loading&hellip;</p>
      </div>
    );
  }

  if (!authed) return null;
  return (
    <AuthContext.Provider value={{ user }}>
      <div className="flex min-h-screen bg-neutral-50">
        <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        <div className="flex-1 flex flex-col min-w-0">
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
