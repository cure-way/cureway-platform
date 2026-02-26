import { httpDelete, httpGet, httpPost } from "@/lib/api";
import {
  ApiResponse,
  CreateInventoryResponseDto,
  InventoryDetailsResponse,
  InventoryListResponse,
} from "@/types/pharmacyTypes";

// -----------------------------------------------------------------------------
// Query Params for GET /inventory
// -----------------------------------------------------------------------------

export interface GetInventoryParams {
  page: number;
  limit: number;
  q?: string;
  medicineId?: number;
  stockStatus?: "IN_STOCK" | "LOW_STOCK" | "OUT_OF_STOCK";
}

// -----------------------------------------------------------------------------
// GET /inventory
// -----------------------------------------------------------------------------

export async function getInventory(
  params: GetInventoryParams,
): Promise<InventoryListResponse> {
  return httpGet<InventoryListResponse>("/inventory", {
    params,
  });
}

export async function getInventoryById(
  id: number,
): Promise<InventoryDetailsResponse> {
  return httpGet<InventoryDetailsResponse>(`/inventory/${id}`);
}

export async function deleteInventoryById(id: string): Promise<void> {
  await httpDelete<void>(`/inventory/${id}`);
}

export async function createInventoryItem(
  formData: FormData,
): Promise<ApiResponse<CreateInventoryResponseDto>> {
  return httpPost<ApiResponse<CreateInventoryResponseDto>, FormData>(
    "/inventory",
    formData,
  );
}
