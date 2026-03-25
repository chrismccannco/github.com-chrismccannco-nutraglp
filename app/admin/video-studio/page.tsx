'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Plus, Trash2, Loader2, Video, Clock, Scissors } from 'lucide-react';

interface VideoItem {
  id: number;
  title: string;
  slug: string;
  source_url: string | null;
  transcript_status: string;
  duration_seconds: number;
  clip_count?: number;
  created_at: string;
}

export default function VideoStudioPage() {
  const [videos, setVideos] = useState<VideoItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  async function load() {
    try {
      const res = await fetch('/api/videos');
      if (res.ok) setVideos(await res.json());
    } catch (e) { console.error(e); }
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  async function createVideo() {
    setCreating(true);
    try {
      const res = await fetch('/api/videos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: 'Untitled Video' }),
      });
      if (res.ok) {
        const v = await res.json();
        window.location.href = `/admin/video-studio/${v.id}`;
      }
    } catch (e) { console.error(e); }
    setCreating(false);
  }

  async function deleteVideo(id: number, title: string) {
    if (!confirm(`Delete "${title}" and all its clips?`)) return;
    setDeletingId(id);
    try {
      await fetch(`/api/videos/${id}`, { method: 'DELETE' });
      setVideos(prev => prev.filter(v => v.id !== id));
    } catch (e) { console.error(e); }
    setDeletingId(null);
  }

  function formatDuration(seconds: number): string {
    if (!seconds) return '';
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${String(s).padStart(2, '0')}`;
  }

  const totalClips = videos.reduce((sum, v) => sum + (v.clip_count || 0), 0);
  const withTranscript = videos.filter(v => v.transcript_status === 'complete').length;

  return (
    <div className="max-w-5xl">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-xl font-semibold text-neutral-900 flex items-center gap-2">
            <Video className="w-5 h-5 text-teal-600" />
            Video Studio
          </h1>
          <p className="text-sm text-neutral-500 mt-1">
            Paste a transcript, find clip-worthy moments, generate platform captions.
          </p>
        </div>
        <button
          onClick={createVideo}
          disabled={creating}
          className="flex items-center gap-2 px-4 py-2 bg-neutral-900 text-white text-sm font-medium rounded-lg hover:bg-neutral-700 disabled:opacity-50 transition-colors"
        >
          {creating ? <Loader2 size={13} className="animate-spin" /> : <Plus size={13} />}
          New Video
        </button>
      </div>

      {/* Stats bar */}
      {videos.length > 0 && (
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-white border border-neutral-200 rounded-xl p-4">
            <p className="text-[11px] font-medium text-neutral-400 uppercase tracking-wide">Videos</p>
            <p className="text-2xl font-semibold text-neutral-900 mt-1">{videos.length}</p>
          </div>
          <div className="bg-white border border-neutral-200 rounded-xl p-4">
            <p className="text-[11px] font-medium text-neutral-400 uppercase tracking-wide">Clips Created</p>
            <p className="text-2xl font-semibold text-neutral-900 mt-1">{totalClips}</p>
          </div>
          <div className="bg-white border border-neutral-200 rounded-xl p-4">
            <p className="text-[11px] font-medium text-neutral-400 uppercase tracking-wide">Transcribed</p>
            <p className="text-2xl font-semibold text-neutral-900 mt-1">{withTranscript}</p>
          </div>
        </div>
      )}

      {/* Video list */}
      <div className="space-y-2">
        {videos.map(v => (
          <div
            key={v.id}
            className="bg-white rounded-xl border border-neutral-200 hover:border-neutral-300 transition-colors"
          >
            <div className="flex items-center gap-4 px-5 py-4">
              <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${
                v.transcript_status === 'complete' ? 'bg-teal-50' : 'bg-neutral-100'
              }`}>
                <Video size={16} className={v.transcript_status === 'complete' ? 'text-teal-600' : 'text-neutral-400'} />
              </div>

              <Link href={`/admin/video-studio/${v.id}`} className="flex-1 min-w-0 no-underline group">
                <p className="text-sm font-semibold text-neutral-900 group-hover:text-teal-700 transition-colors truncate">
                  {v.title}
                </p>
                <div className="flex items-center gap-3 mt-0.5">
                  <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${
                    v.transcript_status === 'complete'
                      ? 'bg-teal-50 text-teal-600'
                      : 'bg-amber-50 text-amber-600'
                  }`}>
                    {v.transcript_status === 'complete' ? 'Transcript ready' : 'No transcript'}
                  </span>
                  {v.duration_seconds > 0 && (
                    <span className="flex items-center gap-1 text-[11px] text-neutral-400">
                      <Clock size={10} /> {formatDuration(v.duration_seconds)}
                    </span>
                  )}
                  {(v.clip_count || 0) > 0 && (
                    <span className="flex items-center gap-1 text-[11px] text-neutral-400">
                      <Scissors size={10} /> {v.clip_count} clip{v.clip_count !== 1 ? 's' : ''}
                    </span>
                  )}
                </div>
              </Link>

              <span className="text-[11px] text-neutral-400 hidden sm:block flex-shrink-0">
                {new Date(v.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              </span>

              <button
                onClick={() => deleteVideo(v.id, title)}
                disabled={deletingId === v.id}
                className="p-2 text-neutral-400 hover:text-red-500 rounded-lg hover:bg-neutral-50 transition-colors flex-shrink-0"
              >
                {deletingId === v.id
                  ? <Loader2 size={14} className="animate-spin" />
                  : <Trash2 size={14} />}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
