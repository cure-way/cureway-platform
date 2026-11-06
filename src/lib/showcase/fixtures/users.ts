/**
 * Demo users and profiles — one per explorable role.
 *
 * Shapes come from `@/features/auth/auth.types` so `tsc` catches any drift
 * from what `AuthProvider` / `AuthGuard` expect. The pharmacy account is
 * VERIFIED on purpose: `AuthGuard` renders `AccountUnderReview` instead of the
 * portal for UNDER_REVIEW pharmacies, which would hide the whole dashboard.
 */

import type {
  AuthProfile,
  AuthTokens,
  AuthUser,
} from "@/features/auth/auth.types";
import type { PatientProfile } from "@/services/profile.service";
import type { PharmacyProfileDTO } from "@/types/PharmacyProfile";

import { CITIES, IMG, daysAgo } from "./common";

export const DEMO_TOKENS: AuthTokens = {
  accessToken: "showcase-demo-access-token",
  refreshToken: "showcase-demo-refresh-token",
};

// ---------------------------------------------------------------------------
// Patient
// ---------------------------------------------------------------------------

export const PATIENT_USER: AuthUser = {
  id: 101,
  email: "lina.haddad@example.ps",
  name: "Lina Haddad",
  phoneNumber: "+970592440118",
  role: "PATIENT",
  status: "ACTIVE",
  isEmailVerified: true,
  isPhoneVerified: true,
  profileImageUrl: IMG.avatarGirl,
  dateOfBirth: "1994-03-18",
};

export const PATIENT_PROFILE: AuthProfile = {
  id: 201,
  userId: PATIENT_USER.id,
  cityId: CITIES[0].id,
  cityName: CITIES[0].name,
  address: "Omar Al-Mukhtar Street, Rimal, Gaza",
  latitude: 31.5175,
  longitude: 34.4515,
};

export const PATIENT_FULL_PROFILE: PatientProfile = {
  id: PATIENT_USER.id,
  role: "PATIENT",
  email: PATIENT_USER.email,
  phoneNumber: PATIENT_USER.phoneNumber,
  name: PATIENT_USER.name,
  dateOfBirth: PATIENT_USER.dateOfBirth ?? null,
  profileImageUrl: IMG.avatarGirl,
  defaultAddress: {
    id: 301,
    label: "Home",
    area: "Rimal",
    region: "Gaza Governorate",
    addressLine1: "Omar Al-Mukhtar Street, Rimal",
    addressLine2: "Building 14, 3rd floor",
    latitude: 31.5175,
    longitude: 34.4515,
    cityName: CITIES[0].name,
    cityId: CITIES[0].id,
  },
  createdAt: daysAgo(420),
  updatedAt: daysAgo(9),
};

// ---------------------------------------------------------------------------
// Pharmacy
// ---------------------------------------------------------------------------

export const PHARMACY_USER: AuthUser = {
  id: 102,
  email: "contact@alshifapharmacy.ps",
  name: "Yousef Abu Sitta",
  phoneNumber: "+970599316204",
  role: "PHARMACY",
  status: "ACTIVE",
  isEmailVerified: true,
  isPhoneVerified: true,
  profileImageUrl: IMG.pharmacyCity,
  dateOfBirth: null,
};

export const PHARMACY_PROFILE: AuthProfile = {
  id: 202,
  userId: PHARMACY_USER.id,
  pharmacyName: "Al-Shifa Pharmacy",
  licenseNumber: "PS-GZ-2019-4471",
  cityId: CITIES[0].id,
  cityName: CITIES[0].name,
  address: "Al-Shifa Medical Complex Road, Rimal, Gaza",
  latitude: 31.5241,
  longitude: 34.4478,
  verificationStatus: "VERIFIED",
};

export const PHARMACY_FULL_PROFILE: PharmacyProfileDTO = {
  pharmacyId: 202,
  userId: PHARMACY_USER.id,
  email: PHARMACY_USER.email,
  phoneNumber: PHARMACY_USER.phoneNumber,
  profileImageUrl: IMG.pharmacyCity,
  coverImageUrl: IMG.shelves,
  verificationStatus: "VERIFIED",
  cityName: CITIES[0].name,
  createdAt: daysAgo(640),
  updatedAt: daysAgo(4),
  role: "PHARMACY",
  pharmacyName: "Al-Shifa Pharmacy",
  addressLine: "Al-Shifa Medical Complex Road, Rimal, Gaza",
  latitude: 31.5241,
  longitude: 34.4478,
  workingHours: { openTime: "08:00", closeTime: "23:00" },
};

// ---------------------------------------------------------------------------
// Admin
// ---------------------------------------------------------------------------

export const ADMIN_USER: AuthUser = {
  id: 103,
  email: "ops@cureway.ps",
  name: "Mahmoud Al-Najjar",
  phoneNumber: "+970597880342",
  role: "ADMIN",
  status: "ACTIVE",
  isEmailVerified: true,
  isPhoneVerified: true,
  profileImageUrl: IMG.avatarBoy,
  dateOfBirth: null,
};

export const ADMIN_PROFILE: AuthProfile = {
  id: 203,
  userId: ADMIN_USER.id,
  cityId: CITIES[0].id,
  cityName: CITIES[0].name,
};

// ---------------------------------------------------------------------------
// Lookup by role
// ---------------------------------------------------------------------------

export const DEMO_SESSIONS = {
  PATIENT: { user: PATIENT_USER, profile: PATIENT_PROFILE },
  PHARMACY: { user: PHARMACY_USER, profile: PHARMACY_PROFILE },
  ADMIN: { user: ADMIN_USER, profile: ADMIN_PROFILE },
} as const;
