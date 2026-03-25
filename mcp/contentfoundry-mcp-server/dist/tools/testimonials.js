import { z } from "zod";
import { cfFetch, handleApiError } from "../client.js";
function ok(data) {
    return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
}
export function registerTestimonialTools(server) {
    server.registerTool("cf_list_testimonials", {
        title: "List Testimonials",
        description: "List published customer testimonials from ContentFoundry. Use featured=true to retrieve only featured testimonials for landing pages, proposals, or sales assets.",
        inputSchema: {
            featured: z
                .boolean()
                .optional()
                .describe("If true, return only featured testimonials"),
        },
        annotations: { readOnlyHint: true, destructiveHint: false },
    }, async ({ featured }) => {
        try {
            return ok(await cfFetch("/testimonials", {
                params: { featured: featured ? "true" : undefined },
            }));
        }
        catch (err) {
            return handleApiError(err);
        }
    });
}
//# sourceMappingURL=testimonials.js.map