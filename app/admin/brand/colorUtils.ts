export function hexToRgb(hex: string): [number, number, number] | null {
  const m = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex.trim());
  return m ? [parseInt(m[1], 16), parseInt(m[2], 16), parseInt(m[3], 16)] : null;
}

export function rgbToHsl(r: number, g: number, b: number): [number, number, number] {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h = 0, s = 0;
  const l = (max + min) / 2;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
      case g: h = ((b - r) / d + 2) / 6; break;
      case b: h = ((r - g) / d + 4) / 6; break;
    }
  }
  return [Math.round(h * 360), Math.round(s * 100), Math.round(l * 100)];
}

export function hslToHex(h: number, s: number, l: number): string {
  s /= 100; l /= 100;
  const a = s * Math.min(l, 1 - l);
  const f = (n: number) => {
    const k = (n + h / 30) % 12;
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * color).toString(16).padStart(2, '0');
  };
  return `#${f(0)}${f(8)}${f(4)}`;
}

export function generateScale(hex: string): { shade: string; color: string }[] {
  const rgb = hexToRgb(hex);
  if (!rgb) return [];
  const [h, s, l] = rgbToHsl(...rgb);
  return [
    { shade: '50',  color: hslToHex(h, Math.max(s - 20, 5), 97) },
    { shade: '100', color: hslToHex(h, Math.max(s - 15, 8), 94) },
    { shade: '200', color: hslToHex(h, Math.max(s - 10, 10), 87) },
    { shade: '300', color: hslToHex(h, Math.max(s - 5, 15), 76) },
    { shade: '400', color: hslToHex(h, s, 64) },
    { shade: '500', color: hslToHex(h, s, l) },
    { shade: '600', color: hslToHex(h, Math.min(s + 5, 100), Math.max(l - 10, 8)) },
    { shade: '700', color: hslToHex(h, Math.min(s + 5, 100), Math.max(l - 20, 6)) },
    { shade: '800', color: hslToHex(h, Math.min(s + 3, 100), Math.max(l - 30, 4)) },
    { shade: '900', color: hslToHex(h, Math.min(s + 2, 100), Math.max(l - 40, 2)) },
  ];
}

export function relativeLuminance(r: number, g: number, b: number): number {
  const lin = (c: number) => {
    const v = c / 255;
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  };
  return 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
}

export function contrastRatio(hex1: string, hex2: string): number {
  const r1 = hexToRgb(hex1), r2 = hexToRgb(hex2);
  if (!r1 || !r2) return 1;
  const l1 = relativeLuminance(...r1), l2 = relativeLuminance(...r2);
  const [light, dark] = l1 > l2 ? [l1, l2] : [l2, l1];
  return parseFloat(((light + 0.05) / (dark + 0.05)).toFixed(2));
}

export function wcagLevel(ratio: number): { level: string; pass: boolean } {
  if (ratio >= 7)   return { level: 'AAA', pass: true };
  if (ratio >= 4.5) return { level: 'AA',  pass: true };
  if (ratio >= 3)   return { level: 'AA Large', pass: true };
  return { level: 'Fail', pass: false };
}

export const PALETTE_KEYS = [
  { key: 'brand_primary',    label: 'Primary',    cssVar: '--brand-primary' },
  { key: 'brand_secondary',  label: 'Secondary',  cssVar: '--brand-secondary' },
  { key: 'brand_accent',     label: 'Accent',     cssVar: '--brand-accent' },
  { key: 'brand_neutral',    label: 'Neutral',    cssVar: '--brand-neutral' },
  { key: 'brand_background', label: 'Background', cssVar: '--brand-background' },
] as const;
