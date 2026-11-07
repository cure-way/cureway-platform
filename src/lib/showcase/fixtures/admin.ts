/**
 * Admin fixtures — shapes come from the exported types in
 * `@/services/admin.service` so the paginated list pages, detail drawers and
 * verification actions all receive exactly what they expect.
 */

import type {
  AdminCategory,
  AdminCity,
  AdminDelivery,
  AdminDriver,
  AdminInventoryItem,
  AdminMedicine,
  AdminOrder,
  AdminPatient,
  AdminPatientDetail,
  AdminPharmacy,
  AdminPharmacyDetail,
} from "@/services/admin.service";

import { CATEGORIES, MEDICINES, PHARMACIES } from "./catalog";
import {
  CITIES,
  CITY_DELIVERY_FEES,
  CURRENCY,
  IMG,
  daysAgo,
  hoursAgo,
  money,
} from "./common";
import { buildInventoryList } from "./inventory";
import { PATIENT_ORDER_SEEDS } from "./orders";

// ---------------------------------------------------------------------------
// Patients
// ---------------------------------------------------------------------------

const PATIENT_ROWS: Array<[number, string, string, string, "ACTIVE" | "INACTIVE", number]> = [
  [101, "Lina Haddad", "lina.haddad@example.ps", "+970592440118", "ACTIVE", 420],
  [104, "Omar Shaheen", "omar.shaheen@example.ps", "+970599114207", "ACTIVE", 365],
  [105, "Rana Abu Khalil", "rana.abukhalil@example.ps", "+970597630845", "ACTIVE", 298],
  [106, "Tareq Al-Masri", "tareq.almasri@example.ps", "+970595218360", "ACTIVE", 254],
  [107, "Huda Barghouti", "huda.barghouti@example.ps", "+970598471029", "ACTIVE", 212],
  [108, "Sami Qudaih", "sami.qudaih@example.ps", "+970592905613", "INACTIVE", 188],
  [109, "Nour Al-Hindi", "nour.alhindi@example.ps", "+970594337180", "ACTIVE", 164],
  [110, "Ahmad Abu Jazar", "ahmad.abujazar@example.ps", "+970599802475", "ACTIVE", 141],
  [111, "Maryam Zaqout", "maryam.zaqout@example.ps", "+970597015928", "ACTIVE", 119],
  [112, "Ibrahim Nassar", "ibrahim.nassar@example.ps", "+970595644103", "ACTIVE", 96],
  [113, "Dalia Sourani", "dalia.sourani@example.ps", "+970598229764", "ACTIVE", 74],
  [114, "Yasmin Dahlan", "yasmin.dahlan@example.ps", "+970592583017", "INACTIVE", 58],
  [115, "Mohammed Skaik", "mohammed.skaik@example.ps", "+970599470862", "ACTIVE", 41],
  [116, "Asma Al-Agha", "asma.alagha@example.ps", "+970594108539", "ACTIVE", 27],
  [117, "Reem Mushtaha", "reem.mushtaha@example.ps", "+970597336290", "ACTIVE", 12],
];

export function buildAdminPatients(): AdminPatient[] {
  return PATIENT_ROWS.map(([id, name, email, phoneNumber, status, ago]) => ({
    id,
    name,
    email,
    phoneNumber,
    role: "PATIENT",
    status,
    createdAt: daysAgo(ago),
  }));
}

export function buildAdminPatientDetail(id: number): AdminPatientDetail | null {
  const base = buildAdminPatients().find((p) => p.id === id);
  if (!base) return null;
  return {
    ...base,
    dateOfBirth: `19${80 + (id % 20)}-0${1 + (id % 9)}-1${id % 9}`,
    profileImageUrl: id % 2 === 0 ? IMG.avatarBoy : IMG.avatarGirl,
    isEmailVerified: true,
    isPhoneVerified: id % 4 !== 0,
    updatedAt: daysAgo(id % 30),
  };
}

// ---------------------------------------------------------------------------
// Pharmacies
// ---------------------------------------------------------------------------

export function buildAdminPharmacies(): AdminPharmacy[] {
  return PHARMACIES.map((p) => ({
    id: p.pharmacyId,
    pharmacyName: p.pharmacyName,
    phoneNumber: p.phoneNumber,
    cityName: p.cityName,
    verificationStatus: p.verificationStatus,
    addressLine: p.addressLine,
    latitude: p.latitude,
    longitude: p.longitude,
  }));
}

export function buildAdminPharmacyDetail(id: number): AdminPharmacyDetail | null {
  const p = PHARMACIES.find((x) => x.pharmacyId === id);
  if (!p) return null;
  return {
    id: p.pharmacyId,
    pharmacyName: p.pharmacyName,
    phoneNumber: p.phoneNumber,
    cityName: p.cityName,
    verificationStatus: p.verificationStatus,
    addressLine: p.addressLine,
    latitude: p.latitude,
    longitude: p.longitude,
    licenseNumber: p.licenseNumber,
    licenseDocumentUrl: IMG.prescription,
  };
}

// ---------------------------------------------------------------------------
// Drivers
// ---------------------------------------------------------------------------

export function buildAdminDrivers(): AdminDriver[] {
  return [
    { id: 701, name: "Khaled Abu Daqqa", phoneNumber: "+970599201764", vehicleName: "Honda SH 150", vehiclePlate: "GZ-4417", availabilityStatus: "ONLINE", verificationStatus: "VERIFIED", busyStatus: "BUSY" },
    { id: 702, name: "Basel Al-Khatib", phoneNumber: "+970597884120", vehicleName: "Yamaha NMAX", vehiclePlate: "GZ-7703", availabilityStatus: "ONLINE", verificationStatus: "VERIFIED", busyStatus: "AVAILABLE" },
    { id: 703, name: "Wael Abu Odeh", phoneNumber: "+970592330491", vehicleName: "Suzuki Address", vehiclePlate: "KY-2286", availabilityStatus: "OFFLINE", verificationStatus: "VERIFIED", busyStatus: "AVAILABLE" },
    { id: 704, name: "Firas Al-Louh", phoneNumber: "+970594617052", vehicleName: "Hyundai Accent", vehiclePlate: "GZ-1194", availabilityStatus: "ONLINE", verificationStatus: "UNDER_REVIEW", busyStatus: "AVAILABLE" },
    { id: 705, name: "Rami Shurrab", phoneNumber: "+970598105723", vehicleName: "Honda PCX", vehiclePlate: "DB-5560", availabilityStatus: "OFFLINE", verificationStatus: "UNDER_REVIEW", busyStatus: "AVAILABLE" },
  ];
}

// ---------------------------------------------------------------------------
// Orders
// ---------------------------------------------------------------------------

const ORDER_PATIENTS = buildAdminPatients();

export function buildAdminOrders(): AdminOrder[] {
  const extra = [
    { id: 5110, status: "PROCESSING", ago: 5, patient: 105, pharmacy: 202, amount: 14.6 },
    { id: 5111, status: "PENDING", ago: 7, patient: 106, pharmacy: 203, amount: 8.9 },
    { id: 5112, status: "DELIVERED", ago: 25, patient: 107, pharmacy: 202, amount: 11.2 },
    { id: 5113, status: "DELIVERED", ago: 29, patient: 108, pharmacy: 204, amount: 6.8 },
    { id: 5114, status: "DELIVERED", ago: 49, patient: 109, pharmacy: 202, amount: 7.0 },
    { id: 5115, status: "CANCELLED", ago: 54, patient: 110, pharmacy: 203, amount: 10.0 },
    { id: 5116, status: "DELIVERED", ago: 73, patient: 111, pharmacy: 205, amount: 5.2 },
    { id: 5117, status: "DELIVERED", ago: 77, patient: 112, pharmacy: 202, amount: 13.9 },
  ];

  const fromPatientSeeds: AdminOrder[] = PATIENT_ORDER_SEEDS.map((s) => ({
    id: s.id,
    createdAt: s.createdAt,
    status: s.status,
    totalAmount: money(12 + (s.id % 9)),
    currency: CURRENCY,
    patient: { id: 101, name: "Lina Haddad" },
    payment: { status: s.status === "DELIVERED" ? "PAID" : "PENDING", method: "CASH_ON_DELIVERY" },
    delivery: { status: s.status === "DELIVERED" ? "DELIVERED" : "PENDING" },
    pharmacyLabel:
      PHARMACIES.find((p) => p.pharmacyId === s.pharmacyId)?.pharmacyName ?? "Al-Shifa Pharmacy",
  }));

  const rest: AdminOrder[] = extra.map((e) => ({
    id: e.id,
    createdAt: hoursAgo(e.ago),
    status: e.status,
    totalAmount: money(e.amount),
    currency: CURRENCY,
    patient: {
      id: e.patient,
      name: ORDER_PATIENTS.find((p) => p.id === e.patient)?.name ?? "Patient",
    },
    payment: { status: e.status === "DELIVERED" ? "PAID" : "PENDING", method: e.id % 2 ? "CASH_ON_DELIVERY" : "CARD" },
    delivery: { status: e.status === "DELIVERED" ? "DELIVERED" : "PENDING" },
    pharmacyLabel:
      PHARMACIES.find((p) => p.pharmacyId === e.pharmacy)?.pharmacyName ?? "Al-Shifa Pharmacy",
  }));

  return [...fromPatientSeeds, ...rest].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );
}

// ---------------------------------------------------------------------------
// Inventory / medicines / categories / cities
// ---------------------------------------------------------------------------

export function buildAdminInventory(): AdminInventoryItem[] {
  return buildInventoryList().map((i, idx) => {
    const pharmacy = PHARMACIES[idx % 4];
    const m = MEDICINES.find((x) => x.id === i.medicineId)!;
    return {
      id: i.id,
      medicineId: i.medicineId,
      medicineName: i.medicineName,
      categoryName: i.categoryName,
      packDisplayName: i.packDisplayName,
      requiresPrescription: i.requiresPrescription,
      stockQuantity: i.stockQuantity,
      minStock: i.minStock,
      sellPrice: i.sellPrice,
      stockStatus: i.stockStatus,
      expiryDate: i.expiryDate,
      medicineImageUrl: m.images[0]?.url ?? null,
      isDeleted: false,
      pharmacy: {
        id: pharmacy.pharmacyId,
        pharmacyName: pharmacy.pharmacyName,
        verificationStatus: pharmacy.verificationStatus,
      },
    };
  });
}

export function buildAdminMedicines(): AdminMedicine[] {
  return MEDICINES.map((m, idx) => ({
    id: m.id,
    genericName: m.genericName,
    brandName: m.brandName,
    manufacturer: m.manufacturer,
    dosageForm: m.dosageForm,
    strengthValue: m.strengthValue,
    strengthUnit: m.strengthUnit,
    packSize: m.packSize,
    packUnit: m.packUnit,
    requiresPrescription: m.requiresPrescription,
    activeIngredients: m.genericName,
    status: idx === 9 ? "PENDING" : idx === 12 ? "PENDING" : "APPROVED",
    isActive: idx !== 11,
    minPrice: Number(m.minPrice),
    maxPrice: Number(m.maxPrice),
    categoryId: m.category.id,
    categoryName: m.category.name,
    images: m.images.map((img, i) => ({ imageUrl: img.url, sortOrder: i })),
  }));
}

export function buildAdminCategories(): AdminCategory[] {
  return CATEGORIES.map((c) => ({
    id: c.id,
    name: c.name,
    categoryImageUrl: c.categoryImageUrl,
    description: c.description,
    createdAt: c.createdAt,
    updatedAt: c.updatedAt,
  }));
}

export function buildAdminCities(): AdminCity[] {
  return CITIES.map((c) => ({
    id: c.id,
    name: c.name,
    cityDeliveryFee: CITY_DELIVERY_FEES[c.id],
  }));
}

// ---------------------------------------------------------------------------
// Deliveries
// ---------------------------------------------------------------------------

export function buildAdminDeliveries(): AdminDelivery[] {
  const drivers = buildAdminDrivers();
  // `driverId: null` models an unassigned delivery, which the API allows.
  const plan: Array<{
    id: number;
    orderId: number;
    status: AdminDelivery["status"];
    ago: number;
    driverId: number | null;
    earning: number | null;
    rating: number | null;
  }> = [
    { id: 8101, orderId: 5101, status: "EN_ROUTE", ago: 2, driverId: 701, earning: 2.5, rating: null },
    { id: 8102, orderId: 5110, status: "ASSIGNED", ago: 5, driverId: 702, earning: 2.5, rating: null },
    { id: 8103, orderId: 5103, status: "DELIVERED", ago: 96, driverId: 703, earning: 2.5, rating: 5 },
    { id: 8104, orderId: 5112, status: "DELIVERED", ago: 25, driverId: 701, earning: 2.5, rating: 4 },
    { id: 8105, orderId: 5113, status: "DELIVERED", ago: 29, driverId: 702, earning: 3, rating: 5 },
    { id: 8106, orderId: 5111, status: "PENDING", ago: 7, driverId: null, earning: null, rating: null },
    { id: 8107, orderId: 5114, status: "PICKUP_IN_PROGRESS", ago: 4, driverId: 703, earning: 2.5, rating: null },
    { id: 8108, orderId: 5117, status: "DELIVERED", ago: 77, driverId: 701, earning: 3, rating: 4 },
  ];

  return plan.map((p): AdminDelivery => {
    const d = p.driverId === null ? null : drivers.find((x) => x.id === p.driverId) ?? null;
    return {
      id: p.id,
      orderId: p.orderId,
      status: p.status,
      createdAt: hoursAgo(p.ago),
      acceptedAt: p.status === "PENDING" ? null : hoursAgo(p.ago - 0.5),
      deliveredAt: p.status === "DELIVERED" ? hoursAgo(p.ago - 1) : null,
      driver: d
        ? {
            id: d.id,
            name: d.name,
            phoneNumber: d.phoneNumber,
            vehicleName: d.vehicleName,
            vehiclePlate: d.vehiclePlate,
            availabilityStatus: d.availabilityStatus,
            verificationStatus: d.verificationStatus,
          }
        : null,
      earning: p.earning,
      rating: p.rating,
    };
  });
}
