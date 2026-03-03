"use client";

import CategoriesHeader from "@/components/patient/categories/CategoriesHeader";
import CategoryGrid from "@/components/patient/categories/CategoryGrid";
import FeaturedCategories from "@/components/patient/categories/FeaturedCategories";
import MostSalesSection from "@/components/patient/categories/MostSalesSection";
import RecommendedSection from "@/components/patient/categories/RecommendedSection";
import { useCategories } from "@/hooks/categories/useCategories";
import { useMedicines } from "@/hooks/categories/useMedicines";
import {
  getFeaturedCategories,
  getRecommendedMedicines,
  getTopSellingCategories,
} from "@/services/categoriesService";

export default function CategoriesPage() {
  const {
    categories,
    loading: catLoading,
    error: catError,
  } = useCategories(1, 50);

  const {
    medicines,
    loading: medLoading,
    error: medError,
  } = useMedicines(1, 50);

  const featured = getFeaturedCategories(categories);
  const mostSales = getTopSellingCategories(categories, medicines);
  const recommended = getRecommendedMedicines(medicines);

  return (
    <div className="space-y-10 px-6 sm:px-10 lg:px-16 py-8">
      <CategoriesHeader />
      <FeaturedCategories
        categories={featured}
        loading={catLoading}
        error={catError}
      />

      <MostSalesSection
        categories={mostSales}
        loading={catLoading}
        error={catError}
      />

      <CategoryGrid
        categories={categories}
        loading={catLoading}
        error={catError}
      />

      <RecommendedSection
        medicines={recommended}
        loading={medLoading}
        error={medError}
      />
    </div>
  );
}
