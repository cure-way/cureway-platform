/**
 * Route Constants
 * Centralized route definitions for each portal
 */

export const ROUTES = {
  // Public routes
  PUBLIC: {
    LANDING: "/",
  },

  // Auth routes
  AUTH: {
    SIGN_IN: "/auth/sign-in",
    SIGN_UP: "/auth/sign-up",
    VERIFY_PHONE: "/auth/verify-phone",
    VERIFY_OTP: "/auth/verify-otp",
    FORGOT_PASSWORD: "/auth/forgot-password",
    FORGOT_PASSWORD_VERIFY: "/auth/forgot-password/verify",
    NEW_PASSWORD: "/auth/forgot-password/new-password",
    REGISTRATION_SUBMITTED: "/auth/registration-submitted",
  },

  // Pharmacy portal routes
  PHARMACY: {
    HOME: "/pharmacy/home",
    ORDERS: "/pharmacy/orders",
    ORDER_DETAILS: (orderId: string) => `/pharmacy/orders/${orderId}`,
    ADD_MEDICINE_FROM_PRESCRIPTION: (orderId: string) =>
      `/pharmacy/orders/${orderId}/add-medicine-from-prescription`,
    INVENTORY: "/pharmacy/inventory",
    MEDICINE_DETAILS: (medicineId: string) => `/pharmacy/inventory/${medicineId}`,
    REPORT: "/pharmacy/report",
    NOTIFICATIONS: "/pharmacy/notifications",
    PROFILE: "/pharmacy/profile",
  },

  // Patient portal routes
  PATIENT: {
    HOME: "/patient/home",
    ORDERS: "/patient/orders",
    ORDER_DETAILS: (orderId: string) => `/patient/orders/${orderId}`,
    PRESCRIPTIONS: "/patient/prescriptions",
    PRESCRIPTION_DETAILS: (prescriptionId: string) =>
      `/patient/prescriptions/${prescriptionId}`,
    PHARMACIES: "/patient/pharmacies",
    PHARMACY_DETAILS: (pharmacyId: string) => `/patient/pharmacies/${pharmacyId}`,
    PROFILE: "/patient/profile",
    NOTIFICATIONS: "/patient/notifications",
    SETTINGS: "/patient/settings",
  },

  // Admin panel routes
  ADMIN: {
    DASHBOARD: "/admin/dashboard",
    PATIENTS: "/admin/patients",
    PATIENT_DETAILS: (patientId: string) => `/admin/patients/${patientId}`,
    PHARMACIES: "/admin/pharmacies",
    PRODUCTS: "/admin/products",
    ORDERS: "/admin/orders",
    SETTINGS_PROFILE: "/admin/settings/profile",
    SETTINGS_SECURITY: "/admin/settings/security",
    NOTIFICATIONS: "/admin/notifications",
    NOTIFICATION_SETTINGS: "/admin/notifications/settings",
  },
} as const;

/**
 * Get the home route for a specific role
 */
export function getHomeRoute(role: "patient" | "pharmacy" | "admin"): string {
  switch (role) {
    case "patient":
      return ROUTES.PATIENT.HOME;
    case "pharmacy":
      return ROUTES.PHARMACY.HOME;
    case "admin":
      return ROUTES.ADMIN.DASHBOARD;
    default:
      return ROUTES.PUBLIC.LANDING;
  }
}

/**
 * Roles that have a dedicated portal/landing destination in this app.
 */
export const APP_ROLES = ["PATIENT", "PHARMACY", "ADMIN"] as const;
export type AppRole = (typeof APP_ROLES)[number];

/**
 * Returns true when the given value is a known application role.
 * Used to defensively reject null / undefined / unexpected roles.
 */
export function isAppRole(role: unknown): role is AppRole {
  return typeof role === "string" && (APP_ROLES as readonly string[]).includes(role);
}

/**
 * Resolve the correct landing destination for an authenticated user based on
 * their (uppercase) auth role. This is the single source of truth used by the
 * route guards so role-based redirects never point a user at a page their
 * role is not allowed to render.
 *
 *   PATIENT  → "/"               (patient portal lives at the root)
 *   PHARMACY → "/pharmacy/home"
 *   ADMIN    → "/admin/dashboard"
 *
 * Unknown / null / undefined roles fall back to the sign-in page so a corrupt
 * session can never get stuck rendering a blank screen.
 */
export function getRoleHome(role: string | null | undefined): string {
  switch (role) {
    case "PATIENT":
      return ROUTES.PUBLIC.LANDING; // "/"
    case "PHARMACY":
      return ROUTES.PHARMACY.HOME; // "/pharmacy/home"
    case "ADMIN":
      return ROUTES.ADMIN.DASHBOARD; // "/admin/dashboard"
    default:
      return ROUTES.AUTH.SIGN_IN;
  }
}

/**
 * Check if a path belongs to a specific portal
 */
export function isPortalPath(
  path: string,
  portal: "auth" | "pharmacy" | "patient" | "admin"
): boolean {
  return path.startsWith(`/${portal}`);
}
