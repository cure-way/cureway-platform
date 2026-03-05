import { PaginationMeta } from "./common";

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
  manufacturer: string;
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

//////////////////////////////////////////////////
export interface PharmacyStockDTO {
  pharmacyId: number;
  pharmacyName: string;
  cityId: number;
  cityName: string;
  address: {
    addressLine: string;
    latitude: number;
    longitude: number;
  };
  distanceKm: number;
  eta: number | null;
  sellPrice: number;
  stockQuantity: number;
  deliveryFee: number | null;
  coverImageUrl: string | null;
  profileImageUrl: string | null;
  isOpenNow: boolean;
}
export interface PaginatedPharmacyStockResponse {
  success: boolean;
  data: PharmacyStockDTO[];
  meta: PaginationMeta;
}

export type StockAvailability = "in_stock" | "low_stock" | "out_of_stock";

export interface PharmacyStock {
  pharmacyId: number;
  pharmacyName: string;

  cityName: string;
  addressLine: string;

  distanceKm: number;

  price: number;
  stockQuantity: number;

  availability: StockAvailability;

  deliveryFee: number | null;
  isOpenNow: boolean;

  imageUrl?: string | null;
}
export interface PharmacyStockFilters {
  page?: number;
  limit?: number;
}
