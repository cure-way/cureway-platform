// ===================================================================
// CART SYSTEM — TYPE DEFINITIONS
// Single source of truth for all Cart & Checkout domain types.
// ===================================================================

// ── Status ────────────────────────────────────────────────────────
export type LoadingState = "idle" | "loading" | "success" | "error";
export type OrderStatus =
  | "pending"
  | "processing"
  | "on_the_way"
  | "delivered"
  | "cancelled";

// ── Pharmacy ──────────────────────────────────────────────────────
export interface Pharmacy {
  id: string;
  name: string;
  address?: string;
  distance?: string;
  deliveryTime?: string;
  isAvailable: boolean;
}

// ── Prescription ─────────────────────────────────────────────────
export interface PrescriptionInfo {
  dosage: string;
  form: string;
}

export interface PrescriptionFile {
  id: string;
  url: string;
  filename: string;
  uploadedAt: string;
}

// ── Cart Item ─────────────────────────────────────────────────────
export interface CartItem {
  id: string;
  medicineId: string;
  /**
   * Inventory item ID from the pharmacy's inventory.
   * This is the `inventoryId` sent to POST /order when placing an order.
   * Required for real API integration — maps to CreatePharmacyOrderItemDto.inventoryId.
   */
  inventoryId?: number;
  /**
   * Prescription ID if this item requires one and has been uploaded.
   * Maps to CreatePharmacyOrderItemDto.prescriptionId.
   */
  prescriptionId?: number;
  name: string;
  genericName?: string;
  image?: string;
  quantity: number;
  /** Unit price */
  price: number;
  requiresPrescription: boolean;
  prescriptionUploaded?: boolean;
  prescriptionInfo?: PrescriptionInfo;
  pharmacy: Pharmacy;
}

// ── Cart Group (items grouped by pharmacy) ────────────────────────
export interface CartGroup {
  pharmacy: Pharmacy;
  items: CartItem[];
  /** Computed: sum of price * quantity for all items in group */
  subtotal: number;
  prescriptionRequired?: boolean;
}

// ── Cart (root state) ─────────────────────────────────────────────
export interface Cart {
  groups: CartGroup[];
  totalItems: number;
  subtotal: number;
  savedForLater: CartItem[];
}

// ── Cart API Response ─────────────────────────────────────────────
export interface CartResponse {
  success: boolean;
  data: Cart;
}

// ── Component Props ───────────────────────────────────────────────
export interface CartItemProps {
  item: CartItem;
  onQuantityChange: (itemId: string, delta: number) => void;
  onRemove: (itemId: string) => void;
  onUploadPrescription?: (itemId: string) => void;
  highlightPrescription?: boolean;
}

export interface PharmacyGroupProps {
  group: CartGroup;
}

// ── Delivery ──────────────────────────────────────────────────────
export interface DeliveryOption {
  id: string;
  name: string;
  price: number;
  duration: string;
  icon: "standard" | "express";
  description?: string;
  estimatedDate?: Date;
}

export interface ScheduledDelivery {
  date: Date;
  timeSlot: { start: string; end: string };
  notes?: string;
}

export interface Coordinates {
  lat: number;
  lng: number;
}

export interface DeliveryAddress {
  id?: string;
  /**
   * Numeric API address ID (from /patient/addresses).
   * Required for the order payload (deliveryAddressId in CreateOrderDto).
   * Only present on addresses returned from / saved to the real API.
   */
  apiId?: number;
  /**
   * Numeric API city ID (cityId in CreatePatientAddressDto).
   * Required when creating/updating an address via the API.
   */
  apiCityId?: number;
  street: string;
  city: string;
  area?: string;
  building?: string;
  floor?: string;
  apartment?: string;
  notes?: string;
  coordinates?: Coordinates;
  /** Human-readable label, e.g. "Home", "Work" */
  label?: string;
  /** Whether this is the user's default address */
  isDefault?: boolean;
}

// ── Payment ───────────────────────────────────────────────────────
export interface PaymentMethod {
  id: string;
  name: string;
  description?: string;
  icon:"cash" | "credit";
  recommended?: boolean;
  fee?: number;
}

// ── Coupon ────────────────────────────────────────────────────────
export interface Coupon {
  code: string;
  discountType: "percentage" | "fixed";
  discountValue: number;
  minOrderValue?: number;
  maxDiscount?: number;
  expiresAt?: Date;
}

// ── Contact Information ───────────────────────────────────────────
export interface ContactInfo {
  name: string;
  email: string;
  phone: string;
  avatar?: string;
}

// ── Checkout Data (submitted to API) ─────────────────────────────
export interface CheckoutData {
  contact: ContactInfo;
  deliveryAddress: DeliveryAddress | null;
  useCurrentLocation: boolean;
  deliveryOption: DeliveryOption | null;
  scheduledDelivery?: ScheduledDelivery | null;
  paymentMethod: PaymentMethod | null;
  orderNotes?: string;
  couponCode?: string;
  discount: number;
  deliveryFee: number;
  total: number;
}

// ── Order Confirmation (returned by API after placing order) ──────
export interface OrderConfirmationItem {
  id: string;
  name: string;
  genericName?: string;
  image?: string;
  unitPrice: number;
  quantity: number;
  requiresPrescription: boolean;
  inStock: boolean;
}

export interface OrderConfirmationGroup {
  pharmacy: {
    id: string;
    name: string;
    address: string;
  };
  items: OrderConfirmationItem[];
  subtotal: number;
}

export interface OrderConfirmation {
  orderId: string;
  orderNumber: string;
  groups: OrderConfirmationGroup[];
  totalItems: number;
  subtotal: number;
  deliveryFee: number;
  discount: number;
  total: number;
  status: OrderStatus;
  placedAt: Date;
  estimatedDelivery?: string;
}

// ── Analytics (future use) ────────────────────────────────────────
export type CartAction =
  | "add_item"
  | "remove_item"
  | "update_quantity"
  | "upload_prescription"
  | "place_order";

export interface AnalyticsEvent {
  action: CartAction;
  category: "cart" | "checkout" | "order";
  value?: number;
  metadata?: Record<string, unknown>;
}
