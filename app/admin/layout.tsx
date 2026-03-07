"use client";

import { useState, useEffect } from "react";
import { Menu } from "lucide-react";
import Sidebar from "./components/Sidebar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [authed, setAuthed] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const token = sessionStorage.getItem("cms_auth");
    if (token === "1") setAuthed(true);
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/settings");
      const settings = await res.json();
      if (password === (settings.admin_password || "nutraglp2025")) {
        sessionStorage.setItem("cms_auth", "1");
        setAuthed(true);
        setError("");
      } else {
        setError("Wrong password");
      }
    } catch {
      setError("Could not connect to CMS");
    }
  };

  if (!authed) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-50">
        <form
          onSubmit={handleLogin}
          className="bg-white p-8 rounded-xl shadow-sm border border-neutral-200 w-80"
        >
          <div className="flex items-center gap-2.5 mb-6">
            <div className="w-8 h-8 rounded-lg bg-[#0f2d20] flex items-center justify-center">
              <span className="text-white text-xs font-bold">N</span>
            </div>
            <div>
              <h1 className="text-lg font-semibold text-neutral-900 leading-tight">
                NutraGLP
              </h1>
              <p className="text-[10px] uppercase tracking-widest text-neutral-400">
                CMS
              </p>
            </div>
          </div>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3 py-2 border border-neutral-300 rounded-lg text-sm mb-3 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            placeholder="Password"
            autoFocus
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
        </form>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-neutral-50">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile header */}
        <header className="md:hidden sticky top-0 z-40 bg-white border-b border-neutral-200 px-4 py-3 flex items-center gap-3">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-1 -ml-1 text-neutral-600 hover:text-neutral-900"
          >
            <Menu className="w-5 h-5" />
          </button>
          <span className="text-sm font-semibold text-neutral-900">
            NutraGLP
          </span>
        </header>

        <main className="flex-1 p-5 md:p-8 lg:p-10 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
