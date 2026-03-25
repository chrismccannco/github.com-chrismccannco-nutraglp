'use client';

import { useState } from 'react';
import { Linkedin, Copy, Check, ExternalLink, RefreshCw, ChevronRight } from 'lucide-react';
import AiAssistPanel, { AiAssistResult } from '../components/AiAssistPanel';

interface LinkedInResult {
  post: string;
  hook: string;
  char_count: number;
  hashtags: string[];
  alt_hooks: string[];
}

export default function LinkedInPage() {
  const [result, setResult] = useState<LinkedInResult | null>(null);
  const [editedPost, setEditedPost] = useState('');
  const [copied, setCopied] = useState(false);
  const [activeHook, setActiveHook] = useState<string | null>(null);

  function handleResult(data: AiAssistResult) {
    const r = data as unknown as LinkedInResult;
    setResult(r);
    setEditedPost(r.post || '');
    setActiveHook(null);
  }

  function swapHook(newHook: string) {
    if (!result) return;
    // Replace just the first line of the post
    const lines = editedPost.split('\n');
    lines[0] = newHook;
    setEditedPost(lines.join('\n'));
    setActiveHook(newHook);
  }

  async function copyPost() {
    await navigator.clipboard.writeText(editedPost);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  }

  function openLinkedIn() {
    // Pre-fill LinkedIn share with the post text
    const encoded = encodeURIComponent(editedPost);
    window.open(`https://www.linkedin.com/sharing/share-offsite/?text=${encoded}`, '_blank');
  }

  const charCount = editedPost.length;
  const charLimit = 3000;
  const charWarning = charCount > 2800;

  return (
    <div className="max-w-3xl mx-auto py-8 px-4 space-y-6">

      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-[#0A66C2] flex items-center justify-center flex-shrink-0">
          <Linkedin className="w-4.5 h-4.5 text-white" style={{ width: 18, height: 18 }} />
        </div>
        <div>
          <h1 className="text-xl font-semibold text-neutral-900">LinkedIn Post</h1>
          <p className="text-sm text-neutral-500">Draft from scratch using your brand voice and audience persona.</p>
        </div>
      </div>

      {/* AI Panel */}
      <AiAssistPanel
        contentType="linkedin_post"
        placeholder="What's the post about? Give it a topic, a point of view, a story — the more specific the better."
        buttonLabel="Write Post"
        onResult={handleResult}
        showSelectors={true}
      />

      {/* Result */}
      {result && (
        <div className="space-y-4">

          {/* Post editor */}
          <div className="bg-white border border-neutral-200 rounded-xl overflow-hidden">
            <div className="flex items-center justify-between px-4 py-2.5 border-b border-neutral-100 bg-neutral-50">
              <span className="text-xs font-medium text-neutral-600">Post</span>
              <span className={`text-xs tabular-nums ${charWarning ? 'text-amber-600 font-medium' : 'text-neutral-400'}`}>
                {charCount} / {charLimit}
              </span>
            </div>
            <textarea
              value={editedPost}
              onChange={(e) => setEditedPost(e.target.value)}
              rows={12}
              className="w-full px-4 py-3 text-sm text-neutral-800 leading-relaxed resize-none focus:outline-none font-[system-ui]"
            />
          </div>

          {/* Alt hooks */}
          {result.alt_hooks?.length > 0 && (
            <div className="bg-neutral-50 border border-neutral-200 rounded-xl p-4 space-y-2">
              <p className="text-xs font-medium text-neutral-500 uppercase tracking-wide mb-3">Alternative openers</p>
              {result.alt_hooks.map((hook, i) => (
                <button
                  key={i}
                  onClick={() => swapHook(hook)}
                  className={`w-full text-left px-3 py-2.5 rounded-lg border text-sm transition flex items-start gap-2 group ${
                    activeHook === hook
                      ? 'bg-violet-50 border-violet-300 text-violet-900'
                      : 'bg-white border-neutral-200 text-neutral-700 hover:border-violet-200 hover:bg-violet-50/50'
                  }`}
                >
                  <ChevronRight className={`w-3.5 h-3.5 mt-0.5 flex-shrink-0 transition-colors ${
                    activeHook === hook ? 'text-violet-500' : 'text-neutral-300 group-hover:text-violet-400'
                  }`} />
                  <span>{hook}</span>
                </button>
              ))}
            </div>
          )}

          {/* Hashtags */}
          {result.hashtags?.length > 0 && (
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs text-neutral-400">Hashtags:</span>
              {result.hashtags.map((h, i) => (
                <span key={i} className="text-xs font-medium text-[#0A66C2] bg-blue-50 px-2 py-0.5 rounded-full">
                  {h.startsWith('#') ? h : `#${h}`}
                </span>
              ))}
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3">
            <button
              onClick={copyPost}
              className="flex items-center gap-2 px-4 py-2 border border-neutral-200 rounded-lg text-sm font-medium text-neutral-700 hover:bg-neutral-50 transition"
            >
              {copied ? (
                <><Check className="w-4 h-4 text-teal-600" /><span className="text-teal-700">Copied</span></>
              ) : (
                <><Copy className="w-4 h-4" />Copy text</>
              )}
            </button>

            <button
              onClick={openLinkedIn}
              className="flex items-center gap-2 px-5 py-2 bg-[#0A66C2] text-white rounded-lg text-sm font-medium hover:bg-[#0958a8] transition"
            >
              <Linkedin className="w-4 h-4" />
              Open in LinkedIn
              <ExternalLink className="w-3 h-3 opacity-70" />
            </button>

            <button
              onClick={() => { setResult(null); setEditedPost(''); }}
              className="ml-auto flex items-center gap-1.5 px-3 py-2 text-sm text-neutral-400 hover:text-neutral-600 transition"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Start over
            </button>
          </div>

          {/* LinkedIn note */}
          <p className="text-xs text-neutral-400">
            "Open in LinkedIn" pre-fills the post composer. LinkedIn may truncate the text — confirm before posting.
          </p>
        </div>
      )}
    </div>
  );
}
