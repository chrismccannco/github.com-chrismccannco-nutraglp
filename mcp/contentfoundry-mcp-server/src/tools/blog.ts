import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { cfFetch, handleApiError } from "../client.js";

type TextContent = { type: "text"; text: string };
type ToolResult = { content: TextContent[] };

function ok(data: unknown): ToolResult {
  return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
}

export function registerBlogTools(server: McpServer) {
  server.registerTool(
    "cf_list_blog_posts",
    {
      title: "List Blog Posts",
      description:
        "List published blog posts from ContentFoundry. Supports filtering by tag and pagination. Returns title, slug, description, date, and tag for each post.",
      inputSchema: {
        tag: z
          .string()
          .optional()
          .describe("Filter by tag/category (e.g. 'health', 'nutrition')"),
        limit: z
          .number()
          .int()
          .min(1)
          .max(100)
          .default(20)
          .describe("Number of posts to return (default 20, max 100)"),
        offset: z
          .number()
          .int()
          .min(0)
          .default(0)
          .describe("Pagination offset"),
      },
      annotations: { readOnlyHint: true, destructiveHint: false },
    },
    async ({ tag, limit = 20, offset = 0 }) => {
      try {
        const data = await cfFetch("/blog", { params: { tag, limit, offset } });
        return ok(data);
      } catch (err) {
        return handleApiError(err);
      }
    }
  );

  server.registerTool(
    "cf_get_blog_post",
    {
      title: "Get Blog Post",
      description:
        "Get a single published blog post by slug from ContentFoundry. Returns full content including sections, blocks, and SEO metadata.",
      inputSchema: {
        slug: z.string().describe("The blog post slug (e.g. 'glp1-guide')"),
      },
      annotations: { readOnlyHint: true, destructiveHint: false },
    },
    async ({ slug }) => {
      try {
        const post = await cfFetch("/blog", { params: { slug } });
        return ok(post);
      } catch (err) {
        return handleApiError(err);
      }
    }
  );

  server.registerTool(
    "cf_create_draft_blog_post",
    {
      title: "Create Draft Blog Post",
      description:
        "Create a new draft blog post in ContentFoundry. The post is saved as unpublished and can be reviewed in the admin dashboard before publishing. Requires a write-permission API key.",
      inputSchema: {
        title: z.string().describe("Post title"),
        slug: z
          .string()
          .optional()
          .describe(
            "URL slug — auto-generated from title if omitted"
          ),
        description: z
          .string()
          .optional()
          .describe("Short description / excerpt shown in post listings"),
        content: z
          .string()
          .optional()
          .describe("Main body content in plain text or markdown"),
        tag: z.string().optional().describe("Content category tag"),
        read_time: z
          .string()
          .optional()
          .describe("Estimated read time (e.g. '5 min read')"),
        meta_title: z.string().optional().describe("SEO title override"),
        meta_description: z
          .string()
          .optional()
          .describe("SEO meta description"),
      },
      annotations: {
        readOnlyHint: false,
        destructiveHint: false,
        idempotentHint: false,
      },
    },
    async (args) => {
      try {
        const result = (await cfFetch("/blog", {
          method: "POST",
          body: { ...args, published: false },
        })) as { id: number; slug: string };
        return {
          content: [
            {
              type: "text" as const,
              text: `Draft created. ID: ${result.id}, slug: "${result.slug}". Review it at /admin/blog/${result.slug}`,
            },
          ],
        };
      } catch (err) {
        return handleApiError(err);
      }
    }
  );
}
