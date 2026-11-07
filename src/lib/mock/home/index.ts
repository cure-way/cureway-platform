/* ------------------------------------------------------------------ 
   Home page demo / mock data
   Centralised here so every section renders from one source of truth.
   ------------------------------------------------------------------ */

/* ---- Promo Banner ---- */
export interface PromoBanner {
  discount: string;
  title: string;
  subtitle: string;
}

export const promoBanner: PromoBanner = {
  discount: "20%",
  title: "Discount on First Aid",
  subtitle: "Everything you need to act fast in emergencies",
};

/* ---- Hero ---- */
export interface HeroData {
  heading: string;
  subheading: string;
  ctas: { label: string; icon: string }[];
}

export const heroData: HeroData = {
  heading: "Your Trusted Online Pharmacy for Every Need",
  subheading:
    "Order medicines, consult doctors online, and get doorstep delivery within 24 hours.",
  ctas: [
    { label: "Orders by prescriptions", icon: "prescription" },
    { label: "Delivery to your location", icon: "delivery" },
  ],
};

export interface HeroBadge {
  value: string;
  label: string;
  variant: "primary" | "accent" | "outline";
}

export const heroBadges: HeroBadge[] = [
  { value: "+2.5M", label: "Happy Users", variant: "primary" },
  { value: "100%", label: "Pharmacist Certified", variant: "accent" },
  { value: "99%", label: "Satisfying Treatment", variant: "outline" },
];

/* ---- Categories ---- */
export interface CategoryItem {
  id: string;
  name: string;
  description: string;
  image: string;
}

export const categories: CategoryItem[] = [
  {
    id: "daily-essentials",
    name: "Daily Essentials",
    description: "Vitamins, pain relief",
    image: "/patient/Daily Essentials.png",
  },
  {
    id: "cold-flu",
    name: "Cold & Flu medicine",
    description: "Flu, cough, sore throat",
    image: "/patient/Cold and Flu medicine.png",
  },
  {
    id: "vitamins-supplements",
    name: "Vitamins & Supplements",
    description: "Immunity, energy, daily nutrition",
    image: "/patient/Vitamins and Supplements.png",
  },
  {
    id: "medical-equipment",
    name: "Medical Equipment",
    description: "Wheelchairs, walkers, devices",
    image: "/patient/Medical Equipment.png",
  },
];

/* ---- Nearby Pharmacies ---- */
export interface PharmacyItem {
  id: string;
  name: string;
  image: string;
  deliveryTime: string;
  distance: string;
  rating: number;
  ratingCount: string;
  deliveryFee: string;
}

export const nearbyPharmacies: PharmacyItem[] = [
  {
    id: "amal",
    name: "Amal Pharmacy",
    image: "/patient/Amal Pharmacy.png",
    deliveryTime: "15 minutes",
    distance: "2.55 km",
    rating: 4.9,
    ratingCount: "580+",
    deliveryFee: "4",
  },
  {
    id: "city",
    name: "City Pharmacy",
    image: "/patient/City Pharmacy.png",
    deliveryTime: "15 minutes",
    distance: "2.55 km",
    rating: 4.8,
    ratingCount: "530+",
    deliveryFee: "5",
  },
  {
    id: "lie",
    name: "LIE Pharmacy",
    image: "/patient/LIE Pharmacy.png",
    deliveryTime: "15 minutes",
    distance: "2.55 km",
    rating: 4.8,
    ratingCount: "530+",
    deliveryFee: "5",
  },
];

/* ---- Most Sales Products ---- */
export interface ProductItem {
  id: string;
  name: string;
  subtitle: string;
  dosage: string;
  price: number;
  originalPrice?: number;
  discount?: string;
  image: string;
}

export const mostSalesProducts: ProductItem[] = [
  {
    id: "pain-relief-x",
    name: "Pain Relief-X",
    subtitle: "30 Tablets",
    dosage: "400 mg",
    price: 12.0,
    originalPrice: 15.0,
    discount: "25% Off",
    image: "/patient/Pain Relief-X.png",
  },
  {
    id: "voltaren",
    name: "Voltaren",
    subtitle: "30 Tablets",
    dosage: "400 mg",
    price: 15.0,
    originalPrice: 20.0,
    discount: "25% Off",
    image: "/patient/Voltaren.png",
  },
  {
    id: "ch-alpha",
    name: "CH Alpha Active",
    subtitle: "Syrup Ampoules",
    dosage: "30 mL",
    price: 40.0,
    discount: "25% Off",
    image: "/patient/CH Alpha Active.png",
  },
  {
    id: "vitamin-c",
    name: "Vitamin C",
    subtitle: "",
    dosage: "100 mg",
    price: 9.0,
    originalPrice: 10.0,
    discount: "10% Off",
    image: "/patient/Vitamin C.png",
  },
  {
    id: "biogen-collagen",
    name: "Biogen Collagen",
    subtitle: "24 Sachets",
    dosage: "100 mg",
    price: 12.0,
    image: "/patient/Biogen Collagen.png",
  },
  {
    id: "zecuf",
    name: "Zecuf",
    subtitle: "",
    dosage: "100 mL",
    price: 9.0,
    image: "/patient/Zecuf.png",
  },
];

/* ---- Bottom CTA / Find Pharmacy ---- */
export interface FindPharmacyStep {
  icon: string;
  title: string;
  description: string;
}

export const findPharmacySteps: FindPharmacyStep[] = [
  {
    icon: "location",
    title: "Write current location",
    description:
      "Find nearest pharmacies based on the location that you shared with us.",
  },
  {
    icon: "click",
    title: "Select the pharmacy",
    description:
      "Select nearest pharmacies based on the location that you shared with us.",
  },
  {
    icon: "consult",
    title: "Get the consult",
    description:
      "Select nearest pharmacies based on the location that you shared with us.",
  },
];
