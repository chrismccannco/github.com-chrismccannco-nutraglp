import type { Metadata } from "next";
import Footer from "../components/Footer";
import InvestorDeckForm from "../components/InvestorDeckForm";
import InvestorInteractions from "./InvestorInteractions";

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
          <p className="inv-hero-eyebrow">Investor Overview — Seed Round</p>
          <h1>Your body already makes GLP-1.<br /><em>We make it work harder.</em></h1>
          <p className="inv-hero-sub">A biotechnology platform for natural incretin modulation. Patent-pending nanoemulsion architecture. 40+ formulations. A new product category at the intersection of pharmaceuticals, foods, and dietary supplements.</p>
          <div className="inv-hero-ctas">
            <a href="#deck" className="inv-btn-gold">Request the Deck →</a>
            <a href="#platform" className="inv-btn-outline">Read the Thesis</a>
          </div>
          <div className="inv-hero-stats">
            <div className="inv-h-stat"><div className="inv-h-stat-val">$5.5M</div><div className="inv-h-stat-label">Seed Round</div></div>
            <div className="inv-h-stat"><div className="inv-h-stat-val">40+</div><div className="inv-h-stat-label">Patent-Pending Formulations</div></div>
            <div className="inv-h-stat"><div className="inv-h-stat-val">13</div><div className="inv-h-stat-label">Distinct Signaling Pathways</div></div>
            <div className="inv-h-stat"><div className="inv-h-stat-val">8×</div><div className="inv-h-stat-label">Bioavailability vs Standard Oral</div></div>
          </div>
        </div>
      </section>

      {/* ░░░ PLATFORM — white ░░░ */}
      <section className="inv-section inv-light inv-bg-white" id="platform">
        <div className="inv-inner inv-reveal">
          <p className="inv-eyebrow">The Platform</p>
          <h2>Not a supplement company.<br /><em>A biotechnology platform.</em></h2>
          <p className="inv-lead">NutraGLP activates endogenous GLP-1 and GIP production through a coordinated architecture of 13 Distinct Signaling Pathways — including DPP-4 inhibition, AMPK activation, GPR120 signaling, and insulin receptor sensitization.</p>
          <p className="inv-body"><strong>The moat is the architecture, not any single ingredient.</strong> Defended through 40+ patent-pending formulations, platform-level delivery technology, and system design IP that treats the full signaling stack as the defensible asset.</p>
          <div className="inv-plat-grid">
            <div className="inv-plat-card"><div className="inv-plat-top"></div><div className="inv-plat-num">01</div><h3>Activate</h3><p>Four GRAS-certified active systems stimulate endogenous GLP-1 and GIP production through AMPK activation, GPR120 signaling, and insulin receptor sensitization.</p></div>
            <div className="inv-plat-card"><div className="inv-plat-top"></div><div className="inv-plat-num">02</div><h3>Protect</h3><p>Natural DPP-4 inhibitors extend the active life of endogenous GLP-1. More hormone. Longer metabolic window. No synthetic peptides. This is the key differentiator from commodity supplements.</p></div>
            <div className="inv-plat-card"><div className="inv-plat-top"></div><div className="inv-plat-num">03</div><h3>Deliver</h3><p>Patent-pending nanoemulsion technology achieves up to 8× bioavailability over standard oral formats. The architecture that makes the first two steps clinically relevant.</p></div>
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
              <p>Multi-compound synergistic formulations across weight management, metabolic health, cognitive function, and longevity. Each formulation is independently defensible.</p>
            </div>
            <div className="inv-ip-card">
              <div className="inv-ip-val">8×</div><div className="inv-ip-sub">bioavailability</div>
              <h3>Delivery IP</h3>
              <p>Proprietary nanoemulsion system protected independently from the active formulations it carries. The delivery platform is the second moat — developed over two decades of nano-encapsulation research.</p>
            </div>
            <div className="inv-ip-card">
              <div className="inv-ip-val">13</div><div className="inv-ip-sub">signaling targets</div>
              <h3>System Design IP</h3>
              <p>The coordinated activation architecture itself is the invention. Targeting multiple pathways simultaneously is the mechanism — and the hardest layer to replicate.</p>
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

          <h3 style={{ fontFamily: "'Fraunces', Georgia, serif", fontSize: 19, fontWeight: 500, color: '#fff', marginTop: 48, marginBottom: 6 }}>Competitive landscape</h3>
          <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.45)', lineHeight: 1.7, marginBottom: 0, maxWidth: 700 }}>Four functional segments exist in the incretin biology market. None provide scalable, durable metabolic outcomes outside of pharmaceuticals. NutraGLP exclusively occupies this domain.</p>
          <table className="inv-comp-tbl">
            <thead>
              <tr><th>Segment</th><th>Proprietary IP</th><th>DPP-4 Inhibition</th><th>Delivery Innovation</th><th>No Rx Required</th><th>Key Risk</th></tr>
            </thead>
            <tbody>
              <tr><td>Pharma GLP-1 Drugs</td><td className="inv-check">✓</td><td className="inv-check">✓</td><td className="inv-check">✓</td><td className="inv-x">✗</td><td>Cost, tolerability, adherence (70% discontinue Y1)</td></tr>
              <tr><td>Telehealth Compounders</td><td className="inv-x">✗</td><td className="inv-check">✓</td><td className="inv-x">✗</td><td className="inv-x">✗</td><td>Regulatory arbitrage closing (FDA enforcement, Novo litigation)</td></tr>
              <tr><td>GLP-1 Supplements</td><td className="inv-x">✗</td><td className="inv-x">✗</td><td className="inv-x">✗</td><td className="inv-check">✓</td><td>No signal preservation, no validated outcomes, commodity ingredients</td></tr>
              <tr><td>Conventional Nutraceuticals</td><td className="inv-x">✗</td><td className="inv-x">✗</td><td className="inv-x">✗</td><td className="inv-check">✓</td><td>Not incretin-relevant, commoditized, inconsistent</td></tr>
              <tr className="inv-nutra-row"><td>NutraGLP</td><td className="inv-check">✓</td><td className="inv-check">✓</td><td className="inv-check">✓</td><td className="inv-check">✓</td><td>Clinical validation in progress (seed-stage risk)</td></tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* ░░░ PROOF OF CONCEPT — cream ░░░ */}
      <section className="inv-section inv-light inv-bg-cream">
        <div className="inv-inner inv-reveal">
          <p className="inv-eyebrow">Proof of Concept</p>
          <h2>Observational data. <em>503 participants.</em></h2>
          <p className="inv-lead">Study design: observational. Not a randomized controlled trial — no placebo control, no blinding. The dataset (n=503) has not been submitted for peer review and requires appropriate scientific qualification before distribution.</p>
          <p className="inv-lead">Within those constraints: 6-month results from a licensed NutraGLP formulation showed directional improvements across participants, with fewer than 5% adverse effects and no widespread discontinuation.</p>
          <div className="inv-poc-block">
            <div className="inv-poc-layout">
              <div className="inv-poc-text">
                <h3>Preliminary signal. Encouraging directional data.</h3>
                <p>Fewer than 5% adverse effects. No widespread discontinuation. GRAS-certified compounds throughout.</p>
                <p>The roadmap includes biomarker-based mechanistic validation and a controlled clinical trial designed to support permissible claims and clinical positioning.</p>
              </div>
              <div className="inv-poc-nums">
                <div className="inv-poc-row"><span className="inv-poc-big">503</span><span className="inv-poc-lbl">Participants<br />in observational trial</span></div>
                <div className="inv-poc-row"><span className="inv-poc-big">&lt;5%</span><span className="inv-poc-lbl">Adverse effects<br />reported</span></div>
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

      {/* ░░░ MARKET — white ░░░ */}
      <section className="inv-section inv-light inv-bg-white">
        <div className="inv-inner inv-reveal">
          <p className="inv-eyebrow">The Market</p>
          <h2>Serving the market <em>Ozempic created.</em></h2>
          <p className="inv-lead">The GLP-1 drug market is projected to exceed $100B in annual revenue within a decade. 42 million prescriptions were written in 2024. A significant and growing population cannot access, afford, or tolerate pharmacologic therapy. No credible non-drug option has existed until now.</p>

          <div className="inv-mkt-stats">
            <div className="inv-mkt-s"><div className="inv-mkt-num">$132B</div><div className="inv-mkt-lbl">Total Addressable Market</div><div className="inv-mkt-sub">by 2030</div></div>
            <div className="inv-mkt-s"><div className="inv-mkt-num">42M</div><div className="inv-mkt-lbl">Prescriptions Written</div><div className="inv-mkt-sub">in 2024</div></div>
            <div className="inv-mkt-s"><div className="inv-mkt-num">70%</div><div className="inv-mkt-lbl">Discontinue in Year 1</div><div className="inv-mkt-sub">cost, access, side effects</div></div>
          </div>

          <div className="inv-gap-chart" data-animate-bars>
            <div className="inv-gap-title">The positioning gap NutraGLP occupies</div>
            <div className="inv-gap-row">
              <div className="inv-gap-lbl">Pharmaceutical GLP-1 Drugs <span>$800–$1,600/mo · Rx required · injections</span></div>
              <div className="inv-gap-track"><div className="inv-gap-fill gf-pharma" data-width="88">HIGH EFFICACY</div></div>
            </div>
            <div className="inv-gap-arrow">↕ THE GAP — No credible non-drug option until now</div>
            <div className="inv-gap-row">
              <div className="inv-gap-lbl">NutraGLP Platform <span>$149/mo · No Rx · drinkable nanoemulsion</span></div>
              <div className="inv-gap-track"><div className="inv-gap-fill gf-nutra" data-width="62">ENDOGENOUS AMPLIFICATION</div></div>
            </div>
            <div className="inv-gap-arrow" style={{ color: 'var(--silver)' }}>↕</div>
            <div className="inv-gap-row">
              <div className="inv-gap-lbl">Commodity Supplements <span>$20–$60/mo · No IP · no delivery technology</span></div>
              <div className="inv-gap-track"><div className="inv-gap-fill gf-supps" data-width="42">LOW BIOAVAILABILITY</div></div>
            </div>
          </div>

          <h3 style={{ fontFamily: "'Fraunces', Georgia, serif", fontSize: 19, fontWeight: 500, color: 'var(--navy-deep)', marginTop: 52, marginBottom: 6 }}>Acquisition Comparables</h3>
          <p className="inv-body" style={{ marginBottom: 0 }}>Strategic acquirers are paying platform premiums for incretin biology and adjacent delivery systems.</p>
          <table className="inv-ma-tbl">
            <thead><tr><th>Transaction</th><th>Acquirer</th><th>Value</th><th>Signal</th></tr></thead>
            <tbody>
              <tr><td>Metsera</td><td>Pfizer</td><td>$10B</td><td>Oral GLP-1 pipeline acquisition at pre-revenue stage</td></tr>
              <tr><td>Carmot Therapeutics</td><td>Roche</td><td>$2.7B</td><td>GLP-1/GIP dual agonist platform with Phase I data</td></tr>
              <tr><td>Inversago Pharma</td><td>Novo Nordisk</td><td>$1.1B</td><td>CB1 receptor inverse agonist for metabolic disease</td></tr>
              <tr><td>Verdiva Bio (Series A)</td><td>Lilly Asia Ventures</td><td>$411M</td><td>CVC building GLP-1 adjacent pipeline at early stage</td></tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* ▓▓▓ ROADMAP — dark ▓▓▓ */}
      <section className="inv-section inv-dark">
        <div className="inv-inner inv-reveal">
          <p className="inv-eyebrow">Roadmap</p>
          <h2>Seed to exit <em>in four years.</em></h2>
          <p className="inv-lead">Capital deployed across clinical validation, manufacturing scale, go-to-market execution, and IP prosecution. Each milestone de-risks the next.</p>
          <div className="inv-roadmap">
            <div className="inv-rm-step"><div className="inv-rm-dot"></div><div className="inv-rm-phase">Now</div><div className="inv-rm-title">Seed Round</div>
              <ul className="inv-rm-items"><li>$5.5M raise</li><li>D2C launch (Slim SHOT)</li><li>Observational data published</li></ul></div>
            <div className="inv-rm-step"><div className="inv-rm-dot"></div><div className="inv-rm-phase">Year 1</div><div className="inv-rm-title">Clinical + Scale</div>
              <ul className="inv-rm-items"><li>Biomarker-based mechanistic study</li><li>Manufacturing at scale</li><li>Telehealth channel live</li></ul></div>
            <div className="inv-rm-step"><div className="inv-rm-dot"></div><div className="inv-rm-phase">Year 2</div><div className="inv-rm-title">Platform Expansion</div>
              <ul className="inv-rm-items"><li>3 additional product lines</li><li>Controlled clinical trial</li><li>Series A</li></ul></div>
            <div className="inv-rm-step"><div className="inv-rm-dot"></div><div className="inv-rm-phase">Year 4</div><div className="inv-rm-title">Exit Window</div>
              <ul className="inv-rm-items"><li>Strategic acquisition target</li><li>Premium exit multiple</li><li>Full IP portfolio prosecuted</li></ul></div>
          </div>
        </div>
      </section>

      {/* ░░░ THE RAISE — cream ░░░ */}
      <section className="inv-section inv-light inv-bg-cream">
        <div className="inv-inner inv-reveal">
          <p className="inv-eyebrow">The Raise</p>
          <h2>Seeking $5.5M <em>seed round.</em></h2>
          <p className="inv-lead">Two-track capital strategy: direct-to-VC as primary path, strategic telehealth platform investment as parallel track.</p>
          <div className="inv-raise-grid">
            <div className="inv-raise-card" data-animate-bars>
              <h3>Use of Funds</h3>
              <div className="inv-fund-row"><div className="inv-fund-lbl">Clinical Validation <span>$1.65M</span></div><div className="inv-fund-track"><div className="inv-fund-fill" data-width="30"></div></div></div>
              <div className="inv-fund-row"><div className="inv-fund-lbl">Manufacturing Scale <span>$1.375M</span></div><div className="inv-fund-track"><div className="inv-fund-fill" data-width="25"></div></div></div>
              <div className="inv-fund-row"><div className="inv-fund-lbl">Go-to-Market / D2C <span>$1.1M</span></div><div className="inv-fund-track"><div className="inv-fund-fill" data-width="20"></div></div></div>
              <div className="inv-fund-row"><div className="inv-fund-lbl">IP Prosecution <span>$825K</span></div><div className="inv-fund-track"><div className="inv-fund-fill" data-width="15"></div></div></div>
              <div className="inv-fund-row"><div className="inv-fund-lbl">Regulatory / Compliance <span>$550K</span></div><div className="inv-fund-track"><div className="inv-fund-fill" data-width="10"></div></div></div>
            </div>
            <div className="inv-raise-card">
              <h3>Exit Thesis</h3>
              <ul className="inv-exit-list">
                <li>Strategic acquisition by consumer health, CPG, or pharmaceutical acquirer</li>
                <li>Target horizon: Year 4</li>
                <li>Target multiple: Premium exit multiple</li>
                <li>Acquisition surface area: IP portfolio, nanoemulsion platform, clinical data, DTC distribution infrastructure</li>
                <li>Comparable acquirers: consumer health, CPG, and pharmaceutical strategics with active nutraceutical M&amp;A programs</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ▓▓▓ CONTACT — dark ▓▓▓ */}
      <section className="inv-section inv-dark" id="deck">
        <div className="inv-inner inv-reveal">
          <p className="inv-eyebrow">Get in Touch</p>
          <h2>Request the deck.<br /><em>Let&apos;s talk.</em></h2>
          <p className="inv-lead">We&apos;re in active conversations with strategic and financial investors. If you&apos;re working through the science or building a position on the GLP-1 economy, we&apos;d like to talk.</p>

          <details className="inv-deck-form-wrap">
            <summary className="inv-btn-gold" style={{cursor:'pointer',listStyle:'none',display:'inline-flex',alignItems:'center',gap:'8px'}}>Request the Deck <span style={{fontSize:'0.8em'}}>▾</span></summary>
            <div style={{marginTop:'1.5rem'}}>
              <InvestorDeckForm />
            </div>
          </details>

          <div className="inv-contact-grid">
            <div className="inv-c-card">
              <p className="inv-c-role">Science &amp; IP</p>
              <h3>Richard Clark Kaufman, PhD</h3>
              <p className="inv-c-title">Founder &amp; CEO</p>
              <a href="mailto:Richard@nutraglpbio.com">Richard@nutraglpbio.com →</a>
            </div>
            <div className="inv-c-card">
              <p className="inv-c-role">Commercial</p>
              <h3>Chris McCann</h3>
              <p className="inv-c-title">Co-Founder &amp; President, Commercialization</p>
              <a href="mailto:Chris@nutraglpbio.com">Chris@nutraglpbio.com →</a>
            </div>
          </div>
        </div>
      </section>

      {/* Investor-specific disclaimer */}
      <div className="inv-disclaimer">
        <p>NutraGLP Biosciences products are dietary supplements. They are not intended to diagnose, treat, cure, or prevent any disease. The observational study referenced on this page was not a randomized controlled trial and requires appropriate scientific qualification before distribution. Forward-looking statements regarding market size, exit valuation, and acquisition timelines involve risk and uncertainty. This page does not constitute an offer to sell or solicitation of an offer to buy any securities. © 2026 NutraGLP Biosciences. All rights reserved.</p>
      </div>

      <InvestorInteractions />
    </main>
  );
}
