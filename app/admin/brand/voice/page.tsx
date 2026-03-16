'use client';
import { useBrandSettings } from '../useBrandSettings';
import { SaveButton, SectionHeader, Card } from '../components';

const FIELDS = [
  {
    key: 'brand_voice_tagline',
    label: 'Brand tagline',
    multiline: false,
    placeholder: 'Short and memorable. One line.',
    hint: 'Appears in headers, social bios, email footers.',
  },
  {
    key: 'brand_voice_mission',
    label: 'Mission statement',
    multiline: true,
    rows: 3,
    placeholder: 'What you do, who you do it for, and why it matters.',
    hint: 'Context Claude uses when scoring and generating content.',
  },
  {
    key: 'brand_voice_audience',
    label: 'Target audience',
    multiline: true,
    rows: 3,
    placeholder: 'Who are they? What do they care about? What do they already know?',
    hint: 'The more specific, the better the AI output.',
  },
  {
    key: 'brand_voice_tone',
    label: 'Tone keywords',
    multiline: false,
    placeholder: 'e.g. Direct, Warm, Expert, Understated, Honest',
    hint: 'Comma-separated. These become the scoring rubric.',
  },
  {
    key: 'brand_voice_dos',
    label: "Do's — patterns to reinforce",
    multiline: true,
    rows: 4,
    placeholder: 'One per line.\nShort declarative sentences.\nFirst person, observational.',
    hint: 'Claude references these when generating and scoring.',
  },
  {
    key: 'brand_voice_donts',
    label: "Don'ts — patterns to avoid",
    multiline: true,
    rows: 4,
    placeholder: 'One per line.\nBullet points in prose.\nMotivational sign-offs.',
    hint: 'Violations lower the AI score.',
  },
  {
    key: 'brand_voice_example',
    label: 'Exemplar paragraph',
    multiline: true,
    rows: 5,
    placeholder: 'Paste one paragraph that perfectly represents your voice. Claude uses this as a style anchor.',
    hint: 'The single most effective input for consistent AI output.',
  },
];

export default function VoicePage() {
  const { settings, update, save, saving, saved } = useBrandSettings();

  return (
    <div className="space-y-8">
      <SectionHeader
        title="Voice & Tone"
        description="These fields power both the AI Score tab and the writing assistant inside the blog and page editors."
        action={<SaveButton onSave={save} saving={saving} saved={saved} />}
      />

      <div className="space-y-6">
        {FIELDS.map(({ key, label, multiline, rows, placeholder, hint }) => (
          <div key={key}>
            <label className="block text-sm font-semibold text-neutral-700 mb-1">{label}</label>
            <p className="text-xs text-neutral-400 mb-2">{hint}</p>
            {multiline ? (
              <textarea
                value={settings[key] || ''}
                onChange={e => update(key, e.target.value)}
                placeholder={placeholder}
                rows={rows}
                className="w-full px-3 py-2.5 border border-neutral-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-neutral-200 resize-none placeholder:text-neutral-300 text-neutral-800"
              />
            ) : (
              <input
                type="text"
                value={settings[key] || ''}
                onChange={e => update(key, e.target.value)}
                placeholder={placeholder}
                className="w-full px-3 py-2.5 border border-neutral-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-neutral-200 placeholder:text-neutral-300 text-neutral-800"
              />
            )}
          </div>
        ))}
      </div>

      {/* Preview card */}
      {(settings['brand_voice_tagline'] || settings['brand_voice_tone']) && (
        <Card className="p-5">
          <p className="text-xs font-semibold text-neutral-400 uppercase tracking-widest mb-3">Brand snapshot</p>
          {settings['brand_voice_tagline'] && (
            <p className="text-lg font-semibold text-neutral-900 mb-2">"{settings['brand_voice_tagline']}"</p>
          )}
          {settings['brand_voice_tone'] && (
            <div className="flex flex-wrap gap-2 mt-3">
              {settings['brand_voice_tone'].split(',').map(t => t.trim()).filter(Boolean).map(t => (
                <span key={t} className="px-2.5 py-1 bg-neutral-100 rounded-full text-xs font-medium text-neutral-600">
                  {t}
                </span>
              ))}
            </div>
          )}
        </Card>
      )}
    </div>
  );
}
