/** Site theme configuration */
export interface SiteTheme {
  primaryColor?: string;
  secondaryColor?: string;
  accentColor?: string;
  backgroundColor?: string;
  textColor?: string;
  fontFamily?: string;
  headingFont?: string;
  borderRadius?: string;
  customCss?: string;
}

/** Site settings */
export interface SiteSettings {
  tagline?: string;
  contactEmail?: string;
  socialLinks?: { platform: string; url: string }[];
  analytics?: { gaId?: string; gtmId?: string };
  seo?: { titleSuffix?: string; defaultDescription?: string };
  features?: {
    blog?: boolean;
    products?: boolean;
    faq?: boolean;
    testimonials?: boolean;
  };
}

/** Full site definition */
export interface Site {
  id: number;
  slug: string;
  name: string;
  domain: string | null;
  logo_url: string | null;
  favicon_url: string | null;
  theme: SiteTheme;
  settings: SiteSettings;
  enabled: boolean;
  created_at: string;
  updated_at: string;
}

/** Site-content association with optional overrides */
export interface SiteContent {
  id: number;
  site_id: number;
  content_type: string;
  content_id: number;
  overrides: Record<string, unknown>;
  hidden: boolean;
  sort_order: number;
}

/** Default theme (NutraGLP brand) */
export const DEFAULT_THEME: SiteTheme = {
  primaryColor: "#2D5F2B",
  secondaryColor: "#A8C5A0",
  accentColor: "#D4A843",
  backgroundColor: "#F5F0E8",
  textColor: "#1A1A1A",
  fontFamily: "Inter, sans-serif",
  headingFont: "Inter, sans-serif",
  borderRadius: "12px",
};
