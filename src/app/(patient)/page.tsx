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
      {/* Every block on this page is a card or a content block, so every one
          of them sits on the frame. Only a true background image or colour
          band may be full-bleed, and this page has none. */}
      <PageContainer className="py-0">
        <HomePromoBanner />
      </PageContainer>

      <PageContainer className="py-0">
        <div className="flex flex-col gap-8 md:gap-10 lg:gap-14 pt-4 md:pt-6 lg:pt-8">
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
      </PageContainer>
    </div>
  );
}
