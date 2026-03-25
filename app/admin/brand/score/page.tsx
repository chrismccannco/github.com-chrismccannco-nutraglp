'use client';
import { useState } from 'react';
import { Zap, Loader2, AlertTriangle, CheckCircle, Info, RefreshCw } from 'lucide-react';
import { useBrandSettings } from '../useBrandSettings';
import { SectionHeader, Card } from '../components';

interface ScoreResult {
  overall: number;
  voice: number;
  clarity: number;
  summary: string;
  strengths: string[];
  improvements: string[];
  rewrite: string;
}

function ScoreRing({ value, label }: { value: number; label: string }) {
  const color = value >= 80 ? '#10b981' : value >= 60 ? '#f59e0b' : '#ef4444';
  const circumference = 2 * Math.PI * 30;
  const dash = (value / 100) * circumference;

  return (
    <div className="text-center">
      <div className="relative w-20 h-20 mx-auto">
        <svg viewBox="0 0 72 72" className="w-20 h-20 -rotate-90">
          <circle cx="36" cy="36" r="30" fill="none" stroke="#f3f4f6" strokeWidth="5" />
          <circle
            cx="36" cy="36" r="30" fill="none"
            stroke={color} strokeWidth="5"
            strokeDasharray={`${dash} ${circumference - dash}`}
            strokeLinecap="round"
            style={{ transition: 'stroke-dasharray 0.8s ease' }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-xl font-bold text-neutral-800">{value}</span>
        </div>
      </div>
      <p className="text-xs text-neutral-500 mt-1.5 font-medium">{label}</p>
    </div>
  );
}

export default function ScorePage() {
  const { settings } = useBrandSettings();
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ScoreResult | null>(null);
  const [error, setError] = useState('');

  const hasBrandVoice = !!(settings['brand_voice_tone'] || settings['brand_voice_mission']);

  const score = async () => {
    if (!content.trim()) return;
    setLoading(true);
    setError('');
    setResult(null);

    try {
      const resp = await fetch('/api/brand/score', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content,
          brand: {
            tagline:  settings['brand_voice_tagline']  || '',
            mission:  settings['brand_voice_mission']  || '',
            tone:     settings['brand_voice_tone']     || '',
            dos:      settings['brand_voice_dos']      || '',
            donts:    settings['brand_voice_donts']    || '',
            audience: settings['brand_voice_audience'] || '',
            example:  settings['brand_voice_example']  || '',
          },
        }),
      });

      if (!resp.ok) throw new Error(await resp.text());
      setResult(await resp.json());
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <SectionHeader
        title="AI Brand Scorer"
        description="Paste any content and Claude scores it against your brand voice guidelines."
      />

      {!hasBrandVoice && (
        <div className="flex items-start gap-2.5 bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-800">
          <Info size={15} className="mt-0.5 shrink-0" />
          <span>
            Add your tone keywords and mission in the{' '}
            <a href="/admin/brand/voice" className="font-semibold underline">Voice & Tone</a>{' '}
            tab for more accurate scores.
          </span>
        </div>
      )}

      <textarea
        value={content}
        onChange={e => setContent(e.target.value)}
        placeholder="Paste a blog post, page copy, email, social post, product description…"
        rows={10}
        className="w-full px-4 py-3 border border-neutral-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-neutral-200 resize-none font-mono placeholder:text-neutral-300 placeholder:font-sans"
      />

      <div className="flex items-center gap-3">
        <button
          onClick={score}
          disabled={loading || !content.trim()}
          className="flex items-center gap-2 px-5 py-2.5 bg-neutral-900 text-white text-sm font-semibold rounded-lg disabled:opacity-40 hover:bg-neutral-700 transition-colors"
        >
          {loading
            ? <><Loader2 size={14} className="animate-spin" /> Analyzing…</>
            : <><Zap size={14} /> Score content</>}
        </button>
        {result && (
          <button
            onClick={() => { setResult(null); setContent(''); }}
            className="flex items-center gap-1.5 text-sm text-neutral-500 hover:text-neutral-800"
          >
            <RefreshCw size={13} /> New
          </button>
        )}
      </div>

      {error && (
        <div className="flex items-start gap-2 text-red-600 text-sm bg-red-50 rounded-xl p-4">
          <AlertTriangle size={14} className="mt-0.5 shrink-0" />
          {error}
        </div>
      )}

      {result && (
        <Card className="p-6 space-y-6">
          {/* Score rings */}
          <div className="flex gap-10 justify-center py-2">
            <ScoreRing value={result.overall} label="Overall" />
            <ScoreRing value={result.voice}   label="Voice" />
            <ScoreRing value={result.clarity} label="Clarity" />
          </div>

          {/* Summary */}
          <p className="text-sm text-neutral-600 text-center italic border-t border-neutral-100 pt-5">
            {result.summary}
          </p>

          {/* Strengths + improvements */}
          <div className="grid grid-cols-2 gap-5">
            <div>
              <h3 className="text-xs font-bold text-teal-700 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                <CheckCircle size={12} /> Strengths
              </h3>
              <ul className="space-y-2">
                {result.strengths.map((s, i) => (
                  <li key={i} className="text-sm text-neutral-600 flex gap-2">
                    <span className="text-teal-400 mt-px">•</span>{s}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-xs font-bold text-amber-700 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                <AlertTriangle size={12} /> Improvements
              </h3>
              <ul className="space-y-2">
                {result.improvements.map((s, i) => (
                  <li key={i} className="text-sm text-neutral-600 flex gap-2">
                    <span className="text-amber-400 mt-px">•</span>{s}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Suggested rewrite */}
          {result.rewrite && (
            <div className="bg-neutral-50 rounded-xl p-4 border-l-3 border-neutral-300">
              <p className="text-xs font-bold text-neutral-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Info size={11} /> Suggested rewrite
              </p>
              <p className="text-sm text-neutral-700 italic leading-relaxed">{result.rewrite}</p>
            </div>
          )}
        </Card>
      )}
    </div>
  );
}
