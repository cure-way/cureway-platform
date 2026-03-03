"use client";

import Link from "next/link";
import { FaChevronRight } from "react-icons/fa";
import { ProductCard } from "@/components/home/cards";
import {
  FadeUp,
  StaggerContainer,
  StaggerItem,
} from "@/components/home/animations";
import { useMedicines } from "@/hooks/categories/useMedicines";
import { ProductGridSkeleton } from "@/components/patient/medicine/ProductGridSkeleton";

export function HomeMostSales() {
  const { medicines, loading, error } = useMedicines(1, 6);

  return (
    <section className="flex flex-col gap-6 px-4 md:px-6 lg:px-10 pb-8 md:pb-10 border-primary-light-active border-b w-full">
      {/* Title row */}
      <FadeUp inView offset={10} duration={0.4}>
        <div className="flex justify-between items-center">
          <h2 className="font-bold text-primary-darker lg:text-[40px] text-2xl md:text-3xl">
            Most Sales
          </h2>

          <Link
            href="/medicines"
            className="flex items-center gap-2 text-primary text-t-17 md:text-t-21 lg:text-[24px] hover:underline"
          >
            see all
            <FaChevronRight className="w-3 md:w-4 h-3 md:h-4" />
          </Link>
        </div>
      </FadeUp>

      {/* Product grid */}
      {loading && <ProductGridSkeleton />}
      {!loading && error && (
        <div className="p-4 text-red-600">Failed to load categories.</div>
      )}
      {!loading && !error && (
        <StaggerContainer
          className="flex gap-4 lg:grid lg:grid-cols-6 pb-2 lg:overflow-visible overflow-x-auto snap-mandatory snap-x"
          stagger={0.06}
        >
          {medicines.map((product) => (
            <StaggerItem
              key={product.id}
              className="w-40 sm:w-45 lg:w-auto snap-start shrink-0"
            >
              <ProductCard product={product} />
            </StaggerItem>
          ))}
        </StaggerContainer>
      )}
    </section>
  );
}
