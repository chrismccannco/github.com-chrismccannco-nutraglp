import type { Metadata } from "next";
import "./globals.css";
import Header from "./components/Header";
import PageViewTracker from "./components/PageViewTracker";
import AnalyticsScripts from "./components/AnalyticsScripts";

export const metadata: Metadata = {
  title: {
    default: "NutraGLP Biosciences â Natural GLP-1 Amplification",
    template: "%s | NutraGLP Biosciences",
  },
  description:
    "NutraGLP Biosciences is developing a patent-pending metabolic amplification platform that coordinates endogenous incretin pathways through GRAS-certified bioactives and proprietary nanoemulsion delivery.",
  keywords: [
    "NutraGLP Biosciences",
    "natural GLP-1 amplification",
    "GLP-1 biotech",
    "metabolic amplification platform",
    "nanoemulsion bioactives",
    "incretin pathway",
    "DPP-4 inhibitor supplement",
    "GLP-1 investment opportunity",
    "biotech seed round",
    "natural weight management biotech",
  ],
  alternates: {
    canonical: "https://nutraglp.com",
  },
  openGraph: {
    title: "NutraGLP Biosciences â Natural GLP-1 Amplification",
    description:
      "A patent-pending metabolic amplification platform that coordinates endogenous incretin pathways through GRAS-certified bioactives and proprietary nanoemulsion delivery.",
    url: "https://nutraglp.com",
    siteName: "NutraGLP Biosciences",
    type: "website",
    locale: "en_US",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "NutraGLP Biosciences â Natural GLP-1 Amplification",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "NutraGLP Biosciences â Natural GLP-1 Amplification",
    description:
      "A patent-pending metabolic amplification platform that coordinates endogenous incretin pathways through GRAS-certified bioactives.",
  },
  robots: {
    index: true,
    follow: true,
  },
  metadataBase: new URL("https://nutraglp.com"),
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <AnalyticsScripts />
        <link
          href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,400;0,9..144,500;0,9..144,600;1,9..144,400;1,9..144,500&family=DM+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400&display=swap"
          rel="stylesheet"
        />
        <link rel="icon" href="/favicon.ico?v=2" sizes="any" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png?v=2" />
      </head>
      <body className="bg-cream text-ink">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "NutraGLP Biosciences",
              url: "https://nutraglp.com",
              logo: "https://nutraglp.com/apple-touch-icon.png",
              description:
                "NutraGLP Biosciences is a metabolic health company developing a patent-pending platform that amplifies the body's natural GLP-1 production through GRAS-certified bioactives and proprietary nanoemulsion delivery.",
              foundingDate: "2025",
              industry: "Biotechnology",
              numberOfEmployees: {
                "@type": "QuantitativeValue",
                minValue: 2,
                maxValue: 10,
              },
              contactPoint: {
                "@type": "ContactPoint",
                email: "investors@nutraglp.com",
                contactType: "investor relations",
              },
              sameAs: [
                "https://www.linkedin.com/company/nutraglp",
                "https://www.instagram.com/nutraglp",
                "https://x.com/nutraglp",
              ],
            }),
          }}
        />
        <PageViewTracker />
        <Header />
        {children}
      </body>
    </html>
  );
}
