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
      await fetch("/", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams(formData as unknown as Record<string, string>).toString(),
      });
      window.location.href = "/thank-you";
    } catch {
      // Fallback: let Netlify handle it
      form.submit();
    }
  };

  if (submitted) {
    return (
      <div className={`text-center ${variant === "cta" ? "text-white" : variant === "hero" ? "text-white/70" : "text-ink"}`}>
        <p className="text-lg font-semibold mb-1">You&apos;re on the list.</p>
        <p className={`text-sm ${variant === "cta" ? "text-white/50" : variant === "hero" ? "text-white/40" : "text-mist"}`}>
          We&apos;ll be in touch with early access details.
        </p>
      </div>
    );
  }

  const isLight = variant === "cta";
  const isDark = variant === "hero";

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
          isDark
            ? "bg-white/[0.08] border border-white/[0.12] text-white placeholder-white/30 focus:border-gold/50"
            : isLight
            ? "bg-white/20 border border-white/30 text-white placeholder-white/50 focus:border-white/60"
            : "bg-white border border-rule text-ink placeholder-mist-light focus:border-forest-mid"
        }`}
      />
      <button
        type="submit"
        className={`px-7 py-3.5 text-[15px] font-bold rounded-md cursor-pointer transition whitespace-nowrap ${
          isLight
            ? "bg-white text-forest hover:brightness-95"
            : "bg-gold text-white hover:bg-gold-light"
        }`}
      >
        Join the Waitlist
      </button>
    </form>
  );
}
