/**
 * Patient Home Page
 * The main landing page for patients (and guests)
 * Server Component — renders all home sections from mock data.
 */
import type { Metadata } from "next";

import {
  HomePromoBanner,
  HomeHero,
  HomeUploadPrescription,
  HomeCategories,
  HomeNearbyPharmacies,
  HomeMostSales,
  HomeBottomCTA,
} from "@/components/home/sections";
import { PageContainer } from "@/components/shared";

// Self-referencing canonical for the site root. The relative paths below are
// resolved against `metadataBase` (see `@/lib/site`), so the origin stays
// defined in exactly one place.
export const metadata: Metadata = {
  alternates: {
    canonical: "/",
  },
  openGraph: {
    url: "/",
  },
};

export default function PatientHomePage() {
  return (
    <div className="flex flex-col gap-6 pb-12 overflow-x-hidden">
      {/* 1. Promo banner — sits OUTSIDE the bordered container */}
      <HomePromoBanner />

      {/* 2-7. Main content — bordered container per Figma node 1209:375 */}
      {/* The landing page is a marketing layout: its promo banner and hero are
          deliberately full-bleed. The bordered content block below sits on the
          list container so it shares its edges with the shell and with every
          listing page. */}
      <PageContainer className="py-0">
        <div className="border-2 md:border-4 border-primary/10 rounded-2xl bg-white overflow-hidden">
          <div className="flex flex-col gap-8 md:gap-10 lg:gap-14 px-4 md:px-6 lg:px-8 pt-4 md:pt-6 lg:pt-8">
            {/* 2. Hero section */}
            <HomeHero />

            {/* 3. Upload prescription CTA */}
            <HomeUploadPrescription />

            {/* 4. Categories grid */}
            <HomeCategories />

            {/* 5. Nearby pharmacies */}
            <HomeNearbyPharmacies />

            {/* 6. Most sales products */}
            <HomeMostSales />

            {/* 7. Bottom CTA — free delivery + find pharmacy */}
            <HomeBottomCTA />
          </div>
        </div>
      </PageContainer>
    </div>
  );
}
