"use client";

import { useState, useEffect, useCallback, FormEvent } from "react";

const STORAGE_KEY = "nutraglp_popup_dismissed";

// Defaults (used while config loads or if fetch fails)
const DEFAULT_DELAY_MS = 45000;
const DEFAULT_SCROLL_THRESHOLD = 0.70;
const DEFAULT_HEADING = "Get on the list before we launch.";
const DEFAULT_SUBHEADING = "Secure your spot at the $149 launch price before we open to the public.";
const DEFAULT_CTA = "Get Early Access";

interface PopupConfig {
  enabled: boolean;
  delayMs: number;
  scrollThreshold: number;
  heading: string;
  subheading: string;
  ctaText: string;
  showPhone: boolean;
  showSmsOptin: boolean;
}

export default function SubscribePopup() {
  const [visible, setVisible] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [smsOptIn, setSmsOptIn] = useState(false);
  const [config, setConfig] = useState<PopupConfig | null>(null);
  const [configLoaded, setConfigLoaded] = useState(false);

  // Fetch CMS config
  useEffect(() => {
    fetch("/api/settings/public")
      .then((r) => r.json())
      .then((settings: Record<string, string>) => {
        setConfig({
          enabled: settings.popup_enabled !== "false",
          delayMs: (parseInt(settings.popup_delay_seconds || "12", 10) || 12) * 1000,
          scrollThreshold: (parseInt(settings.popup_scroll_threshold || "55", 10) || 55) / 100,
          heading: settings.popup_heading || DEFAULT_HEADING,
          subheading: settings.popup_subheading || DEFAULT_SUBHEADING,
          ctaText: settings.popup_cta_text || DEFAULT_CTA,
          showPhone: settings.popup_show_phone !== "false",
          showSmsOptin: settings.popup_show_sms_optin !== "false",
        });
        setConfigLoaded(true);
      })
      .catch(() => {
        // Use defaults on error
        setConfig({
          enabled: true,
          delayMs: DEFAULT_DELAY_MS,
          scrollThreshold: DEFAULT_SCROLL_THRESHOLD,
          heading: DEFAULT_HEADING,
          subheading: DEFAULT_SUBHEADING,
          ctaText: DEFAULT_CTA,
          showPhone: true,
          showSmsOptin: true,
        });
        setConfigLoaded(true);
      });
  }, []);

  useEffect(() => {
    const handler = () => setVisible(true);
    window.addEventListener('openSubscribePopup', handler);
    return () => window.removeEventListener('openSubscribePopup', handler);
  }, [setVisible]);

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
    if (!configLoaded || !config?.enabled) return;
    const timer = setTimeout(show, config.delayMs);
    return () => clearTimeout(timer);
  }, [show, configLoaded, config]);

  // --- Trigger: scroll depth ---
  useEffect(() => {
    if (!configLoaded || !config?.enabled) return;
    const onScroll = () => {
      const scrollPct =
        window.scrollY / (document.documentElement.scrollHeight - window.innerHeight);
      if (scrollPct >= config.scrollThreshold) {
        show();
        window.removeEventListener("scroll", onScroll);
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [show, configLoaded, config]);

  // --- Trigger: exit intent (desktop only) ---
  useEffect(() => {
    if (!configLoaded || !config?.enabled) return;
    const onMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 0) {
        show();
        document.removeEventListener("mouseout", onMouseLeave);
      }
    };
    document.addEventListener("mouseout", onMouseLeave);
    return () => document.removeEventListener("mouseout", onMouseLeave);
  }, [show, configLoaded, config]);

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
          form: "subscribe",
          email: formData.get("email") || "",
          phone: formData.get("phone") || "",
          sms_opt_in: formData.get("sms_opt_in") === "on",
          source: "popup",
        }),
      }).catch(() => {});

      window.location.href = "/thank-you";
    } catch {
      form.submit();
    }
  };

  if (!visible || !config) return null;

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
      <div className="relative bg-forest-deep border border-white/[0.10] rounded-2xl shadow-2xl max-w-[440px] w-full p-8 md:p-10 animate-[fadeUp_0.3s_ease-out]">
        {/* Close button */}
        <button
          onClick={dismiss}
          className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center text-white/40 hover:text-white transition rounded-full cursor-pointer"
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
              className="text-2xl font-normal text-teal-light mb-2 font-heading"
            >
              You&apos;re in.
            </p>
            <p className="text-sm text-white/60">
              We&apos;ll reach out with your launch pricing details.
            </p>
          </div>
        ) : (
          <>
            <p className="text-[10px] font-bold uppercase tracking-[2px] text-teal-light mb-3">
              Waitlist
            </p>
            <h3
              className="text-2xl font-normal tracking-tight text-white mb-2 leading-snug font-heading"
            >
              {config.heading}
            </h3>
            <p className="text-[15px] text-white/60 leading-relaxed mb-6">
              {config.subheading}
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
                className="w-full px-4 py-3 rounded-lg text-[15px] bg-white/[0.08] border border-white/[0.15] text-white placeholder-white/30 outline-none focus:border-teal-light/50 transition"
              />

              {/* Phone */}
              {config.showPhone && (
                <input
                  type="tel"
                  name="phone"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Phone number (optional)"
                  className="w-full px-4 py-3 rounded-lg text-[15px] bg-white/[0.08] border border-white/[0.15] text-white placeholder-white/30 outline-none focus:border-teal-light/50 transition"
                />
              )}

              {/* SMS opt-in checkbox */}
              {config.showSmsOptin && (
                <label className="flex items-start gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    name="sms_opt_in"
                    checked={smsOptIn}
                    onChange={(e) => setSmsOptIn(e.target.checked)}
                    className="mt-1 accent-forest w-4 h-4 cursor-pointer"
                  />
                  <span className="text-xs text-white/50 leading-relaxed">
                    I agree to receive SMS updates about launch timing
                    and availability. Msg &amp; data rates may apply. Reply STOP
                    to unsubscribe.
                  </span>
                </label>
              )}

              {/* Submit */}
              <button
                type="submit"
                className="w-full py-3.5 text-[15px] font-bold rounded-lg bg-gold text-white hover:bg-gold-light transition cursor-pointer"
              >
                {config.ctaText}
              </button>
            </form>

            <p className="text-[11px] text-white/30 text-center mt-4">
              No spam. Unsubscribe anytime.
            </p>
          </>
        )}
      </div>
    </div>
  );
}
