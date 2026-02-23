import type { Metadata } from "next";
import "../styles/global.css";
import { Montserrat, Inter } from "next/font/google";
import { ScrollToTop } from "@/components/shared/ScrollToTop";
import { AuthProvider } from "@/features/auth";

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

export const metadata: Metadata = {
  title: {
    default: "CureWay",
    template: "%s | CureWay",
  },
  description: "Multi-vendor medicine and pharmacy delivery platform",
  keywords: ["pharmacy", "medicine", "delivery", "healthcare"],
  icons: {
    icon: "/logo.ico",
    apple: "/logo.ico",
  },
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
        <AuthProvider>
          <ScrollToTop />
          <div id="dropdown-portal" />
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
