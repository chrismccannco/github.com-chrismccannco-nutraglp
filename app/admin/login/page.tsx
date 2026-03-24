"use client";

import { useState, useEffect, FormEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useCmsBranding } from "../hooks/useCmsBranding";

export default function AdminLogin() {
  const [loginMode, setLoginMode] = useState<"email" | "legacy">("email");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const branding = useCmsBranding();

  // If already authed, skip straight through
  useEffect(() => {
    fetch("/api/admin/me")
      .then((r) => r.json())
      .then((d) => {
        if (d.user) {
          const next = searchParams.get("next") || searchParams.get("from") || "/admin";
          router.replace(next);
        }
      })
      .catch(() => {});
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      const body: Record<string, string> = { password };
      if (loginMode === "email" && email) body.email = email;

      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Invalid credentials");
        return;
      }

      sessionStorage.setItem("cms_auth", "1");
      const next = searchParams.get("next") || searchParams.get("from") || "/admin";
      router.push(next);
      router.refresh();
    } catch {
      setError("Could not connect to server");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-50 px-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-xl shadow-sm border border-neutral-200 w-80"
      >
        <div className="flex items-center gap-2.5 mb-6">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ backgroundColor: branding.accentColor }}
          >
            <span className="text-white text-xs font-bold">{branding.logoLetter}</span>
          </div>
          <div>
            <h1 className="text-lg font-semibold text-neutral-900 leading-tight truncate max-w-[200px]">
              {branding.name}
            </h1>
            <p className="text-[10px] uppercase tracking-widest text-neutral-400">CMS</p>
          </div>
        </div>

        {loginMode === "email" && (
          <input
            type="email"
            aria-label="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 py-2 border border-neutral-300 rounded-lg text-sm mb-3 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            placeholder="Email"
            autoFocus
            required
          />
        )}

        <input
          type="password"
          aria-label="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-3 py-2 border border-neutral-300 rounded-lg text-sm mb-3 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
          placeholder="Password"
          autoFocus={loginMode === "legacy"}
          required
        />

        {error && <p className="text-xs text-red-600 mb-3">{error}</p>}

        <button
          type="submit"
          disabled={submitting}
          className="w-full bg-teal-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-teal-700 transition disabled:opacity-50"
        >
          {submitting ? "Signing in…" : "Sign in"}
        </button>

        <button
          type="button"
          onClick={() => {
            setLoginMode(loginMode === "email" ? "legacy" : "email");
            setError("");
          }}
          className="w-full mt-3 text-xs text-neutral-400 hover:text-neutral-600 transition"
        >
          {loginMode === "email" ? "Use shared password instead" : "Use email login"}
        </button>
      </form>
    </div>
  );
}
