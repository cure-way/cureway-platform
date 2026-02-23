/**
 * Auth Types
 *
 * Endpoints covered:
 *   POST /auth/login
 *   POST /auth/refresh
 *   POST /auth/logout
 *   POST /auth/register/patient
 *   POST /auth/register/pharmacy
 *   POST /auth/register/driver
 */

// ---------------------------------------------------------------------------
// Shared domain models
// ---------------------------------------------------------------------------

export type UserRole = "PATIENT" | "PHARMACY" | "ADMIN" | "DRIVER";
export type UserStatus = "ACTIVE" | "INACTIVE" | "SUSPENDED";
export type VerificationStatus = "UNDER_REVIEW" | "APPROVED" | "REJECTED";

export interface AuthUser {
  id: number;
  email: string;
  name: string;
  phoneNumber: string;
  role: UserRole;
  status: UserStatus;
  isEmailVerified: boolean;
  isPhoneVerified: boolean;
  profileImageUrl?: string | null;
  dateOfBirth?: string | null;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface AuthProfile {
  id: number;
  userId: number;
  pharmacyName?: string;
  licenseNumber?: string;
  cityId?: number;
  cityName?: string;
  address?: string;
  latitude?: number;
  longitude?: number;
  verificationStatus?: VerificationStatus;
  // Driver-specific fields (may appear for driver profiles)
  vehicleName?: string;
  vehiclePlate?: string;
}

// ---------------------------------------------------------------------------
// Request payloads
// ---------------------------------------------------------------------------

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RefreshPayload {
  refreshToken: string;
}

export interface LogoutPayload {
  refreshToken: string;
}

export interface RegisterPatientPayload {
  name: string;
  email: string;
  phoneNumber: string;
  password: string;
}

export interface RegisterPharmacyPayload {
  name: string;
  email: string;
  phoneNumber: string;
  password: string;
  pharmacyName: string;
  licenseNumber: string;
  cityId: number;
  address: string;
  licenseDocUrl: string;
  lat: number;
  lng: number;
}

export interface RegisterDriverPayload {
  name: string;
  email: string;
  phoneNumber: string;
  password: string;
  vehicleName: string;
  vehiclePlate: string;
  licenseDocUrl: string;
}

// ---------------------------------------------------------------------------
// Response shapes
// ---------------------------------------------------------------------------

/** Envelope wrapper used by all API responses */
export interface ApiEnvelope<T> {
  success: boolean;
  data: T;
}

/** Inner payload for login, refresh, and registration */
export interface AuthPayloadData {
  user: AuthUser;
  tokens: AuthTokens;
  profile?: AuthProfile | null;
}

/** Full API response for login/register/refresh */
export type AuthApiResponse = ApiEnvelope<AuthPayloadData>;

/**
 * Unwrapped auth response used by the app layer.
 * This is what auth.api functions return after stripping the envelope.
 */
export interface AuthResponse {
  user: AuthUser;
  tokens: AuthTokens;
  profile: AuthProfile | null;
}

/** POST /auth/logout */
export interface LogoutResponse {
  revoked: boolean;
}

/** Full API response for logout */
export type LogoutApiResponse = ApiEnvelope<LogoutResponse>;
