import { httpDelete, httpGet, httpPatch, httpPost } from "@/lib/api";
import {
  ApiResponse,
  CreateInventoryInput,
  CreateInventoryResponseDto,
  GetInventoryParams,
  InventoryDetailsDTO,
  InventoryDetailsResponse,
  InventoryListResponse,
  UpdateInventoryInput,
} from "@/types/pharmacyTypes";

export async function getInventory(
  params: GetInventoryParams,
): Promise<InventoryListResponse> {
  return httpGet<InventoryListResponse>("/inventory", {
    params,
  });
}

export async function getInventoryById(
  id: string,
): Promise<InventoryDetailsResponse> {
  return httpGet<InventoryDetailsResponse>(`/inventory/${id}`);
}

export async function deleteInventoryById(id: string): Promise<void> {
  await httpDelete<void>(`/inventory/${id}`);
}

export async function createInventoryItem(
  payload: CreateInventoryInput,
): Promise<ApiResponse<CreateInventoryResponseDto>> {
  return httpPost<
    ApiResponse<CreateInventoryResponseDto>,
    CreateInventoryInput
  >("/inventory", payload);
}

export async function updateInventoryItem(
  id: string,
  payload: UpdateInventoryInput,
): Promise<ApiResponse<InventoryDetailsDTO>> {
  return httpPatch<ApiResponse<InventoryDetailsDTO>, UpdateInventoryInput>(
    `/inventory/${id}`,
    payload,
  );
}
