import { z } from "zod";
import { cfFetch, handleApiError } from "../client.js";
function ok(data) {
    return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
}
export function registerPageTools(server) {
    server.registerTool("cf_list_pages", {
        title: "List Pages",
        description: "List all published pages in ContentFoundry. Returns slug, title, and SEO metadata for each page.",
        inputSchema: {},
        annotations: { readOnlyHint: true, destructiveHint: false },
    }, async () => {
        try {
            return ok(await cfFetch("/pages"));
        }
        catch (err) {
            return handleApiError(err);
        }
    });
    server.registerTool("cf_get_page", {
        title: "Get Page",
        description: "Get a single published page by slug from ContentFoundry. Returns full content blocks and SEO metadata.",
        inputSchema: {
            slug: z.string().describe("Page slug (e.g. 'home', 'about', 'pricing')"),
        },
        annotations: { readOnlyHint: true, destructiveHint: false },
    }, async ({ slug }) => {
        try {
            return ok(await cfFetch("/pages", { params: { slug } }));
        }
        catch (err) {
            return handleApiError(err);
        }
    });
}
//# sourceMappingURL=pages.js.map