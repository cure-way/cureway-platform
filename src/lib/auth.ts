/**
 * Auth Helpers
 *
 * Server-side session utilities re-exported from the auth sub-module.
 * Client-side auth is handled by `@/features/auth` (AuthProvider + useAuth).
 */

export { getSession, type Session } from "./auth/get-session";

export { requirePatient, getPatientSession } from "./auth/require-patient";
