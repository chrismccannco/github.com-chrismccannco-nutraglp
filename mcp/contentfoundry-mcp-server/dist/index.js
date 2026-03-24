#!/usr/bin/env node
/**
 * ContentFoundry MCP Server
 *
 * Gives AI agents (Claude, ChatGPT, Gemini, Cursor, etc.) direct access
 * to your ContentFoundry CMS — read content, personas, brand voices, and
 * create draft posts without leaving the chat.
 *
 * Transport: stdio (works with Claude Desktop, Cursor, VS Code, Cline, etc.)
 *
 * Setup:
 *   export CONTENTFOUNDRY_BASE_URL=https://your-site.com
 *   export CONTENTFOUNDRY_API_KEY=nglp_...
 *   node dist/index.js
 */
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { registerBlogTools } from "./tools/blog.js";
import { registerPageTools } from "./tools/pages.js";
import { registerProductTools } from "./tools/products.js";
import { registerFaqTools } from "./tools/faqs.js";
import { registerTestimonialTools } from "./tools/testimonials.js";
import { registerPersonaTools } from "./tools/personas.js";
import { registerBrandVoiceTools } from "./tools/brand_voices.js";
const server = new McpServer({
    name: "contentfoundry-mcp-server",
    version: "1.0.0",
});
// ── Read tools ────────────────────────────────────────────────────────────────
registerBlogTools(server); // cf_list_blog_posts, cf_get_blog_post
registerPageTools(server); // cf_list_pages, cf_get_page
registerProductTools(server); // cf_list_products, cf_get_product
registerFaqTools(server); // cf_list_faqs
registerTestimonialTools(server); // cf_list_testimonials
registerPersonaTools(server); // cf_list_personas, cf_get_persona
registerBrandVoiceTools(server); // cf_list_brand_voices
// ── Write tools ───────────────────────────────────────────────────────────────
// cf_create_draft_blog_post is registered in registerBlogTools (needs write key)
// ── Start ─────────────────────────────────────────────────────────────────────
async function main() {
    const transport = new StdioServerTransport();
    await server.connect(transport);
    process.stderr.write("ContentFoundry MCP server running (stdio)\n");
}
main().catch((err) => {
    process.stderr.write(`Fatal: ${err instanceof Error ? err.message : String(err)}\n`);
    process.exit(1);
});
//# sourceMappingURL=index.js.map