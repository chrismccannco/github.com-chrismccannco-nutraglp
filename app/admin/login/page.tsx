"use client";

import { Suspense, useState, useEffect, FormEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useCmsBranding } from "../hooks/useCmsBranding";

// Inner component isolates useSearchParams() inside a Suspense boundary,
// which is required by Next.js 15 to avoid the CSR bailout error during
// static page generation.
function LoginForm() {
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
    <div className="min-h-screen bg-neutral-50 flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="bg-white border border-neutral-200 rounded-xl shadow-sm p-8">
          <div className="text-center mb-8">
            <p className="text-xs font-bold uppercase tracking-[3px] text-teal-700 mb-2">
              NUTRAGLP
            </p>
            <h1 className="text-lg font-semibold text-neutral-900">Admin</h1>
          </div>

          <form onSubmit={handleSubmit}>
            <label className="block text-xs font-medium text-neutral-500 mb-1.5">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border border-neutral-200 rounded-lg text-sm text-neutral-900 focus:outline-none focus:border-teal-500 transition"
              placeholder="Enter admin password"
              autoFocus
              required
            />

            {error && (
              <p className="text-xs text-red-600 mt-2">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-4 px-4 py-3 bg-teal-600 text-white text-sm font-medium rounded-lg hover:bg-teal-700 transition disabled:opacity-50"
            >
              {loading ? "Signing in..." : "Sign in"}
            </button>
          </form>
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

export default function AdminLogin() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}
