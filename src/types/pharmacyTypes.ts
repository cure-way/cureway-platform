import { DAY_ORDER } from "@/utils/pharmacyConstants";

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
  notes: string[] | null;
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
}
///////////////////////////////////////////////////////////////////////
export type InventoryStatus = "in" | "low" | "out";

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
  usageNotes?: string[];
}

// ---------------------------
// responses
// ---------------------------

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
export interface OrderItem {
  inventoryId: string;
  quantity: number;
  unitPrice: number;
}
export interface OrderRow {
  id: string;
  customer: string;
  items: OrderItem[];
  total: number;
  date: string;
  status: "Delivered" | "Pending" | "New" | "Cancelled";
}

export interface MedicineFormValues {
  medicineName: string;
  category: string;
  stock: number;
  expiryDate: string;
  status: InventoryStatus;
  usageNotes: { value: string }[];
  imageUrl?: File | null;
}
export interface MedicineFormPayload {
  medicineName: string;
  category: string;
  stock: number;
  expiryDate: string;
  status: InventoryStatus;
  usageNotes: string[];
  imageUrl?: File | null;
}

export interface OrderStatusDatum {
  name: "Delivered" | "Pending";
  value: number;
}

export interface WeeklyOrdersDatum {
  day: "Mon" | "Tue" | "Wed" | "Thu" | "Fri" | "Sat" | "Sun";
  orders: number;
}

export type Day = (typeof DAY_ORDER)[number];

export interface TopMedicine {
  id: string;
  medicine: string;
  sold: number;
  orders: number;
}

export interface OrdersStatusModel {
  completedPercent: number;
  pendingPercent: number;
  outerData: { name: string; value: number }[];
  innerData: { name: string; value: number }[];
}
export interface MatchedOrder {
  order: OrderRow;
  matchedItems: InventoryItem[];
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

export type StatusConfig = {
  label: string;
  className: string;
};
