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
      <div className="mx-3 md:mx-6 lg:mx-12 border-2 md:border-4 border-primary/10 rounded-2xl md:rounded-3xl bg-white overflow-hidden">
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
      </div>
    </div>
  );
}
