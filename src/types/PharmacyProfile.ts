export interface PharmacyProfileResponse {
  success: boolean;
  data: PharmacyProfileDTO;
}

export interface PharmacyProfileDTO {
  pharmacyId: number;
  userId: number;
  email: string;
  phoneNumber: string;
  profileImageUrl: string | null;
  coverImageUrl: string | null;
  verificationStatus: "VERIFIED" | "PENDING" | "REJECTED";
  cityName: string;
  createdAt: string;
  updatedAt: string;
  role: "PHARMACY";
  pharmacyName: string;
  addressLine: string;
  latitude: number;
  longitude: number;
  workingHours: {
    openTime: string;
    closeTime: string;
  };
}

export interface PharmacyProfile {
  id: number;
  name: string;
  email: string;
  phone: string;
  image: string;
  city: string;
  address: string;
  openingHours: string;

  createdAt: string;
  verificationStatus: "VERIFIED" | "PENDING" | "REJECTED";
}

export type ProfileTab = "profile" | "password" | "notifications" | "settings";
