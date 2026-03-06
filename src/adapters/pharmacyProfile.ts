import { PharmacyProfile, PharmacyProfileDTO } from "@/types/PharmacyProfile";

export function mapPharmacyProfile(dto: PharmacyProfileDTO): PharmacyProfile {
  return {
    id: dto.pharmacyId,
    name: dto.pharmacyName,
    email: dto.email,
    phone: dto.phoneNumber,
    image: dto.profileImageUrl ?? "/patient/LIE Pharmacy.png",
    city: dto.cityName,
    address: dto.addressLine,
    openingHours: `${dto.workingHours.openTime} - ${dto.workingHours.closeTime}`,

    createdAt: dto.createdAt,
    verificationStatus: dto.verificationStatus,
  };
}
