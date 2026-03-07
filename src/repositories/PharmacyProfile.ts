import { httpGet } from "@/lib/api";
import { PharmacyProfileResponse } from "@/types/PharmacyProfile";

export async function getPharmacyProfile(): Promise<PharmacyProfileResponse> {
  return httpGet<PharmacyProfileResponse>("/pharmacies/me");
}
