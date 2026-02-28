// =============================================================================
// API SERVICE — Real API integrations for Cart/Orders/Checkout/Prescriptions
//
// This file contains ONLY real API calls. Mock data is isolated in:
//   - services/cart.service.ts  (cart CRUD — no real endpoint exists)
//   - services/orders.service.ts (orders list — now delegates here)
//
// Architecture:
//   - All requests go through the shared `http` Axios instance in lib/api/http.ts
//   - Authentication (Bearer token) is injected automatically by the interceptor
//   - Token refresh on 401 is handled transparently by the interceptor
//   - Errors are normalized via normalizeError() from lib/api/errors.ts
// =============================================================================

import { http } from "@/lib/api/http";
import { normalizeError } from "@/lib/api/errors";
import { API_ENDPOINTS } from "@/constants/cart.constants";
import type {
  ApiPaginatedResponse,
  ApiSuccessResponse,
  FileUploadPurpose,
  FileUploadResponse,
  PatientAddressResponse,
  CreatePatientAddressDto,
  UpdatePatientAddressDto,
  CreatePrescriptionDto,
  PrescriptionResponseDto,
  ReuploadPrescriptionDto,
  CreateOrderDto,
  CreateOrderResponseDto,
  PatientOrderListItemDto,
  PatientOrderDetailsResponseDto,
  PatientCancelOrderResponseDto,
  ApiOrderStatus,
  // Pharmacy Orders
  PharmacyOrderListItemDto,
  PharmacyOrderDetailDto,
  PharmacyOrderDecisionDto,
  PharmacyOrderStatusUpdateDto,
} from "@/types/api.types";

// ─────────────────────────────────────────────────────────────────────────────
// Helper: unwrap standard { success, data } wrapper
// ─────────────────────────────────────────────────────────────────────────────
function unwrap<T>(response: ApiSuccessResponse<T>): T {
  return response.data;
}

// ─────────────────────────────────────────────────────────────────────────────
// File Upload Service — POST /file/upload
// ─────────────────────────────────────────────────────────────────────────────

export const fileUploadService = {
  async uploadFile(
    file: File,
    purpose: FileUploadPurpose = "prescription",
  ): Promise<string> {
    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await http.post<ApiSuccessResponse<FileUploadResponse>>(
        `${API_ENDPOINTS.FILE.UPLOAD}?purpose=${purpose}`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } },
      );

      return unwrap(response.data).url;
    } catch (err) {
      throw normalizeError(err);
    }
  },

  async uploadFiles(
    files: File[],
    purpose: FileUploadPurpose = "prescription",
    onProgress?: (percent: number) => void,
  ): Promise<string[]> {
    const urls: string[] = [];
    for (let i = 0; i < files.length; i++) {
      const url = await fileUploadService.uploadFile(files[i], purpose);
      urls.push(url);
      onProgress?.(Math.round(((i + 1) / files.length) * 100));
    }
    return urls;
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// Address Service — /patient/addresses
// ─────────────────────────────────────────────────────────────────────────────

export const patientAddressService = {
  async getAddresses(page = 1, limit = 100): Promise<PatientAddressResponse[]> {
    try {
      const response = await http.get<
        ApiPaginatedResponse<PatientAddressResponse>
      >(API_ENDPOINTS.ADDRESSES.LIST, { params: { page, limit } });
      return response.data.data;
    } catch (err) {
      throw normalizeError(err);
    }
  },

  async getAddressById(id: number): Promise<PatientAddressResponse> {
    try {
      const response = await http.get<ApiSuccessResponse<PatientAddressResponse>>(
        API_ENDPOINTS.ADDRESSES.GET_BY_ID(id),
      );
      return unwrap(response.data);
    } catch (err) {
      throw normalizeError(err);
    }
  },

  async createAddress(dto: CreatePatientAddressDto): Promise<PatientAddressResponse> {
    try {
      const response = await http.post<ApiSuccessResponse<PatientAddressResponse>>(
        API_ENDPOINTS.ADDRESSES.CREATE,
        dto,
      );
      return unwrap(response.data);
    } catch (err) {
      throw normalizeError(err);
    }
  },

  async updateAddress(id: number, dto: UpdatePatientAddressDto): Promise<PatientAddressResponse> {
    try {
      const response = await http.patch<ApiSuccessResponse<PatientAddressResponse>>(
        API_ENDPOINTS.ADDRESSES.UPDATE(id),
        dto,
      );
      return unwrap(response.data);
    } catch (err) {
      throw normalizeError(err);
    }
  },

  async deleteAddress(id: number): Promise<void> {
    try {
      await http.delete(API_ENDPOINTS.ADDRESSES.DELETE(id));
    } catch (err) {
      throw normalizeError(err);
    }
  },

  async setDefaultAddress(id: number): Promise<void> {
    try {
      await http.patch(API_ENDPOINTS.ADDRESSES.SET_DEFAULT(id));
    } catch (err) {
      throw normalizeError(err);
    }
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// Prescription Service — /prescriptions
// ─────────────────────────────────────────────────────────────────────────────

export const prescriptionApiService = {
  async createPrescription(dto: CreatePrescriptionDto): Promise<PrescriptionResponseDto> {
    try {
      const response = await http.post<ApiSuccessResponse<PrescriptionResponseDto>>(
        API_ENDPOINTS.PRESCRIPTION.CREATE,
        dto,
      );
      return unwrap(response.data);
    } catch (err) {
      throw normalizeError(err);
    }
  },

  async getMyPrescription(id: number): Promise<PrescriptionResponseDto> {
    try {
      const response = await http.get<ApiSuccessResponse<PrescriptionResponseDto>>(
        API_ENDPOINTS.PRESCRIPTION.GET_MY(id),
      );
      return unwrap(response.data);
    } catch (err) {
      throw normalizeError(err);
    }
  },

  async reuploadPrescription(id: number, dto: ReuploadPrescriptionDto): Promise<PrescriptionResponseDto> {
    try {
      const response = await http.patch<ApiSuccessResponse<PrescriptionResponseDto>>(
        API_ENDPOINTS.PRESCRIPTION.REUPLOAD(id),
        dto,
      );
      return unwrap(response.data);
    } catch (err) {
      throw normalizeError(err);
    }
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// Patient Orders API Service — /order
// ─────────────────────────────────────────────────────────────────────────────

export interface GetMyOrdersParams {
  page?: number;
  limit?: number;
  filter?: "ALL" | "ACTIVE" | "DELIVERED" | "CANCELLED";
  sortOrder?: "asc" | "desc";
  orderId?: number;
  pharmacyId?: number;
  pharmacyName?: string;
}

export const ordersApiService = {
  async createOrder(dto: CreateOrderDto): Promise<CreateOrderResponseDto> {
    try {
      const response = await http.post<ApiSuccessResponse<CreateOrderResponseDto>>(
        API_ENDPOINTS.ORDERS.CREATE,
        dto,
      );
      return unwrap(response.data);
    } catch (err) {
      throw normalizeError(err);
    }
  },

  async getMyOrders(params: GetMyOrdersParams = {}): Promise<{
    data: PatientOrderListItemDto[];
    meta: { total: number; limit: number; page: number; totalPages: number };
  }> {
    try {
      const response = await http.get<
        ApiPaginatedResponse<PatientOrderListItemDto>
      >(API_ENDPOINTS.ORDERS.GET_MY, { params });
      return { data: response.data.data, meta: response.data.meta };
    } catch (err) {
      throw normalizeError(err);
    }
  },

  async getOrderById(id: number): Promise<PatientOrderDetailsResponseDto> {
    try {
      const response = await http.get<ApiSuccessResponse<PatientOrderDetailsResponseDto>>(
        API_ENDPOINTS.ORDERS.GET_BY_ID(id),
      );
      return unwrap(response.data);
    } catch (err) {
      throw normalizeError(err);
    }
  },

  async cancelOrder(id: number): Promise<PatientCancelOrderResponseDto> {
    try {
      const response = await http.patch<ApiSuccessResponse<PatientCancelOrderResponseDto>>(
        API_ENDPOINTS.ORDERS.CANCEL(id),
      );
      return unwrap(response.data);
    } catch (err) {
      throw normalizeError(err);
    }
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// Pharmacy Orders API Service — /pharmacy-orders
// Used by the pharmacy dashboard (not the patient side).
//
//   GET  /pharmacy-orders           → list pharmacy's incoming orders
//   GET  /pharmacy-orders/{id}      → full order detail
//   PATCH /pharmacy-orders/{id}/decision → accept or reject
//   PATCH /pharmacy-orders/{id}/status   → set PREPARING or READY_FOR_PICKUP
// ─────────────────────────────────────────────────────────────────────────────

export interface GetPharmacyOrdersParams {
  page?: number;
  limit?: number;
  status?: string;
  sortOrder?: "asc" | "desc";
}

export const pharmacyOrdersApiService = {
  /**
   * GET /pharmacy-orders — paginated list of the pharmacy's orders.
   */
  async getOrders(params: GetPharmacyOrdersParams = {}): Promise<{
    data: PharmacyOrderListItemDto[];
    meta: { total: number; limit: number; page: number; totalPages: number };
  }> {
    try {
      const response = await http.get<
        ApiPaginatedResponse<PharmacyOrderListItemDto>
      >(API_ENDPOINTS.PHARMACY_ORDERS.LIST, { params });
      return { data: response.data.data, meta: response.data.meta };
    } catch (err) {
      throw normalizeError(err);
    }
  },

  /**
   * GET /pharmacy-orders/{id} — full pharmacy order detail including items.
   */
  async getOrderById(id: number): Promise<PharmacyOrderDetailDto> {
    try {
      const response = await http.get<ApiSuccessResponse<PharmacyOrderDetailDto>>(
        API_ENDPOINTS.PHARMACY_ORDERS.GET_BY_ID(id),
      );
      return unwrap(response.data);
    } catch (err) {
      throw normalizeError(err);
    }
  },

  /**
   * PATCH /pharmacy-orders/{id}/decision — accept or reject an order.
   */
  async updateDecision(
    id: number,
    dto: PharmacyOrderDecisionDto,
  ): Promise<PharmacyOrderDetailDto> {
    try {
      const response = await http.patch<ApiSuccessResponse<PharmacyOrderDetailDto>>(
        API_ENDPOINTS.PHARMACY_ORDERS.DECISION(id),
        dto,
      );
      return unwrap(response.data);
    } catch (err) {
      throw normalizeError(err);
    }
  },

  /**
   * PATCH /pharmacy-orders/{id}/status — update preparation progress.
   * Valid values: "PREPARING" | "READY_FOR_PICKUP"
   */
  async updateStatus(
    id: number,
    dto: PharmacyOrderStatusUpdateDto,
  ): Promise<PharmacyOrderDetailDto> {
    try {
      const response = await http.patch<ApiSuccessResponse<PharmacyOrderDetailDto>>(
        API_ENDPOINTS.PHARMACY_ORDERS.STATUS(id),
        dto,
      );
      return unwrap(response.data);
    } catch (err) {
      throw normalizeError(err);
    }
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// Status mapping helpers
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Map API order status (uppercase enum) to UI order status (lowercase).
 * Unmapped statuses default to "processing".
 */
export function mapApiOrderStatus(
  apiStatus: ApiOrderStatus | string,
): "processing" | "on_the_way" | "delivered" | "cancelled" {
  switch (apiStatus) {
    case "PENDING":
    case "PROCESSING":
      return "processing";
    case "ON_THE_WAY":
      return "on_the_way";
    case "DELIVERED":
      return "delivered";
    case "CANCELLED":
    case "PARTIALLY_CANCELLED":
      return "cancelled";
    default:
      return "processing";
  }
}

/**
 * Map pharmacy order status to a display-friendly UI label.
 */
export function mapPharmacyOrderStatus(status: string): string {
  const map: Record<string, string> = {
    PENDING:          "Pending",
    ACCEPTED:         "Accepted",
    REJECTED:         "Rejected",
    PREPARING:        "Preparing",
    READY_FOR_PICKUP: "Ready for Pickup",
    OUT_FOR_DELIVERY: "Out for Delivery",
    DELIVERED:        "Delivered",
    CANCELLED:        "Cancelled",
  };
  return map[status] ?? status;
}
