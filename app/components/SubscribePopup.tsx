"use client";

import { useState, useEffect, useCallback, FormEvent } from "react";

const STORAGE_KEY = "nutraglp_popup_dismissed";
const DELAY_MS = 12000;        // 12 seconds
const SCROLL_THRESHOLD = 0.55; // 55% of page

export default function SubscribePopup() {
  const [visible, setVisible] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [smsOptIn, setSmsOptIn] = useState(false);

  const dismiss = useCallback(() => {
    setVisible(false);
    try {
      sessionStorage.setItem(STORAGE_KEY, "1");
    } catch {}
  }, []);

  const show = useCallback(() => {
    try {
      if (sessionStorage.getItem(STORAGE_KEY)) return;
    } catch {}
    setVisible(true);
  }, []);

  // --- Trigger: timed delay ---
  useEffect(() => {
    const timer = setTimeout(show, DELAY_MS);
    return () => clearTimeout(timer);
  }, [show]);

  // --- Trigger: scroll depth ---
  useEffect(() => {
    const onScroll = () => {
      const scrollPct =
        window.scrollY / (document.documentElement.scrollHeight - window.innerHeight);
      if (scrollPct >= SCROLL_THRESHOLD) {
        show();
        window.removeEventListener("scroll", onScroll);
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [show]);

  // --- Trigger: exit intent (desktop only) ---
  useEffect(() => {
    const onMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 0) {
        show();
        document.removeEventListener("mouseout", onMouseLeave);
      }
    };
    document.addEventListener("mouseout", onMouseLeave);
    return () => document.removeEventListener("mouseout", onMouseLeave);
  }, [show]);

  // --- Close on Escape ---
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") dismiss();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [dismiss]);

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
      form.submit();
    }
  };

  if (!visible) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center px-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) dismiss();
      }}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

      {/* Modal */}
      <div className="relative bg-cream rounded-2xl shadow-2xl max-w-[440px] w-full p-8 md:p-10 animate-[fadeUp_0.3s_ease-out]">
        {/* Close button */}
        <button
          onClick={dismiss}
          className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center text-mist hover:text-ink transition rounded-full cursor-pointer"
          aria-label="Close"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <line x1="2" y1="2" x2="14" y2="14" />
            <line x1="14" y1="2" x2="2" y2="14" />
          </svg>
        </button>

        {submitted ? (
          <div className="text-center py-4">
            <p
              className="text-2xl font-normal text-forest mb-2"
              style={{ fontFamily: "'Fraunces', Georgia, serif" }}
            >
              You&apos;re in.
            </p>
            <p className="text-sm text-mist">
              We&apos;ll reach out with early access details.
            </p>
          </div>
        ) : (
          <>
            <p className="text-[10px] font-bold uppercase tracking-[2px] text-forest-mid mb-3">
              Early Access
            </p>
            <h3
              className="text-2xl font-normal tracking-tight text-ink mb-2 leading-snug"
              style={{ fontFamily: "'Fraunces', Georgia, serif" }}
            >
              Get on the list before we launch.
            </h3>
            <p className="text-[15px] text-mist leading-relaxed mb-6">
              Slim SHOT ships soon. Early subscribers get first access
              and launch pricing.
            </p>

            <form
              name="subscribe"
              method="POST"
              data-netlify="true"
              netlify-honeypot="bot-field"
              onSubmit={handleSubmit}
              className="space-y-3"
            >
              <input type="hidden" name="form-name" value="subscribe" />
              <p className="hidden">
                <label>
                  Don&apos;t fill this out: <input name="bot-field" />
                </label>
              </p>

              {/* Email */}
              <input
                type="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="Email address"
                className="w-full px-4 py-3 rounded-lg text-[15px] bg-white border border-rule text-ink placeholder-mist-light outline-none focus:border-forest-mid transition"
              />

              {/* Phone */}
              <input
                type="tel"
                name="phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Phone number (optional)"
                className="w-full px-4 py-3 rounded-lg text-[15px] bg-white border border-rule text-ink placeholder-mist-light outline-none focus:border-forest-mid transition"
              />

              {/* SMS opt-in checkbox */}
              <label className="flex items-start gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  name="sms_opt_in"
                  checked={smsOptIn}
                  onChange={(e) => setSmsOptIn(e.target.checked)}
                  className="mt-1 accent-forest w-4 h-4 cursor-pointer"
                />
                <span className="text-xs text-mist leading-relaxed">
                  I agree to receive SMS updates about launch timing
                  and availability. Msg &amp; data rates may apply. Reply STOP
                  to unsubscribe.
                </span>
              </label>

              {/* Submit */}
              <button
                type="submit"
                className="w-full py-3.5 text-[15px] font-bold rounded-lg bg-forest text-white hover:bg-forest-mid transition cursor-pointer"
              >
                Join Early Access
              </button>
            </form>

            <p className="text-[11px] text-mist-light text-center mt-4">
              No spam. Unsubscribe anytime.
            </p>
          </>
        )}
      </div>
    </div>
  );
}
