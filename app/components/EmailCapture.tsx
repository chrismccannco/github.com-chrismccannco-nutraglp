"use client";

import { useState } from "react";

export default function EmailCapture() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Connect to email service (e.g. ConvertKit, Mailchimp, Loops)
    setSubmitted(true);
  };

  return (
    <section className="bg-forest-deep border-t border-b border-white/[0.06] py-16 px-6 md:px-12">
      <div className="max-w-[520px] mx-auto text-center">
        <p className="text-[11px] font-bold uppercase tracking-[2px] text-teal-light mb-4">
          Not ready to commit?
        </p>
        <h2 className="text-2xl md:text-3xl font-normal tracking-tight text-white mb-4 font-heading">
          Get the science brief.
        </h2>
        <p className="text-[15px] text-white/50 leading-relaxed mb-8">
          A short read on how endogenous GLP-1 amplification works, what the
          published research shows, and why delivery format matters. No sales
          pitch. Just the science.
        </p>
        {submitted ? (
          <p className="text-sm text-gold">
            Check your inbox. The brief is on its way.
          </p>
        ) : (
          <form onSubmit={handleSubmit} className="flex gap-3 max-w-[400px] mx-auto">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Your email"
              className="flex-1 px-4 py-3 bg-white/[0.06] border border-white/[0.12] rounded-lg text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-gold/40 transition"
            />
            <button
              type="submit"
              className="px-5 py-3 bg-white/[0.08] border border-white/[0.15] rounded-lg text-sm text-white/80 hover:bg-white/[0.12] transition whitespace-nowrap"
            >
              Send it
            </button>
          </form>
        )}
      </div>
    </section>
  );
}
