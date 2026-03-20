"use client";

import { useState, FormEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function AdminLogin() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      if (res.ok) {
        const from = searchParams.get("from") || "/admin";
        router.push(from);
        router.refresh();
      } else {
        setError("Invalid password");
      }
    } catch {
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50 flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="bg-white border border-neutral-200 rounded-xl shadow-sm p-8">
          <div className="text-center mb-8">
            <p className="text-xs font-bold uppercase tracking-[3px] text-indigo-700 mb-2">
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
              className="w-full px-4 py-3 border border-neutral-200 rounded-lg text-sm text-neutral-900 focus:outline-none focus:border-indigo-500 transition"
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
              className="w-full mt-4 px-4 py-3 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition disabled:opacity-50"
            >
              {loading ? "Signing in..." : "Sign in"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
