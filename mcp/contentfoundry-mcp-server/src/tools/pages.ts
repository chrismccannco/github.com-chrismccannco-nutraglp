import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { cfFetch, handleApiError } from "../client.js";

function ok(data: unknown) {
  return { content: [{ type: "text" as const, text: JSON.stringify(data, null, 2) }] };
}

export function registerPageTools(server: McpServer) {
  server.registerTool(
    "cf_list_pages",
    {
      title: "List Pages",
      description:
        "List all published pages in ContentFoundry. Returns slug, title, and SEO metadata for each page.",
      inputSchema: {},
      annotations: { readOnlyHint: true, destructiveHint: false },
    },
    async () => {
      try {
        return ok(await cfFetch("/pages"));
      } catch (err) {
        return handleApiError(err);
      }
    }
  );

  server.registerTool(
    "cf_get_page",
    {
      title: "Get Page",
      description:
        "Get a single published page by slug from ContentFoundry. Returns full content blocks and SEO metadata.",
      inputSchema: {
        slug: z.string().describe("Page slug (e.g. 'home', 'about', 'pricing')"),
      },
      annotations: { readOnlyHint: true, destructiveHint: false },
    },
    async ({ slug }) => {
      try {
        return ok(await cfFetch("/pages", { params: { slug } }));
      } catch (err) {
        return handleApiError(err);
      }
    }
  );
}
