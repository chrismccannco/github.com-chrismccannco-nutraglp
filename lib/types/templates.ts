/** Template categories */
export type TemplateCategory = "page" | "landing" | "blog" | "product" | "email" | "form";

export const TEMPLATE_CATEGORIES: { value: TemplateCategory; label: string }[] = [
  { value: "page", label: "Page" },
  { value: "landing", label: "Landing Page" },
  { value: "blog", label: "Blog Post" },
  { value: "product", label: "Product Page" },
  { value: "email", label: "Email" },
  { value: "form", label: "Form" },
];

/** Template definition */
export interface Template {
  id: number;
  slug: string;
  name: string;
  description: string | null;
  category: TemplateCategory;
  thumbnail_url: string | null;
  blocks: unknown[];
  theme: Record<string, unknown>;
  author: string;
  version: string;
  downloads: number;
  rating: number;
  rating_count: number;
  tags: string[];
  is_premium: boolean;
  price: number;
  published: boolean;
  created_at: string;
  updated_at: string;
}

/** Template install record */
export interface TemplateInstall {
  id: number;
  template_id: number;
  site_id: number | null;
  target_type: string;
  target_id: number | null;
  installed_at: string;
}

/** Starter templates that ship with the platform */
export const STARTER_TEMPLATES: Omit<Template, "id" | "created_at" | "updated_at" | "downloads" | "rating" | "rating_count">[] = [
  {
    slug: "hero-landing",
    name: "Hero Landing Page",
    description: "A bold hero section with CTA, feature grid, testimonials, and closing CTA. Great for product launches.",
    category: "landing",
    thumbnail_url: null,
    blocks: [
      { id: "t1-hero", type: "hero", order: 0, data: { headline: "Your Product, Reimagined", subheadline: "A compelling tagline that makes visitors want to learn more.", ctaText: "Get Started", ctaUrl: "#", bgColor: "#2D5F2B", textAlign: "center" } },
      { id: "t1-stats", type: "stats_grid", order: 1, data: { stats: [{ label: "Active Users", value: "10,000+" }, { label: "Satisfaction", value: "98%" }, { label: "Uptime", value: "99.9%" }], columns: 3, bgColor: "#F5F0E8" } },
      { id: "t1-text", type: "rich_text", order: 2, data: { html: "<h2>Why Choose Us</h2><p>Share the story behind your product. What problem does it solve? Why should customers care?</p>" } },
      { id: "t1-testimonials", type: "testimonials", order: 3, data: { style: "cards", columns: 3 } },
      { id: "t1-cta", type: "cta_button", order: 4, data: { text: "Start Free Trial", url: "#", style: "primary", centered: true } },
    ],
    theme: {},
    author: "NutraGLP",
    version: "1.0.0",
    tags: ["landing", "hero", "conversion"],
    is_premium: false,
    price: 0,
    published: true,
  },
  {
    slug: "about-page",
    name: "About Us Page",
    description: "Tell your story with an image-text layout, team stats, and a mission statement.",
    category: "page",
    thumbnail_url: null,
    blocks: [
      { id: "t2-hero", type: "hero", order: 0, data: { headline: "About Us", subheadline: "Our mission and the people behind the product.", bgColor: "#2D5F2B", textAlign: "center" } },
      { id: "t2-imgtext", type: "image_text", order: 1, data: { imageUrl: "", imageAlt: "Team photo", imagePosition: "left", text: "<p>Share the founding story. What motivated the team? What values drive the company?</p>", heading: "Our Story" } },
      { id: "t2-stats", type: "stats_grid", order: 2, data: { stats: [{ label: "Founded", value: "2024" }, { label: "Team Members", value: "25" }, { label: "Customers", value: "1,000+" }, { label: "Countries", value: "12" }], columns: 4, bgColor: "#F5F0E8" } },
      { id: "t2-text", type: "rich_text", order: 3, data: { html: "<h2>Our Values</h2><p>Describe the principles that guide your organization.</p>" } },
      { id: "t2-cta", type: "cta_button", order: 4, data: { text: "Join Our Team", url: "/careers", style: "secondary", centered: true } },
    ],
    theme: {},
    author: "NutraGLP",
    version: "1.0.0",
    tags: ["about", "company", "team"],
    is_premium: false,
    price: 0,
    published: true,
  },
  {
    slug: "product-showcase",
    name: "Product Showcase",
    description: "Feature a single product with hero image, benefits grid, FAQ, and purchase CTA.",
    category: "product",
    thumbnail_url: null,
    blocks: [
      { id: "t3-hero", type: "hero", order: 0, data: { headline: "Product Name", subheadline: "One sentence that captures the product's value.", ctaText: "Buy Now", ctaUrl: "#", bgColor: "#1A1A1A", textAlign: "center" } },
      { id: "t3-imgtext", type: "image_text", order: 1, data: { imageUrl: "", imageAlt: "Product image", imagePosition: "right", text: "<p>Describe the key benefits. What makes this product different?</p>", heading: "Why This Product" } },
      { id: "t3-cards", type: "card_grid", order: 2, data: { cards: [{ title: "Feature One", description: "Explain the first key feature.", imageUrl: "", ctaText: "", ctaUrl: "" }, { title: "Feature Two", description: "Explain the second key feature.", imageUrl: "", ctaText: "", ctaUrl: "" }, { title: "Feature Three", description: "Explain the third key feature.", imageUrl: "", ctaText: "", ctaUrl: "" }], columns: 3 } },
      { id: "t3-faq", type: "faq_accordion", order: 3, data: {} },
      { id: "t3-cta", type: "cta_button", order: 4, data: { text: "Order Now", url: "#", style: "primary", centered: true } },
    ],
    theme: {},
    author: "NutraGLP",
    version: "1.0.0",
    tags: ["product", "ecommerce", "showcase"],
    is_premium: false,
    price: 0,
    published: true,
  },
  {
    slug: "blog-article",
    name: "Blog Article",
    description: "A clean article layout with hero, rich text body, related content cards, and newsletter CTA.",
    category: "blog",
    thumbnail_url: null,
    blocks: [
      { id: "t4-hero", type: "hero", order: 0, data: { headline: "Article Title", subheadline: "A brief summary or author byline.", bgColor: "#F5F0E8", textAlign: "left" } },
      { id: "t4-text1", type: "rich_text", order: 1, data: { html: "<p>Write the introduction here. Hook the reader with a compelling opening.</p>" } },
      { id: "t4-img", type: "image", order: 2, data: { url: "", alt: "Article illustration", caption: "", alignment: "center" } },
      { id: "t4-text2", type: "rich_text", order: 3, data: { html: "<h2>Main Section</h2><p>Continue the article body here.</p>" } },
      { id: "t4-divider", type: "divider", order: 4, data: { style: "solid", spacing: "lg" } },
      { id: "t4-cta", type: "cta_button", order: 5, data: { text: "Subscribe to Newsletter", url: "#", style: "outline", centered: true } },
    ],
    theme: {},
    author: "NutraGLP",
    version: "1.0.0",
    tags: ["blog", "article", "content"],
    is_premium: false,
    price: 0,
    published: true,
  },
  {
    slug: "faq-page",
    name: "FAQ Page",
    description: "Frequently asked questions with a hero header, accordion, and support CTA.",
    category: "page",
    thumbnail_url: null,
    blocks: [
      { id: "t5-hero", type: "hero", order: 0, data: { headline: "Frequently Asked Questions", subheadline: "Find answers to common questions below.", bgColor: "#2D5F2B", textAlign: "center" } },
      { id: "t5-faq", type: "faq_accordion", order: 1, data: {} },
      { id: "t5-spacer", type: "spacer", order: 2, data: { height: "lg" } },
      { id: "t5-text", type: "rich_text", order: 3, data: { html: "<h3>Still have questions?</h3><p>Our support team is here to help.</p>" } },
      { id: "t5-cta", type: "cta_button", order: 4, data: { text: "Contact Support", url: "/contact", style: "primary", centered: true } },
    ],
    theme: {},
    author: "NutraGLP",
    version: "1.0.0",
    tags: ["faq", "support", "help"],
    is_premium: false,
    price: 0,
    published: true,
  },
  {
    slug: "premium-saas-landing",
    name: "SaaS Landing Page",
    description: "Full-featured SaaS landing page with hero, feature cards, video embed, pricing stats, testimonials, and CTA.",
    category: "landing",
    thumbnail_url: null,
    blocks: [
      { id: "t6-hero", type: "hero", order: 0, data: { headline: "Ship Faster. Scale Smarter.", subheadline: "The all-in-one platform for modern teams.", ctaText: "Start Free", ctaUrl: "#", bgColor: "#1A1A1A", textAlign: "center" } },
      { id: "t6-cards", type: "card_grid", order: 1, data: { cards: [{ title: "Automated Workflows", description: "Build workflows in minutes.", imageUrl: "", ctaText: "", ctaUrl: "" }, { title: "Real-time Analytics", description: "Dashboards that update instantly.", imageUrl: "", ctaText: "", ctaUrl: "" }, { title: "Team Collaboration", description: "Work together, asynchronously.", imageUrl: "", ctaText: "", ctaUrl: "" }, { title: "Enterprise Security", description: "SOC 2 compliant out of the box.", imageUrl: "", ctaText: "", ctaUrl: "" }], columns: 4 } },
      { id: "t6-video", type: "video_embed", order: 2, data: { url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ", title: "Product Demo" } },
      { id: "t6-stats", type: "stats_grid", order: 3, data: { stats: [{ label: "Companies", value: "500+" }, { label: "API Requests/day", value: "10M+" }, { label: "Uptime", value: "99.99%" }], columns: 3, bgColor: "#F5F0E8" } },
      { id: "t6-testimonials", type: "testimonials", order: 4, data: { style: "cards", columns: 2 } },
      { id: "t6-cta", type: "cta_button", order: 5, data: { text: "Get Started Free", url: "#", style: "primary", centered: true } },
    ],
    theme: {},
    author: "NutraGLP",
    version: "1.0.0",
    tags: ["saas", "startup", "premium", "landing"],
    is_premium: true,
    price: 29,
    published: true,
  },
];
