"use client";

import { useState, FormEvent } from "react";

export default function InvestorDeckForm() {
  const [submitted, setSubmitted] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [firm, setFirm] = useState("");

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
          form: "investor-deck",
          name: formData.get("name") || "",
          email: formData.get("email") || "",
          firm: formData.get("firm") || "",
          source: window.location.pathname,
        }),
      }).catch(() => {});

      setSubmitted(true);
    } catch {
      form.submit();
    }
  };

  if (submitted) {
    return (
      <div className="text-center py-6">
        <p className="text-lg font-semibold text-white mb-1">
          Request received.
        </p>
        <p className="text-sm text-white/40">
          Chris and Richard will follow up within 24 hours.
        </p>
      </div>
    );
  }

  return (
    <form
      name="investor-deck"
      method="POST"
      data-netlify="true"
      netlify-honeypot="bot-field"
      onSubmit={handleSubmit}
      className="max-w-[400px] mx-auto"
    >
      <input type="hidden" name="form-name" value="investor-deck" />
      <input type="hidden" name="subject" value="Requesting Investor Deck" />
      <p className="hidden">
        <label>
          Don&apos;t fill this out: <input name="bot-field" />
        </label>
      </p>

      <div className="space-y-3 mb-4">
        <input
          type="text"
          name="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          placeholder="Your name"
          className="w-full px-5 py-3.5 rounded-md text-[15px] outline-none transition bg-white/[0.08] border border-white/[0.12] text-white placeholder-white/30 focus:border-gold/50"
        />
        <input
          type="email"
          name="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          placeholder="Email address"
          className="w-full px-5 py-3.5 rounded-md text-[15px] outline-none transition bg-white/[0.08] border border-white/[0.12] text-white placeholder-white/30 focus:border-gold/50"
        />
        <input
          type="text"
          name="firm"
          value={firm}
          onChange={(e) => setFirm(e.target.value)}
          placeholder="Firm (optional)"
          className="w-full px-5 py-3.5 rounded-md text-[15px] outline-none transition bg-white/[0.08] border border-white/[0.12] text-white placeholder-white/30 focus:border-gold/50"
        />
      </div>

      <button
        type="submit"
        className="w-full px-7 py-3.5 text-[15px] font-bold rounded-md cursor-pointer transition bg-gold text-white hover:bg-gold-light"
      >
        Request the Deck
      </button>
    </form>
  );
}
