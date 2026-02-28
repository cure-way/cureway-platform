export interface CategoryDTO {
  id: number;
  name: string;
  categoryImageUrl: string | null;
  description: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface PaginationMeta {
  total: number;
  limit: number;
  page: number;
  totalPages: number;
}

export interface PaginatedCategoriesResponse {
  success: boolean;
  data: CategoryDTO[];
  meta: PaginationMeta;
}

export interface Category {
  id: number;
  name: string;
  description: string | null;
  displayImage?: string;
}

////////////////////////////////////////////////////////

export interface MedicineDTO {
  id: number;
  genericName: string;
  brandName: string;
  manufacturer: string;
  dosageForm: string;
  strengthValue: string;
  strengthUnit: string;
  packSize: number;
  packUnit: string;
  minPrice: string;
  maxPrice: string;
  requiresPrescription: boolean;
  images: { url: string }[];
  category: {
    id: number;
    name: string;
  };
}

export interface PaginatedMedicinesResponse {
  success: boolean;
  data: MedicineDTO[];
  meta: {
    total: number;
    limit: number;
    page: number;
    totalPages: number;
  };
}

export interface MedicineFilters {
  page?: number;
  limit?: number;
  q?: string;
  categoryId?: number;
  requiresPrescription?: boolean;
  onlyAvailable?: boolean;
  minPrice?: number;
  maxPrice?: number;
}

export interface Medicine {
  id: number;
  name: string;
  genericName: string;

  dosageForm: string;
  packSize: number;
  packUnit: string;

  minPrice: number;
  maxPrice: number;

  requiresPrescription: boolean;

  categoryId: number;
  categoryName: string;

  imageUrl: string;
}
