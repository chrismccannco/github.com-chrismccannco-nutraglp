"use client";

import { useState, useMemo } from "react";
import { Search, ChevronDown, ChevronRight, BookOpen, ArrowLeft } from "lucide-react";
import Link from "next/link";

/* ------------------------------------------------------------------ */
/*  Documentation data                                                 */
/* ------------------------------------------------------------------ */

interface DocSection {
  id: string;
  title: string;
  category: string;
  content: string;
  steps?: string[];
  tips?: string[];
}

const docs: DocSection[] = [
  /* ---- QUICK START ---- */
  {
    id: "quickstart-overview",
    title: "5-Minute Setup Guide",
    category: "Quick Start",
    content:
      "Get ContentFoundry running from zero to publishing in under five minutes. You'll log in, create your first page, and connect an AI client via the MCP server.",
    steps: [
      "Go to /admin and log in with your email and password",
      "Click Dashboard — you'll see a snapshot of your content across pages, blog, products, and forms",
      "Click Pages → New Page to create your first page with the visual block builder",
      "Go to Blog → New Post to draft your first blog post",
      "Visit Admin → API Keys to generate a key for external integrations or the MCP server",
      "Visit Admin → MCP Server for instructions on connecting Claude, Cursor, or ChatGPT directly to your content",
    ],
    tips: [
      "The sidebar collapses System-level sections by default — click System to expand API Keys, MCP Server, and Settings",
      "Every page auto-saves on changes; check the save indicator in the top right of the editor",
    ],
  },
  {
    id: "quickstart-first-page",
    title: "Your First Page",
    category: "Quick Start",
    content:
      "The page builder is block-based. You pick blocks (Hero, Text, FAQ, CTA, etc.) and fill them in. No code required. Publish when ready or save as a draft.",
    steps: [
      "Click Pages in the sidebar",
      "Click New Page and give it a title and slug (e.g. /about)",
      "Click Add Block and choose a block type — Hero is a good starting point",
      "Fill in the headline, subheadline, and CTA text",
      "Add more blocks as needed (Text, Features, CTA, FAQ)",
      "Set status to Published and click Save",
    ],
    tips: [
      "The slug becomes the URL path — use lowercase, hyphenated words",
      "Preview mode shows you exactly how the page will look before you publish",
    ],
  },
  {
    id: "quickstart-ai",
    title: "Using AI in the CMS",
    category: "Quick Start",
    content:
      "ContentFoundry has AI built into every content editor. The AI Assist button in the blog, page, and product editors lets you draft, rewrite, or expand content using your brand voice and personas.",
    steps: [
      "Open any blog post or page in the editor",
      "Click the AI Assist or wand icon in the toolbar",
      "Describe what you want — or let it draft from your title and existing content",
      "Review and accept, or iterate with a follow-up prompt",
      "For batch content, use AI → Batch Generate to create multiple posts from a topic list",
      "For repurposing, use AI → Repurpose to adapt content across formats",
    ],
    tips: [
      "Adding Personas (Brand & Voice → Personas) makes AI output significantly more targeted",
      "Brand Hub → Brand Voices stores your tone and style guidelines for the AI to follow",
    ],
  },

  /* ---- GETTING STARTED ---- */
  {
    id: "login",
    title: "Logging In",
    category: "Getting Started",
    content:
      "Navigate to /admin to access the CMS. You can log in with email + password (recommended) or a shared password. Email login creates individual sessions with role-based access. The shared password is a fallback for quick access.",
    steps: [
      "Go to your-domain.com/admin",
      "Enter your email and password",
      "Click Sign In",
      "If you don't have an email account, click 'Use shared password' and enter the admin password",
    ],
    tips: [
      "Email login is preferred because it tracks who made changes",
      "Admins can create new user accounts under Settings > Users",
    ],
  },
  {
    id: "dashboard",
    title: "Dashboard Overview",
    category: "Getting Started",
    content:
      "The dashboard is your home screen. It shows a snapshot of your content: page count, blog posts, products, recent submissions, and quick links to common actions. Use it to orient yourself before diving into specific sections.",
  },
  {
    id: "roles",
    title: "User Roles and Permissions",
    category: "Getting Started",
    content:
      "There are three roles: Admin, Editor, and Viewer. Admins have full access to all features including Settings, Users, API Keys, Sites, and Localization. Editors can create and edit content but cannot access system settings. Viewers can browse content but cannot make changes.",
    tips: [
      "Assign the Editor role to content writers who don't need system access",
      "The Settings section in the sidebar only appears for Admin users",
    ],
  },

  /* ---- PAGES ---- */
  {
    id: "pages-overview",
    title: "Managing Pages",
    category: "Pages",
    content:
      "Pages are the core content units of your site. Each page has a title, slug (URL path), SEO metadata, and block-based content. The Pages section lists all your pages with their titles and slugs.",
    steps: [
      "Click Pages in the sidebar to see all pages",
      "Click any page title to open the visual editor",
      "Use the search bar to filter pages by title",
    ],
  },
  {
    id: "page-builder",
    title: "Visual Page Builder",
    category: "Pages",
    content:
      "The page builder uses a block-based editor. Each page is composed of blocks that you can add, reorder, and configure. There are 12 block types: Hero, Text, Features, CTA, Testimonials, FAQ, Pricing, Image Gallery, Stats, Team, Contact Form, and Custom HTML.",
    steps: [
      "Open a page from the Pages list",
      "Click 'Add Block' to insert a new content block",
      "Choose a block type from the picker",
      "Fill in the block's fields (headline, text, images, etc.)",
      "Drag blocks to reorder them using the drag handle on the left",
      "Click the trash icon to remove a block",
      "Click Save when finished",
    ],
    tips: [
      "Use the Preview button to see how the page looks before publishing",
      "The Custom HTML block accepts raw HTML for advanced layouts",
      "Each block type has its own set of configurable fields",
    ],
  },
  {
    id: "page-seo",
    title: "Page SEO Settings",
    category: "Pages",
    content:
      "Every page has SEO fields: meta title, meta description, and Open Graph image. These control how the page appears in search results and social media shares. The slug determines the URL path.",
    tips: [
      "Keep meta titles under 60 characters",
      "Meta descriptions should be 150-160 characters",
      "Use descriptive slugs with hyphens, not underscores",
    ],
  },

  /* ---- CONTENT VERSIONING ---- */
  {
    id: "versioning",
    title: "Content Versioning",
    category: "Pages",
    content:
      "Every time you save a page, a new version is created. You can view the version history, compare any two versions side by side, and restore a previous version if needed. This gives you a full audit trail of changes.",
    steps: [
      "Open a page in the editor",
      "Click the 'History' or version icon in the toolbar",
      "Browse the list of saved versions with timestamps",
      "Click any version to see what changed (diff view)",
      "Click 'Restore' to revert the page to that version",
    ],
    tips: [
      "Versions are automatic — no need to manually save backups",
      "The diff viewer highlights what was added, removed, or changed",
      "Restoring a version creates a new version entry, so nothing is ever lost",
    ],
  },

  /* ---- BLOG ---- */
  {
    id: "blog",
    title: "Blog Posts",
    category: "Blog",
    content:
      "The blog section lets you create and manage posts. Each post has a title, slug, content (rich text), featured image, excerpt, author, category, tags, and publish status. Posts can be drafted and published later.",
    steps: [
      "Click Blog in the sidebar",
      "Click 'New Post' to create a post",
      "Fill in the title, content, and metadata",
      "Set status to 'draft' or 'published'",
      "Click Save",
    ],
  },

  /* ---- PRODUCTS ---- */
  {
    id: "products",
    title: "Products",
    category: "Products",
    content:
      "Manage your product catalog. Each product has a name, slug, description, price, images, category, and status. Products power the storefront pages and can be referenced in page builder blocks.",
    steps: [
      "Click Products in the sidebar",
      "Click 'Add Product' to create a new product",
      "Fill in the product details and pricing",
      "Upload product images via the Media library",
      "Set published status and save",
    ],
  },

  /* ---- FAQ ---- */
  {
    id: "faq",
    title: "FAQ Management",
    category: "FAQ",
    content:
      "The FAQ section stores question-answer pairs. These populate the FAQ block in the page builder and can also be served via the API. Each FAQ has a question, answer (supports rich text), category, and sort order.",
    steps: [
      "Click FAQ in the sidebar",
      "Click 'Add FAQ' to create a new entry",
      "Enter the question and answer",
      "Assign a category to group related FAQs",
      "Drag to reorder or set a sort number",
      "Save",
    ],
    tips: [
      "Use categories to organize FAQs by topic (e.g. Shipping, Product, Returns)",
      "FAQs automatically appear in any FAQ block on your pages",
    ],
  },

  /* ---- MEDIA ---- */
  {
    id: "media",
    title: "Media Library",
    category: "Media",
    content:
      "The media library stores all uploaded images. Images are automatically optimized on upload — converted to WebP/AVIF with responsive srcsets generated. You can browse, search, and copy image URLs for use in pages and blog posts.",
    steps: [
      "Click Media in the sidebar",
      "Click 'Upload' to add new images",
      "Click any image to see its details, URL, and optimized variants",
      "Use the copy button to grab the image URL",
    ],
    tips: [
      "Images are automatically optimized — no need to pre-compress",
      "WebP and AVIF formats are generated for modern browsers",
      "Responsive srcsets ensure the right size loads on each device",
    ],
  },

  /* ---- FORM BUILDER ---- */
  {
    id: "form-builder",
    title: "Form Builder",
    category: "Form Builder",
    content:
      "Create custom forms with drag-and-drop fields, validation rules, and conditional logic. Forms can be embedded on any page using the Contact Form block or accessed via the API.",
    steps: [
      "Click Form Builder in the sidebar",
      "Click 'Create Form' and give it a name and slug",
      "Add fields: text, email, textarea, select, checkbox, radio, number, date, file upload",
      "Configure each field's label, placeholder, required status, and validation rules",
      "Add conditional logic to show/hide fields based on other field values",
      "Save the form",
      "Embed it on a page using the Contact Form block",
    ],
    tips: [
      "Conditional logic lets you create branching forms — e.g. show 'Company Name' only when 'Type' is 'Business'",
      "Fields with a lightning bolt icon have conditional logic attached",
      "View submissions for each form via the submissions tab",
    ],
  },
  {
    id: "form-submissions",
    title: "Form Submissions",
    category: "Form Builder",
    content:
      "When visitors fill out a form on your site, submissions appear under Submissions in the sidebar and also on each form's detail page. You can view, export, and manage submissions.",
    steps: [
      "Click Submissions in the sidebar for a global view",
      "Or open a specific form in Form Builder and click the Submissions tab",
      "Click any submission to see the full response",
    ],
  },

  /* ---- TEMPLATES ---- */
  {
    id: "templates",
    title: "Template Marketplace",
    category: "Templates",
    content:
      "The template marketplace lets you browse, install, and manage page templates. Templates are pre-built page layouts with blocks already configured. Install a template to create a new page from it, or use it as a starting point and customize.",
    steps: [
      "Click Templates in the sidebar",
      "Browse available templates by category",
      "Click a template to preview its blocks and layout",
      "Click 'Install' to create a new page from the template",
      "The installed page appears in your Pages list, ready to edit",
    ],
    tips: [
      "Templates include block configurations, so you get a full page layout instantly",
      "After installing, customize the content — the template is just a starting point",
      "Admins can create and publish new templates from existing pages",
    ],
  },
  {
    id: "templates-create",
    title: "Creating Templates",
    category: "Templates",
    content:
      "Admins can create new templates to share across the CMS. A template captures a page's block structure and theme so it can be reused.",
    steps: [
      "Go to Templates and click 'Create Template'",
      "Give it a name, description, category, and optional thumbnail",
      "Define the blocks array (or copy from an existing page's JSON)",
      "Set theme colors if needed",
      "Add tags for discoverability",
      "Publish the template",
    ],
  },

  /* ---- WORKFLOW / APPROVAL ---- */
  {
    id: "workflows",
    title: "Workflow and Approval Chains",
    category: "Workflows",
    content:
      "Workflows let you set up approval chains for content. Instead of publishing directly, editors submit content for review. Reviewers approve or reject, and only approved content goes live. This is useful for teams where content needs sign-off.",
    steps: [
      "An editor creates or edits a page and clicks 'Submit for Review' instead of 'Publish'",
      "The content enters 'Pending Review' status",
      "A reviewer (admin or designated reviewer) sees pending items in the workflow queue",
      "The reviewer approves or rejects with optional comments",
      "Approved content is published automatically",
      "Rejected content returns to the editor with feedback",
    ],
    tips: [
      "Workflows are optional — admins can still publish directly",
      "Use workflows when multiple people contribute content and quality control matters",
      "The workflow history shows who approved what and when",
    ],
  },

  /* ---- AI & CREATION ---- */
  {
    id: "ai-templates",
    title: "AI Templates",
    category: "AI & Creation",
    content:
      "AI Templates are reusable generation workflows. Each template has a name, a prompt blueprint, a target content type, and an optional persona. Run a template to generate content in seconds without re-writing your prompt each time.",
    steps: [
      "Go to AI & Creation → AI Templates",
      "Click New Template",
      "Give it a name (e.g. 'GLP-1 Blog Post Intro')",
      "Write the prompt blueprint — use {{topic}} or {{persona}} as dynamic variables",
      "Choose the output type (blog post, product description, FAQ, etc.)",
      "Optionally link a Persona and Brand Voice to shape the output",
      "Click Run to generate content immediately",
    ],
    tips: [
      "Variables in double curly braces ({{variable}}) are filled in at runtime",
      "Templates run faster when they reference an existing Persona — the AI already knows the audience",
    ],
  },
  {
    id: "repurpose",
    title: "Repurpose Content",
    category: "AI & Creation",
    content:
      "Repurpose takes an existing blog post, page, or product and transforms it into a different format — email, social post, summary, FAQ expansion, and more. One source, many outputs.",
    steps: [
      "Go to AI & Creation → Repurpose",
      "Select the source content (blog post, page, or product)",
      "Choose a target format (email, LinkedIn post, Twitter thread, FAQ, etc.)",
      "Optionally select a persona to tailor the voice",
      "Click Repurpose and review the output",
      "Save the result as a draft or copy it to clipboard",
    ],
    tips: [
      "Your best-performing blog posts make the richest repurpose material",
      "LinkedIn and email formats tend to compress well from longer posts",
    ],
  },
  {
    id: "batch-generate",
    title: "Batch Generate",
    category: "AI & Creation",
    content:
      "Batch Generate lets you create multiple pieces of content from a single job. Feed it a list of topics or product names and it creates a draft for each one simultaneously.",
    steps: [
      "Go to AI & Creation → Batch Generate",
      "Choose a content type (blog posts, product descriptions, FAQs, etc.)",
      "Enter the list of topics or items — one per line",
      "Select a template or write a prompt for the job",
      "Set the persona and brand voice",
      "Click Run Batch and monitor progress",
      "Review drafts and publish or edit individually",
    ],
    tips: [
      "Batch jobs run asynchronously — you can leave the page and come back",
      "All generated content lands as drafts — nothing publishes automatically",
    ],
  },
  {
    id: "email-sequences",
    title: "Email Sequences",
    category: "AI & Creation",
    content:
      "Build multi-email nurture sequences with AI. Define the audience, goal, and number of emails. The AI drafts the full sequence with subject lines, bodies, and send-timing recommendations.",
    steps: [
      "Go to AI & Creation → Email Sequences",
      "Click New Sequence",
      "Name it and describe the audience and goal",
      "Set the number of emails and rough cadence",
      "Select a persona for voice targeting",
      "Click Generate Sequence",
      "Edit individual emails in the sequence editor",
    ],
    tips: [
      "Sequences work best when you describe the audience journey, not just the product",
      "You can regenerate individual emails without restarting the whole sequence",
    ],
  },
  {
    id: "video-studio",
    title: "Video Studio",
    category: "AI & Creation",
    content:
      "Video Studio extracts clip-worthy moments from transcripts and generates platform-specific captions. Paste a transcript from any recorded talk, webinar, or presentation and the AI finds the best moments for LinkedIn, TikTok, Instagram, and YouTube Shorts.",
    steps: [
      "Go to AI & Creation → Video Studio",
      "Click New Video and give it a title",
      "Paste the full transcript from your video",
      "Optionally add the source URL (YouTube, Loom, Zoom)",
      "Click 'Find best clip moments' to get AI suggestions",
      "For each suggestion, click the platform buttons to create a clip",
      "Click 'Generate all captions' to write platform-specific captions for every clip",
      "Copy captions for use in your publishing workflow",
    ],
    tips: [
      "Longer transcripts (30+ minutes) yield the best clip variety",
      "The AI assigns each suggestion to specific platforms based on format fit — a 2-minute monologue vs. a quick insight go to different places",
    ],
  },

  /* ---- MCP SERVER ---- */
  {
    id: "mcp-overview",
    title: "What is the MCP Server?",
    category: "MCP Server",
    content:
      "The ContentFoundry MCP server lets AI clients like Claude, Cursor, and ChatGPT query your CMS directly. Instead of copying content into your AI tool, the AI reads your blog posts, personas, FAQs, and products on demand. It also creates draft posts when you ask it to.",
    tips: [
      "MCP stands for Model Context Protocol — an open standard for connecting AI agents to tools and data sources",
      "The server runs locally on your machine and talks to your ContentFoundry API",
      "A read key is all you need for querying; add write permission to allow draft creation",
    ],
  },
  {
    id: "mcp-setup",
    title: "Setting Up the MCP Server",
    category: "MCP Server",
    content:
      "Setup takes about two minutes. You generate an API key, build the server once, and add a config block to your AI client. The server then connects automatically each time you open the client.",
    steps: [
      "Go to Admin → API Keys and generate a new key with read permission (add write if you want draft creation)",
      "In your terminal, navigate to the repo and run: cd mcp/contentfoundry-mcp-server && npm install && npm run build",
      "Open your Claude Desktop config: ~/Library/Application Support/Claude/claude_desktop_config.json (macOS) or %APPDATA%\\Claude\\claude_desktop_config.json (Windows)",
      "Add the mcpServers block with your site URL and API key (the MCP Server admin page auto-populates this config)",
      "Restart Claude Desktop",
      "Test it: ask Claude to 'list my blog posts' or 'get the weight-loss persona'",
    ],
    tips: [
      "The Admin → MCP Server page generates the exact config JSON with your site URL pre-filled",
      "For Cursor, add the same config to .cursor/mcp.json in your project root",
    ],
  },
  {
    id: "mcp-tools",
    title: "Available MCP Tools",
    category: "MCP Server",
    content:
      "The MCP server exposes 12 tools. Read tools require a read key. cf_create_draft_blog_post requires a write key.",
    tips: [
      "cf_list_blog_posts: list published posts, filter by tag",
      "cf_get_blog_post: get full post content by slug",
      "cf_list_pages: list all published pages",
      "cf_get_page: get full page content by slug",
      "cf_list_products: list all published products",
      "cf_get_product: get full product details by slug",
      "cf_list_faqs: list FAQs, filter by category",
      "cf_list_testimonials: list testimonials, filter to featured",
      "cf_list_personas: list all audience personas",
      "cf_get_persona: get full persona details by slug",
      "cf_list_brand_voices: list brand voice profiles",
      "cf_create_draft_blog_post: create a new unpublished draft (write key required)",
    ],
  },
  {
    id: "mcp-prompts",
    title: "Example MCP Prompts",
    category: "MCP Server",
    content:
      "Once the MCP server is connected, you can talk to your CMS in plain language from within Claude, Cursor, or ChatGPT.",
    steps: [
      "\"List all blog posts tagged 'nutrition' and identify any topic gaps\"",
      "\"Get the weight-loss patient persona, then write a product description for our GLP-1 program in that voice\"",
      "\"Pull all FAQs and tell me which questions our blog posts don't answer\"",
      "\"Write a 500-word intro post about GLP-1 side effects and save it as a draft\"",
      "\"Get our featured testimonials and draft a one-page leave-behind for a sales call\"",
    ],
    tips: [
      "Persona + content queries are especially powerful — the AI can read the persona and immediately write in that voice",
      "The draft creation tool saves directly to your CMS — you can review and publish from Admin → Blog",
    ],
  },

  /* ---- ANALYTICS & PERFORMANCE ---- */
  {
    id: "analytics",
    title: "Analytics",
    category: "Analytics",
    content:
      "The Analytics page shows visitor data, page views, and engagement metrics. It gives you a picture of how your site content is performing.",
  },
  {
    id: "performance",
    title: "Performance Dashboard",
    category: "Analytics",
    content:
      "The Performance dashboard shows Core Web Vitals (LCP, FID, CLS), Lighthouse scores, and historical performance trends. Use it to monitor site speed and identify pages that need optimization.",
    steps: [
      "Click Performance in the sidebar",
      "View the summary scores at the top",
      "Scroll down for per-page breakdowns",
      "Check the historical chart to see trends over time",
    ],
    tips: [
      "Green scores mean good performance, yellow needs attention, red needs immediate action",
      "Image optimization (automatic in this CMS) is the biggest lever for LCP improvements",
    ],
  },

  /* ---- API ---- */
  {
    id: "api-keys",
    title: "API Keys",
    category: "API",
    content:
      "API keys let external applications access your CMS content. Each key has a name, permissions, and rate limits. Generate keys for your frontend app, mobile app, or third-party integrations.",
    steps: [
      "Go to Settings > API Keys",
      "Click 'Generate Key'",
      "Name the key (e.g. 'Frontend App', 'Mobile App')",
      "Set permissions (read-only or read-write)",
      "Copy the key — it's only shown once",
      "Use the key in your API requests via the Authorization header",
    ],
    tips: [
      "Use read-only keys for frontend apps that only display content",
      "Rotate keys periodically for security",
      "Each key has independent rate limits",
    ],
  },
  {
    id: "api-docs",
    title: "API Documentation",
    category: "API",
    content:
      "The interactive API docs page shows all available endpoints with request/response examples. You can test endpoints directly from the docs page. The API serves content as JSON for headless use cases.",
    steps: [
      "Go to Settings > API Docs",
      "Browse endpoints by category (pages, blog, products, forms, etc.)",
      "Click any endpoint to see the request format and example response",
      "Use the 'Try It' button to make a live request",
    ],
  },

  /* ---- MULTI-SITE ---- */
  {
    id: "sites-overview",
    title: "Multi-Site / White Label",
    category: "Multi-Site",
    content:
      "The Sites feature lets you manage multiple websites from a single CMS. Each site has its own domain, theme, and content associations. Content can be shared across sites or exclusive to one. This is how you add chrismccann.co or any additional domain.",
    steps: [
      "Go to Settings > Sites",
      "Click 'Create Site'",
      "Enter the site name, slug, and domain (e.g. chrismccann.co)",
      "Configure the site's theme: primary color, font, logo URL",
      "Save the site",
      "Associate content by going to the site detail and linking pages, blog posts, or products to it",
    ],
    tips: [
      "Each site can have its own color scheme and branding",
      "Content is shared by default — associate specific content to restrict it to certain sites",
      "The domain field is used for routing in a multi-site deployment",
    ],
  },
  {
    id: "sites-content",
    title: "Associating Content with Sites",
    category: "Multi-Site",
    content:
      "After creating a site, you can link specific content to it. This controls which pages, posts, and products appear on which site. If no association is set, content is available on all sites.",
    steps: [
      "Open a site from Settings > Sites",
      "Go to the Content tab",
      "Click 'Associate Content'",
      "Select pages, blog posts, or products to link to this site",
      "Save",
    ],
  },
  {
    id: "sites-theming",
    title: "Per-Site Theming",
    category: "Multi-Site",
    content:
      "Each site has its own theme settings: primary color, secondary color, font family, and logo. When visitors access the site via its domain, the theme is applied automatically. This lets you white-label the same CMS for different brands.",
  },

  /* ---- LOCALIZATION ---- */
  {
    id: "localization-setup",
    title: "Setting Up Localization",
    category: "Localization",
    content:
      "Localization (i18n) lets you serve content in multiple languages. Start by adding locales, then translate your content and UI strings.",
    steps: [
      "Go to Settings > Localization",
      "Click 'Add Locale'",
      "Enter the locale code (e.g. 'es' for Spanish, 'fr' for French, 'de' for German)",
      "Give it a display name (e.g. 'Espa\u00f1ol')",
      "Set one locale as the default (this is your primary language)",
      "Save",
    ],
    tips: [
      "Use standard ISO 639-1 codes: en, es, fr, de, ja, zh, pt, etc.",
      "The default locale is what visitors see if no language preference is detected",
    ],
  },
  {
    id: "localization-content",
    title: "Translating Content",
    category: "Localization",
    content:
      "Once locales are set up, you can translate content fields (page titles, descriptions, block text) into each locale. The CMS stores translations per field per locale.",
    steps: [
      "Go to Settings > Localization",
      "Switch to the Content Translations tab",
      "Select a content type and item (e.g. a specific page)",
      "For each field, enter the translated text for each locale",
      "Or click 'Auto-translate' to use machine translation as a starting point",
      "Review and save",
    ],
    tips: [
      "Auto-translate is a starting point — always review machine translations",
      "Translation coverage is shown as a percentage per locale",
    ],
  },
  {
    id: "localization-ui",
    title: "UI String Translations",
    category: "Localization",
    content:
      "Beyond content, you can translate UI strings — button labels, navigation items, error messages, and other interface text. This ensures the entire visitor experience is localized.",
    steps: [
      "Go to Settings > Localization",
      "Switch to the UI Translations tab",
      "You'll see a list of UI keys (e.g. 'nav.home', 'button.submit', 'error.required')",
      "Enter the translated string for each locale",
      "Save",
    ],
  },

  /* ---- TESTIMONIALS & REVIEWS ---- */
  {
    id: "testimonials",
    title: "Testimonials",
    category: "Content",
    content:
      "Manage customer testimonials. Each testimonial has a name, role, company, quote, avatar, and rating. Testimonials feed into the Testimonials block in the page builder.",
    steps: [
      "Click Testimonials in the sidebar",
      "Click 'Add Testimonial'",
      "Enter the customer's name, role, company, quote text, and optional avatar URL",
      "Set a rating (1-5 stars)",
      "Save",
    ],
  },
  {
    id: "reviews",
    title: "Reviews",
    category: "Content",
    content:
      "Product reviews from customers. Reviews have a rating, title, body, author name, and verification status. They appear on product pages and can be moderated.",
  },

  /* ---- SETTINGS ---- */
  {
    id: "settings",
    title: "General Settings",
    category: "Settings",
    content:
      "General settings control site-wide configuration: site name, tagline, default SEO metadata, social media links, contact info, and global scripts (analytics tags, etc.).",
    steps: [
      "Go to Settings in the sidebar",
      "Update any field",
      "Click Save",
    ],
  },
  {
    id: "users",
    title: "User Management",
    category: "Settings",
    content:
      "Admins can create, edit, and deactivate user accounts. Each user has a name, email, role (Admin/Editor/Viewer), and login credentials.",
    steps: [
      "Go to Settings > Users",
      "Click 'Add User'",
      "Enter name, email, role, and set a temporary password",
      "The user can change their password on first login",
    ],
  },
];

/* ------------------------------------------------------------------ */
/*  Category grouping + icons                                          */
/* ------------------------------------------------------------------ */

const categoryOrder = [
  "Quick Start",
  "Getting Started",
  "Pages",
  "Blog",
  "Products",
  "FAQ",
  "Content",
  "Media",
  "Form Builder",
  "Templates",
  "Workflows",
  "AI & Creation",
  "MCP Server",
  "Analytics",
  "API",
  "Multi-Site",
  "Localization",
  "Settings",
];

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export default function DocsPage() {
  const [query, setQuery] = useState("");
  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    new Set()
  );
  const [activeDoc, setActiveDoc] = useState<string | null>(null);

  // Filter docs by search query
  const filtered = useMemo(() => {
    if (!query.trim()) return docs;
    const q = query.toLowerCase();
    return docs.filter(
      (d) =>
        d.title.toLowerCase().includes(q) ||
        d.content.toLowerCase().includes(q) ||
        d.category.toLowerCase().includes(q) ||
        d.steps?.some((s) => s.toLowerCase().includes(q)) ||
        d.tips?.some((t) => t.toLowerCase().includes(q))
    );
  }, [query]);

  // Group by category
  const grouped = useMemo(() => {
    const map = new Map<string, DocSection[]>();
    for (const doc of filtered) {
      const existing = map.get(doc.category) || [];
      existing.push(doc);
      map.set(doc.category, existing);
    }
    // Sort by category order
    const sorted: [string, DocSection[]][] = [];
    for (const cat of categoryOrder) {
      if (map.has(cat)) sorted.push([cat, map.get(cat)!]);
    }
    return sorted;
  }, [filtered]);

  const toggleCategory = (cat: string) => {
    setExpandedSections((prev) => {
      const next = new Set(prev);
      if (next.has(cat)) next.delete(cat);
      else next.add(cat);
      return next;
    });
  };

  // Expand all categories when searching
  const effectiveExpanded = query.trim()
    ? new Set(grouped.map(([cat]) => cat))
    : expandedSections;

  const activeDocData = activeDoc ? docs.find((d) => d.id === activeDoc) : null;

  // Highlight matching text
  const highlight = (text: string) => {
    if (!query.trim()) return text;
    const q = query.trim();
    const regex = new RegExp(`(${q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`, "gi");
    const parts = text.split(regex);
    return parts.map((part, i) =>
      regex.test(part) ? (
        <mark key={i} className="bg-amber-200 text-amber-900 rounded px-0.5">
          {part}
        </mark>
      ) : (
        part
      )
    );
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-1">
          <BookOpen className="w-6 h-6 text-teal-600" />
          <h1 className="text-2xl font-bold text-neutral-900">
            CMS Documentation
          </h1>
        </div>
        <p className="text-sm text-neutral-500">
          How to use every feature in ContentFoundry.
        </p>
      </div>

      {/* Search */}
      <div className="relative mb-8">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setActiveDoc(null);
          }}
          placeholder="Search documentation..."
          className="w-full pl-10 pr-4 py-3 bg-white border border-neutral-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent shadow-sm"
        />
        {query && (
          <button
            onClick={() => setQuery("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-neutral-400 hover:text-neutral-600"
          >
            Clear
          </button>
        )}
        {query && (
          <p className="mt-2 text-xs text-neutral-400">
            {filtered.length} result{filtered.length !== 1 ? "s" : ""} for &ldquo;{query}&rdquo;
          </p>
        )}
      </div>

      {/* Detail view */}
      {activeDocData ? (
        <div className="bg-white border border-neutral-200 rounded-xl p-6 shadow-sm">
          <button
            onClick={() => setActiveDoc(null)}
            className="flex items-center gap-1.5 text-xs text-neutral-400 hover:text-neutral-600 mb-4 transition"
          >
            <ArrowLeft className="w-3 h-3" />
            Back to all topics
          </button>

          <p className="text-[10px] uppercase tracking-widest text-teal-600 font-semibold mb-1">
            {activeDocData.category}
          </p>
          <h2 className="text-xl font-bold text-neutral-900 mb-4">
            {activeDocData.title}
          </h2>

          <p className="text-sm text-neutral-700 leading-relaxed mb-6">
            {highlight(activeDocData.content)}
          </p>

          {activeDocData.steps && activeDocData.steps.length > 0 && (
            <div className="mb-6">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-neutral-500 mb-3">
                Steps
              </h3>
              <ol className="space-y-2">
                {activeDocData.steps.map((step, i) => (
                  <li key={i} className="flex gap-3 text-sm text-neutral-700">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-teal-50 text-teal-700 text-xs font-semibold flex items-center justify-center">
                      {i + 1}
                    </span>
                    <span className="pt-0.5">{highlight(step)}</span>
                  </li>
                ))}
              </ol>
            </div>
          )}

          {activeDocData.tips && activeDocData.tips.length > 0 && (
            <div className="bg-amber-50 border border-amber-100 rounded-lg p-4">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-amber-700 mb-2">
                Tips
              </h3>
              <ul className="space-y-1.5">
                {activeDocData.tips.map((tip, i) => (
                  <li
                    key={i}
                    className="text-sm text-amber-800 pl-4 relative before:content-[''] before:absolute before:left-0 before:top-2 before:w-1.5 before:h-1.5 before:rounded-full before:bg-amber-300"
                  >
                    {highlight(tip)}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      ) : (
        /* Category list view */
        <div className="space-y-3">
          {grouped.length === 0 && (
            <div className="text-center py-12">
              <p className="text-sm text-neutral-400">
                No results found. Try a different search term.
              </p>
            </div>
          )}

          {grouped.map(([category, items]) => {
            const isOpen = effectiveExpanded.has(category);
            return (
              <div
                key={category}
                className="bg-white border border-neutral-200 rounded-xl overflow-hidden shadow-sm"
              >
                <button
                  onClick={() => toggleCategory(category)}
                  className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-neutral-50 transition"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-semibold text-neutral-900">
                      {category}
                    </span>
                    <span className="text-[10px] text-neutral-400 bg-neutral-100 px-2 py-0.5 rounded-full">
                      {items.length}
                    </span>
                  </div>
                  {isOpen ? (
                    <ChevronDown className="w-4 h-4 text-neutral-400" />
                  ) : (
                    <ChevronRight className="w-4 h-4 text-neutral-400" />
                  )}
                </button>

                {isOpen && (
                  <div className="border-t border-neutral-100">
                    {items.map((doc) => (
                      <button
                        key={doc.id}
                        onClick={() => setActiveDoc(doc.id)}
                        className="w-full text-left px-5 py-3 hover:bg-teal-50 transition border-b border-neutral-50 last:border-0"
                      >
                        <p className="text-sm font-medium text-neutral-800">
                          {highlight(doc.title)}
                        </p>
                        <p className="text-xs text-neutral-500 mt-0.5 line-clamp-2">
                          {highlight(doc.content.slice(0, 120))}
                          {doc.content.length > 120 ? "..." : ""}
                        </p>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Quick reference footer */}
      {!activeDocData && !query && (
        <div className="mt-10 bg-neutral-50 border border-neutral-200 rounded-xl p-6">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-neutral-500 mb-3">
            Quick Reference
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-sm">
            <Link href="/admin/pages" className="text-teal-700 hover:text-teal-900 no-underline">
              Pages &rarr;
            </Link>
            <Link href="/admin/blog" className="text-teal-700 hover:text-teal-900 no-underline">
              Blog &rarr;
            </Link>
            <Link href="/admin/products" className="text-teal-700 hover:text-teal-900 no-underline">
              Products &rarr;
            </Link>
            <Link href="/admin/faq" className="text-teal-700 hover:text-teal-900 no-underline">
              FAQ &rarr;
            </Link>
            <Link href="/admin/form-builder" className="text-teal-700 hover:text-teal-900 no-underline">
              Form Builder &rarr;
            </Link>
            <Link href="/admin/ai-templates" className="text-teal-700 hover:text-teal-900 no-underline">
              AI Templates &rarr;
            </Link>
            <Link href="/admin/video-studio" className="text-teal-700 hover:text-teal-900 no-underline">
              Video Studio &rarr;
            </Link>
            <Link href="/admin/mcp" className="text-teal-700 hover:text-teal-900 no-underline">
              MCP Server &rarr;
            </Link>
            <Link href="/admin/api-docs" className="text-teal-700 hover:text-teal-900 no-underline">
              API Docs &rarr;
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
