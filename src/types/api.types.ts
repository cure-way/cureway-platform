// =============================================================================
// API TYPES — Matches the CureWay OpenAPI specification exactly.
// All types in this file are derived from the API spec (docs-json.json).
// Do NOT modify these to fit UI convenience — adapt in the service layer.
// =============================================================================

// ─────────────────────────────────────────────────────────────────────────────
// Shared / Generic
// ─────────────────────────────────────────────────────────────────────────────

export interface ApiSuccessResponse<T> {
  success: true;
  data: T;
}

export interface ApiPaginatedResponse<T> {
  success: true;
  data: T[];
  meta: {
    total: number;
    limit: number;
    page: number;
    totalPages: number;
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// File Upload — POST /file/upload
// ─────────────────────────────────────────────────────────────────────────────

export type FileUploadPurpose =
  | "prescription"
  | "profile"
  | "pharmacy"
  | "medicine";

export interface FileUploadResponse {
  url: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// Patient Addresses — /patient/addresses
// ─────────────────────────────────────────────────────────────────────────────

export interface PatientAddressResponse {
  id: number;
  cityId: number;
  cityName?: string;
  addressLine1: string;
  addressLine2?: string | null;
  label?: string | null;
  region?: string | null;
  area?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  isDefault: boolean;
}

export interface CreatePatientAddressDto {
  cityId: number;
  addressLine1: string;
  isDefault?: boolean;
  addressLine2?: string | null;
  label?: string | null;
  region?: string | null;
  area?: string | null;
  latitude?: number | null;
  longitude?: number | null;
}

export interface UpdatePatientAddressDto {
  cityId?: number;
  addressLine1?: string;
  addressLine2?: string | null;
  label?: string | null;
  region?: string | null;
  area?: string | null;
  latitude?: number | null;
  longitude?: number | null;
}

// ─────────────────────────────────────────────────────────────────────────────
// Prescriptions — /prescriptions
// ─────────────────────────────────────────────────────────────────────────────

export interface PrescriptionFileResponseDto {
  id: number;
  url: string;
  sortOrder: number;
}

export interface PrescriptionResponseDto {
  id: number;
  status: "UNDER_REVIEW" | "APPROVED" | "REJECTED" | "REUPLOAD_REQUESTED";
  reuploadReason?: string | null;
  reuploadRequestedAt?: string | null;
  createdAt: string;
  updatedAt: string;
  isActive: boolean;
  files: PrescriptionFileResponseDto[];
}

export interface CreatePrescriptionDto {
  pharmacyId: number;
  fileUrls: string[];
}

export interface ReuploadPrescriptionDto {
  fileUrls: string[];
}

// ─────────────────────────────────────────────────────────────────────────────
// Orders — /order  /order/my  /order/my/{id}
// ─────────────────────────────────────────────────────────────────────────────

export interface CreatePharmacyOrderItemDto {
  inventoryId: number;
  quantity: number;
  prescriptionId?: number;
}

export interface CreatePharmacyOrderDto {
  pharmacyId: number;
  items: CreatePharmacyOrderItemDto[];
}

export interface CreateOrderDto {
  deliveryAddressId: number;
  notes?: string;
  currency?: string;
  pharmacies: CreatePharmacyOrderDto[];
}

// Response types
export interface PharmacyLocationDto {
  address?: string | null;
  latitude?: number | null;
  longitude?: number | null;
}

export interface CreatePharmacyOrderItemResponseDto {
  inventoryId: number;
  medicineId: number;
  medicineName: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface CreatePharmacyOrderResponseDto {
  pharmacyOrderId: number;
  pharmacyId: number;
  pharmacyName: string;
  status: string;
  pharmacyLocation: PharmacyLocationDto;
  subtotal: number;
  requiresPrescription: boolean;
  prescriptionId?: number | null;
  prescriptionStatus?: string;
  items: CreatePharmacyOrderItemResponseDto[];
}

export interface OrderDeliveryAddressSnapshotDto {
  addressText: string;
  lng?: number | null;
  lat?: number | null;
}

export interface CreateOrderResponseDto {
  id: number;
  contactName: string;
  contactPhone: string;
  contactEmail: string;
  status: string;
  notes?: string | null;
  currency: string;
  createdAt: string;
  deliveryAddress?: OrderDeliveryAddressSnapshotDto;
  subtotal: number;
  deliveryFee: number;
  discount: number;
  total: number;
  itemsCount: number;
  pharmacies: CreatePharmacyOrderResponseDto[];
}

// List item for GET /order/my
export interface PatientOrderListItemDto {
  id: number;
  status: ApiOrderStatus;
  createdAt: string;
  updatedAt: string;
  subAmount: number;
  deliveryFee: number;
  totalAmount: number;
  currency: string;
  deliveryAddress?: OrderDeliveryAddressSnapshotDto;
  pharmacyOrders?: PatientPharmacyOrderSummaryDto[];
}

export interface PatientPharmacyOrderSummaryDto {
  pharmacyOrderId: number;
  pharmacyId: number;
  pharmacyName: string;
  status: string;
  subtotal: number;
  requiresPrescription: boolean;
  prescriptionId?: number | null;
  prescriptionStatus?: string;
  itemsCount?: number;
}

// Detailed order for GET /order/my/{id}
export interface PatientPharmacyOrderDetailsResponseDto {
  pharmacyOrderId: number;
  pharmacyId: number;
  pharmacyName: string;
  status: string;
  pharmacyLocation: PharmacyLocationDto;
  subtotal: number;
  requiresPrescription: boolean;
  prescriptionId?: number | null;
  prescriptionStatus?: string;
  items: CreatePharmacyOrderItemResponseDto[];
  rejectedAt?: string | null;
  rejectionReason?: string | null;
}

export interface PatientOrderDetailsResponseDto {
  id: number;
  status: ApiOrderStatus;
  createdAt: string;
  updatedAt: string;
  subAmount: number;
  deliveryFee: number;
  totalAmount: number;
  currency: string;
  deliveryAddress?: {
    addressText: string;
    lat?: number;
    lng?: number;
  };
  pharmacyOrders: PatientPharmacyOrderDetailsResponseDto[];
  delivery?: {
    id: number;
    status: string;
    driver?: {
      id: number;
      name: string;
      phoneNumber: string;
    };
    acceptedAt?: string;
    deliveredAt?: string;
  } | null;
}

export interface PatientCancelOrderResponseDto {
  id: number;
  status: "CANCELLED";
}

// API-level order statuses (backend enum)
export type ApiOrderStatus =
  | "PENDING"
  | "PROCESSING"
  | "ON_THE_WAY"
  | "DELIVERED"
  | "CANCELLED"
  | "PARTIALLY_CANCELLED";

// ─────────────────────────────────────────────────────────────────────────────
// Pharmacy Orders — /pharmacy-orders
// Endpoints used by the pharmacy dashboard to manage incoming orders.
// ─────────────────────────────────────────────────────────────────────────────

/** All possible statuses a pharmacy-order can have */
export type PharmacyOrderStatus =
  | "PENDING"
  | "ACCEPTED"
  | "REJECTED"
  | "PREPARING"
  | "READY_FOR_PICKUP"
  | "OUT_FOR_DELIVERY"
  | "DELIVERED"
  | "CANCELLED";

export interface PharmacyOrderItemDto {
  id: number;
  inventoryId: number;
  medicineName: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface PharmacyOrderCustomerDto {
  id: number;
  name: string;
  phone?: string | null;
  email?: string | null;
}

/** Single row returned by GET /pharmacy-orders */
export interface PharmacyOrderListItemDto {
  id: number;
  orderId: number;
  status: PharmacyOrderStatus;
  createdAt: string;
  updatedAt: string;
  subtotal: number;
  requiresPrescription: boolean;
  prescriptionId?: number | null;
  prescriptionStatus?: string | null;
  itemsCount: number;
  customer?: PharmacyOrderCustomerDto | null;
  deliveryAddress?: {
    addressText: string;
    lat?: number | null;
    lng?: number | null;
  } | null;
}

/** Full detail returned by GET /pharmacy-orders/{id} */
export interface PharmacyOrderDetailDto extends PharmacyOrderListItemDto {
  items: PharmacyOrderItemDto[];
  rejectedAt?: string | null;
  rejectionReason?: string | null;
}

/** Body for PATCH /pharmacy-orders/{id}/decision */
export interface PharmacyOrderDecisionDto {
  decision: "ACCEPTED" | "REJECTED";
  rejectionReason?: string;
}

/** Body for PATCH /pharmacy-orders/{id}/status */
export interface PharmacyOrderStatusUpdateDto {
  status: "PREPARING" | "READY_FOR_PICKUP";
}
