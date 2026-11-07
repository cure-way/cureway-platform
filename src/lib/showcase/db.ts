/**
 * Showcase in-memory database.
 *
 * Seeded from the fixtures on first access. Local-only mutations (place an
 * order, accept a pharmacy order, edit stock, approve a pharmacy) write here,
 * so changes persist across navigation within a session and reset on reload
 * or when the visitor clicks "Reset demo".
 *
 * Nothing here is persisted — there is no backend and no storage write.
 */

import type {
  PatientAddressResponse,
  PatientOrderListItemDto,
  PharmacyOrderListItemDto,
  PharmacyOrderStatus,
  PrescriptionResponseDto,
} from "@/types/api.types";
import type { PharmacyOrderDTO } from "@/types/pharmacyOrders";
import type { InventoryListItem } from "@/types/pharmacyTypes";
import type { PatientProfile } from "@/services/profile.service";
import type { PharmacyProfileDTO } from "@/types/PharmacyProfile";
import type {
  AdminCategory,
  AdminCity,
  AdminDelivery,
  AdminDriver,
  AdminInventoryItem,
  AdminMedicine,
  AdminOrder,
  AdminPatient,
  AdminPharmacy,
} from "@/services/admin.service";

import {
  buildAdminCategories,
  buildAdminCities,
  buildAdminDeliveries,
  buildAdminDrivers,
  buildAdminInventory,
  buildAdminMedicines,
  buildAdminOrders,
  buildAdminPatients,
  buildAdminPharmacies,
} from "./fixtures/admin";
import { clone } from "./fixtures/common";
import { buildInventoryList } from "./fixtures/inventory";
import {
  buildPatientOrders,
  buildPharmacyOrdersLegacy,
  buildPharmacyOrdersModern,
} from "./fixtures/orders";
import {
  buildAddresses,
  buildAdminNotifications,
  buildPatientNotifications,
  buildPharmacyNotifications,
  buildPrescriptions,
  type ShowcaseNotification,
} from "./fixtures/patient";
import { PATIENT_FULL_PROFILE, PHARMACY_FULL_PROFILE } from "./fixtures/users";

export interface ShowcaseDb {
  patientProfile: PatientProfile;
  pharmacyProfile: PharmacyProfileDTO;

  patientOrders: PatientOrderListItemDto[];
  pharmacyOrdersLegacy: PharmacyOrderDTO[];
  pharmacyOrdersModern: PharmacyOrderListItemDto[];

  inventory: InventoryListItem[];
  addresses: PatientAddressResponse[];
  prescriptions: PrescriptionResponseDto[];

  adminPatients: AdminPatient[];
  adminPharmacies: AdminPharmacy[];
  adminDrivers: AdminDriver[];
  adminOrders: AdminOrder[];
  adminInventory: AdminInventoryItem[];
  adminMedicines: AdminMedicine[];
  adminCategories: AdminCategory[];
  adminCities: AdminCity[];
  adminDeliveries: AdminDelivery[];

  notifications: {
    patient: ShowcaseNotification[];
    pharmacy: ShowcaseNotification[];
    admin: ShowcaseNotification[];
  };

  /** Monotonic id source for records created during the session. */
  nextId: number;
}

function seed(): ShowcaseDb {
  return {
    patientProfile: clone(PATIENT_FULL_PROFILE),
    pharmacyProfile: clone(PHARMACY_FULL_PROFILE),

    patientOrders: buildPatientOrders(),
    pharmacyOrdersLegacy: buildPharmacyOrdersLegacy(),
    pharmacyOrdersModern: buildPharmacyOrdersModern(),

    inventory: buildInventoryList(),
    addresses: buildAddresses(),
    prescriptions: buildPrescriptions(),

    adminPatients: buildAdminPatients(),
    adminPharmacies: buildAdminPharmacies(),
    adminDrivers: buildAdminDrivers(),
    adminOrders: buildAdminOrders(),
    adminInventory: buildAdminInventory(),
    adminMedicines: buildAdminMedicines(),
    adminCategories: buildAdminCategories(),
    adminCities: buildAdminCities(),
    adminDeliveries: buildAdminDeliveries(),

    notifications: {
      patient: buildPatientNotifications(),
      pharmacy: buildPharmacyNotifications(),
      admin: buildAdminNotifications(),
    },

    nextId: 9000,
  };
}

let db: ShowcaseDb | null = null;

export function getDb(): ShowcaseDb {
  if (!db) db = seed();
  return db;
}

/** Restore pristine fixtures — backs the "Reset demo" action. */
export function resetDb(): void {
  db = seed();
}

export function nextId(): number {
  const d = getDb();
  d.nextId += 1;
  return d.nextId;
}

// ---------------------------------------------------------------------------
// Cross-view mutation helpers
//
// Pharmacy orders are exposed through two different API shapes; a status
// change has to land in both so the dashboard and the orders table agree.
// ---------------------------------------------------------------------------

export function setPharmacyOrderStatus(
  pharmacyOrderId: number,
  status: PharmacyOrderStatus,
): void {
  const d = getDb();
  const now = new Date().toISOString();

  const modern = d.pharmacyOrdersModern.find((o) => o.id === pharmacyOrderId);
  if (modern) {
    modern.status = status;
    modern.updatedAt = now;
  }

  // The legacy view only models PENDING / PREPARING / READY_FOR_PICKUP.
  const legacy = d.pharmacyOrdersLegacy.find(
    (o) => o.pharmacyOrderId === pharmacyOrderId,
  );
  if (legacy) {
    if (status === "PREPARING" || status === "READY_FOR_PICKUP" || status === "PENDING") {
      legacy.status = status;
    } else if (status === "ACCEPTED") {
      legacy.status = "PREPARING";
    }
    // REJECTED / CANCELLED have no legacy equivalent: drop the row so the
    // dashboard stops showing work that no longer exists.
    if (status === "REJECTED" || status === "CANCELLED") {
      d.pharmacyOrdersLegacy = d.pharmacyOrdersLegacy.filter(
        (o) => o.pharmacyOrderId !== pharmacyOrderId,
      );
    }
  }
}

export function setInventoryStock(
  inventoryId: number,
  patch: Partial<Pick<InventoryListItem, "stockQuantity" | "minStock" | "sellPrice" | "expiryDate">>,
): InventoryListItem | null {
  const d = getDb();
  const item = d.inventory.find((i) => i.id === inventoryId);
  if (!item) return null;

  Object.assign(item, patch);

  if (item.stockQuantity <= 0) item.stockStatus = "OUT_OF_STOCK";
  else if (item.stockQuantity <= item.minStock) item.stockStatus = "LOW_STOCK";
  else item.stockStatus = "IN_STOCK";

  // Keep the admin mirror of the same row consistent.
  const adminRow = d.adminInventory.find((i) => i.id === inventoryId);
  if (adminRow) {
    adminRow.stockQuantity = item.stockQuantity;
    adminRow.minStock = item.minStock;
    adminRow.sellPrice = item.sellPrice;
    adminRow.stockStatus = item.stockStatus;
  }

  return item;
}

export function removeInventory(inventoryId: number): boolean {
  const d = getDb();
  const before = d.inventory.length;
  d.inventory = d.inventory.filter((i) => i.id !== inventoryId);
  d.adminInventory = d.adminInventory.filter((i) => i.id !== inventoryId);
  return d.inventory.length < before;
}
