"use client";

import { useState, FormEvent } from "react";

export default function ScienceBriefForm() {
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

      // Relay to Google Sheets (fire and forget)
      fetch("/api/sheets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          form: "science-brief",
          email: formData.get("email") || "",
          source: window.location.pathname,
        }),
      }).catch(() => {});

      window.location.href = "/thank-you";
    } catch {
      form.submit();
    }
  };

  return (
    <form
      name="science-brief"
      method="POST"
      data-netlify="true"
      netlify-honeypot="bot-field"
      onSubmit={handleSubmit}
      className="flex flex-col sm:flex-row gap-3 max-w-[480px] mx-auto"
    >
      <input type="hidden" name="form-name" value="science-brief" />
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
        className="flex-1 px-5 py-3.5 rounded-md text-[15px] outline-none transition bg-white/20 border border-white/30 text-white placeholder-white/50 focus:border-white/60"
      />
      <button
        type="submit"
        className="px-7 py-3.5 text-[15px] font-bold rounded-md cursor-pointer transition whitespace-nowrap bg-gold text-white hover:bg-gold-light"
      >
        Send me the brief
      </button>
    </form>
  );
}
