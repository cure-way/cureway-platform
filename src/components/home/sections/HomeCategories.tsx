"use client";

import Link from "next/link";
import { FaChevronRight } from "react-icons/fa";
import { CategoryCard } from "@/components/home/cards";
import {
  FadeUp,
  StaggerContainer,
  StaggerItem,
} from "@/components/home/animations";
import { useCategories } from "@/hooks/categories/useCategories";
import { HomeCategoriesSkeleton } from "@/components/patient/categories/HomeCategoriesSkeleton";

export function HomeCategories() {
  const { categories, loading, error } = useCategories(1, 4);

  return (
    <section className="flex flex-col gap-6 px-4 md:px-6 lg:px-10 w-full">
      {/* Title row */}
      <FadeUp inView offset={10} duration={0.4}>
        <div className="flex justify-between items-center">
          <h2 className="font-bold text-primary-darker lg:text-[40px] text-2xl md:text-3xl">
            Categories
          </h2>
          <Link
            href="/categories"
            className="flex items-center gap-2 text-primary text-t-17 md:text-t-21 hover:underline"
          >
            see all
            <FaChevronRight className="w-3 md:w-4 h-3 md:h-4" />
          </Link>
        </div>
      </FadeUp>

      {/* Cards grid */}
      {loading && <HomeCategoriesSkeleton />}
      {!loading && error && (
        <div className="p-4 text-red-600">Failed to load categories.</div>
      )}
      {!loading && !error && (
        <StaggerContainer
          className="gap-4 grid grid-cols-2 md:grid-cols-4"
          stagger={0.08}
        >
          {categories.slice(0, 4).map((cat) => (
            <StaggerItem key={cat.id}>
              <CategoryCard category={cat} />
            </StaggerItem>
          ))}
        </StaggerContainer>
      )}
    </section>
  );
}
