/**
 * Catalog fixtures — categories, medicines and per-pharmacy stock.
 *
 * Shapes: `CategoryDTO`, `MedicineDTO`, `PharmacyStockDTO` from
 * `@/types/categories.types` and `@/types/medicine.types`.
 * Note `MedicineDTO.minPrice`/`maxPrice` are **strings** in the API contract —
 * `mapMedicine()` coerces them with `Number()`.
 */

import type { CategoryDTO } from "@/types/categories.types";
import type { MedicineDTO, PharmacyStockDTO } from "@/types/medicine.types";

import { CITIES, IMG, daysAgo } from "./common";

// ---------------------------------------------------------------------------
// Categories
// ---------------------------------------------------------------------------

export const CATEGORIES: CategoryDTO[] = [
  {
    id: 21,
    name: "Pain Relief",
    categoryImageUrl: IMG.painRelief,
    description: "Analgesics and anti-inflammatories for everyday pain.",
    createdAt: daysAgo(600),
    updatedAt: daysAgo(30),
  },
  {
    id: 22,
    name: "Cold & Flu",
    categoryImageUrl: IMG.coldFlu,
    description: "Cough syrups, decongestants and seasonal flu care.",
    createdAt: daysAgo(600),
    updatedAt: daysAgo(28),
  },
  {
    id: 23,
    name: "Vitamins & Supplements",
    categoryImageUrl: IMG.vitamins,
    description: "Daily vitamins, minerals and nutritional support.",
    createdAt: daysAgo(600),
    updatedAt: daysAgo(26),
  },
  {
    id: 24,
    name: "Antibiotics",
    categoryImageUrl: IMG.pills,
    description: "Prescription-only antibacterial treatments.",
    createdAt: daysAgo(580),
    updatedAt: daysAgo(21),
  },
  {
    id: 25,
    name: "Chronic Care",
    categoryImageUrl: IMG.dailyEssentials,
    description: "Long-term medication for diabetes, blood pressure and heart.",
    createdAt: daysAgo(560),
    updatedAt: daysAgo(18),
  },
  {
    id: 26,
    name: "First Aid",
    categoryImageUrl: IMG.firstAid,
    description: "Dressings, antiseptics and home first-aid essentials.",
    createdAt: daysAgo(540),
    updatedAt: daysAgo(12),
  },
];

// ---------------------------------------------------------------------------
// Medicines
// ---------------------------------------------------------------------------

function medicine(
  id: number,
  genericName: string,
  brandName: string,
  manufacturer: string,
  dosageForm: string,
  strengthValue: string,
  strengthUnit: string,
  packSize: number,
  packUnit: string,
  minPrice: number,
  maxPrice: number,
  requiresPrescription: boolean,
  categoryId: number,
  image: string,
): MedicineDTO {
  const category = CATEGORIES.find((c) => c.id === categoryId)!;
  return {
    id,
    genericName,
    brandName,
    manufacturer,
    dosageForm,
    strengthValue,
    strengthUnit,
    packSize,
    packUnit,
    minPrice: minPrice.toFixed(2),
    maxPrice: maxPrice.toFixed(2),
    requiresPrescription,
    images: [{ url: image }],
    category: { id: category.id, name: category.name },
  };
}

export const MEDICINES: MedicineDTO[] = [
  medicine(31, "Paracetamol", "Panadol Extra", "GlaxoSmithKline", "Tablet", "500", "mg", 24, "tablets", 2.5, 3.75, false, 21, IMG.panadol),
  medicine(32, "Ibuprofen", "Brufen", "Abbott", "Tablet", "400", "mg", 20, "tablets", 3.2, 4.5, false, 21, IMG.painRelief),
  medicine(33, "Diclofenac Sodium", "Voltaren Emulgel", "Novartis", "Gel", "1", "%", 50, "g", 6.8, 8.9, false, 21, IMG.voltaren),
  medicine(34, "Guaifenesin", "Zecuf Herbal Syrup", "Jamjoom Pharma", "Syrup", "100", "mg/5ml", 120, "ml", 4.1, 5.4, false, 22, IMG.zecuf),
  medicine(35, "Cetirizine", "Zyrtec", "UCB Pharma", "Tablet", "10", "mg", 10, "tablets", 2.9, 3.95, false, 22, IMG.coldFlu),
  medicine(36, "Salbutamol", "Ventolin Inhaler", "GlaxoSmithKline", "Inhaler", "100", "mcg", 200, "doses", 7.5, 9.6, true, 22, IMG.placeholder),
  medicine(37, "Ascorbic Acid", "Vitamin C 1000", "Bayer", "Effervescent Tablet", "1000", "mg", 20, "tablets", 5.2, 6.75, false, 23, IMG.vitaminC),
  medicine(38, "Cholecalciferol", "Vitamin D3 50000", "Birzeit Pharmaceuticals", "Capsule", "50000", "IU", 8, "capsules", 4.6, 6.1, false, 23, IMG.vitamins),
  medicine(39, "Hydrolysed Collagen", "Biogen Collagen", "Biogen", "Powder", "10", "g", 300, "g", 18.5, 23.4, false, 23, IMG.collagen),
  medicine(40, "Glucosamine Sulfate", "CH-Alpha Active", "Gelita Health", "Oral Solution", "1200", "mg", 30, "sachets", 26.9, 32.5, false, 23, IMG.chAlpha),
  medicine(41, "Amoxicillin + Clavulanic Acid", "Augmentin 625", "GlaxoSmithKline", "Tablet", "625", "mg", 14, "tablets", 8.9, 11.4, true, 24, IMG.pills),
  medicine(42, "Ciprofloxacin", "Ciprobay", "Bayer", "Tablet", "500", "mg", 10, "tablets", 7.2, 9.3, true, 24, IMG.placeholder),
  medicine(43, "Metformin", "Glucophage", "Merck", "Tablet", "850", "mg", 30, "tablets", 4.4, 5.8, true, 25, IMG.dailyEssentials),
  medicine(44, "Bisoprolol", "Concor 5", "Merck", "Tablet", "5", "mg", 30, "tablets", 5.6, 7.2, true, 25, IMG.placeholder),
  medicine(45, "Esomeprazole", "Nexium", "AstraZeneca", "Capsule", "40", "mg", 14, "capsules", 9.4, 12.1, true, 25, IMG.pills),
  medicine(46, "Povidone Iodine", "Betadine Solution", "Mundipharma", "Solution", "10", "%", 120, "ml", 3.8, 5.2, false, 26, IMG.firstAid),
  medicine(47, "Oral Rehydration Salts", "Rehydran-N", "Julphar", "Sachet", "20.5", "g", 10, "sachets", 2.2, 3.1, false, 26, IMG.medicalEquipment),
  medicine(48, "Ferrous Sulfate", "Ferose-F", "Birzeit Pharmaceuticals", "Tablet", "200", "mg", 30, "tablets", 3.4, 4.6, false, 23, IMG.vitamins),
];

// ---------------------------------------------------------------------------
// Pharmacies (stock rows for GET /medicines/{id}/pharmacies)
// ---------------------------------------------------------------------------

export interface ShowcasePharmacy {
  pharmacyId: number;
  pharmacyName: string;
  cityId: number;
  cityName: string;
  addressLine: string;
  latitude: number;
  longitude: number;
  distanceKm: number;
  deliveryFee: number;
  isOpenNow: boolean;
  profileImageUrl: string;
  coverImageUrl: string;
  licenseNumber: string;
  phoneNumber: string;
  verificationStatus: "VERIFIED" | "UNDER_REVIEW" | "REJECTED";
}

export const PHARMACIES: ShowcasePharmacy[] = [
  {
    pharmacyId: 202, pharmacyName: "Al-Shifa Pharmacy",
    cityId: CITIES[0].id, cityName: CITIES[0].name,
    addressLine: "Al-Shifa Medical Complex Road, Rimal, Gaza",
    latitude: 31.5241, longitude: 34.4478, distanceKm: 0.8, deliveryFee: 3,
    isOpenNow: true, profileImageUrl: IMG.pharmacyCity, coverImageUrl: IMG.shelves,
    licenseNumber: "PS-GZ-2019-4471", phoneNumber: "+970599316204",
    verificationStatus: "VERIFIED",
  },
  {
    pharmacyId: 203, pharmacyName: "Amal Pharmacy",
    cityId: CITIES[0].id, cityName: CITIES[0].name,
    addressLine: "Al-Nasr Street, Gaza",
    latitude: 31.5312, longitude: 34.4561, distanceKm: 1.6, deliveryFee: 3,
    isOpenNow: true, profileImageUrl: IMG.pharmacyAmal, coverImageUrl: IMG.shelves,
    licenseNumber: "PS-GZ-2020-5518", phoneNumber: "+970597441820",
    verificationStatus: "VERIFIED",
  },
  {
    pharmacyId: 204, pharmacyName: "Al-Quds Pharmacy",
    cityId: CITIES[1].id, cityName: CITIES[1].name,
    addressLine: "Jamal Abdel Nasser Street, Khan Younis",
    latitude: 31.3461, longitude: 34.3063, distanceKm: 4.2, deliveryFee: 3.5,
    isOpenNow: true, profileImageUrl: IMG.pharmacyLie, coverImageUrl: IMG.shelves,
    licenseNumber: "PS-KY-2018-3102", phoneNumber: "+970595772640",
    verificationStatus: "VERIFIED",
  },
  {
    pharmacyId: 205, pharmacyName: "Al-Rahma Pharmacy",
    cityId: CITIES[3].id, cityName: CITIES[3].name,
    addressLine: "Salah Al-Din Road, Deir al-Balah",
    latitude: 31.4181, longitude: 34.3512, distanceKm: 6.9, deliveryFee: 3.5,
    isOpenNow: false, profileImageUrl: IMG.pharmacyCity, coverImageUrl: IMG.shelves,
    licenseNumber: "PS-DB-2021-6640", phoneNumber: "+970592108455",
    verificationStatus: "VERIFIED",
  },
  {
    pharmacyId: 206, pharmacyName: "Nour Al-Sabah Pharmacy",
    cityId: CITIES[4].id, cityName: CITIES[4].name,
    addressLine: "Jabalia Camp Main Street, Jabalia",
    latitude: 31.5287, longitude: 34.4832, distanceKm: 3.4, deliveryFee: 3,
    isOpenNow: true, profileImageUrl: IMG.pharmacyAmal, coverImageUrl: IMG.shelves,
    licenseNumber: "PS-JB-2022-7215", phoneNumber: "+970598330917",
    verificationStatus: "UNDER_REVIEW",
  },
  {
    pharmacyId: 207, pharmacyName: "Rafah Central Pharmacy",
    cityId: CITIES[2].id, cityName: CITIES[2].name,
    addressLine: "Al-Awda Square, Rafah",
    latitude: 31.2968, longitude: 34.2435, distanceKm: 11.2, deliveryFee: 4,
    isOpenNow: true, profileImageUrl: IMG.pharmacyLie, coverImageUrl: IMG.shelves,
    licenseNumber: "PS-RF-2023-8033", phoneNumber: "+970594620188",
    verificationStatus: "UNDER_REVIEW",
  },
];

/**
 * Stock rows per medicine. Deterministic so the same medicine always shows the
 * same pharmacies and prices across reloads and screenshots.
 */
export function stockForMedicine(medicineId: number): PharmacyStockDTO[] {
  const med = MEDICINES.find((m) => m.id === medicineId);
  if (!med) return [];

  const min = Number(med.minPrice);
  const max = Number(med.maxPrice);
  const verified = PHARMACIES.filter((p) => p.verificationStatus === "VERIFIED");

  // Rotate which pharmacies carry a medicine so lists are not identical.
  const offset = medicineId % verified.length;
  const carriers = [...verified.slice(offset), ...verified.slice(0, offset)].slice(0, 3);

  return carriers.map((p, i) => {
    const spread = carriers.length > 1 ? i / (carriers.length - 1) : 0;
    const sellPrice = Math.round((min + (max - min) * spread) * 100) / 100;
    const stockQuantity = [48, 12, 0][i % 3] + (medicineId % 7);

    return {
      pharmacyId: p.pharmacyId,
      pharmacyName: p.pharmacyName,
      cityId: p.cityId,
      cityName: p.cityName,
      address: {
        addressLine: p.addressLine,
        latitude: p.latitude,
        longitude: p.longitude,
      },
      distanceKm: p.distanceKm,
      eta: p.isOpenNow ? 25 + i * 10 : null,
      sellPrice,
      stockQuantity,
      deliveryFee: p.deliveryFee,
      coverImageUrl: p.coverImageUrl,
      profileImageUrl: p.profileImageUrl,
      isOpenNow: p.isOpenNow,
    };
  });
}
