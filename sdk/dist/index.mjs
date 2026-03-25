// src/index.ts
var ContentFoundryError = class extends Error {
  constructor(message, status) {
    super(message);
    this.name = "ContentFoundryError";
    this.status = status;
  }
};
var ContentFoundry = class {
  constructor(config) {
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
  async request(path, params) {
    const url = new URL(`${this.baseUrl}${path}`);
    if (params) {
      for (const [key, value] of Object.entries(params)) {
        if (value !== void 0) {
          url.searchParams.set(key, String(value));
        }
      }
    }
    const res = await this._fetch(url.toString(), {
      headers: {
        Authorization: `Bearer ${this.apiKey}`,
        Accept: "application/json"
      }
    });
    if (!res.ok) {
      const body = await res.json().catch(() => ({ error: res.statusText }));
      throw new ContentFoundryError(body.error || `HTTP ${res.status}`, res.status);
    }
    return res.json();
  }
};
var PagesClient = class {
  constructor(cf) {
    this.cf = cf;
  }
  /** List all published pages (metadata only) */
  async list() {
    return this.cf.request("/api/v1/pages");
  }
  /** Get a single page by slug with full content and blocks */
  async get(slug) {
    return this.cf.request("/api/v1/pages", { slug });
  }
};
var BlogClient = class {
  constructor(cf) {
    this.cf = cf;
  }
  /** List published blog posts with pagination and optional tag filter */
  async list(params) {
    return this.cf.request("/api/v1/blog", params);
  }
  /** Get a single blog post by slug with full content */
  async get(slug) {
    return this.cf.request("/api/v1/blog", { slug });
  }
};
var ProductsClient = class {
  constructor(cf) {
    this.cf = cf;
  }
  /** List all published products */
  async list() {
    return this.cf.request("/api/v1/products");
  }
  /** Get a single product by slug */
  async get(slug) {
    return this.cf.request("/api/v1/products", { slug });
  }
};
var MediaClient = class {
  constructor(cf) {
    this.cf = cf;
  }
  /** List media files with pagination */
  async list(params) {
    return this.cf.request("/api/v1/media", params);
  }
  /** Get a single media file by ID */
  async get(id) {
    return this.cf.request("/api/v1/media", { id });
  }
  /**
   * Get a responsive srcset string for an image.
   * Useful for <img srcset="..."> attributes.
   */
  srcset(file, widths = [640, 960, 1280]) {
    const entries = widths.filter((w) => w < file.width).map((w) => `${file.variants[`w${w}`] || `${file.url}?w=${w}`} ${w}w`);
    entries.push(`${file.variants.original} ${file.width}w`);
    return entries.join(", ");
  }
};
var BrandVoicesClient = class {
  constructor(cf) {
    this.cf = cf;
  }
  /** List all brand voices */
  async list() {
    return this.cf.request("/api/v1/brand-voices");
  }
  /** Get a brand voice by slug */
  async get(slug) {
    return this.cf.request("/api/v1/brand-voices", { slug });
  }
  /** Get the default brand voice */
  async getDefault() {
    const { data } = await this.list();
    return data.find((v) => v.is_default) || null;
  }
};
var PersonasClient = class {
  constructor(cf) {
    this.cf = cf;
  }
  /** List all audience personas */
  async list() {
    return this.cf.request("/api/v1/personas");
  }
  /** Get a persona by slug */
  async get(slug) {
    return this.cf.request("/api/v1/personas", { slug });
  }
  /** Get the default persona */
  async getDefault() {
    const { data } = await this.list();
    return data.find((p) => p.is_default) || null;
  }
};
var FAQsClient = class {
  constructor(cf) {
    this.cf = cf;
  }
  /** List all FAQs, optionally filtered by category */
  async list(params) {
    return this.cf.request("/api/v1/faqs", params);
  }
};
var TestimonialsClient = class {
  constructor(cf) {
    this.cf = cf;
  }
  /** List testimonials, optionally only featured */
  async list(params) {
    return this.cf.request("/api/v1/testimonials", params);
  }
};
export {
  ContentFoundry,
  ContentFoundryError
};
