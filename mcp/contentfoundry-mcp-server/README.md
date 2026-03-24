# ContentFoundry MCP Server

Gives AI agents direct access to your ContentFoundry CMS. Works with Claude Desktop, Cursor, Cline, VS Code, and any client that supports the Model Context Protocol.

Once connected, you can ask things like:

- "Pull all our GLP-1 blog posts and write a roundup email draft"
- "What FAQs do we have about dosing? Are there any gaps?"
- "Get our weight-loss patient persona and write a product description in that voice"
- "Save this as a draft post in ContentFoundry"

---

## Requirements

- Node.js 18+
- A ContentFoundry API key (Admin → API Keys)

---

## Setup

### 1. Get your API key

Go to **Admin → API Keys** in your ContentFoundry dashboard. Create a key with `read` permission (add `write` if you want the agent to create drafts).

### 2. Install

```bash
cd mcp/contentfoundry-mcp-server
npm install
npm run build
```

### 3. Configure your MCP client

#### Claude Desktop

Add to `~/Library/Application Support/Claude/claude_desktop_config.json` (macOS) or `%APPDATA%\Claude\claude_desktop_config.json` (Windows):

```json
{
  "mcpServers": {
    "contentfoundry": {
      "command": "node",
      "args": ["/absolute/path/to/mcp/contentfoundry-mcp-server/dist/index.js"],
      "env": {
        "CONTENTFOUNDRY_BASE_URL": "https://your-site.com",
        "CONTENTFOUNDRY_API_KEY": "nglp_your_key_here"
      }
    }
  }
}
```

#### Cursor

Add to `.cursor/mcp.json` in your project root:

```json
{
  "mcpServers": {
    "contentfoundry": {
      "command": "node",
      "args": ["./mcp/contentfoundry-mcp-server/dist/index.js"],
      "env": {
        "CONTENTFOUNDRY_BASE_URL": "https://your-site.com",
        "CONTENTFOUNDRY_API_KEY": "nglp_your_key_here"
      }
    }
  }
}
```

---

## Available Tools

### Read (requires `read` key)

| Tool | Description |
|------|-------------|
| `cf_list_blog_posts` | List published posts, filter by tag, paginate |
| `cf_get_blog_post` | Get full post content by slug |
| `cf_list_pages` | List all published pages |
| `cf_get_page` | Get full page content by slug |
| `cf_list_products` | List all published products |
| `cf_get_product` | Get full product details by slug |
| `cf_list_faqs` | List FAQs, filter by category |
| `cf_list_testimonials` | List testimonials, filter to featured only |
| `cf_list_personas` | List all audience personas |
| `cf_get_persona` | Get full persona details by slug |
| `cf_list_brand_voices` | List brand voice profiles with tone guidelines |

### Write (requires `write` key)

| Tool | Description |
|------|-------------|
| `cf_create_draft_blog_post` | Create a new unpublished draft post |

---

## Example prompts

**Content audit:**
> "List all blog posts tagged 'nutrition' and tell me which topics we haven't covered yet."

**Persona-driven copy:**
> "Get the weight-loss patient persona and our GLP-1 product details, then write a 3-sentence product description in their voice."

**FAQ gap analysis:**
> "Pull all our FAQs. Based on our blog posts, what questions are we not answering?"

**Draft creation:**
> "Write a 500-word intro post about GLP-1 and tirzepatide differences, then save it as a draft in ContentFoundry tagged 'health'."

**Sales asset:**
> "Get our featured testimonials and product list. Draft a one-page leave-behind for a sales call."

---

## Roadmap

- v1 (now): Read + create draft posts
- v2: Update/publish posts, manage FAQs and testimonials, trigger AI generation workflows
