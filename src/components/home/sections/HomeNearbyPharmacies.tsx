"use client";

import Link from "next/link";
import { FaChevronRight } from "react-icons/fa";
import { nearbyPharmacies } from "@/lib/mock/home";
import { PharmacyCard } from "@/components/home/cards";
import {
  FadeUp,
  StaggerContainer,
  StaggerItem,
} from "@/components/home/animations";

/**
 * HomeNearbyPharmacies
 * 3-column pharmacy cards with see-all link.
 * Wrapped in a subtle tinted background per the design.
 */
export function HomeNearbyPharmacies() {
  return (
    <section
      data-section="nearby pharmacies"
      className="w-full bg-primary-light/50 rounded-tr-3xl py-8"
    >
      <div className="flex flex-col gap-6">
        {/* Title row */}
        <FadeUp inView offset={10} duration={0.4}>
          <div className="flex items-center justify-between">
            <h2 className="text-t-21-semibold md:text-t-25-semibold lg:text-t-30-semibold text-primary-darker">
              Nearby pharmacies
            </h2>
            <Link
              href="/pharmacies"
              className="flex items-center gap-2 text-primary text-t-17 md:text-t-21 hover:underline"
            >
              see all
              <FaChevronRight className="w-3 h-3 md:w-4 md:h-4" />
            </Link>
          </div>
        </FadeUp>

        {/* Cards */}
        <StaggerContainer
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-6 lg:gap-8"
          stagger={0.1}
        >
          {nearbyPharmacies.map((pharmacy) => (
            <StaggerItem key={pharmacy.id}>
              <PharmacyCard pharmacy={pharmacy} />
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}
