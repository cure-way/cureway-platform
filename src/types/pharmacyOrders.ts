export type OrderStatus = "PENDING" | "DELIVERED" | "PAST";

export interface PharmacyOrderItemDTO {
  pharmacyOrderItemId: number;
  inventoryId: number;
  medicineId: number;
  medicineDisplayName: string;
}

export interface PharmacyOrderPatientDTO {
  patientId: number;
  patientName: string;
  profileImageUrl: string | null;
}

export interface PharmacyOrderDTO {
  pharmacyOrderId: number;
  orderId: number;
  status: OrderStatus;
  createdAt: string;
  totalAmount: number;
  currency: string;
  requirePrescription: boolean;
  deliveryId: unknown;
  patient: PharmacyOrderPatientDTO;
  items: PharmacyOrderItemDTO[];
}

export interface OrdersListResponseDTO {
  success: boolean;
  data: PharmacyOrderDTO[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export type OrderFilter = "ALL" | "NEW" | "DELIVERED" | "PAST";

export interface GetOrdersParams {
  page: number;
  limit: number;
  filter?: OrderFilter;
  sortOrder?: "asc" | "desc";
  q?: string;
}

export interface OrderItem {
  id: number;
  medicineId: number;
  medicineName: string;
}

export interface OrderPatient {
  id: number;
  name: string;
  profileImageUrl: string | null;
}

export interface Order {
  id: number;
  externalOrderId: number;

  status: OrderStatus;
  createdAt: Date;

  totalAmount: number;
  currency: string;

  requirePrescription: boolean;

  patient: OrderPatient;
  items: OrderItem[];
}

export interface OrderPreview {
  firstItemName: string;
  remainingCount: number;
}

export interface OrderRow {
  id: number;
  customerName: string;
  preview: OrderPreview;
  totalAmount: number;
  formattedDate: string;
  status: OrderStatus;
}

export interface TodayDashboardAnalytics {
  totalToday: number;
  deliveredToday: number;
  topMedicineName: string | null;
}

export interface SearchOrder {
  orderId: number;
  firstMedicineName: string;
  remainingItemsCount: number;
}
