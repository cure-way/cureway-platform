import type { Metadata } from "next";
import "../styles/global.css";
import { Montserrat, Inter } from "next/font/google";
import { ScrollToTop } from "@/components/shared/ScrollToTop";
import { AuthProvider } from "@/features/auth";
import ToastProvider from "@/components/shared/ToastProvider";
import QueryProvider from "@/hooks/query-provider";
import { ShowcaseBar } from "@/components/showcase/ShowcaseBar";
import { WelcomeDialog } from "@/components/showcase/WelcomeDialog";
import {
  SITE_DESCRIPTION,
  SITE_NAME,
  SITE_OG_IMAGE_PATH,
  SITE_ORIGIN_URL,
  SITE_URL,
} from "@/lib/site";

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
  weight: ["400", "500", "600", "700"],
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  weight: ["400", "500", "600", "700"],
});

// All absolute URLs below resolve against `metadataBase` (see `@/lib/site`),
// so the canonical origin is configured in exactly one place.
export const metadata: Metadata = {
  metadataBase: SITE_ORIGIN_URL,
  title: {
    default: SITE_NAME,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  keywords: ["pharmacy", "medicine", "delivery", "healthcare"],
  applicationName: SITE_NAME,
  // NOTE: no `alternates.canonical` / `openGraph.url` here on purpose — child
  // routes inherit them, which would make every page claim the homepage as
  // its canonical URL. Pages declare their own self-referencing canonical
  // (relative paths resolve against `metadataBase`).
  icons: {
    icon: "/logo.ico",
    apple: "/logo.ico",
  },
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
    locale: "en_US",
    images: [
      {
        url: SITE_OG_IMAGE_PATH,
        alt: SITE_NAME,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
    images: [SITE_OG_IMAGE_PATH],
  },
};

/**
 * Organization / WebSite structured data. Every URL comes from `SITE_URL`
 * so structured data can never drift from the deployed origin.
 */
const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${SITE_URL}/#organization`,
      name: SITE_NAME,
      url: SITE_URL,
      logo: `${SITE_URL}${SITE_OG_IMAGE_PATH}`,
    },
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      name: SITE_NAME,
      description: SITE_DESCRIPTION,
      url: SITE_URL,
      publisher: { "@id": `${SITE_URL}/#organization` },
    },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${montserrat.variable} ${inter.variable}`}
        suppressHydrationWarning
      >
        <script
          type="application/ld+json"
          // Serialized from `structuredData` above — no user input involved.
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
        <AuthProvider>
          <QueryProvider>
            <ShowcaseBar />
            <WelcomeDialog />
            <ScrollToTop />
            <div id="dropdown-portal" />
            <ToastProvider />
            {children}
          </QueryProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
