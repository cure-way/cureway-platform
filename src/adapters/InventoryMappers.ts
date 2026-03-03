import {
  InventoryDetailsDTO,
  InventoryItem,
  InventoryListItem,
  InventoryStatus,
  StockStatus,
} from "@/types/pharmacyTypes";

export function mapInventoryDetailsToItem(
  dto: InventoryDetailsDTO,
): InventoryItem {
  const primaryImage =
    dto.medicineImages?.slice().sort((a, b) => a.sortOrder - b.sortOrder)[0]
      ?.imageUrl ?? undefined;

  return {
    id: String(dto.id),

    medicineName: dto.medicine.genericName,
    brand: dto.medicine.brandName,
    manufacturer: dto.medicine.manufacturer,
    category: String(dto.medicine.categoryId),

    stock: dto.stockQuantity,
    minStock: dto.minStock,

    status:
      dto.stockQuantity === 0
        ? "out"
        : dto.stockQuantity <= dto.minStock
          ? "low"
          : "in",

    batchNumber: dto.batchNumber,
    expiryDate: dto.expiryDate,
    prescriptionRequired: dto.medicine.requiresPrescription,

    purchasePrice: dto.costPrice ?? 0,
    sellingPrice: dto.sellPrice,

    imageUrl: primaryImage,
    notes: dto.notes ?? undefined,

    medicineInstructions: {
      dosage: dto.medicine.dosageInstructions ?? undefined,
      storage: dto.medicine.storageInstructions ?? undefined,
      warnings: dto.medicine.warnings ?? undefined,
    },
  };
}

export function mapInventoryListItem(dto: InventoryListItem): InventoryItem {
  return {
    id: String(dto.id),
    medicineName: dto.medicineName,
    brand: dto.packDisplayName,
    manufacturer: "",
    category: dto.categoryName,
    stock: dto.stockQuantity,
    minStock: dto.minStock,
    status: mapStockStatus(dto.stockStatus),
    batchNumber: "",
    expiryDate: dto.expiryDate,
    prescriptionRequired: dto.requiresPrescription,
    purchasePrice: 0,
    sellingPrice: dto.sellPrice,
  };
}

function mapStockStatus(status: StockStatus): InventoryStatus {
  switch (status) {
    case "IN_STOCK":
      return "in";
    case "LOW_STOCK":
      return "low";
    case "OUT_OF_STOCK":
      return "out";
  }
}
