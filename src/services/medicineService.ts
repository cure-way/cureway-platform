import { httpGet } from "@/lib/api";
import { ApiResponse } from "@/types";
import {
  Medicine,
  MedicineDTO,
  MedicineFilters,
  PaginatedMedicinesResponse,
  PaginatedPharmacyStockResponse,
  PharmacyStock,
  PharmacyStockDTO,
  PharmacyStockFilters,
  StockAvailability,
} from "@/types/medicine.types";

export function mapMedicine(dto: MedicineDTO): Medicine {
  const firstImage = dto.images?.[0]?.url;

  return {
    id: dto.id,
    name: dto.brandName,
    genericName: dto.genericName,
    manufacturer: dto.manufacturer,

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
export async function getMedicines(filters: MedicineFilters = {}): Promise<{
  data: Medicine[];
  totalPages: number;
}> {
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

  return {
    data: response.data.map(mapMedicine),
    totalPages: response.meta.totalPages,
  };
}
export async function fetchMedicineDetails(id: number): Promise<Medicine> {
  const response = await httpGet<ApiResponse<MedicineDTO>>(`/medicines/${id}`);

  return mapMedicine(response.data);
}
////////////////////////////////////////////////////////////////////

function deriveAvailability(stockQuantity: number): StockAvailability {
  if (stockQuantity <= 0) return "out_of_stock";
  if (stockQuantity <= 5) return "low_stock";
  return "in_stock";
}

export function mapPharmacyStockDTO(dto: PharmacyStockDTO): PharmacyStock {
  return {
    pharmacyId: dto.pharmacyId,
    pharmacyName: dto.pharmacyName,

    cityName: dto.cityName,
    addressLine: dto.address.addressLine,

    distanceKm: dto.distanceKm,

    price: dto.sellPrice,
    stockQuantity: dto.stockQuantity,

    availability: deriveAvailability(dto.stockQuantity),

    deliveryFee: dto.deliveryFee,
    isOpenNow: dto.isOpenNow,

    imageUrl: dto.profileImageUrl ?? dto.coverImageUrl ?? null,
  };
}
export async function fetchPharmaciesByMedicine(
  medicineId: number,
  filters?: PharmacyStockFilters,
): Promise<{
  data: PharmacyStock[];
  total: number;
  totalPages: number;
}> {
  const query = new URLSearchParams();

  if (filters?.page) query.append("page", String(filters.page));
  if (filters?.limit) query.append("limit", String(filters.limit));

  const response = await httpGet<PaginatedPharmacyStockResponse>(
    `/medicines/${medicineId}/pharmacies?${query.toString()}`,
  );

  return {
    data: response.data.map(mapPharmacyStockDTO),
    total: response.meta.total,
    totalPages: response.meta.totalPages,
  };
}

export async function fetchSimilarMedicines(
  categoryId: number,
  currentMedicineId: number,
  limit = 4,
): Promise<Medicine[]> {
  const response = await httpGet<PaginatedMedicinesResponse>(
    `/medicines?categoryId=${categoryId}&limit=${limit}`,
  );

  return response.data
    .map(mapMedicine)
    .filter((m) => m.id !== currentMedicineId)
    .slice(0, limit);
}
