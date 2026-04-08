"use client";

import { useState } from "react";

interface Props {
  buttonClassName?: string;
  buttonLabel?: string;
}

export default function RequestDeckModal({
  buttonClassName = "inline-block bg-gold text-white text-sm font-semibold px-8 py-3 rounded-full no-underline hover:bg-gold-light transition cursor-pointer border-none",
  buttonLabel = "Request the Deck",
}: Props) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    try {
      const res = await fetch("/api/request-deck", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, company }),
      });
      setStatus(res.ok ? "success" : "error");
    } catch {
      setStatus("error");
    }
  }

  return (
    <>
      <button onClick={() => setOpen(true)} className={buttonClassName}>
        {buttonLabel}
      </button>

      {open && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center px-4">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => { setOpen(false); setStatus("idle"); }}
          />
          <div className="relative bg-forest-deep border border-white/10 rounded-2xl p-8 w-full max-w-md shadow-2xl">
            <button
              onClick={() => { setOpen(false); setStatus("idle"); }}
              className="absolute top-4 right-4 text-white/40 hover:text-white transition bg-transparent border-none cursor-pointer p-1"
              aria-label="Close"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M6 6l12 12M6 18L18 6" />
              </svg>
            </button>

            {status === "success" ? (
              <div className="text-center py-6">
                <div className="text-gold text-5xl mb-4 font-light">✓</div>
                <h3 className="text-white text-xl font-semibold mb-2">You&apos;re on the list.</h3>
                <p className="text-white/40 text-sm leading-relaxed">
                  Richard and Chris will be in touch shortly.
                </p>
              </div>
            ) : (
              <>
                <h3 className="text-white text-xl font-semibold mb-1">Request the Deck</h3>
                <p className="text-white/40 text-sm mb-6">
                  Full deck, scientific monograph, and financials.
                </p>
                <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                  <input
                    type="text"
                    placeholder="Your name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="w-full bg-white/[0.05] border border-white/10 rounded-lg px-4 py-3 text-white text-sm placeholder:text-white/30 focus:outline-none focus:border-gold/50 transition"
                  />
                  <input
                    type="email"
                    placeholder="Email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full bg-white/[0.05] border border-white/10 rounded-lg px-4 py-3 text-white text-sm placeholder:text-white/30 focus:outline-none focus:border-gold/50 transition"
                  />
                  <input
                    type="text"
                    placeholder="Fund or firm (optional)"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    className="w-full bg-white/[0.05] border border-white/10 rounded-lg px-4 py-3 text-white text-sm placeholder:text-white/30 focus:outline-none focus:border-gold/50 transition"
                  />
                  {status === "error" && (
                    <p className="text-red-400 text-xs">Something went wrong. Try again or email investors@nutraglp.com directly.</p>
                  )}
                  <button
                    type="submit"
                    disabled={status === "loading"}
                    className="w-full bg-gold text-white font-semibold py-3 rounded-lg text-sm hover:bg-gold-light transition disabled:opacity-60 cursor-pointer border-none mt-1"
                  >
                    {status === "loading" ? "Sending…" : "Request the Deck"}
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
