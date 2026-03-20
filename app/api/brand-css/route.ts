import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(_req: NextRequest) {
  try {
    const db = getDb();
    const result = await db.execute("SELECT key, value FROM site_settings WHERE key LIKE 'brand_%'");

    const s: Record<string, string> = {};
    for (const row of result.rows) {
      if (row.key && row.value) s[row.key as string] = row.value as string;
    }

    const css = `:root {
  /* Brand colors — edit in ContentStudio Brand Hub */
  --brand-primary:    ${s.brand_primary    || '#000000'};
  --brand-secondary:  ${s.brand_secondary  || '#000000'};
  --brand-accent:     ${s.brand_accent     || '#000000'};
  --brand-neutral:    ${s.brand_neutral    || '#111827'};
  --brand-background: ${s.brand_background || '#ffffff'};

  /* Typography */
  --font-heading: '${s.brand_font_heading || 'Inter'}', sans-serif;
  --font-body:    '${s.brand_font_body    || 'Inter'}', sans-serif;

  /* Logos */
  --logo-primary:  ${s.brand_logo_primary  ? `url('${s.brand_logo_primary}')` : 'none'};
  --logo-reversed: ${s.brand_logo_reversed ? `url('${s.brand_logo_reversed}')` : 'none'};
  --logo-mark:     ${s.brand_logo_mark     ? `url('${s.brand_logo_mark}')` : 'none'};
}`;

    return new NextResponse(css, {
      headers: {
        'Content-Type': 'text/css; charset=utf-8',
        'Cache-Control': 'public, max-age=30, stale-while-revalidate=120',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET',
        'Vary': 'Accept-Encoding',
      },
    });
  } catch (err) {
    console.error('brand-css error:', err);
    return new NextResponse('/* error loading brand tokens */', {
      headers: { 'Content-Type': 'text/css' },
      status: 500,
    });
  }
}
