# @contentfoundry/sdk

JavaScript/TypeScript client for [ContentFoundry](https://getcontentfoundry.com), the headless CMS with built-in AI content tools.

## Install

```bash
npm install @contentfoundry/sdk
```

## Quick start

```typescript
import { ContentFoundry } from "@contentfoundry/sdk";

const cf = new ContentFoundry({
  baseUrl: "https://your-site.contentfoundry.app",
  apiKey: "nglp_your_api_key_here",
});

// Get all blog posts
const { data: posts } = await cf.blog.list();

// Get a single post by slug
const post = await cf.blog.get("how-glp1-works");
```

## Authentication

Create an API key in your ContentFoundry admin panel at **Settings > API Keys**. Keys are prefixed with `nglp_` and support configurable rate limits and permissions.

## Resources

### Pages

```typescript
// List all published pages
const { data } = await cf.pages.list();

// Get a page with full block content
const page = await cf.pages.get("about");
console.log(page.blocks); // block-based content
console.log(page.content); // legacy content object
```

### Blog

```typescript
// List with pagination and tag filter
const { data, total } = await cf.blog.list({
  tag: "Science",
  limit: 10,
  offset: 0,
});

// Single post with all content
const post = await cf.blog.get("natural-glp1-amplification");
console.log(post.sections); // content sections
console.log(post.blocks);   // block editor content
```

### Products

```typescript
const { data } = await cf.products.list();
const product = await cf.products.get("slim-shot");
```

### Media

```typescript
// List all media files
const { data: files } = await cf.media.list({ limit: 20 });

// Each file includes responsive URL variants
const file = await cf.media.get(1);
console.log(file.variants.original); // full size
console.log(file.variants.webp);     // WebP format
console.log(file.variants.w640);     // 640px wide

// Generate a srcset string for responsive images
const srcset = cf.media.srcset(file);
// => "https://...?w=640 640w, https://...?w=960 960w, https://... 1200w"
```

### Brand Voices

```typescript
const { data: voices } = await cf.brandVoices.list();
const voice = await cf.brandVoices.get("clinical-authority");
const defaultVoice = await cf.brandVoices.getDefault();

console.log(voice.tone);     // "Precise. Confident without being promotional."
console.log(voice.dos);      // writing guidelines
console.log(voice.donts);    // things to avoid
console.log(voice.exemplar); // example paragraph
```

### Personas

```typescript
const { data: personas } = await cf.personas.list();
const persona = await cf.personas.get("needle-averse-consumer");

console.log(persona.demographics);
console.log(persona.pain_points);
console.log(persona.channels); // ["instagram", "email", ...]
```

### FAQs & Testimonials

```typescript
const { data: faqs } = await cf.faqs.list({ category: "General" });
const { data: testimonials } = await cf.testimonials.list({ featured: true });
```

## Framework examples

### Next.js (App Router)

```typescript
// app/blog/page.tsx
import { ContentFoundry } from "@contentfoundry/sdk";

const cf = new ContentFoundry({
  baseUrl: process.env.CONTENTFOUNDRY_URL!,
  apiKey: process.env.CONTENTFOUNDRY_API_KEY!,
});

export default async function BlogPage() {
  const { data: posts } = await cf.blog.list({ limit: 20 });

  return (
    <div>
      {posts.map((post) => (
        <article key={post.slug}>
          <h2><a href={`/blog/${post.slug}`}>{post.title}</a></h2>
          <p>{post.description}</p>
          <span>{post.tag}</span>
        </article>
      ))}
    </div>
  );
}
```

### Astro

```astro
---
// src/pages/blog/[slug].astro
import { ContentFoundry } from "@contentfoundry/sdk";

const cf = new ContentFoundry({
  baseUrl: import.meta.env.CONTENTFOUNDRY_URL,
  apiKey: import.meta.env.CONTENTFOUNDRY_API_KEY,
});

const { slug } = Astro.params;
const post = await cf.blog.get(slug);
---

<article>
  <h1>{post.title}</h1>
  <p>{post.description}</p>
</article>
```

### Shopify Hydrogen

```typescript
// app/routes/blog.$slug.tsx
import { json, type LoaderFunctionArgs } from "@shopify/remix-oxygen";
import { ContentFoundry } from "@contentfoundry/sdk";

const cf = new ContentFoundry({
  baseUrl: "https://your-site.contentfoundry.app",
  apiKey: "nglp_your_key",
});

export async function loader({ params }: LoaderFunctionArgs) {
  const post = await cf.blog.get(params.slug!);
  return json({ post });
}
```

## Error handling

```typescript
import { ContentFoundryError } from "@contentfoundry/sdk";

try {
  const post = await cf.blog.get("nonexistent");
} catch (err) {
  if (err instanceof ContentFoundryError) {
    console.log(err.status);  // 404
    console.log(err.message); // "Post not found"
  }
}
```

## Rate limits

Each API key has a configurable daily request limit (default 1,000/day). Rate limit info is returned in response headers:

```
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 847
```

## TypeScript

The SDK is fully typed. All response types are exported:

```typescript
import type {
  Page, PageDetail,
  BlogPost, BlogPostDetail,
  Product,
  MediaFile,
  BrandVoice,
  Persona,
  FAQ,
  Testimonial,
} from "@contentfoundry/sdk";
```

## License

MIT
