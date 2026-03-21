"use client";

import { useState } from "react";
import { Copy, Check, ExternalLink, Send, Twitter, Linkedin, Mail, Instagram } from "lucide-react";

interface ShareBarProps {
  text: string;
  category: string;
  /** Public URL of the post (for link-based sharing) */
  postUrl?: string;
}

const TWITTER_LIMIT = 280;

// Platform-specific character limits and notes
const PLATFORM_META: Record<string, { limit?: number; note?: string }> = {
  twitter: { limit: TWITTER_LIMIT },
  linkedin: { limit: 3000, note: "LinkedIn posts can be up to 3,000 characters" },
  email: {},
  instagram: { limit: 2200, note: "Instagram caption limit is 2,200 characters" },
  tiktok: { limit: 2200 },
  facebook: { limit: 63206 },
  youtube: {},
  seo: {},
};

function CharCount({ text, limit }: { text: string; limit: number }) {
  const len = text.length;
  const over = len > limit;
  const pct = Math.min(len / limit, 1);
  const color = over ? "text-red-500" : pct > 0.9 ? "text-amber-500" : "text-neutral-400";
  return (
    <span className={`text-[10px] tabular-nums ${color}`}>
      {len}/{limit}
    </span>
  );
}

export default function ShareBar({ text, category, postUrl }: ShareBarProps) {
  const [copied, setCopied] = useState(false);
  const [sending, setSending] = useState(false);
  const [sendStatus, setSendStatus] = useState<"idle" | "ok" | "error">("idle");
  const [sendMsg, setSendMsg] = useState("");
  const [showEmailForm, setShowEmailForm] = useState(false);
  const [toEmail, setToEmail] = useState("");

  const meta = PLATFORM_META[category] || {};

  function copyText() {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  function openTweet() {
    const tweet = text.slice(0, TWITTER_LIMIT);
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(tweet)}`;
    window.open(url, "_blank", "width=600,height=400");
  }

  function openLinkedIn() {
    // Copy text first, then open LinkedIn
    navigator.clipboard.writeText(text).catch(() => {});
    if (postUrl) {
      window.open(
        `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(postUrl)}`,
        "_blank"
      );
    } else {
      window.open("https://www.linkedin.com/feed/", "_blank");
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }

  async function sendEmail() {
    if (!toEmail.trim()) return;
    setSending(true);
    setSendStatus("idle");
    try {
      const res = await fetch("/api/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          to: toEmail.trim(),
          subject: "Content from ContentFoundry",
          body: text,
        }),
      });
      const data = await res.json();
      if (res.ok && data.ok) {
        setSendStatus("ok");
        setSendMsg("Sent.");
        setShowEmailForm(false);
        setToEmail("");
      } else {
        setSendStatus("error");
        setSendMsg(data.error || "Send failed");
      }
    } catch {
      setSendStatus("error");
      setSendMsg("Request failed");
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="mt-3 pt-3 border-t border-neutral-100">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-1.5 flex-wrap">
          {/* Copy */}
          <button
            onClick={copyText}
            className="flex items-center gap-1 text-[11px] px-2 py-1 rounded-md border border-neutral-200 text-neutral-500 hover:bg-neutral-50 transition"
          >
            {copied ? <Check size={10} className="text-green-500" /> : <Copy size={10} />}
            {copied ? "Copied" : "Copy"}
          </button>

          {/* Twitter/X */}
          {category === "twitter" && (
            <button
              onClick={openTweet}
              className="flex items-center gap-1 text-[11px] px-2 py-1 rounded-md bg-black text-white hover:bg-neutral-800 transition"
            >
              <Twitter size={10} />
              Post on X
            </button>
          )}

          {/* LinkedIn */}
          {category === "linkedin" && (
            <button
              onClick={openLinkedIn}
              className="flex items-center gap-1 text-[11px] px-2 py-1 rounded-md bg-[#0A66C2] text-white hover:bg-[#004182] transition"
            >
              <Linkedin size={10} />
              {postUrl ? "Share on LinkedIn" : "Copy + Open LinkedIn"}
            </button>
          )}

          {/* Instagram — copy only (no posting API without OAuth) */}
          {category === "instagram" && (
            <span className="text-[10px] text-neutral-400 flex items-center gap-1">
              <Instagram size={10} />
              Copy above, then paste in Instagram
            </span>
          )}

          {/* Email */}
          {category === "email" && (
            <button
              onClick={() => setShowEmailForm((v) => !v)}
              className="flex items-center gap-1 text-[11px] px-2 py-1 rounded-md bg-teal-600 text-white hover:bg-teal-700 transition"
            >
              <Mail size={10} />
              Send preview
            </button>
          )}
        </div>

        {/* Character count */}
        {meta.limit && <CharCount text={text} limit={meta.limit} />}
      </div>

      {/* Email send form */}
      {showEmailForm && (
        <div className="mt-2 flex gap-2">
          <input
            type="email"
            value={toEmail}
            onChange={(e) => setToEmail(e.target.value)}
            placeholder="Send to email address…"
            className="flex-1 px-2 py-1.5 text-xs border border-neutral-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-teal-400"
            onKeyDown={(e) => e.key === "Enter" && sendEmail()}
          />
          <button
            onClick={sendEmail}
            disabled={sending || !toEmail.trim()}
            className="flex items-center gap-1 text-xs px-3 py-1.5 bg-teal-600 text-white rounded-lg hover:bg-teal-700 disabled:opacity-50 transition"
          >
            {sending ? (
              <span className="w-3 h-3 border border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <Send size={11} />
            )}
            Send
          </button>
        </div>
      )}

      {sendStatus !== "idle" && (
        <p className={`text-[11px] mt-1 ${sendStatus === "ok" ? "text-green-600" : "text-red-500"}`}>
          {sendMsg}
        </p>
      )}
    </div>
  );
}
