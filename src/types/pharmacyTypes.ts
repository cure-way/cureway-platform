// Inventory types
export type InventoryStatus = "in" | "low" | "out";

export type StatusConfig = {
  label: string;
  className: string;
};

export interface InventoryItem {
  id: string;

  medicineName: string;
  brand: string;
  manufacturer: string;
  category: string;

  stock: number;
  minStock: number;
  status: InventoryStatus;

  batchNumber: string;
  expiryDate: string;
  prescriptionRequired: boolean;

  purchasePrice: number;
  sellingPrice: number;

  imageUrl?: string;
  notes?: string;

  medicineInstructions?: {
    dosage?: string;
    storage?: string;
    warnings?: string;
  };
}

export interface CreateInventoryInput {
  medicineId: string;
  stockQuantity: number;
  sellPrice: number;
  costPrice?: number;
  minStock?: number;
  batchNumber?: string;
  expiryDate?: string;
  shelfLocation?: string;
  notes?: string;
  imageUrl?: string;
}

export interface UpdateInventoryInput {
  stockQuantity?: number;
  sellPrice?: number;
  costPrice?: number | null;
  minStock?: number;
  batchNumber?: string | null;
  expiryDate?: string | null;
  shelfLocation?: string | null;
  notes?: string | null;
  imageUrl?: string;
}

//////////////////////////////////////////////////////////////////////
export type StockStatus = "IN_STOCK" | "LOW_STOCK" | "OUT_OF_STOCK";
export type InventoryFilterStatus = "all" | StockStatus;

export interface InventoryListItem {
  id: number;
  medicineId: number;

  medicineName: string;
  categoryName: string;
  packDisplayName: string;
  requiresPrescription: boolean;

  stockQuantity: number;
  minStock: number;
  sellPrice: number;
  stockStatus: StockStatus;
  expiryDate: string;
}
export interface InventoryDetailsDTO {
  id: number;
  medicineId: number;
  pharmacyId: number;
  stockQuantity: number;
  minStock: number;
  sellPrice: number;
  costPrice: number | null;
  isAvailable: boolean;
  batchNumber: string;
  expiryDate: string;
  shelfLocation: string | null;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
  medicine: {
    id: number;
    genericName: string;
    brandName: string;
    status: string;
    isActive: boolean;
    minPrice: number;
    maxPrice: number;
    requiresPrescription: boolean;
    categoryId: number;
    manufacturer: string;
    dosageForm: string;
    dosageInstructions: string;
    storageInstructions: string;
    warnings: string;
    description: string;
    packSize: number;
  };
  medicineImages?: {
    imageUrl: string;
    sortOrder: number;
  }[];
}

export interface CreateInventoryResponseDto {
  id: string;
  medicineId: string;
  stockQuantity: number;
  sellPrice: number;
  costPrice?: number | null;
  minStock?: number | null;
  batchNumber?: string | null;
  expiryDate?: string | null;
  shelfLocation?: string | null;
  notes?: string | null;
  imageUrl?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface MedicineFormValues {
  medicineId: string;
  stockQuantity: number;
  sellPrice: number;
  costPrice?: number;
  minStock?: number;
  batchNumber?: string;
  expiryDate?: string;
  shelfLocation?: string;
  notes: { value: string }[];
}

export interface GetInventoryParams {
  page: number;
  limit: number;
  q?: string;
  medicineId?: number;
  stockStatus?: "IN_STOCK" | "LOW_STOCK" | "OUT_OF_STOCK";
}
///////////////////////////////////////////////////////////////////////

export interface InventoryListResponse {
  success: boolean;
  data: InventoryListItem[];
  meta: {
    total: number;
    limit: number;
    page: number;
    totalPages: number;
  };
}

export interface InventoryDetailsResponse {
  success: boolean;
  data: InventoryDetailsDTO;
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  statusCode?: number;
  data: T;
}

////////////////////////////////////////////////////////
export interface Column<T> {
  key: keyof T | "action";
  header: string;
  hideOnMobile?: boolean;
}

export type ActionId = "view" | "mark_low" | "mark_out" | "delete";

export interface RowAction {
  id: ActionId;
  label: string;
  danger?: boolean;
}

export interface ActionItem<TActionId extends string> {
  id: TActionId;
  label: string;
  danger?: boolean;
  disabled?: boolean;
}

export interface SearchMedicine {
  id: number;
  medicineName: string;
  categoryName: string;
}

export interface Pharmacy {
  id: string;
  name: string;
  address: string;
  distance: string;
  distanceInKm: number;
  rating: number;
  reviewCount: number;
  deliveryFee: number;
  imageUrl?: string;
  isOpen: boolean;
  openingHours?: string;
}
