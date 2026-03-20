"use client";

import { useState } from "react";

interface BuyButtonProps {
  variant?: "hero" | "cta" | "inline";
  label?: string;
  className?: string;
}

export default function BuyButton({
  variant = "inline",
  label = "Subscribe — $149/mo",
  className = "",
}: BuyButtonProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleCheckout() {
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          source: window.location.pathname,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.url) {
        setError(data.error || "Something went wrong. Try again.");
        setLoading(false);
        return;
      }

      // Redirect to Stripe Checkout
      window.location.href = data.url;
    } catch {
      setError("Connection error. Try again.");
      setLoading(false);
    }
  }

  const baseStyles =
    "inline-block font-semibold rounded-full transition-colors text-center no-underline cursor-pointer";

  const variantStyles: Record<string, string> = {
    hero: "px-10 py-4 bg-[#b8955a] text-white hover:bg-[#a07e47] shadow-lg text-lg",
    cta: "px-10 py-4 bg-[#b8955a] text-white hover:bg-[#a07e47] shadow-lg text-lg",
    inline:
      "px-8 py-3 bg-[#b8955a] text-white hover:bg-[#a07e47] shadow text-sm",
  };

  return (
    <div>
      <button
        onClick={handleCheckout}
        disabled={loading}
        className={`${baseStyles} ${variantStyles[variant]} ${
          loading ? "opacity-60 cursor-wait" : ""
        } ${className}`}
      >
        {loading ? "Redirecting..." : label}
      </button>
      {error && (
        <p className="text-red-400 text-xs mt-2">{error}</p>
      )}
    </div>
  );
}
