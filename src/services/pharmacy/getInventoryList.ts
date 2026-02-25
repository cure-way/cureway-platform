import { mapInventoryListItem } from "@/adapters/InventoryMappers";
import {
  getInventory,
  GetInventoryParams,
} from "@/repositories/inventory.repository";

export async function fetchInventoryList(params: GetInventoryParams) {
  const response = await getInventory(params);

  if (!response.success) {
    throw new Error("Failed to fetch inventory");
  }

  return {
    items: response.data.map(mapInventoryListItem),
    total: response.meta.total,
    page: response.meta.page,
    limit: response.meta.limit,
  };
}
