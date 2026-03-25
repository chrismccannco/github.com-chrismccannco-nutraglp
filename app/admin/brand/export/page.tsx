'use client';
import { useState } from 'react';
import { Check, Copy, ExternalLink } from 'lucide-react';
import { useBrandSettings } from '../useBrandSettings';
import { SectionHeader } from '../components';
import { PALETTE_KEYS } from '../colorUtils';

function CodeBlock({ code, id, label, copied, onCopy }: {
  code: string; id: string; label: string; copied: string; onCopy: (t: string, id: string) => void;
}) {
  return (
    <div className="rounded-xl border border-neutral-200 overflow-hidden">
      <div className="flex items-center justify-between px-4 py-2.5 bg-neutral-800 text-neutral-300">
        <span className="text-xs font-mono">{label}</span>
        <button onClick={() => onCopy(code, id)} className="text-xs flex items-center gap-1.5 hover:text-white transition-colors">
          {copied === id ? <><Check size={11} className="text-teal-400" /> Copied</> : <><Copy size={11} /> Copy</>}
        </button>
      </div>
      <pre className="bg-neutral-900 text-neutral-200 text-xs p-5 overflow-x-auto font-mono leading-relaxed whitespace-pre">{code}</pre>
    </div>
  );
}

export default function ExportPage() {
  const { settings } = useBrandSettings();
  const [copied, setCopied] = useState('');

  const copy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(''), 2000);
  };

  const colorVars = PALETTE_KEYS.map(({ key, cssVar }) =>
    `  ${cssVar}: ${settings[key] || '#000000'};`
  ).join('\n');

  const fontVars = [
    `  --font-heading: '${settings['brand_font_heading'] || 'Inter'}', sans-serif;`,
    `  --font-body: '${settings['brand_font_body'] || 'Inter'}', sans-serif;`,
  ].join('\n');

  const cssOutput = `:root {\n  /* Colors */\n${colorVars}\n\n  /* Typography */\n${fontVars}\n}`;

  const jsonOutput = JSON.stringify({
    colors: Object.fromEntries(
      PALETTE_KEYS.map(({ key, label }) => [label.toLowerCase(), settings[key] || '#000000'])
    ),
    fonts: {
      heading: settings['brand_font_heading'] || 'Inter',
      body:    settings['brand_font_body']    || 'Inter',
    },
    logos: {
      primary:  settings['brand_logo_primary']  || null,
      reversed: settings['brand_logo_reversed'] || null,
      mark:     settings['brand_logo_mark']     || null,
      favicon:  settings['brand_logo_favicon']  || null,
    },
    voice: {
      tagline:  settings['brand_voice_tagline']  || '',
      mission:  settings['brand_voice_mission']  || '',
      tone:     settings['brand_voice_tone']     || '',
      audience: settings['brand_voice_audience'] || '',
    },
  }, null, 2);

  const tailwindOutput = `// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        primary:    '${settings['brand_primary']    || '#000000'}',
        secondary:  '${settings['brand_secondary']  || '#000000'}',
        accent:     '${settings['brand_accent']     || '#000000'}',
        neutral:    '${settings['brand_neutral']    || '#000000'}',
        background: '${settings['brand_background'] || '#ffffff'}',
      },
      fontFamily: {
        heading: ["'${settings['brand_font_heading'] || 'Inter'}'", 'sans-serif'],
        body:    ["'${settings['brand_font_body']    || 'Inter'}'", 'sans-serif'],
      },
    },
  },
};`;

  const headSnippet = `<!-- Add to <head> of your site — brand colors load automatically -->
<link
  rel="stylesheet"
  href="https://nutraglp-headless-cms.vercel.app/api/brand-css"
  crossorigin="anonymous"
/>`;

  return (
    <div className="space-y-6">
      <SectionHeader
        title="Design Token Export"
        description="Copy tokens into any codebase. Or add the live stylesheet link to your site's head — colors update automatically when you change them here."
      />

      {/* Live endpoint callout */}
      <div className="flex items-center gap-3 bg-teal-50 border border-teal-200 rounded-xl px-4 py-3">
        <div className="w-2 h-2 rounded-full bg-teal-500 animate-pulse" />
        <p className="text-sm text-teal-800">
          Live endpoint:{' '}
          <a
            href="/api/brand-css"
            target="_blank"
            className="font-mono font-semibold underline inline-flex items-center gap-1"
          >
            /api/brand-css <ExternalLink size={11} />
          </a>
          {' '}— always returns your current brand tokens.
        </p>
      </div>

      <CodeBlock code={headSnippet}    id="head"     label="HTML <head> snippet"  copied={copied} onCopy={copy} />
      <CodeBlock code={cssOutput}      id="css"      label="CSS Variables (:root)" copied={copied} onCopy={copy} />
      <CodeBlock code={jsonOutput}     id="json"     label="JSON Tokens"           copied={copied} onCopy={copy} />
      <CodeBlock code={tailwindOutput} id="tailwind" label="Tailwind config"       copied={copied} onCopy={copy} />
    </div>
  );
}
