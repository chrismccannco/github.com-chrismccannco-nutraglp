import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { cfFetch, handleApiError } from "../client.js";

function ok(data: unknown) {
  return { content: [{ type: "text" as const, text: JSON.stringify(data, null, 2) }] };
}

export function registerProductTools(server: McpServer) {
  server.registerTool(
    "cf_list_products",
    {
      title: "List Products",
      description:
        "List all published products in ContentFoundry. Returns name, slug, tagline, and price for each product.",
      inputSchema: {},
      annotations: { readOnlyHint: true, destructiveHint: false },
    },
    async () => {
      try {
        return ok(await cfFetch("/products"));
      } catch (err) {
        return handleApiError(err);
      }
    }
  );

  server.registerTool(
    "cf_get_product",
    {
      title: "Get Product",
      description:
        "Get a single published product by slug from ContentFoundry. Returns full product details including description, benefits, ingredients, and FAQs.",
      inputSchema: {
        slug: z.string().describe("Product slug (e.g. 'nutra-glp1-support')"),
      },
      annotations: { readOnlyHint: true, destructiveHint: false },
    },
    async ({ slug }) => {
      try {
        return ok(await cfFetch("/products", { params: { slug } }));
      } catch (err) {
        return handleApiError(err);
      }
    }
  );
}
