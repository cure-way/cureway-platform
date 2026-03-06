import { httpGet, httpPatch, httpPost, httpDelete, httpPut } from "@/lib/api/http";

/* ===================================================================
   SHARED
   =================================================================== */

export interface PaginationMeta {
  total: number;
  limit: number;
  page: number;
  totalPages: number;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  meta: PaginationMeta;
}

export interface SingleResponse<T> {
  success: boolean;
  data: T;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
  q?: string;
}

/* ===================================================================
   PATIENTS  (GET /users/admin)
   =================================================================== */

export interface AdminPatient {
  id: number;
  name: string;
  email: string;
  phoneNumber: string;
  role: string;
  status: "ACTIVE" | "INACTIVE";
  createdAt: string;
}

export interface AdminPatientDetail extends AdminPatient {
  dateOfBirth: string | null;
  profileImageUrl: string | null;
  isEmailVerified: boolean;
  isPhoneVerified: boolean;
  updatedAt: string;
}

interface PatientParams extends PaginationParams {
  status?: "ACTIVE" | "INACTIVE";
}

export function getAdminPatients(params: PatientParams = {}) {
  return httpGet<PaginatedResponse<AdminPatient>>("/users/admin", { params });
}

export function getAdminPatientById(id: number) {
  return httpGet<SingleResponse<AdminPatientDetail>>(`/users/admin/${id}`);
}

/* ===================================================================
   PHARMACIES  (GET /pharmacies/admin)
   =================================================================== */

export interface AdminPharmacy {
  id: number;
  pharmacyName: string;
  phoneNumber: string;
  cityName: string;
  verificationStatus: string;
  addressLine: string | null;
  latitude: number | null;
  longitude: number | null;
}

export interface AdminPharmacyDetail extends AdminPharmacy {
  licenseNumber: string;
  licenseDocumentUrl: string | null;
}

interface PharmacyParams extends PaginationParams {
  verificationStatus?: "UNDER_REVIEW" | "VERIFIED" | "REJECTED";
  userStatus?: "ACTIVE" | "INACTIVE";
}

export function getAdminPharmacies(params: PharmacyParams = {}) {
  return httpGet<PaginatedResponse<AdminPharmacy>>("/pharmacies/admin", { params });
}

export function getAdminPharmacyById(id: number) {
  return httpGet<SingleResponse<AdminPharmacyDetail>>(`/pharmacies/admin/${id}`);
}

export function updatePharmacyVerification(id: number, verificationStatus: "VERIFIED" | "REJECTED") {
  return httpPatch<SingleResponse<AdminPharmacy>>(`/pharmacies/admin/${id}/verification`, { verificationStatus });
}

/* ===================================================================
   DRIVERS  (GET /drivers/admin)
   =================================================================== */

export interface AdminDriver {
  id: number;
  name: string;
  phoneNumber: string;
  vehicleName: string;
  vehiclePlate: string;
  availabilityStatus: "ONLINE" | "OFFLINE";
  verificationStatus: "UNDER_REVIEW" | "VERIFIED" | "REJECTED";
  busyStatus: "AVAILABLE" | "BUSY";
}

export interface AdminDriverDetail extends AdminDriver {
  licenseNumber: string;
  licenseDocumentUrl: string;
}

interface DriverParams extends PaginationParams {
  verificationStatus?: "UNDER_REVIEW" | "VERIFIED" | "REJECTED";
  userStatus?: "ACTIVE" | "INACTIVE";
  availabilityStatus?: "ONLINE" | "OFFLINE";
}

export function getAdminDrivers(params: DriverParams = {}) {
  return httpGet<PaginatedResponse<AdminDriver>>("/drivers/admin", { params });
}

export function getAdminDriverById(id: number) {
  return httpGet<SingleResponse<AdminDriverDetail>>(`/drivers/admin/${id}`);
}

export function updateDriverVerification(id: number, verificationStatus: "VERIFIED" | "REJECTED") {
  return httpPatch<SingleResponse<AdminDriver>>(`/drivers/admin/${id}/verification`, { verificationStatus });
}

/* ===================================================================
   ORDERS  (GET /orders/admin)
   =================================================================== */

export interface AdminOrder {
  id: number;
  createdAt: string;
  status: string;
  totalAmount: number;
  currency: string;
  patient: { id: number; name: string };
  payment: { status: string; method: string };
  delivery: { status: string };
  pharmacyLabel: string;
}

export interface AdminOrderDetail {
  id: number;
  createdAt: string;
  status: string;
  subtotalAmount: number;
  discountAmount: number;
  deliveryFeeAmount: number;
  totalAmount: number;
  currency: string;
  deliveryType: string;
  notes: string;
  patient: { id: number; name: string; phoneNumber: string; email: string };
  payment: { id: number; status: string; method: string; amount: number; currency: string };
  delivery: {
    id: number;
    status: string;
    acceptedAt: string | null;
    deliveredAt: string | null;
    driver: AdminDriverDetail | null;
  };
  items: Array<{
    medicineId: number;
    medicineName: string;
    quantity: number;
    unitPrice: number;
    total: number;
    pharmacyId: number;
    pharmacyName: string;
  }>;
  prescriptions: Array<{
    id: number;
    status: string;
    files: Array<{ url: string; sortOrder: number }>;
  }>;
}

interface OrderParams extends PaginationParams {
  status?: string;
}

export function getAdminOrders(params: OrderParams = {}) {
  return httpGet<PaginatedResponse<AdminOrder>>("/orders/admin", { params });
}

export function getAdminOrderById(id: number) {
  return httpGet<SingleResponse<AdminOrderDetail>>(`/orders/admin/${id}`);
}

/* ===================================================================
   INVENTORY / PRODUCTS  (GET /inventory/admin)
   =================================================================== */

export interface AdminInventoryItem {
  id: number;
  medicineId: number;
  medicineName: string;
  categoryName: string;
  packDisplayName: string;
  requiresPrescription: boolean;
  stockQuantity: number;
  minStock: number;
  sellPrice: number;
  stockStatus: "IN_STOCK" | "OUT_OF_STOCK" | "LOW_STOCK";
  expiryDate: string;
  medicineImageUrl: string | null;
  isDeleted: boolean;
  pharmacy: { id: number; pharmacyName: string; verificationStatus: string };
}

interface InventoryParams extends PaginationParams {
  pharmacyId?: number;
  medicineId?: number;
  isAvailable?: boolean;
  includeDeleted?: boolean;
  pharmacyUserStatus?: "ACTIVE" | "INACTIVE";
  medicineIsActive?: boolean;
}

export function getAdminInventory(params: InventoryParams = {}) {
  return httpGet<PaginatedResponse<AdminInventoryItem>>("/inventory/admin", { params });
}

export function getAdminInventoryById(id: number) {
  return httpGet<SingleResponse<unknown>>(`/inventory/admin/${id}`);
}

/* ===================================================================
   MEDICINES  (GET /medicines/admin)
   =================================================================== */

export interface AdminMedicine {
  id: number;
  genericName: string;
  brandName: string;
  manufacturer: string;
  dosageForm: string;
  strengthValue: string;
  strengthUnit: string;
  packSize: number;
  packUnit: string;
  requiresPrescription: boolean;
  activeIngredients: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  isActive: boolean;
  minPrice: number | null;
  maxPrice: number | null;
  categoryId: number;
  categoryName?: string;
  images?: Array<{ imageUrl: string; sortOrder: number }>;
}

interface MedicineParams extends PaginationParams {
  categoryId?: number;
  status?: "PENDING" | "APPROVED" | "REJECTED";
  isActive?: boolean;
}

export function getAdminMedicines(params: MedicineParams = {}) {
  return httpGet<PaginatedResponse<AdminMedicine>>("/medicines/admin", { params });
}

export function getAdminMedicineById(id: number) {
  return httpGet<SingleResponse<AdminMedicine>>(`/medicines/admin/${id}`);
}

export function createAdminMedicine(body: Record<string, unknown>) {
  return httpPost<SingleResponse<AdminMedicine>>("/medicines/admin", body);
}

export function updateAdminMedicine(id: number, body: Record<string, unknown>) {
  return httpPatch<SingleResponse<AdminMedicine>>(`/medicines/admin/${id}`, body);
}

export function toggleMedicineActivation(id: number, isActive: boolean) {
  return httpPatch<SingleResponse<unknown>>(`/medicines/admin/${id}/activation`, { isActive });
}

export function reviewMedicine(id: number, body: { status: "APPROVED" | "REJECTED"; rejectionReason?: string; minPrice?: number; maxPrice?: number }) {
  return httpPatch<SingleResponse<unknown>>(`/medicines/admin/${id}/review`, body);
}

/* ===================================================================
   CATEGORIES  (POST/PATCH /categories/admin)
   =================================================================== */

export interface AdminCategory {
  id: number;
  name: string;
  categoryImageUrl: string | null;
  description: string | null;
  createdAt: string;
  updatedAt: string;
}

export function createCategory(body: { name: string; description?: string; categoryImageUrl?: string }) {
  return httpPost<SingleResponse<AdminCategory>>("/categories/admin", body);
}

export function updateCategory(id: number, body: { name?: string; description?: string; categoryImageUrl?: string }) {
  return httpPatch<SingleResponse<AdminCategory>>(`/categories/admin/${id}`, body);
}

/* ===================================================================
   CITIES  (POST/PATCH/DELETE /cities/admin)
   =================================================================== */

export interface AdminCity {
  id: number;
  name: string;
  cityDeliveryFee?: {
    standardFeeAmount: number;
    expressFeeAmount: number;
    currency: string;
  };
}

export function createCity(body: { name: string }) {
  return httpPost<SingleResponse<AdminCity>>("/cities/admin", body);
}

export function updateCity(id: number, body: { name: string }) {
  return httpPatch<SingleResponse<AdminCity>>(`/cities/admin/${id}`, body);
}

export function deleteCity(id: number) {
  return httpDelete<SingleResponse<AdminCity>>(`/cities/admin/${id}`);
}

export function setCityDeliveryFee(id: number, body: { standardFeeAmount: string | number; expressFeeAmount: string | number; currency: string }) {
  return httpPut<SingleResponse<AdminCity>>(`/cities/admin/${id}/delivery-fee`, body);
}

/* ===================================================================
   DELIVERIES  (GET /deliveries/admin)
   =================================================================== */

export interface AdminDelivery {
  id: number;
  orderId: number;
  status: "PENDING" | "ASSIGNED" | "PICKUP_IN_PROGRESS" | "EN_ROUTE" | "DELIVERED";
  createdAt: string;
  acceptedAt: string | null;
  deliveredAt: string | null;
  driver: {
    id: number;
    name: string;
    phoneNumber: string;
    vehicleName: string;
    vehiclePlate: string;
    availabilityStatus: string;
    verificationStatus: string;
  } | null;
  earning: number | null;
  rating: number | null;
}

interface DeliveryParams extends PaginationParams {
  status?: string;
  driverId?: number;
}

export function getAdminDeliveries(params: DeliveryParams = {}) {
  return httpGet<PaginatedResponse<AdminDelivery>>("/deliveries/admin", { params });
}
