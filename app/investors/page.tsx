import type { Metadata } from "next";
import Footer from "../components/Footer";

export const metadata: Metadata = {
  title: "Investors",
  description:
    "NutraGLP investor overview. $132B addressable market, patent-pending nanoemulsion platform, and a clear path to category leadership in natural GLP-1 amplification.",
  alternates: {
    canonical: "https://nutraglp.com/investors",
  },
  robots: {
    index: false,
    follow: true,
  },
};

const topMetrics = [
  { value: "$132B", label: "Total Addressable Market" },
  { value: "30+", label: "Patent-Pending Formulations" },
  { value: "13", label: "Validated Signaling Targets" },
  { value: "503", label: "Study Participants" },
  { value: "$5.5M", label: "Seed Round" },
];

const problemStats = [
  { value: "130M+", title: "Adults with Overweight or Obesity", desc: "In the U.S. alone. One of the largest unaddressed therapeutic markets." },
  { value: "$900–$1,300", title: "Monthly Patient Cost", desc: "Typical out-of-pocket cost of branded GLP-1/GIP drugs." },
  { value: "70%+", title: "Experience Adverse Effects", desc: "Including nausea, serious GI events, muscle and collagen loss." },
  { value: "3,000+", title: "Active GLP-1 Lawsuits", desc: "Adverse effects, compounding violations, marketing claims, FDA infringement." },
];

const catalystCards = [
  { stat: "10/10", title: "Impurity Rate", desc: "Every Lilly-tested compounded tirzepatide sample contained unknown impurities." },
  { stat: "FDA", title: "Enforcement Discretion Ended", desc: "Shortage resolved. Compounders no longer shielded from enforcement action." },
  { stat: "C&D", title: "Cease-and-Desist Orders", desc: "Both Lilly and Novo issuing C&Ds across the entire compounding supply chain." },
  { stat: "Zero", title: "Safety Studies", desc: "No safety studies exist on compounded GLP-1 impurities." },
];

const moaSteps = [
  { num: 1, title: "Oral Intake", desc: "Nanoemulsion and microencapsulation delivery" },
  { num: 2, title: "GLP-1 / GIP Release", desc: "L-cell and K-cell stimulation via natural secretagogues" },
  { num: 3, title: "DPP-4 Inhibition", desc: "Extended incretin half-life preserving signal duration" },
  { num: 4, title: "Signaling Coordination", desc: "Downstream metabolic pathway engagement across 13 targets" },
  { num: 5, title: "Outcomes", desc: "Appetite control, glucose regulation, durable weight loss" },
];

const pathwayTargets = [
  "GLP-1 / GIP / DPP-4", "Insulin / IRS / PI3K-AKT", "AMPK", "mTOR",
  "MAPK / p38", "Leptin / Adiponectin", "NF-κB / JNK / IKKβ",
  "PPARα/γ/δ", "Wnt / β-Catenin", "Hedgehog",
  "cGMP / PKG", "TGF-β / SMAD3",
];

const evidenceStats = [
  { num: "14.1%", label: "Avg. Weight Loss at 6 Months" },
  { num: "<5%", label: "Adverse Effect Rate (All Mild)" },
  { num: "0", label: "Serious Adverse Events" },
  { num: "503", label: "Participants Observed" },
  { num: "0%", label: "Muscle or Collagen Loss" },
];

const pipeline = [
  { name: "Slim SHOT", desc: "Lead product. Daily 60ml nanoemulsion. GLP-1/GIP amplification, DPP-4 inhibition, thermogenic activation. $145/month. 30ml AM + 30ml PM.", timing: "NOW" },
  { name: "GLP-1 Sweetener", desc: "First incretin-activating zero-calorie sweetener. Mass-market daily-use format. The platform in the most accessible form factor possible.", timing: "2026" },
  { name: "GLP-1 Protein", desc: "High-protein formulation with GLP-1/GIP benefits. Addresses lean mass preservation, the key clinical distinction from pharma GLP-1 drugs.", timing: "2027" },
  { name: "ThermoGEN", desc: "Thermogenic energy drink and performance gel. GLP pathway activation in convenience formats.", timing: "2026" },
];

const ipItems = [
  { title: "GLP-1 & GIP Secretagogue Methods", desc: "Natural incretin release and optimization compositions. Methods for combining secretagogues with DPP-4 inhibitors to increase systemic incretin delivery." },
  { title: "DPP-4 Inhibition Architecture", desc: "Extending endogenous incretin half-life through non-pharmaceutical DPP-4 modulation. The gating variable for non-pharma incretin efficacy." },
  { title: "Cell-Signaling Pathway Compositions", desc: "Compositions for weight loss and glucose regulation targeting 13 validated signaling pathways across 6 pathway categories." },
  { title: "Delivery & Manufacturing Systems", desc: "Proprietary nanoemulsion and encapsulation technologies. Scalable manufacturing processes across 30+ product formats." },
];

const channels = [
  { timing: "Now", name: "D2C Subscription", desc: "Recurring revenue model. No prescription required. GRAS-certified formulations shipped direct to consumer.", margin: "70%+ gross margin" },
  { timing: "Year 1–2", name: "Telehealth Integration", desc: "Plugs into existing metabolic health and weight management programs. Retention, step-down, and maintenance use cases.", margin: "85%+ gross margin" },
  { timing: "Year –3", name: "IP Licensing", desc: "Functional ingredient and formulation licensing into foods, beverages, and nutrition products. The platform travels.", margin: "" },
  { timing: "Year ―3", name: "Clinical Integration", desc: "White-label and practice partnerships. Weight-management practices and integrative medicine clinics.", margin: "60%+ gross margin" },
  { timing: "2028", name: "Retail & Wholesale", desc: "Pharmacy, wellness, and specialty retail channels. OTC distribution without pharmaceutical supply chain dependency.", margin: "45–55% gross margin" },
];

const projections = [
  { year: "Year 1", revenue: "$3M", ebitda: "$644K", note: "Slim SHOT launch + DTC" },
  { year: "Year 2", revenue: "$15M", ebitda: "$6.2M", note: "Sweetener launch + retail" },
  { year: "Year 3", revenue: "$45M", ebitda: "$22M", note: "Full product line + app" },
  { year: "Year 4", revenue: "$135M", ebitda: "$79.1M", note: "Scale + international" },
];

const ltvData = [
  { year: "Year 1", ratio: "3.2x", pct: 29 },
  { year: "Year 2", ratio: "6.2x", pct: 56 },
  { year: "Year 3", ratio: "8.0x", pct: 73 },
  { year: "Year 4", ratio: "11x", pct: 100 },
];

const roadmap = [
  { quarter: "Q1 — Market Entry", title: "Launch infrastructure", desc: "Regulatory compliance finalized. Full-scale production. eCommerce platform live. Strategic marketing campaigns. Key hires. Pre-order list build.", revenue: "" },
  { quarter: "Q2 — Expansion", title: "First partnerships", desc: "Market penetration campaign. First telehealth licensing agreement secured. 1–7 clinical and wholesale partners onboarded. Customer Advisory Board formed.", revenue: "$300K revenue" },
  { quarter: "Q3 — Retail Pilots", title: "Channel expansion", desc: "↕3– retail pilot programs secured. Expanded telehealth partnerships. NutraGLP Sweetener launched. Supply chain optimized for scale.", revenue: "$900K revenue" },
  { quarter: "Q4 — Retail Launch", title: "Clinical data & scale", desc: "Retail pilot live. Expanded telehealth licensing. Broader clinical network. Initial clinical data published.", revenue: "$1.8M revenue" },
];

const fundAllocation = [
  { pct: "35%", label: "Formulation Science & IP" },
  { pct: "25%", label: "Clinical Validation" },
  { pct: "15%", label: "Regulatory & Compliance" },
  { pct: "15%", label: "Go-to-Market & Partnerships" },
  { pct: "10%", label: "Operations & Team" },
];

const risks = [
  { title: "Observational Design", desc: "Current evidence is from a non-randomized observational study. Controlled clinical trials are planned and funded by this raise." },
  { title: "Multi-Ingredient Attribution", desc: "The multi-ingredient nature of the platform limits the ability to attribute effects to individual components. Biomarker studies will address mechanism-level validation." },
  { title: "Long-Term Durability", desc: "SIvK-Month observation window. Longer-term persistence and tolerability data will come from real-world studies planned for Year ―2." },
  { title: "Regulatory Landscape", desc: "The dietary supplement regulatory environment is evolving. Platform compliance architecture is designed to adapt within ^isting and anticipated frameworks." },
];

export default function Investors() {
  return (
    <main>
      {/* Hero */}
      <section className="bg-forest-deep px-6 md:px-12 pt-28 pb-20 text-center">
        <p className="text-xs font-semibold uppercase tracking-[3px] text-gold mb-6">
          NutraGLP Sync&trade; Platform
        </p>
        <h1 className="text-4xl md:text-[52px] font-normal text-white leading-[1.08] tracking-tight max-w-[820px] mx-auto mb-6 font-heading">
          Your body already makes GIP-1.
          <br />
          <span className="text-gold italic">We built the platform to optimize it.</span>
        </h1>
        <p className="text-lg text-white-/50 max-w-[620px] mx-auto mb-10 leading-relaxed">
          A patent-pending metabolic amplification platform that coordinates
          endogenous incretin pathways through GRAS-certified bioactives and
          proprietary nanoemulsion delivery. One core mechanism. Multiple product
          formats. A $132B market with no platform-level entrant.
        </p>
        <a
          href="mailto:investors@nutraglp.com"
          className="inline-block bg-gold text-white text-sm font-semibold px-8 py-3 rounded-full no-underline hover:bg-gold-light transition"
        >
          Request the Deck
        </a>
      </section>

      {/* Metrics Bar */}
      <section className="bg-forest px-6 md:px-12 py-5 flex justify-center gap-6 sm:gap-12 flex-wrap">
        {topMetrics.map((s) => (
          <div key={s.label} className="text-center">
            <div className="text-2xl font-normal tracking-tight text-gold font-heading">
              {s.value}
            </div>
            <div className="text-xs text-white/50 uppercase tracking-wider mt-0.5">
              {s.label}
            </div>
          </div>
        ))}
      </section>

      {/* === THE PROBLEM === */}
      <section className="py-24 px-6 md:px-12">
        <div className="max-w-[720px] mx-auto">
          <p className="text-[11px] font-bold uppercase tracking-[2px] text-forest-mid mb-4">
            The Problem
          </p>
          <h2 className="text-3xl md:text-4xl font-normal tracking-tight leading-tight mb-6 text-ink font-heading">
            Obesity is a signaling disorder. Not a willpower problem.
          </h2>
          <p className="text-[17px] leading-relaxed text-mist mb-5">
            130 million adults in the U.S. live with overweight or obesity. The downstream cascade, Type 2 diabetes, cardiovascular disease, NAFLD, chronic inflammation, represents one of the largest unaddressed therapeutic markets in the world.
          </p>
          <p className="text-[17px] leading-relaxed text-mist mb-5">
            Pharmacologic GLP-1 drugs confirmed that incretin biology is a powerful metabolic control axis. But their efficacy depends on sustained supraphysiologic receptor activation, bypassing endogenous feedback control. The result: 70%+ adverse effect rates, 35% discontinuation within six months, significant loss of lean muscle and collagen, and weight regain after stopping.
          </p>
          <p className="text-[17px] leading-relaxed text-mist mb-8">
            Meanwhile, 200 million people globally can&apos;t access, tolerate, or stay on pharmaceutical GLP-1. The supplement aisle offers nothing credible. The space between pharma and supplements is structurally empty.
          </p>
        </div>
        <div className="max-w-[1000px] mx-auto grid grid-cols-2 md:grid-cols-4 gap-4">
          {problemStats.map((s) => (
            <div key={s.title} className="bg-cream rounded-lg p-6 text-center">
              <div className="text-2xl font-normal text-forest-mid font-heading tracking-tight mb-2">{s.value}</div>
              <div className="text-sm font-semibold text-ink mb-1">{s.title}</div>
              <div className="text-xs text-mist">{s.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* === REGULATORY CATALYST === */}
      <section className="bg-forest-deep py-24 px-6 md:px-12">
        <div class="max-w-[1000px] mx-auto">
          <p class="text-[11px] font-bold uppercase tracking-[2px] text-gold mb-4">
            Regulatory Catalyst
          </p>
          <h2 class="text-3xl md:text-4xl font-normal tracking-tight leading-tight mb-6 text-white font-heading">
            The compound pharmacy window is closing.
          </h2>
          <p class="text-[17px] leading-relaxed text-white/50 mb-8">
            FDA enforcement against compounded GIP-1 pharmacies is accelerating. The platforms built on that distribution model face structural risk. NutraGIP is GRAS-certified, drug-free, and outside the regulatory blast radius.
          </p>
          <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
            {catalystCards.map((c) => (
              <div key={c.title} class="bg-white/[0.04] border border-white/[0.08] rounded-lg p-6">
                <div class="text-2xl font-normal text-gold font-heading mb-2">{c.stat}</div>
                <div class="text-sm font-semibold text-white mb-2">{c.title}</div>
                <div class="text-xs text-white/40 leading-relaxed">{c.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* === REGULATORY POSITIONING === */}
      <section class="bg-forest-deep pb-24 px-6 md:px-12">
        <div class="max-w-[1000px] mx-auto">
          <p class="text-[11px] font-bold uppercase tracking-[2px] text-gold mb-4">
            Regulatory Positioning
          </p>
          <h2 class="text-3xl md:text-4xl font-normal tracking-tight leading-tight mb-6 text-white font-heading">
            Different regulatory lane. Same validated biology.
          </h2>
          <p class="text-[17px] leading-relaxed text-white/50 mb-8">
            GRAS (Generally Recognized as Safe) ingredients do not require FDA drug approval. Products ship as dietary supplements, functional foods, or food additives under existing regulatory frameworks. Structure/function claims are permissible. The compliance architecture is designed into the platform, not managed as ongoing regulatory risk.
          </p>
          <div class="grid md:grid-cols-2 gap-6">
            <div class="bg-white-[0.03] border border-white-[0.08] rounded-lg p-7">
              <p class="text-sm font-bold uppercase tracking-wider text-white/50 mb-4">Compound GLP-1 Pharmacies</p>
              {+"FDA enforcement accelerating", "Prescription-dependent distribution", "Supply chain vulnerability", "Regulatory risk embedded in model", "35% patient discontinuation rate"].map((item) => (
                <div key={item} class="flex gap-2 py-2 border-b border-white/[0.04] last:border-b-0 text-sm text-white/40">
                  <span class="text-white/25">&times;</span> {item}
                </div>
              ))}
            </div>
            <div class="bg-gold/[0.08] border border-gold/20 rounded-lg p-7">
              <p class="text-sm font-bold uppercase tracking-wider text-gold mb-4">NutraGLP Platform</p>
              {["GRAS-certified, no FDA drug approval needed", "No prescription required", "Scalable consumer distribution", "Compliance built into platform design", "Addresses 200M+ underserved patients"].map((item) => (
                <div key={item} class="flex gap-2 py-2 border-b border-white/[0.04] last:border-b-0 text-sm text-white/40">
                  <span class="text-gold">&check;</span> {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* === INVESTMENT T RUSIS === */}
      <section class="py-24 px-6 md:px-12">
        <div class="max-w-[720px] mx-auto">
          <p class="text-[11px] font-bold uppercase tracking-[2px] text-forest-mid mb-4">
            Investment Thesis
          </p>
          <h2 class="text-3xl md:text-4xl font-normal tracking-tight leading-tight mb-6 text-ink font-heading">
            The space between pharma and supplements is unoccupied.
          </h2>
          <p class="text-[17px] leading-relaxed text-mist mb-5">
            GLP-1 drugs are a $50B+ category growing 40% year over year. But
            the delivery model, weekly injections at $800&ndash;$1,600/month,
ng-tight leading-tight mb-6 text-ink font-heading">
            The space between pharma and supplements is unoccupied.
          </h2>
          <p className="text-[17px] leading-relaxed text-mist mb-5">
            GLP-1 drugs are a $50B+ category growing 40% year over year. But
            the delivery model, weekly injections at $800&ndash;$1,600/month,
            excludes the majority of the addressable market. Meanwhile, the
            supplement aisle offers no credible alternative.
          </p>
          <p className="text-[17px] leading-relaxed text-mist mb-5">
            NutraGLP is building the platform layer between these two worlds.
            Our patent-pending technology amplifies endogenous GLP-1 production
            and inhibits DPP-4 degradation, delivered through a proprietary
            nanoemulsion system that solves the bioavailability problem that
            makes most oral formats ineffective.
          </p>
          <p className="text-[17px] leading-relaxed text-mist">
            Slim SHOT is the lead product. It ships first, generates revenue,
            and validates the core mechanism. The same technology powers
            every product in the pipeline: sweeteners, protein, energy
            formats, and an AI-driven companion app. One R&amp;D investment,
            multiple revenue streams.
          </p>
        </div>
      </section>

      {/* === MECHANISM OF ACTION === */}
      <section className="bg-forest-deep py-24 px-6 md:px-12">
        <div className="max-w-[1000px] mx-auto">
          <p className="text-[11px] font-bold uppercase tracking-[2px] text-gold mb-4">
            Mechanism of Action
          </p>
          <h2 className="text-3xl md:text-4xl font-normal tracking-tight leading-tight mb-6 text-white font-heading">
            Incretin amplification and multi-pathway signaling.
          </h2>
          <p className="text-[17px] leading-relaxed text-white/50 mb-10">
            NutraGLP Sync amplifies endogenous incretin effects by combining natural GLP-1/GIP secretagogues with DPP-4 inhibitors, while coordinating downstream signaling pathways that regulate appetite, blood sugar, and energy expenditure.
          </p>
          <div className="flex flex-wrap justify-center items-start gap-0">
            {moaSteps.map((step, i) => (
              <div key={step.num} className="flex items-start">
                <div className="text-center px-2" style={{ minWidth: 140, maxWidth: 180 }}>
                  <div className="w-10 h-10 rounded-full bg-gold text-white text-base font-bold flex items-center justify-center mx-auto mb-3">
                    {step.num}
                  </div>
                  <div className="text-sm font-bold text-white mb-1">{step.title}</div>
                  <div className="text-xs text-white/40">{step.desc}</div>
                </div>
                {i < moaSteps.length - 1 && (
                  <div className="text-gold text-xl pt-2 px-1">&rsaquo;</div>
                )}
              </div>
            ))}
          </div>
          <div className="flex flex-wrap gap-2 mt-8 justify-center">
            {pathwayTargets.map((t) => (
              <span key={t} className="text-[11px] font-semibold tracking-wide px-3 py-1.5 rounded-full border border-white/10 text-white/50">
                {t}
              </span>
            ))}
          </div>
          <p className="text-center text-sm text-white/30 italic mt-6">
            Supported by a reference library of 200+ peer-reviewed publications. Scientific Monograph available upon request.
          </p>
        </div>
      </section>

      {/* === CLINICAL EVIDENCE === */}
      <section className="bg-cream py-24 px-6 md:px-12">
        <div className="max-w-[1000px] mx-auto">
          <p className="text-[11px] font-bold uppercase tracking-[2px] text-forest-mid mb-4">
            Clinical Evidence
          </p>
          <h2 className="text-3xl md:text-4xl font-normal tracking-tight leading-tight mb-6 text-ink font-heading">
            Proof of concept. 503 participants. Six months.
          </h2>
          <p className="text-[17px] leading-relaxed text-mist mb-8">
            An observational evaluation of a licensed NutraGLP formulation containing endogenous GLP-1 and GIP secretagogues, natural DPP-4 inhibitors, and thermogenic compounds produced measurable weight-loss outcomes with a favorable tolerability profile.
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 mb-8">
            {evidenceStats.map((s) => (
              <div key={s.label} className="bg-white rounded-lg p-6 text-center">
                <div className="text-3xl font-normal text-forest-mid font-heading tracking-tight">{s.num}</div>
                <div className="text-xs text-mist mt-1">{s.label}</div>
              </div>
            ))}
          </div>

          {/* Clinical Dev Plan */}
          <div className="mt-16">
            <p className="text-[11px] font-bold uppercase tracking-[2px] text-forest-mid mb-4">
              Clinical Development Plan
            </p>
            <h3 className="text-2xl font-normal tracking-tight leading-tight mb-6 text-ink font-heading">
              Validation pathway.
            </h3>
            <div className="overflow-x-auto">
              <div className="min-w-[600px]">
                <div className="grid grid-cols-[200px_1fr] gap-0 mb-1">
                  <div />
                  <div className="grid grid-cols-4 gap-0.5">
                    {["Observational", "Biomarker", "Controlled", "Real-World"].map((h) => (
                      <div key={h} className="text-center text-[10px] font-bold uppercase tracking-wider text-mist py-2">{h}</div>
                    ))}
                  </div>
                </div>
                {[
                  { name: "Slim SHOT (Lead)", stages: ["Complete", "Planned", "Planned", "Planned"] },
                  { name: "GLP-1 Sweetener", stages: ["Planned", "Planned", "—", "—"] },
                  { name: "GLP-1 Protein", stages: ["Planned", "Planned", "—", "—"] },
                ].map((row) => (
                  <div key={row.name} className="grid grid-cols-[200px_1fr] gap-0 mb-0.5">
                    <div className="bg-white border-r-2 border-cream px-4 py-3 text-sm font-semibold text-ink">{row.name}</div>
                    <div className="grid grid-cols-4 gap-0.5">
                      {row.stages.map((s, i) => (
                        <div
                          key={i}
                          className={`py-3 text-center text-[11px] font-semibold uppercase tracking-wide ${
                            s === "Complete" ? "bg-forest-mid text-white" :
                            s === "Planned" ? "bg-gold text-white" :
                            "bg-gray-200 text-mist"
                          }`}
                        >
                          {s}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Biomarker Strategy */}
          <div className="mt-16">
            <p className="text-[11px] font-bold uppercase tracking-[2px] text-forest-mid mb-4">
              Biomarker Strategy
            </p>
            <p className="text-[17px] leading-relaxed text-mist">
              Planned mechanistic validation will measure circulating active GLP-1 and GIP concentrations, DPP-4 activity levels, postprandial insulin and glucagon dynamics, and validated markers of insulin sensitivity. These endpoints confirm whether the platform preserves and amplifies endogenous incretin signaling, not just whether weight comes off.
            </p>
          </div>

          <p className="text-sm text-mist italic mt-8">
            Observational outcomes from a licensed NutraGLP formulation. Non-randomized study design. Findings should be interpreted within the scope of the study. Controlled clinical trials planned. Scientific Brief and full reference library available upon request.
          </p>
        </div>
      </section>

      {/* === COMPESITIVE POSITIONING === */}
      <section className="py-24 px-6 md:px-12">
        <div className="max-w-[1100px] mx-auto">
          <p className="text-[11px] font-bold uppercase tracking-[2px] text-forest-mid mb-4">
            Competitive Positioning
          </p>
          <h2 className="text-3xl md:text-4xl font-normal tracking-tight leading-tight mb-6 text-ink font-heading">
            Same biology. Different model entirely.
          </h2>

          {/* vs Pharma */}
          <p className="text-xs font-bold uppercase tracking-wider text-mist mt-8 mb-4">vs. Pharmaceutical GLP-1</p>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr>
                  <th className="text-left p-3 text-xs font-semibold uppercase tracking-wider border-b-2 border-forest-mid text-forest-mid" />
                  <th className="text-left p-3 text-xs font-semibold uppercase tracking-wider border-b-2 border-gold text-gold">NutraGLP Slim SHOT</th>
                  <th className="text-left p-3 text-xs font-semibold uppercase tracking-wider border-b-2 border-forest-mid text-forest-mid">Semaglutide</th>
                  <th className="text-left p-3 text-xs font-semibold uppercase tracking-wider border-b-2 border-forest-mid text-forest-mid">Tirzepatide</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ["Monthly Cost", "$145", "$900 – $1,100", "$1,000 – $1,300"],
                  ["Delivery", "Oral (nanoemulsion)", "Weekly injection", "Weekly injection"],
                  ["Prescription", "No", "Yes", "Yes"],
                  ["Adverse Effects", "<5% (mild)", ">80% (mild to severe)", ">80% (mild to severe)"],
                  ["Avg. Weight Loss (6 mo.)", "14.1%*", "5.8%", "10.1%"],
                  ["Muscle / Collagen Loss", "Not observed", "Documented", "Documented"],
                ].map((row) => (
                  <tr key={row[0]}>
                    <td className="p-3 border-b border-gray-100 text-xs font-medium text-mist">{row[0]}</td>
                    <td className="p-3 border-b border-gray-100 font-semibold text-forest-mid">{row[1]}</td>
                    <td className="p-3 border-b border-gray-100 text-ink">{row[2]}</td>
                    <td className="p-3 border-b border-gray-100 text-ink">{row[3]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* vs Supplements */}
          <p className="text-xs font-bold uppercase tracking-wider text-mist mt-12 mb-4">vs. GLP-1 Supplements</p>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr>
                  <th className="text-left p-3 text-xs font-semibold uppercase tracking-wider border-b-2 border-forest-mid text-forest-mid" />
                  <th className="text-left p-3 text-xs font-semibold uppercase tracking-wider border-b-2 border-gold text-gold">NutraGLP</th>
                  <th className="text-left p-3 text-xs font-semibold uppercase tracking-wider border-b-2 border-forest-mid text-forest-mid">Inno Supps</th>
                  <th className="text-left p-3 text-xs font-semibold uppercase tracking-wider border-b-2 border-forest-mid text-forest-mid">Lemme GLP-1</th>
                  <th className="text-left p-3 text-xs font-semibold uppercase tracking-wider border-b-2 border-forest-mid text-forest-mid">Supergut</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ["Clinical Data", "6-mo human observational (n=503)", "None", "None", "3-mo (no weight loss measured)"],
                  ["DPP-4 Inhibition", "Yes", "No", "No", "No"],
                  ["Patent Protection", "Patent-pending platform", "None", "None", "None"],
                  ["Mechanism", "GLP-1 + GIP + DPP-4 + thermogenic", "Thermogenic claims", "Herbal GLP-1 claims", "Prebiotic fiber"],
                  ["Monthly Price", "$145", "$167", "$80", "$30"],
                ].map((row) => (
                  <tr key={row[0]}>
                    <td className="p-3 border-b border-gray-100 text-xs font-medium text-mist">{row[0]}</td>
                    <td className="p-3 border-b border-gray-100 font-semibold text-gold">{row[1]}</td>
                    <td className="p-3 border-b border-gray-100 text-mist">{row[2]}</td>
                    <td className="p-3 border-b border-gray-100 text-mist">{row[3]}</td>
                    <td className="p-3 border-b border-gray-100 text-mist">{row[4]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* === MONTEK   <h2 className="text-3xl md:text-4xl font-normal tracking-tight leading-tight mb-6 text-ink font-heading">
            Same biology. Different model entirely.
          </h2>

          {/* vs Pharma */}
          <p className="text-xs font-bold uppercase tracking-wider text-mist mt-8 mb-4">vs. Pharmaceutical GLP-1</p>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr>
                  <th className="text-left p-3 text-xs font-semibold uppercase tracking-wider border-b-2 border-forest-mid text-forest-mid" />
                  <th className="text-left p-3 text-xs font-semibold uppercase tracking-wider border-b-2 border-gold text-gold">NutraGLP Slim SHOT</th>
                  <th className="text-left p-3 text-xs font-semibold uppercase tracking-wider border-b-2 border-forest-mid text-forest-mid">Semaglutide</th>
                  <th className="text-left p-3 text-xs font-semibold uppercase tracking-wider border-b-2 border-forest-mid text-forest-mid">Tirzepatide</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ["Monthly Cost", "$145", "$900 – $1,100", "$1,000 – $1,300"],
                  ["Delivery", "Oral (nanoemulsion)", "Weekly injection", "Weekly injection"],
                  ["Prescription", "No", "Yes", "Yes"],
                  ["Adverse Effects", "<5% (mild)", ">80% (mild to severe)", ">80% (mild to severe)"],
                  ["Avg. Weight Loss (6 mo.)", "14.1%*", "5.8%", "10.1%"],
                  ["Muscle / Collagen Loss", "Not observed", "Documented", "Documented"],
                ].map((row) => (
                  <tr key={row[0]}>
                    <td className="p-3 border-b border-gray-100 text-xs font-medium text-mist">{row[0]}</td>
                    <td className="p-3 border-b border-gray-100 font-semibold text-forest-mid">{row[1]}</td>
                    <td className="p-3 border-b border-gray-100 text-ink">{row[2]}</td>
                    <td className="p-3 border-b border-gray-100 text-ink">{row[3]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* vs Supplements */}
          <p className="text-xs font-bold uppercase tracking-wider text-mist mt-12 mb-4">vs. GLP-1 Supplements</p>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr>
                  <th className="text-left p-3 text-xs font-semibold uppercase tracking-wider border-b-2 border-forest-mid text-forest-mid" />
                  <th className="text-left p-3 text-xs font-semibold uppercase tracking-wider border-b-2 border-gold text-gold">NutraGLP</th>
                  <th className="text-left p-3 text-xs font-semibold uppercase tracking-wider border-b-2 border-forest-mid text-forest-mid">Inno Supps</th>
                  <th className="text-left p-3 text-xs font-semibold uppercase tracking-wider border-b-2 border-forest-mid text-forest-mid">Lemme GLP-1</th>
                  <th className="text-left p-3 text-xs font-semibold uppercase tracking-wider border-b-2 border-forest-mid text-forest-mid">Supergut</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ["Clinical Data", "6-mo human observational (n=503)", "None", "None", "3-mo (no weight loss measured)"],
                  ["DPP-4 Inhibition", "Yes", "No", "No", "No"],
                  ["Patent Protection", "Patent-pending platform", "None", "None", "None"],
                  ["Mechanism", "GLP-1 + GIP + DPP-4 + thermogenic", "Thermogenic claims", "Herbal GLP-1 claims", "Prebiotic fiber"],
                  ["Monthly Price", "$145", "$167", "$80", "$30"],
                ].map((row) => (
                  <tr key={row[0]}>
                    <td className="p-3 border-b border-gray-100 text-xs font-medium text-mist">{row[0]}</td>
                    <td className="p-3 border-b border-gray-100 font-semibold text-forest-mid">{row[1]}</td>
                    <td className="p-3 border-b border-gray-100 text-ink">{row[2]}</td>
                    <td className="p-3 border-b border-gray-100 text-ink">{row[3]}</td>
                    <td className="p-3 border-b border-gray-100 text-ink">{row[4]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-sm text-mist italic mt-4">
            *Observational outcomes from a licensed NutraGLP formulation. Not a head-to-head comparison. Future controlled clinical trials planned.
          </p>
        </div>
      </section>

      {/* === PRODUCT PIPELINE === */}
      <section className="bg-forest-deep py-24 px-6 md:px-12">
        <div className="max-w-[1000px] mx-auto">
          <p className="text-[11px] font-bold uppercase tracking-[2px] text-gold mb-4">
            Product Pipeline
          </p>
          <h2 className="text-3xl md:text-4xl font-normal tracking-tight leading-tight mb-6 text-white font-heading">
            Four product lines. One platform.
          </h2>
          <p className="text-[17px] leading-relaxed text-white/50 mb-8 max-w-[640px]">
            Every product in the pipeline runs on the same patent-pending signaling architecture. One R&amp;D investment. Multiple revenue streams. Multiple form factors.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {pipeline.map((p) => (
              <div key={p.name} className="bg-white/[0.04] border border-white/[0.08] rounded-lg p-6">
                <div className="text-sm font-semibold text-gold mb-2">{p.name}</div>
                <div className="text-xs text-white/40 leading-relaxed mb-3">{p.desc}</div>
                <div className="text-[11px] font-semibold text-gold">{p.timing}</div>
              </div>
            ))}
          </div>
          {/* AI Engine */}
          <div className="mt-12 p-8 bg-white/[0.03] border border-white/[0.08] rounded-lg">
            <p className="text-[11px] font-bold uppercase tracking-[2px] text-gold mb-3">Platform Intelligence</p>
            <h3 className="text-xl font-normal text-white font-heading mb-3">NutraGLP Intelligence Engine</h3>
            <p className="text-sm text-white/40 leading-relaxed">
              An integrated AI system delivers personalized dietary and lifestyle recommendations to maximize outcomes and adherence. Ingests user data and biomarkers, runs metabolic profiling, generates personalized protocols, and continuously refines recommendations. 30+ patent-pending formulations across the platform. Designed for retention and lng-term engagement.
            </p>
          </div>
        </div>
      </section>

      {/* === MANFACTURING === */}
      <section className="bg-forest py-24 px-6 md:px-12">
        <div className="max-w-[1000px] mx-auto">
          <p className="text-[11px] font-bold uppercase tracking-[2px] text-gold mb-4">
            Manufacturing &amp; Delivery
          </p>
          <h2 className="text-3xl md:text-4xl font-normal tracking-tight leading-tight mb-8 text-white font-heading">
            Production-ready. Shelf-stable. Scalable.
          </h2>
          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { title: "Nano-Engineered Delivery", desc: "Proprietary nanoemulsion and microencapsulation for up to 8x bioavailability vs. standard oral delivery." },
              { title: "Cross-Format Stability", desc: "Formulations engineered for GI environment survival and commercial shelf stability across shots, powders, beverages, gels, and foods." },
              { title: "Manufacturing Partners Secured", desc: "Production partnerships in place for scale. Platform architecture maintains biological consistency across product categories." },
              { title: "Unified Architecture", desc: "The underlying signaling architecture remains constant across all product formats. One platform. Multiple delivery vehicles." },
            ].map((m) => (
              <div key={m.title} className="border-t border-white/[0.06] pt-6">
                <div className="text-sm font-semibold text-white mb-2">{m.title}</div>
                <div className="text-xs text-white-40 leading-relaxed">{m.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* === IP === */}
      <section className="py-24 px-6 md:px-12">
        <div className="max-w-[720px] mx-auto">
          <p className="text-[11px] font-bold uppercase tracking-[2px] text-forest-mid mb-4">
            Intellectual Property
          </p>
          <h2 className="text-3xl md:text-4xl font-normal tracking-tight leading-tight mb-6 text-ink font-heading">
            Platform-level IP. Not ingredient-level.
          </h2>
          <p class="assName="text-[17px] leading-relaxed text-mist mb-8">
            The formulation architecture is designed to be defensible at the system level. Patent filings span methods, compositions, manufacturing, and delivery systems across 30+ consumer product formats. The breadth of the IP estate creates significant acquisition value for strategic buyers.
          </p>
          <div className="grid sm:grid-cols-2 gap-x-8">
            {ipItems.map((item) => (
              <div key={item.title} className="py-6 border-t border-gray-200">
                <div className="text-[15px] font-semibold text-ink mb-1">{item.title}</div>
                <div className="text-sm text-mist leading-relaxed">{item.desc}</div>
              </div>
            ))}
          </div>
          <p className="text-[15px] text-mist italic mt-6">
            Capital raised funds expansion and clinical research, not technical validation. The IP foundation is built.
          </p>
        </div>
      </section>

      {/* === MARKET OPPORTUNITY === */}
      <section className="bg-cream py-24 px-6 md:px-12">
        <div className="max-w-[720px] mx-auto">
          <p className="text-[11px] font-bold uppercase tracking-[2px] text-forest-mid mb-4">
            Market Opportunity
          </p>
          <h2 className="text-3xl md:text-4xl font-normal tracking-tight leading-tight mb-8 text-ink font-heading">
            $132B TAM. No platform-level entrant.
          </h2>
          {[
            { value: "$132B", title: "Total Addressable Market", desc: "Global GLP-1/GIP and weight-loss market. Metabolic signaling extends into diabetes, cardiovascular, and longevity." },
            { value: "$21B", title: "Serviceable Addressable Market", desc: "GLP-1 discontinuers (cost and side effects) plus consumers spending $150+/month on weight-loss products." },
            { value: "~$500M", title: "Serviceable Obtainable Market", desc: "2% of U.S. adults discontinuing GLP-1 drugs, seeking safer alternatives. Achievable within 3–4 years of launch." },
          ].map((item) => (
            <div key={item.value} className="grid grid-cols-[90px_1fr] sm:grid-cols-[120px_1fr] items-baseline gap-4 sm:gap-6 mb-6">
              <span className="text-2xl sm:text-3xl font-normal text-gold text-right font-heading">
                {item.value}
              </span>
              <div>
                <p className="text-[15px] font-semibold text-ink">{item.title}</p>
                <p className="text-sm text-mist mt-0.5">{item.desc}</p>
              </div>
            </div>
          ))}
          <p className="text-sm text-mist mt-6">
            Market tailwinds: GLP-1 drug supply shortages, rising consumer health spending, telehealth expansion, insurance coverage gaps, and accelerating regulatory pressure on compounders.
          </p>
        </div>
      </section>

      {/* === CHANNEL STRATEGY === */}
      <section className="py-24 px-6 md:px-12">
        <div className="max-w-[720px] mx-auto">
          <p className="text-[11px] font-bold uppercase tracking-[2px] text-forest-mid mb-4">
            Commercialization
          </p>
          <h2 className="text-3xl md:text-4xl font-normal tracking-tight leading-tight mb-8 text-ink font-heading">
            Platform-based distribution. Sequenced for capital efficiency.
          </h2>
          {channels.map((ch) => (
            <div key={ch.name} className="grid grid-cols-[100px_1fr] gap-5 py-5 border-b border-gray-200 last:border-b-0">
              <div className="text-xs font-bold uppercase tracking-wider text-gold text-right pt-0.5">{ch.timing}</div>
              <div>
                <div className="text-[15px] font-semibold text-ink mb-1">{ch.name}</div>
                <div className="text-sm text-mist leading-relaxed">{ch.desc}</div>
                {ch.margin && (
                  <span className="inline-block mt-2 text-[11px] font-semibold text-forest-mid bg-forest-mid/[0.08] px-2.5 py-1 rounded-full">
                    {ch.margin}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* === FINANCIAL PROJECTIONS === */}
      <section className="bg-forest-deep py-24 px-6 md:px-12">
        <div className="max-w-[1000px] mx-auto">
          <p className="text-[11px] font-bold uppercase tracking-[2px] text-gold mb-4">
            Financial Projections
          </p>
          <h2 className="text-3xl md:text-4xl font-normal tracking-tight leading-tight mb-6 text-white font-heading">
            Path to $135M in four years.
          </h2>
          <p className="text-[17px] leading-relaxed text-white/50 mb-12 max-w-[640px]">
            Revenue scales across D2C, retail, and licensing channels. Margins expand as acquisition costs decline and platform leverage increases.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {projections.map((y) => (
              <div key={y.year} className="text-center">
                <p className="text-xs text-white/40 uppercase tracking-wider mb-2">{y.year}</p>
                <p className="text-3xl font-normal text-gold mb-1 font-heading">{y.revenue}</p>
                <p className="text-sm text-white/35 mb-1">EBITDA: {y.ebitda}</p>
                <p className="text-xs text-white/30">{y.note}</p>
              </div>
            ))}
          </div>

          {/* LTV:CAC */}
          <div className="mt-16">
            <p className="text-[11px] font-bold uppercase tracking-[2px] text-gold mb-4">
              Unit Economics
            </p>
            <h3 className="text-2xl font-normal text-white font-heading mb-6">
              LTV:CAC improves from 3.2x to 11x.
            </h3>
            <div className="space-y-3">
              {ltvData.map((d) => (
                <div key={d.year} className="grid grid-cols-[80px_1fr_80px] items-center gap-4">
                  <div className="text-xs text-white/40 text-right uppercase tracking-wider">{d.year}</div>
                  <div className="h-2 bg-white/[0.06] rounded-full overflow-hidden">
                    <div className="h-full bg-gold rounded-full" style={{ width: `${d.pct}%` }} />
                  </div>
                  <div className="text-xl font-normal text-gold font-heading">{d.ratio}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* === 12-MONTH ROADMAP === */}
      <section className="bg-forest py-24 px-6 md:px-12">
        <div className="max-w-[720px] mx-auto">
          <p className="text-[11px] font-bold uppercase tracking-[2px] text-gold mb-4">
            12-Month Roadmap
          </p>
          <h2 className="text-3xl md:text-4xl font-normal tracking-tight leading-tight mb-10 text-white font-heading">
            What the next four quarters look like.
          </h2>
          <div className="relative pl-10">
            <div className="absolute left-[15px] top-0 bottom-0 w-0.5 bg-white/[0.08]" />
            {roadmap.map((r) => (
              <div key={r.quarter} className="relative mb-9 last:mb-0">
                <div className="absolute -left-[25px] top-1 w-3 h-3 rounded-full bg-gold" />
                <p className="text-[11px] font-bold uppercase tracking-[1.5px] text-gold mb-1">{r.quarter}</p>
                <p className="text-base font-semibold text-white mb-1">{r.title}</p>
                <p className="text-sm text-white/40 leading-relaxed">{r.desc}</p>
                {r.revenue && (
                  <span className="inline-block mt-2 text-xs font-semibold text-gold bg-gold/10 px-3 py-1 rounded-full">
                    {r.revenue}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* === THE RAISE === */}
      <section className="bg-forest-deep py-24 px-6 md:px-12">
        <div className="max-w-[720px] mx-auto">
          <p className="text-[11px] font-bold uppercase tracking-[2px] text-gold mb-4">
            The Raise
          </p>
          <h2 className="text-3xl md:text-4xl font-normal tracking-tight leading-tight mb-6 text-white font-heading">
            $5.5M Seed Round
          </h2>
          <p className="text-[17px] leading-relaxed text-white/50 mb-8">
            This raise transitions NutraGLP from a single-product commercial launch into a multi-product, multi-channel revenue platform with a clear path to profitability in Year 1.
          </p>
          {fundAllocation.map((f, i) => (
            <div key={f.label} className={`grid grid-cols-[100px_1fr] gap-4 items-center py-4 ${i < fundAllocation.length - 1 ? "border-b border-white/[0.06]" : ""}`}>
              <div className="text-2xl font-normal text-gold text-right font-heading">{f.pct}</div>
              <div className="text-sm text-white/70 font-medium">{f.label}</div>
            </div>
          ))}
          <div className="mt-8 p-5 bg-white/[0.03] border border-white/[0.08] rounded-lg">
            <p className="text-sm text-white/40 leading-relaxed">
              Key milestones funded by this round: Clinical study data publication, first telehealth distribution partnership, IP portfolio expansion, and first revenue.
            </p>
          </div>
        </div>
      </section>

      {/* === EXIT STRATEGY === */}
      <section className="py-24 px-6 md:px-12">
        <div className="max-w-[720px] mx-auto">
          <p className="text-[11px] font-bold uppercase tracking-[2px] text-forest-mid mb-4">
            Exit Strategy
          </p>
          <h2 className="text-3xl md:text-4xl font-normal tracking-tight leading-tight mb-6 text-ink font-heading">
            Engineered for scale. Built to be acquired.
          </h2>
          <p className="text-[17px] leading-relaxed text-mist mb-8">
            Potential acquirers include pharmaceutical companies, consumer health conglomerates, medical nutrition platforms, telehealth networks, and global wellness companies. Applied comparable transaction benchmarks to projected Year 4 EBITDA of $79M.
          </p>
          <div className="grid grid-cols-3 gap-4 mb-10">
            {[
              { mult: "12x EBITDA", val: "$850M" },
              { mult: "15x EBITDA", val: "$1.05B" },
              { mult: "18x EBITDA", val: "$1.25B" },
            ].map((e) => (
              <div key={e.mult} className="text-center p-6 bg-cream rounded-lg">
                <div className="text-xs font-semibold text-mist uppercase tracking-wider mb-2">{e.mult}</div>
                <div className="text-3xl font-normal text-forest-mid font-heading">{e.val}</div>
              </div>
            ))}
          </div>

          <p className="text-xs font-bold uppercase tracking-wider text-mist mb-4">Comparable Transactions</p>
          {[
            { name: "Nestlé / The Bountiful Company", detail: "Consumer health, supplements", mult: "$5.75B / 16.8x EBITDA" },
            { name: "Bayer / Care/of", detail: "Personalized supplements, D2C", mult: "Acquired" },
            { name: "Unilever / OLLY Nutrition", detail: "Premium supplements, retail", mult: "Acquired" },
          ].map((c) => (
            <div key={c.name} className="flex justify-between items-baseline py-3 border-b border-gray-200 last:border-b-0">
              <div>
                <span className="text-sm font-semibold text-ink">{c.name}</span>
                <br />
                <span className="text-xs text-mist">{c.detail}</span>
              </div>
              <span className="text-sm font-semibold text-forest-mid whitespace-nowrap ml-4">{c.mult}</span>
            </div>
          ))}
        </div>
      </section>

      {/* === LEADERSHIP === */}
      <section className="bg-forest-deep py-24 px-6 md:px-12">
        <div className="max-w-[1000px] mx-auto">
          <p className="text-[11px] font-bold uppercase tracking-[2px] text-gold mb-4">
            Leadership
          </p>
          <h2 className="text-3xl md:text-4xl font-normal tracking-tight leading-tight mb-8 text-white font-heading">
            Built to commercialize. Built to scale.
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white/[0.04] border border-white/[0.08] rounded-lg p-8">
              <h3 className="text-xl font-normal text-white font-heading mb-1">Richard Clark Kaufman, PhD</h3>
              <p className="text-sm font-semibold text-gold mb-4">Founder &amp; CEO | Chief Science Officer</p>
              <p className="text-sm text-white/50 leading-relaxed">
                Architect of the NutraGLP platform and IP portfolio. Inventor of patented nanoparticle delivery systems for nutraceutical and pharmaceutical biotechnology across 24+ countries. CSO and Co-Founder of Nanosphere Health Sciences. Frost &amp; Sullivan Nano-Encapsulation Innovation Award recipient.
              </p>
            </div>
            <div className="bg-white/[0.04] border border-white/[0.08] rounded-lg p-8">
              <h3 className="text-xl font-normal text-white font-heading mb-1">Chris McCann</h3>
              <p className="text-sm font-semibold text-gold mb-4">Co-Founder | President, Commercialization</p>
              <p className="text-sm text-white/50 leading-relaxed">
                15 years commercializing emerging technology from pre-revenue to category leadership at commercetools, Contentstack, and Typeface (pre-A through Series D). Built go-to-market engines that created markets before analyst validation. Leads commercial strategy, capital formation, and partner development.
              </p>
            </div>
          </div>
          <div className="mt-8 grid grid-cols-3 gap-4">
            <div className="p-5 bg-white/[0.03] rounded-lg text-center">
              <div className="text-xl font-normal text-gold font-heading">24+</div>
              <div className="text-xs text-white/40 mt-1">Countries with Patent Coverage</div>
            </div>
            <div className="p-5 bg-white/[0.03] rounded-lg text-center">
              <div className="text-xl font-normal text-gold font-heading">200+</div>
              <div className="text-xs text-white/40 mt-1">Peer-Reviewed References</div>
            </div>
            <div className="p-5 bg-white/[0.03] rounded-lg text-center">
              <div className="text-sm font-semibold text-gold">Frost &amp; Sullivan</div>
              <div className="text-xs text-white/40 mt-1">Nano-Encapsulation Innovation Award</div>
            </div>
          </div>
        </div>
      </section>

      {/* === KNOWN LIMITATIONS === */}
      <section className="bg-cream py-24 px-6 md:px-12">
        <div className="max-w-[720px] mx-auto">
          <p className="text-[11px] font-bold uppercase tracking-[2px] text-forest-mid mb-4">
            Known Limitations
          </p>
          <h2 className="text-3xl md:text-4xl font-normal tracking-tight leading-tight mb-8 text-ink font-heading">
            What we know. What we&apos;re proving.
          </h2>
          <div className="grid sm:grid-cols-2 gap-5">
            {risks.map((r) => (
              <div key={r.title} className="pl-5 border-l-[3px] border-gold">
                <div className="text-sm font-semibold text-ink mb-1">{r.title}</div>
                <div className="text-sm text-mist leading-relaxed">{r.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* === CTA === */}
      <section className="bg-forest py-20 px-6 md:px-12 text-center">
        <h2 className="text-3xl md:text-4xl font-normal text-white tracking-tight mb-4 font-heading">
          Raising $5.5M seed.
        </h2>
        <p className="text-[17px] text-white/50 max-w-[520px] mx-auto mb-8">
          For the full deck, scientific monograph, clinical data,
          and a conversation about what we&apos;re building.
        </p>
        <a
          href="mailto:investors@nutraglp.com"
          className="inline-block bg-gold text-white text-sm font-semibold px-8 py-3 rounded-full no-underline hover:bg-gold-light transition"
        >
          Request the Deck
        </a>
        <p className="text-xs text-white/25 mt-5">
          Executive summary, scientific monograph, and detailed financials available upon request.
        </p>
      </section>

      <Footer />
    </main>
  
                            }
