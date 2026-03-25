import { z } from "zod";
import { cfFetch, handleApiError } from "../client.js";
function ok(data) {
    return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
}
export function registerFaqTools(server) {
    server.registerTool("cf_list_faqs", {
        title: "List FAQs",
        description: "List published FAQs from ContentFoundry, optionally filtered by category. Useful for answering customer questions, training chatbots, or auditing content coverage.",
        inputSchema: {
            category: z
                .string()
                .optional()
                .describe("Filter by category (e.g. 'product', 'shipping', 'dosing')"),
        },
        annotations: { readOnlyHint: true, destructiveHint: false },
    }, async ({ category }) => {
        try {
            return ok(await cfFetch("/faqs", { params: { category } }));
        }
        catch (err) {
            return handleApiError(err);
        }
    });
}
//# sourceMappingURL=faqs.js.map