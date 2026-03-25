/**
 * ContentFoundry API client.
 * All requests go through the v1 REST API using an API key.
 */
export declare class CfApiError extends Error {
    status: number;
    body?: unknown | undefined;
    constructor(status: number, message: string, body?: unknown | undefined);
}
interface RequestOptions {
    params?: Record<string, string | number | boolean | undefined>;
    body?: unknown;
    method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
}
export declare function cfFetch<T>(path: string, { params, body, method }?: RequestOptions): Promise<T>;
/** Wrap a tool handler so API errors return readable MCP text instead of throwing. */
export declare function handleApiError(err: unknown): {
    content: Array<{
        type: "text";
        text: string;
    }>;
};
export {};
//# sourceMappingURL=client.d.ts.map