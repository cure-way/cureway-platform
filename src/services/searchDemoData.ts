/**
 * Unified Search Demo Data
 * Single source of truth for all search-related mock data.
 */

import type { SearchResult, QuickAction, NearbyPharmacy } from "@/types/search";
import type { FilterTag } from "@/components/patient/search/SearchFilterTags";

/* ------------------------------------------------------------------
   Quick Actions (Scenario 2 — Focus Open)
   ------------------------------------------------------------------ */

export const QUICK_ACTIONS: QuickAction[] = [
  { id: "for-you", label: "For you", icon: "❤️", count: 4 },
  { id: "cold-medicine", label: "Cold medicine" },
  { id: "reorder", label: "Reorder" },
  { id: "fast-delivered", label: "Fast delivered", icon: "🚀" },
];

/* ------------------------------------------------------------------
   Recent Searches (Scenario 2 — Focus Open, seeded)
   ------------------------------------------------------------------ */

export const SEEDED_RECENTS: SearchResult[] = [
  {
    id: "recent-1",
    type: "medicine",
    title: "Panadol 500mg",
    subtitle: "Tablet · 12 tablets",
  },
  {
    id: "recent-2",
    type: "pharmacy",
    title: "Al-Shifa Pharmacy",
    subtitle: "Deliver · 15 minutes | 2.55 km",
  },
  {
    id: "recent-3",
    type: "medicine",
    title: "Ventolin Inhaler",
    subtitle: "Inhaler · 200 doses",
  },
];

/* ------------------------------------------------------------------
   Current Location (Scenario 2)
   ------------------------------------------------------------------ */

export const CURRENT_LOCATION = {
  title: "Use Your Current Location",
  address: "Omar Mukhtar Street, Al-Rimal Area, Gaza City, Gaza, Palestine",
};

/* ------------------------------------------------------------------
   Dropdown Suggestion Results (Scenario 3 — Typing)
   ------------------------------------------------------------------ */

export const SUGGESTION_MEDICINES: SearchResult[] = [
  {
    id: "sug-m1",
    type: "medicine",
    title: "Panadol 500mg",
    subtitle: "Tablet · 12 tablets",
    isAvailable: true,
    deliveryTimeMinutes: 10,
    pharmacyDistanceKm: 2.3,
  },
  {
    id: "sug-m2",
    type: "medicine",
    title: "Panadol Extra",
    subtitle: "Tablet · 24 tablets",
    isAvailable: true,
    deliveryTimeMinutes: 20,
    pharmacyDistanceKm: 3.1,
  },
  {
    id: "sug-m3",
    type: "medicine",
    title: "Panadol Advance",
    subtitle: "Tablet · 48 tablets",
    isAvailable: true,
    deliveryTimeMinutes: 25,
    pharmacyDistanceKm: 4.2,
  },
];

export const SUGGESTION_PHARMACIES: SearchResult[] = [
  {
    id: "sug-p1",
    type: "pharmacy",
    title: "Al-Shifa Pharmacy",
    subtitle: "Deliver · 15 minutes | 2.55 km",
  },
  {
    id: "sug-p2",
    type: "pharmacy",
    title: "Al-Shifa Pharmacy",
    subtitle: "Deliver · 20 minutes | 3.1 km",
  },
];

/* ------------------------------------------------------------------
   Filter Tags (Scenario 5 — Results with Filters)
   ------------------------------------------------------------------ */

export const DEFAULT_FILTER_TAGS: FilterTag[] = [
  { id: "blood-pressure", label: "Blood Pressure" },
  { id: "loria", label: "Loria" },
  { id: "price", label: "Price · 50$" },
  { id: "distance", label: "Distance · 5km" },
  { id: "no-prescription", label: "No Prescription" },
  { id: "rating", label: "5 Rating" },
  { id: "in-stock", label: "In stock" },
  { id: "on-sale", label: "On sale" },
];

/* ------------------------------------------------------------------
   Full-Results Products — 20 diverse medicines (Scenario 4)
   ------------------------------------------------------------------ */

export const MEDICINES_DB: SearchResult[] = [
  {
    id: "med-1",
    type: "medicine",
    title: "Pain Relief-X",
    subtitle: "Tablet · 12 tablets",
    tags: ["OTC", "12 Tablets", "400 mg"],
    price: 12.0,
    originalPrice: 15.0,
    pharmacyName: "City Pharmacy",
    isAvailable: true,
    deliveryTimeMinutes: 15,
    pharmacyDistanceKm: 2.55,
    requiresPrescription: false,
  },
  {
    id: "med-2",
    type: "medicine",
    title: "Panadol Extra",
    subtitle: "Tablet · 24 tablets",
    tags: ["OTC", "24 Tablets", "500 mg"],
    price: 8.5,
    originalPrice: 10.0,
    pharmacyName: "Al-Shifa Pharmacy",
    isAvailable: true,
    deliveryTimeMinutes: 20,
    pharmacyDistanceKm: 3.1,
    requiresPrescription: false,
  },
  {
    id: "med-3",
    type: "medicine",
    title: "Panadol Advance",
    subtitle: "Tablet · 48 tablets",
    tags: ["OTC", "48 Tablets", "500 mg"],
    price: 14.0,
    originalPrice: 14.0,
    pharmacyName: "MedPlus Store",
    isAvailable: true,
    deliveryTimeMinutes: 25,
    pharmacyDistanceKm: 4.2,
    requiresPrescription: false,
  },
  {
    id: "med-4",
    type: "medicine",
    title: "Amoxicillin 500mg",
    subtitle: "Capsule · 21 capsules",
    tags: ["Rx", "21 Capsules", "500 mg"],
    price: 18.0,
    originalPrice: 22.0,
    pharmacyName: "City Pharmacy",
    isAvailable: true,
    deliveryTimeMinutes: 15,
    pharmacyDistanceKm: 2.55,
    requiresPrescription: true,
  },
  {
    id: "med-5",
    type: "medicine",
    title: "Augmentin 625mg",
    subtitle: "Tablet · 14 tablets",
    tags: ["Rx", "14 Tablets", "625 mg"],
    price: 32.0,
    originalPrice: 38.0,
    pharmacyName: "Al-Shifa Pharmacy",
    isAvailable: true,
    deliveryTimeMinutes: 18,
    pharmacyDistanceKm: 3.1,
    requiresPrescription: true,
  },
  {
    id: "med-6",
    type: "medicine",
    title: "Vitamin C 1000mg",
    subtitle: "Effervescent · 20 tablets",
    tags: ["OTC", "20 Tablets", "1000 mg"],
    price: 6.5,
    originalPrice: 8.0,
    pharmacyName: "HealthFirst Pharmacy",
    isAvailable: true,
    deliveryTimeMinutes: 30,
    pharmacyDistanceKm: 5.0,
    requiresPrescription: false,
  },
  {
    id: "med-7",
    type: "medicine",
    title: "Vitamin D3 5000 IU",
    subtitle: "Softgel · 60 capsules",
    tags: ["OTC", "60 Capsules", "5000 IU"],
    price: 15.0,
    originalPrice: 15.0,
    pharmacyName: "City Pharmacy",
    isAvailable: true,
    deliveryTimeMinutes: 15,
    pharmacyDistanceKm: 2.55,
    requiresPrescription: false,
  },
  {
    id: "med-8",
    type: "medicine",
    title: "Ibuprofen 200mg",
    subtitle: "Tablet · 30 tablets",
    tags: ["OTC", "30 Tablets", "200 mg"],
    price: 5.0,
    originalPrice: 7.5,
    pharmacyName: "MedPlus Store",
    isAvailable: true,
    deliveryTimeMinutes: 22,
    pharmacyDistanceKm: 4.0,
    requiresPrescription: false,
  },
  {
    id: "med-9",
    type: "medicine",
    title: "Aspirin 100mg",
    subtitle: "Tablet · 30 tablets",
    tags: ["OTC", "30 Tablets", "100 mg"],
    price: 3.5,
    originalPrice: 5.0,
    pharmacyName: "City Pharmacy",
    isAvailable: true,
    deliveryTimeMinutes: 15,
    pharmacyDistanceKm: 2.55,
    requiresPrescription: false,
  },
  {
    id: "med-10",
    type: "medicine",
    title: "Cetirizine 10mg",
    subtitle: "Tablet · 20 tablets",
    tags: ["OTC", "20 Tablets", "10 mg"],
    price: 4.0,
    originalPrice: 6.0,
    pharmacyName: "HealthFirst Pharmacy",
    isAvailable: true,
    deliveryTimeMinutes: 28,
    pharmacyDistanceKm: 4.8,
    requiresPrescription: false,
  },
  {
    id: "med-11",
    type: "medicine",
    title: "Loratadine 10mg",
    subtitle: "Tablet · 10 tablets",
    tags: ["OTC", "10 Tablets", "10 mg"],
    price: 7.0,
    originalPrice: 9.0,
    pharmacyName: "Al-Shifa Pharmacy",
    isAvailable: true,
    deliveryTimeMinutes: 20,
    pharmacyDistanceKm: 3.1,
    requiresPrescription: false,
  },
  {
    id: "med-12",
    type: "medicine",
    title: "Omeprazole 20mg",
    subtitle: "Capsule · 14 capsules",
    tags: ["Rx", "14 Capsules", "20 mg"],
    price: 10.0,
    originalPrice: 12.0,
    pharmacyName: "City Pharmacy",
    isAvailable: true,
    deliveryTimeMinutes: 15,
    pharmacyDistanceKm: 2.55,
    requiresPrescription: true,
  },
  {
    id: "med-13",
    type: "medicine",
    title: "Metformin 500mg",
    subtitle: "Tablet · 60 tablets",
    tags: ["Rx", "60 Tablets", "500 mg"],
    price: 9.0,
    originalPrice: 9.0,
    pharmacyName: "MedPlus Store",
    isAvailable: true,
    deliveryTimeMinutes: 25,
    pharmacyDistanceKm: 4.2,
    requiresPrescription: true,
  },
  {
    id: "med-14",
    type: "medicine",
    title: "Losartan 50mg",
    subtitle: "Tablet · 30 tablets",
    tags: ["Rx", "30 Tablets", "50 mg"],
    price: 11.0,
    originalPrice: 14.0,
    pharmacyName: "HealthFirst Pharmacy",
    isAvailable: true,
    deliveryTimeMinutes: 30,
    pharmacyDistanceKm: 5.0,
    requiresPrescription: true,
  },
  {
    id: "med-15",
    type: "medicine",
    title: "Amlodipine 5mg",
    subtitle: "Tablet · 30 tablets",
    tags: ["Rx", "30 Tablets", "5 mg"],
    price: 8.0,
    originalPrice: 10.0,
    pharmacyName: "Al-Shifa Pharmacy",
    isAvailable: true,
    deliveryTimeMinutes: 18,
    pharmacyDistanceKm: 3.1,
    requiresPrescription: true,
  },
  {
    id: "med-16",
    type: "medicine",
    title: "Azithromycin 250mg",
    subtitle: "Capsule · 6 tablets",
    tags: ["Rx", "6 Tablets", "250 mg"],
    price: 25.0,
    originalPrice: 30.0,
    pharmacyName: "HealthFirst Pharmacy",
    isAvailable: true,
    deliveryTimeMinutes: 30,
    pharmacyDistanceKm: 5.0,
    requiresPrescription: true,
  },
  {
    id: "med-17",
    type: "medicine",
    title: "Diclofenac 50mg",
    subtitle: "Tablet · 20 tablets",
    tags: ["Rx", "20 Tablets", "50 mg"],
    price: 6.0,
    originalPrice: 8.0,
    pharmacyName: "City Pharmacy",
    isAvailable: true,
    deliveryTimeMinutes: 15,
    pharmacyDistanceKm: 2.55,
    requiresPrescription: true,
  },
  {
    id: "med-18",
    type: "medicine",
    title: "Insulin Glargine",
    subtitle: "Injection · 1 pen",
    tags: ["Rx", "1 Pen", "100 IU/ml"],
    price: 45.0,
    originalPrice: 55.0,
    pharmacyName: "Al-Shifa Pharmacy",
    isAvailable: false,
    deliveryTimeMinutes: 35,
    pharmacyDistanceKm: 3.1,
    requiresPrescription: true,
  },
  {
    id: "med-19",
    type: "medicine",
    title: "Salbutamol Inhaler",
    subtitle: "Inhaler · 200 doses",
    tags: ["Rx", "200 Doses", "100 mcg"],
    price: 12.0,
    originalPrice: 15.0,
    pharmacyName: "MedPlus Store",
    isAvailable: true,
    deliveryTimeMinutes: 25,
    pharmacyDistanceKm: 4.2,
    requiresPrescription: true,
  },
  {
    id: "med-20",
    type: "medicine",
    title: "Cough Syrup DM",
    subtitle: "Syrup · 120ml",
    tags: ["OTC", "120 ml", "15 mg/5ml"],
    price: 7.5,
    originalPrice: 10.0,
    pharmacyName: "City Pharmacy",
    isAvailable: true,
    deliveryTimeMinutes: 15,
    pharmacyDistanceKm: 2.55,
    requiresPrescription: false,
  },
];

/* ------------------------------------------------------------------
   Category keyword mapping for broader search
   ------------------------------------------------------------------ */

export const CATEGORY_KEYWORDS: Record<string, string[]> = {
  pain: ["pain relief-x", "ibuprofen", "aspirin", "diclofenac"],
  headache: [
    "pain relief-x",
    "panadol extra",
    "panadol advance",
    "ibuprofen",
    "aspirin",
  ],
  fever: ["panadol extra", "panadol advance", "ibuprofen", "aspirin"],
  antibiotic: ["amoxicillin", "augmentin", "azithromycin"],
  vitamin: ["vitamin c", "vitamin d3"],
  allergy: ["cetirizine", "loratadine"],
  "blood pressure": ["losartan", "amlodipine"],
  diabetes: ["metformin", "insulin"],
  cough: ["cough syrup"],
  stomach: ["omeprazole"],
  inhaler: ["salbutamol"],
  asthma: ["salbutamol"],
};

/* ------------------------------------------------------------------
   Spell-check dictionary
   ------------------------------------------------------------------ */

export const SPELL_CHECK: Record<string, string> = {
  heasache: "Headache",
  headche: "Headache",
  panado: "Panadol",
  paracetemol: "Paracetamol",
  amoxicilin: "Amoxicillin",
  augmentn: "Augmentin",
  vitamine: "Vitamin C",
  ibuprofn: "Ibuprofen",
  aspirn: "Aspirin",
  losatan: "Losartan",
  omeprazol: "Omeprazole",
  metformn: "Metformin",
  cetrizine: "Cetirizine",
  loratadin: "Loratadine",
  azithromicin: "Azithromycin",
  diclofnac: "Diclofenac",
  insuln: "Insulin",
  salbutamoll: "Salbutamol",
};

/* ------------------------------------------------------------------
   Nearby Pharmacies (Scenario 6)
   ------------------------------------------------------------------ */

export const NEARBY_PHARMACIES: NearbyPharmacy[] = [
  {
    id: "np-1",
    name: "Amal Pharmacy",
    location: "26 Salah El Din St, Gaza City",
    rating: 4.8,
    deliveryRange: "30 min",
    distance: "2.55 km",
    price: 12.5,
    freeDelivery: true,
  },
  {
    id: "np-2",
    name: "Al-Shifa Pharmacy",
    location: "Al-Shifa Street, Gaza City",
    rating: 4.5,
    deliveryRange: "45 min",
    distance: "3.1 km",
    price: 14.0,
    freeDelivery: true,
  },
];

/* ------------------------------------------------------------------
   Search helper — fuzzy match on query
   ------------------------------------------------------------------ */

export function searchMedicines(q: string): SearchResult[] {
  const lower = q.toLowerCase().trim();
  if (!lower) return [];

  // 1. Check category keywords first
  for (const [category, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
    if (lower.includes(category)) {
      return MEDICINES_DB.filter((m) =>
        keywords.some((kw) => m.title.toLowerCase().includes(kw)),
      );
    }
  }

  // 2. Direct title/tag/subtitle match
  const matches = MEDICINES_DB.filter((m) => {
    const titleMatch = m.title.toLowerCase().includes(lower);
    const subtitleMatch = m.subtitle.toLowerCase().includes(lower);
    const tagMatch = m.tags?.some((t) => t.toLowerCase().includes(lower));
    const pharmacyMatch = m.pharmacyName?.toLowerCase().includes(lower);
    const typeMatch =
      lower === "otc"
        ? !m.requiresPrescription
        : lower === "rx" || lower === "prescription"
          ? m.requiresPrescription
          : false;
    return (
      titleMatch || subtitleMatch || tagMatch || pharmacyMatch || typeMatch
    );
  });

  if (matches.length > 0) return matches;

  // 3. Partial / fuzzy — match any word
  const words = lower.split(/\s+/);
  const fuzzy = MEDICINES_DB.filter((m) =>
    words.some(
      (w) =>
        m.title.toLowerCase().includes(w) ||
        m.subtitle.toLowerCase().includes(w) ||
        m.tags?.some((t) => t.toLowerCase().includes(w)),
    ),
  );

  return fuzzy;
}

/* ------------------------------------------------------------------
   Spell-check helper
   ------------------------------------------------------------------ */

export function getSuggestion(query: string): string | null {
  const lower = query.toLowerCase().trim();
  return SPELL_CHECK[lower] ?? null;
}
