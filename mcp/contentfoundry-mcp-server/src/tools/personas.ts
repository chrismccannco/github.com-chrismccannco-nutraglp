import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { cfFetch, handleApiError } from "../client.js";

function ok(data: unknown) {
  return { content: [{ type: "text" as const, text: JSON.stringify(data, null, 2) }] };
}

export function registerPersonaTools(server: McpServer) {
  server.registerTool(
    "cf_list_personas",
    {
      title: "List Audience Personas",
      description:
        "List all audience personas defined in ContentFoundry. Personas describe target customer segments including goals, pain points, and tone preferences. Useful for tailoring content tone and messaging.",
      inputSchema: {},
      annotations: { readOnlyHint: true, destructiveHint: false },
    },
    async () => {
      try {
        return ok(await cfFetch("/personas"));
      } catch (err) {
        return handleApiError(err);
      }
    }
  );

  server.registerTool(
    "cf_get_persona",
    {
      title: "Get Audience Persona",
      description:
        "Get a single audience persona by slug from ContentFoundry. Returns full persona details including goals, pain points, and preferred tone — useful for writing content targeted at a specific segment.",
      inputSchema: {
        slug: z.string().describe("Persona slug (e.g. 'weight-loss-patient')"),
      },
      annotations: { readOnlyHint: true, destructiveHint: false },
    },
    async ({ slug }) => {
      try {
        return ok(await cfFetch("/personas", { params: { slug } }));
      } catch (err) {
        return handleApiError(err);
      }
    }
  );
}
