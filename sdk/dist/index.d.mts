/**
 * @contentfoundry/sdk
 *
 * JavaScript/TypeScript client for the ContentFoundry headless CMS.
 *
 * Usage:
 *   import { ContentFoundry } from "@contentfoundry/sdk";
 *   const cf = new ContentFoundry({ baseUrl: "https://your-site.com", apiKey: "nglp_..." });
 *   const posts = await cf.blog.list({ tag: "Science", limit: 10 });
 */
interface ContentFoundryConfig {
    /** Base URL of your ContentFoundry instance (no trailing slash) */
    baseUrl: string;
    /** API key starting with "nglp_" */
    apiKey: string;
    /** Optional fetch implementation (defaults to global fetch) */
    fetch?: typeof fetch;
}
interface PaginationParams {
    limit?: number;
    offset?: number;
}
interface PaginatedResponse<T> {
    data: T[];
    total: number;
    limit: number;
    offset: number;
}
interface ListResponse<T> {
    data: T[];
    total: number;
}
interface Page {
    id: number;
    slug: string;
    title: string;
    meta_description: string;
    meta_title: string;
    og_image: string;
    updated_at: string;
}
interface PageDetail extends Page {
    blocks: unknown[];
    content: Record<string, unknown>;
}
interface BlogPost {
    id: number;
    slug: string;
    title: string;
    description: string;
    date: string;
    read_time: string;
    tag: string;
    featured_image: string;
    updated_at: string;
}
interface BlogPostDetail extends BlogPost {
    sections: unknown[];
    blocks: unknown[];
    meta_title: string;
    meta_description: string;
    og_image: string;
}
interface Product {
    id: number;
    slug: string;
    name: string;
    tagline: string;
    price: string;
    description: string;
    features: unknown[];
    status: string;
    launch_date: string;
    sort_order: number;
}
interface MediaFile {
    id: number;
    filename: string;
    mime_type: string;
    size: number;
    width: number;
    height: number;
    parent_id: number | null;
    url: string;
    variants: {
        original: string;
        webp: string;
        w640: string;
        w960: string;
        w1280: string;
    };
    created_at: string;
}
interface BrandVoice {
    id: number;
    name: string;
    slug: string;
    is_default: boolean;
    tagline: string | null;
    mission: string | null;
    audience: string | null;
    tone: string | null;
    dos: string | null;
    donts: string | null;
    exemplar: string | null;
    created_at: string;
}
interface Persona {
    id: number;
    name: string;
    slug: string;
    is_default: boolean;
    description: string | null;
    demographics: string | null;
    goals: string | null;
    pain_points: string | null;
    communication_style: string | null;
    objections: string | null;
    channels: string[];
    created_at: string;
}
interface FAQ {
    id: number;
    category: string;
    question: string;
    answer: string;
}
interface Testimonial {
    id: number;
    name: string;
    title: string;
    quote: string;
    rating: number;
    featured: boolean;
}
declare class ContentFoundryError extends Error {
    status: number;
    constructor(message: string, status: number);
}
declare class ContentFoundry {
    private baseUrl;
    private apiKey;
    private _fetch;
    readonly pages: PagesClient;
    readonly blog: BlogClient;
    readonly products: ProductsClient;
    readonly media: MediaClient;
    readonly brandVoices: BrandVoicesClient;
    readonly personas: PersonasClient;
    readonly faqs: FAQsClient;
    readonly testimonials: TestimonialsClient;
    constructor(config: ContentFoundryConfig);
    /** @internal */
    request<T>(path: string, params?: Record<string, string | number | boolean | undefined>): Promise<T>;
}
declare class PagesClient {
    private cf;
    constructor(cf: ContentFoundry);
    /** List all published pages (metadata only) */
    list(): Promise<ListResponse<Page>>;
    /** Get a single page by slug with full content and blocks */
    get(slug: string): Promise<PageDetail>;
}
declare class BlogClient {
    private cf;
    constructor(cf: ContentFoundry);
    /** List published blog posts with pagination and optional tag filter */
    list(params?: PaginationParams & {
        tag?: string;
    }): Promise<PaginatedResponse<BlogPost>>;
    /** Get a single blog post by slug with full content */
    get(slug: string): Promise<BlogPostDetail>;
}
declare class ProductsClient {
    private cf;
    constructor(cf: ContentFoundry);
    /** List all published products */
    list(): Promise<ListResponse<Product>>;
    /** Get a single product by slug */
    get(slug: string): Promise<Product>;
}
declare class MediaClient {
    private cf;
    constructor(cf: ContentFoundry);
    /** List media files with pagination */
    list(params?: PaginationParams): Promise<PaginatedResponse<MediaFile>>;
    /** Get a single media file by ID */
    get(id: number): Promise<MediaFile>;
    /**
     * Get a responsive srcset string for an image.
     * Useful for <img srcset="..."> attributes.
     */
    srcset(file: MediaFile, widths?: number[]): string;
}
declare class BrandVoicesClient {
    private cf;
    constructor(cf: ContentFoundry);
    /** List all brand voices */
    list(): Promise<ListResponse<BrandVoice>>;
    /** Get a brand voice by slug */
    get(slug: string): Promise<BrandVoice>;
    /** Get the default brand voice */
    getDefault(): Promise<BrandVoice | null>;
}
declare class PersonasClient {
    private cf;
    constructor(cf: ContentFoundry);
    /** List all audience personas */
    list(): Promise<ListResponse<Persona>>;
    /** Get a persona by slug */
    get(slug: string): Promise<Persona>;
    /** Get the default persona */
    getDefault(): Promise<Persona | null>;
}
declare class FAQsClient {
    private cf;
    constructor(cf: ContentFoundry);
    /** List all FAQs, optionally filtered by category */
    list(params?: {
        category?: string;
    }): Promise<ListResponse<FAQ>>;
}
declare class TestimonialsClient {
    private cf;
    constructor(cf: ContentFoundry);
    /** List testimonials, optionally only featured */
    list(params?: {
        featured?: boolean;
    }): Promise<ListResponse<Testimonial>>;
}

export { type BlogPost, type BlogPostDetail, type BrandVoice, ContentFoundry, type ContentFoundryConfig, ContentFoundryError, type FAQ, type ListResponse, type MediaFile, type Page, type PageDetail, type PaginatedResponse, type PaginationParams, type Persona, type Product, type Testimonial };
