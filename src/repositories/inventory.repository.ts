import { httpGet } from "@/lib/api";
import { InventoryListResponse } from "@/types/pharmacyTypes";

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
