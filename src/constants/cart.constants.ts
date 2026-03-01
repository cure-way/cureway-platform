// ===================================================================
// CART SYSTEM — CONSTANTS
// All magic values in one place. Never hardcode strings/numbers
// in components — import from here.
// ===================================================================

export const API_ENDPOINTS = {
  // ── Cart (NO real API endpoint — stays mock) ──────────────────────────────
  // Cart state is managed locally and submitted as POST /order at checkout.
  CART: {
    GET: "/api/cart", // MOCK only
    ADD_ITEM: "/api/cart/items", // MOCK only
    UPDATE_ITEM: (id: string) => `/api/cart/items/${id}`, // MOCK only
    REMOVE_ITEM: (id: string) => `/api/cart/items/${id}`, // MOCK only
    REMOVE_PHARMACY: (id: string) => `/api/cart/pharmacies/${id}`, // MOCK only
    SAVE_FOR_LATER: (id: string) => `/api/cart/items/${id}/save-for-later`, // MOCK only
    MOVE_TO_CART: (id: string) => `/api/cart/saved/${id}/move-to-cart`, // MOCK only
    APPLY_COUPON: "/api/cart/coupon", // MOCK only
    REMOVE_COUPON: "/api/cart/coupon", // MOCK only
  },

  // ── File Upload — POST /file/upload ───────────────────────────────────────
  FILE: {
    UPLOAD: "/file/upload",
  },

  // ── Prescriptions — /prescriptions ────────────────────────────────────────
  PRESCRIPTION: {
    CREATE: "/prescriptions",
    GET_MY: (id: number | string) => `/prescriptions/my/${id}`,
    REUPLOAD: (id: number | string) => `/prescriptions/my/${id}/reupload`,
    GET_BY_ID: (id: number | string) => `/prescriptions/${id}`,
  },

  // ── Patient Orders — /orders ───────────────────────────────────────────────

  ORDERS: {
    CREATE: "/orders",                                          // POST /orders
    GET_MY: "/orders",                                          // GET /orders
    GET_BY_ID: (id: number | string) => `/orders/${id}`,        // GET /orders/{id}
    CANCEL: (id: number | string) => `/orders/${id}/cancel`,    // PATCH /orders/{id}/cancel
  },

  // ── Pharmacy Orders — /pharmacy-order ─────────────────────────────────────
  // Used by the pharmacy dashboard to manage incoming orders.
  PHARMACY_ORDERS: {
    LIST: "/pharmacy-order/my",
    GET_BY_ID: (id: number | string) => `/pharmacy-order/my/${id}`,
    DECISION: (id: number | string) => `/pharmacy-order/${id}/decision`,
    STATUS: (id: number | string) => `/pharmacy-order/${id}/status`,
  },

  // ── Patient Addresses — /patient/addresses ─────────────────────────────────
  ADDRESSES: {
    LIST: "/patient/addresses",
    CREATE: "/patient/addresses",
    GET_BY_ID: (id: number | string) => `/patient/addresses/${id}`,
    UPDATE: (id: number | string) => `/patient/addresses/${id}`,
    DELETE: (id: number | string) => `/patient/addresses/${id}`,
    SET_DEFAULT: (id: number | string) => `/patient/addresses/${id}/default`,
  },

  // ── Checkout ───────────────────────────────────────────────────────────────
  // NOTE: API spec has no /checkout/validate endpoint; validation is client-side.
  CHECKOUT: {
    PLACE_ORDER: "/orders", // POST /orders
  },

  // ── Delivery (no endpoint in API spec) ────────────────────────────────────
  DELIVERY: {
    OPTIONS: "/api/delivery/options", // MOCK only
    VALIDATE_ADDRESS: "/api/delivery/validate-address", // MOCK only
    GET_COORDINATES: "/api/delivery/geocode", // MOCK only
  },
} as const;

export const STORAGE_KEYS = {
  CART: "cureway_cart",
  CHECKOUT_DRAFT: "cureway_checkout_draft",
  DELIVERY_ADDRESSES: "cureway_addresses",
  SELECTED_ADDRESS: "cureway_selected_address",
  LAST_SYNC: "cureway_cart_last_sync",
} as const;

export const DELIVERY_OPTIONS = [
  {
    id: "standard",
    name: "Standard Delivery",
    price: 3.0,
    duration: "30–45 min",
    description: "Secure handling",
    icon: "standard" as const,
  },
  {
    id: "express",
    name: "Express Delivery",
    price: 6.0,
    duration: "10–15 min",
    description: "Priority handling",
    icon: "express" as const,
  },
] as const;

export const PAYMENT_METHODS = [
  {
    id: "cash",
    name: "Cash on delivery",
    description: "Pay when you receive your order",
    icon: "cash" as const,
    recommended: true,
    fee: 0,
  },
  {
    id: "card",
    name: "Credit / Debit card",
    description: "Easily link your bank account for quick payments",
    icon: "card" as const,
    fee: 0,
  },
] as const;

export const DELIVERY_TIME_SLOTS = [
  { start: "09:00", end: "11:00", label: "Morning (9 AM – 11 AM)" },
  { start: "11:00", end: "13:00", label: "Late Morning (11 AM – 1 PM)" },
  { start: "13:00", end: "15:00", label: "Afternoon (1 PM – 3 PM)" },
  { start: "15:00", end: "17:00", label: "Late Afternoon (3 PM – 5 PM)" },
  { start: "17:00", end: "19:00", label: "Evening (5 PM – 7 PM)" },
  { start: "19:00", end: "21:00", label: "Night (7 PM – 9 PM)" },
] as const;

export const PRESCRIPTION_CONSTRAINTS = {
  MAX_FILE_SIZE: 5 * 1024 * 1024, // 5 MB
  ALLOWED_TYPES: ["image/jpeg", "image/png", "image/jpg", "application/pdf"],
  ALLOWED_EXTENSIONS: [".jpg", ".jpeg", ".png", ".pdf"],
} as const;

export const CART_LIMITS = {
  MAX_ITEMS_PER_PHARMACY: 50,
  MAX_QUANTITY_PER_ITEM: 99,
  MIN_ORDER_VALUE: 5.0,
  MAX_CART_AGE_DAYS: 7,
} as const;

export const ANIMATION = {
  DURATION: { FAST: 150, NORMAL: 200, SLOW: 300 },
  EASE: {
    DEFAULT: [0.4, 0, 0.2, 1],
    IN: [0.4, 0, 1, 1],
    OUT: [0, 0, 0.2, 1],
    IN_OUT: [0.4, 0, 0.2, 1],
  },
} as const;

export const TOAST_DURATION = {
  SUCCESS: 3000,
  ERROR: 5000,
  INFO: 4000,
  WARNING: 4000,
} as const;

export const DEBOUNCE = {
  SEARCH: 300,
  INPUT: 500,
  RESIZE: 200,
  SCROLL: 100,
} as const;

export const CART_SYNC_INTERVAL = 30_000; // 30 s

export const GEOLOCATION_OPTIONS = {
  enableHighAccuracy: true,
  timeout: 10_000,
  maximumAge: 0,
} as const;

export const DEFAULTS = {
  COUNTRY: "Palestine",
  CURRENCY: "USD",
  CURRENCY_SYMBOL: "$",
  LANGUAGE: "en",
  PHONE_COUNTRY_CODE: "+970",
} as const;

/** Route paths used by the cart / checkout flow */
export const ROUTES = {
  CART: "/cart",
  CHECKOUT: "/checkout",
  ORDER_CONFIRMATION: "/Orderconfirmation",
  MEDICINES: "/medicines",
  PHARMACIES: "/pharmacies",
  ORDERS: "/orders",
  PROFILE: "/profile",
  PRESCRIPTIONS: "/prescriptions",
  PHARMACY_ORDERS: "/pharmacy/orders",
} as const;

export const VALIDATION_MESSAGES = {
  REQUIRED_FIELD: "This field is required",
  INVALID_EMAIL: "Please enter a valid email address",
  INVALID_PHONE: "Please enter a valid phone number",
  MIN_ORDER_VALUE: `Minimum order value is $${CART_LIMITS.MIN_ORDER_VALUE}`,
  MAX_QUANTITY: `Maximum quantity per item is ${CART_LIMITS.MAX_QUANTITY_PER_ITEM}`,
  OUT_OF_STOCK: "This item is currently out of stock",
  PRESCRIPTION_REQUIRED: "Prescription is required for this item",
  INVALID_COUPON: "Invalid or expired coupon code",
  FILE_TOO_LARGE: `File size must be less than ${PRESCRIPTION_CONSTRAINTS.MAX_FILE_SIZE / 1024 / 1024}MB`,
  INVALID_FILE_TYPE: "Only JPG, PNG, and PDF files are allowed",
} as const;

export const ERROR_CODES = {
  NETWORK_ERROR: "NETWORK_ERROR",
  UNAUTHORIZED: "UNAUTHORIZED",
  FORBIDDEN: "FORBIDDEN",
  NOT_FOUND: "NOT_FOUND",
  VALIDATION_ERROR: "VALIDATION_ERROR",
  SERVER_ERROR: "SERVER_ERROR",
  OUT_OF_STOCK: "OUT_OF_STOCK",
  PRESCRIPTION_REQUIRED: "PRESCRIPTION_REQUIRED",
  INVALID_COUPON: "INVALID_COUPON",
  PAYMENT_FAILED: "PAYMENT_FAILED",
  DELIVERY_UNAVAILABLE: "DELIVERY_UNAVAILABLE",
} as const;