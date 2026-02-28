// =============================================================================
// ORDER TYPES — UI domain types for the patient orders feature.
//
// These are the types consumed by components/stores (not raw API types).
// Raw API types live in types/api.types.ts.
// The adapter in services/orders.service.ts maps API → these types.
// =============================================================================

/** UI-level order status (lowercase, hyphenated) */
export type OrderStatus =
  | "processing"
  | "on_the_way"
  | "delivered"
  | "cancelled";

/** A single order item (from detailed order view) */
export interface OrderItem {
  id: string;
  name: string;
  genericName?: string;
  image?: string;
  quantity: number;
  unitPrice: number;
}

/**
 * Per-pharmacy group stored when an order is placed.
 * Used by the confirmation page to show a separate row for each pharmacy.
 * Populated from OrderConfirmation.groups after checkout succeeds.
 */
export interface OrderPharmacyGroup {
  pharmacyId: string;
  pharmacyName: string;
  pharmacyAddress: string;
  subtotal: number;
  items: OrderItem[];
}

/** A patient order as displayed in the UI */
export interface Order {
  id: string;
  pharmacyName: string;
  pharmacyId: string;
  address: string;
  itemsCount: number;
  total: number;
  deliveryFee: number;
  discount: number;
  currency?: string;
  orderedAtISO: string;
  estimatedDelivery?: string;
  status: OrderStatus;
  /** Populated only when getOrderById is called */
  items?: OrderItem[];
  paymentMethod?: string;
  deliveryAddress?: string;
  /**
   * Per-pharmacy breakdown — populated immediately after checkout so
   * the confirmation page can show one row per pharmacy without
   * needing another API call.
   */
  pharmacyGroups?: OrderPharmacyGroup[];
}

export interface Notification {
  id: string;
  type: "order" | "ready" | "prescription" | "system" | "stock";
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
  orderId?: string;
}

export interface PrescriptionRequest {
  patientId: string;
  pharmacyId: string;
  notes?: string;
  files?: File[];
}
