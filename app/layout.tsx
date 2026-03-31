import type { Metadata } from "next";
import "./globals.css";
import Header from "./components/Header";
import PageViewTracker from "./components/PageViewTracker";
import AnalyticsScripts from "./components/AnalyticsScripts";

export const metadata: Metadata = {
  title: {
    default: "NutraGLP — Natural GLP-1 Amplification",
    template: "%s | NutraGLP",
  },
  description:
    "Slim SHOT is a daily liquid formula that amplifies your body's own GLP-1 production. No needle. No prescription. No catch. $149/mo.",
  keywords: [
    "natural GLP-1 supplement",
    "GLP-1 without prescription",
    "natural GLP-1 agonist",
    "nanoemulsion GLP-1",
    "DPP-4 inhibitor supplement",
    "natural weight management",
    "natural GLP-1 amplification",
  ],
  alternates: {
    canonical: "https://nutraglp.com",
  },
  openGraph: {
    title: "NutraGLP — Natural GLP-1 Amplification",
    description:
      "A patent-pending drinkable nanoemulsion that amplifies your body's natural GLP-1 and GIP production. No prescription. No injection. 13 metabolic pathways.",
    url: "https://nutraglp.com",
    siteName: "NutraGLP",
    type: "website",
    locale: "en_US",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "NutraGLP — Natural GLP-1 Amplification",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "NutraGLP — Natural GLP-1 Amplification",
    description:
      "A patent-pending drinkable nanoemulsion that amplifies your body's natural GLP-1 and GIP production.",
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
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300..700;1,9..144,300..700&family=Inter:ital,opsz,wght@0,14..32,300;0,14..32,400;0,14..32,500;0,14..32,600;0,14..32,700;1,14..32,400&display=swap"
          rel="stylesheet"
        />
        <link rel="icon" href="/favicon.svg?v=3" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png?v=3" />
      </head>
      <body className="bg-forest-black text-white">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "NutraGLP",
              url: "https://nutraglp.com",
              logo: "https://nutraglp.com/apple-touch-icon.png",
              description:
                "NutraGLP develops patent-pending nanoemulsion supplements for natural GLP-1 amplification. Flagship product: Slim SHOT, a daily drinkable liquid formula.",
              brand: {
                "@type": "Brand",
                name: "NutraGLP",
              },
              foundingDate: "2025",
              sameAs: [
                "https://www.linkedin.com/company/nutraglp",
                "https://www.instagram.com/nutraglp",
                "https://x.com/nutraglp",
              ],
            }),
          }}
        />
        <PageViewTracker />


            {/* Hidden forms for Netlify build-time detection */}
            <form name="waitlist" data-netlify="true" netlify-honeypot="bot-field" hidden>
              <input type="text" name="email" />
              <input type="text" name="bot-field" />
            </form>
            <form name="investor-deck" data-netlify="true" netlify-honeypot="bot-field" hidden>
              <input type="text" name="name" />
              <input type="text" name="email" />
              <input type="text" name="firm" />
              <input type="text" name="subject" />
              <input type="text" name="bot-field" />
            </form>
        <Header />
        {children}
      </body>
    </html>
  );
}
