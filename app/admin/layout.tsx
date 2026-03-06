"use client";

import { useState, useEffect } from "react";
import Sidebar from "./components/Sidebar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [authed, setAuthed] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

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
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <form
          onSubmit={handleLogin}
          className="bg-white p-8 rounded-xl shadow-sm border border-gray-200 w-80"
        >
          <h1 className="text-xl font-semibold text-gray-900 mb-1">NutraGLP CMS</h1>
          <p className="text-sm text-gray-500 mb-6">Enter your admin password</p>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm mb-3 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            placeholder="Password"
            autoFocus
          />
          {error && (
            <p className="text-xs text-red-600 mb-3">{error}</p>
          )}
          <button
            type="submit"
            className="w-full bg-[#0f2d20] text-white py-2 rounded-lg text-sm font-medium hover:bg-[#1a4a33] transition"
          >
            Sign in
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <main className="flex-1 p-6 md:p-10 overflow-auto">{children}</main>
    </div>
  );
}
