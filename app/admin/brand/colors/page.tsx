'use client';
import { useState } from 'react';
import { Check, Copy, ChevronDown, ChevronUp } from 'lucide-react';
import { useBrandSettings } from '../useBrandSettings';
import { SaveButton, SectionHeader } from '../components';
import {
  PALETTE_KEYS,
  generateScale,
  contrastRatio,
  wcagLevel,
} from '../colorUtils';

export default function ColorsPage() {
  const { settings, update, save, saving, saved } = useBrandSettings();
  const [copied, setCopied] = useState('');
  const [expanded, setExpanded] = useState<string | null>(null);

  const copy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(''), 1500);
  };

  const CONTRAST_PAIRS = [
    { fg: 'brand_primary',    bg: '#ffffff',                               bgLabel: 'White' },
    { fg: 'brand_primary',    bg: '#000000',                               bgLabel: 'Black' },
    { fg: 'brand_secondary',  bg: '#ffffff',                               bgLabel: 'White' },
    { fg: 'brand_accent',     bg: '#ffffff',                               bgLabel: 'White' },
    { fg: 'brand_neutral',    bg: '#ffffff',                               bgLabel: 'White' },
    { fg: 'brand_primary',    bg: settings['brand_background'] || '#fff', bgLabel: 'Background' },
  ];

  return (
    <div className="space-y-12">

      {/* ── Palette ─────────────────────────────────────────────────── */}
      <section>
        <SectionHeader
          title="Brand Palette"
          description="Click any swatch to open the color picker. Hex values sync to your live site as CSS variables."
          action={<SaveButton onSave={save} saving={saving} saved={saved} />}
        />

        <div className="grid grid-cols-5 gap-5">
          {PALETTE_KEYS.map(({ key, label, cssVar }) => {
            const hex = settings[key] || '#000000';
            const scale = generateScale(hex);
            const isExpanded = expanded === key;

            return (
              <div key={key} className="space-y-2.5">
                {/* Swatch */}
                <div className="relative group">
                  <label
                    htmlFor={`picker-${key}`}
                    className="block h-24 rounded-2xl border-2 border-white/60 cursor-pointer shadow-md transition-transform hover:scale-[1.03] active:scale-[0.98]"
                    style={{ background: hex }}
                  />
                  <input
                    id={`picker-${key}`}
                    type="color"
                    value={hex}
                    onChange={e => update(key, e.target.value)}
                    className="sr-only"
                  />
                  <button
                    onClick={() => copy(hex, key)}
                    className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 bg-white/90 backdrop-blur-sm rounded-md p-1.5 shadow-sm transition-opacity"
                    title="Copy hex"
                  >
                    {copied === key
                      ? <Check size={11} className="text-indigo-600" />
                      : <Copy size={11} className="text-neutral-600" />}
                  </button>
                </div>

                {/* Meta */}
                <div>
                  <p className="text-xs font-semibold text-neutral-800">{label}</p>
                  <p className="text-[10px] font-mono text-neutral-400 leading-tight">{cssVar}</p>
                  <input
                    type="text"
                    value={hex}
                    maxLength={7}
                    onChange={e => {
                      const v = e.target.value;
                      if (/^#[0-9a-f]{6}$/i.test(v)) update(key, v);
                    }}
                    className="mt-1.5 w-full text-xs font-mono px-2 py-1 border border-neutral-200 rounded-md text-neutral-700 focus:outline-none focus:ring-1 focus:ring-neutral-400"
                  />
                </div>

                {/* Scale strip + expand */}
                <button
                  onClick={() => setExpanded(isExpanded ? null : key)}
                  className="w-full group/scale"
                  title="View full scale"
                >
                  <div className="flex gap-px rounded-full overflow-hidden">
                    {scale.map(({ shade, color }) => (
                      <div
                        key={shade}
                        className="h-3 flex-1"
                        style={{ background: color }}
                      />
                    ))}
                  </div>
                  <div className="flex items-center justify-center gap-1 mt-1 text-[10px] text-neutral-400 group-hover/scale:text-neutral-600">
                    {isExpanded ? <ChevronUp size={10} /> : <ChevronDown size={10} />}
                    {isExpanded ? 'Collapse' : 'Full scale'}
                  </div>
                </button>

                {/* Expanded scale */}
                {isExpanded && (
                  <div className="bg-white rounded-xl border border-neutral-100 p-3 space-y-1.5">
                    {scale.map(({ shade, color }) => (
                      <div key={shade} className="flex items-center gap-2">
                        <div className="w-5 h-5 rounded flex-shrink-0" style={{ background: color }} />
                        <span className="text-[10px] text-neutral-400 w-8">{shade}</span>
                        <span className="text-[10px] font-mono text-neutral-700 flex-1">{color}</span>
                        <button
                          onClick={() => copy(color, `${key}-${shade}`)}
                          className="opacity-40 hover:opacity-100 transition-opacity"
                        >
                          {copied === `${key}-${shade}`
                            ? <Check size={9} className="text-indigo-500" />
                            : <Copy size={9} />}
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* ── WCAG Contrast ───────────────────────────────────────────── */}
      <section>
        <SectionHeader
          title="Accessibility"
          description="WCAG 2.1 contrast ratios. AA (4.5:1) required for normal text. AA Large (3:1) for headings ≥18pt."
        />

        <div className="grid grid-cols-3 gap-3">
          {CONTRAST_PAIRS.map(({ fg, bg, bgLabel }, i) => {
            const fgHex = settings[fg] || '#000000';
            const ratio = contrastRatio(fgHex, bg);
            const { level, pass } = wcagLevel(ratio);
            const fgLabel = PALETTE_KEYS.find(p => p.key === fg)?.label;

            return (
              <div key={i} className="rounded-xl border border-neutral-200 overflow-hidden bg-white">
                <div
                  className="h-14 flex items-center justify-center text-lg font-bold"
                  style={{ background: bg, color: fgHex }}
                >
                  Aa
                </div>
                <div className="px-3 py-2.5">
                  <p className="text-xs text-neutral-500">{fgLabel} on {bgLabel}</p>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-sm font-mono font-semibold text-neutral-900">{ratio}:1</span>
                    <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                      pass ? 'bg-indigo-100 text-indigo-700' : 'bg-red-100 text-red-600'
                    }`}>
                      {level}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

    </div>
  );
}
