/**
 * Showcase route table.
 *
 * Maps every endpoint the app calls to a fixture-backed handler. This is the
 * single place where API response envelopes are produced, so the shapes can
 * never drift between services.
 *
 * Reference for the full endpoint inventory: docs/showcase-mode-plan.md §1.
 */

import type { DemoRole } from "./config";
import {
  getDb,
  nextId,
  removeInventory,
  setInventoryStock,
  setPharmacyOrderStatus,
} from "./db";
import {
  CATEGORIES,
  MEDICINES,
  PHARMACIES,
  stockForMedicine,
} from "./fixtures/catalog";
import { CITIES, CURRENCY, money } from "./fixtures/common";
import {
  buildInventoryDetails,
  buildMedicineSearchRows,
  inventoryIdFor,
} from "./fixtures/inventory";
import {
  buildPatientOrderDetails,
  buildPharmacyOrderDetail,
} from "./fixtures/orders";
import { DEMO_SESSIONS, DEMO_TOKENS } from "./fixtures/users";

// ---------------------------------------------------------------------------
// Errors
// ---------------------------------------------------------------------------

export class ShowcaseHttpError extends Error {
  constructor(
    readonly status: number,
    message: string,
  ) {
    super(message);
    this.name = "ShowcaseHttpError";
  }
}

const notFound = (what: string) =>
  new ShowcaseHttpError(404, `${what} not found in showcase data.`);

// ---------------------------------------------------------------------------
// Request context
// ---------------------------------------------------------------------------

export interface RouteCtx {
  /** Lowercase HTTP method. */
  method: string;
  /** Path with query string stripped, e.g. "/medicines/31". */
  path: string;
  /** Merged query params (from the URL and from axios `params`). */
  query: Record<string, string>;
  /** Parsed request body (object, or `FormData` for uploads). */
  body: Record<string, unknown>;
  /** Positional `:param` captures, in declaration order. */
  params: string[];
  /** The role currently being explored. */
  role: DemoRole;
}

type Handler = (ctx: RouteCtx) => unknown;

interface Route {
  method: string;
  pattern: RegExp;
  handler: Handler;
  /** Number of `:param` segments — fewer means more specific. */
  paramCount: number;
  /** Declaration index, to keep ordering stable among equal specificity. */
  order: number;
}

const routes: Route[] = [];

/** Convert "/medicines/:id" into an anchored regex with one capture group. */
function compile(path: string): RegExp {
  const escaped = path
    .replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
    .replace(/\/:([A-Za-z0-9_]+)/g, "/([^/]+)");
  return new RegExp(`^${escaped}/?$`);
}

function route(method: string, path: string, handler: Handler): void {
  routes.push({
    method: method.toLowerCase(),
    pattern: compile(path),
    handler,
    paramCount: (path.match(/\/:[A-Za-z0-9_]+/g) ?? []).length,
    order: routes.length,
  });
}

const get = (p: string, h: Handler) => route("get", p, h);
const post = (p: string, h: Handler) => route("post", p, h);
const patch = (p: string, h: Handler) => route("patch", p, h);
const put = (p: string, h: Handler) => route("put", p, h);
const del = (p: string, h: Handler) => route("delete", p, h);

// ---------------------------------------------------------------------------
// Envelope + list helpers
// ---------------------------------------------------------------------------

const ok = <T>(data: T) => ({ success: true as const, data });

function paginated<T>(rows: T[], ctx: RouteCtx) {
  const page = Math.max(1, Number(ctx.query.page) || 1);
  const limit = Math.max(1, Number(ctx.query.limit) || 10);
  const start = (page - 1) * limit;

  return {
    success: true as const,
    data: rows.slice(start, start + limit),
    meta: {
      total: rows.length,
      limit,
      page,
      totalPages: Math.max(1, Math.ceil(rows.length / limit)),
    },
  };
}

/** Case-insensitive search across the given fields. */
function search<T>(rows: T[], q: string | undefined, fields: Array<keyof T>): T[] {
  const term = q?.trim().toLowerCase();
  if (!term) return rows;
  return rows.filter((row) =>
    fields.some((f) => String(row[f] ?? "").toLowerCase().includes(term)),
  );
}

function sortByDate<T>(rows: T[], field: keyof T, order: string | undefined): T[] {
  const dir = order === "asc" ? 1 : -1;
  return [...rows].sort(
    (a, b) =>
      dir *
      (new Date(String(a[field])).getTime() - new Date(String(b[field])).getTime()),
  );
}

const num = (v: string | undefined) => Number(v);

// ===========================================================================
// AUTH
// ===========================================================================

function session(role: DemoRole) {
  const { user, profile } = DEMO_SESSIONS[role];
  return ok({ user, tokens: DEMO_TOKENS, profile });
}

post("/auth/login", (ctx) => session(ctx.role));
post("/auth/refresh", (ctx) => session(ctx.role));
post("/auth/logout", () => ok({ revoked: true }));
post("/auth/register/patient", () => session("PATIENT"));
post("/auth/register/pharmacy", () => session("PHARMACY"));
post("/auth/register/driver", () => session("PATIENT"));

// ===========================================================================
// SHARED LOOKUPS
// ===========================================================================

get("/cities", () => ok(CITIES.map((c) => ({ id: c.id, name: c.name }))));

// ===========================================================================
// PATIENT — profile
// ===========================================================================

get("/user/me", () => ok(getDb().patientProfile));

patch("/user/me", (ctx) => {
  const d = getDb();
  const { name, phoneNumber, profileImageUrl, dateOfBirth } = ctx.body as Record<
    string,
    string | undefined
  >;
  if (name) d.patientProfile.name = name;
  if (phoneNumber) d.patientProfile.phoneNumber = phoneNumber;
  if (profileImageUrl) d.patientProfile.profileImageUrl = profileImageUrl;
  if (dateOfBirth) d.patientProfile.dateOfBirth = dateOfBirth;
  d.patientProfile.updatedAt = new Date().toISOString();
  return ok(d.patientProfile);
});

// ===========================================================================
// PATIENT — catalog
// ===========================================================================

get("/categories", (ctx) => paginated(CATEGORIES, ctx));

get("/categories/featured", () =>
  CATEGORIES.slice(0, 4).map((c) => ({
    id: String(c.id),
    name: c.name,
    image: c.categoryImageUrl ?? "",
    imageAlt: c.name,
    description: c.description ?? undefined,
  })),
);

get("/categories/all", () =>
  CATEGORIES.map((c) => ({
    id: String(c.id),
    name: c.name,
    image: c.categoryImageUrl ?? "",
    imageAlt: c.name,
    description: c.description ?? undefined,
  })),
);

get("/categories/:name", (ctx) => {
  const name = decodeURIComponent(ctx.params[0]).toLowerCase();
  const c =
    CATEGORIES.find((x) => x.name.toLowerCase() === name) ??
    CATEGORIES.find((x) => String(x.id) === name);
  if (!c) throw notFound(`Category ${ctx.params[0]}`);
  return {
    id: String(c.id),
    name: c.name,
    image: c.categoryImageUrl ?? "",
    imageAlt: c.name,
    description: c.description ?? undefined,
  };
});

get("/products/most-sales", () =>
  MEDICINES.slice(0, 3).map((m) => ({
    id: String(m.id),
    title: m.brandName,
    description: `${m.genericName} ${m.strengthValue}${m.strengthUnit} · pack of ${m.packSize}`,
    image: m.images[0]?.url ?? "",
    buttonText: "Shop now",
    buttonColor: (["blue", "green", "orange"] as const)[m.id % 3],
  })),
);

get("/products/recommended", () =>
  MEDICINES.slice(3, 9).map((m) => ({
    id: String(m.id),
    name: m.brandName,
    image: m.images[0]?.url ?? "",
    category: m.category.name,
    description: `${m.genericName} · ${m.manufacturer}`,
    price: Number(m.minPrice),
    badge: m.id % 5 === 0 ? ("popular" as const) : undefined,
  })),
);

get("/medicines", (ctx) => {
  let rows = [...MEDICINES];

  const q = ctx.query.q?.trim().toLowerCase();
  if (q) {
    rows = rows.filter(
      (m) =>
        m.brandName.toLowerCase().includes(q) ||
        m.genericName.toLowerCase().includes(q) ||
        m.manufacturer.toLowerCase().includes(q) ||
        m.category.name.toLowerCase().includes(q),
    );
  }

  const categoryId = num(ctx.query.categoryId);
  if (!Number.isNaN(categoryId)) {
    rows = rows.filter((m) => m.category.id === categoryId);
  }

  if (ctx.query.requiresPrescription !== undefined) {
    const want = ctx.query.requiresPrescription === "true";
    rows = rows.filter((m) => m.requiresPrescription === want);
  }

  const minPrice = num(ctx.query.minPrice);
  if (!Number.isNaN(minPrice)) {
    rows = rows.filter((m) => Number(m.maxPrice) >= minPrice);
  }
  const maxPrice = num(ctx.query.maxPrice);
  if (!Number.isNaN(maxPrice)) {
    rows = rows.filter((m) => Number(m.minPrice) <= maxPrice);
  }

  return paginated(rows, { ...ctx, query: { limit: "12", ...ctx.query } });
});

get("/medicines/:id", (ctx) => {
  const m = MEDICINES.find((x) => x.id === Number(ctx.params[0]));
  if (!m) throw notFound(`Medicine ${ctx.params[0]}`);
  return ok(m);
});

get("/medicines/:id/pharmacies", (ctx) =>
  paginated(stockForMedicine(Number(ctx.params[0])), ctx),
);

// ===========================================================================
// PATIENT — addresses
// ===========================================================================

get("/addresses", (ctx) => paginated(getDb().addresses, ctx));

get("/addresses/:id", (ctx) => {
  const a = getDb().addresses.find((x) => x.id === Number(ctx.params[0]));
  if (!a) throw notFound(`Address ${ctx.params[0]}`);
  return ok(a);
});

post("/addresses", (ctx) => {
  const d = getDb();
  const body = ctx.body as Record<string, unknown>;
  const city = CITIES.find((c) => c.id === Number(body.cityId)) ?? CITIES[0];

  const created = {
    id: nextId(),
    cityId: city.id,
    cityName: city.name,
    addressLine1: String(body.addressLine1 ?? "Unnamed address"),
    addressLine2: (body.addressLine2 as string | null) ?? null,
    label: (body.label as string | null) ?? "Delivery address",
    region: (body.region as string | null) ?? `${city.name} Governorate`,
    area: (body.area as string | null) ?? null,
    latitude: (body.latitude as number | null) ?? null,
    longitude: (body.longitude as number | null) ?? null,
    isDefault: Boolean(body.isDefault),
  };

  if (created.isDefault) d.addresses.forEach((a) => (a.isDefault = false));
  d.addresses.push(created);
  return ok(created);
});

patch("/addresses/:id", (ctx) => {
  const a = getDb().addresses.find((x) => x.id === Number(ctx.params[0]));
  if (!a) throw notFound(`Address ${ctx.params[0]}`);
  Object.assign(a, ctx.body);
  return ok(a);
});

patch("/addresses/:id/default", (ctx) => {
  const d = getDb();
  const a = d.addresses.find((x) => x.id === Number(ctx.params[0]));
  if (!a) throw notFound(`Address ${ctx.params[0]}`);
  d.addresses.forEach((x) => (x.isDefault = false));
  a.isDefault = true;
  return ok(a);
});

del("/addresses/:id", (ctx) => {
  const d = getDb();
  d.addresses = d.addresses.filter((x) => x.id !== Number(ctx.params[0]));
  return ok({ deleted: true });
});

// ===========================================================================
// PATIENT — prescriptions and uploads
// ===========================================================================

post("/file/upload", () =>
  // Showcase mode never stores a file; the UI labels the preview accordingly.
  ok({ url: "/patient/Upload-Prescription.png" }),
);

post("/prescriptions", (ctx) => {
  const d = getDb();
  const fileUrls = (ctx.body.fileUrls as string[] | undefined) ?? [];
  const created = {
    id: nextId(),
    status: "UNDER_REVIEW" as const,
    reuploadReason: null,
    reuploadRequestedAt: null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    isActive: true,
    files: fileUrls.map((url, i) => ({ id: nextId(), url, sortOrder: i })),
  };
  d.prescriptions.unshift(created);
  return ok(created);
});

get("/prescriptions/my/:id", (ctx) => {
  const p = getDb().prescriptions.find((x) => x.id === Number(ctx.params[0]));
  if (!p) throw notFound(`Prescription ${ctx.params[0]}`);
  return ok(p);
});

get("/prescriptions/:id", (ctx) => {
  const p = getDb().prescriptions.find((x) => x.id === Number(ctx.params[0]));
  if (!p) throw notFound(`Prescription ${ctx.params[0]}`);
  return ok(p);
});

patch("/prescriptions/my/:id/reupload", (ctx) => {
  const p = getDb().prescriptions.find((x) => x.id === Number(ctx.params[0]));
  if (!p) throw notFound(`Prescription ${ctx.params[0]}`);
  const fileUrls = (ctx.body.fileUrls as string[] | undefined) ?? [];
  p.status = "UNDER_REVIEW";
  p.reuploadReason = null;
  p.updatedAt = new Date().toISOString();
  if (fileUrls.length) {
    p.files = fileUrls.map((url, i) => ({ id: nextId(), url, sortOrder: i }));
  }
  return ok(p);
});

// ===========================================================================
// PATIENT — orders
// ===========================================================================

get("/orders", (ctx) => {
  const d = getDb();
  let rows = [...d.patientOrders];

  switch (ctx.query.filter) {
    case "ACTIVE":
      rows = rows.filter((o) =>
        ["PENDING", "PROCESSING", "ON_THE_WAY"].includes(o.status),
      );
      break;
    case "DELIVERED":
      rows = rows.filter((o) => o.status === "DELIVERED");
      break;
    case "CANCELLED":
      rows = rows.filter((o) =>
        ["CANCELLED", "PARTIALLY_CANCELLED"].includes(o.status),
      );
      break;
    default:
      break;
  }

  const orderId = num(ctx.query.orderId);
  if (!Number.isNaN(orderId)) rows = rows.filter((o) => o.id === orderId);

  const pharmacyId = num(ctx.query.pharmacyId);
  if (!Number.isNaN(pharmacyId)) {
    rows = rows.filter((o) =>
      o.pharmacyOrders?.some((p) => p.pharmacyId === pharmacyId),
    );
  }

  return paginated(sortByDate(rows, "createdAt", ctx.query.sortOrder), {
    ...ctx,
    query: { limit: "20", ...ctx.query },
  });
});

get("/orders/:id", (ctx) => {
  const id = Number(ctx.params[0]);
  const live = getDb().patientOrders.find((o) => o.id === id);
  const detail = buildPatientOrderDetails(id);

  if (detail) {
    // Reflect any status change made during this session.
    if (live) detail.status = live.status;
    return detail;
  }

  // Orders created during the session have no static detail fixture; derive one.
  if (!live) throw notFound(`Order ${id}`);
  return {
    ...live,
    pharmacyOrders: (live.pharmacyOrders ?? []).map((p) => ({
      pharmacyOrderId: p.pharmacyOrderId,
      pharmacyId: p.pharmacyId,
      pharmacyName: p.pharmacyName,
      status: p.status,
      pharmacyLocation: (() => {
        const ph = PHARMACIES.find((x) => x.pharmacyId === p.pharmacyId);
        return {
          address: ph?.addressLine ?? null,
          latitude: ph?.latitude ?? null,
          longitude: ph?.longitude ?? null,
        };
      })(),
      subtotal: p.subtotal,
      requiresPrescription: p.requiresPrescription,
      prescriptionId: p.prescriptionId ?? null,
      prescriptionStatus: p.prescriptionStatus,
      items: [],
      rejectedAt: null,
      rejectionReason: null,
    })),
    delivery: null,
  };
});

post("/orders", (ctx) => {
  const d = getDb();
  const body = ctx.body as Record<string, unknown>;
  const pharmacyGroups =
    (body.pharmacies as Array<{
      pharmacyId: number;
      items: Array<{ inventoryId: number; quantity: number }>;
    }>) ?? [];

  const id = nextId();
  const now = new Date().toISOString();

  const groups = pharmacyGroups.map((g) => {
    const pharmacy =
      PHARMACIES.find((p) => p.pharmacyId === g.pharmacyId) ?? PHARMACIES[0];

    const items = g.items.map((it) => {
      const inv = d.inventory.find((i) => i.id === it.inventoryId);
      const med = MEDICINES.find((m) => inventoryIdFor(m.id) === it.inventoryId);
      const unitPrice = inv?.sellPrice ?? Number(med?.minPrice ?? 0);
      return {
        inventoryId: it.inventoryId,
        medicineId: med?.id ?? it.inventoryId,
        medicineName: inv?.medicineName ?? med?.brandName ?? "Medicine",
        quantity: it.quantity,
        unitPrice,
        totalPrice: money(unitPrice * it.quantity),
      };
    });

    const subtotal = money(items.reduce((s, i) => s + i.totalPrice, 0));

    return {
      pharmacyOrderId: nextId(),
      pharmacyId: pharmacy.pharmacyId,
      pharmacyName: pharmacy.pharmacyName,
      status: "PENDING",
      pharmacyLocation: {
        address: pharmacy.addressLine,
        latitude: pharmacy.latitude,
        longitude: pharmacy.longitude,
      },
      subtotal,
      requiresPrescription: items.some(
        (i) => MEDICINES.find((m) => m.id === i.medicineId)?.requiresPrescription,
      ),
      prescriptionId: null,
      prescriptionStatus: undefined,
      items,
    };
  });

  const subtotal = money(groups.reduce((s, g) => s + g.subtotal, 0));
  const deliveryFee = 3;
  const address = d.addresses.find((a) => a.isDefault) ?? d.addresses[0];

  // Record it so it appears in "My orders" straight away.
  d.patientOrders.unshift({
    id,
    status: "PENDING",
    createdAt: now,
    updatedAt: now,
    subAmount: subtotal,
    deliveryFee,
    totalAmount: money(subtotal + deliveryFee),
    currency: CURRENCY,
    deliveryAddress: {
      addressText: address?.addressLine1 ?? "Gaza",
      lat: address?.latitude ?? null,
      lng: address?.longitude ?? null,
    },
    pharmacyOrders: groups.map((g) => ({
      pharmacyOrderId: g.pharmacyOrderId,
      pharmacyId: g.pharmacyId,
      pharmacyName: g.pharmacyName,
      status: g.status,
      subtotal: g.subtotal,
      requiresPrescription: g.requiresPrescription,
      prescriptionId: null,
      itemsCount: g.items.length,
    })),
  });

  const profile = d.patientProfile;

  return {
    id,
    contactName: profile.name,
    contactPhone: profile.phoneNumber,
    contactEmail: profile.email,
    status: "PENDING",
    notes: (body.notes as string | undefined) ?? null,
    currency: CURRENCY,
    createdAt: now,
    deliveryAddress: {
      addressText: address?.addressLine1 ?? "Gaza",
      lat: address?.latitude ?? null,
      lng: address?.longitude ?? null,
    },
    subtotal,
    deliveryFee,
    discount: 0,
    total: money(subtotal + deliveryFee),
    itemsCount: groups.reduce((s, g) => s + g.items.length, 0),
    pharmacies: groups,
  };
});

patch("/orders/:id/cancel", (ctx) => {
  const d = getDb();
  const id = Number(ctx.params[0]);
  const order = d.patientOrders.find((o) => o.id === id);
  if (!order) throw notFound(`Order ${id}`);
  order.status = "CANCELLED";
  order.updatedAt = new Date().toISOString();
  order.pharmacyOrders?.forEach((p) => (p.status = "CANCELLED"));
  return { id, status: "CANCELLED" as const };
});

// ===========================================================================
// PHARMACY — profile
// ===========================================================================

get("/pharmacies/me", () => ok(getDb().pharmacyProfile));

// ===========================================================================
// PHARMACY — orders
//
// Two endpoint shapes exist in the codebase (plan gap #3); both are served.
// ===========================================================================

/** `GET /pharmacy-orders` → PharmacyOrderDTO rows. */
get("/pharmacy-orders", (ctx) => {
  const d = getDb();
  let rows = [...d.pharmacyOrdersLegacy];

  switch (ctx.query.filter) {
    case "NEW":
      rows = rows.filter((o) => o.status === "PENDING");
      break;
    case "DELIVERED":
      rows = rows.filter((o) => o.status === "READY_FOR_PICKUP");
      break;
    case "PAST":
      rows = rows.filter((o) => o.status !== "PENDING");
      break;
    default:
      break;
  }

  const q = ctx.query.q?.trim().toLowerCase();
  if (q) {
    rows = rows.filter(
      (o) =>
        String(o.orderId).includes(q) ||
        o.patient.patientName.toLowerCase().includes(q) ||
        o.items.some((i) => i.medicineDisplayName.toLowerCase().includes(q)),
    );
  }

  return paginated(sortByDate(rows, "createdAt", ctx.query.sortOrder), {
    ...ctx,
    query: { limit: "10", ...ctx.query },
  });
});

/** `GET /pharmacy-order/my` → PharmacyOrderListItemDto rows. */
get("/pharmacy-order/my", (ctx) => {
  const d = getDb();
  let rows = [...d.pharmacyOrdersModern];
  if (ctx.query.status) rows = rows.filter((o) => o.status === ctx.query.status);
  return paginated(sortByDate(rows, "createdAt", ctx.query.sortOrder), {
    ...ctx,
    query: { limit: "10", ...ctx.query },
  });
});

get("/pharmacy-order/my/:id", (ctx) => {
  const id = Number(ctx.params[0]);
  const detail = buildPharmacyOrderDetail(id);
  if (!detail) throw notFound(`Pharmacy order ${id}`);
  const live = getDb().pharmacyOrdersModern.find((o) => o.id === id);
  if (live) detail.status = live.status;
  return detail;
});

get("/pharmacy-orders/:id", (ctx) => {
  const id = Number(ctx.params[0]);
  const detail = buildPharmacyOrderDetail(id);
  if (!detail) throw notFound(`Pharmacy order ${id}`);
  const live = getDb().pharmacyOrdersModern.find((o) => o.id === id);
  if (live) detail.status = live.status;
  return detail;
});

function decide(ctx: RouteCtx) {
  const id = Number(ctx.params[0]);
  const decision = String(ctx.body.decision ?? "ACCEPTED");
  const status = decision === "REJECTED" ? "REJECTED" : "ACCEPTED";

  setPharmacyOrderStatus(id, status);

  const detail = buildPharmacyOrderDetail(id);
  if (!detail) throw notFound(`Pharmacy order ${id}`);
  detail.status = status;
  if (status === "REJECTED") {
    detail.rejectedAt = new Date().toISOString();
    detail.rejectionReason =
      (ctx.body.rejectionReason as string | undefined) ?? "Rejected by pharmacy";
  }
  return detail;
}

function progress(ctx: RouteCtx) {
  const id = Number(ctx.params[0]);
  const status = String(ctx.body.status ?? "PREPARING") as
    | "PREPARING"
    | "READY_FOR_PICKUP";

  setPharmacyOrderStatus(id, status);

  const detail = buildPharmacyOrderDetail(id);
  if (!detail) throw notFound(`Pharmacy order ${id}`);
  detail.status = status;
  return detail;
}

patch("/pharmacy-order/:id/decision", decide);
patch("/pharmacy-orders/:id/decision", decide);
patch("/pharmacy-order/:id/status", progress);
patch("/pharmacy-orders/:id/status", progress);

// ===========================================================================
// PHARMACY — inventory
// ===========================================================================

get("/inventory", (ctx) => {
  const d = getDb();
  let rows = [...d.inventory];

  if (ctx.query.stockStatus) {
    rows = rows.filter((i) => i.stockStatus === ctx.query.stockStatus);
  }

  const medicineId = num(ctx.query.medicineId);
  if (!Number.isNaN(medicineId)) {
    rows = rows.filter((i) => i.medicineId === medicineId);
  }

  rows = search(rows, ctx.query.q, ["medicineName", "categoryName"]);

  return paginated(rows, { ...ctx, query: { limit: "10", ...ctx.query } });
});

get("/inventory/:id", (ctx) => {
  const id = Number(ctx.params[0]);
  const details = buildInventoryDetails(id);
  if (!details) throw notFound(`Inventory item ${id}`);

  const live = getDb().inventory.find((i) => i.id === id);
  if (live) {
    details.stockQuantity = live.stockQuantity;
    details.minStock = live.minStock;
    details.sellPrice = live.sellPrice;
    details.expiryDate = live.expiryDate;
    details.isAvailable = live.stockQuantity > 0;
  }
  return ok(details);
});

post("/inventory", (ctx) => {
  const d = getDb();
  const body = ctx.body as Record<string, unknown>;
  const medicineId = Number(body.medicineId);
  const med = MEDICINES.find((m) => m.id === medicineId) ?? MEDICINES[0];
  const id = nextId();
  const now = new Date().toISOString();

  const stockQuantity = Number(body.stockQuantity ?? 0);
  const minStock = Number(body.minStock ?? 10);

  d.inventory.unshift({
    id,
    medicineId: med.id,
    medicineName: `${med.brandName} ${med.strengthValue}${med.strengthUnit}`,
    categoryName: med.category.name,
    packDisplayName: `${med.packSize} ${med.packUnit}`,
    requiresPrescription: med.requiresPrescription,
    stockQuantity,
    minStock,
    sellPrice: Number(body.sellPrice ?? med.minPrice),
    stockStatus:
      stockQuantity <= 0
        ? "OUT_OF_STOCK"
        : stockQuantity <= minStock
          ? "LOW_STOCK"
          : "IN_STOCK",
    expiryDate: String(body.expiryDate ?? ""),
  });

  return ok({
    id: String(id),
    medicineId: String(med.id),
    stockQuantity,
    sellPrice: Number(body.sellPrice ?? med.minPrice),
    costPrice: (body.costPrice as number | null) ?? null,
    minStock,
    batchNumber: (body.batchNumber as string | null) ?? null,
    expiryDate: (body.expiryDate as string | null) ?? null,
    shelfLocation: (body.shelfLocation as string | null) ?? null,
    notes: (body.notes as string | null) ?? null,
    imageUrl: med.images[0]?.url ?? null,
    createdAt: now,
    updatedAt: now,
  });
});

patch("/inventory/:id", (ctx) => {
  const id = Number(ctx.params[0]);
  const body = ctx.body as Record<string, unknown>;
  const patchData: Record<string, number | string> = {};

  if (body.stockQuantity !== undefined) patchData.stockQuantity = Number(body.stockQuantity);
  if (body.minStock !== undefined) patchData.minStock = Number(body.minStock);
  if (body.sellPrice !== undefined) patchData.sellPrice = Number(body.sellPrice);
  if (body.expiryDate) patchData.expiryDate = String(body.expiryDate);

  const updated = setInventoryStock(id, patchData);
  if (!updated) throw notFound(`Inventory item ${id}`);

  const details = buildInventoryDetails(id);
  return ok(details ?? updated);
});

del("/inventory/:id", (ctx) => {
  const removed = removeInventory(Number(ctx.params[0]));
  if (!removed) throw notFound(`Inventory item ${ctx.params[0]}`);
  return ok({ deleted: true });
});

get("/medicines/search", () => ok(buildMedicineSearchRows()));

// ===========================================================================
// ADMIN
// ===========================================================================

get("/users/admin", (ctx) => {
  let rows = [...getDb().adminPatients];
  if (ctx.query.status) rows = rows.filter((p) => p.status === ctx.query.status);
  rows = search(rows, ctx.query.q, ["name", "email", "phoneNumber"]);
  return paginated(rows, ctx);
});

get("/users/admin/:id", (ctx) => {
  const d = getDb();
  const base = d.adminPatients.find((p) => p.id === Number(ctx.params[0]));
  if (!base) throw notFound(`User ${ctx.params[0]}`);
  return ok({
    ...base,
    dateOfBirth: null,
    profileImageUrl: null,
    isEmailVerified: true,
    isPhoneVerified: true,
    updatedAt: base.createdAt,
  });
});

get("/pharmacies/admin", (ctx) => {
  let rows = [...getDb().adminPharmacies];
  if (ctx.query.verificationStatus) {
    rows = rows.filter((p) => p.verificationStatus === ctx.query.verificationStatus);
  }
  rows = search(rows, ctx.query.q, ["pharmacyName", "cityName", "phoneNumber"]);
  return paginated(rows, ctx);
});

get("/pharmacies/admin/:id", (ctx) => {
  const p = getDb().adminPharmacies.find((x) => x.id === Number(ctx.params[0]));
  if (!p) throw notFound(`Pharmacy ${ctx.params[0]}`);
  const src = PHARMACIES.find((x) => x.pharmacyId === p.id);
  return ok({
    ...p,
    licenseNumber: src?.licenseNumber ?? "PS-GZ-0000-0000",
    licenseDocumentUrl: "/patient/Upload-Prescription.png",
  });
});

patch("/pharmacies/admin/:id/verification", (ctx) => {
  const p = getDb().adminPharmacies.find((x) => x.id === Number(ctx.params[0]));
  if (!p) throw notFound(`Pharmacy ${ctx.params[0]}`);
  p.verificationStatus = String(ctx.body.verificationStatus ?? "VERIFIED");
  return ok(p);
});

get("/drivers/admin", (ctx) => {
  let rows = [...getDb().adminDrivers];
  if (ctx.query.verificationStatus) {
    rows = rows.filter((d) => d.verificationStatus === ctx.query.verificationStatus);
  }
  if (ctx.query.availabilityStatus) {
    rows = rows.filter((d) => d.availabilityStatus === ctx.query.availabilityStatus);
  }
  rows = search(rows, ctx.query.q, ["name", "phoneNumber", "vehiclePlate"]);
  return paginated(rows, ctx);
});

get("/drivers/admin/:id", (ctx) => {
  const d = getDb().adminDrivers.find((x) => x.id === Number(ctx.params[0]));
  if (!d) throw notFound(`Driver ${ctx.params[0]}`);
  return ok({
    ...d,
    licenseNumber: `DL-${d.id}-GZ`,
    licenseDocumentUrl: "/patient/Upload-Prescription.png",
  });
});

patch("/drivers/admin/:id/verification", (ctx) => {
  const d = getDb().adminDrivers.find((x) => x.id === Number(ctx.params[0]));
  if (!d) throw notFound(`Driver ${ctx.params[0]}`);
  d.verificationStatus = String(
    ctx.body.verificationStatus ?? "VERIFIED",
  ) as typeof d.verificationStatus;
  return ok(d);
});

get("/orders/admin", (ctx) => {
  let rows = [...getDb().adminOrders];
  if (ctx.query.status) rows = rows.filter((o) => o.status === ctx.query.status);
  const q = ctx.query.q?.trim().toLowerCase();
  if (q) {
    rows = rows.filter(
      (o) =>
        String(o.id).includes(q) ||
        o.patient.name.toLowerCase().includes(q) ||
        o.pharmacyLabel.toLowerCase().includes(q),
    );
  }
  return paginated(rows, ctx);
});

get("/orders/admin/:id", (ctx) => {
  const o = getDb().adminOrders.find((x) => x.id === Number(ctx.params[0]));
  if (!o) throw notFound(`Order ${ctx.params[0]}`);
  return ok({
    id: o.id,
    createdAt: o.createdAt,
    status: o.status,
    subtotalAmount: money(o.totalAmount - 3),
    discountAmount: 0,
    deliveryFeeAmount: 3,
    totalAmount: o.totalAmount,
    currency: o.currency,
    deliveryType: "STANDARD",
    notes: "",
    patient: {
      id: o.patient.id,
      name: o.patient.name,
      phoneNumber: "+970592440118",
      email: "patient@example.ps",
    },
    payment: {
      id: o.id + 100,
      status: o.payment.status,
      method: o.payment.method,
      amount: o.totalAmount,
      currency: o.currency,
    },
    delivery: { id: o.id + 200, status: o.delivery.status, acceptedAt: null },
  });
});

get("/inventory/admin", (ctx) => {
  let rows = [...getDb().adminInventory];
  const pharmacyId = num(ctx.query.pharmacyId);
  if (!Number.isNaN(pharmacyId)) {
    rows = rows.filter((i) => i.pharmacy.id === pharmacyId);
  }
  rows = search(rows, ctx.query.q, ["medicineName", "categoryName"]);
  return paginated(rows, ctx);
});

get("/inventory/admin/:id", (ctx) => {
  const i = getDb().adminInventory.find((x) => x.id === Number(ctx.params[0]));
  if (!i) throw notFound(`Inventory item ${ctx.params[0]}`);
  return ok(i);
});

get("/medicines/admin", (ctx) => {
  let rows = [...getDb().adminMedicines];
  if (ctx.query.status) rows = rows.filter((m) => m.status === ctx.query.status);
  const categoryId = num(ctx.query.categoryId);
  if (!Number.isNaN(categoryId)) rows = rows.filter((m) => m.categoryId === categoryId);
  rows = search(rows, ctx.query.q, ["brandName", "genericName", "manufacturer"]);
  return paginated(rows, ctx);
});

get("/medicines/admin/:id", (ctx) => {
  const m = getDb().adminMedicines.find((x) => x.id === Number(ctx.params[0]));
  if (!m) throw notFound(`Medicine ${ctx.params[0]}`);
  return ok(m);
});

patch("/medicines/admin/:id/activation", (ctx) => {
  const m = getDb().adminMedicines.find((x) => x.id === Number(ctx.params[0]));
  if (!m) throw notFound(`Medicine ${ctx.params[0]}`);
  m.isActive = Boolean(ctx.body.isActive ?? !m.isActive);
  return ok(m);
});

patch("/medicines/admin/:id/review", (ctx) => {
  const m = getDb().adminMedicines.find((x) => x.id === Number(ctx.params[0]));
  if (!m) throw notFound(`Medicine ${ctx.params[0]}`);
  m.status = String(ctx.body.status ?? "APPROVED") as typeof m.status;
  return ok(m);
});

get("/categories/admin", (ctx) => paginated(getDb().adminCategories, ctx));
get("/cities/admin", (ctx) => paginated(getDb().adminCities, ctx));

get("/deliveries/admin", (ctx) => {
  let rows = [...getDb().adminDeliveries];
  if (ctx.query.status) rows = rows.filter((d) => d.status === ctx.query.status);
  const q = ctx.query.q?.trim().toLowerCase();
  if (q) {
    rows = rows.filter(
      (d) =>
        String(d.orderId).includes(q) ||
        (d.driver?.name ?? "").toLowerCase().includes(q),
    );
  }
  return paginated(rows, ctx);
});

get("/deliveries/admin/:id", (ctx) => {
  const d = getDb().adminDeliveries.find((x) => x.id === Number(ctx.params[0]));
  if (!d) throw notFound(`Delivery ${ctx.params[0]}`);
  return ok(d);
});

// ---------------------------------------------------------------------------
// Catch-all for admin writes that are intentionally disabled in showcase mode.
// The UI blocks these before they are called; this is a backstop so a stray
// call produces a clean, explained 403 rather than an unmatched-route 404.
// ---------------------------------------------------------------------------

const DISABLED_WRITE = () => {
  throw new ShowcaseHttpError(
    403,
    "This action is disabled in showcase mode (no backend).",
  );
};

post("/medicines/admin", DISABLED_WRITE);
patch("/medicines/admin/:id", DISABLED_WRITE);
post("/categories/admin", DISABLED_WRITE);
patch("/categories/admin/:id", DISABLED_WRITE);
post("/cities/admin", DISABLED_WRITE);
patch("/cities/admin/:id", DISABLED_WRITE);
del("/cities/admin/:id", DISABLED_WRITE);
put("/cities/admin/:id/delivery-fee", DISABLED_WRITE);

// ===========================================================================
// Resolution
// ===========================================================================

/** Endpoints requested but not in the table — asserted empty by verification. */
export const unmatched: string[] = [];

export interface Resolved {
  body: unknown;
}

/**
 * Literal routes must be tried before parameterised ones.
 *
 * `/orders/:id` otherwise swallows `/orders/admin`, which silently emptied the
 * admin orders page: the id route parsed "admin" as NaN, found no order and
 * returned 404. The same collision applies to /medicines/admin,
 * /medicines/search and /inventory/admin. Sorting by specificity makes the
 * table order-independent so adding a route cannot shadow an existing one.
 */
let sorted = false;

function ensureSorted(): void {
  if (sorted) return;
  routes.sort((a, b) => a.paramCount - b.paramCount || a.order - b.order);
  sorted = true;
}

export function resolve(ctx: Omit<RouteCtx, "params">): Resolved {
  ensureSorted();

  for (const r of routes) {
    if (r.method !== ctx.method) continue;
    const m = ctx.path.match(r.pattern);
    if (!m) continue;
    return { body: r.handler({ ...ctx, params: m.slice(1) }) };
  }

  const key = `${ctx.method.toUpperCase()} ${ctx.path}`;
  if (!unmatched.includes(key)) unmatched.push(key);
  throw notFound(`Route ${key}`);
}

/** Total number of declared routes — handy for coverage assertions. */
export const routeCount = routes.length;
