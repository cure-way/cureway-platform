/* ---------------------------------- */
/* Mapper */
/* ---------------------------------- */

import { httpGet } from "@/lib/api";
import { PaginationMeta } from "@/types";
import {
  Category,
  CategoryDTO,
  PaginatedCategoriesResponse,
} from "@/types/categories.types";
import { Medicine } from "@/types/medicine.types";
import { categoryImages } from "@/utils/constants";

function mapCategory(dto: CategoryDTO): Category {
  return {
    id: dto.id,
    name: dto.name,
    description: dto.description ?? null,
  };
}

///////////////////////////////////////////////////////////////

export async function getCategories(
  page = 1,
  limit = 10,
): Promise<{ categories: Category[]; meta: PaginationMeta }> {
  const response = await httpGet<PaginatedCategoriesResponse>(
    `/categories?page=${page}&limit=${limit}`,
  );

  const categories = response.data.map((dto, index) => {
    const base = mapCategory(dto);

    return {
      ...base,
      displayImage:
        categoryImages[index] ?? "/patient/Discount on First Aid.png",
    };
  });

  return {
    categories,
    meta: response.meta,
  };
}

////////////////////////////////////////////////////////////////

export function getFeaturedCategories(
  categories: Category[],
  limit = 4,
): Category[] {
  return categories.slice(0, limit);
}

export function getTopSellingCategories(
  categories: Category[],
  medicines: Medicine[],
  limit = 5,
): Category[] {
  const countMap: Record<number, number> = {};

  medicines.forEach((medicine) => {
    countMap[medicine.categoryId] = (countMap[medicine.categoryId] || 0) + 1;
  });

  return [...categories]
    .sort((a, b) => (countMap[b.id] || 0) - (countMap[a.id] || 0))
    .slice(0, limit);
}

export function getRecommendedMedicines(
  medicines: Medicine[],
  limit = 6,
): Medicine[] {
  return medicines.slice(0, limit);
}

export function applyCategoryFilters(
  medicines: Medicine[],
  sort?: string,
): Medicine[] {
  switch (sort) {
    case "price-asc":
      return [...medicines].sort((a, b) => a.minPrice - b.minPrice);

    case "price-desc":
      return [...medicines].sort((a, b) => b.maxPrice - a.maxPrice);

    default:
      return medicines;
  }
}
