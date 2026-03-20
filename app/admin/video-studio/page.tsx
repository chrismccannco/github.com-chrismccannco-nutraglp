'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Plus, Trash2, Loader2, Video, Clock } from 'lucide-react';

interface VideoItem {
  id: number;
  title: string;
  slug: string;
  source_url: string | null;
  transcript_status: string;
  duration_seconds: number;
  created_at: string;
}

export default function VideoStudioPage() {
  const [videos, setVideos] = useState<VideoItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);

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
    try {
      await fetch(`/api/videos/${id}`, { method: 'DELETE' });
      await load();
    } catch (e) { console.error(e); }
  }

  function formatDuration(seconds: number): string {
    if (!seconds) return '—';
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${String(s).padStart(2, '0')}`;
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="bg-white border-b border-neutral-200 px-8 pt-6 pb-6">
        <p className="text-xs text-neutral-400 mb-1">Admin / Video Studio</p>
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-neutral-900">Video Studio</h1>
            <p className="text-xs text-neutral-400 mt-0.5">
              Paste a transcript, let AI find the best moments, generate platform-specific captions.
            </p>
          </div>
          <button onClick={createVideo} disabled={creating}
            className="flex items-center gap-2 px-4 py-2 bg-neutral-900 text-white text-sm font-medium rounded-lg hover:bg-neutral-700 disabled:opacity-50 transition-colors">
            {creating ? <Loader2 size={13} className="animate-spin" /> : <Plus size={13} />}
            New Video
          </button>
        </div>
      </div>

      <div className="px-8 py-6 max-w-5xl">
        {loading ? (
          <div className="flex items-center justify-center py-20 text-neutral-400">
            <Loader2 size={20} className="animate-spin" />
          </div>
        ) : videos.length === 0 ? (
          <div className="bg-white rounded-xl border border-neutral-200 p-8 text-center">
            <Video size={32} className="mx-auto text-neutral-300 mb-3" />
            <p className="text-sm text-neutral-500 mb-4">No videos yet. Add a presentation or talk to start creating clips.</p>
            <button onClick={createVideo} disabled={creating}
              className="inline-flex items-center gap-2 px-4 py-2 bg-neutral-900 text-white text-sm font-medium rounded-lg hover:bg-neutral-700 disabled:opacity-50 transition-colors">
              <Plus size={13} /> Add your first video
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {videos.map(v => (
              <div key={v.id} className="bg-white rounded-xl border border-neutral-200 p-5 hover:border-neutral-300 transition-colors">
                <div className="flex items-start justify-between">
                  <Link href={`/admin/video-studio/${v.id}`} className="flex-1 no-underline group">
                    <h3 className="text-sm font-semibold text-neutral-900 group-hover:text-neutral-600 transition-colors mb-1">
                      {v.title}
                    </h3>
                    <div className="flex items-center gap-4 text-[11px] text-neutral-400">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${
                        v.transcript_status === 'complete'
                          ? 'bg-teal-50 text-teal-600'
                          : 'bg-amber-50 text-amber-600'
                      }`}>
                        {v.transcript_status === 'complete' ? 'Transcript ready' : 'Needs transcript'}
                      </span>
                      {v.duration_seconds > 0 && (
                        <span className="flex items-center gap-1"><Clock size={10} /> {formatDuration(v.duration_seconds)}</span>
                      )}
                      <span>{new Date(v.created_at).toLocaleDateString()}</span>
                    </div>
                  </Link>
                  <button onClick={() => deleteVideo(v.id, v.title)}
                    className="p-2 text-neutral-400 hover:text-red-500 rounded-lg hover:bg-neutral-50 transition-colors ml-2">
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
