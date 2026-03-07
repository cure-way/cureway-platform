import { mapPharmacyProfile } from "@/adapters/pharmacyProfile";
import { getPharmacyProfile } from "@/repositories/PharmacyProfile";

export async function fetchPharmacyProfile() {
  const res = await getPharmacyProfile();

  return mapPharmacyProfile(res.data);
}
