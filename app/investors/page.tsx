import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Investors",
  description:
    "NutraGLP Biosciences — a biotechnology platform for natural incretin modulation. $5.5M seed round. 40+ patent-pending formulations.",
  alternates: {
    canonical: "https://nutraglp.com/investors",
  },
  robots: {
    index: false,
    follow: true,
  },
};

export default function InvestorsPage() {
  return (
    <main className="inv-page">
      <style
        dangerouslySetInnerHTML={{
          __html: `
/* ═══════════════════ INVESTOR PAGE STYLES ═══════════════════ */

/* Hide site-wide layout header (direct child of body) */
body:has(.inv-page) > header {
  display: none !important;
}
/* Hide layout footer injected inside our page by nested layout */
.inv-page > footer {
  display: none !important;
}
/* Hide any layout nav that isn't ours */
body:has(.inv-page) > nav {
  display: none !important;
}

html { scroll-behavior: smooth; scroll-padding-top: 52px; }
.inv-page {
  --green-deep: #0f1e17;
  --green-dark: #162a20;
  --green-mid: #2d5040;
  --green-card: #1a3028;
  --gold: #c8962e;
  --gold-lt: #d4a94a;
  --inv-white: #ffffff;
  --cream: #f5f2eb;
  --cream-warm: #eae7e0;
  --ink: #1a1a18;
  --ink-mid: #3a3a36;
  --mist: #6b7280;
  --silver: #9ca3af;
  --rule: #e0ddd6;
  --rule-dark: rgba(255,255,255,0.08);
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  color: var(--ink);
  -webkit-font-smoothing: antialiased;
}

.inv-section { padding: 96px 0; }
.inv-inner { max-width: 1100px; margin: 0 auto; padding: 0 48px; box-sizing: border-box; }
.inv-eyebrow {
  font-size: 11px; font-weight: 600;
  letter-spacing: 0.14em; text-transform: uppercase;
  margin-bottom: 16px;
}
.inv-page h2 {
  font-family: 'Fraunces', Georgia, serif;
  font-size: clamp(28px, 3.4vw, 42px);
  font-weight: 400; line-height: 1.15;
  letter-spacing: -0.02em; margin-bottom: 24px;
  font-optical-sizing: auto;
}
.inv-page h2 em { font-style: italic; font-weight: 400; }
.inv-lead {
  font-size: 16px; font-weight: 400;
  line-height: 1.8; margin-bottom: 16px; max-width: 780px;
}
.inv-body {
  font-size: 15px; line-height: 1.8;
  margin-bottom: 16px; max-width: 780px;
}

/* Light section defaults */
.inv-light { background: var(--cream); }
.inv-light h2 { color: var(--ink); }
.inv-light h2 em { color: var(--gold); }
.inv-light .inv-eyebrow { color: var(--green-mid); }
.inv-light .inv-lead { color: var(--ink-mid); }
.inv-light .inv-body { color: var(--mist); }

/* Dark section defaults */
.inv-dark { background: var(--green-deep); }
.inv-dark h2 { color: #fff; }
.inv-dark h2 em { color: var(--gold-lt); }
.inv-dark .inv-eyebrow { color: var(--gold); }
.inv-dark .inv-lead { color: rgba(255,255,255,0.5); }
.inv-dark .inv-body { color: rgba(255,255,255,0.45); }

/* ═══════════════════ NAV ═══════════════════ */
.inv-nav {
  position: sticky; top: 0; z-index: 80;
  background: var(--green-deep);
  border-bottom: 1px solid rgba(255,255,255,0.06);
}
.inv-nav-inner {
  max-width: 1200px; margin: 0 auto;
  padding: 0 48px; box-sizing: border-box;
  display: flex; align-items: center;
  justify-content: space-between;
  height: 48px;
}
.inv-nav-logo {
  display: flex; align-items: center;
  text-decoration: none;
}
.inv-nav-logo img {
  height: 32px; width: auto;
}
.inv-nav-links {
  display: flex; align-items: center; gap: 32px;
  list-style: none; margin: 0; padding: 0;
}
.inv-nav-links a {
  font-size: 11px; font-weight: 600;
  letter-spacing: 0.1em; text-transform: uppercase;
  color: rgba(255,255,255,0.45);
  text-decoration: none; transition: color 0.2s;
  white-space: nowrap;
}
.inv-nav-links a:hover { color: #fff; }
.inv-nav-cta {
  display: inline-flex; align-items: center; gap: 6px;
  background: transparent; color: var(--gold);
  padding: 7px 18px; border-radius: 3px;
  font-size: 11px; font-weight: 700;
  letter-spacing: 0.06em; text-transform: uppercase;
  text-decoration: none; transition: all 0.2s;
  border: 1px solid var(--gold);
}
.inv-nav-cta:hover { background: var(--gold); color: var(--green-deep); }

/* ═══════════════════ HERO ═══════════════════ */
.inv-hero {
  background: var(--green-deep);
  padding: 140px 0 120px;
  position: relative; overflow: hidden;
  text-align: center;
}
.inv-hero::before {
  content: ''; position: absolute; inset: 0;
  background:
    radial-gradient(ellipse 60% 50% at 50% 30%, rgba(45,80,64,0.25) 0%, transparent 70%);
  pointer-events: none;
}
.inv-hero-inner {
  max-width: 900px; margin: 0 auto;
  padding: 0 48px; box-sizing: border-box;
  position: relative;
}
.inv-hero-eyebrow {
  font-size: 11px; font-weight: 600;
  letter-spacing: 0.18em; text-transform: uppercase;
  color: rgba(255,255,255,0.4); margin-bottom: 36px;
  display: flex; align-items: center; justify-content: center; gap: 16px;
}
.inv-hero-eyebrow::before, .inv-hero-eyebrow::after {
  content: ''; width: 40px; height: 1px;
  background: rgba(255,255,255,0.15);
}
.inv-hero h1 {
  font-family: 'Fraunces', Georgia, serif;
  font-size: clamp(36px, 4.8vw, 58px);
  font-weight: 400; line-height: 1.12;
  letter-spacing: -0.02em; color: #fff;
  margin-bottom: 28px;
  font-optical-sizing: auto;
}
.inv-hero h1 em { font-style: italic; font-weight: 400; color: var(--gold-lt); }
.inv-hero-sub {
  font-size: 16px; font-weight: 400;
  color: rgba(255,255,255,0.45);
  max-width: 620px; margin: 0 auto 48px;
  line-height: 1.75;
}
.inv-hero-ctas {
  display: flex; align-items: center;
  justify-content: center;
  gap: 16px;
}
.inv-btn-gold {
  display: inline-flex; align-items: center; gap: 8px;
  background: var(--gold); color: var(--green-deep);
  padding: 13px 28px; border-radius: 3px;
  font-size: 12px; font-weight: 700;
  letter-spacing: 0.06em; text-transform: uppercase;
  text-decoration: none; transition: all 0.2s;
  border: none; cursor: pointer;
}
.inv-btn-gold:hover { background: var(--gold-lt); transform: translateY(-1px); }
.inv-btn-outline {
  display: inline-flex; align-items: center; gap: 8px;
  background: transparent; color: rgba(255,255,255,0.55);
  padding: 13px 28px; border-radius: 3px;
  font-size: 12px; font-weight: 500;
  letter-spacing: 0.02em;
  text-decoration: none; transition: all 0.2s;
  border: 1px solid rgba(255,255,255,0.15);
}
.inv-btn-outline:hover { border-color: rgba(255,255,255,0.35); color: #fff; }

/* ═══════════════════ CREDENTIAL STRIP ═══════════════════ */
.inv-cred-strip {
  background: var(--green-dark); padding: 24px 0;
  border-top: 1px solid rgba(255,255,255,0.06);
  border-bottom: 1px solid rgba(255,255,255,0.06);
}
.inv-cred-inner {
  max-width: 1100px; margin: 0 auto; padding: 0 48px;
  box-sizing: border-box;
  display: flex; align-items: center; justify-content: space-between;
}
.inv-cred-item { text-align: center; flex: 1; }
.inv-cred-item:not(:last-child) { border-right: 1px solid rgba(255,255,255,0.06); }
.inv-cred-num {
  font-family: 'Fraunces', Georgia, serif;
  font-size: 26px; font-weight: 400;
  color: var(--gold-lt); line-height: 1;
  font-optical-sizing: auto;
}
.inv-cred-lbl {
  font-size: 9px; font-weight: 700;
  letter-spacing: 0.1em; text-transform: uppercase;
  color: rgba(255,255,255,0.3); margin-top: 6px;
}

/* ═══════════════════ PLATFORM SECTION ═══════════════════ */
.inv-plat-grid {
  display: grid; grid-template-columns: repeat(3, 1fr);
  gap: 0; margin-top: 48px;
  border-radius: 6px; overflow: hidden;
}
.inv-plat-card {
  padding: 36px 28px; background: var(--green-card);
  border-right: 1px solid rgba(255,255,255,0.06);
}
.inv-plat-card:last-child { border-right: none; }
.inv-plat-num {
  font-family: 'Fraunces', Georgia, serif;
  font-size: 40px; font-weight: 400;
  color: rgba(255,255,255,0.12); line-height: 1; margin-bottom: 18px;
  font-optical-sizing: auto;
}
.inv-plat-card h3 {
  font-size: 15px; font-weight: 700;
  color: #fff; margin-bottom: 12px;
  line-height: 1.3;
}
.inv-plat-card p { font-size: 13px; color: rgba(255,255,255,0.5); line-height: 1.7; margin: 0; }

.inv-pathway-chips { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 32px; }
.inv-pathway-chip {
  font-size: 11px; font-weight: 500; letter-spacing: 0.02em;
  padding: 6px 14px; border-radius: 3px;
  background: transparent;
  border: 1px solid var(--rule);
  color: var(--ink-mid);
}

.inv-platform-note {
  margin-top: 32px; font-size: 13px; font-style: italic;
  color: var(--mist); line-height: 1.7; max-width: 700px;
}

/* ═══════════════════ CLINICAL STATS ═══════════════════ */
.inv-clinical-stats {
  display: grid; grid-template-columns: repeat(5, 1fr);
  gap: 0; margin-top: 48px;
  border-radius: 6px; overflow: hidden;
}
.inv-clin-stat {
  padding: 36px 20px; text-align: center;
  background: var(--green-mid);
  border-right: 1px solid rgba(255,255,255,0.08);
}
.inv-clin-stat:last-child { border-right: none; }
.inv-clin-val {
  font-family: 'Fraunces', Georgia, serif;
  font-size: 34px; font-weight: 400;
  color: #fff; line-height: 1;
  font-optical-sizing: auto;
}
.inv-clin-lbl {
  font-size: 9px; font-weight: 700;
  letter-spacing: 0.08em; text-transform: uppercase;
  color: rgba(255,255,255,0.55);
  margin-top: 10px; line-height: 1.5;
}
.inv-clin-note {
  margin-top: 32px; font-size: 13px; font-style: italic;
  color: rgba(255,255,255,0.3); line-height: 1.7; max-width: 780px;
}

/* ═══════════════════ IP CARDS ═══════════════════ */
.inv-ip-grid {
  display: grid; grid-template-columns: repeat(4, 1fr);
  gap: 16px; margin-top: 48px;
}
.inv-ip-card {
  background: var(--inv-white); border: 1px solid var(--rule);
  border-radius: 6px; padding: 32px 24px;
}
.inv-ip-num {
  font-family: 'Fraunces', Georgia, serif;
  font-size: 13px; font-weight: 600;
  color: var(--gold); margin-bottom: 12px;
}
.inv-ip-card h4 {
  font-family: 'Fraunces', Georgia, serif;
  font-size: 16px; font-weight: 500;
  color: var(--ink); margin-bottom: 8px;
}
.inv-ip-card p { font-size: 13px; color: var(--mist); line-height: 1.65; margin: 0; }

/* ═══════════════════ COMPETITIVE TABLE ═══════════════════ */
.inv-comp-tbl {
  width: 100%; border-collapse: collapse;
  margin-top: 48px; font-size: 14px;
}
.inv-comp-tbl th {
  font-size: 10px; font-weight: 700;
  letter-spacing: 0.08em; text-transform: uppercase;
  padding: 14px 20px; text-align: left;
  border-bottom: 1px solid rgba(255,255,255,0.1);
}
.inv-comp-tbl th:first-child { color: transparent; }
.inv-comp-tbl th.inv-nutra-th { color: var(--gold); }
.inv-comp-tbl th.inv-comp-th { color: rgba(255,255,255,0.35); }
.inv-comp-tbl td {
  padding: 14px 20px; color: rgba(255,255,255,0.45);
  border-bottom: 1px solid rgba(255,255,255,0.05);
  vertical-align: top; line-height: 1.5;
}
.inv-comp-tbl tr:last-child td { border-bottom: none; }
.inv-comp-tbl td:first-child {
  font-size: 10px; font-weight: 700;
  letter-spacing: 0.08em; text-transform: uppercase;
  color: rgba(255,255,255,0.3); white-space: nowrap;
  vertical-align: middle;
}
.inv-comp-tbl td.inv-nutra-td { color: var(--gold); font-weight: 600; }
.inv-comp-note {
  margin-top: 28px; font-size: 12px; font-style: italic;
  color: rgba(255,255,255,0.25); line-height: 1.7; max-width: 780px;
}

/* ═══════════════════ PRODUCT CARDS ═══════════════════ */
.inv-product-lead {
  margin-top: 48px; padding: 44px;
  background: var(--inv-white);
  border: 1px solid var(--rule); border-radius: 6px;
  display: grid; grid-template-columns: 1fr 1fr; gap: 48px;
}
.inv-product-badge {
  display: inline-block;
  font-size: 10px; font-weight: 700;
  letter-spacing: 0.08em; text-transform: uppercase;
  padding: 5px 14px; border-radius: 3px;
  border: 1px solid var(--rule);
  color: var(--ink-mid); margin-bottom: 20px;
}
.inv-product-lead h3 {
  font-family: 'Fraunces', Georgia, serif;
  font-size: 28px; font-weight: 400;
  color: var(--ink); margin-bottom: 6px;
  font-optical-sizing: auto;
}
.inv-product-subtitle {
  font-size: 14px; font-weight: 600;
  color: var(--green-mid); margin-bottom: 16px;
}
.inv-product-lead p { font-size: 14px; color: var(--mist); line-height: 1.7; margin-bottom: 20px; }
.inv-product-meta { font-size: 14px; color: var(--ink-mid); line-height: 1.8; }
.inv-product-meta strong { font-weight: 600; color: var(--ink); }
.inv-product-advantages h4 { font-size: 14px; font-weight: 700; color: var(--ink); margin-bottom: 12px; }
.inv-product-advantages p {
  font-size: 14px; color: var(--green-mid); line-height: 2;
  margin: 0;
}

.inv-pipe-grid {
  display: grid; grid-template-columns: repeat(2, 1fr);
  gap: 0; margin-top: 24px;
  border-top: 1px solid var(--rule);
}
.inv-pipe-card {
  padding: 32px 0;
  border-bottom: 1px solid var(--rule);
}
.inv-pipe-card:nth-child(odd) { padding-right: 32px; border-right: 1px solid var(--rule); }
.inv-pipe-card:nth-child(even) { padding-left: 32px; }
.inv-pipe-card.inv-pipe-full { grid-column: 1; padding-right: 32px; border-right: 1px solid var(--rule); }
.inv-pipe-when {
  display: inline-block;
  font-size: 10px; font-weight: 700;
  letter-spacing: 0.08em; text-transform: uppercase;
  padding: 4px 12px; border-radius: 3px;
  border: 1px solid var(--rule);
  color: var(--green-mid); margin-bottom: 12px;
}
.inv-pipe-name {
  font-family: 'Fraunces', Georgia, serif;
  font-size: 22px; font-weight: 400;
  color: var(--ink); margin-bottom: 6px;
  font-optical-sizing: auto;
}
.inv-pipe-subtitle {
  font-size: 14px; font-weight: 600;
  color: var(--green-mid); margin-bottom: 12px;
}
.inv-pipe-card p { font-size: 14px; color: var(--mist); line-height: 1.7; margin: 0; }

/* ═══════════════════ MARKET STATS ═══════════════════ */
.inv-mkt-stat-row {
  padding: 40px 0;
  border-bottom: 1px solid rgba(255,255,255,0.06);
  display: grid; grid-template-columns: 200px 1fr; gap: 40px;
  align-items: start;
}
.inv-mkt-stat-row:last-child { border-bottom: none; }
.inv-mkt-num {
  font-family: 'Fraunces', Georgia, serif;
  font-size: 42px; font-weight: 400;
  color: var(--gold-lt); line-height: 1;
  font-optical-sizing: auto;
}
.inv-mkt-label { font-size: 15px; font-weight: 700; color: #fff; margin-bottom: 8px; }
.inv-mkt-desc { font-size: 14px; color: rgba(255,255,255,0.45); line-height: 1.7; }

/* Published brief */
.inv-brief-section {
  margin-top: 80px; padding-top: 48px;
  border-top: 1px solid rgba(255,255,255,0.08);
}
.inv-brief-row {
  display: flex; align-items: center; justify-content: space-between; gap: 48px;
}
.inv-brief-title {
  font-family: 'Fraunces', Georgia, serif;
  font-size: 22px; font-weight: 400;
  color: rgba(255,255,255,0.6); line-height: 1.3;
  margin-bottom: 8px; font-optical-sizing: auto;
}
.inv-brief-author { font-size: 13px; color: rgba(255,255,255,0.3); }
.inv-btn-gold-outline {
  display: inline-flex; align-items: center; gap: 8px;
  background: transparent; color: var(--gold);
  padding: 12px 24px; border-radius: 3px;
  font-size: 12px; font-weight: 700;
  letter-spacing: 0.06em; text-transform: uppercase;
  text-decoration: none; transition: all 0.2s;
  border: 1px solid var(--gold); white-space: nowrap;
}
.inv-btn-gold-outline:hover { background: var(--gold); color: var(--green-deep); }

/* ═══════════════════ LEADERSHIP ═══════════════════ */
.inv-leader-grid {
  display: grid; grid-template-columns: 1fr 1fr; gap: 64px; margin-top: 48px;
}
.inv-leader-name {
  font-family: 'Fraunces', Georgia, serif;
  font-size: 34px; font-weight: 400;
  color: var(--ink); line-height: 1.15; margin-bottom: 8px;
  font-optical-sizing: auto;
}
.inv-leader-title { font-size: 13px; font-weight: 600; color: var(--green-mid); margin-bottom: 24px; text-decoration: underline; text-underline-offset: 3px; }
.inv-leader-bio { font-size: 15px; color: var(--ink-mid); line-height: 1.8; margin-bottom: 24px; }

.inv-credential {
  padding: 20px 24px; margin-bottom: 12px;
  background: rgba(200,150,46,0.06); border-radius: 4px;
  border-left: 3px solid var(--gold);
}
.inv-credential h4 { font-size: 14px; font-weight: 700; color: var(--ink); margin-bottom: 4px; }
.inv-credential p { font-size: 13px; color: var(--mist); line-height: 1.6; margin: 0; }

.inv-leader-right { padding-top: 160px; }
.inv-leader-quote {
  font-family: 'Fraunces', Georgia, serif;
  font-size: 18px; font-weight: 400; font-style: italic;
  color: var(--ink-mid); line-height: 1.6;
  padding-bottom: 32px; margin-bottom: 32px;
  border-bottom: 1px solid var(--rule);
  font-optical-sizing: auto;
}

.inv-track-row {
  display: grid; grid-template-columns: 140px 1fr; gap: 20px;
  padding: 16px 0;
  border-bottom: 1px solid var(--rule);
}
.inv-track-row:last-child { border-bottom: none; }
.inv-track-name {
  font-family: 'Fraunces', Georgia, serif;
  font-size: 17px; font-weight: 400;
  color: var(--ink); font-optical-sizing: auto;
}
.inv-track-desc { font-size: 13px; color: var(--mist); line-height: 1.6; }

/* ═══════════════════ CONTACT ═══════════════════ */
.inv-contact-email {
  font-family: 'Fraunces', Georgia, serif;
  font-size: 22px; font-weight: 400;
  color: var(--gold-lt); text-decoration: none;
  transition: color 0.2s; font-optical-sizing: auto;
}
.inv-contact-email:hover { color: var(--gold); }
.inv-contact-divider {
  width: 1px; height: 40px;
  background: rgba(255,255,255,0.15);
  margin: 20px auto;
}
.inv-contact-phone {
  font-size: 15px; color: rgba(255,255,255,0.4);
  letter-spacing: 0.04em;
}
.inv-contact-location {
  font-size: 13px; color: rgba(255,255,255,0.3);
  margin-top: 32px;
}
.inv-contact-footer {
  font-size: 13px; font-style: italic;
  color: rgba(255,255,255,0.25); line-height: 1.7;
  max-width: 600px; margin: 12px auto 0; text-align: center;
}

/* ═══════════════════ DISCLAIMER ═══════════════════ */
.inv-disclaimer {
  background: var(--green-dark); padding: 40px 48px;
  border-top: 1px solid rgba(255,255,255,0.06);
}
.inv-disclaimer-inner { max-width: 780px; margin: 0 auto; text-align: center; }
.inv-disclaimer p {
  font-size: 12px; color: rgba(255,255,255,0.3);
  line-height: 1.8; margin: 0;
}

/* ═══════════════════ ANIMATIONS ═══════════════════ */
@keyframes invFadeUp {
  from { opacity: 0; transform: translateY(20px); }
  to   { opacity: 1; transform: translateY(0); }
}
.inv-hero-inner > * { animation: invFadeUp 0.65s ease both; }
.inv-hero-eyebrow  { animation-delay: 0.05s; }
.inv-hero h1       { animation-delay: 0.12s; }
.inv-hero-sub      { animation-delay: 0.2s; }
.inv-hero-ctas     { animation-delay: 0.26s; }

/* ═══════════════════ RESPONSIVE ═══════════════════ */
@media (max-width: 900px) {
  .inv-section { padding: 64px 0; }
  .inv-inner { padding: 0 24px; }
  .inv-hero-inner { padding: 0 24px; }
  .inv-hero { padding: 96px 0 72px; }
  .inv-nav-inner { padding: 0 16px; height: 44px; }
  .inv-nav-links { gap: 16px; overflow-x: auto; -webkit-overflow-scrolling: touch; }
  .inv-nav-links a { font-size: 10px; }
  .inv-nav-cta { font-size: 10px; padding: 6px 14px; }
  .inv-cred-inner { flex-wrap: wrap; gap: 16px; padding: 0 24px; }
  .inv-cred-item:not(:last-child) { border-right: none; }
  .inv-plat-grid { grid-template-columns: 1fr; }
  .inv-plat-card { border-right: none; border-bottom: 1px solid rgba(255,255,255,0.06); }
  .inv-plat-card:last-child { border-bottom: none; }
  .inv-clinical-stats { grid-template-columns: repeat(2, 1fr); }
  .inv-clin-stat:nth-child(5) { grid-column: span 2; }
  .inv-ip-grid { grid-template-columns: 1fr 1fr; }
  .inv-comp-tbl { font-size: 12px; }
  .inv-comp-tbl th, .inv-comp-tbl td { padding: 10px 12px; }
  .inv-product-lead { grid-template-columns: 1fr; gap: 32px; }
  .inv-pipe-grid { grid-template-columns: 1fr; }
  .inv-pipe-card:nth-child(odd) { padding-right: 0; border-right: none; }
  .inv-pipe-card:nth-child(even) { padding-left: 0; }
  .inv-pipe-card.inv-pipe-full { padding-right: 0; border-right: none; }
  .inv-mkt-stat-row { grid-template-columns: 1fr; gap: 12px; }
  .inv-brief-row { flex-direction: column; align-items: flex-start; }
  .inv-leader-grid { grid-template-columns: 1fr; gap: 48px; }
  .inv-leader-right { padding-top: 0; }
  .inv-track-row { grid-template-columns: 1fr; gap: 4px; }
  .inv-disclaimer { padding: 28px 24px; }
}
          `,
        }}
      />

{/* ═══ NAV ═══ */}
      <nav className="inv-nav">
        <div className="inv-nav-inner">
          <a href="#" className="inv-nav-logo"><img src="/nutraglp-logo.svg" alt="NutraGLP Biosciences" /></a>
          <ul className="inv-nav-links">
            <li><a href="#platform">Platform</a></li>
            <li><a href="#clinical">Clinical</a></li>
            <li><a href="#ip">IP</a></li>
            <li><a href="#market">Market</a></li>
            <li><a href="#leadership">Leadership</a></li>
            <li><a href="#contact">Contact</a></li>
          </ul>
          <a href={"mailto:info@nutraglpbio.com?bcc=richard@nutrglpbio.com,chris@nutraglpbio.com&subject=Send%20me%20the%20brief"} className="inv-nav-cta inv-mailto"</a>
        </div>
      </nav>

{/* ▓▓▓ HERO ▓▓▓ */}
      <section className="inv-hero">
        <div className="inv-hero-inner">
          <p className="inv-hero-eyebrow">NutraGLP&reg; Biosciences</p>
          <h1>A new class of<br /><em>Bioactive Signaling Molecules</em><br />for metabolic health</h1>
          <p className="inv-hero-sub">A patented, non-pharmaceutical biotechnology platform that restores endogenous incretin signaling through coordinated multi-pathway activation. Drug-level biology. Consumer-scale distribution. No prescription. No injection.</p>
          <div className="inv-hero-ctas">
            <a href={"mailto:info@nutraglpbio.com?bcc=richard@nutrglpbio.com,chris@nutraglpbio.com&subject=Send%20me%20the%20brief"} className="inv-btn-gold inv-mailto"</a>
            <a href="#platform" className="inv-btn-outline">Explore the Platform</a>
          </div>
        </div>
      </section>

{/* ░░░ THE PLATFORM ░░░ */}
      <section className="inv-section inv-light" id="platform">
        <div className="inv-inner">
          <p className="inv-eyebrow">The Platform</p>
          <h2>NutraGLP&reg; Sync &mdash;<br /><em>three mechanisms. One coordinated system.</em></h2>
          <p className="inv-lead">GLP-1 drugs validated incretin biology and built a $132B market. They also created a structural problem no one has solved. When patients stop the drug &mdash; and more than 50% do within 12 months &mdash; the endogenous incretin signaling system collapses. The weight returns. The metabolic gains reverse. Not because of behavior. Because of biology.</p>
          <p className="inv-body">NutraGLP&reg; Sync is a patented, non-pharmaceutical method for restoring that signaling &mdash; combining natural GLP-1 and GIP secretagogues with DPP-4 inhibition across coordinated downstream metabolic pathways. Delivered as GRAS-certified consumer products. No prescription. No injection. No pharmaceutical supply chain dependency.</p>
          <div className="inv-plat-grid">
            <div className="inv-plat-card">
              <div className="inv-plat-num">01</div>
              <h3>Endogenous Incretin Stimulation</h3>
              <p>Natural GLP-1 and GIP secretagogues stimulate endogenous incretin release directly from L-cells and K-cells in the gut &mdash; preserving meal-linked, pulsatile signaling within physiological ranges rather than imposing supraphysiologic receptor overstimulation</p>
            </div>
            <div className="inv-plat-card">
              <div className="inv-plat-num">02</div>
              <h3>DPP-4 Inhibition &mdash; The Gating Variable</h3>
              <p>Natural DPP-4 inhibitors protect the endogenous incretin signal from enzymatic degradation &mdash; extending biological half-life and enabling meaningful downstream metabolic effects. The reason prior non-pharmaceutical incretin strategies failed: they stimulated without protecting</p>
            </div>
            <div className="inv-plat-card">
              <div className="inv-plat-num">03</div>
              <h3>Coordinated Multi-Pathway Downstream Activation</h3>
              <p>Preserved incretin signaling at sufficient amplitude activates a coordinated cascade across 13 validated metabolic targets. These mechanisms are synergistic, not additive &mdash; producing durable metabolic remodeling, not temporary appetite suppression</p>
            </div>
          </div>
          <div className="inv-pathway-chips">
            <span className="inv-pathway-chip">GLP-1 / GIP / DPP-4</span>
            <span className="inv-pathway-chip">AMPK</span>
            <span className="inv-pathway-chip">PI3K-AKT</span>
            <span className="inv-pathway-chip">MAPK / p38</span>
            <span className="inv-pathway-chip">mTOR</span>
            <span className="inv-pathway-chip">NF-&kappa;B / JNK / IKK&beta;</span>
            <span className="inv-pathway-chip">PPAR &alpha;/&gamma;/&delta;</span>
            <span className="inv-pathway-chip">Adipokine Signaling</span>
            <span className="inv-pathway-chip">TGF-&beta; / SMAD3</span>
            <span className="inv-pathway-chip">Wnt / &beta;-Catenin</span>
            <span className="inv-pathway-chip">Hedgehog</span>
            <span className="inv-pathway-chip">cGMP / PKG</span>
            <span className="inv-pathway-chip">IRS / Insulin Signaling</span>
          </div>
          <p className="inv-platform-note">The preserved incretin signal is the coordinating backbone that enables the downstream network to activate coherently &mdash; restoring metabolic signaling fidelity within physiological constraints rather than imposing pharmacologic override. Supported by a reference library of 200+ peer-reviewed publications. Full scientific monograph available upon request.</p>
        </div>
      </section>

{/* ▓▓▓ CLINICAL EVIDENCE ▓▓▓ */}
      <section className="inv-section inv-dark" id="clinical">
        <div className="inv-inner">
          <p className="inv-eyebrow">Clinical Evidence</p>
          <h2>Proof of concept.<br /><em>503 participants. Six months.</em></h2>
          <p className="inv-lead">An observational evaluation of a licensed NutraGLP&reg; formulation containing endogenous GLP-1 and GIP secretagogues, natural DPP-4 inhibitors, and thermogenic compounds produced measurable weight-loss outcomes with a favorable tolerability profile across 503 participants over six months.</p>
          <div className="inv-clinical-stats">
            <div className="inv-clin-stat"><div className="inv-clin-val">14.1%</div><div className="inv-clin-lbl">Average Weight Loss<br />at 6 Months</div></div>
            <div className="inv-clin-stat"><div className="inv-clin-val">&lt;5%</div><div className="inv-clin-lbl">Adverse Effect Rate<br />&mdash; All Mild</div></div>
            <div className="inv-clin-stat"><div className="inv-clin-val">0</div><div className="inv-clin-lbl">Serious Adverse<br />Events</div></div>
            <div className="inv-clin-stat"><div className="inv-clin-val">503</div><div className="inv-clin-lbl">Participants<br />Observed</div></div>
            <div className="inv-clin-stat"><div className="inv-clin-val">0%</div><div className="inv-clin-lbl">Muscle or Collagen<br />Loss Reported</div></div>
          </div>
          <p className="inv-clin-note">Observational outcomes from a licensed NutraGLP&reg; formulation under real-world conditions. Non-randomized study design. Adverse events captured via participant self-report. Findings are hypothesis-generating and should be interpreted accordingly. Controlled clinical trials are planned. Scientific brief and full reference library available upon request.</p>
        </div>
      </section>

{/* ░░░ INTELLECTUAL PROPERTY ░░░ */}
      <section className="inv-section inv-light" id="ip">
        <div className="inv-inner">
          <p className="inv-eyebrow">Intellectual Property</p>
          <h2>Platform-level IP.<br /><em>Not ingredient-level.</em></h2>
          <p className="inv-lead">Three layers of compounding protection. A competitor cannot replicate the platform by copying a single formulation &mdash; they would need to independently develop all three.</p>
          <div className="inv-ip-grid">
            <div className="inv-ip-card">
              <div className="inv-ip-num">01 &mdash; Formulation</div>
              <h4>40+ Patent-Pending</h4>
              <p>Methods combining natural GLP-1/GIP secretagogues with DPP-4 inhibitors. Cell-signaling pathway compositions for weight loss and glucose regulation. Each independently defensible.</p>
            </div>
            <div className="inv-ip-card">
              <div className="inv-ip-num">02 &mdash; Delivery</div>
              <h4>8&times; Bioavailability</h4>
              <p>Proprietary nanoemulsion system protected independently. Developed over two decades of nano-encapsulation research. The delivery platform is the second moat.</p>
            </div>
            <div className="inv-ip-card">
              <div className="inv-ip-num">03 &mdash; Architecture</div>
              <h4>13 Signaling Targets</h4>
              <p>The coordinated multi-pathway activation model itself is the invention. Which pathways, what combination, what timing. Proprietary knowledge.</p>
            </div>
            <div className="inv-ip-card">
              <div className="inv-ip-num">04 &mdash; Geography</div>
              <h4>24+ Countries</h4>
              <p>Patent protection covering nanoparticle delivery systems for nutraceutical and pharmaceutical biotechnology applications. Frost &amp; Sullivan Innovation Award.</p>
            </div>
          </div>
        </div>
      </section>

{/* ▓▓▓ COMPETITIVE POSITIONING ▓▓▓ */}
      <section className="inv-section inv-dark" id="competitive">
        <div className="inv-inner">
          <p className="inv-eyebrow">Competitive Positioning</p>
          <h2>Same biology.<br /><em>Different model entirely.</em></h2>
          <p className="inv-lead">NutraGLP&reg; Sync occupies a structural gap that pharmaceutical GLP-1 drugs and conventional nutraceuticals both fail to fill &mdash; incretin-level biology delivered without pharmaceutical constraints, injectable delivery, or prescription dependency.</p>
          <table className="inv-comp-tbl">
            <thead><tr>
              <th></th>
              <th className="inv-nutra-th">NutraGLP&reg; Slim Shot</th>
              <th className="inv-comp-th">Semaglutide</th>
              <th className="inv-comp-th">Tirzepatide</th>
            </tr></thead>
            <tbody>
              <tr><td>Monthly Cost</td><td className="inv-nutra-td">$145</td><td>$900 &ndash; $1,100</td><td>$1,000 &ndash; $1,300</td></tr>
              <tr><td>Delivery Format</td><td className="inv-nutra-td">Oral &mdash; nanoemulsion</td><td>Weekly injection</td><td>Weekly injection</td></tr>
              <tr><td>Prescription Required</td><td className="inv-nutra-td">No</td><td>Yes</td><td>Yes</td></tr>
              <tr><td>Adverse Effect Rate</td><td className="inv-nutra-td">&lt;5% (all mild)</td><td>&gt;80% (mild to severe)</td><td>&gt;80% (mild to severe)</td></tr>
              <tr><td>Avg. Weight Loss (6 mo.)</td><td className="inv-nutra-td">14.1%*</td><td>5.8%</td><td>10.1%</td></tr>
              <tr><td>Muscle / Collagen Loss</td><td className="inv-nutra-td">Not observed</td><td>Documented</td><td>Documented</td></tr>
              <tr><td>DPP-4 Inhibition</td><td className="inv-nutra-td">Yes &mdash; core mechanism</td><td>No</td><td>No</td></tr>
              <tr><td>Multi-Pathway Coordination</td><td className="inv-nutra-td">13 validated targets</td><td>Single receptor axis</td><td>Dual receptor axis</td></tr>
            </tbody>
          </table>
          <p className="inv-comp-note">*Observational outcomes from a licensed NutraGLP&reg; formulation. Non-randomized study design. Not a head-to-head comparison. Controlled clinical trials planned as the primary use of investment proceeds.</p>
        </div>
      </section>

{/* ░░░ PRODUCT PLATFORM ░░░ */}
      <section className="inv-section inv-light" id="products">
        <div className="inv-inner">
          <p className="inv-eyebrow">Product Platform</p>
          <h2>One platform.<br /><em>Multiple product formats.</em></h2>
          <p className="inv-lead">Every product in the NutraGLP&reg; pipeline runs on the same patented signaling architecture. One R&amp;D investment. Multiple revenue streams. Multiple form factors. The platform deploys across consumer, telehealth, physician-directed, and retail pharmacy adjacent channels without altering the underlying biological architecture.</p>

          <div className="inv-product-lead">
            <div>
              <div className="inv-product-badge">Lead Product &mdash; Launch Ready</div>
              <h3>NutraGLP&reg; Slim SHOT</h3>
              <div className="inv-product-subtitle">Daily Nanoemulsion &mdash; GLP-1/GIP Amplification Platform</div>
              <p>The first product delivered on the NutraGLP&reg; Sync platform. A 60ml daily nanoemulsion combining GLP-1 and GIP secretagogues, natural DPP-4 inhibitors, and thermogenic compounds in a proprietary delivery system engineered for superior bioavailability.</p>
              <div className="inv-product-meta">
                <strong>Format:</strong> 30ml AM + 30ml PM<br />
                <strong>Price:</strong> $145/month<br />
                <strong>Gross Margin:</strong> 75%+<br />
                <strong>Channel:</strong> D2C subscription, telehealth integration, physician-directed
              </div>
            </div>
            <div className="inv-product-advantages">
              <h4>Platform advantages:</h4>
              <p>No prescription required<br />
              No injection &mdash; oral consumer format<br />
              GRAS-certified ingredients<br />
              Scalable across direct, telehealth, and retail channels<br />
              Compatible with GLP-1 drug step-down protocols<br />
              Lean tissue preservation &mdash; zero muscle or collagen loss observed<br />
              75%+ gross margin at launch price</p>
            </div>
          </div>

          <div className="inv-pipe-grid">
            <div className="inv-pipe-card">
              <div className="inv-pipe-when">2026</div>
              <div className="inv-pipe-name">GLP-1 Sweetener</div>
              <div className="inv-pipe-subtitle">Incretin-Activating Zero-Calorie Sweetener</div>
              <p>The platform in its most accessible daily-use format. The first zero-calorie sweetener with documented incretin biology. Mass-market daily use and broad distribution potential.</p>
            </div>
            <div className="inv-pipe-card">
              <div className="inv-pipe-when">2026</div>
              <div className="inv-pipe-name">ThermoGEN</div>
              <div className="inv-pipe-subtitle">Thermogenic Energy &amp; Performance Format</div>
              <p>GLP pathway activation delivered as thermogenic energy drink and performance gel. Targets the active wellness and sports nutrition market.</p>
            </div>
            <div className="inv-pipe-card inv-pipe-full">
              <div className="inv-pipe-when">2027</div>
              <div className="inv-pipe-name">GLP-1 Protein</div>
              <div className="inv-pipe-subtitle">High-Protein Metabolic Health Formulation</div>
              <p>High-protein formulation with GLP-1 and GIP benefits. Addresses lean mass preservation &mdash; the key clinical distinction from pharmaceutical GLP-1 drugs that produce documented muscle and collagen loss.</p>
            </div>
          </div>
        </div>
      </section>

{/* ▓▓▓ MARKET OPPORTUNITY ▓▓▓ */}
      <section className="inv-section inv-dark" id="market">
        <div className="inv-inner">
          <p className="inv-eyebrow">Market Opportunity</p>
          <h2>$132B market.<br /><em>No platform-level entrant.</em></h2>
          <p className="inv-lead">GLP-1 drugs built one of the fastest-growing categories in the history of metabolic health. They validated the biology and created the demand. NutraGLP&reg; Sync extends that biology into the 200 million patient market that pharmaceutical delivery cannot reach &mdash; without prescription constraints, injectable delivery, or pharmaceutical supply chain dependency.</p>

          <div className="inv-mkt-stat-row">
            <div className="inv-mkt-num">$132B</div>
            <div>
              <div className="inv-mkt-label">Total Addressable Market</div>
              <div className="inv-mkt-desc">Global GLP-1/GIP and weight-loss market. Metabolic signaling biology extends into diabetes management, cardiovascular health, and longevity medicine &mdash; adjacent markets of comparable scale.</div>
            </div>
          </div>
          <div className="inv-mkt-stat-row">
            <div className="inv-mkt-num">$21B</div>
            <div>
              <div className="inv-mkt-label">Serviceable Addressable Market</div>
              <div className="inv-mkt-desc">GLP-1 discontinuers seeking effective alternatives, plus consumers spending $150+/month on weight-loss products &mdash; a population that pharmaceutical delivery structurally excludes.</div>
            </div>
          </div>
          <div className="inv-mkt-stat-row">
            <div className="inv-mkt-num">130M+</div>
            <div>
              <div className="inv-mkt-label">Underserved U.S. Adults</div>
              <div className="inv-mkt-desc">Adults with overweight or obesity who cannot afford ($900&ndash;$1300/month), tolerate (70%+ adverse effect rate), or access pharmaceutical GLP-1 therapy. The space between pharma and supplements is structurally empty. NutraGLP&reg; fills it.</div>
            </div>
          </div>

          <div className="inv-brief-section">
            <p className="inv-eyebrow">Published Scientific Brief</p>
            <div className="inv-brief-row">
              <div>
                <div className="inv-brief-title">Bioactive Signaling Molecules: A New Non-Pharmaceutical Biotechnology Platform for Metabolic Health</div>
                <div className="inv-brief-author">Richard Clark Kaufman, PhD &middot; NutraGLP&reg; Biosciences &middot; 200+ peer-reviewed references</div>
              </div>
              <a href="https://www.linkedin.com/posts/richard-clark-kaufman-phd-43511bb3_beyond-glp-1-drugs-bioactive-signaling-molecules-activity-7444936008699351040-z_cp?utm_source=share&utm_medium=member_desktop&rcm=ACoAAABSxKoBmUW81fe_lpwvGH_C9ci9DXuFz7g" target="_blank" rel="noopener noreferrer" className="inv-btn-gold-outline">Read Article &rarr;</a>
            </div>
          </div>
        </div>
      </section>

{/* ═══ CREDENTIAL STRIP ═══ */}
      <div className="inv-cred-strip">
        <div className="inv-cred-inner">
          <div className="inv-cred-item"><div className="inv-cred-num">40+</div><div className="inv-cred-lbl">Years of Category Innovation</div></div>
          <div className="inv-cred-item"><div className="inv-cred-num">24+</div><div className="inv-cred-lbl">Countries with Patent Coverage</div></div>
          <div className="inv-cred-item"><div className="inv-cred-num">503</div><div className="inv-cred-lbl">Observational Study Participants</div></div>
          <div className="inv-cred-item"><div className="inv-cred-num">13</div><div className="inv-cred-lbl">Validated Signaling Targets</div></div>
          <div className="inv-cred-item"><div className="inv-cred-num">200+</div><div className="inv-cred-lbl">Peer-Reviewed References</div></div>
        </div>
      </div>

{/* ░░░ LEADERSHIP ░░░ */}
      <section className="inv-section inv-light" id="leadership">
        <div className="inv-inner">
          <p className="inv-eyebrow">Platform Architect &amp; Founder</p>
          <div className="inv-leader-grid">
            <div>
              <div className="inv-leader-name">Richard Clark<br />Kaufman, PhD</div>
              <div className="inv-leader-title">Founder &amp; CEO &mdash; NutraGLP&reg; Biosciences</div>
              <p className="inv-leader-bio">For more than four decades, one pattern has defined my career &mdash; identify the biological mechanism before the market understands it, build the science to deliver it, and create the category.</p>
              <p className="inv-leader-bio">Melatonin. 5-HTP. CoQ10. Lipid nanoparticle delivery. Each one was a mechanism I recognized before the industry had a name for it. Each one became a market. NutraGLP&reg; Biosciences is the same pattern applied to the largest metabolic health opportunity of this generation.</p>
              <div className="inv-credential">
                <h4>Frost &amp; Sullivan Nano-Encapsulation Technology Innovation Award</h4>
                <p>Recognized for pioneering patented lipid nanoparticle delivery systems spanning 24+ countries and multiple delivery platforms</p>
              </div>
              <div className="inv-credential">
                <h4>Inventor &mdash; 30+ Worldwide Patent Filings</h4>
                <p>Nanostructured drug delivery systems and manufacturing. First patent ever granted for nanoparticle delivery of cannabis by multiple methods of administration</p>
              </div>
              <div className="inv-credential">
                <h4>Author &mdash; The Age Reduction System</h4>
                <p>Best-selling longevity book. Co-director of the first life extension medical clinic in North America &mdash; the Center for Biogerontology</p>
              </div>
              <div className="inv-credential">
                <h4>150+ Commercial Health Products</h4>
                <p>Developed across Science-Based Health, General Research Labs, Life Enhancement, First Fitness International, and Vitamin Research Products</p>
              </div>
            </div>
            <div className="inv-leader-right">
              <div className="inv-leader-quote">&ldquo;I identify biological mechanisms before markets understand them. That is what I have done my entire career &mdash; and it is what I have done with NutraGLP&reg; Biosciences.&rdquo;</div>
              <div className="inv-track-row">
                <div className="inv-track-name">Melatonin</div>
                <div className="inv-track-desc">Early category innovator before mainstream adoption &mdash; now a global sleep health market</div>
              </div>
              <div className="inv-track-row">
                <div className="inv-track-name">5-HTP</div>
                <div className="inv-track-desc">Identified and commercialized serotonin precursor biology before consumer awareness existed</div>
              </div>
              <div className="inv-track-row">
                <div className="inv-track-name">CoQ10</div>
                <div className="inv-track-desc">Pioneered cellular energy substrate supplementation at commercial scale</div>
              </div>
              <div className="inv-track-row">
                <div className="inv-track-name">Nano-Delivery</div>
                <div className="inv-track-desc">Invented patented lipid nanoparticle systems enabling superior bioavailability across IntraOral, Transdermal, Intranasal, and GI delivery platforms</div>
              </div>
              <div className="inv-track-row">
                <div className="inv-track-name">NutraGLP&reg;</div>
                <div className="inv-track-desc">A new class of Bioactive Signaling Molecules &mdash; the convergence of four decades of delivery science, biological insight, and category creation, with a single mission: bring pharmaceutical-grade incretin biology to the world in accessible consumer formats</div>
              </div>
            </div>
          </div>
        </div>
      </section>

{/* ▓▓▓ CONTACT ▓▓▓ */}
      <section className="inv-section inv-dark" id="contact" style={{ textAlign: 'center' }}>
        <div className="inv-inner">
          <p className="inv-eyebrow">NutraGLP&reg; Biosciences</p>
          <h2>The biology is proven.<br />The IP is defensible.<br /><em>The market is ready.</em></h2>
          <p className="inv-lead" style={{ margin: '0 auto 48px', textAlign: 'center' }}>Scientific brief, executive summary, observational data, and full platform documentation available to qualified parties upon request.</p>
          <a href={"mailto:info@nutraglpbio.com?bcc=richard@nutrglpbio.com,chris@nutraglpbio.com&subject=Send%20me%20the%20brief"} className="inv-contact-email inv-mailto"</a>
          <div className="inv-contact-divider"></div>
          <div className="inv-contact-phone">310 &middot; 990 &middot; 6770</div>
          <div className="inv-contact-location">NutraGLP&reg; Biosciences &middot; Santa Monica, California</div>
          <p className="inv-contact-footer">NutraGLP&reg; Biosciences is building the next category in metabolic health. Executive summary, scientific monograph, and clinical documentation available to qualified strategic and investment partners upon request.</p>
        </div>
      </section>

{/* ═══ DISCLAIMER ═══ */}
      <div className="inv-disclaimer">
        <div className="inv-disclaimer-inner">
          <p>&copy; 2026 NutraGLP&reg; Biosciences. All rights reserved. This website is provided for informational purposes only and does not constitute a solicitation or offer to sell securities. NutraGLP&reg; products are not intended to diagnose, treat, cure, or prevent any disease. Observational data referenced herein reflects a non-randomized study. Controlled clinical trials are planned.</p>
        </div>
      </div>

      <script dangerouslySetInnerHTML={{ __html: `
        document.addEventListener('click', function(e) {
          var link = e.target.closest('.inv-mailto');
          if (link && link.href && link.href.indexOf('mailto:') === 0) {
            e.preventDefault();
            e.stopPropagation();
            window.location.href = link.getAttribute('href');
          }
        }, true);
      `}} />
    </main>
  );
}
