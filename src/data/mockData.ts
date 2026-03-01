// ===================================================================
// MOCK DATA — Used throughout the app during development.
// To switch to real API: replace each mock with an API call in the
// corresponding service function (see services/cart.service.ts).
// ===================================================================

import type {
  Cart,
  OrderConfirmation,
  DeliveryAddress,
  Coupon,
} from "@/types/cart";

// ── Contact / User ────────────────────────────────────────────────
export const MOCK_USER = {
  name:   "Mohammed Bassam",
  email:  "Mhmd26@gmail.com",
  phone:  "059-244-9634",
  avatar: "/icons/profile.png",
};

// ── Saved Delivery Addresses ─────────────────────────────────────
export const MOCK_SAVED_ADDRESSES: DeliveryAddress[] = [
  {
    id:         "addr-1",
    label:      "Home",
    street:     "26 Salah El Din Street",
    city:       "Gaza City",
    area:       "Al-Rimal Area",
    isDefault:  true,
  },
  {
    id:         "addr-2",
    label:      "Work",
    street:     "Omar Mukhtar Street",
    city:       "Gaza City",
    area:       "Downtown",
    isDefault:  false,
  },
];

// ── Coupon Codes ──────────────────────────────────────────────────
// These are keyed by code in cart.service.ts via MOCK_COUPONS[code]
export const MOCK_COUPONS: Record<string, Coupon> = {
  SAVE10: {
    code:          "SAVE10",
    discountType:  "percentage",
    discountValue: 10,
    minOrderValue: 20,
  },
  SAVE5: {
    code:          "SAVE5",
    discountType:  "fixed",
    discountValue: 5,
    minOrderValue: 15,
  },
  CUREWAY20: {
    code:          "CUREWAY20",
    discountType:  "percentage",
    discountValue: 20,
    minOrderValue: 50,
  },
  C230: {
    code:          "C230",
    discountType:  "percentage",
    discountValue: 87,
    minOrderValue: 0,
  },
};

// ── Cart (Initial Mock Data) ──────────────────────────────────────
// NOTE: inventoryId must be a real numeric ID from your backend inventory.
//       pharmacyId ("1", "2") must match real pharmacy IDs in your backend.
//       Update these values once you have real data from the API.
export const MOCK_CART: Cart = {
  groups: [
    {
      pharmacy: {
        id:           "1",
        name:         "City Pharmacy",
        address:      "Omar Mukhtar Street, Al-Rimal Area",
        distance:     "2.55 km",
        deliveryTime: "15 minutes",
        isAvailable:  true,
      },
      items: [
        {
          id:                   "item-panadol",
          medicineId:           "1",
          inventoryId:          1,
          name:                 "Pain Relief- Panadol",
          genericName:          "Paracetamol (Acetaminophen)",
          image:                "/icons/medicine/panadol.png",
          quantity:             1,
          price:                12.00,
          requiresPrescription: true,
          prescriptionUploaded: true,
          prescriptionInfo:     { dosage: "400 mg", form: "12 tablets" },
          pharmacy: {
            id:           "1",
            name:         "City Pharmacy",
            address:      "Omar Mukhtar Street, Al-Rimal Area",
            distance:     "2.55 km",
            deliveryTime: "15 minutes",
            isAvailable:  true,
          },
        },
        {
          id:                   "item-amox",
          medicineId:           "2",
          inventoryId:          2,
          name:                 "Amoxicillin 500mg",
          genericName:          "Amoxicillin",
          image:                "/icons/medicine/panadol.png",
          quantity:             2,
          price:                8.50,
          requiresPrescription: true,
          prescriptionUploaded: true,
          prescriptionInfo:     { dosage: "500 mg", form: "21 capsules" },
          pharmacy: {
            id:           "1",
            name:         "City Pharmacy",
            address:      "Omar Mukhtar Street, Al-Rimal Area",
            distance:     "2.55 km",
            deliveryTime: "15 minutes",
            isAvailable:  true,
          },
        },
        {
          id:                   "item-vitc",
          medicineId:           "3",
          inventoryId:          3,
          name:                 "Vitamin C 1000mg",
          genericName:          "Ascorbic Acid",
          image:                "/icons/medicine/panadol.png",
          quantity:             2,
          price:                6.00,
          requiresPrescription: false,
          pharmacy: {
            id:           "1",
            name:         "City Pharmacy",
            address:      "Omar Mukhtar Street, Al-Rimal Area",
            distance:     "2.55 km",
            deliveryTime: "15 minutes",
            isAvailable:  true,
          },
        },
        {
          id:                   "item-omega",
          medicineId:           "4",
          inventoryId:          4,
          name:                 "Omega-3 Fish Oil",
          genericName:          "Omega-3 Fatty Acids",
          image:                "/icons/medicine/panadol.png",
          quantity:             1,
          price:                15.00,
          requiresPrescription: false,
          pharmacy: {
            id:           "1",
            name:         "City Pharmacy",
            address:      "Omar Mukhtar Street, Al-Rimal Area",
            distance:     "2.55 km",
            deliveryTime: "15 minutes",
            isAvailable:  true,
          },
        },
      ],
      subtotal: 53.00,
    },
    {
      pharmacy: {
        id:           "2",
        name:         "Family Pharmacy",
        address:      "Omar Mukhtar Street, Al-Rimal Area",
        distance:     "3.10 km",
        deliveryTime: "20 minutes",
        isAvailable:  true,
      },
      items: [
        {
          id:                   "item-panadol-2",
          medicineId:           "1",
          inventoryId:          5,
          name:                 "Pain Relief- Panadol",
          genericName:          "Paracetamol (Acetaminophen)",
          image:                "/icons/medicine/panadol.png",
          quantity:             2,
          price:                12.00,
          requiresPrescription: true,
          prescriptionUploaded: true,
          prescriptionInfo:     { dosage: "400 mg", form: "12 tablets" },
          pharmacy: {
            id:           "2",
            name:         "Family Pharmacy",
            address:      "Omar Mukhtar Street, Al-Rimal Area",
            distance:     "3.10 km",
            deliveryTime: "20 minutes",
            isAvailable:  true,
          },
        },
        {
          id:                   "item-amox-2",
          medicineId:           "2",
          inventoryId:          6,
          name:                 "Amoxicillin 500mg",
          genericName:          "Amoxicillin",
          image:                "/icons/medicine/panadol.png",
          quantity:             1,
          price:                8.50,
          requiresPrescription: true,
          prescriptionUploaded: true,
          prescriptionInfo:     { dosage: "500 mg", form: "21 capsules" },
          pharmacy: {
            id:           "2",
            name:         "Family Pharmacy",
            address:      "Omar Mukhtar Street, Al-Rimal Area",
            distance:     "3.10 km",
            deliveryTime: "20 minutes",
            isAvailable:  true,
          },
        },
        {
          id:                   "item-vitc-2",
          medicineId:           "3",
          inventoryId:          7,
          name:                 "Vitamin C 1000mg",
          genericName:          "Ascorbic Acid",
          image:                "/icons/medicine/panadol.png",
          quantity:             2,
          price:                6.00,
          requiresPrescription: false,
          pharmacy: {
            id:           "2",
            name:         "Family Pharmacy",
            address:      "Omar Mukhtar Street, Al-Rimal Area",
            distance:     "3.10 km",
            deliveryTime: "20 minutes",
            isAvailable:  true,
          },
        },
        {
          id:                   "item-omega-2",
          medicineId:           "4",
          inventoryId:          8,
          name:                 "Omega-3 Fish Oil",
          genericName:          "Omega-3 Fatty Acids",
          image:                "/icons/medicine/panadol.png",
          quantity:             1,
          price:                15.00,
          requiresPrescription: false,
          pharmacy: {
            id:           "2",
            name:         "Family Pharmacy",
            address:      "Omar Mukhtar Street, Al-Rimal Area",
            distance:     "3.10 km",
            deliveryTime: "20 minutes",
            isAvailable:  true,
          },
        },
      ],
      subtotal: 47.50,
    },
  ],
  totalItems:    12,
  subtotal:      100.50,
  savedForLater: [],
};

// ── Order Confirmation ────────────────────────────────────────────
// Matches the Confirmation page design:
//   - City Pharmacy:   4 items | 24.00$
//   - Family Pharmacy: 4 items | 24.00$
//   - Total (8 items): 60.50$
export const MOCK_ORDER_CONFIRMATION: OrderConfirmation = {
  orderId:     "ORD-2024-001234",
  orderNumber: "#001234",
  groups: [
    {
      pharmacy: {
        id:      "pharmacy-city",
        name:    "City Pharmacy",
        address: "Omar Mukhtar Street, Al-Rimal Area",
      },
      items: [
        {
          id:                   "item-1",
          name:                 "Pain Relief- Panadol",
          genericName:          "Paracetamol",
          image:                "/icons/medicine/panadol.png",
          unitPrice:            12.00,
          quantity:             2,
          requiresPrescription: true,
          inStock:              true,
        },
        {
          id:                   "item-2",
          name:                 "Amoxicillin 500mg",
          genericName:          "Amoxicillin",
          image:                "/icons/medicine/panadol.png",
          unitPrice:            6.00,
          quantity:             2,
          requiresPrescription: true,
          inStock:              true,
        },
      ],
      subtotal: 24.00,
    },
    {
      pharmacy: {
        id:      "pharmacy-family",
        name:    "Family Pharmacy",
        address: "Omar Mukhtar Street, Al-Rimal Area",
      },
      items: [
        {
          id:                   "item-3",
          name:                 "Pain Relief- Panadol",
          genericName:          "Paracetamol",
          image:                "/icons/medicine/panadol.png",
          unitPrice:            6.00,
          quantity:             2,
          requiresPrescription: false,
          inStock:              true,
        },
        {
          id:                   "item-4",
          name:                 "Omega-3 Fish Oil",
          genericName:          "Omega-3 Fatty Acids",
          image:                "/icons/medicine/panadol.png",
          unitPrice:            6.00,
          quantity:             2,
          requiresPrescription: false,
          inStock:              true,
        },
      ],
      subtotal: 24.00,
    },
  ],
  totalItems:  8,
  subtotal:    54.00,
  deliveryFee: 3.00,
  discount:    0,
  total:       60.50,
  status:      "pending",
  placedAt:    new Date(),
  estimatedDelivery: new Date(Date.now() + 30 * 60 * 1000).toISOString(),
};