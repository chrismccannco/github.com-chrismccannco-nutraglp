"use client";

import { useState } from "react";
import { Copy, Check, ChevronDown, ChevronRight, Zap, Lock, BookOpen, Package, Terminal } from "lucide-react";

interface Endpoint {
  method: string;
  path: string;
  description: string;
  params?: { name: string; type: string; required?: boolean; description: string }[];
  response: string;
  example?: string;
}

const ENDPOINTS: { section: string; endpoints: Endpoint[] }[] = [
  {
    section: "Pages",
    endpoints: [
      {
        method: "GET",
        path: "/api/v1/pages",
        description: "List all published pages with metadata.",
        response: `{
  "data": [
    {
      "id": 1,
      "slug": "about",
      "title": "About Us",
      "meta_description": "...",
      "meta_title": "...",
      "og_image": "...",
      "updated_at": "2025-01-15T..."
    }
  ],
  "total": 5
}`,
      },
      {
        method: "GET",
        path: "/api/v1/pages?slug={slug}",
        description: "Get a single page by slug with full content and blocks.",
        params: [
          { name: "slug", type: "string", required: true, description: "The page URL slug" },
        ],
        response: `{
  "id": 1,
  "slug": "about",
  "title": "About Us",
  "meta_description": "...",
  "blocks": [...],
  "content": {...},
  "updated_at": "2025-01-15T..."
}`,
      },
    ],
  },
  {
    section: "Blog",
    endpoints: [
      {
        method: "GET",
        path: "/api/v1/blog",
        description: "List published blog posts with pagination.",
        params: [
          { name: "tag", type: "string", description: "Filter by tag" },
          { name: "limit", type: "number", description: "Results per page (max 100, default 50)" },
          { name: "offset", type: "number", description: "Skip N results for pagination" },
        ],
        response: `{
  "data": [
    {
      "id": 1,
      "slug": "how-glp1-works",
      "title": "How GLP-1 Works",
      "description": "...",
      "date": "2025-01-10",
      "tag": "Science",
      "featured_image": "..."
    }
  ],
  "total": 12,
  "limit": 50,
  "offset": 0
}`,
      },
      {
        method: "GET",
        path: "/api/v1/blog?slug={slug}",
        description: "Get a single blog post with full content, sections, and blocks.",
        params: [
          { name: "slug", type: "string", required: true, description: "The post URL slug" },
        ],
        response: `{
  "id": 1,
  "slug": "how-glp1-works",
  "title": "How GLP-1 Works",
  "sections": [...],
  "blocks": [...],
  "meta_title": "...",
  "meta_description": "..."
}`,
      },
    ],
  },
  {
    section: "Products",
    endpoints: [
      {
        method: "GET",
        path: "/api/v1/products",
        description: "List all published products.",
        response: `{
  "data": [
    {
      "id": 1,
      "slug": "slim-shot",
      "name": "Slim Shot",
      "tagline": "...",
      "price": "$89",
      "features": [...],
      "status": "available"
    }
  ],
  "total": 3
}`,
      },
      {
        method: "GET",
        path: "/api/v1/products?slug={slug}",
        description: "Get a single product by slug.",
        params: [
          { name: "slug", type: "string", required: true, description: "The product URL slug" },
        ],
        response: `{ "id": 1, "slug": "slim-shot", "name": "Slim Shot", ... }`,
      },
    ],
  },
  {
    section: "FAQs",
    endpoints: [
      {
        method: "GET",
        path: "/api/v1/faqs",
        description: "List all published FAQs.",
        params: [
          { name: "category", type: "string", description: "Filter by category" },
        ],
        response: `{
  "data": [
    {
      "id": 1,
      "category": "General",
      "question": "What is your product?",
      "answer": "..."
    }
  ],
  "total": 8
}`,
      },
    ],
  },
  {
    section: "Testimonials",
    endpoints: [
      {
        method: "GET",
        path: "/api/v1/testimonials",
        description: "List all published testimonials.",
        params: [
          { name: "featured", type: "boolean", description: "Set to 'true' for featured only" },
        ],
        response: `{
  "data": [
    {
      "id": 1,
      "name": "Sarah M.",
      "title": "Verified Buyer",
      "quote": "...",
      "rating": 5,
      "featured": true
    }
  ],
  "total": 10
}`,
      },
    ],
  },
  {
    section: "Media",
    endpoints: [
      {
        method: "GET",
        path: "/api/v1/media",
        description: "List all media files with URLs and responsive variants.",
        params: [
          { name: "limit", type: "number", description: "Results per page (max 100, default 50)" },
          { name: "offset", type: "number", description: "Skip N results for pagination" },
        ],
        response: `{
  "data": [
    {
      "id": 1,
      "filename": "hero.jpg",
      "mime_type": "image/jpeg",
      "size": 245000,
      "width": 1200,
      "height": 630,
      "url": "https://your-domain.com/api/upload/1",
      "variants": {
        "original": ".../api/upload/1",
        "webp": ".../api/upload/1?format=webp",
        "w640": ".../api/upload/1?w=640",
        "w960": ".../api/upload/1?w=960",
        "w1280": ".../api/upload/1?w=1280"
      }
    }
  ],
  "total": 24
}`,
      },
      {
        method: "GET",
        path: "/api/v1/media?id={id}",
        description: "Get a single media file by ID.",
        params: [
          { name: "id", type: "number", required: true, description: "The media file ID" },
        ],
        response: `{ "id": 1, "filename": "hero.jpg", "url": "...", "variants": {...} }`,
      },
    ],
  },
  {
    section: "Brand Voices",
    endpoints: [
      {
        method: "GET",
        path: "/api/v1/brand-voices",
        description: "List all brand voice profiles.",
        response: `{
  "data": [
    {
      "id": 1,
      "name": "Clinical Authority",
      "slug": "clinical-authority",
      "is_default": true,
      "tagline": "The science is the story.",
      "tone": "Precise. Confident without being promotional.",
      "dos": "...",
      "donts": "...",
      "exemplar": "..."
    }
  ],
  "total": 4
}`,
      },
      {
        method: "GET",
        path: "/api/v1/brand-voices?slug={slug}",
        description: "Get a single brand voice by slug.",
        params: [
          { name: "slug", type: "string", required: true, description: "The brand voice slug" },
        ],
        response: `{ "id": 1, "name": "Clinical Authority", "slug": "clinical-authority", ... }`,
      },
    ],
  },
  {
    section: "Personas",
    endpoints: [
      {
        method: "GET",
        path: "/api/v1/personas",
        description: "List all audience personas.",
        response: `{
  "data": [
    {
      "id": 1,
      "name": "The Needle-Averse Consumer",
      "slug": "needle-averse-consumer",
      "is_default": true,
      "description": "...",
      "demographics": "...",
      "goals": "...",
      "pain_points": "...",
      "channels": ["instagram", "email"]
    }
  ],
  "total": 5
}`,
      },
      {
        method: "GET",
        path: "/api/v1/personas?slug={slug}",
        description: "Get a single persona by slug.",
        params: [
          { name: "slug", type: "string", required: true, description: "The persona slug" },
        ],
        response: `{ "id": 1, "name": "The Needle-Averse Consumer", ... }`,
      },
    ],
  },
];

export default function ApiDocsPage() {
  const [openSections, setOpenSections] = useState<Record<string, boolean>>(
    Object.fromEntries(ENDPOINTS.map((s) => [s.section, true]))
  );
  const [copiedSnippet, setCopiedSnippet] = useState<string | null>(null);

  const toggleSection = (section: string) => {
    setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const copySnippet = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSnippet(id);
    setTimeout(() => setCopiedSnippet(null), 2000);
  };

  const baseUrl = typeof window !== "undefined" ? window.location.origin : "https://your-domain.com";

  return (
    <div className="max-w-4xl">
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-1">
          <BookOpen className="w-5 h-5 text-teal-600" />
          <h1 className="text-xl font-semibold text-neutral-900">API Documentation</h1>
        </div>
        <p className="text-sm text-neutral-500 mt-1">
          RESTful API for accessing your CMS content programmatically.
        </p>
      </div>

      {/* Auth section */}
      <div className="mb-8 p-5 bg-white border border-neutral-200 rounded-xl">
        <div className="flex items-center gap-2 mb-3">
          <Lock className="w-4 h-4 text-teal-600" />
          <h2 className="text-sm font-semibold text-neutral-900">Authentication</h2>
        </div>
        <p className="text-sm text-neutral-600 mb-3">
          All API requests require an API key passed via the <code className="px-1.5 py-0.5 bg-neutral-100 rounded text-[13px]">Authorization</code> header.
        </p>
        <div className="relative">
          <pre className="px-4 py-3 bg-neutral-900 text-neutral-100 rounded-lg text-sm overflow-x-auto">
            <code>{`curl ${baseUrl}/api/v1/pages \\
  -H "Authorization: Bearer nglp_your_api_key_here"`}</code>
          </pre>
          <button
            onClick={() =>
              copySnippet(
                `curl ${baseUrl}/api/v1/pages \\\n  -H "Authorization: Bearer nglp_your_api_key_here"`,
                "auth"
              )
            }
            className="absolute top-2 right-2 p-1.5 text-neutral-400 hover:text-white transition"
          >
            {copiedSnippet === "auth" ? (
              <Check className="w-3.5 h-3.5" />
            ) : (
              <Copy className="w-3.5 h-3.5" />
            )}
          </button>
        </div>
        <p className="text-xs text-neutral-400 mt-2">
          Create API keys in <a href="/admin/api-keys" className="text-teal-600 hover:text-teal-700">Settings &rarr; API Keys</a>.
        </p>
      </div>

      {/* Rate limits */}
      <div className="mb-8 p-5 bg-white border border-neutral-200 rounded-xl">
        <div className="flex items-center gap-2 mb-3">
          <Zap className="w-4 h-4 text-amber-500" />
          <h2 className="text-sm font-semibold text-neutral-900">Rate Limits</h2>
        </div>
        <p className="text-sm text-neutral-600 mb-2">
          Each API key has a configurable daily request limit (default: 1,000/day).
          Rate limit info is included in response headers:
        </p>
        <pre className="px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-lg text-sm text-neutral-700 overflow-x-auto">
          <code>{`X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 847`}</code>
        </pre>
      </div>

      {/* Error format */}
      <div className="mb-8 p-5 bg-white border border-neutral-200 rounded-xl">
        <h2 className="text-sm font-semibold text-neutral-900 mb-3">Error Responses</h2>
        <p className="text-sm text-neutral-600 mb-2">
          All errors follow a consistent format:
        </p>
        <pre className="px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-lg text-sm text-neutral-700 overflow-x-auto">
          <code>{`{
  "error": "Invalid API key",
  "status": 401
}`}</code>
        </pre>
        <div className="mt-3 grid grid-cols-2 gap-2 text-xs text-neutral-600">
          <div className="flex items-center gap-2">
            <span className="px-1.5 py-0.5 bg-red-50 text-red-700 rounded font-mono">401</span>
            Invalid or missing API key
          </div>
          <div className="flex items-center gap-2">
            <span className="px-1.5 py-0.5 bg-red-50 text-red-700 rounded font-mono">403</span>
            Insufficient permissions
          </div>
          <div className="flex items-center gap-2">
            <span className="px-1.5 py-0.5 bg-amber-50 text-amber-700 rounded font-mono">429</span>
            Rate limit exceeded
          </div>
          <div className="flex items-center gap-2">
            <span className="px-1.5 py-0.5 bg-neutral-100 text-neutral-700 rounded font-mono">404</span>
            Resource not found
          </div>
        </div>
      </div>

      {/* Endpoints */}
      <div className="space-y-4">
        {ENDPOINTS.map((section) => (
          <div key={section.section} className="bg-white border border-neutral-200 rounded-xl overflow-hidden">
            <button
              onClick={() => toggleSection(section.section)}
              className="w-full flex items-center justify-between px-5 py-3.5 hover:bg-neutral-50 transition"
            >
              <h2 className="text-sm font-semibold text-neutral-900">{section.section}</h2>
              {openSections[section.section] ? (
                <ChevronDown className="w-4 h-4 text-neutral-400" />
              ) : (
                <ChevronRight className="w-4 h-4 text-neutral-400" />
              )}
            </button>

            {openSections[section.section] && (
              <div className="border-t border-neutral-100 divide-y divide-neutral-50">
                {section.endpoints.map((ep, i) => (
                  <EndpointCard
                    key={i}
                    endpoint={ep}
                    baseUrl={baseUrl}
                    copiedSnippet={copiedSnippet}
                    onCopy={copySnippet}
                  />
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* SDK Documentation */}
      <div className="mt-8 p-5 bg-white border border-neutral-200 rounded-xl" id="sdk">
        <div className="flex items-center gap-2 mb-3">
          <Package className="w-4 h-4 text-teal-600" />
          <h2 className="text-sm font-semibold text-neutral-900">JavaScript / TypeScript SDK</h2>
        </div>
        <p className="text-sm text-neutral-600 mb-4">
          The official SDK gives you typed access to every resource. Works with Next.js, Astro, Remix, Nuxt, or any JavaScript runtime.
        </p>

        <div className="space-y-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <Terminal className="w-3.5 h-3.5 text-neutral-400" />
              <p className="text-[10px] font-semibold uppercase tracking-widest text-neutral-400">Install</p>
            </div>
            <CodeBlock label="" code="npm install @contentfoundry/sdk" id="sdk-install" copiedSnippet={copiedSnippet} onCopy={copySnippet} />
          </div>

          <div>
            <p className="text-[10px] font-semibold uppercase tracking-widest text-neutral-400 mb-1.5">Initialize</p>
            <CodeBlock
              label=""
              code={`import { ContentFoundry } from "@contentfoundry/sdk";

const cf = new ContentFoundry({
  baseUrl: "${baseUrl}",
  apiKey: process.env.CONTENTFOUNDRY_API_KEY!,
});`}
              id="sdk-init"
              copiedSnippet={copiedSnippet}
              onCopy={copySnippet}
            />
          </div>

          <div>
            <p className="text-[10px] font-semibold uppercase tracking-widest text-neutral-400 mb-1.5">Resources</p>
            <div className="grid grid-cols-2 gap-2 text-xs text-neutral-600 mb-3">
              <div className="flex items-center gap-2"><code className="text-teal-700 font-mono">cf.pages</code><span>.list() .get(slug)</span></div>
              <div className="flex items-center gap-2"><code className="text-teal-700 font-mono">cf.blog</code><span>.list(opts) .get(slug)</span></div>
              <div className="flex items-center gap-2"><code className="text-teal-700 font-mono">cf.products</code><span>.list() .get(slug)</span></div>
              <div className="flex items-center gap-2"><code className="text-teal-700 font-mono">cf.media</code><span>.list() .get(id) .srcset(media)</span></div>
              <div className="flex items-center gap-2"><code className="text-teal-700 font-mono">cf.brandVoices</code><span>.list() .get(slug) .getDefault()</span></div>
              <div className="flex items-center gap-2"><code className="text-teal-700 font-mono">cf.personas</code><span>.list() .get(slug) .getDefault()</span></div>
              <div className="flex items-center gap-2"><code className="text-teal-700 font-mono">cf.faqs</code><span>.list(opts) .get(id)</span></div>
              <div className="flex items-center gap-2"><code className="text-teal-700 font-mono">cf.testimonials</code><span>.list(opts) .get(id)</span></div>
            </div>
          </div>

          <div>
            <p className="text-[10px] font-semibold uppercase tracking-widest text-neutral-400 mb-1.5">Examples</p>
            <div className="space-y-3">
              <CodeBlock
                label="Fetch blog posts"
                code={`// List recent posts tagged "Science"
const posts = await cf.blog.list({ tag: "Science", limit: 10 });

// Get a single post with full content
const post = await cf.blog.get("how-glp1-works");
console.log(post.title, post.sections);`}
                id="sdk-blog"
                copiedSnippet={copiedSnippet}
                onCopy={copySnippet}
              />
              <CodeBlock
                label="Responsive images"
                code={`const images = await cf.media.list({ limit: 20 });

// Generate a srcset string for responsive <img> tags
const srcset = cf.media.srcset(images.data[0]);
// => ".../api/upload/1?w=640 640w, .../api/upload/1?w=960 960w, ..."`}
                id="sdk-media"
                copiedSnippet={copiedSnippet}
                onCopy={copySnippet}
              />
              <CodeBlock
                label="Next.js App Router"
                code={`// app/blog/[slug]/page.tsx
import { ContentFoundry } from "@contentfoundry/sdk";

const cf = new ContentFoundry({
  baseUrl: process.env.CF_URL!,
  apiKey: process.env.CF_API_KEY!,
});

export default async function BlogPost({ params }: { params: { slug: string } }) {
  const post = await cf.blog.get(params.slug);
  return <article><h1>{post.title}</h1></article>;
}`}
                id="sdk-nextjs"
                copiedSnippet={copiedSnippet}
                onCopy={copySnippet}
              />
              <CodeBlock
                label="Astro"
                code={`---
// src/pages/blog/[slug].astro
import { ContentFoundry } from "@contentfoundry/sdk";

const cf = new ContentFoundry({
  baseUrl: import.meta.env.CF_URL,
  apiKey: import.meta.env.CF_API_KEY,
});

const { slug } = Astro.params;
const post = await cf.blog.get(slug!);
---
<h1>{post.title}</h1>`}
                id="sdk-astro"
                copiedSnippet={copiedSnippet}
                onCopy={copySnippet}
              />
            </div>
          </div>

          <div>
            <p className="text-[10px] font-semibold uppercase tracking-widest text-neutral-400 mb-1.5">Error Handling</p>
            <CodeBlock
              label=""
              code={`import { ContentFoundryError } from "@contentfoundry/sdk";

try {
  const page = await cf.pages.get("missing-page");
} catch (err) {
  if (err instanceof ContentFoundryError) {
    console.log(err.status); // 404
    console.log(err.message); // "Not found"
  }
}`}
              id="sdk-errors"
              copiedSnippet={copiedSnippet}
              onCopy={copySnippet}
            />
          </div>

          <div>
            <p className="text-[10px] font-semibold uppercase tracking-widest text-neutral-400 mb-1.5">TypeScript Types</p>
            <CodeBlock
              label=""
              code={`// All types are exported for full IntelliSense support
import type {
  Page, PageDetail,
  BlogPost, BlogPostDetail,
  Product, MediaFile,
  BrandVoice, Persona,
  FAQ, Testimonial,
  PaginatedResponse,
} from "@contentfoundry/sdk";`}
              id="sdk-types"
              copiedSnippet={copiedSnippet}
              onCopy={copySnippet}
            />
          </div>
        </div>
      </div>

      {/* Raw HTTP Quick Start */}
      <div className="mt-4 p-5 bg-neutral-50 border border-neutral-200 rounded-xl">
        <h2 className="text-sm font-semibold text-neutral-900 mb-2">Raw HTTP</h2>
        <p className="text-sm text-neutral-600 mb-3">
          If you prefer plain HTTP, use any client. No SDK required.
        </p>
        <div className="space-y-3">
          <CodeBlock
            label="JavaScript (fetch)"
            code={`const res = await fetch("${baseUrl}/api/v1/pages", {
  headers: { Authorization: "Bearer nglp_your_key" }
});
const { data } = await res.json();`}
            id="js"
            copiedSnippet={copiedSnippet}
            onCopy={copySnippet}
          />
          <CodeBlock
            label="Python (requests)"
            code={`import requests

res = requests.get(
    "${baseUrl}/api/v1/blog",
    headers={"Authorization": "Bearer nglp_your_key"},
    params={"tag": "Science", "limit": 10}
)
data = res.json()["data"]`}
            id="python"
            copiedSnippet={copiedSnippet}
            onCopy={copySnippet}
          />
        </div>
      </div>
    </div>
  );
}

/* ── Sub-components ── */

function EndpointCard({
  endpoint,
  baseUrl,
  copiedSnippet,
  onCopy,
}: {
  endpoint: Endpoint;
  baseUrl: string;
  copiedSnippet: string | null;
  onCopy: (text: string, id: string) => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const id = `${endpoint.method}-${endpoint.path}`;

  const curlExample = `curl "${baseUrl}${endpoint.path.replace(/\{.*?\}/g, "example")}" \\\n  -H "Authorization: Bearer nglp_your_key"`;

  return (
    <div className="px-5 py-4">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center gap-3 text-left"
      >
        <span className="px-2 py-0.5 bg-teal-50 text-teal-700 text-[11px] font-bold rounded font-mono">
          {endpoint.method}
        </span>
        <code className="text-sm text-neutral-800 font-mono">{endpoint.path}</code>
        <span className="text-xs text-neutral-500 ml-auto">{endpoint.description}</span>
        {expanded ? (
          <ChevronDown className="w-3.5 h-3.5 text-neutral-400 flex-shrink-0" />
        ) : (
          <ChevronRight className="w-3.5 h-3.5 text-neutral-400 flex-shrink-0" />
        )}
      </button>

      {expanded && (
        <div className="mt-3 space-y-3 pl-12">
          {endpoint.params && endpoint.params.length > 0 && (
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-widest text-neutral-400 mb-1.5">
                Parameters
              </p>
              <div className="space-y-1">
                {endpoint.params.map((p) => (
                  <div key={p.name} className="flex items-baseline gap-2 text-xs">
                    <code className="text-teal-700 font-mono">{p.name}</code>
                    <span className="text-neutral-400">{p.type}</span>
                    {p.required && (
                      <span className="text-[10px] text-red-500 font-medium">required</span>
                    )}
                    <span className="text-neutral-500">{p.description}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div>
            <p className="text-[10px] font-semibold uppercase tracking-widest text-neutral-400 mb-1.5">
              Response
            </p>
            <pre className="px-3 py-2.5 bg-neutral-50 border border-neutral-200 rounded-lg text-xs text-neutral-700 overflow-x-auto">
              <code>{endpoint.response}</code>
            </pre>
          </div>

          <div className="relative">
            <p className="text-[10px] font-semibold uppercase tracking-widest text-neutral-400 mb-1.5">
              Example
            </p>
            <pre className="px-3 py-2.5 bg-neutral-900 text-neutral-100 rounded-lg text-xs overflow-x-auto">
              <code>{curlExample}</code>
            </pre>
            <button
              onClick={() => onCopy(curlExample, id)}
              className="absolute top-6 right-2 p-1 text-neutral-400 hover:text-white transition"
            >
              {copiedSnippet === id ? (
                <Check className="w-3 h-3" />
              ) : (
                <Copy className="w-3 h-3" />
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function CodeBlock({
  label,
  code,
  id,
  copiedSnippet,
  onCopy,
}: {
  label: string;
  code: string;
  id: string;
  copiedSnippet: string | null;
  onCopy: (text: string, id: string) => void;
}) {
  return (
    <div>
      <p className="text-[10px] font-semibold uppercase tracking-widest text-neutral-400 mb-1">
        {label}
      </p>
      <div className="relative">
        <pre className="px-4 py-3 bg-neutral-900 text-neutral-100 rounded-lg text-xs overflow-x-auto">
          <code>{code}</code>
        </pre>
        <button
          onClick={() => onCopy(code, id)}
          className="absolute top-2 right-2 p-1.5 text-neutral-400 hover:text-white transition"
        >
          {copiedSnippet === id ? (
            <Check className="w-3 h-3" />
          ) : (
            <Copy className="w-3 h-3" />
          )}
        </button>
      </div>
    </div>
  );
}
