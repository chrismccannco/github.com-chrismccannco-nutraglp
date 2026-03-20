/**
 * Seed all hardcoded pages into the CMS as block-based content.
 *
 * Run:  npx tsx scripts/seed-pages.ts
 *
 * Safe to run multiple times — uses INSERT OR IGNORE so existing slugs are skipped.
 */

import { getDb, initDb } from "../lib/db";

interface SeedPage {
  slug: string;
  title: string;
  meta_description: string;
  meta_title: string;
  blocks: unknown[];
  published: number;
}

const pages: SeedPage[] = [
  /* ───────────────────── ABOUT ───────────────────── */
  {
    slug: "about",
    title: "About NutraGLP",
    meta_description:
      "Meet the team behind NutraGLP. Building the platform layer between pharmaceutical GLP-1 drugs and the supplement aisle with patent-pending nanoemulsion technology.",
    meta_title: "About — NutraGLP",
    published: 1,
    blocks: [
      {
        id: "about-hero",
        type: "hero",
        order: 0,
        data: {
          headline: "The team behind NutraGLP",
          subheadline:
            "Building the platform layer between pharmaceutical GLP-1 drugs and the supplement aisle.",
          ctaText: "",
          ctaUrl: "",
          bgImage: "",
          bgColor: "forest",
          textAlign: "center",
        },
      },
      {
        id: "about-leadership",
        type: "rich_text",
        order: 1,
        data: {
          html: `<h2>Leadership</h2>
<h3>Richard Kaufman, PhD — Founder & CEO</h3>
<p>Richard built the NutraGLP platform and its underlying intellectual property portfolio. He invented the patented nanoparticle delivery systems that form the basis of the company's technology, with patent protection across 24+ countries spanning nutraceutical and pharmaceutical biotechnology applications.</p>
<p>Before NutraGLP, Richard served as Chief Science Officer and Co-Founder of Nanosphere Health Sciences, a publicly traded nanoemulsion technology company. His work in nano-encapsulation earned the Frost & Sullivan Innovation Award.</p>
<p>His focus now is the same problem he has studied for two decades: how to get bioactive compounds past the GI tract and into the bloodstream at concentrations that matter. The nanoemulsion platform is the answer he kept arriving at.</p>
<h3>Chris McCann — Co-Founder & President</h3>
<p>Chris spent fifteen years leading enterprise sales organizations across SaaS, cloud infrastructure, and emerging technology before co-founding NutraGLP. The pattern he observed across every category was the same: the best technology means nothing without trust.</p>
<p>At NutraGLP he is responsible for go-to-market strategy, capital formation, and commercial operations. He builds the systems that connect the science to the market, the investors to the mission, and the product to the consumer.</p>
<p>He also studies consciousness, identity, and the structures that shape human decision-making. That work informs how he thinks about brand, positioning, and the gap between what people want and what they are willing to try.</p>`,
        },
      },
      {
        id: "about-divider-1",
        type: "divider",
        order: 2,
        data: { style: "solid", spacing: "md" },
      },
      {
        id: "about-thesis",
        type: "rich_text",
        order: 3,
        data: {
          html: `<h2>The Thesis</h2>
<p><strong>The supplement aisle has a delivery problem, not a formulation problem.</strong></p>
<p>The compounds that activate natural GLP-1 production have published clinical evidence. AMPK activation stimulates L-cell secretion. GPR120 receptor signaling triggers incretin release. Insulin receptor sensitization supports glucose-dependent GLP-1 output. The mechanisms are characterized. The pathways are mapped.</p>
<p>The gap between what the research shows and what consumers experience is bioavailability. Standard oral supplements lose 95% or more of their active compounds to stomach acid degradation, poor intestinal absorption, and first-pass liver metabolism. The compounds work. The delivery does not.</p>
<p>NutraGLP exists to solve the delivery problem. The patent-pending nanoemulsion platform encapsulates active compounds in lipid-based nanoparticles that survive the GI tract, cross the intestinal membrane, and reach their target metabolic pathways at effective concentrations. Not by increasing the dose. By ensuring the dose arrives.</p>`,
        },
      },
      {
        id: "about-standards",
        type: "card_grid",
        order: 4,
        data: {
          cards: [
            {
              id: "std-1",
              title: "GRAS Certified",
              description:
                "Every active compound holds Generally Recognized as Safe status at the dosages used in the formula.",
              imageUrl: "",
              ctaText: "",
              ctaUrl: "",
            },
            {
              id: "std-2",
              title: "cGMP Manufacturing",
              description:
                "Produced in FDA-registered, cGMP-certified facilities with documented quality controls at every stage.",
              imageUrl: "",
              ctaText: "",
              ctaUrl: "",
            },
            {
              id: "std-3",
              title: "Third-Party Testing",
              description:
                "Independent lab verification of purity, potency, and composition for every batch before release.",
              imageUrl: "",
              ctaText: "",
              ctaUrl: "",
            },
            {
              id: "std-4",
              title: "Patent-Pending Platform",
              description:
                "The nanoemulsion delivery system is protected by patent-pending intellectual property covering formulation and process.",
              imageUrl: "",
              ctaText: "",
              ctaUrl: "",
            },
          ],
          columns: 2,
          bgColor: "cream",
        },
      },
    ],
  },

  /* ───────────────────── SLIM SHOT ───────────────────── */
  {
    slug: "slim-shot",
    title: "Slim SHOT — Daily GLP-1 Activation",
    meta_description:
      "A daily liquid formula that activates your body's own GLP-1 production. Patent-pending nanoemulsion delivery, clinically studied compounds. $155/mo.",
    meta_title: "Slim SHOT — Daily GLP-1 Activation | NutraGLP",
    published: 1,
    blocks: [
      {
        id: "ss-hero",
        type: "hero",
        order: 0,
        data: {
          headline:
            "Daily GLP-1 activation. Drink it. No needle. No syringe. Ever.",
          subheadline:
            "Slim SHOT is a drinkable liquid, not an injection. A patent-pending nanoemulsion you take by mouth every morning that amplifies your body's natural GLP-1 production and inhibits the enzyme that breaks it down.",
          ctaText: "Join the Waitlist",
          ctaUrl: "#waitlist",
          bgImage: "",
          bgColor: "forest",
          textAlign: "left",
        },
      },
      {
        id: "ss-stats",
        type: "stats_grid",
        order: 1,
        data: {
          stats: [
            { id: "ss-s1", label: "Daily", value: "1 shot" },
            { id: "ss-s2", label: "Morning Routine", value: "30 sec" },
            { id: "ss-s3", label: "Natural", value: "100%" },
            { id: "ss-s4", label: "Injections", value: "0" },
          ],
          columns: 4,
          bgColor: "forest",
        },
      },
      {
        id: "ss-mechanism",
        type: "card_grid",
        order: 2,
        data: {
          cards: [
            {
              id: "ss-m1",
              title: "Activate",
              description:
                "Clinically studied compounds that stimulate your body's own GLP-1 and GIP production from intestinal L-cells.",
              imageUrl: "",
              ctaText: "",
              ctaUrl: "",
            },
            {
              id: "ss-m2",
              title: "Protect",
              description:
                "Natural DPP-4 inhibition extends the half-life of your endogenous hormones before enzymatic breakdown.",
              imageUrl: "",
              ctaText: "",
              ctaUrl: "",
            },
            {
              id: "ss-m3",
              title: "Deliver",
              description:
                "Patent-pending nanoemulsion carrier ensures bioavailability. The delivery system is the differentiator.",
              imageUrl: "",
              ctaText: "",
              ctaUrl: "",
            },
          ],
          columns: 3,
          bgColor: "",
        },
      },
      {
        id: "ss-divider",
        type: "divider",
        order: 3,
        data: { style: "solid", spacing: "md" },
      },
      {
        id: "ss-timeline",
        type: "rich_text",
        order: 4,
        data: {
          html: `<h2>The first 30 days.</h2>
<p>This isn't a quick fix. It's a daily protocol that compounds over time.</p>
<h3>Week 1 — Adjustment</h3>
<p>Your body begins responding to the formula. Some people notice reduced cravings within the first few days. Others take longer. Both are normal.</p>
<h3>Week 2–3 — Activation</h3>
<p>GLP-1 production ramps up. Appetite regulation becomes more noticeable. Energy levels tend to stabilize as glucose metabolism improves.</p>
<h3>Week 4+ — Steady state</h3>
<p>The full metabolic effect. Consistent appetite control, improved metabolic markers, sustained energy. This is where the compound effect of daily use shows up.</p>`,
        },
      },
      {
        id: "ss-faq",
        type: "faq_accordion",
        order: 5,
        data: {
          display: "open",
          heading: "Things people ask before they start.",
        },
      },
      {
        id: "ss-cta",
        type: "cta_button",
        order: 6,
        data: {
          text: "Join the Waitlist — $155/mo",
          url: "#waitlist",
          style: "primary",
          centered: true,
        },
      },
    ],
  },

  /* ───────────────────── SCIENCE ───────────────────── */
  {
    slug: "science",
    title: "The Science",
    meta_description:
      "How NutraGLP activates endogenous GLP-1 and GIP production through 13 complementary metabolic pathways using a patent-pending nanoemulsion delivery system.",
    meta_title: "The Science — NutraGLP",
    published: 1,
    blocks: [
      {
        id: "sci-hero",
        type: "hero",
        order: 0,
        data: {
          headline:
            "Built on published research. Not marketing claims.",
          subheadline:
            "Every compound in the NutraGLP formula is backed by peer-reviewed studies. The nanoemulsion delivery system ensures they reach their target pathways at effective concentrations.",
          ctaText: "",
          ctaUrl: "",
          bgImage: "",
          bgColor: "forest",
          textAlign: "center",
        },
      },
      {
        id: "sci-thesis",
        type: "rich_text",
        order: 1,
        data: {
          html: `<h2>What is endogenous GLP-1 activation?</h2>
<p>Pharmaceutical GLP-1 receptor agonists work by introducing synthetic peptides that mimic natural incretin hormones. The approach is effective. It also requires injection, carries significant side effects, and costs upward of $1,000 per month.</p>
<p>NutraGLP takes a different approach. Rather than replacing the body's incretin production with synthetic analogs, the formula is designed to amplify the GLP-1 and GIP your gut already produces, while extending the window those hormones remain active by inhibiting DPP-4, the enzyme responsible for their degradation.</p>
<p>This is not a single-mechanism product. GLP-1 signaling is part of a larger metabolic system. NutraGLP engages 13 distinct pathways across incretin activation, enzyme inhibition, insulin sensitivity, appetite regulation, glucose uptake, and lipid metabolism.</p>`,
        },
      },
      {
        id: "sci-divider-1",
        type: "divider",
        order: 2,
        data: { style: "solid", spacing: "md" },
      },
      {
        id: "sci-pathways",
        type: "rich_text",
        order: 3,
        data: {
          html: `<h2>Which metabolic pathways does NutraGLP target?</h2>
<p>The formula targets three primary mechanisms, each supported by multiple active compounds working in concert.</p>
<h3>GLP-1 & GIP Activation</h3>
<p><strong>AMPK-Mediated L-Cell Activation</strong> — Stimulates GLP-1 secretion from intestinal L-cells via AMPK pathway activation. Multiple RCTs demonstrate significant increases in postprandial GLP-1 levels.</p>
<p><strong>Insulin Receptor Sensitization</strong> — Enhances insulin receptor sensitivity and supports glucose-dependent GLP-1 release. Established GRAS compound with extensive clinical literature on glucose metabolism.</p>
<p><strong>GPR120 Receptor Activation</strong> — Activates GPR120 receptors on L-cells, triggering GLP-1 and GIP secretion. Published mechanisms via free fatty acid receptor pathways.</p>
<h3>DPP-4 Inhibition</h3>
<p><strong>Natural DPP-4 Inhibitors</strong> — Extend the half-life of endogenously produced GLP-1 by inhibiting enzymatic degradation. Compounds with demonstrated in vitro DPP-4 inhibitory activity.</p>
<h3>Complementary Metabolic Support</h3>
<p><strong>Insulin Sensitivity Enhancement</strong> — Multiple pathways supporting glucose uptake and GLUT4 translocation.</p>
<p><strong>Appetite Regulation</strong> — GLP-1-mediated satiety signaling through the gut-brain axis.</p>
<p><strong>Lipid Metabolism</strong> — AMPK-mediated fatty acid oxidation and triglyceride reduction.</p>`,
        },
      },
      {
        id: "sci-divider-2",
        type: "divider",
        order: 4,
        data: { style: "solid", spacing: "md" },
      },
      {
        id: "sci-nano",
        type: "rich_text",
        order: 5,
        data: {
          html: `<h2>Why do most oral supplements fail at absorption?</h2>
<p>Most oral nutraceuticals fail at absorption. The compounds may have demonstrated efficacy in vitro or in clinical studies, but they never reach their target pathways at meaningful concentrations when taken as a standard oral supplement. Bioavailability is the bottleneck.</p>
<p>NutraGLP uses a patent-pending nanoemulsion delivery system that encapsulates active compounds in lipid-based nanoparticles. This increases surface area, protects against enzymatic degradation in the GI tract, and enhances cellular uptake through improved membrane permeability.</p>
<p><strong>The science only matters if it gets where it needs to go.</strong> The nanoemulsion is the mechanism that closes the gap between published research and real-world metabolic effect.</p>`,
        },
      },
      {
        id: "sci-standards",
        type: "card_grid",
        order: 6,
        data: {
          cards: [
            { id: "sci-q1", title: "GRAS Certified", description: "All compounds hold Generally Recognized as Safe status", imageUrl: "", ctaText: "", ctaUrl: "" },
            { id: "sci-q2", title: "Patent Pending", description: "Proprietary nanoemulsion formulation and delivery system", imageUrl: "", ctaText: "", ctaUrl: "" },
            { id: "sci-q3", title: "Third-Party Tested", description: "Independent verification of purity, potency, and composition", imageUrl: "", ctaText: "", ctaUrl: "" },
            { id: "sci-q4", title: "cGMP Manufactured", description: "Produced in facilities meeting current Good Manufacturing Practice standards", imageUrl: "", ctaText: "", ctaUrl: "" },
          ],
          columns: 2,
          bgColor: "forest",
        },
      },
      {
        id: "sci-cta",
        type: "cta_button",
        order: 7,
        data: {
          text: "Join the Waitlist",
          url: "#waitlist",
          style: "primary",
          centered: true,
        },
      },
    ],
  },

  /* ───────────────────── INVESTORS ───────────────────── */
  {
    slug: "investors",
    title: "Investors",
    meta_description:
      "NutraGLP investor overview. $132B addressable market, patent-pending nanoemulsion platform, and a clear path to category leadership in natural GLP-1 activation.",
    meta_title: "Investors — NutraGLP",
    published: 1,
    blocks: [
      {
        id: "inv-hero",
        type: "hero",
        order: 0,
        data: {
          headline:
            "Your body already makes GLP-1. We built the platform to optimize it.",
          subheadline:
            "A patent-pending metabolic activation platform that coordinates endogenous incretin pathways. One core mechanism. Multiple product formats. A $132B market with no platform-level entrant.",
          ctaText: "Request the Deck",
          ctaUrl: "mailto:investors@nutraglp.com",
          bgImage: "",
          bgColor: "forest",
          textAlign: "center",
        },
      },
      {
        id: "inv-stats",
        type: "stats_grid",
        order: 1,
        data: {
          stats: [
            { id: "inv-s1", label: "Total Addressable Market", value: "$132B" },
            { id: "inv-s2", label: "Patent-Pending Formulations", value: "30+" },
            { id: "inv-s3", label: "Product Lines", value: "4" },
            { id: "inv-s4", label: "Seed Round", value: "$4.5M" },
          ],
          columns: 4,
          bgColor: "forest",
        },
      },
      {
        id: "inv-thesis",
        type: "rich_text",
        order: 2,
        data: {
          html: `<h2>Investment Thesis</h2>
<p><strong>The space between pharma and supplements is unoccupied.</strong></p>
<p>GLP-1 drugs are a $50B+ category growing 40% year over year. But the delivery model — weekly injections at $800–$1,600/month — excludes the majority of the addressable market. Meanwhile, the supplement aisle offers no credible alternative.</p>
<p>NutraGLP is building the platform layer between these two worlds. Our patent-pending technology amplifies endogenous GLP-1 production and inhibits DPP-4 degradation, delivered through a proprietary nanoemulsion system that solves the bioavailability problem that makes most oral formats ineffective.</p>
<p>Slim SHOT is the lead product. It ships first, generates revenue, and validates the core mechanism. The same technology powers every product in the pipeline: sweeteners, protein, energy formats, and an AI-driven companion app. One R&D investment, multiple revenue streams.</p>`,
        },
      },
      {
        id: "inv-market",
        type: "rich_text",
        order: 3,
        data: {
          html: `<h2>Market Opportunity</h2>
<p><strong>$132B TAM. No platform-level entrant.</strong></p>
<p><strong>$132B</strong> — Total Addressable Market: Global weight management + metabolic health</p>
<p><strong>$21B</strong> — Serviceable Addressable Market: U.S. consumers seeking non-prescription metabolic support</p>
<p><strong>~$500M</strong> — Serviceable Obtainable Market: Direct-to-consumer capture within 5 years</p>`,
        },
      },
      {
        id: "inv-projections",
        type: "stats_grid",
        order: 4,
        data: {
          stats: [
            { id: "inv-p1", label: "Year 1 — Slim SHOT launch + DTC", value: "$3M" },
            { id: "inv-p2", label: "Year 2 — Sweetener launch + retail", value: "$15M" },
            { id: "inv-p3", label: "Year 3 — Full product line + app", value: "$45M" },
            { id: "inv-p4", label: "Year 4 — Scale + international", value: "$135M" },
          ],
          columns: 4,
          bgColor: "forest",
        },
      },
      {
        id: "inv-cta",
        type: "cta_button",
        order: 5,
        data: {
          text: "Request the Deck",
          url: "mailto:investors@nutraglp.com",
          style: "primary",
          centered: true,
        },
      },
    ],
  },

  /* ───────────────────── PRIVACY ───────────────────── */
  {
    slug: "privacy",
    title: "Privacy Policy",
    meta_description:
      "NutraGLP privacy policy. How we collect, use, and protect your information.",
    meta_title: "Privacy Policy — NutraGLP",
    published: 1,
    blocks: [
      {
        id: "priv-hero",
        type: "hero",
        order: 0,
        data: {
          headline: "Privacy Policy",
          subheadline: "Last updated: February 2026",
          ctaText: "",
          ctaUrl: "",
          bgImage: "",
          bgColor: "forest",
          textAlign: "center",
        },
      },
      {
        id: "priv-content",
        type: "rich_text",
        order: 1,
        data: {
          html: `<p>NutraGLP ("we," "our," or "us") operates nutraglp.com. This page explains how we collect, use, and protect information when you visit our website.</p>

<h2>Information We Collect</h2>
<p>When you join our waitlist, we collect the email address you provide. We may also collect standard web analytics data including pages visited, time on site, browser type, and referring URL. We do not collect financial information, health data, or any sensitive personal information through this website.</p>

<h2>How We Use Your Information</h2>
<p>Email addresses collected through the waitlist are used to send product updates, launch notifications, and clinical information related to NutraGLP. Analytics data is used to understand how visitors interact with our site and to improve the experience. We do not sell, rent, or share your personal information with third parties for their marketing purposes.</p>

<h2>Cookies & Analytics</h2>
<p>This site may use cookies and similar tracking technologies to analyze traffic and improve functionality. You can control cookie settings through your browser preferences. Essential cookies required for site operation may not be disabled.</p>

<h2>Data Security</h2>
<p>We implement reasonable technical and organizational measures to protect information submitted through our website. However, no method of transmission over the Internet is completely secure.</p>

<h2>Your Rights</h2>
<p>You may request deletion of your email from our waitlist at any time by contacting us at privacy@nutraglp.com. If you are a California resident, you have additional rights under the CCPA including the right to know what personal information is collected and the right to request deletion.</p>

<h2>Changes to This Policy</h2>
<p>We may update this privacy policy from time to time. Changes will be posted on this page with an updated effective date.</p>

<h2>Contact</h2>
<p>For questions about this privacy policy, contact us at privacy@nutraglp.com.</p>`,
        },
      },
    ],
  },

  /* ───────────────────── TERMS ───────────────────── */
  {
    slug: "terms",
    title: "Terms of Use",
    meta_description:
      "NutraGLP terms of use. Product information, FDA disclaimer, intellectual property, and limitation of liability.",
    meta_title: "Terms of Use — NutraGLP",
    published: 1,
    blocks: [
      {
        id: "terms-hero",
        type: "hero",
        order: 0,
        data: {
          headline: "Terms of Use",
          subheadline: "Last updated: February 2026",
          ctaText: "",
          ctaUrl: "",
          bgImage: "",
          bgColor: "forest",
          textAlign: "center",
        },
      },
      {
        id: "terms-content",
        type: "rich_text",
        order: 1,
        data: {
          html: `<p>By accessing nutraglp.com, you agree to be bound by these terms. If you do not agree, please do not use this website.</p>

<h2>Product Information</h2>
<p>NutraGLP is a dietary supplement. The information on this website is provided for general informational purposes and is not intended as medical advice. Always consult your healthcare provider before starting any new supplement.</p>

<h2>FDA Disclaimer</h2>
<p>These statements have not been evaluated by the Food and Drug Administration. This product is not intended to diagnose, treat, cure, or prevent any disease. NutraGLP is classified as a dietary supplement under the Dietary Supplement Health and Education Act (DSHEA) of 1994.</p>

<h2>Intellectual Property</h2>
<p>All content on this website, including text, graphics, logos, and formulation details, is the property of NutraGLP or its licensors. The NutraGLP nanoemulsion delivery system is patent-pending. No content may be reproduced, distributed, or used without written permission.</p>

<h2>No Medical Claims</h2>
<p>NutraGLP does not claim to replace pharmaceutical GLP-1 receptor agonists or any prescription medication. References to scientific research describe the properties of individual compounds and do not constitute claims about the finished product. Individual results may vary.</p>

<h2>Limitation of Liability</h2>
<p>NutraGLP is not liable for any damages arising from the use of this website or reliance on information provided herein. This website is provided "as is" without warranties of any kind.</p>

<h2>Governing Law</h2>
<p>These terms are governed by the laws of the State of Delaware, without regard to conflict of law provisions.</p>

<h2>Contact</h2>
<p>For questions about these terms, contact legal@nutraglp.com.</p>`,
        },
      },
    ],
  },

  /* ───────────────────── THANK YOU ───────────────────── */
  {
    slug: "thank-you",
    title: "You're In — NutraGLP",
    meta_description:
      "Thank you for joining the Slim SHOT early access waitlist. We'll reach out with launch details soon.",
    meta_title: "You're In — NutraGLP",
    published: 1,
    blocks: [
      {
        id: "ty-hero",
        type: "hero",
        order: 0,
        data: {
          headline: "You're in.",
          subheadline:
            "We'll reach out with early access details and launch pricing before Slim SHOT ships. Keep an eye on your inbox.",
          ctaText: "Read the Science",
          ctaUrl: "/science",
          bgImage: "",
          bgColor: "forest",
          textAlign: "center",
        },
      },
    ],
  },
];

async function seed() {
  await initDb();
  const db = getDb();

  let inserted = 0;
  let skipped = 0;

  for (const page of pages) {
    try {
      const existing = await db.execute({
        sql: "SELECT id FROM pages WHERE slug = ?",
        args: [page.slug],
      });

      if (existing.rows.length > 0) {
        // Update existing page with blocks if blocks column is empty
        const row = await db.execute({
          sql: "SELECT blocks FROM pages WHERE slug = ?",
          args: [page.slug],
        });
        const currentBlocks = row.rows[0]?.blocks as string | null;
        if (!currentBlocks || currentBlocks === "[]") {
          await db.execute({
            sql: `UPDATE pages SET
                    title = ?,
                    meta_description = ?,
                    meta_title = ?,
                    blocks = ?,
                    published = ?,
                    updated_at = CURRENT_TIMESTAMP
                  WHERE slug = ?`,
            args: [
              page.title,
              page.meta_description,
              page.meta_title,
              JSON.stringify(page.blocks),
              page.published,
              page.slug,
            ],
          });
          console.log(`  Updated: /${page.slug} (added blocks)`);
          inserted++;
        } else {
          console.log(`  Skipped: /${page.slug} (already has blocks)`);
          skipped++;
        }
      } else {
        await db.execute({
          sql: `INSERT INTO pages (slug, title, meta_description, meta_title, content, blocks, blocks_draft, published)
                VALUES (?, ?, ?, ?, '{}', ?, '[]', ?)`,
          args: [
            page.slug,
            page.title,
            page.meta_description,
            page.meta_title,
            JSON.stringify(page.blocks),
            page.published,
          ],
        });
        console.log(`  Created: /${page.slug}`);
        inserted++;
      }
    } catch (err) {
      console.error(`  Error on /${page.slug}:`, err);
    }
  }

  console.log(`\nDone. ${inserted} inserted/updated, ${skipped} skipped.`);
  process.exit(0);
}

seed();
