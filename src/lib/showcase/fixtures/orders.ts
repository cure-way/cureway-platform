/**
 * Order fixtures — patient-side and pharmacy-side.
 *
 * Two pharmacy-order shapes exist in this codebase and both are served:
 *   - `PharmacyOrderDTO`      (`@/types/pharmacyOrders`)  → GET /pharmacy-orders
 *   - `PharmacyOrderListItemDto` (`@/types/api.types`)     → GET /pharmacy-order/my
 *
 * Pharmacy orders deliberately spread across the last 7 days, with several
 * created today, so `getTodayDashboardAnalytics()` and `getPharmacyReport()`
 * (weekly stats, donut, top medicines) all render real numbers.
 */

import type {
  PatientOrderDetailsResponseDto,
  PatientOrderListItemDto,
  PharmacyOrderDetailDto,
  PharmacyOrderListItemDto,
} from "@/types/api.types";
import type { PharmacyOrderDTO } from "@/types/pharmacyOrders";

import { CURRENCY, IMG, daysAgo, hoursAgo, money } from "./common";
import { MEDICINES, PHARMACIES } from "./catalog";
import { PATIENT_USER } from "./users";

const DEMO_PHARMACY_ID = 202;

function med(id: number) {
  const m = MEDICINES.find((x) => x.id === id)!;
  return { id: m.id, name: m.brandName, price: Number(m.minPrice) };
}

// ---------------------------------------------------------------------------
// Patient orders — GET /orders, GET /orders/{id}
// ---------------------------------------------------------------------------

interface SeedPatientOrder {
  id: number;
  status: PatientOrderListItemDto["status"];
  createdAt: string;
  pharmacyId: number;
  items: Array<{ inventoryId: number; medicineId: number; quantity: number }>;
  deliveryFee: number;
}

const PATIENT_ORDER_SEEDS: SeedPatientOrder[] = [
  {
    id: 5101, status: "ON_THE_WAY", createdAt: hoursAgo(3), pharmacyId: 202,
    items: [
      { inventoryId: 401, medicineId: 31, quantity: 2 },
      { inventoryId: 407, medicineId: 37, quantity: 1 },
    ],
    deliveryFee: 3,
  },
  {
    id: 5102, status: "PROCESSING", createdAt: hoursAgo(26), pharmacyId: 203,
    items: [{ inventoryId: 412, medicineId: 41, quantity: 1 }],
    deliveryFee: 3,
  },
  {
    id: 5103, status: "DELIVERED", createdAt: daysAgo(4), pharmacyId: 202,
    items: [
      { inventoryId: 403, medicineId: 33, quantity: 1 },
      { inventoryId: 402, medicineId: 32, quantity: 2 },
    ],
    deliveryFee: 3,
  },
  {
    id: 5104, status: "DELIVERED", createdAt: daysAgo(12), pharmacyId: 204,
    items: [{ inventoryId: 418, medicineId: 43, quantity: 3 }],
    deliveryFee: 3.5,
  },
  {
    id: 5105, status: "CANCELLED", createdAt: daysAgo(19), pharmacyId: 203,
    items: [{ inventoryId: 410, medicineId: 39, quantity: 1 }],
    deliveryFee: 3,
  },
  {
    id: 5106, status: "PENDING", createdAt: hoursAgo(1), pharmacyId: 202,
    items: [{ inventoryId: 406, medicineId: 36, quantity: 1 }],
    deliveryFee: 3,
  },
];

function patientOrderAddress() {
  return {
    addressText: "Omar Al-Mukhtar Street, Rimal, Gaza",
    lat: 31.5175,
    lng: 34.4515,
  };
}

export function buildPatientOrders(): PatientOrderListItemDto[] {
  return PATIENT_ORDER_SEEDS.map((seed) => {
    const pharmacy = PHARMACIES.find((p) => p.pharmacyId === seed.pharmacyId)!;
    const subtotal = money(
      seed.items.reduce((sum, it) => sum + med(it.medicineId).price * it.quantity, 0),
    );
    const requiresPrescription = seed.items.some(
      (it) => MEDICINES.find((m) => m.id === it.medicineId)!.requiresPrescription,
    );

    return {
      id: seed.id,
      status: seed.status,
      createdAt: seed.createdAt,
      updatedAt: seed.createdAt,
      subAmount: subtotal,
      deliveryFee: seed.deliveryFee,
      totalAmount: money(subtotal + seed.deliveryFee),
      currency: CURRENCY,
      deliveryAddress: patientOrderAddress(),
      pharmacyOrders: [
        {
          pharmacyOrderId: seed.id + 1000,
          pharmacyId: pharmacy.pharmacyId,
          pharmacyName: pharmacy.pharmacyName,
          status: seed.status,
          subtotal,
          requiresPrescription,
          prescriptionId: requiresPrescription ? 601 : null,
          prescriptionStatus: requiresPrescription ? "APPROVED" : undefined,
          itemsCount: seed.items.length,
        },
      ],
    };
  });
}

export function buildPatientOrderDetails(
  id: number,
): PatientOrderDetailsResponseDto | null {
  const seed = PATIENT_ORDER_SEEDS.find((s) => s.id === id);
  if (!seed) return null;

  const pharmacy = PHARMACIES.find((p) => p.pharmacyId === seed.pharmacyId)!;
  const items = seed.items.map((it) => {
    const m = med(it.medicineId);
    return {
      inventoryId: it.inventoryId,
      medicineId: m.id,
      medicineName: m.name,
      quantity: it.quantity,
      unitPrice: m.price,
      totalPrice: money(m.price * it.quantity),
    };
  });
  const subtotal = money(items.reduce((s, i) => s + i.totalPrice, 0));
  const requiresPrescription = seed.items.some(
    (it) => MEDICINES.find((m) => m.id === it.medicineId)!.requiresPrescription,
  );

  return {
    id: seed.id,
    status: seed.status,
    createdAt: seed.createdAt,
    updatedAt: seed.createdAt,
    subAmount: subtotal,
    deliveryFee: seed.deliveryFee,
    totalAmount: money(subtotal + seed.deliveryFee),
    currency: CURRENCY,
    deliveryAddress: patientOrderAddress(),
    pharmacyOrders: [
      {
        pharmacyOrderId: seed.id + 1000,
        pharmacyId: pharmacy.pharmacyId,
        pharmacyName: pharmacy.pharmacyName,
        status: seed.status,
        pharmacyLocation: {
          address: pharmacy.addressLine,
          latitude: pharmacy.latitude,
          longitude: pharmacy.longitude,
        },
        subtotal,
        requiresPrescription,
        prescriptionId: requiresPrescription ? 601 : null,
        prescriptionStatus: requiresPrescription ? "APPROVED" : undefined,
        items,
        rejectedAt: null,
        rejectionReason: null,
      },
    ],
    delivery:
      seed.status === "ON_THE_WAY" || seed.status === "DELIVERED"
        ? {
            id: seed.id + 2000,
            status: seed.status === "DELIVERED" ? "DELIVERED" : "EN_ROUTE",
            driver: {
              id: 701,
              name: "Khaled Abu Daqqa",
              phoneNumber: "+970599201764",
            },
            acceptedAt: seed.createdAt,
            deliveredAt: seed.status === "DELIVERED" ? seed.createdAt : undefined,
          }
        : null,
  };
}

// ---------------------------------------------------------------------------
// Pharmacy orders
// ---------------------------------------------------------------------------

interface SeedPharmacyOrder {
  pharmacyOrderId: number;
  orderId: number;
  status: "PENDING" | "PREPARING" | "READY_FOR_PICKUP";
  createdAt: string;
  patientName: string;
  patientImage: string | null;
  medicineIds: number[];
}

/**
 * 18 orders across the last 7 days; 4 created today. Statuses are mixed so the
 * donut (Delivered vs Pending) and weekly bars are not flat.
 */
const PHARMACY_ORDER_SEEDS: SeedPharmacyOrder[] = [
  { pharmacyOrderId: 6101, orderId: 5101, status: "PREPARING",        createdAt: hoursAgo(2),  patientName: "Lina Haddad",       patientImage: IMG.avatarGirl, medicineIds: [31, 37] },
  { pharmacyOrderId: 6102, orderId: 5106, status: "PENDING",          createdAt: hoursAgo(1),  patientName: "Omar Shaheen",      patientImage: IMG.avatarBoy,  medicineIds: [36] },
  { pharmacyOrderId: 6103, orderId: 5110, status: "READY_FOR_PICKUP", createdAt: hoursAgo(5),  patientName: "Rana Abu Khalil",   patientImage: null,           medicineIds: [32, 46, 47] },
  { pharmacyOrderId: 6104, orderId: 5111, status: "PENDING",          createdAt: hoursAgo(7),  patientName: "Tareq Al-Masri",    patientImage: IMG.avatarBoy,  medicineIds: [41] },
  { pharmacyOrderId: 6105, orderId: 5112, status: "READY_FOR_PICKUP", createdAt: daysAgo(1),   patientName: "Huda Barghouti",    patientImage: IMG.avatarGirl, medicineIds: [38, 48] },
  { pharmacyOrderId: 6106, orderId: 5113, status: "PREPARING",        createdAt: daysAgo(1, 4), patientName: "Sami Qudaih",      patientImage: null,           medicineIds: [33] },
  { pharmacyOrderId: 6107, orderId: 5114, status: "READY_FOR_PICKUP", createdAt: daysAgo(2),   patientName: "Nour Al-Hindi",     patientImage: IMG.avatarGirl, medicineIds: [35, 34] },
  { pharmacyOrderId: 6108, orderId: 5115, status: "PENDING",          createdAt: daysAgo(2, 6), patientName: "Ahmad Abu Jazar",  patientImage: IMG.avatarBoy,  medicineIds: [43, 44] },
  { pharmacyOrderId: 6109, orderId: 5116, status: "READY_FOR_PICKUP", createdAt: daysAgo(3),   patientName: "Maryam Zaqout",     patientImage: null,           medicineIds: [37] },
  { pharmacyOrderId: 6110, orderId: 5117, status: "PREPARING",        createdAt: daysAgo(3, 3), patientName: "Ibrahim Nassar",   patientImage: IMG.avatarBoy,  medicineIds: [45, 31] },
  { pharmacyOrderId: 6111, orderId: 5118, status: "READY_FOR_PICKUP", createdAt: daysAgo(4),   patientName: "Dalia Sourani",     patientImage: IMG.avatarGirl, medicineIds: [39] },
  { pharmacyOrderId: 6112, orderId: 5103, status: "READY_FOR_PICKUP", createdAt: daysAgo(4, 5), patientName: "Lina Haddad",      patientImage: IMG.avatarGirl, medicineIds: [33, 32] },
  { pharmacyOrderId: 6113, orderId: 5119, status: "PENDING",          createdAt: daysAgo(5),   patientName: "Yasmin Dahlan",     patientImage: null,           medicineIds: [42] },
  { pharmacyOrderId: 6114, orderId: 5120, status: "READY_FOR_PICKUP", createdAt: daysAgo(5, 2), patientName: "Mohammed Skaik",   patientImage: IMG.avatarBoy,  medicineIds: [46, 47] },
  { pharmacyOrderId: 6115, orderId: 5121, status: "PREPARING",        createdAt: daysAgo(6),   patientName: "Asma Al-Agha",      patientImage: IMG.avatarGirl, medicineIds: [40] },
  { pharmacyOrderId: 6116, orderId: 5122, status: "READY_FOR_PICKUP", createdAt: daysAgo(6, 3), patientName: "Hani Abu Shawish", patientImage: null,           medicineIds: [31, 35] },
  { pharmacyOrderId: 6117, orderId: 5123, status: "READY_FOR_PICKUP", createdAt: daysAgo(6, 8), patientName: "Reem Mushtaha",    patientImage: IMG.avatarGirl, medicineIds: [48] },
  { pharmacyOrderId: 6118, orderId: 5124, status: "PENDING",          createdAt: hoursAgo(9),  patientName: "Jamal Al-Rayyes",   patientImage: IMG.avatarBoy,  medicineIds: [34, 46] },
];

function seedTotal(medicineIds: number[]): number {
  return money(medicineIds.reduce((s, id) => s + med(id).price, 0));
}

/** GET /pharmacy-orders — `PharmacyOrderDTO` shape. */
export function buildPharmacyOrdersLegacy(): PharmacyOrderDTO[] {
  return PHARMACY_ORDER_SEEDS.map((seed, idx) => ({
    pharmacyOrderId: seed.pharmacyOrderId,
    orderId: seed.orderId,
    status: seed.status,
    createdAt: seed.createdAt,
    totalAmount: seedTotal(seed.medicineIds),
    currency: CURRENCY,
    requirePrescription: seed.medicineIds.some(
      (id) => MEDICINES.find((m) => m.id === id)!.requiresPrescription,
    ),
    deliveryId: null,
    patient: {
      patientId: 800 + idx,
      patientName: seed.patientName,
      profileImageUrl: seed.patientImage,
    },
    items: seed.medicineIds.map((id, i) => ({
      pharmacyOrderItemId: seed.pharmacyOrderId * 10 + i,
      inventoryId: 400 + (id - 30),
      medicineId: id,
      medicineDisplayName: med(id).name,
    })),
  }));
}

/** GET /pharmacy-order/my — `PharmacyOrderListItemDto` shape. */
export function buildPharmacyOrdersModern(): PharmacyOrderListItemDto[] {
  return PHARMACY_ORDER_SEEDS.map((seed, idx) => ({
    id: seed.pharmacyOrderId,
    orderId: seed.orderId,
    status: seed.status,
    createdAt: seed.createdAt,
    updatedAt: seed.createdAt,
    subtotal: seedTotal(seed.medicineIds),
    requiresPrescription: seed.medicineIds.some(
      (id) => MEDICINES.find((m) => m.id === id)!.requiresPrescription,
    ),
    prescriptionId: null,
    prescriptionStatus: null,
    itemsCount: seed.medicineIds.length,
    customer: {
      id: 800 + idx,
      name: seed.patientName,
      phone: "+9705992" + String(10000 + idx).slice(1),
      email: null,
    },
    deliveryAddress: {
      addressText: "Omar Al-Mukhtar Street, Rimal, Gaza",
      lat: 31.5175,
      lng: 34.4515,
    },
  }));
}

export function buildPharmacyOrderDetail(
  id: number,
): PharmacyOrderDetailDto | null {
  const seed = PHARMACY_ORDER_SEEDS.find((s) => s.pharmacyOrderId === id);
  if (!seed) return null;

  const base = buildPharmacyOrdersModern().find((o) => o.id === id)!;

  return {
    ...base,
    items: seed.medicineIds.map((mid, i) => {
      const m = med(mid);
      return {
        id: seed.pharmacyOrderId * 10 + i,
        inventoryId: 400 + (mid - 30),
        medicineName: m.name,
        quantity: 1 + (i % 2),
        unitPrice: m.price,
        totalPrice: money(m.price * (1 + (i % 2))),
      };
    }),
    rejectedAt: null,
    rejectionReason: null,
  };
}

export { DEMO_PHARMACY_ID, PATIENT_ORDER_SEEDS, PHARMACY_ORDER_SEEDS };
export const DEMO_PATIENT_ID = PATIENT_USER.id;
