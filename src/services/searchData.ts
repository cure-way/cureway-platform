import { SearchResult } from "@/types/search";

// DTO Types
export interface MedicineDto {
  id: string;
  type: "medicine";
  name: string;
  form: string;
  quantity: number;
  category: string[];
  isAvailable: boolean;
  deliveryTimeMinutes: number;
  pharmacyDistanceKm: number;
  requiresPrescription: boolean;
}

export interface PharmacyDto {
  id: string;
  type: "pharmacy";
  name: string;
  deliveryTime: number;
  distance: number;
}

export type SearchDto = MedicineDto | PharmacyDto;

// Mapper function
export function toSearchResult(dtos: SearchDto[]): SearchResult[] {
  return dtos.map((dto) => {
    if (dto.type === "medicine") {
      return {
        id: dto.id,
        type: "medicine",
        title: dto.name,
        subtitle: `${dto.form} · ${dto.quantity} tablets`,
        isAvailable: dto.isAvailable,
        deliveryTimeMinutes: dto.deliveryTimeMinutes,
        pharmacyDistanceKm: dto.pharmacyDistanceKm,
        requiresPrescription: dto.requiresPrescription,
      };
    }

    return {
      id: dto.id,
      type: "pharmacy",
      title: dto.name,
      subtitle: `Delivery · ${dto.deliveryTime} minutes | ${dto.distance} km`,
    };
  });
}

// Dummy data for search
export const DUMMY_SEARCH_DATA: SearchDto[] = [
  // MEDICINES
  {
    id: "m1",
    type: "medicine",
    name: "Panadol 500mg",
    form: "Tablet",
    quantity: 12,
    category: ["pain-killer", "fever"],
    isAvailable: true,
    deliveryTimeMinutes: 10,
    pharmacyDistanceKm: 2.3,
    requiresPrescription: true,
  },
  {
    id: "m2",
    type: "medicine",
    name: "Paracetamol",
    form: "Tablet",
    quantity: 20,
    category: ["pain-killer", "fever-reducer"],
    isAvailable: true,
    deliveryTimeMinutes: 25,
    pharmacyDistanceKm: 5.1,
    requiresPrescription: false,
  },
  {
    id: "m3",
    type: "medicine",
    name: "Amoxicillin",
    form: "Capsule",
    quantity: 20,
    category: ["antibiotic", "infection"],
    isAvailable: true,
    deliveryTimeMinutes: 15,
    pharmacyDistanceKm: 3.2,
    requiresPrescription: true,
  },
  {
    id: "m4",
    type: "medicine",
    name: "Augmentin",
    form: "Tablet",
    quantity: 14,
    category: ["antibiotic"],
    isAvailable: false,
    deliveryTimeMinutes: 30,
    pharmacyDistanceKm: 6.8,
    requiresPrescription: true,
  },
  {
    id: "m5",
    type: "medicine",
    name: "Vitamin C",
    form: "Tablet",
    quantity: 30,
    category: ["vitamins", "immune"],
    isAvailable: true,
    deliveryTimeMinutes: 5,
    pharmacyDistanceKm: 1.2,
    requiresPrescription: false,
  },
  {
    id: "m6",
    type: "medicine",
    name: "Cough Syrup",
    form: "Syrup",
    quantity: 1,
    category: ["cold", "flu"],
    isAvailable: false,
    deliveryTimeMinutes: 20,
    pharmacyDistanceKm: 4.5,
    requiresPrescription: false,
  },

  // PHARMACIES
  {
    id: "p1",
    type: "pharmacy",
    name: "Al-Quds Pharmacy",
    deliveryTime: 15,
    distance: 2.55,
  },
  {
    id: "p2",
    type: "pharmacy",
    name: "Health Plus Pharmacy",
    deliveryTime: 10,
    distance: 1.8,
  },
  {
    id: "p3",
    type: "pharmacy",
    name: "MediCare Pharmacy",
    deliveryTime: 20,
    distance: 3.5,
  },
  {
    id: "p4",
    type: "pharmacy",
    name: "Quick Meds",
    deliveryTime: 8,
    distance: 1.2,
  },
];
