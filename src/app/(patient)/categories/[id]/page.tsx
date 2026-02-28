"use client";

import CategoryFilters from "@/components/patient/categories/CategoryFilters";
import ProductGrid from "@/components/patient/categories/ProductGrid";
import { useMedicines } from "@/hooks/categories/useMedicines";
import { applyCategoryFilters } from "@/services/categoriesService";

import { categoryMedicinesFilters } from "@/utils/constants";
import { useParams, useSearchParams } from "next/navigation";

export default function CategoryPage() {
  const params = useParams();
  const categoryId = Number(params.id);
  const searchParams = useSearchParams();
  const sort = searchParams.get("sort") ?? undefined;

  const { medicines, loading, error } = useMedicines(1, 12, categoryId);

  const filteredMedicines = applyCategoryFilters(medicines, sort);

  return (
    <div className="space-y-8 px-16 py-8">
      <div className="flex flex-wrap justify-between items-center gap-4">
        <h1 className="font-semibold text-gray-900 text-2xl">
          {medicines[0]?.categoryName || "Category"}
        </h1>

        <CategoryFilters
          filters={categoryMedicinesFilters}
          categoryId={categoryId}
          activeSort={sort}
        />
      </div>

      <ProductGrid
        medicines={filteredMedicines}
        loading={loading}
        error={error}
      />
    </div>
  );
}
