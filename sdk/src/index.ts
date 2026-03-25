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

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface ContentFoundryConfig {
  /** Base URL of your ContentFoundry instance (no trailing slash) */
  baseUrl: string;
  /** API key starting with "nglp_" */
  apiKey: string;
  /** Optional fetch implementation (defaults to global fetch) */
  fetch?: typeof fetch;
}

export interface PaginationParams {
  limit?: number;
  offset?: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  limit: number;
  offset: number;
}

export interface ListResponse<T> {
  data: T[];
  total: number;
}

// Page types
export interface Page {
  id: number;
  slug: string;
  title: string;
  meta_description: string;
  meta_title: string;
  og_image: string;
  updated_at: string;
}

export interface PageDetail extends Page {
  blocks: unknown[];
  content: Record<string, unknown>;
}

// Blog types
export interface BlogPost {
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

export interface BlogPostDetail extends BlogPost {
  sections: unknown[];
  blocks: unknown[];
  meta_title: string;
  meta_description: string;
  og_image: string;
}

// Product types
export interface Product {
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

// Media types
export interface MediaFile {
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

// Brand voice types
export interface BrandVoice {
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

// Persona types
export interface Persona {
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

// FAQ types
export interface FAQ {
  id: number;
  category: string;
  question: string;
  answer: string;
}

// Testimonial types
export interface Testimonial {
  id: number;
  name: string;
  title: string;
  quote: string;
  rating: number;
  featured: boolean;
}

// ---------------------------------------------------------------------------
// Error
// ---------------------------------------------------------------------------

export class ContentFoundryError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.name = "ContentFoundryError";
    this.status = status;
  }
}

// ---------------------------------------------------------------------------
// Client
// ---------------------------------------------------------------------------

export class ContentFoundry {
  private baseUrl: string;
  private apiKey: string;
  private _fetch: typeof fetch;

  public readonly pages: PagesClient;
  public readonly blog: BlogClient;
  public readonly products: ProductsClient;
  public readonly media: MediaClient;
  public readonly brandVoices: BrandVoicesClient;
  public readonly personas: PersonasClient;
  public readonly faqs: FAQsClient;
  public readonly testimonials: TestimonialsClient;

  constructor(config: ContentFoundryConfig) {
    if (!config.baseUrl) throw new Error("baseUrl is required");
    if (!config.apiKey) throw new Error("apiKey is required");

    this.baseUrl = config.baseUrl.replace(/\/$/, "");
    this.apiKey = config.apiKey;
    this._fetch = config.fetch || globalThis.fetch;

    this.pages = new PagesClient(this);
    this.blog = new BlogClient(this);
    this.products = new ProductsClient(this);
    this.media = new MediaClient(this);
    this.brandVoices = new BrandVoicesClient(this);
    this.personas = new PersonasClient(this);
    this.faqs = new FAQsClient(this);
    this.testimonials = new TestimonialsClient(this);
  }

  /** @internal */
  async request<T>(path: string, params?: Record<string, string | number | boolean | undefined>): Promise<T> {
    const url = new URL(`${this.baseUrl}${path}`);
    if (params) {
      for (const [key, value] of Object.entries(params)) {
        if (value !== undefined) {
          url.searchParams.set(key, String(value));
        }
      }
    }

    const res = await this._fetch(url.toString(), {
      headers: {
        Authorization: `Bearer ${this.apiKey}`,
        Accept: "application/json",
      },
    });

    if (!res.ok) {
      const body = await res.json().catch(() => ({ error: res.statusText }));
      throw new ContentFoundryError(body.error || `HTTP ${res.status}`, res.status);
    }

    return res.json() as Promise<T>;
  }
}

// ---------------------------------------------------------------------------
// Resource clients
// ---------------------------------------------------------------------------

class PagesClient {
  constructor(private cf: ContentFoundry) {}

  /** List all published pages (metadata only) */
  async list(): Promise<ListResponse<Page>> {
    return this.cf.request("/api/v1/pages");
  }

  /** Get a single page by slug with full content and blocks */
  async get(slug: string): Promise<PageDetail> {
    return this.cf.request("/api/v1/pages", { slug });
  }
}

class BlogClient {
  constructor(private cf: ContentFoundry) {}

  /** List published blog posts with pagination and optional tag filter */
  async list(params?: PaginationParams & { tag?: string }): Promise<PaginatedResponse<BlogPost>> {
    return this.cf.request("/api/v1/blog", params as Record<string, string | number>);
  }

  /** Get a single blog post by slug with full content */
  async get(slug: string): Promise<BlogPostDetail> {
    return this.cf.request("/api/v1/blog", { slug });
  }
}

class ProductsClient {
  constructor(private cf: ContentFoundry) {}

  /** List all published products */
  async list(): Promise<ListResponse<Product>> {
    return this.cf.request("/api/v1/products");
  }

  /** Get a single product by slug */
  async get(slug: string): Promise<Product> {
    return this.cf.request("/api/v1/products", { slug });
  }
}

class MediaClient {
  constructor(private cf: ContentFoundry) {}

  /** List media files with pagination */
  async list(params?: PaginationParams): Promise<PaginatedResponse<MediaFile>> {
    return this.cf.request("/api/v1/media", params as Record<string, number>);
  }

  /** Get a single media file by ID */
  async get(id: number): Promise<MediaFile> {
    return this.cf.request("/api/v1/media", { id });
  }

  /**
   * Get a responsive srcset string for an image.
   * Useful for <img srcset="..."> attributes.
   */
  srcset(file: MediaFile, widths: number[] = [640, 960, 1280]): string {
    const entries = widths
      .filter((w) => w < file.width)
      .map((w) => `${file.variants[`w${w}` as keyof typeof file.variants] || `${file.url}?w=${w}`} ${w}w`);
    entries.push(`${file.variants.original} ${file.width}w`);
    return entries.join(", ");
  }
}

class BrandVoicesClient {
  constructor(private cf: ContentFoundry) {}

  /** List all brand voices */
  async list(): Promise<ListResponse<BrandVoice>> {
    return this.cf.request("/api/v1/brand-voices");
  }

  /** Get a brand voice by slug */
  async get(slug: string): Promise<BrandVoice> {
    return this.cf.request("/api/v1/brand-voices", { slug });
  }

  /** Get the default brand voice */
  async getDefault(): Promise<BrandVoice | null> {
    const { data } = await this.list();
    return data.find((v) => v.is_default) || null;
  }
}

class PersonasClient {
  constructor(private cf: ContentFoundry) {}

  /** List all audience personas */
  async list(): Promise<ListResponse<Persona>> {
    return this.cf.request("/api/v1/personas");
  }

  /** Get a persona by slug */
  async get(slug: string): Promise<Persona> {
    return this.cf.request("/api/v1/personas", { slug });
  }

  /** Get the default persona */
  async getDefault(): Promise<Persona | null> {
    const { data } = await this.list();
    return data.find((p) => p.is_default) || null;
  }
}

class FAQsClient {
  constructor(private cf: ContentFoundry) {}

  /** List all FAQs, optionally filtered by category */
  async list(params?: { category?: string }): Promise<ListResponse<FAQ>> {
    return this.cf.request("/api/v1/faqs", params as Record<string, string>);
  }
}

class TestimonialsClient {
  constructor(private cf: ContentFoundry) {}

  /** List testimonials, optionally only featured */
  async list(params?: { featured?: boolean }): Promise<ListResponse<Testimonial>> {
    return this.cf.request("/api/v1/testimonials", params as Record<string, boolean>);
  }
}
