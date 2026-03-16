'use client';
import { useEffect } from 'react';
import { useBrandSettings } from '../useBrandSettings';
import { SaveButton, SectionHeader, Card } from '../components';

const HEADING_FONTS = [
  'Inter', 'Plus Jakarta Sans', 'DM Sans', 'Outfit', 'Nunito', 'Raleway',
  'Poppins', 'Montserrat', 'Sora', 'Manrope',
  'Playfair Display', 'Cormorant Garamond', 'Libre Baskerville',
  'Merriweather', 'Lora', 'DM Serif Display', 'Crimson Pro', 'EB Garamond',
];

const BODY_FONTS = [
  'Inter', 'Plus Jakarta Sans', 'DM Sans', 'Outfit', 'Nunito',
  'Lato', 'Open Sans', 'Source Sans 3', 'Noto Sans', 'Rubik',
  'Mulish', 'Karla', 'Work Sans',
];

const TYPE_SCALE = [
  { label: 'Display',  size: '3rem',   weight: '700', tag: 'H1' },
  { label: 'Heading',  size: '2rem',   weight: '700', tag: 'H2' },
  { label: 'Title',    size: '1.5rem', weight: '600', tag: 'H3' },
  { label: 'Subtitle', size: '1.25rem',weight: '600', tag: 'H4' },
  { label: 'Body',     size: '1rem',   weight: '400', tag: 'p'  },
  { label: 'Small',    size: '0.875rem',weight:'400', tag: 'sm' },
  { label: 'Caption',  size: '0.75rem', weight:'400', tag: 'xs' },
];

export default function TypographyPage() {
  const { settings, update, save, saving, saved } = useBrandSettings();

  const headingFont = settings['brand_font_heading'] || 'Inter';
  const bodyFont    = settings['brand_font_body']    || 'Inter';
  const primary     = settings['brand_primary']      || '#111827';

  // Load Google Fonts for preview
  useEffect(() => {
    const fonts = [...new Set([headingFont, bodyFont])];
    const id = 'brand-font-preview';
    document.getElementById(id)?.remove();
    const link = document.createElement('link');
    link.id = id;
    link.rel = 'stylesheet';
    link.href = `https://fonts.googleapis.com/css2?${fonts.map(
      f => `family=${encodeURIComponent(f)}:wght@400;500;600;700`
    ).join('&')}&display=swap`;
    document.head.appendChild(link);
  }, [headingFont, bodyFont]);

  return (
    <div className="space-y-10">
      <SectionHeader
        title="Typography"
        description="Font families load from Google Fonts. Changes push as CSS variables to your live site."
        action={<SaveButton onSave={save} saving={saving} saved={saved} />}
      />

      {/* Font pickers */}
      <div className="grid grid-cols-2 gap-6">
        {[
          { key: 'brand_font_heading', label: 'Heading font', options: HEADING_FONTS, font: headingFont },
          { key: 'brand_font_body',    label: 'Body font',    options: BODY_FONTS,    font: bodyFont },
        ].map(({ key, label, options, font }) => (
          <div key={key}>
            <label className="block text-sm font-medium text-neutral-700 mb-2">{label}</label>
            <select
              value={settings[key] || 'Inter'}
              onChange={e => update(key, e.target.value)}
              className="w-full px-3 py-2 border border-neutral-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-neutral-200"
            >
              {options.map(f => <option key={f} value={f}>{f}</option>)}
            </select>
            <p className="mt-2 text-sm text-neutral-500" style={{ fontFamily: `'${font}', sans-serif` }}>
              {font} — The quick brown fox jumps over the lazy dog.
            </p>
          </div>
        ))}
      </div>

      {/* Type scale preview */}
      <div>
        <h3 className="text-sm font-semibold text-neutral-500 uppercase tracking-widest mb-4">Type Scale</h3>
        <Card className="p-8 space-y-5">
          {TYPE_SCALE.map(({ label, size, weight, tag }) => {
            const isHeading = ['H1','H2','H3','H4'].includes(tag);
            const font = isHeading ? headingFont : bodyFont;
            return (
              <div key={label} className="flex items-baseline gap-5 border-b border-neutral-50 last:border-0 pb-4 last:pb-0">
                <div className="w-16 shrink-0 text-right">
                  <span className="text-[10px] font-mono text-neutral-400 block">{tag}</span>
                  <span className="text-[10px] text-neutral-300">{size}</span>
                </div>
                <p
                  style={{
                    fontFamily: `'${font}', sans-serif`,
                    fontSize: size,
                    fontWeight: weight,
                    lineHeight: 1.2,
                    color: isHeading ? primary : '#374151',
                  }}
                >
                  {label === 'Body'
                    ? 'The five boxing wizards jump quickly. Sphinx of black quartz.'
                    : label === 'Caption' || label === 'Small'
                    ? 'ABCDEFGHIJKLMNOPQRSTUVWXYZ 0123456789'
                    : `${label} — The quick brown fox`}
                </p>
              </div>
            );
          })}
        </Card>
      </div>
    </div>
  );
}
