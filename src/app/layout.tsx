import type { Metadata, Viewport } from "next";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

const siteUrl = "https://maaltrack.vercel.app";
const title = "MaalTrack — Marriage Card Game Scorekeeper";
const description =
  "Free online scorekeeper for Marriage (Nepali card game). 2–12 players, seen/unseen/doubles rounds, auto-settled so every row totals 0. Works offline.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title,
  description,
  applicationName: "MaalTrack",
  manifest: "/manifest.webmanifest",
  alternates: {
    canonical: "/",
  },
  robots: {
    index: true,
    follow: true,
    "max-image-preview": "large",
  },
  verification: {
    google: "J1qFiqJ5JoSaQWX6dqMVi2bp3ZEqtUsIcJykD_-recw",
  },
  openGraph: {
    type: "website",
    url: siteUrl,
    title,
    description,
    siteName: "MaalTrack",
    locale: "en_US",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "MaalTrack — Marriage Card Game Scorekeeper",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: ["/og-image.png"],
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon.svg", type: "image/svg+xml" },
    ],
    apple: [{ url: "/apple-touch-icon-180x180.png", sizes: "180x180" }],
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "MaalTrack",
  },
  other: {
    "mobile-web-app-capable": "yes",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#12100e",
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebApplication",
      name: "MaalTrack",
      url: `${siteUrl}/`,
      description,
      applicationCategory: "GameApplication",
      operatingSystem: "Any",
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "USD",
      },
      featureList: [
        "2-12 players",
        "Seen/Unseen/Doubles rounds",
        "Auto settlement",
        "Offline support",
        "PWA installable",
      ],
      publisher: {
        "@type": "Organization",
        name: "MaalTrack",
        url: "https://github.com/amodhakal/maaltrack",
      },
    },
    {
      "@type": "WebSite",
      name: "MaalTrack",
      url: `${siteUrl}/`,
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {children}
        <Analytics />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </body>
    </html>
  );
}
