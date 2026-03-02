import {
  mapInventoryDetailsToItem,
  mapInventoryListItem,
} from "@/adapters/InventoryMappers";
import { normalizeError } from "@/lib/api/errors";
import {
  createInventoryItem,
  deleteInventoryById,
  getInventory,
  getInventoryById,
  updateInventoryItem,
} from "@/repositories/inventory.repository";

import {
  CreateInventoryInput,
  GetInventoryParams,
  InventoryItem,
  SearchMedicine,
  UpdateInventoryInput,
} from "@/types/pharmacyTypes";

import axios from "axios";

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

export async function fetchInventoryItem(id: string) {
  const response = await getInventoryById(id);

  if (!response.success) {
    throw new Error("Failed to fetch inventory item");
  }

  return mapInventoryDetailsToItem(response.data);
}

export async function deleteInventory(id: string): Promise<void> {
  try {
    await deleteInventoryById(id);
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const backendMessage = error.response?.data?.message;

      throw new Error(
        backendMessage || "Unable to delete inventory item. Please try again.",
      );
    }

    throw new Error("Unexpected error occurred while deleting inventory item.");
  }
}

export async function createInventory(
  input: CreateInventoryInput,
): Promise<InventoryItem> {
  if (!input.medicineId) {
    throw new Error("Medicine is required");
  }

  if (input.stockQuantity < 0) {
    throw new Error("Stock quantity cannot be negative");
  }

  if (input.sellPrice <= 0) {
    throw new Error("Sell price must be greater than zero");
  }

  try {
    const response = await createInventoryItem(input);

    if (!response.success) {
      throw new Error(response.message || "Failed to create inventory item");
    }

    return fetchInventoryItem(response.data.id);
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const backendMessage =
        error.response?.data?.message ||
        error.response?.data?.error ||
        "Failed to create inventory item";

      throw new Error(
        Array.isArray(backendMessage)
          ? backendMessage.join(", ")
          : backendMessage,
      );
    }

    throw error;
  }
}

function removeUndefined<T extends object>(obj: T): Partial<T> {
  return Object.fromEntries(
    Object.entries(obj).filter(([, value]) => value !== undefined),
  ) as Partial<T>;
}

export async function updateInventoryItemService(
  id: string,
  input: UpdateInventoryInput,
): Promise<InventoryItem> {
  if (!id) {
    throw {
      status: 0,
      message: "Inventory ID is required",
    };
  }

  if (input.sellPrice !== undefined && input.sellPrice < 0) {
    throw {
      status: 0,
      message: "Sell price cannot be negative",
    };
  }

  if (input.stockQuantity !== undefined && input.stockQuantity < 0) {
    throw {
      status: 0,
      message: "Stock quantity cannot be negative",
    };
  }

  const cleanedPayload = removeUndefined(input);

  try {
    const response = await updateInventoryItem(id, cleanedPayload);
    return mapInventoryDetailsToItem(response.data);
  } catch (error) {
    throw normalizeError(error);
  }
}

export function getInventoryAlerts(
  items: InventoryItem[],
): { title: string; description: string } | null {
  const outOfStockCount = items.filter((item) => item.stock === 0).length;

  if (outOfStockCount === 0) return null;

  return {
    title: "Medication Out Of Stock Alert",
    description: `${outOfStockCount} medication${
      outOfStockCount > 1 ? "s are" : " is"
    } currently out of stock.`,
  };
}

export function getExpiryInfo(expiryDate: string) {
  const today = new Date();
  const expiry = new Date(expiryDate);

  today.setHours(0, 0, 0, 0);
  expiry.setHours(0, 0, 0, 0);

  const diffMs = expiry.getTime() - today.getTime();
  const daysLeft = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

  if (daysLeft < 0) {
    return {
      status: "expired" as const,
      daysLeft,
      label: `Expired ${Math.abs(daysLeft) === 1 ? "yesterday" : `${Math.abs(daysLeft)} days ago`}`,
    };
  }

  if (daysLeft <= 30) {
    return {
      status: "warning" as const,
      daysLeft,
      label: `${Math.ceil(daysLeft) === 1 ? "1 day" : `${Math.ceil(daysLeft)} days`} left to expiry`,
    };
  }

  return {
    status: "safe" as const,
    daysLeft,
    label: "Not expiring soon",
  };
}

export async function getInventorySnapshot(): Promise<InventoryItem[]> {
  const res = await fetchInventoryList({
    page: 1,
    limit: 3,
  });

  return res.items;
}

export async function getCriticalStockItems(): Promise<InventoryItem[]> {
  const res = await fetchInventoryList({
    page: 1,
    limit: 2,
    stockStatus: "LOW_STOCK",
  });

  return res.items
    .filter((item) => item.status === "low" || item.status === "out")
    .slice(0, 2);
}

export async function searchInventory(
  query: string,
): Promise<SearchMedicine[]> {
  if (!query.trim()) return [];

  const res = await getInventory({
    page: 1,
    limit: 5,
    q: query,
  });

  return res.data.map((item) => ({
    id: item.id,
    medicineName: item.medicineName,
    categoryName: item.categoryName,
  }));
}
