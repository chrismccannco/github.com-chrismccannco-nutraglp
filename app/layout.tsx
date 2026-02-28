import type { Metadata } from "next";
import "./globals.css";
import Header from "./components/Header";

export const metadata: Metadata = {
  title: {
    default: "NutraGLP — Natural GLP-1 Activation",
    template: "%s | NutraGLP",
  },
  description:
    "Slim SHOT is a daily liquid formula that activates your body's own GLP-1 production. No needle. No prescription. No catch. $145/mo.",
  keywords: [
    "natural GLP-1 supplement",
    "GLP-1 without prescription",
    "natural GLP-1 agonist",
    "nanoemulsion GLP-1",
    "DPP-4 inhibitor supplement",
    "natural weight management",
    "natural GLP-1 activation",
  ],
  alternates: {
    canonical: "https://nutraglp.com",
  },
  openGraph: {
    title: "NutraGLP — Natural GLP-1 Activation",
    description:
      "A patent-pending drinkable nanoemulsion that activates your body's natural GLP-1 and GIP production. No prescription. No injection. 13 metabolic pathways.",
    url: "https://nutraglp.com",
    siteName: "NutraGLP",
    type: "website",
    locale: "en_US",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "NutraGLP — Natural GLP-1 Activation",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "NutraGLP — Natural GLP-1 Activation",
    description:
      "A patent-pending drinkable nanoemulsion that activates your body's natural GLP-1 and GIP production.",
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
        <link
          href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,400;0,9..144,500;0,9..144,600;1,9..144,400;1,9..144,500&family=DM+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400&display=swap"
          rel="stylesheet"
        />
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
      </head>
      <body className="bg-cream text-ink">
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
                "NutraGLP develops patent-pending nanoemulsion supplements for natural GLP-1 activation. Flagship product: Slim SHOT, a daily drinkable liquid formula.",
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
              parentOrganization: {
                "@type": "Organization",
                name: "NanoAlchemie",
              },
            }),
          }}
        />
        <Header />
        {children}
      </body>
    </html>
  );
}
