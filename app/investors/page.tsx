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
html { scroll-behavior: smooth; }
.inv-page {
  --navy-deep: #0a2463;
  --navy: #0066cc;
  --teal: #1585b5;
  --gold: #c8962e;
  --gold-lt: #d4a94a;
  --inv-white: #ffffff;
  --cream: #f8f7f4;
  --cream-warm: #f2f0ec;
  --ink: #1a1a18;
  --ink-mid: #3a3a36;
  --mist: #6b7280;
  --silver: #9ca3af;
  --rule: #e5e5e0;
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
.inv-light h2 { color: var(--navy-deep); }
.inv-light h2 em { color: var(--teal); }
.inv-light .inv-lead { color: var(--ink-mid); }
.inv-light .inv-body { color: var(--mist); }
.inv-light .inv-body strong { color: var(--ink-mid); }

/* Dark section defaults */
.inv-dark { background: var(--navy-deep); }
.inv-dark h2 { color: #fff; }
.inv-dark h2 em { color: var(--gold-lt); }
.inv-dark .inv-eyebrow { color: var(--teal); }
.inv-dark .inv-lead { color: rgba(255,255,255,0.6); }
.inv-dark .inv-body { color: rgba(255,255,255,0.45); }
.inv-dark .inv-body strong { color: rgba(255,255,255,0.75); }

.inv-bg-white { background: var(--inv-white); }
.inv-bg-cream { background: var(--cream-warm); }

/* ═══════════════════ HERO ═══════════════════ */
.inv-hero {
  background: var(--navy-deep);
  padding: 112px 0 88px;
  position: relative; overflow: hidden;
}
.inv-hero::before {
  content: ''; position: absolute; inset: 0;
  background:
    radial-gradient(ellipse 50% 70% at 80% 30%, rgba(21,133,181,0.12) 0%, transparent 70%),
    radial-gradient(ellipse 40% 60% at 10% 80%, rgba(200,150,46,0.06) 0%, transparent 60%);
  pointer-events: none;
}
.inv-hero::after {
  content: ''; position: absolute; bottom: 0; left: 0; right: 0; height: 1px;
  background: linear-gradient(90deg, transparent 0%, rgba(21,133,181,0.4) 50%, transparent 100%);
}
.inv-hero-inner { max-width: 1100px; margin: 0 auto; padding: 0 48px; box-sizing: border-box; position: relative; }
.inv-hero-eyebrow {
  font-size: 11px; font-weight: 600;
  letter-spacing: 0.14em; text-transform: uppercase;
  color: var(--teal); margin-bottom: 24px;
}
.inv-hero h1 {
  font-family: 'Fraunces', Georgia, serif;
  font-size: clamp(38px, 5vw, 60px);
  font-weight: 500; line-height: 1.1;
  letter-spacing: -0.025em;
  color: #fff; margin-bottom: 24px;
  font-optical-sizing: auto;
}
.inv-hero h1 em {
  font-style: italic; font-weight: 400;
  color: var(--gold-lt);
}
.inv-hero-sub {
  font-size: 17px; font-weight: 400;
  color: rgba(255,255,255,0.55);
  max-width: 600px; line-height: 1.7; margin-bottom: 40px;
}
.inv-hero-ctas {
  display: flex; align-items: center; gap: 20px; margin-bottom: 64px;
}
.inv-btn-gold {
  display: inline-flex; align-items: center; gap: 8px;
  background: var(--gold); color: var(--navy-deep);
  padding: 13px 28px; border-radius: 4px;
  font-size: 14px; font-weight: 600;
  text-decoration: none; transition: all 0.2s;
  border: none; cursor: pointer;
}
.inv-btn-gold:hover { background: var(--gold-lt); transform: translateY(-1px); }
.inv-btn-outline {
  display: inline-flex; align-items: center; gap: 8px;
  background: transparent; color: rgba(255,255,255,0.65);
  padding: 13px 24px; border-radius: 4px;
  font-size: 14px; font-weight: 500;
  text-decoration: none; transition: all 0.2s;
  border: 1px solid rgba(255,255,255,0.15);
}
.inv-btn-outline:hover { border-color: rgba(255,255,255,0.3); color: #fff; }

/* Hero stats */
.inv-hero-stats {
  display: grid; grid-template-columns: repeat(4, 1fr);
  border-top: 1px solid rgba(255,255,255,0.14); padding-top: 40px;
}
.inv-h-stat { padding-right: 24px; position: relative; }
.inv-h-stat:not(:last-child)::after {
  content: ''; position: absolute; right: 0; top: 0; bottom: 0;
  width: 1px; background: rgba(255,255,255,0.14);
}
.inv-h-stat:not(:first-child) { padding-left: 24px; }
.inv-h-stat-val {
  font-family: 'Fraunces', Georgia, serif;
  font-size: clamp(40px, 4vw, 48px); font-weight: 600;
  color: #fff; line-height: 1; letter-spacing: -0.03em;
  font-optical-sizing: auto;
}
.inv-h-stat-label {
  font-size: 13px; font-weight: 500;
  letter-spacing: 0.04em; text-transform: uppercase;
  color: rgba(255,255,255,0.70); margin-top: 10px; line-height: 1.35;
}

/* ═══════════════════ PLATFORM ═══════════════════ */
.inv-plat-grid {
  display: grid; grid-template-columns: repeat(3, 1fr);
  gap: 0; margin-top: 48px; border-radius: 8px; overflow: hidden;
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
.inv-plat-card:nth-child(3) .inv-plat-top { background: var(--navy); }
.inv-plat-num {
  font-family: 'Fraunces', Georgia, serif;
  font-size: 48px; font-weight: 500;
  color: var(--rule); line-height: 1; margin-bottom: 14px;
}
.inv-plat-card h3 {
  font-family: 'Fraunces', Georgia, serif;
  font-size: 19px; font-weight: 500;
  color: var(--navy-deep); margin-bottom: 10px;
}
.inv-plat-card p { font-size: 14px; color: var(--mist); line-height: 1.7; margin: 0; }

/* ═══════════════════ IP CARDS ═══════════════════ */
.inv-ip-grid {
  display: grid; grid-template-columns: repeat(3, 1fr);
  gap: 20px; margin-top: 48px;
}
.inv-ip-card {
  background: rgba(255,255,255,0.04);
  border: 1px solid rgba(255,255,255,0.06);
  border-radius: 8px; padding: 36px 28px;
  position: relative; overflow: hidden;
}
.inv-ip-card::after {
  content: ''; position: absolute; top: -40px; right: -40px;
  width: 100px; height: 100px; border-radius: 50%;
  background: rgba(21,133,181,0.08);
}
.inv-ip-val {
  font-family: 'Fraunces', Georgia, serif;
  font-size: 52px; font-weight: 600;
  color: var(--gold-lt); line-height: 1;
  letter-spacing: -0.04em; font-optical-sizing: auto;
}
.inv-ip-sub {
  font-size: 11px; font-weight: 600;
  letter-spacing: 0.08em; text-transform: uppercase;
  color: var(--teal); margin-top: 4px; margin-bottom: 20px;
}
.inv-ip-card h3 {
  font-family: 'Fraunces', Georgia, serif;
  font-size: 17px; font-weight: 500;
  color: #fff; margin-bottom: 10px;
}
.inv-ip-card > p {
  font-size: 14px; color: rgba(255,255,255,0.5);
  line-height: 1.7; margin: 0; position: relative;
}

/* Barrier block */
.inv-barrier {
  margin-top: 48px; padding: 40px;
  background: rgba(255,255,255,0.03);
  border: 1px solid rgba(255,255,255,0.06); border-radius: 8px;
}
.inv-barrier h3 {
  font-family: 'Fraunces', Georgia, serif;
  font-size: 19px; font-weight: 500;
  color: #fff; margin-bottom: 20px;
}
.inv-barrier-cols {
  display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px;
}
.inv-barrier-step { position: relative; padding-left: 20px; }
.inv-barrier-step::before {
  content: ''; position: absolute; left: 0; top: 6px;
  width: 8px; height: 8px; border-radius: 50%; background: var(--teal);
}
.inv-barrier-step h4 {
  font-size: 14px; font-weight: 600;
  color: var(--gold-lt); margin-bottom: 6px;
}
.inv-barrier-step p {
  font-size: 13px; color: rgba(255,255,255,0.45); line-height: 1.65; margin: 0;
}

/* Geo row */
.inv-geo-row {
  display: flex; align-items: center; gap: 20px;
  margin-top: 36px; padding-top: 28px;
  border-top: 1px solid rgba(255,255,255,0.06);
}
.inv-geo-num {
  font-family: 'Fraunces', Georgia, serif;
  font-size: 48px; font-weight: 600;
  color: var(--gold-lt); line-height: 1;
  letter-spacing: -0.04em; flex-shrink: 0;
}
.inv-geo-text { font-size: 14px; color: rgba(255,255,255,0.55); line-height: 1.6; }
.inv-geo-text strong { color: rgba(255,255,255,0.8); font-weight: 600; }

/* Competitive table */
.inv-comp-tbl {
  width: 100%; border-collapse: collapse;
  margin-top: 40px; border-radius: 8px; overflow: hidden; font-size: 13px;
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

/* ═══════════════════ POC ═══════════════════ */
.inv-poc-block {
  background: var(--navy-deep); border-radius: 8px; padding: 52px;
  margin-top: 48px; position: relative; overflow: hidden;
}
.inv-poc-block::before {
  content: ''; position: absolute; top: -80px; right: -80px;
  width: 300px; height: 300px; border-radius: 50%;
  background: rgba(21,133,181,0.06);
}
.inv-poc-layout {
  display: grid; grid-template-columns: 1.2fr 1fr;
  gap: 48px; align-items: center;
}
.inv-poc-text h3 {
  font-family: 'Fraunces', Georgia, serif;
  font-size: 24px; font-weight: 500;
  color: #fff; line-height: 1.25; margin-bottom: 16px;
}
.inv-poc-text p { color: rgba(255,255,255,0.55); font-size: 15px; line-height: 1.75; margin-bottom: 12px; }
.inv-poc-caveat { font-style: italic; font-size: 13px !important; color: rgba(255,255,255,0.3) !important; margin-top: 16px !important; }
.inv-poc-nums { display: flex; flex-direction: column; gap: 24px; }
.inv-poc-row { display: flex; align-items: baseline; gap: 14px; }
.inv-poc-big {
  font-family: 'Fraunces', Georgia, serif;
  font-size: 54px; font-weight: 600;
  color: var(--gold-lt); line-height: 1; letter-spacing: -0.04em;
}
.inv-poc-lbl { font-size: 14px; color: rgba(255,255,255,0.55); line-height: 1.4; }
.inv-mid-cta {
  background: rgba(21,133,181,0.06);
  border: 1px solid rgba(21,133,181,0.15);
  border-radius: 8px; padding: 28px 36px;
  display: flex; align-items: center; justify-content: space-between;
  margin-top: 40px;
}
.inv-mid-cta p { font-size: 15px; color: var(--ink-mid); margin: 0; }
.inv-mid-cta p strong { color: var(--navy-deep); }

/* ═══════════════════ MARKET ═══════════════════ */
.inv-mkt-stats {
  display: grid; grid-template-columns: repeat(3, 1fr);
  gap: 0; margin-top: 48px; border-radius: 8px; overflow: hidden;
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
  color: var(--navy-deep); line-height: 1; letter-spacing: -0.03em;
}
.inv-mkt-lbl { font-size: 13px; font-weight: 600; color: var(--mist); margin-top: 8px; }
.inv-mkt-sub { font-size: 12px; color: var(--silver); margin-top: 3px; }

/* Gap chart */
.inv-gap-chart {
  margin-top: 48px; padding: 36px;
  background: var(--inv-white); border: 1px solid var(--rule); border-radius: 8px;
}
.inv-gap-title {
  font-family: 'Fraunces', Georgia, serif;
  font-size: 17px; font-weight: 500;
  color: var(--navy-deep); margin-bottom: 28px;
}
.inv-gap-row { margin-bottom: 20px; }
.inv-gap-row:last-child { margin-bottom: 0; }
.inv-gap-lbl {
  font-size: 13px; font-weight: 600;
  color: var(--ink-mid); margin-bottom: 6px;
  display: flex; justify-content: space-between;
}
.inv-gap-lbl span { font-weight: 400; color: var(--silver); font-size: 12px; }
.inv-gap-track { height: 28px; background: var(--cream); border-radius: 4px; overflow: hidden; }
.inv-gap-fill {
  height: 100%; border-radius: 4px;
  display: flex; align-items: center; padding-left: 12px;
  font-size: 11px; font-weight: 700; letter-spacing: 0.03em;
  transition: width 1s cubic-bezier(0.4, 0, 0.2, 1);
}
.inv-gap-fill.gf-pharma { background: var(--navy-deep); color: #fff; }
.inv-gap-fill.gf-nutra  { background: var(--teal); color: #fff; }
.inv-gap-fill.gf-supps  { background: var(--silver); color: #fff; }
.inv-gap-arrow {
  text-align: center; padding: 10px 0;
  font-size: 12px; font-weight: 700; color: var(--teal); letter-spacing: 0.06em;
}

/* M&A table */
.inv-ma-tbl {
  width: 100%; border-collapse: collapse;
  margin-top: 48px; border-radius: 8px; overflow: hidden;
  border: 1px solid var(--rule);
}
.inv-ma-tbl th {
  font-size: 11px; font-weight: 700;
  letter-spacing: 0.1em; text-transform: uppercase;
  color: #fff; background: var(--navy-deep);
  padding: 14px 20px; text-align: left;
}
.inv-ma-tbl td {
  padding: 14px 20px; font-size: 14px;
  color: var(--ink-mid); border-bottom: 1px solid var(--rule); vertical-align: top;
}
.inv-ma-tbl tr:last-child td { border-bottom: none; }
.inv-ma-tbl tr:nth-child(even) td { background: var(--cream); }
.inv-ma-tbl tr:nth-child(odd) td { background: var(--inv-white); }
.inv-ma-tbl td:first-child { font-weight: 600; color: var(--navy-deep); }
.inv-ma-tbl td:nth-child(3) { font-weight: 600; color: var(--gold); white-space: nowrap; }
.inv-ma-tbl td:last-child { font-size: 13px; color: var(--mist); }

/* ═══════════════════ ROADMAP ═══════════════════ */
.inv-roadmap {
  display: grid; grid-template-columns: repeat(4, 1fr);
  gap: 0; margin-top: 48px; position: relative;
}
.inv-roadmap::before {
  content: ''; position: absolute; top: 24px; left: 6%; right: 6%;
  height: 2px;
  background: linear-gradient(90deg, var(--teal) 0%, var(--teal) 25%, rgba(255,255,255,0.1) 25%);
}
.inv-rm-step { text-align: center; position: relative; padding-top: 52px; }
.inv-rm-dot {
  position: absolute; top: 14px; left: 50%; transform: translateX(-50%);
  width: 20px; height: 20px; border-radius: 50%;
  border: 3px solid var(--teal); background: var(--navy-deep);
}
.inv-rm-step:first-child .inv-rm-dot { background: var(--teal); }
.inv-rm-phase {
  font-size: 11px; font-weight: 700;
  letter-spacing: 0.1em; text-transform: uppercase;
  color: var(--teal); margin-bottom: 6px;
}
.inv-rm-title {
  font-family: 'Fraunces', Georgia, serif;
  font-size: 17px; font-weight: 500;
  color: #fff; margin-bottom: 14px;
}
.inv-rm-items { list-style: none; display: flex; flex-direction: column; gap: 6px; text-align: left; padding: 0 8px; }
.inv-rm-items li {
  font-size: 13px; color: rgba(255,255,255,0.5);
  line-height: 1.5; padding-left: 14px; position: relative;
}
.inv-rm-items li::before {
  content: '\\2192'; position: absolute; left: 0;
  color: var(--teal); font-size: 11px;
}

/* ═══════════════════ THE RAISE ═══════════════════ */
.inv-raise-grid {
  display: grid; grid-template-columns: 1fr 1fr;
  gap: 24px; margin-top: 48px;
}
.inv-raise-card {
  background: var(--inv-white); border: 1px solid var(--rule);
  border-radius: 8px; padding: 36px;
}
.inv-raise-card h3 {
  font-family: 'Fraunces', Georgia, serif;
  font-size: 19px; font-weight: 500;
  color: var(--navy-deep); margin-bottom: 24px;
}
.inv-fund-row { margin-bottom: 18px; }
.inv-fund-row:last-child { margin-bottom: 0; }
.inv-fund-lbl {
  display: flex; justify-content: space-between;
  font-size: 13px; font-weight: 600;
  color: var(--ink-mid); margin-bottom: 5px;
}
.inv-fund-lbl span { color: var(--teal); font-weight: 700; }
.inv-fund-track { height: 7px; background: var(--cream); border-radius: 4px; overflow: hidden; }
.inv-fund-fill {
  height: 100%; border-radius: 4px; background: var(--navy-deep);
  transition: width 1s cubic-bezier(0.4, 0, 0.2, 1);
}
.inv-exit-list { list-style: none; display: flex; flex-direction: column; gap: 10px; padding: 0; }
.inv-exit-list li {
  font-size: 14px; color: var(--ink-mid);
  display: flex; gap: 10px; align-items: flex-start; line-height: 1.6;
}
.inv-exit-list li::before {
  content: '\\2192'; color: var(--teal);
  font-size: 12px; margin-top: 3px; flex-shrink: 0;
}

/* ═══════════════════ CONTACT ═══════════════════ */
.inv-contact-grid {
  display: grid; grid-template-columns: 1fr 1fr;
  gap: 48px; margin-top: 48px;
}
.inv-c-card { border-top: 2px solid var(--teal); padding-top: 24px; }
.inv-c-role {
  font-size: 11px; font-weight: 600;
  letter-spacing: 0.12em; text-transform: uppercase;
  color: var(--teal); margin-bottom: 6px;
}
.inv-c-card h3 {
  font-family: 'Fraunces', Georgia, serif;
  font-size: 22px; font-weight: 500;
  color: #fff; margin-bottom: 4px;
}
.inv-c-title { font-size: 14px; color: rgba(255,255,255,0.45); margin-bottom: 16px; }
.inv-c-card a {
  display: inline-flex; align-items: center; gap: 6px;
  font-size: 15px; font-weight: 500;
  color: #fff; text-decoration: none;
  border-bottom: 1px solid rgba(21,133,181,0.4);
  padding-bottom: 2px; transition: all 0.2s;
}
.inv-c-card a:hover { color: var(--teal); border-color: var(--teal); }

/* ═══════════════════ DECK FORM ═══════════════════ */
.inv-deck-form-wrap {
  margin-top: 40px; margin-bottom: 56px;
  padding: 40px; border-radius: 8px;
  background: rgba(255,255,255,0.04);
  border: 1px solid rgba(255,255,255,0.06);
}

/* ═══════════════════ DISCLAIMER ═══════════════════ */
.inv-disclaimer {
  background: var(--cream-warm);
  padding: 28px 48px; border-top: 1px solid var(--rule);
}
.inv-disclaimer p {
  font-size: 12px; color: var(--silver);
  max-width: 960px; margin: 0 auto; line-height: 1.8;
}

/* ═══════════════════ STICKY CTA ═══════════════════ */
.inv-sticky-btn {
  position: fixed; bottom: 24px; right: 24px; z-index: 90;
  opacity: 0; transform: translateY(16px);
  transition: all 0.4s ease; pointer-events: none;
}
.inv-sticky-btn.show { opacity: 1; transform: translateY(0); pointer-events: all; }
.inv-sticky-btn .inv-btn-gold {
  box-shadow: 0 6px 24px rgba(10,36,99,0.25);
  font-size: 13px; padding: 11px 22px;
}


/* ═══════════════════ THE PROBLEM ═══════════════════ */
.inv-prob-stats {
  display: grid; grid-template-columns: repeat(4, 1fr);
  gap: 0; margin-top: 48px; border-top: 1px solid rgba(255,255,255,0.08);
  padding-top: 40px;
}
.inv-prob-stat { padding-right: 24px; position: relative; }
.inv-prob-stat:not(:last-child)::after {
  content: ''; position: absolute; right: 0; top: 0; bottom: 0;
  width: 1px; background: rgba(255,255,255,0.08);
}
.inv-prob-stat:not(:first-child) { padding-left: 24px; }
.inv-prob-val {
  font-family: 'Fraunces', Georgia, serif;
  font-size: clamp(24px, 2.5vw, 34px); font-weight: 600;
  color: var(--gold-lt); line-height: 1; letter-spacing: -0.03em;
  margin-bottom: 8px; font-optical-sizing: auto;
}
.inv-prob-lbl { font-size: 13px; color: rgba(255,255,255,0.5); line-height: 1.6; }

/* ═══════════════════ REGULATORY CATALYST ═══════════════════ */
.inv-reg-stats {
  display: grid; grid-template-columns: repeat(4, 1fr);
  gap: 0; margin-top: 48px; border-radius: 8px; overflow: hidden;
  border: 1px solid var(--rule);
}
.inv-reg-stat {
  padding: 28px 24px; background: var(--inv-white);
  border-right: 1px solid var(--rule); text-align: center;
}
.inv-reg-stat:last-child { border-right: none; }
.inv-reg-val {
  font-family: 'Fraunces', Georgia, serif;
  font-size: 36px; font-weight: 600;
  color: var(--navy-deep); line-height: 1; letter-spacing: -0.03em;
  margin-bottom: 8px;
}
.inv-reg-lbl { font-size: 12px; color: var(--mist); line-height: 1.5; }
.inv-reg-box {
  margin-top: 32px; padding: 24px 32px;
  background: rgba(10,36,99,0.05);
  border-left: 3px solid var(--navy-deep);
  border-radius: 0 8px 8px 0;
}
.inv-reg-box p { font-size: 15px; color: var(--ink-mid); line-height: 1.75; margin: 0; }
.inv-reg-box strong { color: var(--navy-deep); font-weight: 600; }

/* ═══════════════════ CLINICAL VALIDATION ═══════════════════ */
.inv-clinical-grid {
  display: grid; grid-template-columns: repeat(4, 1fr);
  gap: 0; margin-top: 48px; border-radius: 8px; overflow: hidden;
  border: 1px solid var(--rule);
}
.inv-clinical-card {
  padding: 32px 24px; background: var(--inv-white);
  border-right: 1px solid var(--rule); position: relative;
}
.inv-clinical-card:last-child { border-right: none; }
.inv-clinical-card.done { background: var(--cream); }
.inv-clinical-badge {
  display: inline-block; font-size: 11px; font-weight: 700;
  letter-spacing: 0.08em; text-transform: uppercase;
  padding: 4px 10px; border-radius: 3px; margin-bottom: 16px;
}
.inv-clinical-badge.done { background: rgba(21,133,181,0.1); color: var(--teal); }
.inv-clinical-badge.planned { background: rgba(107,114,128,0.08); color: var(--mist); }
.inv-clinical-card h4 {
  font-family: 'Fraunces', Georgia, serif;
  font-size: 16px; font-weight: 500;
  color: var(--navy-deep); margin-bottom: 10px;
}
.inv-clinical-card p { font-size: 13px; color: var(--mist); line-height: 1.7; margin: 0; }

/* ═══════════════════ TELEHEALTH ═══════════════════ */
.inv-tel-grid {
  display: grid; grid-template-columns: repeat(3, 1fr);
  gap: 0; margin-top: 48px; border-radius: 8px; overflow: hidden;
  border: 1px solid rgba(255,255,255,0.06);
}
.inv-tel-card {
  padding: 32px 28px; background: rgba(255,255,255,0.03);
  border-right: 1px solid rgba(255,255,255,0.06);
}
.inv-tel-card:last-child { border-right: none; }
.inv-tel-card h4 {
  font-family: 'Fraunces', Georgia, serif;
  font-size: 18px; font-weight: 500;
  color: var(--gold-lt); margin-bottom: 10px;
}
.inv-tel-card p { font-size: 14px; color: rgba(255,255,255,0.5); line-height: 1.7; margin: 0; }

/* ═══════════════════ PIPELINE ═══════════════════ */
.inv-pipe-grid {
  display: grid; grid-template-columns: repeat(4, 1fr);
  gap: 0; margin-top: 48px; border-radius: 8px; overflow: hidden;
  border: 1px solid var(--rule);
}
.inv-pipe-card {
  padding: 32px 24px; background: var(--inv-white);
  border-right: 1px solid var(--rule);
}
.inv-pipe-card:last-child { border-right: none; }
.inv-pipe-card:nth-child(1) { background: var(--cream); }
.inv-pipe-when {
  font-size: 11px; font-weight: 700;
  letter-spacing: 0.1em; text-transform: uppercase;
  color: var(--teal); margin-bottom: 8px;
}
.inv-pipe-name {
  font-family: 'Fraunces', Georgia, serif;
  font-size: 20px; font-weight: 500;
  color: var(--navy-deep); margin-bottom: 12px;
}
.inv-pipe-card p { font-size: 13px; color: var(--mist); line-height: 1.7; margin: 0; }

/* ═══════════════════ TEAM ═══════════════════ */
.inv-team-grid {
  display: grid; grid-template-columns: 1fr 1fr;
  gap: 24px; margin-top: 48px;
}
.inv-team-card {
  background: rgba(255,255,255,0.04);
  border: 1px solid rgba(255,255,255,0.06);
  border-radius: 8px; padding: 40px;
  position: relative; overflow: hidden;
}
.inv-team-card::before {
  content: ''; position: absolute; top: 0; left: 0; right: 0;
  height: 3px; background: linear-gradient(90deg, var(--teal) 0%, var(--navy) 100%);
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
  line-height: 1.75; margin-bottom: 24px;
}
.inv-team-highlights {
  display: flex; flex-direction: column; gap: 8px;
  padding-top: 20px; border-top: 1px solid rgba(255,255,255,0.06);
}
.inv-team-hl {
  font-size: 12px; color: rgba(255,255,255,0.45);
  padding-left: 18px; position: relative; line-height: 1.5;
}
.inv-team-hl::before {
  content: '\\2192'; position: absolute; left: 0;
  color: var(--teal); font-size: 11px;
}

/* ═══════════════════ FAQ ═══════════════════ */
.inv-faq-grid {
  display: grid; grid-template-columns: 1fr 1fr;
  gap: 24px; margin-top: 48px;
}
.inv-faq-card {
  background: var(--cream-warm); border-radius: 8px; padding: 32px;
  border: 1px solid var(--rule);
}
.inv-faq-q {
  font-family: 'Fraunces', Georgia, serif;
  font-size: 17px; font-weight: 500;
  color: var(--navy-deep); margin-bottom: 12px;
}
.inv-faq-a { font-size: 14px; color: var(--mist); line-height: 1.75; margin: 0; }

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
.inv-reveal { opacity: 0; transform: translateY(18px); transition: opacity 0.5s ease, transform 0.5s ease; }
.inv-reveal.vis { opacity: 1; transform: translateY(0); }

/* ═══════════════════ RESPONSIVE ═══════════════════ */
@media (max-width: 900px) {
  .inv-prob-stats { grid-template-columns: repeat(2, 1fr); gap: 20px; }
  .inv-reg-stats { grid-template-columns: repeat(2, 1fr); }
  .inv-reg-stat:nth-child(2) { border-right: none; }
  .inv-clinical-grid { grid-template-columns: 1fr 1fr; }
  .inv-clinical-card { border-right: none; border-bottom: 1px solid var(--rule); }
  .inv-tel-grid { grid-template-columns: 1fr; }
  .inv-tel-card { border-right: none; border-bottom: 1px solid rgba(255,255,255,0.06); }
  .inv-pipe-grid { grid-template-columns: 1fr 1fr; }
  .inv-pipe-card { border-right: none; border-bottom: 1px solid var(--rule); }
  .inv-team-grid { grid-template-columns: 1fr; }
  .inv-faq-grid { grid-template-columns: 1fr; }

  .inv-section { padding: 64px 0; }
  .inv-inner { padding: 0 24px; }
  .inv-hero-inner { padding: 0 24px; }
  .inv-hero { padding: 96px 0 60px; }
  .inv-hero-stats { grid-template-columns: repeat(2, 1fr); gap: 20px; }
  .inv-h-stat::after { display: none; }
  .inv-h-stat:not(:first-child) { padding-left: 0; }
  .inv-plat-grid, .inv-ip-grid { grid-template-columns: 1fr; }
  .inv-barrier-cols { grid-template-columns: 1fr; }
  .inv-plat-card { border-right: none; border-bottom: 1px solid var(--rule); }
  .inv-plat-card:last-child { border-bottom: none; }
  .inv-poc-layout { grid-template-columns: 1fr; gap: 32px; }
  .inv-poc-block { padding: 32px 24px; }
  .inv-mkt-stats { grid-template-columns: 1fr; }
  .inv-mkt-s { border-right: none; border-bottom: 1px solid var(--rule); }
  .inv-mkt-s:last-child { border-bottom: none; }
  .inv-roadmap { grid-template-columns: 1fr; gap: 28px; }
  .inv-roadmap::before { display: none; }
  .inv-rm-step { padding-top: 0; padding-left: 36px; text-align: left; }
  .inv-rm-dot { top: 2px; left: 0; }
  .inv-raise-grid { grid-template-columns: 1fr; }
  .inv-contact-grid { grid-template-columns: 1fr; }
  .inv-mid-cta { flex-direction: column; gap: 14px; text-align: center; }
}
          `,
        }}
      />

{/* ▓▓▓ HERO ▓▓▓ */}
      <section className="inv-hero">
        <div className="inv-hero-inner">
          <p className="inv-hero-eyebrow">NutraGLP Biosciences — Investor Overview</p>
          <h1>A new class of<br /><em>bioactive signaling molecules.</em></h1>
          <p className="inv-hero-sub">For weight loss and glycemic control — delivered as consumer supplements and foods. Drug-level biology. Consumer-scale distribution. No prescription required.</p>
          <div className="inv-hero-ctas">
            <a href="#deck" className="inv-btn-gold">Request the Deck →</a>
            <a href="#platform" className="inv-btn-outline">Read the Thesis</a>
          </div>
          <div className="inv-hero-stats">
            <div className="inv-h-stat"><div className="inv-h-stat-val">$5.5M</div><div className="inv-h-stat-label">Seed Round</div></div>
            <div className="inv-h-stat"><div className="inv-h-stat-val">40+</div><div className="inv-h-stat-label">Patent-Pending Formulations</div></div>
            <div className="inv-h-stat"><div className="inv-h-stat-val">13</div><div className="inv-h-stat-label">Validated Signaling Targets</div></div>
            <div className="inv-h-stat"><div className="inv-h-stat-val">8×</div><div className="inv-h-stat-label">Bioavailability vs Standard Oral</div></div>
          </div>
        </div>
      </section>

      {/* ▓▓▓ THE PROBLEM — dark ▓▓▓ */}
      <section className="inv-section inv-dark">
        <div className="inv-inner inv-reveal">
          <p className="inv-eyebrow">The Problem</p>
          <h2>GLP-1 drugs work.<br /><em>But they&apos;re failing patients.</em></h2>
          <p className="inv-lead">3,000+ active GLP-1/GIP lawsuits in the U.S. Muscle loss. Collagen degradation. Weight regain after discontinuation. The market demands a safer, effective, drug-free alternative.</p>
          <div className="inv-prob-stats">
            <div className="inv-prob-stat">
              <div className="inv-prob-val">130M+</div>
              <div className="inv-prob-lbl">Adults with overweight or obesity in the U.S. — one of the largest unaddressed therapeutic markets</div>
            </div>
            <div className="inv-prob-stat">
              <div className="inv-prob-val">$900–$1,200</div>
              <div className="inv-prob-lbl">Monthly out-of-pocket cost for branded GLP-1/GIP drugs</div>
            </div>
            <div className="inv-prob-stat">
              <div className="inv-prob-val">70%+</div>
              <div className="inv-prob-lbl">Of patients experience adverse effects including nausea, serious GI events, muscle and collagen loss</div>
            </div>
            <div className="inv-prob-stat">
              <div className="inv-prob-val">50%+</div>
              <div className="inv-prob-lbl">Discontinue within 12 months. Most regain lost weight after stopping.</div>
            </div>
          </div>
        </div>
      </section>

      {/* ░░░ REGULATORY CATALYST — cream ░░░ */}
      <section className="inv-section inv-light inv-bg-cream">
        <div className="inv-inner inv-reveal">
          <p className="inv-eyebrow">Regulatory Catalyst</p>
          <h2>Compounded GLP-1s under fire.<br /><em>The window is open.</em></h2>
          <p className="inv-lead">The FDA ended enforcement discretion on compounded GLP-1s after Lilly found unknown impurities in all compounded tirzepatide samples tested. Novo Nordisk and Eli Lilly are issuing cease-and-desist orders across the entire compounding supply chain.</p>
          <div className="inv-reg-stats">
            <div className="inv-reg-stat">
              <div className="inv-reg-val">10/10</div>
              <div className="inv-reg-lbl">Lilly-tested compounded samples had impurities</div>
            </div>
            <div className="inv-reg-stat">
              <div className="inv-reg-val">FDA</div>
              <div className="inv-reg-lbl">Ended enforcement discretion — shortage resolved</div>
            </div>
            <div className="inv-reg-stat">
              <div className="inv-reg-val">Zero</div>
              <div className="inv-reg-lbl">Safety studies on compounded impurities existed</div>
            </div>
            <div className="inv-reg-stat">
              <div className="inv-reg-val">C&amp;D</div>
              <div className="inv-reg-lbl">Cease-and-desist orders across entire supply chain</div>
            </div>
          </div>
          <div className="inv-reg-box">
            <p>NutraGLP is <strong>drug-free, GRAS-certified, and entirely outside this regulatory blast radius.</strong> The compounding window is closing precisely as NutraGLP moves to market — creating a structural demand gap for a compliant, effective alternative.</p>
          </div>
        </div>
      </section>

      {/* ░░░ PLATFORM — white ░░░ */}
      <section className="inv-section inv-light inv-bg-white" id="platform">
        <div className="inv-inner inv-reveal">
          <p className="inv-eyebrow">The Platform</p>
          <h2>Not a supplement company.<br /><em>A biotechnology platform.</em></h2>
          <p className="inv-lead">NutraGLP is a non-pharmaceutical biotechnology platform. It occupies a new class that bridges pharmaceuticals, foods, and supplements — engineered as a coordinated signaling architecture with multiple mechanisms including natural incretin hormone activation (GLP-1, GIP), DPP-4 inhibition, blood glucose control, and thermogenesis.</p>
          <p className="inv-body"><strong>The system design — not any single ingredient — is the defensible moat.</strong> Defended through a patent-pending architecture of more than 40 foods, supplements, and food additives, with platform-level formulation systems and delivery technologies designed for reproducibility and scalability.</p>
          <div className="inv-plat-grid">
            <div className="inv-plat-card"><div className="inv-plat-top"></div><div className="inv-plat-num">01</div><h3>Drug-Level Biology</h3><p>Amplifies GLP-1, GIP, and downstream signaling pathways using GRAS-certified bioactives — no synthetic peptides, no prescription required. Activates the same validated biology as pharmacologic therapy.</p></div>
            <div className="inv-plat-card"><div className="inv-plat-top"></div><div className="inv-plat-num">02</div><h3>Consumer-Scale Distribution</h3><p>Delivered as OTCs, supplements, and functional foods across DTC, telehealth, retail pharmacy, and clinical channels simultaneously. Platform-based commercialization — not a single-product business.</p></div>
            <div className="inv-plat-card"><div className="inv-plat-top"></div><div className="inv-plat-num">03</div><h3>Prescription-Free Access</h3><p>No injection. No pharmacy. No prescription. $145/month versus $900–$1,300/month for pharmacologic alternatives. Outcomes comparable to Ozempic and Mounjaro. Every barrier to patient access removed.</p></div>
          </div>
        </div>
      </section>

      {/* ▓▓▓ IP & DEFENSIBILITY — dark ▓▓▓ */}
      <section className="inv-section inv-dark">
        <div className="inv-inner inv-reveal">
          <p className="inv-eyebrow">IP &amp; Defensibility</p>
          <h2>Three layers of <em>compounding protection.</em></h2>
          <p className="inv-lead">The IP strategy creates compounding defensibility. Each layer reinforces the others. A competitor cannot replicate the platform by copying a single formulation — they would need to independently develop all three.</p>

          <div className="inv-ip-grid">
            <div className="inv-ip-card">
              <div className="inv-ip-val">40+</div><div className="inv-ip-sub">patent-pending</div>
              <h3>Formulation IP</h3>
              <p>Methods combining natural GLP-1 and GIP secretagogues with DPP-4 inhibitors to increase systemic incretin delivery. Cell-signaling pathway compositions for weight loss and glucose regulation. Each formulation independently defensible.</p>
            </div>
            <div className="inv-ip-card">
              <div className="inv-ip-val">8×</div><div className="inv-ip-sub">bioavailability</div>
              <h3>Delivery IP</h3>
              <p>Proprietary nanoemulsion system protected independently from the active formulations it carries. Developed over two decades of nano-encapsulation research. The delivery platform is the second moat.</p>
            </div>
            <div className="inv-ip-card">
              <div className="inv-ip-val">13</div><div className="inv-ip-sub">signaling targets</div>
              <h3>System Design IP</h3>
              <p>The coordinated activation architecture itself is the invention. Targeting multiple pathways simultaneously — which pathways, what combination, what timing — is proprietary knowledge that does not exist outside this platform.</p>
            </div>
          </div>

          <div className="inv-geo-row">
            <div className="inv-geo-num">24+</div>
            <div className="inv-geo-text"><strong>Countries with patent protection</strong> covering nanoparticle delivery systems for nutraceutical and pharmaceutical biotechnology applications. The delivery IP originated from the founder&apos;s work at Nanosphere Health Sciences (publicly traded), which earned the Frost &amp; Sullivan Nano-Encapsulation Innovation Award.</div>
          </div>

          <div className="inv-barrier">
            <h3>What it would take to replicate this platform</h3>
            <div className="inv-barrier-cols">
              <div className="inv-barrier-step">
                <h4>Reverse-engineer 40+ formulations</h4>
                <p>Each formulation uses synergistic multi-compound combinations. Copying a single ingredient does nothing — the interactions between compounds across 13 signaling targets are the mechanism. Years of combinatorial research.</p>
              </div>
              <div className="inv-barrier-step">
                <h4>Independently develop nanoemulsion delivery</h4>
                <p>The delivery system is protected by separate patent claims across 24+ countries. A competitor would need to invent an alternative nano-carrier from scratch — and prove equivalent bioavailability. This took two decades.</p>
              </div>
              <div className="inv-barrier-step">
                <h4>Discover the system architecture</h4>
                <p>The coordinated multi-pathway activation model is not documented in any published literature. The signaling stack — which pathways to activate, in what combination, with what timing — is proprietary knowledge that does not exist outside this platform.</p>
              </div>
            </div>
          </div>

          <h3 style={{ fontFamily: "'Fraunces', Georgia, serif", fontSize: 19, fontWeight: 500, color: '#fff', marginTop: 48, marginBottom: 6 }}>Four segments. One white space. NutraGLP owns it.</h3>
          <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.45)', lineHeight: 1.7, marginBottom: 0, maxWidth: 700 }}>The incretin biology market is currently divided into four segments — none of which deliver scalable, durable weight loss outside of pharmaceuticals. Until now.</p>
          <table className="inv-comp-tbl">
            <thead>
              <tr><th>Segment</th><th>Proprietary IP</th><th>DPP-4 Inhibition</th><th>Delivery Innovation</th><th>No Rx Required</th><th>Key Risk</th></tr>
            </thead>
            <tbody>
              <tr><td>Pharma GLP-1 Drugs</td><td className="inv-check">✓</td><td className="inv-check">✓</td><td className="inv-check">✓</td><td className="inv-x">✗</td><td>Cost ($900–$1,300/mo), tolerability, 50%+ discontinue within 12 months</td></tr>
              <tr><td>Telehealth Compounders</td><td className="inv-x">✗</td><td className="inv-check">✓</td><td className="inv-x">✗</td><td className="inv-x">✗</td><td>Regulatory arbitrage closing — FDA enforcement, Novo/Lilly C&amp;D orders</td></tr>
              <tr><td>GLP-1 Supplements</td><td className="inv-x">✗</td><td className="inv-x">✗</td><td className="inv-x">✗</td><td className="inv-check">✓</td><td>No DPP-4 inhibition — GLP-1 degraded in minutes. No validated outcomes.</td></tr>
              <tr><td>Conventional Nutraceuticals</td><td className="inv-x">✗</td><td className="inv-x">✗</td><td className="inv-x">✗</td><td className="inv-check">✓</td><td>Not incretin-relevant, limited validation, inconsistent outcomes</td></tr>
              <tr className="inv-nutra-row"><td>NutraGLP</td><td className="inv-check">✓</td><td className="inv-check">✓</td><td className="inv-check">✓</td><td className="inv-check">✓</td><td>Clinical validation in progress (seed-stage risk)</td></tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* ░░░ CLINICAL VALIDATION PATHWAY — white ░░░ */}
      <section className="inv-section inv-light inv-bg-white">
        <div className="inv-inner inv-reveal">
          <p className="inv-eyebrow">Clinical Validation</p>
          <h2>Building the evidence base <em>biotech investors expect.</em></h2>
          <p className="inv-lead">The clinical roadmap begins with completed observational data and advances through controlled trials, biomarker validation, and peer-reviewed publication — each stage de-risking the next.</p>
          <div className="inv-clinical-grid">
            <div className="inv-clinical-card done">
              <span className="inv-clinical-badge done">✓ Completed</span>
              <h4>Observational Human Trial</h4>
              <p>6-month study with licensed NutraGLP formulation. 503 subjects. 14.1% average weight loss. &lt;5% adverse effects. Zero serious adverse events. Full methodology available under NDA.</p>
            </div>
            <div className="inv-clinical-card">
              <span className="inv-clinical-badge planned">Planned</span>
              <h4>Controlled Human Study</h4>
              <p>Randomized, placebo-controlled trial measuring weight loss, metabolic biomarkers, and GLP-1/GIP blood levels. Designed to support permissible claims and clinical positioning.</p>
            </div>
            <div className="inv-clinical-card">
              <span className="inv-clinical-badge planned">Planned</span>
              <h4>Biomarker Tracking</h4>
              <p>Continuous metabolic monitoring across cohorts — GLP-1, GIP, HbA1c, insulin sensitivity, and inflammatory markers. Mechanistic validation of the signaling architecture.</p>
            </div>
            <div className="inv-clinical-card">
              <span className="inv-clinical-badge planned">Planned</span>
              <h4>Peer-Reviewed Publication</h4>
              <p>Submission to metabolic health or nutrition journals. Critical for category credibility, B2B licensing conversations, and acquisition positioning.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ░░░ PROOF OF CONCEPT — cream ░░░ */}
      <section className="inv-section inv-light inv-bg-cream">
        <div className="inv-inner inv-reveal">
          <p className="inv-eyebrow">Proof of Concept</p>
          <h2>Observational data. <em>503 participants.</em></h2>
          <p className="inv-lead">A 503-person observational trial demonstrated significant weight loss at 6 months with fewer than 5% adverse effects and no widespread discontinuation. Study design: observational, non-randomized, non-blinded. Full methodology available under NDA.</p>
          <p className="inv-lead">These findings require appropriate scientific qualification before distribution. What they establish: a clear preliminary signal, a strong tolerability profile, and a validated pathway to controlled trial design.</p>
          <div className="inv-poc-block">
            <div className="inv-poc-layout">
              <div className="inv-poc-text">
                <h3>Preliminary signal. Strong tolerability profile.</h3>
                <p>Fewer than 5% adverse effects — all mild. No serious adverse events. No muscle or collagen loss observed. No widespread discontinuation. GRAS-certified compounds throughout.</p>
                <p>The roadmap includes biomarker-based mechanistic validation and a controlled clinical trial designed to support permissible claims and clinical positioning.</p>
              </div>
              <div className="inv-poc-nums">
                <div className="inv-poc-row"><span className="inv-poc-big">503</span><span className="inv-poc-lbl">Participants<br />in observational trial</span></div>
                <div className="inv-poc-row"><span className="inv-poc-big">&lt;5%</span><span className="inv-poc-lbl">Adverse effects<br />all mild, no serious events</span></div>
                <div className="inv-poc-row"><span className="inv-poc-big">6mo</span><span className="inv-poc-lbl">Trial duration<br />with sustained results</span></div>
              </div>
            </div>
          </div>
          <div className="inv-mid-cta">
            <p>Interested in the full dataset and study design? <strong>We&apos;ll walk you through it.</strong></p>
            <a href="#deck" className="inv-btn-gold">Request the Deck →</a>
          </div>
        </div>
      </section>

      {/* ▓▓▓ TELEHEALTH OPPORTUNITY — dark ▓▓▓ */}
      <section className="inv-section inv-dark">
        <div className="inv-inner inv-reveal">
          <p className="inv-eyebrow">Telehealth Opportunity</p>
          <h2>The platform telehealth built demand for.<br /><em>The product they don&apos;t have yet.</em></h2>
          <p className="inv-lead">Telehealth platforms built massive patient demand around injectable GLP-1 therapies — then watched compounded supply collapse under regulatory pressure. NutraGLP is the expansion they need: clinically validated, fully compliant, high-margin, and designed to retain patients long-term.</p>
          <div className="inv-tel-grid">
            <div className="inv-tel-card">
              <h4>Hims &amp; Hers</h4>
              <p>Already operating in compounded GLP-1 space with regulatory sensitivity. NutraGLP as metabolic adjunct within their weight-loss retention funnel. Not a competitor — a complement.</p>
            </div>
            <div className="inv-tel-card">
              <h4>Ro</h4>
              <p>Telehealth plus prescribing plus pharmacy workflows. NutraGLP as co-branded clinician-integrated protocol with shared outcome data embedded in prescriber workflows.</p>
            </div>
            <div className="inv-tel-card">
              <h4>Noom</h4>
              <p>Behavior change platform plus Noom Med. NutraGLP as metabolic optimization layer enhancing retention and sustainability inside their medical program.</p>
            </div>
          </div>
          <div className="inv-barrier" style={{ marginTop: 32 }}>
            <h3>Why telehealth platforms move now</h3>
            <div className="inv-barrier-cols">
              <div className="inv-barrier-step">
                <h4>Patient retention risk</h4>
                <p>Compounded GLP-1 discontinuation creates revenue and retention risk. Platforms that move beyond pharmaceutical GLP-1 dependency retain more patients and reduce regulatory exposure.</p>
              </div>
              <div className="inv-barrier-step">
                <h4>Regulatory compliance</h4>
                <p>NutraGLP carries no compounding risk — fully compliant nutraceutical, drug-free, GRAS-certified. New subscription revenue line with high margin and zero liability from compounding enforcement.</p>
              </div>
              <div className="inv-barrier-step">
                <h4>85%+ gross margins</h4>
                <p>Telehealth licensing and revenue-share channel delivers 85%+ gross margins versus 45–55% for retail. Clinical integration channel at 60%+ margin. Platform-based from day one.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ░░░ MARKET — white ░░░ */}
      <section className="inv-section inv-light inv-bg-white">
        <div className="inv-inner inv-reveal">
          <p className="inv-eyebrow">The Market</p>
          <h2>$132B total market.<br /><em>Clear path to $500M in 3–4 years.</em></h2>
          <p className="inv-lead">The GLP-1/GIP and weight-loss market across the U.S., Europe, and Asia. Metabolic signaling disorders extend into diabetes, cardiovascular, and longevity — the platform addresses all of them. A significant and growing population cannot access, afford, or tolerate pharmacologic therapy. No credible non-drug option has existed until now.</p>

          <div className="inv-mkt-stats">
            <div className="inv-mkt-s"><div className="inv-mkt-num">$132B</div><div className="inv-mkt-lbl">Total Addressable Market</div><div className="inv-mkt-sub">by 2030</div></div>
            <div className="inv-mkt-s"><div className="inv-mkt-num">$21B</div><div className="inv-mkt-lbl">Serviceable Addressable Market</div><div className="inv-mkt-sub">GLP-1 discontinuers + $150+/mo spenders</div></div>
            <div className="inv-mkt-s"><div className="inv-mkt-num">$500M+</div><div className="inv-mkt-lbl">Serviceable Obtainable Market</div><div className="inv-mkt-sub">achievable within 3–4 years of launch</div></div>
          </div>

          <div className="inv-gap-chart" data-animate-bars>
            <div className="inv-gap-title">The positioning gap NutraGLP occupies</div>
            <div className="inv-gap-row">
              <div className="inv-gap-lbl">Pharmaceutical GLP-1 Drugs <span>$900–$1,300/mo · Rx required · weekly injection</span></div>
              <div className="inv-gap-track"><div className="inv-gap-fill gf-pharma" data-width="88">HIGH EFFICACY</div></div>
            </div>
            <div className="inv-gap-arrow">↕ THE GAP — No credible non-drug option until now</div>
            <div className="inv-gap-row">
              <div className="inv-gap-lbl">NutraGLP Platform <span>$145/mo · No Rx · drinkable nanoemulsion</span></div>
              <div className="inv-gap-track"><div className="inv-gap-fill gf-nutra" data-width="62">ENDOGENOUS AMPLIFICATION</div></div>
            </div>
            <div className="inv-gap-arrow" style={{ color: 'var(--silver)' }}>↕</div>
            <div className="inv-gap-row">
              <div className="inv-gap-lbl">Commodity GLP-1 Supplements <span>$20–$80/mo · No IP · no DPP-4 inhibition</span></div>
              <div className="inv-gap-track"><div className="inv-gap-fill gf-supps" data-width="42">LOW BIOAVAILABILITY</div></div>
            </div>
          </div>

          <h3 style={{ fontFamily: "'Fraunces', Georgia, serif", fontSize: 19, fontWeight: 500, color: 'var(--navy-deep)', marginTop: 52, marginBottom: 6 }}>Acquisition Comparables</h3>
          <p className="inv-body" style={{ marginBottom: 0 }}>Strategic acquirers are paying platform premiums. Benchmark: Nestlé acquired The Bountiful Company for $5.75B at a 16.8× EBITDA multiple — a directly comparable transaction in consumer health.</p>
          <table className="inv-ma-tbl">
            <thead><tr><th>Transaction</th><th>Acquirer</th><th>Value</th><th>Signal</th></tr></thead>
            <tbody>
              <tr><td>The Bountiful Company</td><td>Nestlé</td><td>$5.75B</td><td>16.8× EBITDA — consumer health platform acquisition. Direct comparable.</td></tr>
              <tr><td>Metsera</td><td>Pfizer</td><td>$10B</td><td>Oral GLP-1 pipeline acquisition at pre-revenue stage</td></tr>
              <tr><td>Carmot Therapeutics</td><td>Roche</td><td>$2.7B</td><td>GLP-1/GIP dual agonist platform with Phase I data</td></tr>
              <tr><td>Inversago Pharma</td><td>Novo Nordisk</td><td>$1.1B</td><td>CB1 receptor inverse agonist for metabolic disease</td></tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* ░░░ PRODUCT PIPELINE — cream ░░░ */}
      <section className="inv-section inv-light inv-bg-cream">
        <div className="inv-inner inv-reveal">
          <p className="inv-eyebrow">Product Pipeline</p>
          <h2>A full portfolio of<br /><em>incretin-modulating consumer products.</em></h2>
          <p className="inv-lead">NutraGLP Sync™ is designed for parallel commercialization across multiple channels as FDA-compliant OTCs, functional foods, dietary supplements, and food additives — the same platform architecture powering every product line.</p>
          <div className="inv-pipe-grid">
            <div className="inv-pipe-card">
              <div className="inv-pipe-when">Now — Lead Product</div>
              <div className="inv-pipe-name">Slim SHOT</div>
              <p>60ml daily nanoemulsion. GLP-1/GIP amplification, DPP-4 inhibition, thermogenic activation. $145/month. Simple protocol: 30ml AM, 30ml PM.</p>
            </div>
            <div className="inv-pipe-card">
              <div className="inv-pipe-when">2026</div>
              <div className="inv-pipe-name">ThermoGEN</div>
              <p>Thermogenic energy drink delivering incretin-activating ingredients with GLP pathway activation. Convenience format for daily use.</p>
            </div>
            <div className="inv-pipe-card">
              <div className="inv-pipe-when">2026</div>
              <div className="inv-pipe-name">GLP-1 Sweetener</div>
              <p>World's first incretin-activating zero-calorie sweetener. Daily-use mass market format delivering GLP-1/GIP activation with every use.</p>
            </div>
            <div className="inv-pipe-card">
              <div className="inv-pipe-when">2027</div>
              <div className="inv-pipe-name">GLP-1 Protein</div>
              <p>High-protein formulation with GLP-1 and GIP benefits for weight management and glycemic control. Lean mass preservation built in.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ▓▓▓ ROADMAP — dark ▓▓▓ */}
      <section className="inv-section inv-dark">
        <div className="inv-inner inv-reveal">
          <p className="inv-eyebrow">Roadmap</p>
          <h2>Seed to exit <em>in four years.</em></h2>
          <p className="inv-lead">Capital deployed across clinical validation, manufacturing scale, go-to-market execution, and IP prosecution. Each milestone de-risks the next and funds the one after.</p>
          <div className="inv-roadmap">
            <div className="inv-rm-step"><div className="inv-rm-dot"></div><div className="inv-rm-phase">Q1–Q2 2026</div><div className="inv-rm-title">Market Entry</div>
              <ul className="inv-rm-items"><li>$5.5M seed close</li><li>D2C launch — Slim SHOT</li><li>eCommerce + 1 telehealth license</li><li>Target: $300K revenue</li></ul></div>
            <div className="inv-rm-step"><div className="inv-rm-dot"></div><div className="inv-rm-phase">Q3–Q4 2026</div><div className="inv-rm-title">Expansion</div>
              <ul className="inv-rm-items"><li>Retail pilot programs</li><li>GLP-1 Sweetener launch</li><li>Clinical data publication</li><li>Target: $1.8M revenue</li></ul></div>
            <div className="inv-rm-step"><div className="inv-rm-dot"></div><div className="inv-rm-phase">Year 2</div><div className="inv-rm-title">Platform Scale</div>
              <ul className="inv-rm-items"><li>3 additional product lines</li><li>Controlled clinical trial</li><li>National retail + telehealth</li><li>Series A — $15M target</li></ul></div>
            <div className="inv-rm-step"><div className="inv-rm-dot"></div><div className="inv-rm-phase">Year 4</div><div className="inv-rm-title">Exit Window</div>
              <ul className="inv-rm-items"><li>$135M revenue target</li><li>$79M EBITDA</li><li>Strategic acquisition target</li><li>$850M–$1.25B at 12–18× EBITDA</li></ul></div>
          </div>
        </div>
      </section>

      {/* ░░░ THE RAISE — cream ░░░ */}
      <section className="inv-section inv-light inv-bg-cream">
        <div className="inv-inner inv-reveal">
          <p className="inv-eyebrow">The Raise</p>
          <h2>The $5.5M <em>seed round.</em></h2>
          <p className="inv-lead">SAFE and equity investment. This raise transitions NutraGLP from a single-product commercial launch into a multi-product, multi-channel revenue platform — supporting $3M in Year 1 revenue and a clear path to $15M by Year 2.</p>
          <div className="inv-raise-grid">
            <div className="inv-raise-card" data-animate-bars>
              <h3>Use of Funds</h3>
              <div className="inv-fund-row"><div className="inv-fund-lbl">Growth &amp; Marketing <span>$1.35M</span></div><div className="inv-fund-track"><div className="inv-fund-fill" data-width="30"></div></div></div>
              <div className="inv-fund-row"><div className="inv-fund-lbl">G&amp;A / Operations <span>$1.03M</span></div><div className="inv-fund-track"><div className="inv-fund-fill" data-width="23"></div></div></div>
              <div className="inv-fund-row"><div className="inv-fund-lbl">Manufacturing &amp; Inventory <span>$990K</span></div><div className="inv-fund-track"><div className="inv-fund-fill" data-width="22"></div></div></div>
              <div className="inv-fund-row"><div className="inv-fund-lbl">B2B Sales &amp; Partnerships <span>$585K</span></div><div className="inv-fund-track"><div className="inv-fund-fill" data-width="13"></div></div></div>
              <div className="inv-fund-row"><div className="inv-fund-lbl">Product / Clinical / Regulatory <span>$540K</span></div><div className="inv-fund-track"><div className="inv-fund-fill" data-width="12"></div></div></div>
            </div>
            <div className="inv-raise-card">
              <h3>Exit Thesis</h3>
              <ul className="inv-exit-list">
                <li>Strategic acquisition by consumer health, CPG, or pharmaceutical acquirer</li>
                <li>Target horizon: Year 4 at $135M revenue, $79M EBITDA</li>
                <li>Projected exit: $850M–$1.25B at 12–18× EBITDA</li>
                <li>Benchmark: Nestlé / Bountiful Company at 16.8× EBITDA — direct comparable</li>
                <li>Acquirer profile: Nestlé, Bayer, P&amp;G, Unilever, pharmaceutical companies building incretin-adjacent pipelines</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ▓▓▓ TEAM — dark ▓▓▓ */}
      <section className="inv-section inv-dark">
        <div className="inv-inner inv-reveal">
          <p className="inv-eyebrow">Leadership</p>
          <h2>Science, IP, and commercialization.<br /><em>The team that executes.</em></h2>
          <p className="inv-lead">Two operators. One built the platform and the IP portfolio. One built the commercial machine. Neither is doing this for the first time.</p>
          <div className="inv-team-grid">
            <div className="inv-team-card">
              <p className="inv-team-role">Science &amp; IP</p>
              <h3>Richard Clark Kaufman, PhD</h3>
              <p className="inv-team-title">Founder &amp; CEO · Chief Science Officer</p>
              <p className="inv-team-bio">Architect of the NutraGLP platform and IP portfolio. Inventor of patented nanoparticle delivery systems for nutraceutical and pharmaceutical biotechnology across 24+ countries. Co-Founder and CSO of Nanosphere Health Sciences (publicly traded). Recipient of the Frost &amp; Sullivan Nano-Encapsulation Innovation Award. The platform, the science, and the IP estate are his work.</p>
              <div className="inv-team-highlights">
                <div className="inv-team-hl">Nanosphere Health Sciences — publicly traded, Frost &amp; Sullivan award recipient</div>
                <div className="inv-team-hl">24+ country patent portfolio in nanoparticle delivery systems</div>
                <div className="inv-team-hl">NutraGLP Scientific Monograph — 40+ formulations, 13 signaling targets</div>
              </div>
              <div style={{ marginTop: 20 }}><a href="mailto:Richard@nutraglpbio.com" style={{ color: 'rgba(255,255,255,0.7)', fontSize: 14, textDecoration: 'none', borderBottom: '1px solid rgba(21,133,181,0.4)', paddingBottom: 2 }}>Richard@nutraglpbio.com →</a></div>
            </div>
            <div className="inv-team-card">
              <p className="inv-team-role">Commercial</p>
              <h3>Chris McCann</h3>
              <p className="inv-team-title">Co-Founder &amp; President, Commercialization</p>
              <p className="inv-team-bio">15 years scaling emerging enterprise technology from pre-revenue to category leadership. Led Contentstack from pre-Series A through $85M Series C. Category creation specialist — built go-to-market engines for commercetools and Typeface before analyst validation. Now building NutraGLP&apos;s commercial machine across a $200B+ TAM. Has done this before.</p>
              <div className="inv-team-highlights">
                <div className="inv-team-hl">Contentstack — pre-Series A through $85M Series C</div>
                <div className="inv-team-hl">Category creation at commercetools and Typeface pre-validation</div>
                <div className="inv-team-hl">15 years enterprise tech, now building across $200B+ TAM</div>
              </div>
              <div style={{ marginTop: 20 }}><a href="mailto:Chris@nutraglpbio.com" style={{ color: 'rgba(255,255,255,0.7)', fontSize: 14, textDecoration: 'none', borderBottom: '1px solid rgba(21,133,181,0.4)', paddingBottom: 2 }}>Chris@nutraglpbio.com →</a></div>
            </div>
          </div>
        </div>
      </section>

      {/* ░░░ INVESTOR FAQ — white ░░░ */}
      <section className="inv-section inv-light inv-bg-white">
        <div className="inv-inner inv-reveal">
          <p className="inv-eyebrow">Common Questions</p>
          <h2>What sophisticated investors <em>want to know.</em></h2>
          <div className="inv-faq-grid">
            <div className="inv-faq-card">
              <p className="inv-faq-q">Is this just supplements?</p>
              <p className="inv-faq-a">No. NutraGLP is a non-pharmaceutical biotechnology platform. It occupies a new class that bridges pharmaceuticals, foods, and supplements — engineered as a coordinated signaling architecture with multiple weight loss mechanisms including natural incretin hormone activation (GLP-1, GIP), blood glucose control, and thermogenesis. The delivery system is pharmaceutical-grade. The IP is platform-level. The distribution is consumer-scale.</p>
            </div>
            <div className="inv-faq-card">
              <p className="inv-faq-q">How do you defend this?</p>
              <p className="inv-faq-a">The platform is defended through a patent-pending architecture of more than 40 foods, supplements, and food additives, with platform-level formulation systems and delivery technologies designed for reproducibility and scalability. The system design — not any single ingredient — is the defensible moat. A competitor cannot replicate the platform by copying a single formulation.</p>
            </div>
            <div className="inv-faq-card">
              <p className="inv-faq-q">What about clinical validation?</p>
              <p className="inv-faq-a">A 503-person observational trial demonstrated significant weight loss at 6 months, with fewer than 5% adverse effects and no widespread discontinuation. The roadmap includes biomarker-based mechanistic validation and controlled studies to inform permissible claims and positioning. Full methodology available under NDA.</p>
            </div>
            <div className="inv-faq-card">
              <p className="inv-faq-q">Are you competing with GLP-1 drugs?</p>
              <p className="inv-faq-a">No. The platform is built for people who cannot tolerate, cannot access, or do not want chronic pharmacologic dependence — while leveraging the same validated biology. This is a new scalable non-drug class, not a replacement for pharmacologic therapy in all contexts. The 50%+ discontinuation rate is the market we serve.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ▓▓▓ CONTACT — dark ▓▓▓ */}
      <section className="inv-section inv-dark" id="deck">
        <div className="inv-inner inv-reveal">
          <p className="inv-eyebrow">Get in Touch</p>
          <h2>The future of weight loss<br /><em>and metabolic health.</em></h2>
          <p className="inv-lead">We&apos;re in active conversations with strategic and financial investors. If you&apos;re building a position on the GLP-1 economy — or looking for what comes after compounded pharma — we&apos;d like to talk.</p>

          <div className="inv-deck-form-wrap">
            <RequestDeckModal buttonClassName="inline-block bg-gold text-white text-sm font-semibold px-8 py-3 rounded-full no-underline hover:bg-gold-light transition cursor-pointer border-none" />
          </div>

          <div className="inv-contact-grid">
            <div className="inv-c-card">
              <p className="inv-c-role">Science &amp; IP</p>
              <h3>Richard Clark Kaufman, PhD</h3>
              <p className="inv-c-title">Founder &amp; CEO · 310-990-6770</p>
              <a href="mailto:Richard@nutraglpbio.com">Richard@nutraglpbio.com →</a>
            </div>
            <div className="inv-c-card">
              <p className="inv-c-role">Commercial</p>
              <h3>Chris McCann</h3>
              <p className="inv-c-title">Co-Founder &amp; President · 424-382-9931</p>
              <a href="mailto:Chris@nutraglpbio.com">Chris@nutraglpbio.com →</a>
            </div>
          </div>
        </div>
      </section>

      {/* Investor-specific disclaimer */}
      <div className="inv-disclaimer">
        <p>NutraGLP Biosciences products are dietary supplements regulated under DSHEA. They are not intended to diagnose, treat, cure, or prevent any disease. The observational study referenced on this page was not a randomized controlled trial — findings are preliminary and require appropriate scientific qualification before distribution. Forward-looking statements regarding market size, revenue projections, exit valuation, and acquisition timelines involve risk and uncertainty and are not a guarantee of future performance. This page does not constitute an offer to sell or solicitation of an offer to buy any securities. Prospective investors should consult their own professional advisors. © 2026 NutraGLP Biosciences. All rights reserved.</p>
      </div>

      <Footer />

    </main>
  );
}
