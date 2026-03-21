import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "ContentFoundry — The Content Supply Chain for Founder-Led Brands",
  description:
    "A headless CMS with a knowledge base that feeds your AI writer. Everything you know, connected to everything you publish. API-first. No lock-in.",
  alternates: { canonical: "https://getcontentfoundry.com" },
  openGraph: {
    title: "ContentFoundry — The Content Supply Chain for Founder-Led Brands",
    description:
      "Headless CMS + knowledge base + AI writer. Built for operators who know content is a moat.",
    url: "https://getcontentfoundry.com",
    siteName: "ContentFoundry",
    type: "website",
  },
};

const schema = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "ContentFoundry",
  applicationCategory: "BusinessApplication",
  description:
    "A headless CMS with an integrated knowledge base and AI writer. Built for founder-led brands and small teams who need to publish at scale without losing their voice.",
  url: "https://getcontentfoundry.com",
  offers: { "@type": "Offer", priceCurrency: "USD" },
  featureList: [
    "Headless CMS with REST API",
    "Knowledge base that feeds AI generation",
    "AI writer with brand voice",
    "Blog, pages, products, FAQs, testimonials",
    "Webhook dispatch",
    "Role-based access control",
    "Content versioning and audit log",
    "BYOK integrations",
    "TypeScript SDK",
  ],
};

const flow = [
  {
    step: "01",
    title: "Build your knowledge base",
    body: "Upload product briefs, competitor cards, style guides, research, pricing — anything the AI needs to know. Documents stay in your vault. You control what's active.",
  },
  {
    step: "02",
    title: "Generate with context",
    body: "The AI writer pulls from your knowledge base, not the internet. Your brand voice, your facts, your positioning. Every draft starts from what you actually know.",
  },
  {
    step: "03",
    title: "Publish through the CMS",
    body: "Blog posts, pages, product copy, FAQs, testimonials — structured content managed in one place. Publish, schedule, version, restore.",
  },
  {
    step: "04",
    title: "Deliver everywhere via API",
    body: "REST API with a TypeScript SDK. Pull your content into Next.js, Astro, React Native, or anything else. Webhooks fire on publish. Your stack, not ours.",
  },
];

const personas = [
  {
    label: "The founder wearing every hat",
    headline: "You know what to say. You just can't say it fast enough.",
    body: "You write the content because nobody else knows the product the way you do. ContentFoundry lets you codify that knowledge once — product details, competitor positioning, brand voice, research — and draw from it every time you sit down to write. Less blank page. More building on what you already know.",
  },
  {
    label: "The marketer with a context problem",
    headline: "The knowledge is scattered. The AI is useless without it.",
    body: "Product specs in Notion. Competitor research in a Google Doc. Brand voice in someone's head. Generic AI tools can't help because they don't know any of this. ContentFoundry is the place where institutional knowledge lives and connects directly to content output. One system. No more copy-pasting context into every prompt.",
  },
  {
    label: "The agency owner tired of context-switching",
    headline: "Eight clients. Eight different content systems. None of them connected.",
    body: "You're managing editorial calendars across tools that don't talk to each other. ContentFoundry gives each client their own knowledge base and CMS — with your AI layer running on top. White-label ready. API-first so it drops into whatever stack they're already on.",
  },
];

const contrast = [
  {
    them: "Generic AI writes from the internet",
    us: "AI writes from your knowledge base",
  },
  {
    them: "CMS manages content, AI lives elsewhere",
    us: "Knowledge base, AI, and CMS in one system",
  },
  {
    them: "Contentful/Sanity: powerful, expensive, no AI",
    us: "API-first with AI built into the editorial workflow",
  },
  {
    them: "Every prompt starts from scratch",
    us: "Context is permanent — upload once, use always",
  },
  {
    them: "Bring your own everything, figure it out",
    us: "Opinionated defaults, BYOK integrations, runs on day one",
  },
  {
    them: "Lock-in: proprietary APIs, vendor pricing",
    us: "Open API, self-hostable, your data stays yours",
  },
];

const features = [
  { name: "Blog CMS", desc: "Scheduled publishing, tags, metadata, versioning" },
  { name: "Pages CMS", desc: "Dynamic pages with full content control via API" },
  { name: "Products", desc: "Product catalog with variants, pricing, rich copy" },
  { name: "Knowledge Base", desc: "Upload PDFs, DOCX, TXT — AI reads them at generation time" },
  { name: "AI Writer", desc: "Brand-aware drafts with knowledge base context injection" },
  { name: "REST API + SDK", desc: "TypeScript-first SDK, full REST API, OpenAPI spec" },
  { name: "Webhooks", desc: "Dispatch on publish, update, delete — connect anything" },
  { name: "Role-based Access", desc: "Admin, editor, viewer — enforced at the API level" },
  { name: "Content Versioning", desc: "Snapshot on every save, restore any version" },
  { name: "Audit Log", desc: "Append-only log of every action, filterable by entity" },
  { name: "Media + Remove.bg", desc: "Asset management with background removal on upload" },
  { name: "BYOK Integrations", desc: "Unsplash, SendGrid, Cloudinary, ElevenLabs — your keys" },
];

export default function ContentFoundryPage() {
  return (
    <main className="bg-white text-[#1a1a18]" style={{ fontFamily: "'DM Sans', system-ui, sans-serif" }}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />

      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-neutral-100">
        <div className="max-w-[1100px] mx-auto flex items-center justify-between px-6 md:px-10 py-4">
          <span className="text-[15px] font-semibold tracking-tight text-neutral-900">ContentFoundry</span>
          <div className="flex items-center gap-6">
            <a href="#how-it-works" className="hidden md:block text-sm text-neutral-500 hover:text-neutral-800 transition no-underline">
              How it works
            </a>
            <a href="#for-who" className="hidden md:block text-sm text-neutral-500 hover:text-neutral-800 transition no-underline">
              Who it&apos;s for
            </a>
            <a href="#features" className="hidden md:block text-sm text-neutral-500 hover:text-neutral-800 transition no-underline">
              Features
            </a>
            <a
              href="#early-access"
              className="bg-neutral-900 text-white px-5 py-2 text-sm font-medium rounded-lg hover:bg-neutral-700 transition no-underline"
            >
              Get early access
            </a>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-28 pb-20 md:pt-36 md:pb-28 px-6 md:px-10 bg-neutral-950 text-white">
        <div className="max-w-[820px] mx-auto text-center">
          <p className="text-[11px] font-bold uppercase tracking-[3px] text-neutral-400 mb-6">
            Content Supply Chain
          </p>
          <h1 className="text-[36px] md:text-[60px] font-normal leading-[1.05] tracking-tight mb-6">
            Everything you know,
            <br />
            <span className="text-neutral-400">connected to everything you publish.</span>
          </h1>
          <p className="text-lg md:text-xl text-neutral-400 max-w-[600px] mx-auto mb-10 leading-relaxed">
            ContentFoundry is a headless CMS with a knowledge base that feeds your AI writer.
            Built for founder-led brands who can&apos;t afford to be invisible.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3" id="early-access">
            <input
              type="email"
              placeholder="your@email.com"
              className="w-full sm:w-auto flex-1 max-w-[280px] px-5 py-3 rounded-lg bg-white/[0.08] border border-white/[0.12] text-white placeholder-neutral-500 text-[15px] focus:outline-none focus:border-white/30"
            />
            <button className="w-full sm:w-auto px-7 py-3 bg-white text-neutral-900 font-semibold rounded-lg text-[15px] hover:bg-neutral-100 transition whitespace-nowrap">
              Get early access
            </button>
          </div>
          <p className="text-xs text-neutral-600 mt-4">No credit card. No commitment. Early pricing locked at signup.</p>
        </div>
      </section>

      {/* Proof bar */}
      <section className="bg-neutral-900 px-6 py-4 flex justify-center gap-8 sm:gap-16 flex-wrap border-b border-neutral-800">
        {[
          { val: "API-first", label: "Headless by default" },
          { val: "AI-native", label: "Knowledge base → content" },
          { val: "BYOK", label: "Your keys, your costs" },
          { val: "TypeScript SDK", label: "Drop-in developer tooling" },
        ].map((s) => (
          <div key={s.label} className="text-center">
            <div className="text-sm font-semibold text-white">{s.val}</div>
            <div className="text-[11px] text-neutral-500 mt-0.5">{s.label}</div>
          </div>
        ))}
      </section>

      {/* Problem */}
      <section className="py-20 md:py-28 px-6 md:px-10 max-w-[720px] mx-auto">
        <p className="text-[11px] font-bold uppercase tracking-[2px] text-neutral-400 mb-5">The problem</p>
        <h2 className="text-[28px] md:text-[40px] font-normal tracking-tight leading-tight mb-6 text-neutral-900">
          The knowledge gap between what you know and what you publish.
        </h2>
        <p className="text-[17px] leading-relaxed text-neutral-500 mb-5">
          Most teams know their product better than anyone. Competitor positioning, pricing rationale, clinical research, brand voice — it lives in documents, Slack threads, and people&apos;s heads. None of it connects to content output.
        </p>
        <p className="text-[17px] leading-relaxed text-neutral-500 mb-5">
          Generic AI tools don&apos;t help. They write from the internet, not from your vault. Every prompt starts from scratch. Every output needs heavy editing to sound like you.
        </p>
        <p className="text-[17px] leading-relaxed text-neutral-500">
          <strong className="text-neutral-800 font-semibold">ContentFoundry closes the gap.</strong> Your knowledge base feeds your AI writer. Your AI writer feeds your CMS. Your CMS feeds your API. One system, from what you know to what you publish.
        </p>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="py-20 md:py-28 px-6 md:px-10 bg-neutral-50">
        <div className="max-w-[1000px] mx-auto">
          <p className="text-[11px] font-bold uppercase tracking-[2px] text-neutral-400 mb-5">How it works</p>
          <h2 className="text-[28px] md:text-[40px] font-normal tracking-tight leading-tight mb-14 text-neutral-900">
            Four steps. One system.
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {flow.map((f) => (
              <div key={f.step} className="bg-white border border-neutral-150 rounded-xl p-7">
                <p className="text-[11px] font-bold text-neutral-300 mb-4 tracking-widest">{f.step}</p>
                <h3 className="text-[17px] font-semibold tracking-tight text-neutral-900 mb-3">{f.title}</h3>
                <p className="text-sm text-neutral-500 leading-relaxed">{f.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Who it's for */}
      <section id="for-who" className="py-20 md:py-28 px-6 md:px-10">
        <div className="max-w-[1000px] mx-auto">
          <p className="text-[11px] font-bold uppercase tracking-[2px] text-neutral-400 mb-5">Who it&apos;s for</p>
          <h2 className="text-[28px] md:text-[40px] font-normal tracking-tight leading-tight mb-5 text-neutral-900">
            Three problems that lead here.
          </h2>
          <p className="text-[17px] text-neutral-500 max-w-[600px] mb-14 leading-relaxed">
            Different starting points. The same gap in the market. If one of these sounds like your operation, ContentFoundry was built for you.
          </p>
          <div className="space-y-4">
            {personas.map((p) => (
              <div key={p.label} className="border border-neutral-150 rounded-xl p-7 md:p-9">
                <p className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 mb-3">{p.label}</p>
                <h3 className="text-[19px] md:text-[22px] font-normal tracking-tight text-neutral-900 mb-4 leading-snug max-w-[680px]">
                  {p.headline}
                </h3>
                <p className="text-[15px] text-neutral-500 leading-relaxed max-w-[680px]">{p.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contrast */}
      <section className="py-20 md:py-28 px-6 md:px-10 bg-neutral-950 text-white">
        <div className="max-w-[1000px] mx-auto">
          <p className="text-[11px] font-bold uppercase tracking-[2px] text-neutral-500 mb-5">A different category</p>
          <h2 className="text-[28px] md:text-[40px] font-normal tracking-tight leading-tight mb-14">
            Not another CMS. Not another AI writer.
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-0.5">
            <div className="bg-white/[0.04] rounded-lg p-6 md:p-9">
              <p className="text-[11px] font-bold uppercase tracking-[1.5px] text-neutral-500 mb-6">The current stack</p>
              {contrast.map((row) => (
                <div key={row.them} className="py-3 border-b border-white/[0.06] flex items-start gap-3">
                  <span className="w-5 h-5 shrink-0 mt-0.5 rounded-full bg-white/[0.06] flex items-center justify-center text-white/20 text-[10px]">✕</span>
                  <span className="text-[15px] leading-relaxed text-neutral-500">{row.them}</span>
                </div>
              ))}
            </div>
            <div className="bg-white/[0.07] border border-white/10 rounded-lg p-6 md:p-9">
              <p className="text-[11px] font-bold uppercase tracking-[1.5px] text-white/70 mb-6">ContentFoundry</p>
              {contrast.map((row) => (
                <div key={row.us} className="py-3 border-b border-white/[0.06] flex items-start gap-3">
                  <span className="w-5 h-5 shrink-0 mt-0.5 rounded-full bg-white/15 flex items-center justify-center text-white text-[11px] font-bold">✓</span>
                  <span className="text-[15px] leading-relaxed text-white/80">{row.us}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 md:py-28 px-6 md:px-10 bg-neutral-50">
        <div className="max-w-[1000px] mx-auto">
          <p className="text-[11px] font-bold uppercase tracking-[2px] text-neutral-400 mb-5">Features</p>
          <h2 className="text-[28px] md:text-[40px] font-normal tracking-tight leading-tight mb-14 text-neutral-900">
            Everything a content operation needs.
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {features.map((f) => (
              <div key={f.name} className="bg-white border border-neutral-150 rounded-xl p-5">
                <h3 className="text-[15px] font-semibold text-neutral-900 mb-1.5">{f.name}</h3>
                <p className="text-sm text-neutral-500 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Built on NutraGLP */}
      <section className="py-20 md:py-28 px-6 md:px-10 max-w-[720px] mx-auto">
        <p className="text-[11px] font-bold uppercase tracking-[2px] text-neutral-400 mb-5">Built in production</p>
        <h2 className="text-[28px] md:text-[36px] font-normal tracking-tight leading-tight mb-6 text-neutral-900">
          This isn&apos;t a demo. It runs a real brand.
        </h2>
        <p className="text-[17px] leading-relaxed text-neutral-500 mb-5">
          ContentFoundry powers <a href="https://nutraglp.com" className="text-neutral-800 border-b border-neutral-300 no-underline hover:border-neutral-600 transition">NutraGLP</a>, a GLP-1 supplement brand built entirely on this stack. Blog posts, product pages, knowledge base, API-fed front end — all running in production, not a sandbox.
        </p>
        <p className="text-[17px] leading-relaxed text-neutral-500">
          We eat our own cooking. Features get built because the brand needs them, not because a product roadmap says so. That&apos;s the only honest way to build tooling.
        </p>
      </section>

      {/* CTA */}
      <section className="py-20 md:py-28 px-6 md:px-10 bg-neutral-950 text-white text-center" id="waitlist">
        <div className="max-w-[600px] mx-auto">
          <h2 className="text-[28px] md:text-[44px] font-normal tracking-tight leading-tight mb-5">
            Get early access.
          </h2>
          <p className="text-[17px] text-neutral-400 mb-10 leading-relaxed">
            ContentFoundry is in private beta. Early access spots lock in founding pricing and direct input on the roadmap.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <input
              type="email"
              placeholder="your@email.com"
              className="w-full sm:flex-1 max-w-[300px] px-5 py-3.5 rounded-lg bg-white/[0.08] border border-white/[0.12] text-white placeholder-neutral-500 text-[15px] focus:outline-none focus:border-white/30"
            />
            <button className="w-full sm:w-auto px-7 py-3.5 bg-white text-neutral-900 font-semibold rounded-lg text-[15px] hover:bg-neutral-100 transition whitespace-nowrap">
              Join the beta
            </button>
          </div>
          <p className="text-xs text-neutral-600 mt-4">No spam. One email when beta opens.</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-neutral-950 border-t border-neutral-900 px-6 py-8">
        <div className="max-w-[720px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <span className="text-sm text-neutral-600 font-medium">ContentFoundry</span>
          <div className="flex gap-5 text-xs text-neutral-600">
            <a href="mailto:hello@getcontentfoundry.com" className="hover:text-neutral-400 transition no-underline">Contact</a>
            <Link href="/privacy" className="hover:text-neutral-400 transition no-underline">Privacy</Link>
            <Link href="/terms" className="hover:text-neutral-400 transition no-underline">Terms</Link>
          </div>
          <p className="text-xs text-neutral-700">&copy; {new Date().getFullYear()} ContentFoundry</p>
        </div>
      </footer>
    </main>
  );
}
