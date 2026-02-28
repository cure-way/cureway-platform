/* ---------------------------------- */
/* Mapper */
/* ---------------------------------- */

import { httpGet } from "@/lib/api";
import {
  Category,
  CategoryDTO,
  Medicine,
  MedicineDTO,
  MedicineFilters,
  PaginatedCategoriesResponse,
  PaginatedMedicinesResponse,
  PaginationMeta,
} from "@/types/categories.types";
import { categoryImages } from "@/utils/constants";

function mapCategory(dto: CategoryDTO): Category {
  return {
    id: dto.id,
    name: dto.name,
    description: dto.description ?? null,
  };
}

export function mapMedicine(dto: MedicineDTO): Medicine {
  const firstImage = dto.images?.[0]?.url;

  return {
    id: dto.id,
    name: dto.brandName,
    genericName: dto.genericName,

    dosageForm: dto.dosageForm,
    packSize: dto.packSize,
    packUnit: dto.packUnit,

    minPrice: Number(dto.minPrice),
    maxPrice: Number(dto.maxPrice),

    requiresPrescription: dto.requiresPrescription,

    categoryId: dto.category.id,
    categoryName: dto.category.name,

    imageUrl:
      typeof firstImage === "string" && firstImage.trim() !== ""
        ? firstImage
        : "/patient/Pain Relief-X.png",
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

export async function getMedicines(filters: MedicineFilters = {}) {
  const params = new URLSearchParams();

  if (filters.page) params.append("page", String(filters.page));
  if (filters.limit) params.append("limit", String(filters.limit));
  if (filters.q) params.append("q", filters.q);
  if (filters.categoryId)
    params.append("categoryId", String(filters.categoryId));
  if (filters.requiresPrescription !== undefined)
    params.append("requiresPrescription", String(filters.requiresPrescription));
  if (filters.onlyAvailable !== undefined)
    params.append("onlyAvailable", String(filters.onlyAvailable));
  if (filters.minPrice) params.append("minPrice", String(filters.minPrice));
  if (filters.maxPrice) params.append("maxPrice", String(filters.maxPrice));

  const response = await httpGet<PaginatedMedicinesResponse>(
    `/medicines?${params.toString()}`,
  );

  return response.data.map(mapMedicine);
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
