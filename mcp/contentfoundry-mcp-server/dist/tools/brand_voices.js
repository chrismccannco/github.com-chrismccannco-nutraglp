import { cfFetch, handleApiError } from "../client.js";
function ok(data) {
    return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
}
export function registerBrandVoiceTools(server) {
    server.registerTool("cf_list_brand_voices", {
        title: "List Brand Voices",
        description: "List brand voice profiles defined in ContentFoundry. Each voice describes tone, vocabulary, words to avoid, and writing examples. Use these to match the correct voice when generating or reviewing content.",
        inputSchema: {},
        annotations: { readOnlyHint: true, destructiveHint: false },
    }, async () => {
        try {
            return ok(await cfFetch("/brand-voices"));
        }
        catch (err) {
            return handleApiError(err);
        }
    });
}
//# sourceMappingURL=brand_voices.js.map