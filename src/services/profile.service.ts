import { httpGet, httpPatch } from "@/lib/api";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface PatientAddress {
  id: number;
  label: string;
  area: string;
  region: string;
  addressLine1: string;
  addressLine2: string;
  latitude: number;
  longitude: number;
  cityName: string;
  cityId: number;
}

export interface PatientProfile {
  id: number;
  role: string;
  email: string;
  phoneNumber: string;
  name: string;
  dateOfBirth: string | null;
  profileImageUrl: string | null;
  defaultAddress: PatientAddress | null;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateProfilePayload {
  name?: string;
  phoneNumber?: string;
  profileImageUrl?: string;
  dateOfBirth?: string;
}

interface ApiResponse<T> {
  success: boolean;
  data: T;
}

// ---------------------------------------------------------------------------
// API calls
// ---------------------------------------------------------------------------

export async function getMyProfile(): Promise<PatientProfile> {
  const res = await httpGet<ApiResponse<PatientProfile>>("/user/me");
  return res.data;
}

export async function updateMyProfile(
  payload: UpdateProfilePayload,
): Promise<PatientProfile> {
  const res = await httpPatch<ApiResponse<PatientProfile>, UpdateProfilePayload>(
    "/user/me",
    payload,
  );
  return res.data;
}
