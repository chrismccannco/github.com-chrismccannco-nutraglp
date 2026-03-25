"use client";

import { useState } from "react";
import { Share2, Twitter, Linkedin, Mail, Copy, Check, ChevronDown, ChevronUp } from "lucide-react";

interface DistributePanelProps {
  title: string;
  /** Full public URL of the published post */
  postUrl?: string;
  /** Short excerpt or meta description */
  excerpt?: string;
  published: boolean;
}

export default function DistributePanel({ title, postUrl, excerpt, published }: DistributePanelProps) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);

  const url = postUrl || "";
  const tweetText = `${title}${url ? `\n\n${url}` : ""}`;
  const linkedInText = excerpt ? `${title}\n\n${excerpt}${url ? `\n\n${url}` : ""}` : `${title}${url ? `\n\n${url}` : ""}`;

  function copy(key: string, text: string) {
    navigator.clipboard.writeText(text);
    setCopied(key);
    setTimeout(() => setCopied(null), 1500);
  }

  function openTweet() {
    window.open(
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(tweetText.slice(0, 280))}`,
      "_blank",
      "width=600,height=400"
    );
  }

  function openLinkedIn() {
    if (url) {
      window.open(
        `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
        "_blank"
      );
    } else {
      copy("linkedin", linkedInText);
      window.open("https://www.linkedin.com/feed/", "_blank");
    }
  }

  function openEmail() {
    const subject = encodeURIComponent(title);
    const body = encodeURIComponent(`${excerpt || ""}\n\nRead more: ${url}`);
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
  }

  if (!published && !url) {
    return (
      <div className="bg-white border border-neutral-200 rounded-xl p-4">
        <div className="flex items-center gap-2 mb-1">
          <Share2 size={13} className="text-neutral-400" />
          <p className="text-xs font-semibold text-neutral-700">Distribute</p>
        </div>
        <p className="text-[11px] text-neutral-400">Publish this post first to enable sharing.</p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-neutral-200 rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen(v => !v)}
        className="w-full flex items-center justify-between p-4 hover:bg-neutral-50 transition text-left"
      >
        <div className="flex items-center gap-2">
          <Share2 size={13} className="text-teal-600" />
          <p className="text-xs font-semibold text-neutral-700">Distribute</p>
        </div>
        {open ? <ChevronUp size={13} className="text-neutral-400" /> : <ChevronDown size={13} className="text-neutral-400" />}
      </button>

      {open && (
        <div className="px-4 pb-4 space-y-2 border-t border-neutral-100 pt-3">
          {/* Twitter/X */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <Twitter size={12} className="text-neutral-500" />
              <span className="text-xs text-neutral-600">Twitter / X</span>
            </div>
            <div className="flex gap-1.5">
              <button
                onClick={() => copy("tweet", tweetText)}
                className="text-[10px] px-2 py-1 border border-neutral-200 rounded-md text-neutral-500 hover:bg-neutral-50 flex items-center gap-1"
              >
                {copied === "tweet" ? <Check size={9} className="text-green-500" /> : <Copy size={9} />}
                Copy
              </button>
              <button
                onClick={openTweet}
                className="text-[10px] px-2 py-1 bg-black text-white rounded-md hover:bg-neutral-800 transition flex items-center gap-1"
              >
                Post on X
              </button>
            </div>
          </div>

          {/* LinkedIn */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <Linkedin size={12} className="text-neutral-500" />
              <span className="text-xs text-neutral-600">LinkedIn</span>
            </div>
            <div className="flex gap-1.5">
              <button
                onClick={() => copy("linkedin", linkedInText)}
                className="text-[10px] px-2 py-1 border border-neutral-200 rounded-md text-neutral-500 hover:bg-neutral-50 flex items-center gap-1"
              >
                {copied === "linkedin" ? <Check size={9} className="text-green-500" /> : <Copy size={9} />}
                Copy
              </button>
              <button
                onClick={openLinkedIn}
                className="text-[10px] px-2 py-1 bg-[#0A66C2] text-white rounded-md hover:bg-[#004182] transition flex items-center gap-1"
              >
                Share
              </button>
            </div>
          </div>

          {/* Email */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <Mail size={12} className="text-neutral-500" />
              <span className="text-xs text-neutral-600">Email</span>
            </div>
            <button
              onClick={openEmail}
              className="text-[10px] px-2 py-1 border border-neutral-200 rounded-md text-neutral-500 hover:bg-neutral-50 flex items-center gap-1"
            >
              Open in mail app
            </button>
          </div>

          {/* Copy URL */}
          {url && (
            <div className="flex items-center justify-between pt-1 border-t border-neutral-100">
              <span className="text-[10px] text-neutral-400 truncate max-w-[140px]">{url}</span>
              <button
                onClick={() => copy("url", url)}
                className="text-[10px] px-2 py-1 border border-neutral-200 rounded-md text-neutral-500 hover:bg-neutral-50 flex items-center gap-1 flex-shrink-0"
              >
                {copied === "url" ? <Check size={9} className="text-green-500" /> : <Copy size={9} />}
                Copy URL
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
