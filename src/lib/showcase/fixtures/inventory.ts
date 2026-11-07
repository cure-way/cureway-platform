/**
 * Pharmacy inventory fixtures — `InventoryListItem` / `InventoryDetailsDTO`
 * from `@/types/pharmacyTypes`.
 *
 * Inventory IDs start at 401 so they clear the `inventoryId >= 10` guard in
 * `src/services/orders.service.ts`. Stock statuses are mixed so the
 * critical-stock and low-stock panels on the pharmacy home have content.
 */

import type {
  InventoryDetailsDTO,
  InventoryListItem,
  StockStatus,
} from "@/types/pharmacyTypes";

import { MEDICINES } from "./catalog";
import { daysAgo, inventoryIdFor, monthsAhead } from "./common";

export { inventoryIdFor };

function stockStatus(qty: number, minStock: number): StockStatus {
  if (qty <= 0) return "OUT_OF_STOCK";
  if (qty <= minStock) return "LOW_STOCK";
  return "IN_STOCK";
}

/** Quantity per medicine, deliberately spread across all three statuses. */
const STOCK_PLAN: Record<number, { qty: number; minStock: number }> = {
  31: { qty: 180, minStock: 40 },
  32: { qty: 96, minStock: 30 },
  33: { qty: 24, minStock: 25 },
  34: { qty: 61, minStock: 20 },
  35: { qty: 12, minStock: 20 },
  36: { qty: 0, minStock: 10 },
  37: { qty: 140, minStock: 30 },
  38: { qty: 58, minStock: 15 },
  39: { qty: 9, minStock: 10 },
  40: { qty: 31, minStock: 10 },
  41: { qty: 74, minStock: 25 },
  42: { qty: 0, minStock: 15 },
  43: { qty: 210, minStock: 50 },
  44: { qty: 88, minStock: 25 },
  45: { qty: 17, minStock: 20 },
  46: { qty: 120, minStock: 30 },
  47: { qty: 46, minStock: 20 },
  48: { qty: 7, minStock: 15 },
};



export function buildInventoryList(): InventoryListItem[] {
  return MEDICINES.map((m) => {
    const plan = STOCK_PLAN[m.id] ?? { qty: 50, minStock: 20 };
    const sellPrice =
      Math.round(((Number(m.minPrice) + Number(m.maxPrice)) / 2) * 100) / 100;

    return {
      id: inventoryIdFor(m.id),
      medicineId: m.id,
      medicineName: `${m.brandName} ${m.strengthValue}${m.strengthUnit}`,
      categoryName: m.category.name,
      packDisplayName: `${m.packSize} ${m.packUnit}`,
      requiresPrescription: m.requiresPrescription,
      stockQuantity: plan.qty,
      minStock: plan.minStock,
      sellPrice,
      stockStatus: stockStatus(plan.qty, plan.minStock),
      expiryDate: monthsAhead(6 + (m.id % 18)),
    };
  });
}

export function buildInventoryDetails(
  inventoryId: number,
): InventoryDetailsDTO | null {
  const item = buildInventoryList().find((i) => i.id === inventoryId);
  if (!item) return null;

  const m = MEDICINES.find((x) => x.id === item.medicineId)!;

  return {
    id: item.id,
    medicineId: m.id,
    pharmacyId: 202,
    stockQuantity: item.stockQuantity,
    minStock: item.minStock,
    sellPrice: item.sellPrice,
    costPrice: Math.round(item.sellPrice * 0.72 * 100) / 100,
    isAvailable: item.stockQuantity > 0,
    batchNumber: `B${m.id}-${monthsAhead(0).replace(/-/g, "").slice(2, 6)}`,
    expiryDate: item.expiryDate,
    shelfLocation: `Aisle ${1 + (m.id % 6)} · Shelf ${1 + (m.id % 4)}`,
    notes:
      item.stockQuantity === 0
        ? "Out of stock — reorder placed with the distributor."
        : null,
    createdAt: daysAgo(300 - (m.id % 90)),
    updatedAt: daysAgo(m.id % 14),
    medicine: {
      id: m.id,
      genericName: m.genericName,
      brandName: m.brandName,
      status: "APPROVED",
      isActive: true,
      minPrice: Number(m.minPrice),
      maxPrice: Number(m.maxPrice),
      requiresPrescription: m.requiresPrescription,
      categoryId: m.category.id,
      manufacturer: m.manufacturer,
      dosageForm: m.dosageForm,
      dosageInstructions: m.requiresPrescription
        ? "Take exactly as prescribed by your doctor. Do not exceed the stated dose."
        : "Adults: one dose every 6–8 hours as needed, with water after food.",
      storageInstructions:
        "Store below 25°C in a dry place, away from direct sunlight and out of reach of children.",
      warnings: m.requiresPrescription
        ? "Prescription required. Tell your pharmacist about any other medication you take."
        : "Do not use for longer than 3 days without medical advice.",
      description: `${m.brandName} contains ${m.genericName} ${m.strengthValue}${m.strengthUnit}, supplied by ${m.manufacturer} in packs of ${m.packSize} ${m.packUnit}.`,
      packSize: m.packSize,
    },
    medicineImages: m.images.map((img, i) => ({
      imageUrl: img.url,
      sortOrder: i,
    })),
  };
}

/** Lightweight rows for the "add medicine" search box. */
export function buildMedicineSearchRows() {
  return MEDICINES.map((m) => ({
    id: m.id,
    medicineName: `${m.brandName} ${m.strengthValue}${m.strengthUnit}`,
    categoryName: m.category.name,
  }));
}
