import type { Metadata } from "next";
import Footer from "../components/Footer";
import RequestDeckModal from "../components/RequestDeckModal";

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
html { scroll-behavior: smooth; scroll-padding-top: 56px; }
.inv-page {
  --green-deep: #1a2e1a;
  --green-dark: #243524;
  --green-mid: #2d4a2d;
  --teal: #1585b5;
  --gold: #c8962e;
  --gold-lt: #d4a94a;
  --inv-white: #ffffff;
  --cream: #f5f3ee;
  --cream-warm: #edeae3;
  --ink: #1a1a18;
  --ink-mid: #3a3a36;
  --mist: #6b7280;
  --silver: #9ca3af;
  --rule: #e0ddd6;
  --rule-dark: rgba(255,255,255,0.08);
}

.inv-section { padding: 96px 0; }
.inv-inner { max-width: 1100px; margin: 0 auto; padding: 0 48px; box-sizing: border-box; }
.inv-eyebrow {
  font-size: 11px; font-weight: 600;
  letter-spacing: 0.14em; text-transform: uppercase;
  margin-bottom: 16px; color: var(--teal);
}
.inv-page h2 {
  font-family: 'Fraunces', Georgia, serif;
  font-size: clamp(26px, 3.2vw, 38px);
  font-weight: 500; line-height: 1.18;
  letter-spacing: -0.02em; margin-bottom: 20px;
  font-optical-sizing: auto;
}
.inv-page h2 em { font-style: italic; font-weight: 400; }
.inv-lead {
  font-size: 16px; font-weight: 400;
  line-height: 1.75; margin-bottom: 16px; max-width: 700px;
}
.inv-body {
  font-size: 15px; line-height: 1.75;
  margin-bottom: 14px; max-width: 700px;
}
.inv-body strong { font-weight: 600; }

/* Light section defaults */
.inv-light h2 { color: var(--ink); }
.inv-light h2 em { color: var(--teal); }
.inv-light .inv-lead { color: var(--ink-mid); }
.inv-light .inv-body { color: var(--mist); }
.inv-light .inv-body strong { color: var(--ink-mid); }

/* Dark section defaults */
.inv-dark { background: var(--green-deep); }
.inv-dark h2 { color: #fff; }
.inv-dark h2 em { color: var(--gold-lt); }
.inv-dark .inv-eyebrow { color: var(--teal); }
.inv-dark .inv-lead { color: rgba(255,255,255,0.55); }
.inv-dark .inv-body { color: rgba(255,255,255,0.45); }
.inv-dark .inv-body strong { color: rgba(255,255,255,0.75); }

.inv-bg-white { background: var(--inv-white); }
.inv-bg-cream { background: var(--cream); }

/* ═══════════════════ SECTION NAV ═══════════════════ */
.inv-nav {
  position: sticky; top: 0; z-index: 80;
  background: rgba(26,46,26,0.97);
  backdrop-filter: blur(8px);
  border-bottom: 1px solid rgba(255,255,255,0.06);
}
.inv-nav-inner {
  max-width: 1100px; margin: 0 auto;
  padding: 0 48px; box-sizing: border-box;
  display: flex; align-items: center;
  justify-content: space-between;
  height: 48px;
}
.inv-nav-links {
  display: flex; align-items: center; gap: 28px;
  list-style: none; margin: 0; padding: 0;
}
.inv-nav-links a {
  font-size: 11px; font-weight: 600;
  letter-spacing: 0.1em; text-transform: uppercase;
  color: rgba(255,255,255,0.5);
  text-decoration: none; transition: color 0.2s;
  white-space: nowrap;
}
.inv-nav-links a:hover { color: #fff; }
.inv-nav-cta {
  display: inline-flex; align-items: center; gap: 6px;
  background: var(--gold); color: var(--green-deep);
  padding: 8px 18px; border-radius: 4px;
  font-size: 11px; font-weight: 700;
  letter-spacing: 0.06em; text-transform: uppercase;
  text-decoration: none; transition: all 0.2s;
}
.inv-nav-cta:hover { background: var(--gold-lt); }

/* ═══════════════════ HERO ═══════════════════ */
.inv-hero {
  background: var(--green-deep);
  padding: 120px 0 96px;
  position: relative; overflow: hidden;
  text-align: center;
}
.inv-hero::before {
  content: ''; position: absolute; inset: 0;
  background:
    radial-gradient(ellipse 50% 60% at 50% 40%, rgba(45,74,45,0.4) 0%, transparent 70%),
    radial-gradient(ellipse 40% 50% at 20% 80%, rgba(200,150,46,0.05) 0%, transparent 60%);
  pointer-events: none;
}
.inv-hero::after {
  content: ''; position: absolute; bottom: 0; left: 0; right: 0; height: 1px;
  background: linear-gradient(90deg, transparent 0%, rgba(200,150,46,0.25) 50%, transparent 100%);
}
.inv-hero-inner {
  max-width: 1100px; margin: 0 auto;
  padding: 0 48px; box-sizing: border-box;
  position: relative;
}
.inv-hero-eyebrow {
  font-size: 11px; font-weight: 600;
  letter-spacing: 0.14em; text-transform: uppercase;
  color: rgba(255,255,255,0.45); margin-bottom: 28px;
}
.inv-hero h1 {
  font-family: 'Fraunces', Georgia, serif;
  font-size: clamp(40px, 5vw, 62px);
  font-weight: 500; line-height: 1.08;
  letter-spacing: -0.025em; color: #fff;
  margin-bottom: 24px;
  font-optical-sizing: auto;
}
.inv-hero h1 em { font-style: italic; font-weight: 400; color: var(--gold-lt); }
.inv-hero-sub {
  font-size: 17px; font-weight: 400;
  color: rgba(255,255,255,0.5);
  max-width: 580px; margin: 0 auto 44px;
  line-height: 1.7;
}
.inv-hero-ctas {
  display: flex; align-items: center;
  justify-content: center;
  gap: 20px; margin-bottom: 72px;
}
.inv-btn-gold {
  display: inline-flex; align-items: center; gap: 8px;
  background: var(--gold); color: var(--green-deep);
  padding: 14px 30px; border-radius: 4px;
  font-size: 14px; font-weight: 600;
  text-decoration: none; transition: all 0.2s;
  border: none; cursor: pointer;
}
.inv-btn-gold:hover { background: var(--gold-lt); transform: translateY(-1px); }
.inv-btn-outline {
  display: inline-flex; align-items: center; gap: 8px;
  background: transparent; color: rgba(255,255,255,0.6);
  padding: 14px 26px; border-radius: 4px;
  font-size: 14px; font-weight: 500;
  text-decoration: none; transition: all 0.2s;
  border: 1px solid rgba(255,255,255,0.12);
}
.inv-btn-outline:hover { border-color: rgba(255,255,255,0.3); color: #fff; }

/* Hero stats */
.inv-hero-stats {
  display: grid; grid-template-columns: repeat(4, 1fr);
  border-top: 1px solid rgba(255,255,255,0.1);
  padding-top: 44px;
}
.inv-h-stat { text-align: center; position: relative; }
.inv-h-stat:not(:last-child)::after {
  content: ''; position: absolute; right: 0; top: 0; bottom: 0;
  width: 1px; background: rgba(255,255,255,0.1);
}
.inv-h-stat-val {
  font-family: 'Fraunces', Georgia, serif;
  font-size: clamp(36px, 3.5vw, 48px);
  font-weight: 600; color: #fff;
  line-height: 1; letter-spacing: -0.03em;
  font-optical-sizing: auto;
}
.inv-h-stat-label {
  font-size: 12px; font-weight: 600;
  letter-spacing: 0.06em; text-transform: uppercase;
  color: rgba(255,255,255,0.45); margin-top: 10px;
}

/* ═══════════════════ CREDENTIAL STRIP ═══════════════════ */
.inv-cred-strip {
  background: var(--green-dark); padding: 20px 0;
  border-bottom: 1px solid rgba(255,255,255,0.05);
}
.inv-cred-inner {
  max-width: 1100px; margin: 0 auto; padding: 0 48px;
  box-sizing: border-box;
  display: flex; align-items: center; justify-content: space-around;
}
.inv-cred-item { text-align: center; }
.inv-cred-num {
  font-family: 'Fraunces', Georgia, serif;
  font-size: 28px; font-weight: 600;
  color: var(--gold-lt); line-height: 1;
}
.inv-cred-lbl {
  font-size: 10px; font-weight: 600;
  letter-spacing: 0.08em; text-transform: uppercase;
  color: rgba(255,255,255,0.35); margin-top: 4px;
}

/* ═══════════════════ PLATFORM CARDS ═══════════════════ */
.inv-plat-grid {
  display: grid; grid-template-columns: repeat(3, 1fr);
  gap: 0; margin-top: 48px;
  border-radius: 8px; overflow: hidden;
  border: 1px solid var(--rule);
}
.inv-plat-card {
  padding: 36px 28px; background: var(--inv-white);
  border-right: 1px solid var(--rule);
}
.inv-plat-card:last-child { border-right: none; }
.inv-plat-card:nth-child(2) { background: var(--cream); }
.inv-plat-top { height: 3px; margin: -36px -28px 28px; }
.inv-plat-card:nth-child(1) .inv-plat-top { background: var(--teal); }
.inv-plat-card:nth-child(2) .inv-plat-top { background: var(--gold); }
.inv-plat-card:nth-child(3) .inv-plat-top { background: var(--green-mid); }
.inv-plat-num {
  font-family: 'Fraunces', Georgia, serif;
  font-size: 48px; font-weight: 500;
  color: var(--rule); line-height: 1; margin-bottom: 14px;
}
.inv-plat-card h3 {
  font-family: 'Fraunces', Georgia, serif;
  font-size: 19px; font-weight: 500;
  color: var(--ink); margin-bottom: 10px;
}
.inv-plat-card p { font-size: 14px; color: var(--mist); line-height: 1.7; margin: 0; }
.inv-pathway-chips { display: flex; flex-wrap: wrap; gap: 6px; margin-top: 14px; }
.inv-pathway-chip {
  font-size: 10px; font-weight: 600; letter-spacing: 0.04em;
  padding: 3px 10px; border-radius: 3px;
  background: rgba(21,133,181,0.08); color: var(--teal);
}

/* ═══════════════════ CLINICAL STATS ═══════════════════ */
.inv-clinical-stats {
  display: grid; grid-template-columns: repeat(5, 1fr);
  gap: 0; margin-top: 48px;
  border-radius: 8px; overflow: hidden;
  border: 1px solid rgba(255,255,255,0.08);
}
.inv-clin-stat {
  padding: 32px 20px; text-align: center;
  background: rgba(255,255,255,0.03);
  border-right: 1px solid rgba(255,255,255,0.06);
}
.inv-clin-stat:last-child { border-right: none; }
.inv-clin-val {
  font-family: 'Fraunces', Georgia, serif;
  font-size: 36px; font-weight: 600;
  color: var(--gold-lt); line-height: 1;
  letter-spacing: -0.03em; font-optical-sizing: auto;
}
.inv-clin-lbl {
  font-size: 12px; color: rgba(255,255,255,0.45);
  margin-top: 8px; line-height: 1.4;
}
.inv-clin-note {
  margin-top: 28px; font-size: 13px; font-style: italic;
  color: rgba(255,255,255,0.3); max-width: 640px;
}

/* ═══════════════════ PRODUCT CARDS ═══════════════════ */
.inv-product-lead {
  margin-top: 48px; padding: 44px; background: var(--inv-white);
  border: 2px solid var(--gold); border-radius: 8px;
  position: relative;
}
.inv-product-badge {
  position: absolute; top: -12px; left: 36px;
  background: var(--gold); color: var(--green-deep);
  font-size: 10px; font-weight: 700;
  letter-spacing: 0.1em; text-transform: uppercase;
  padding: 4px 14px; border-radius: 3px;
}
.inv-product-lead h3 {
  font-family: 'Fraunces', Georgia, serif;
  font-size: 26px; font-weight: 500; color: var(--ink);
  margin-bottom: 8px;
}
.inv-product-lead p { font-size: 15px; color: var(--mist); line-height: 1.7; max-width: 600px; }
.inv-product-price {
  font-family: 'Fraunces', Georgia, serif;
  font-size: 32px; font-weight: 600; color: var(--teal); margin-top: 16px;
}
.inv-pipe-grid {
  display: grid; grid-template-columns: repeat(3, 1fr);
  gap: 16px; margin-top: 24px;
}
.inv-pipe-card {
  padding: 28px 24px; background: var(--inv-white);
  border: 1px solid var(--rule); border-radius: 8px;
}
.inv-pipe-when {
  font-size: 10px; font-weight: 700;
  letter-spacing: 0.1em; text-transform: uppercase;
  color: var(--teal); margin-bottom: 6px;
}
.inv-pipe-name {
  font-family: 'Fraunces', Georgia, serif;
  font-size: 18px; font-weight: 500;
  color: var(--ink); margin-bottom: 8px;
}
.inv-pipe-card p { font-size: 13px; color: var(--mist); line-height: 1.6; margin: 0; }

/* ═══════════════════ COMPARISON TABLE ═══════════════════ */
.inv-comp-tbl {
  width: 100%; border-collapse: collapse;
  margin-top: 40px; border-radius: 8px;
  overflow: hidden; font-size: 13px;
}
.inv-comp-tbl th {
  font-size: 11px; font-weight: 700;
  letter-spacing: 0.08em; text-transform: uppercase;
  color: var(--teal); background: rgba(255,255,255,0.04);
  padding: 12px 16px; text-align: left;
  border-bottom: 1px solid rgba(255,255,255,0.08);
}
.inv-comp-tbl td {
  padding: 12px 16px; color: rgba(255,255,255,0.5);
  border-bottom: 1px solid rgba(255,255,255,0.04);
  vertical-align: top; line-height: 1.5;
}
.inv-comp-tbl tr:last-child td { border-bottom: none; }
.inv-comp-tbl td:first-child { font-weight: 600; color: rgba(255,255,255,0.75); white-space: nowrap; }
.inv-comp-tbl .inv-check { color: var(--teal); font-weight: 700; }
.inv-comp-tbl .inv-x { color: rgba(255,255,255,0.2); }
.inv-comp-tbl .inv-nutra-row td { background: rgba(21,133,181,0.08); color: rgba(255,255,255,0.7); }
.inv-comp-tbl .inv-nutra-row td:first-child { color: var(--gold-lt); }

/* ═══════════════════ REGULATORY COMPARISON ═══════════════════ */
.inv-reg-compare {
  display: grid; grid-template-columns: 1fr 1fr;
  gap: 0; margin-top: 40px;
  border-radius: 8px; overflow: hidden;
  border: 1px solid rgba(255,255,255,0.08);
}
.inv-reg-col { padding: 36px; background: rgba(255,255,255,0.03); }
.inv-reg-col:first-child { border-right: 1px solid rgba(255,255,255,0.06); }
.inv-reg-col h4 {
  font-family: 'Fraunces', Georgia, serif;
  font-size: 17px; font-weight: 500; color: #fff; margin-bottom: 20px;
}
.inv-reg-col.inv-reg-bad h4 { color: rgba(255,255,255,0.5); }
.inv-reg-item {
  font-size: 14px; color: rgba(255,255,255,0.55);
  padding: 8px 0; display: flex; align-items: center; gap: 10px;
}
.inv-reg-x { color: #e04040; font-weight: 700; font-size: 16px; flex-shrink: 0; }
.inv-reg-check { color: var(--teal); font-weight: 700; font-size: 16px; flex-shrink: 0; }

/* ═══════════════════ IP CARDS ═══════════════════ */
.inv-ip-grid {
  display: grid; grid-template-columns: repeat(4, 1fr);
  gap: 16px; margin-top: 48px;
}
.inv-ip-card {
  background: var(--inv-white); border: 1px solid var(--rule);
  border-radius: 8px; padding: 32px 24px;
}
.inv-ip-num {
  font-family: 'Fraunces', Georgia, serif;
  font-size: 14px; font-weight: 600;
  color: var(--gold); margin-bottom: 12px;
}
.inv-ip-card h4 {
  font-family: 'Fraunces', Georgia, serif;
  font-size: 16px; font-weight: 500;
  color: var(--ink); margin-bottom: 8px;
}
.inv-ip-card p { font-size: 13px; color: var(--mist); line-height: 1.65; margin: 0; }

/* ═══════════════════ MARKET ═══════════════════ */
.inv-mkt-stats {
  display: grid; grid-template-columns: repeat(3, 1fr);
  gap: 0; margin-top: 48px;
  border-radius: 8px; overflow: hidden;
  border: 1px solid var(--rule);
}
.inv-mkt-s {
  padding: 40px 28px; background: var(--inv-white);
  border-right: 1px solid var(--rule); text-align: center;
}
.inv-mkt-s:last-child { border-right: none; }
.inv-mkt-s:nth-child(2) { background: var(--cream); }
.inv-mkt-num {
  font-family: 'Fraunces', Georgia, serif;
  font-size: 42px; font-weight: 600;
  color: var(--ink); line-height: 1;
  letter-spacing: -0.03em;
}
.inv-mkt-lbl { font-size: 13px; font-weight: 600; color: var(--mist); margin-top: 8px; }
.inv-mkt-sub { font-size: 12px; color: var(--silver); margin-top: 3px; }

/* Gap chart */
.inv-gap-chart {
  margin-top: 48px; padding: 36px; background: var(--inv-white);
  border: 1px solid var(--rule); border-radius: 8px;
}
.inv-gap-title {
  font-family: 'Fraunces', Georgia, serif;
  font-size: 17px; font-weight: 500;
  color: var(--ink); margin-bottom: 28px;
}
.inv-gap-row { margin-bottom: 20px; }
.inv-gap-row:last-child { margin-bottom: 0; }
.inv-gap-lbl {
  font-size: 13px; font-weight: 600; color: var(--ink-mid);
  margin-bottom: 6px; display: flex; justify-content: space-between;
}
.inv-gap-lbl span { font-weight: 400; color: var(--silver); font-size: 12px; }
.inv-gap-track { height: 28px; background: var(--cream-warm); border-radius: 4px; overflow: hidden; }
.inv-gap-fill {
  height: 100%; border-radius: 4px;
  display: flex; align-items: center; padding-left: 12px;
  font-size: 11px; font-weight: 700; letter-spacing: 0.03em;
}
.inv-gap-fill.gf-pharma { background: var(--green-deep); color: #fff; }
.inv-gap-fill.gf-nutra { background: var(--teal); color: #fff; }
.inv-gap-fill.gf-supps { background: var(--silver); color: #fff; }
.inv-gap-arrow {
  text-align: center; padding: 10px 0;
  font-size: 12px; font-weight: 700;
  color: var(--teal); letter-spacing: 0.06em;
}

/* M&A table */
.inv-ma-tbl {
  width: 100%; border-collapse: collapse;
  margin-top: 48px; border-radius: 8px;
  overflow: hidden; border: 1px solid var(--rule);
}
.inv-ma-tbl th {
  font-size: 11px; font-weight: 700;
  letter-spacing: 0.1em; text-transform: uppercase;
  color: #fff; background: var(--green-deep);
  padding: 14px 20px; text-align: left;
}
.inv-ma-tbl td {
  padding: 14px 20px; font-size: 14px;
  color: var(--ink-mid); border-bottom: 1px solid var(--rule);
  vertical-align: top;
}
.inv-ma-tbl tr:last-child td { border-bottom: none; }
.inv-ma-tbl tr:nth-child(even) td { background: var(--cream); }
.inv-ma-tbl tr:nth-child(odd) td { background: var(--inv-white); }
.inv-ma-tbl td:first-child { font-weight: 600; color: var(--ink); }
.inv-ma-tbl td:nth-child(3) { font-weight: 600; color: var(--gold); white-space: nowrap; }
.inv-ma-tbl td:last-child { font-size: 13px; color: var(--mist); }

/* ═══════════════════ TRACK RECORD TABLE ═══════════════════ */
.inv-track-tbl {
  width: 100%; border-collapse: collapse; margin-top: 28px;
  border-radius: 8px; overflow: hidden;
  border: 1px solid rgba(255,255,255,0.08);
}
.inv-track-tbl th {
  font-size: 10px; font-weight: 700;
  letter-spacing: 0.08em; text-transform: uppercase;
  color: var(--teal); background: rgba(255,255,255,0.04);
  padding: 10px 16px; text-align: left;
  border-bottom: 1px solid rgba(255,255,255,0.06);
}
.inv-track-tbl td {
  padding: 10px 16px; font-size: 13px;
  color: rgba(255,255,255,0.55);
  border-bottom: 1px solid rgba(255,255,255,0.04);
}
.inv-track-tbl tr:last-child td { border-bottom: none; }
.inv-track-tbl td:first-child { font-weight: 600; color: var(--gold-lt); }
.inv-track-tbl td:nth-child(2) { color: rgba(255,255,255,0.7); }

/* ═══════════════════ TEAM CARDS ═══════════════════ */
.inv-team-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; margin-top: 48px; }
.inv-team-card {
  background: rgba(255,255,255,0.04);
  border: 1px solid rgba(255,255,255,0.06);
  border-radius: 8px; padding: 40px;
  position: relative; overflow: hidden;
}
.inv-team-card::before {
  content: ''; position: absolute; top: 0; left: 0; right: 0;
  height: 3px; background: linear-gradient(90deg, var(--teal) 0%, var(--green-mid) 100%);
}
.inv-team-role {
  font-size: 11px; font-weight: 700;
  letter-spacing: 0.12em; text-transform: uppercase;
  color: var(--teal); margin-bottom: 8px;
}
.inv-team-card h3 {
  font-family: 'Fraunces', Georgia, serif;
  font-size: 24px; font-weight: 500;
  color: #fff; margin-bottom: 4px;
}
.inv-team-title { font-size: 13px; color: rgba(255,255,255,0.4); margin-bottom: 18px; }
.inv-team-bio {
  font-size: 14px; color: rgba(255,255,255,0.6);
  line-height: 1.75; margin-bottom: 20px;
}

/* ═══════════════════ CONTACT ═══════════════════ */
.inv-contact-grid { display: grid; grid-template-columns: 1fr; gap: 48px; margin-top: 48px; }
.inv-c-card { border-top: 2px solid var(--teal); padding-top: 24px; }
.inv-c-role {
  font-size: 11px; font-weight: 600;
  letter-spacing: 0.12em; text-transform: uppercase;
  color: var(--teal); margin-bottom: 6px;
}
.inv-c-card h3 {
  font-family: 'Fraunces', Georgia, serif;
  font-size: 22px; font-weight: 500;
  color: #fff; margin-bottom: 16px;
}
.inv-c-card a {
  display: inline-flex; align-items: center; gap: 6px;
  font-size: 15px; font-weight: 500; color: #fff;
  text-decoration: none;
  border-bottom: 1px solid rgba(21,133,181,0.4);
  padding-bottom: 2px; transition: all 0.2s;
}
.inv-c-card a:hover { color: var(--teal); border-color: var(--teal); }

/* ═══════════════════ DISCLAIMER ═══════════════════ */
.inv-disclaimer {
  background: var(--green-dark);
  padding: 36px 48px;
  border-top: 1px solid rgba(255,255,255,0.1);
}
.inv-disclaimer-inner {
  max-width: 960px; margin: 0 auto;
}
.inv-disclaimer-title {
  font-size: 11px; font-weight: 700;
  letter-spacing: 0.1em; text-transform: uppercase;
  color: rgba(255,255,255,0.4); margin-bottom: 12px;
}
.inv-disclaimer p {
  font-size: 13px; color: rgba(255,255,255,0.4);
  line-height: 1.8; margin: 0;
}

/* ═══════════════════ STICKY CTA ═══════════════════ */
.inv-sticky-btn {
  position: fixed; bottom: 24px; right: 24px; z-index: 90;
  opacity: 0; transform: translateY(16px);
  transition: all 0.4s ease; pointer-events: none;
}
.inv-sticky-btn.show { opacity: 1; transform: translateY(0); pointer-events: all; }
.inv-sticky-btn .inv-btn-gold {
  box-shadow: 0 6px 24px rgba(26,46,26,0.35);
  font-size: 13px; padding: 11px 22px;
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
.inv-hero-stats    { animation-delay: 0.34s; }

/* ═══════════════════ RESPONSIVE ═══════════════════ */
@media (max-width: 900px) {
  .inv-section { padding: 64px 0; }
  .inv-inner { padding: 0 24px; }
  .inv-hero-inner { padding: 0 24px; }
  .inv-hero { padding: 96px 0 60px; }
  .inv-hero-stats { grid-template-columns: repeat(2, 1fr); gap: 20px; }
  .inv-h-stat::after { display: none; }
  .inv-nav-inner { padding: 0 16px; height: 44px; }
  .inv-nav-links { gap: 16px; overflow-x: auto; -webkit-overflow-scrolling: touch; }
  .inv-nav-links a { font-size: 10px; }
  .inv-nav-cta { font-size: 10px; padding: 6px 14px; }
  .inv-cred-inner { flex-wrap: wrap; gap: 16px; padding: 0 24px; }
  .inv-plat-grid { grid-template-columns: 1fr; }
  .inv-plat-card { border-right: none; border-bottom: 1px solid var(--rule); }
  .inv-plat-card:last-child { border-bottom: none; }
  .inv-clinical-stats { grid-template-columns: repeat(2, 1fr); }
  .inv-clin-stat:nth-child(5) { grid-column: span 2; }
  .inv-pipe-grid { grid-template-columns: 1fr; }
  .inv-reg-compare { grid-template-columns: 1fr; }
  .inv-reg-col:first-child { border-right: none; border-bottom: 1px solid rgba(255,255,255,0.06); }
  .inv-ip-grid { grid-template-columns: 1fr 1fr; }
  .inv-mkt-stats { grid-template-columns: 1fr; }
  .inv-mkt-s { border-right: none; border-bottom: 1px solid var(--rule); }
  .inv-mkt-s:last-child { border-bottom: none; }
  .inv-team-grid { grid-template-columns: 1fr; }
  .inv-contact-grid { grid-template-columns: 1fr; }
  .inv-disclaimer { padding: 28px 24px; }
}
          `,
        }}
      />

{/* ▓▓▓ HERO ▓▓▓ */}
      <section className="inv-hero">
        <div className="inv-hero-inner">
          <p className="inv-hero-eyebrow">NutraGLP Biosciences</p>
          <h1>A new class of<br /><em>Bioactive Signaling Molecules</em><br />for metabolic health.</h1>
          <p className="inv-hero-sub">Drug-level biology. Consumer-scale distribution. No prescription required. For weight loss and glycemic control, delivered as supplements and foods.</p>
          <div className="inv-hero-ctas">
            <a href="#contact" className="inv-btn-gold">Request Scientific Brief</a>
            <a href="#platform" className="inv-btn-outline">Explore the Platform</a>
          </div>
          <div className="inv-hero-stats">
            <div className="inv-h-stat"><div className="inv-h-stat-val">$5.5M</div><div className="inv-h-stat-label">Seed Round</div></div>
            <div className="inv-h-stat"><div className="inv-h-stat-val">40+</div><div className="inv-h-stat-label">Patent-Pending Formulations</div></div>
            <div className="inv-h-stat"><div className="inv-h-stat-val">13</div><div className="inv-h-stat-label">Signaling Targets</div></div>
            <div className="inv-h-stat"><div className="inv-h-stat-val">8&times;</div><div className="inv-h-stat-label">Bioavailability vs Standard</div></div>
          </div>
        </div>
      </section>

{/* ═══ SECTION NAV ═══ */}
      <nav className="inv-nav">
        <div className="inv-nav-inner">
          <ul className="inv-nav-links">
            <li><a href="#platform">Platform</a></li>
            <li><a href="#clinical">Clinical</a></li>
            <li><a href="#products">Products</a></li>
            <li><a href="#competitive">Competitive</a></li>
            <li><a href="#ip">IP</a></li>
            <li><a href="#market">Market</a></li>
            <li><a href="#leadership">Leadership</a></li>
            <li><a href="#contact">Contact</a></li>
          </ul>
          <a href="#contact" className="inv-nav-cta">Request Brief</a>
        </div>
      </nav>

{/* ═══ CREDENTIAL STRIP ═══ */}
      <div className="inv-cred-strip">
        <div className="inv-cred-inner">
          <div className="inv-cred-item"><div className="inv-cred-num">40+</div><div className="inv-cred-lbl">Formulations</div></div>
          <div className="inv-cred-item"><div className="inv-cred-num">24+</div><div className="inv-cred-lbl">Countries</div></div>
          <div className="inv-cred-item"><div className="inv-cred-num">503</div><div className="inv-cred-lbl">Participants</div></div>
          <div className="inv-cred-item"><div className="inv-cred-num">13</div><div className="inv-cred-lbl">Targets</div></div>
          <div className="inv-cred-item"><div className="inv-cred-num">200+</div><div className="inv-cred-lbl">Data Points</div></div>
        </div>
      </div>

{/* ░░░ THE PLATFORM — first section ░░░ */}
      <section className="inv-section inv-light inv-bg-white" id="platform">
        <div className="inv-inner">
          <p className="inv-eyebrow">The Platform</p>
          <h2>NutraGLP&reg; Sync &mdash; three mechanisms.<br /><em>One coordinated system.</em></h2>
          <p className="inv-lead">A non-pharmaceutical biotechnology platform that bridges pharmaceuticals, foods, and supplements. Engineered as a coordinated signaling architecture with multiple mechanisms including natural incretin hormone activation (GLP-1, GIP), DPP-4 inhibition, blood glucose control, and thermogenesis.</p>
          <p className="inv-body"><strong>The system design &mdash; not any single ingredient &mdash; is the defensible moat.</strong></p>
          <div className="inv-plat-grid">
            <div className="inv-plat-card">
              <div className="inv-plat-top"></div>
              <div className="inv-plat-num">01</div>
              <h3>Natural Incretin Activation</h3>
              <p>Amplifies GLP-1, GIP, and downstream signaling pathways using GRAS-certified bioactives. Same validated biology as pharmacologic therapy. No synthetic peptides, no prescription.</p>
              <div className="inv-pathway-chips">
                <span className="inv-pathway-chip">GLP-1</span>
                <span className="inv-pathway-chip">GIP</span>
                <span className="inv-pathway-chip">DPP-4 Inhibition</span>
              </div>
            </div>
            <div className="inv-plat-card">
              <div className="inv-plat-top"></div>
              <div className="inv-plat-num">02</div>
              <h3>Nanoemulsion Delivery</h3>
              <p>Proprietary nano-encapsulation system delivering 8&times; bioavailability vs standard oral. Pharmaceutical-grade delivery in a consumer format. The delivery platform is the second moat.</p>
              <div className="inv-pathway-chips">
                <span className="inv-pathway-chip">8&times; Bioavailability</span>
                <span className="inv-pathway-chip">Nano-Carrier</span>
              </div>
            </div>
            <div className="inv-plat-card">
              <div className="inv-plat-top"></div>
              <div className="inv-plat-num">03</div>
              <h3>Multi-Pathway Activation</h3>
              <p>Coordinated targeting across 13 signaling pathways simultaneously. Thermogenesis, glucose control, incretin amplification. The architecture itself is the invention.</p>
              <div className="inv-pathway-chips">
                <span className="inv-pathway-chip">Thermogenesis</span>
                <span className="inv-pathway-chip">Glucose</span>
                <span className="inv-pathway-chip">13 Targets</span>
              </div>
            </div>
          </div>
        </div>
      </section>

{/* ▓▓▓ CLINICAL EVIDENCE — consolidated ▓▓▓ */}
      <section className="inv-section inv-dark" id="clinical">
        <div className="inv-inner">
          <p className="inv-eyebrow">Clinical Evidence</p>
          <h2>Proof of concept. 503 participants. <em>Six months.</em></h2>
          <p className="inv-lead">Observational trial demonstrating significant weight loss with fewer than 5% adverse effects and no widespread discontinuation. GRAS-certified compounds throughout. Full methodology available under NDA.</p>
          <div className="inv-clinical-stats">
            <div className="inv-clin-stat"><div className="inv-clin-val">14.1%</div><div className="inv-clin-lbl">Average weight loss</div></div>
            <div className="inv-clin-stat"><div className="inv-clin-val">&lt;5%</div><div className="inv-clin-lbl">Adverse effects, all mild</div></div>
            <div className="inv-clin-stat"><div className="inv-clin-val">0</div><div className="inv-clin-lbl">Serious adverse events</div></div>
            <div className="inv-clin-stat"><div className="inv-clin-val">503</div><div className="inv-clin-lbl">Participants enrolled</div></div>
            <div className="inv-clin-stat"><div className="inv-clin-val">0%</div><div className="inv-clin-lbl">Widespread discontinuation</div></div>
          </div>
          <p className="inv-clin-note">Observational, non-randomized, non-blinded. Controlled trial and biomarker validation in progress. Peer-reviewed publication planned.</p>
        </div>
      </section>

{/* ░░░ PRODUCT PLATFORM ░░░ */}
      <section className="inv-section inv-light inv-bg-cream" id="products">
        <div className="inv-inner">
          <p className="inv-eyebrow">Product Platform</p>
          <h2>One platform. <em>Multiple product formats.</em></h2>
          <p className="inv-lead">Parallel commercialization across FDA-compliant OTCs, functional foods, dietary supplements, and food additives. Same platform architecture powering every product line.</p>
          <div className="inv-product-lead">
            <div className="inv-product-badge">Lead Product &mdash; Now</div>
            <h3>Slim SHOT</h3>
            <p>60ml daily nanoemulsion. GLP-1/GIP amplification, DPP-4 inhibition, thermogenic activation. Simple protocol: 30ml AM, 30ml PM. No injection. No pharmacy. No prescription.</p>
            <div className="inv-product-price">$145/month</div>
          </div>
          <div className="inv-pipe-grid">
            <div className="inv-pipe-card">
              <div className="inv-pipe-when">2026</div>
              <div className="inv-pipe-name">GLP-1 Sweetener</div>
              <p>World&apos;s first incretin-activating zero-calorie sweetener. Daily-use mass market format delivering GLP-1/GIP activation with every use.</p>
            </div>
            <div className="inv-pipe-card">
              <div className="inv-pipe-when">2026</div>
              <div className="inv-pipe-name">ThermoGEN</div>
              <p>Thermogenic energy drink with incretin-activating ingredients and GLP pathway activation. Convenience format for daily use.</p>
            </div>
            <div className="inv-pipe-card">
              <div className="inv-pipe-when">2027</div>
              <div className="inv-pipe-name">GLP-1 Protein</div>
              <p>High-protein formulation with GLP-1 and GIP benefits for weight management and glycemic control. Lean mass preservation built in.</p>
            </div>
          </div>
        </div>
      </section>

{/* ▓▓▓ COMPETITIVE POSITIONING ▓▓▓ */}
      <section className="inv-section inv-dark" id="competitive">
        <div className="inv-inner">
          <p className="inv-eyebrow">Competitive Positioning</p>
          <h2>Same biology. <em>Different model entirely.</em></h2>
          <p className="inv-lead">Four segments, one white space. NutraGLP occupies the only position with proprietary IP, DPP-4 inhibition, delivery innovation, and no prescription requirement.</p>
          <table className="inv-comp-tbl">
            <thead><tr>
              <th>Segment</th><th>Proprietary IP</th><th>DPP-4 Inhibition</th><th>Delivery</th><th>No Rx</th><th>Key Risk</th>
            </tr></thead>
            <tbody>
              <tr><td>Pharma GLP-1</td><td className="inv-check">&#10003;</td><td className="inv-check">&#10003;</td><td className="inv-check">&#10003;</td><td className="inv-x">&#10007;</td><td>$900+/mo, 50%+ discontinue</td></tr>
              <tr><td>Telehealth Compounders</td><td className="inv-x">&#10007;</td><td className="inv-check">&#10003;</td><td className="inv-x">&#10007;</td><td className="inv-x">&#10007;</td><td>FDA closing window</td></tr>
              <tr><td>GLP-1 Supplements</td><td className="inv-x">&#10007;</td><td className="inv-x">&#10007;</td><td className="inv-x">&#10007;</td><td className="inv-check">&#10003;</td><td>No DPP-4, GLP-1 degraded in minutes</td></tr>
              <tr className="inv-nutra-row"><td>NutraGLP</td><td className="inv-check">&#10003;</td><td className="inv-check">&#10003;</td><td className="inv-check">&#10003;</td><td className="inv-check">&#10003;</td><td>Clinical validation in progress</td></tr>
            </tbody>
          </table>

          <h2 style={{ marginTop: 64 }}>Different regulatory lane. <em>Same validated biology.</em></h2>
          <div className="inv-reg-compare">
            <div className="inv-reg-col inv-reg-bad">
              <h4>Compounded GLP-1</h4>
              <div className="inv-reg-item"><span className="inv-reg-x">&#10007;</span> FDA enforcement discretion ended</div>
              <div className="inv-reg-item"><span className="inv-reg-x">&#10007;</span> Novo/Lilly cease-and-desist orders</div>
              <div className="inv-reg-item"><span className="inv-reg-x">&#10007;</span> 10/10 samples had impurities</div>
              <div className="inv-reg-item"><span className="inv-reg-x">&#10007;</span> Zero safety studies on impurities</div>
              <div className="inv-reg-item"><span className="inv-reg-x">&#10007;</span> Prescription required</div>
            </div>
            <div className="inv-reg-col">
              <h4>NutraGLP Platform</h4>
              <div className="inv-reg-item"><span className="inv-reg-check">&#10003;</span> Drug-free, GRAS-certified</div>
              <div className="inv-reg-item"><span className="inv-reg-check">&#10003;</span> Outside regulatory blast radius</div>
              <div className="inv-reg-item"><span className="inv-reg-check">&#10003;</span> No compounding risk</div>
              <div className="inv-reg-item"><span className="inv-reg-check">&#10003;</span> DSHEA-compliant</div>
              <div className="inv-reg-item"><span className="inv-reg-check">&#10003;</span> No prescription required</div>
            </div>
          </div>
        </div>
      </section>

{/* ░░░ INTELLECTUAL PROPERTY ░░░ */}
      <section className="inv-section inv-light inv-bg-white" id="ip">
        <div className="inv-inner">
          <p className="inv-eyebrow">Intellectual Property</p>
          <h2>Platform-level IP. <em>Not ingredient-level.</em></h2>
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

{/* ░░░ MARKET ░░░ */}
      <section className="inv-section inv-light inv-bg-cream" id="market">
        <div className="inv-inner">
          <p className="inv-eyebrow">Market Opportunity</p>
          <h2>$132B market. <em>No platform-level entrant.</em></h2>
          <p className="inv-lead">GLP-1/GIP and weight-loss market across U.S., Europe, and Asia. A significant population cannot access, afford, or tolerate pharmacologic therapy. No credible non-drug option has existed until now.</p>
          <div className="inv-mkt-stats">
            <div className="inv-mkt-s"><div className="inv-mkt-num">$132B</div><div className="inv-mkt-lbl">Total Addressable Market</div><div className="inv-mkt-sub">by 2030</div></div>
            <div className="inv-mkt-s"><div className="inv-mkt-num">$21B</div><div className="inv-mkt-lbl">Serviceable Addressable Market</div><div className="inv-mkt-sub">GLP-1 discontinuers + $150+/mo spenders</div></div>
            <div className="inv-mkt-s"><div className="inv-mkt-num">$500M+</div><div className="inv-mkt-lbl">Serviceable Obtainable Market</div><div className="inv-mkt-sub">achievable within 3&ndash;4 years</div></div>
          </div>
          <div className="inv-gap-chart">
            <div className="inv-gap-title">The positioning gap NutraGLP occupies</div>
            <div className="inv-gap-row">
              <div className="inv-gap-lbl">Pharmaceutical GLP-1 Drugs <span>$900&ndash;$1,300/mo &middot; Rx required</span></div>
              <div className="inv-gap-track"><div className="inv-gap-fill gf-pharma" style={{ width: '85%' }}>HIGH EFFICACY</div></div>
            </div>
            <div className="inv-gap-arrow">&uarr; THE GAP &mdash; No credible non-drug option until now &darr;</div>
            <div className="inv-gap-row">
              <div className="inv-gap-lbl">NutraGLP Platform <span>$145/mo &middot; No Rx &middot; nanoemulsion</span></div>
              <div className="inv-gap-track"><div className="inv-gap-fill gf-nutra" style={{ width: '45%' }}>ENDOGENOUS AMPLIFICATION</div></div>
            </div>
            <div className="inv-gap-arrow">&darr;</div>
            <div className="inv-gap-row">
              <div className="inv-gap-lbl">Commodity GLP-1 Supplements <span>$20&ndash;$80/mo &middot; No IP</span></div>
              <div className="inv-gap-track"><div className="inv-gap-fill gf-supps" style={{ width: '15%' }}>LOW</div></div>
            </div>
          </div>
          <table className="inv-ma-tbl">
            <thead><tr><th>Transaction</th><th>Acquirer</th><th>Value</th><th>Signal</th></tr></thead>
            <tbody>
              <tr><td>The Bountiful Company</td><td>Nestl&eacute;</td><td>$5.75B</td><td>16.8&times; EBITDA. Consumer health platform. Direct comparable.</td></tr>
              <tr><td>Metsera</td><td>Pfizer</td><td>$10B</td><td>Oral GLP-1 pipeline at pre-revenue stage</td></tr>
              <tr><td>Carmot Therapeutics</td><td>Roche</td><td>$2.7B</td><td>GLP-1/GIP dual agonist, Phase I data</td></tr>
              <tr><td>Inversago Pharma</td><td>Novo Nordisk</td><td>$1.1B</td><td>CB1 receptor inverse agonist for metabolic disease</td></tr>
            </tbody>
          </table>
        </div>
      </section>

{/* ▓▓▓ LEADERSHIP ▓▓▓ */}
      <section className="inv-section inv-dark" id="leadership">
        <div className="inv-inner">
          <p className="inv-eyebrow">Leadership</p>
          <h2>Science, IP, and commercialization. <em>The team that executes.</em></h2>
          <div className="inv-team-grid">
            <div className="inv-team-card">
              <div className="inv-team-role">Science &amp; IP</div>
              <h3>Richard Clark Kaufman, PhD</h3>
              <div className="inv-team-title">Founder &amp; CEO &middot; Chief Science Officer</div>
              <p className="inv-team-bio">Architect of the NutraGLP platform and IP portfolio. Inventor of patented nanoparticle delivery systems across 24+ countries. Co-Founder and CSO of Nanosphere Health Sciences (publicly traded). Frost &amp; Sullivan Nano-Encapsulation Innovation Award recipient.</p>
              <table className="inv-track-tbl">
                <thead><tr><th>Innovation</th><th>Category Created</th><th>Status</th></tr></thead>
                <tbody>
                  <tr><td>Melatonin</td><td>Sleep supplement category</td><td>$1B+ global market</td></tr>
                  <tr><td>5-HTP</td><td>Serotonin precursor supplements</td><td>Global standard</td></tr>
                  <tr><td>CoQ10</td><td>Mitochondrial health</td><td>Ubiquitous category</td></tr>
                  <tr><td>Nano-Delivery</td><td>Nanosphere Health Sciences</td><td>Publicly traded</td></tr>
                  <tr><td>NutraGLP&reg;</td><td>Non-pharma incretin modulation</td><td>Current</td></tr>
                </tbody>
              </table>
            </div>
            <div className="inv-team-card">
              <div className="inv-team-role">Commercial</div>
              <h3>Chris McCann</h3>
              <div className="inv-team-title">Co-Founder &amp; President, Commercialization</div>
              <p className="inv-team-bio">15 years scaling emerging enterprise technology from pre-revenue to category leadership. Led Contentstack from pre-Series A through $85M Series C. Category creation specialist &mdash; built go-to-market engines for commercetools and Typeface before analyst validation. Now building NutraGLP&apos;s commercial machine across a $200B+ TAM. Has done this before.</p>
            </div>
          </div>
        </div>
      </section>

{/* ▓▓▓ CONTACT ▓▓▓ */}
      <section className="inv-section inv-dark" id="contact" style={{ background: 'var(--green-dark)' }}>
        <div className="inv-inner">
          <p className="inv-eyebrow">Get in Touch</p>
          <h2>The biology is proven. The IP is defensible. <em>The market is ready.</em></h2>
          <p className="inv-lead" style={{ marginBottom: 48 }}>We&apos;re in active conversations with strategic and financial investors. If you&apos;re building a position on the GLP-1 economy &mdash; or looking for what comes after compounded pharma &mdash; we&apos;d like to talk.</p>
          <div style={{ marginBottom: 48 }}><a href="mailto:info@nutraglpbio.com" className="inv-btn-gold">Request the Deck &rarr;</a></div>
          <div className="inv-contact-grid">
            <div className="inv-c-card">
              <h3>NutraGLP Biosciences</h3>
              <a href="mailto:info@nutraglpbio.com">info@nutraglpbio.com &rarr;</a>
            </div>
          </div>
        </div>
      </section>

{/* ═══ DISCLAIMER ═══ */}
      <div className="inv-disclaimer">
        <div className="inv-disclaimer-inner">
          <div className="inv-disclaimer-title">Important Disclosures</div>
          <p>NutraGLP Biosciences products are dietary supplements regulated under DSHEA. They are not intended to diagnose, treat, cure, or prevent any disease. The observational study referenced on this page was not a randomized controlled trial &mdash; findings are preliminary and require appropriate scientific qualification before distribution. Forward-looking statements regarding market size, revenue projections, exit valuation, and acquisition timelines involve risk and uncertainty and are not a guarantee of future performance. This page does not constitute an offer to sell or solicitation of an offer to buy any securities. Prospective investors should consult their own professional advisors.</p>
          <p style={{ marginTop: 16 }}>&copy; 2026 NutraGLP Biosciences. All rights reserved. *These statements have not been evaluated by the Food and Drug Administration. This product is not intended to diagnose, treat, cure, or prevent any disease. NutraGLP is a dietary supplement. Consult your healthcare provider before starting any new supplement regimen.</p>
        </div>
      </div>

      <Footer />
      <RequestDeckModal />
    </main>
  );
}
