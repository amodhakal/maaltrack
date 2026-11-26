import type { Metadata, Viewport } from "next";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

const siteUrl = "https://maaltrack.vercel.app";
const title = "MaalTrack — Marriage Card Game Scorekeeper";
const description =
  "Free Marriage card game scorekeeper for 2–12 players. Install MaalTrack as a PWA for the best experience, or play instantly in your browser. Seen/unseen/doubles rounds, auto-settled totals, and offline support.";

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
    images: [
      {
        url: "/og-image.png",
        alt: "MaalTrack — Marriage Card Game Scorekeeper",
      },
    ],
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
      browserRequirements: "Requires a modern web browser with JavaScript enabled",
      image: `${siteUrl}/og-image.png`,
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "USD",
      },
      featureList: [
        "Installable PWA",
        "Runs in your browser",
        "Offline support",
        "2-12 players",
        "Seen/Unseen/Doubles rounds",
        "Auto settlement",
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
        <noscript>
          <div
            style={{
              padding: "2rem",
              textAlign: "center",
              fontFamily: "system-ui, sans-serif",
              maxWidth: "32rem",
              margin: "0 auto",
            }}
          >
            <h1 style={{ fontSize: "1.75rem", marginBottom: "1rem" }}>
              MaalTrack — Marriage Card Game Scorekeeper
            </h1>
            <p style={{ lineHeight: 1.6 }}>
              MaalTrack is a free scorekeeper for the Nepali card game Marriage.
              Install it as a PWA for the best experience, or play in your
              browser with JavaScript enabled.{" "}
              <a href="https://github.com/amodhakal/maaltrack">View on GitHub</a>.
            </p>
          </div>
        </noscript>
      </body>
    </html>
  );
}
