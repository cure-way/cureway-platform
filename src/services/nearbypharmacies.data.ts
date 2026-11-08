import { Pharmacy } from "@/types/pharmacyTypes";

/**
 * Nearby pharmacies shown on the patient listing and detail pages.
 *
 * Ids deliberately match the pharmacy ids in the showcase fixtures
 * (`src/lib/showcase/fixtures/catalog.ts`). The medicine detail page links to
 * `/pharmacies/{pharmacyId}` using those numeric ids, so before this they
 * resolved to nothing and the page rendered "Pharmacy not found".
 *
 * Names and addresses are kept in step with the fixtures too — every entry
 * used to be called "City Pharmacy" at a Tunis address, which did not match
 * the rest of the sample data.
 */
export const NEARBY_PHARMACIES: Pharmacy[] = [
  {
    id: "202",
    name: "Al-Shifa Pharmacy",
    address: "Al-Shifa Medical Complex Road, Rimal, Gaza",
    distance: "0.8 km from you",
    distanceInKm: 0.8,
    rating: 4.8,
    reviewCount: 324,
    deliveryFee: 3,
    imageUrl: "/patient/City Pharmacy.png",
    isOpen: true,
    openingHours: "Open: 8:00 AM - 11:00 PM",
  },
  {
    id: "203",
    name: "Amal Pharmacy",
    address: "Al-Nasr Street, Gaza",
    distance: "1.6 km from you",
    distanceInKm: 1.6,
    rating: 4.6,
    reviewCount: 289,
    deliveryFee: 3,
    imageUrl: "/patient/Amal Pharmacy.png",
    isOpen: true,
    openingHours: "Open: 8:00 AM - 9:00 PM",
  },
  {
    id: "204",
    name: "Al-Quds Pharmacy",
    address: "Jamal Abdel Nasser Street, Khan Younis",
    distance: "4.2 km from you",
    distanceInKm: 4.2,
    rating: 4.7,
    reviewCount: 412,
    deliveryFee: 3.5,
    imageUrl: "/patient/LIE Pharmacy.png",
    isOpen: true,
    openingHours: "Open: 24 Hours",
  },
  {
    id: "205",
    name: "Al-Rahma Pharmacy",
    address: "Salah Al-Din Road, Deir al-Balah",
    distance: "6.9 km from you",
    distanceInKm: 6.9,
    rating: 4.5,
    reviewCount: 198,
    deliveryFee: 3.5,
    imageUrl: "/patient/Amal Pharmacy.png",
    isOpen: false,
    openingHours: "Open: 8:00 AM - 8:00 PM",
  },
  {
    id: "206",
    name: "Nour Al-Sabah Pharmacy",
    address: "Jabalia Camp Main Street, Jabalia",
    distance: "3.4 km from you",
    distanceInKm: 3.4,
    rating: 4.9,
    reviewCount: 567,
    deliveryFee: 3,
    imageUrl: "/patient/City Pharmacy.png",
    isOpen: true,
    openingHours: "Open: 7:00 AM - 11:00 PM",
  },
];
