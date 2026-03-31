"use client";

import { useState, FormEvent } from "react";

export default function WaitlistForm({ variant = "default" }: { variant?: "default" | "hero" | "cta" }) {
  const [submitted, setSubmitted] = useState(false);
  const [email, setEmail] = useState("");

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);

    try {
      // Submit to Netlify Forms
      await fetch("/", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams(formData as unknown as Record<string, string>).toString(),
      });

      // Also relay to Google Sheets (fire and forget)
      fetch("/api/sheets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          form: "waitlist",
          email: formData.get("email") || "",
          source: window.location.pathname,
        }),
      }).catch(() => {});

      window.location.href = "/thank-you";
    } catch {
      // Fallback: let Netlify handle it
      form.submit();
    }
  };

  if (submitted) {
    return (
      <div className="text-center text-white/70">
        <p className="text-lg font-semibold mb-1">You&apos;re on the list.</p>
        <p className="text-sm text-white/40">
          We&apos;ll be in touch with early access details.
        </p>
      </div>
    );
  }

  if (variant === "hero") {
    return (
      <button
        type="button"
        onClick={() => window.dispatchEvent(new CustomEvent("openSubscribePopup"))}
        className="px-7 py-3.5 text-[15px] font-bold rounded-md cursor-pointer transition bg-gold text-white hover:bg-gold-light border-none"
      >
        Join the Waitlist
      </button>
    );
  }

  const isLight = variant === "cta";

  return (
    <form
      name="waitlist"
      method="POST"
      data-netlify="true"
      netlify-honeypot="bot-field"
      onSubmit={handleSubmit}
      className="flex flex-col sm:flex-row gap-3 max-w-[480px] mx-auto"
    >
      <input type="hidden" name="form-name" value="waitlist" />
      <p className="hidden">
        <label>
          Don&apos;t fill this out: <input name="bot-field" />
        </label>
      </p>
      <input
        type="email"
        name="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        placeholder="Your email address"
        className={`flex-1 px-5 py-3.5 rounded-md text-[15px] outline-none transition ${
          isLight
            ? "bg-white/20 border border-white/30 text-white placeholder-white/50 focus:border-white/60"
            : "bg-white/[0.08] border border-white/[0.15] text-white placeholder-white/30 focus:border-teal-light/50"
        }`}
      />
      <button
        type="submit"
        className="px-7 py-3.5 text-[15px] font-bold rounded-md cursor-pointer transition whitespace-nowrap bg-gold text-white hover:bg-gold-light"
      >
        Join the Waitlist
      </button>
    </form>
  );
}
