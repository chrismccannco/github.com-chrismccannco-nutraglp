'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { useParams } from 'next/navigation';
import { ArrowLeft, Loader2, Check, Wand2, Copy, Trash2, Plus, Sparkles } from 'lucide-react';
import Link from 'next/link';

interface VideoClip {
  id: number;
  video_id: number;
  title: string | null;
  start_time: number;
  end_time: number;
  transcript_segment: string;
  platform: string;
  caption: string | null;
  status: string;
}

interface VideoData {
  id: number;
  title: string;
  slug: string;
  source_url: string | null;
  transcript: string | null;
  transcript_status: string;
  voice_id: number | null;
  persona_id: number | null;
  clips: VideoClip[];
}

interface SuggestedClip {
  title: string;
  transcript_segment: string;
  platforms: string[];
  rationale: string;
  start_word_index: number;
  end_word_index: number;
}

const PLATFORMS = [
  { key: 'linkedin', label: 'LinkedIn', color: 'bg-blue-50 text-blue-700' },
  { key: 'twitter', label: 'Twitter/X', color: 'bg-sky-50 text-sky-700' },
  { key: 'tiktok', label: 'TikTok', color: 'bg-pink-50 text-pink-700' },
  { key: 'instagram', label: 'Instagram', color: 'bg-purple-50 text-purple-700' },
  { key: 'youtube_shorts', label: 'YouTube Shorts', color: 'bg-red-50 text-red-700' },
];

export default function VideoEditorPage() {
  const { id } = useParams<{ id: string }>();
  const [video, setVideo] = useState<VideoData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [suggesting, setSuggesting] = useState(false);
  const [suggestions, setSuggestions] = useState<SuggestedClip[]>([]);
  const [generatingCaptions, setGeneratingCaptions] = useState(false);
  const [copied, setCopied] = useState<number | null>(null);
  const pendingRef = useRef<Record<string, unknown>>({});
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    fetch(`/api/videos/${id}`)
      .then(r => r.ok ? r.json() : null)
      .then(data => { if (data) setVideo(data); })
      .finally(() => setLoading(false));
  }, [id]);

  const doSave = useCallback(async () => {
    if (!video || Object.keys(pendingRef.current).length === 0) return;
    setSaving(true);
    setSaved(false);
    try {
      const res = await fetch(`/api/videos/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(pendingRef.current),
      });
      if (res.ok) {
        const updated = await res.json();
        setVideo(prev => prev ? { ...prev, ...updated } : null);
        pendingRef.current = {};
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
      }
    } catch (e) { console.error(e); }
    setSaving(false);
  }, [id, video]);

  function update(key: string, value: unknown) {
    if (!video) return;
    setVideo({ ...video, [key]: value } as VideoData);
    pendingRef.current[key] = value;
    setSaved(false);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(doSave, 1500);
  }

  async function suggestClips() {
    if (!video?.transcript) return;
    setSuggesting(true);
    setSuggestions([]);
    try {
      const res = await fetch(`/api/videos/${id}/suggest-clips`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ max_clips: 6 }),
      });
      if (res.ok) {
        const data = await res.json();
        setSuggestions(data.suggestions || []);
      } else {
        const err = await res.json();
        alert(err.error || 'Failed to suggest clips');
      }
    } catch (e) { console.error(e); alert('Failed to suggest clips'); }
    setSuggesting(false);
  }

  async function addClipFromSuggestion(suggestion: SuggestedClip, platform: string) {
    try {
      const res = await fetch(`/api/videos/${id}/clips`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: suggestion.title,
          start_time: 0,
          end_time: 0,
          transcript_segment: suggestion.transcript_segment,
          platform,
        }),
      });
      if (res.ok) {
        // Reload video to get updated clips
        const vRes = await fetch(`/api/videos/${id}`);
        if (vRes.ok) setVideo(await vRes.json());
      }
    } catch (e) { console.error(e); }
  }

  async function generateCaptions() {
    if (!video?.clips?.length) return;
    setGeneratingCaptions(true);
    try {
      const clipIds = video.clips.map(c => c.id);
      const res = await fetch(`/api/videos/${id}/generate-captions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ clip_ids: clipIds }),
      });
      if (res.ok) {
        // Reload
        const vRes = await fetch(`/api/videos/${id}`);
        if (vRes.ok) setVideo(await vRes.json());
      } else {
        const err = await res.json();
        alert(err.error || 'Failed to generate captions');
      }
    } catch (e) { console.error(e); }
    setGeneratingCaptions(false);
  }

  async function deleteClip(clipId: number) {
    try {
      await fetch(`/api/videos/${id}/clips`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ clip_id: clipId }),
      });
      const vRes = await fetch(`/api/videos/${id}`);
      if (vRes.ok) setVideo(await vRes.json());
    } catch (e) { console.error(e); }
  }

  function copyText(text: string, clipId: number) {
    navigator.clipboard.writeText(text);
    setCopied(clipId);
    setTimeout(() => setCopied(null), 1500);
  }

  if (loading) {
    return <div className="flex items-center justify-center py-20 text-neutral-400"><Loader2 size={20} className="animate-spin" /></div>;
  }
  if (!video) {
    return <div className="text-center py-20"><p className="text-sm text-neutral-500">Video not found.</p>
      <Link href="/admin/video-studio" className="text-sm text-neutral-900 underline mt-2 inline-block">Back</Link></div>;
  }

  const platformInfo = (key: string) => PLATFORMS.find(p => p.key === key) || PLATFORMS[0];

  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="bg-white border-b border-neutral-200 px-8 pt-6 pb-6">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <Link href="/admin/video-studio" className="p-2 -ml-2 text-neutral-400 hover:text-neutral-600 rounded-lg hover:bg-neutral-100 transition-colors">
              <ArrowLeft size={16} />
            </Link>
            <div>
              <input type="text" value={video.title} onChange={e => update('title', e.target.value)}
                className="text-lg font-semibold text-neutral-900 bg-transparent border-none outline-none focus:ring-0 p-0 w-full" placeholder="Video title" />
              <span className="text-xs text-neutral-400">{video.clips?.length || 0} clips created</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {saving && <span className="flex items-center gap-1.5 text-xs text-neutral-400"><Loader2 size={12} className="animate-spin" /> Saving...</span>}
            {saved && <span className="flex items-center gap-1.5 text-xs text-emerald-600"><Check size={12} /> Saved</span>}
            <button onClick={doSave} disabled={saving}
              className="flex items-center gap-2 px-4 py-2 bg-neutral-900 text-white text-sm font-medium rounded-lg hover:bg-neutral-700 disabled:opacity-50 transition-colors">
              <Check size={13} /> Save
            </button>
          </div>
        </div>
      </div>

      <div className="px-8 py-6 max-w-6xl">
        <div className="grid grid-cols-2 gap-6">
          {/* Left: Transcript + source */}
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-neutral-500 mb-1.5">Source URL (optional)</label>
              <input type="text" value={video.source_url || ''} onChange={e => update('source_url', e.target.value)}
                placeholder="YouTube, Loom, or Zoom link" className="w-full px-3 py-2 border border-neutral-200 rounded-lg text-sm text-neutral-700" />
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-500 mb-1.5">Transcript</label>
              <p className="text-xs text-neutral-400 mb-1.5">Paste the full transcript. The AI analyzes it to suggest the best clip-worthy moments.</p>
              <textarea value={video.transcript || ''} onChange={e => { update('transcript', e.target.value); update('transcript_status', e.target.value ? 'complete' : 'pending'); }}
                rows={20} placeholder="Paste your video transcript here..."
                className="w-full px-3 py-2.5 border border-neutral-200 rounded-lg text-sm text-neutral-800 resize-y leading-relaxed font-mono" />
            </div>

            <button onClick={suggestClips} disabled={suggesting || !video.transcript}
              className="flex items-center gap-2 px-5 py-2.5 bg-violet-600 text-white text-sm font-medium rounded-lg hover:bg-violet-500 disabled:opacity-50 transition-colors w-full justify-center">
              {suggesting ? <Loader2 size={14} className="animate-spin" /> : <Wand2 size={14} />}
              {suggesting ? 'Analyzing transcript...' : 'Find best clip moments'}
            </button>
          </div>

          {/* Right: Suggestions + Clips */}
          <div className="space-y-6">
            {/* AI Suggestions */}
            {suggestions.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold text-neutral-900 mb-3 flex items-center gap-1.5">
                  <Sparkles size={14} className="text-violet-500" /> AI Suggested Clips
                </h3>
                <div className="space-y-3">
                  {suggestions.map((s, i) => (
                    <div key={i} className="bg-white rounded-xl border border-violet-200 p-4">
                      <h4 className="text-sm font-semibold text-neutral-900 mb-1">{s.title}</h4>
                      <p className="text-xs text-neutral-500 mb-2 line-clamp-3">{s.transcript_segment}</p>
                      <p className="text-[11px] text-violet-600 mb-3">{s.rationale}</p>
                      <div className="flex flex-wrap gap-1.5">
                        {s.platforms.map(p => {
                          const pi = platformInfo(p);
                          return (
                            <button key={p} onClick={() => addClipFromSuggestion(s, p)}
                              className={`px-2.5 py-1 rounded-full text-[11px] font-medium ${pi.color} hover:opacity-80 transition-opacity flex items-center gap-1`}>
                              <Plus size={10} /> {pi.label}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Created Clips */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-neutral-900">Clips ({video.clips?.length || 0})</h3>
                {(video.clips?.length || 0) > 0 && (
                  <button onClick={generateCaptions} disabled={generatingCaptions}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 text-white text-xs font-medium rounded-lg hover:bg-emerald-500 disabled:opacity-50 transition-colors">
                    {generatingCaptions ? <Loader2 size={11} className="animate-spin" /> : <Wand2 size={11} />}
                    {generatingCaptions ? 'Generating...' : 'Generate all captions'}
                  </button>
                )}
              </div>

              {(!video.clips || video.clips.length === 0) ? (
                <div className="bg-white rounded-xl border border-neutral-200 p-6 text-center">
                  <p className="text-xs text-neutral-500">
                    {video.transcript ? 'Click "Find best clip moments" to get AI suggestions, or add clips manually.' : 'Paste a transcript first, then find clip-worthy moments.'}
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {video.clips.map(clip => {
                    const pi = platformInfo(clip.platform);
                    return (
                      <div key={clip.id} className="bg-white rounded-xl border border-neutral-200 p-4">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              {clip.title && <span className="text-sm font-semibold text-neutral-900">{clip.title}</span>}
                              <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${pi.color}`}>{pi.label}</span>
                            </div>
                            <p className="text-xs text-neutral-500 line-clamp-2">{clip.transcript_segment}</p>
                          </div>
                          <button onClick={() => deleteClip(clip.id)}
                            className="p-1.5 text-neutral-400 hover:text-red-500 rounded-lg hover:bg-neutral-50 transition-colors shrink-0">
                            <Trash2 size={13} />
                          </button>
                        </div>

                        {clip.caption && (
                          <div className="mt-3 pt-3 border-t border-neutral-100">
                            <div className="flex items-center justify-between mb-1.5">
                              <p className="text-[10px] font-semibold text-neutral-400 uppercase tracking-wider">Caption</p>
                              <button onClick={() => copyText(clip.caption!, clip.id)}
                                className="flex items-center gap-1 text-[10px] text-neutral-400 hover:text-neutral-600 transition-colors">
                                {copied === clip.id ? <Check size={10} /> : <Copy size={10} />}
                                {copied === clip.id ? 'Copied' : 'Copy'}
                              </button>
                            </div>
                            <p className="text-xs text-neutral-700 whitespace-pre-wrap leading-relaxed">{clip.caption}</p>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
