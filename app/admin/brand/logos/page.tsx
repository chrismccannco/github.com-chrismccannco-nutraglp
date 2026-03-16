'use client';
import { Upload, ExternalLink } from 'lucide-react';
import { useBrandSettings } from '../useBrandSettings';
import { SaveIndicator, SectionHeader } from '../components';

const LOGO_SLOTS = [
  {
    key: 'brand_logo_primary',
    label: 'Primary logo',
    bg: 'bg-white',
    hint: 'Full color. Used on light backgrounds, emails, print.',
  },
  {
    key: 'brand_logo_reversed',
    label: 'Reversed / white',
    bg: 'bg-neutral-900',
    hint: 'White or light version. Used on dark backgrounds.',
  },
  {
    key: 'brand_logo_mark',
    label: 'Logo mark',
    bg: 'bg-white',
    hint: 'Symbol or icon only. Square crop. Min 256×256px.',
  },
  {
    key: 'brand_logo_favicon',
    label: 'Favicon',
    bg: 'bg-neutral-100',
    hint: 'Square. 32×32px minimum. PNG or ICO.',
  },
];

export default function LogosPage() {
  const { settings, update, saving, saved } = useBrandSettings();

  return (
    <div className="space-y-10">
      <SectionHeader
        title="Logo Variants"
        description="Upload logos to your Media library, then paste the URL here. Keeps all variants in one place."
        action={<SaveIndicator saving={saving} saved={saved} />}
      />

      <div className="grid grid-cols-2 gap-5">
        {LOGO_SLOTS.map(({ key, label, bg, hint }) => {
          const url = settings[key] || '';
          return (
            <div key={key} className="rounded-2xl border border-neutral-200 overflow-hidden bg-white">
              {/* Preview area */}
              <div className={`${bg} h-40 flex items-center justify-center relative`}>
                {url ? (
                  <img
                    src={url}
                    alt={label}
                    className="max-h-32 max-w-[80%] object-contain"
                    onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }}
                  />
                ) : (
                  <div className="text-center text-neutral-300">
                    <Upload size={22} className="mx-auto mb-1.5" />
                    <p className="text-xs">No logo set</p>
                  </div>
                )}
                {url && (
                  <a
                    href={url}
                    target="_blank"
                    rel="noreferrer"
                    className="absolute top-2 right-2 bg-white/80 rounded-md p-1.5"
                  >
                    <ExternalLink size={11} className="text-neutral-500" />
                  </a>
                )}
              </div>

              {/* Fields */}
              <div className="p-4 space-y-2">
                <div>
                  <p className="text-sm font-semibold text-neutral-800">{label}</p>
                  <p className="text-xs text-neutral-400">{hint}</p>
                </div>
                <input
                  type="url"
                  value={url}
                  onChange={e => update(key, e.target.value)}
                  placeholder="https://your-cdn.com/logo.svg"
                  className="w-full text-xs font-mono px-2.5 py-1.5 border border-neutral-200 rounded-lg text-neutral-700 focus:outline-none focus:ring-1 focus:ring-neutral-300 placeholder:text-neutral-300"
                />
              </div>
            </div>
          );
        })}
      </div>

      <p className="text-xs text-neutral-400">
        Tip: Upload to <strong>Admin → Media</strong>, click the file, copy the URL, paste here.
      </p>
    </div>
  );
}
