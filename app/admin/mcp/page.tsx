"use client";

import { useState, useEffect } from "react";
import { Plug, Copy, Check, ExternalLink, Terminal, Key } from "lucide-react";
import Link from "next/link";

const TOOLS = [
  { name: "cf_list_blog_posts", desc: "List published blog posts, filter by tag" },
  { name: "cf_get_blog_post", desc: "Get full post content by slug" },
  { name: "cf_list_pages", desc: "List all published pages" },
  { name: "cf_get_page", desc: "Get full page content by slug" },
  { name: "cf_list_products", desc: "List all published products" },
  { name: "cf_get_product", desc: "Get full product details by slug" },
  { name: "cf_list_faqs", desc: "List FAQs, filter by category" },
  { name: "cf_list_testimonials", desc: "List testimonials, filter to featured" },
  { name: "cf_list_personas", desc: "List all audience personas" },
  { name: "cf_get_persona", desc: "Get full persona details by slug" },
  { name: "cf_list_brand_voices", desc: "List brand voice profiles" },
  { name: "cf_create_draft_blog_post", desc: "Create a new unpublished draft post (requires write key)" },
];

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <button
      onClick={copy}
      className="p-1.5 text-neutral-400 hover:text-neutral-600 transition rounded"
      title="Copy"
    >
      {copied ? <Check className="w-3.5 h-3.5 text-teal-500" /> : <Copy className="w-3.5 h-3.5" />}
    </button>
  );
}

function CodeBlock({ code }: { code: string }) {
  return (
    <div className="relative bg-neutral-950 rounded-lg p-4 mt-3">
      <div className="absolute top-2.5 right-2.5">
        <CopyButton text={code} />
      </div>
      <pre className="text-[12px] text-neutral-200 overflow-x-auto whitespace-pre">{code}</pre>
    </div>
  );
}

export default function McpPage() {
  const [siteUrl, setSiteUrl] = useState("");

  useEffect(() => {
    setSiteUrl(window.location.origin);
  }, []);

  const claudeConfig = JSON.stringify(
    {
      mcpServers: {
        contentfoundry: {
          command: "node",
          args: ["./mcp/contentfoundry-mcp-server/dist/index.js"],
          env: {
            CONTENTFOUNDRY_BASE_URL: siteUrl || "https://your-site.com",
            CONTENTFOUNDRY_API_KEY: "nglp_your_key_here",
          },
        },
      },
    },
    null,
    2
  );

  return (
    <div className="max-w-3xl">
      {/* Header */}
      <div className="flex items-center gap-3 mb-2">
        <Plug className="w-5 h-5 text-teal-600" />
        <h1 className="text-xl font-semibold text-neutral-900">MCP Server</h1>
      </div>
      <p className="text-sm text-neutral-500 mb-8">
        Connect Claude, ChatGPT, or any MCP-compatible AI client directly to this CMS. Query content, create drafts, pull personas — without switching tabs.
      </p>

      {/* Step 1 */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-3">
          <span className="w-6 h-6 rounded-full bg-teal-600 text-white text-xs font-semibold flex items-center justify-center flex-shrink-0">1</span>
          <h2 className="text-sm font-semibold text-neutral-900">Generate an API key</h2>
        </div>
        <p className="text-sm text-neutral-500 ml-8 mb-3">
          The MCP server authenticates with your API key. A <strong className="text-neutral-700">read</strong> key is enough for all query tools. Add <strong className="text-neutral-700">write</strong> permission to enable draft creation.
        </p>
        <div className="ml-8">
          <Link
            href="/admin/api-keys"
            className="inline-flex items-center gap-2 text-sm text-teal-700 font-medium hover:text-teal-900 no-underline"
          >
            <Key className="w-4 h-4" />
            Go to API Keys →
          </Link>
        </div>
      </div>

      {/* Step 2 */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-3">
          <span className="w-6 h-6 rounded-full bg-teal-600 text-white text-xs font-semibold flex items-center justify-center flex-shrink-0">2</span>
          <h2 className="text-sm font-semibold text-neutral-900">Install and build the server</h2>
        </div>
        <p className="text-sm text-neutral-500 ml-8 mb-1">
          The MCP server lives in <code className="text-xs bg-neutral-100 px-1.5 py-0.5 rounded text-neutral-700">mcp/contentfoundry-mcp-server/</code> in the repo. Run once to build.
        </p>
        <div className="ml-8">
          <CodeBlock code={`cd mcp/contentfoundry-mcp-server\nnpm install\nnpm run build`} />
        </div>
      </div>

      {/* Step 3 */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-3">
          <span className="w-6 h-6 rounded-full bg-teal-600 text-white text-xs font-semibold flex items-center justify-center flex-shrink-0">3</span>
          <h2 className="text-sm font-semibold text-neutral-900">Configure your AI client</h2>
        </div>

        {/* Claude Desktop */}
        <div className="ml-8 mb-5">
          <p className="text-sm font-medium text-neutral-700 mb-1">Claude Desktop</p>
          <p className="text-xs text-neutral-400 mb-1">
            Add to <code className="bg-neutral-100 px-1 py-0.5 rounded">~/Library/Application Support/Claude/claude_desktop_config.json</code>
          </p>
          <CodeBlock code={claudeConfig} />
        </div>

        {/* ChatGPT */}
        <div className="ml-8">
          <p className="text-sm font-medium text-neutral-700 mb-1">ChatGPT / other clients</p>
          <p className="text-xs text-neutral-500">
            Point your client at <code className="bg-neutral-100 px-1 py-0.5 rounded text-neutral-700">dist/index.js</code> with the same two environment variables:{" "}
            <code className="bg-neutral-100 px-1 py-0.5 rounded text-neutral-700">CONTENTFOUNDRY_BASE_URL</code> and{" "}
            <code className="bg-neutral-100 px-1 py-0.5 rounded text-neutral-700">CONTENTFOUNDRY_API_KEY</code>.
          </p>
        </div>
      </div>

      {/* Available tools */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          <Terminal className="w-4 h-4 text-neutral-400" />
          <h2 className="text-sm font-semibold text-neutral-900">Available tools ({TOOLS.length})</h2>
        </div>
        <div className="bg-white border border-neutral-200 rounded-xl overflow-hidden">
          {TOOLS.map((tool, i) => (
            <div
              key={tool.name}
              className={`flex items-start gap-3 px-4 py-3 ${i < TOOLS.length - 1 ? "border-b border-neutral-100" : ""}`}
            >
              <code className="text-[12px] text-teal-700 bg-teal-50 px-2 py-0.5 rounded font-mono flex-shrink-0 mt-0.5">
                {tool.name}
              </code>
              <p className="text-xs text-neutral-500 mt-0.5">{tool.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Example prompts */}
      <div className="mb-8">
        <h2 className="text-sm font-semibold text-neutral-900 mb-3">Example prompts</h2>
        <div className="space-y-2">
          {[
            "List all blog posts tagged 'nutrition' and identify any topic gaps.",
            "Get the weight-loss patient persona, then write a product description in that voice.",
            "Pull all FAQs and tell me which questions our blog posts don't answer.",
            "Write a 500-word intro post about GLP-1 side effects and save it as a draft.",
            "Get our featured testimonials and draft a one-page leave-behind for a sales call.",
          ].map((prompt) => (
            <div
              key={prompt}
              className="flex items-start justify-between gap-3 bg-neutral-50 border border-neutral-200 rounded-lg px-4 py-3"
            >
              <p className="text-sm text-neutral-700 italic">&ldquo;{prompt}&rdquo;</p>
              <CopyButton text={prompt} />
            </div>
          ))}
        </div>
      </div>

      {/* README link */}
      <div className="bg-neutral-50 border border-neutral-200 rounded-xl p-5 flex items-start gap-3">
        <ExternalLink className="w-4 h-4 text-neutral-400 flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-medium text-neutral-700">Full documentation</p>
          <p className="text-xs text-neutral-500 mt-0.5">
            See <code className="bg-neutral-100 px-1 py-0.5 rounded">mcp/contentfoundry-mcp-server/README.md</code> for complete setup instructions, Cursor config, and the v2 roadmap.
          </p>
        </div>
      </div>
    </div>
  );
}
