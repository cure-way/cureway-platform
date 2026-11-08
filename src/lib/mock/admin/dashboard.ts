/**
 * Admin Dashboard — Mock Data & Types
 *
 * Centralized data for all dashboard widget components.
 * Extracted from inline definitions for clarity & reuse.
 */

/* ═══════════════════════════════════════════════════════
   RevenueChart
   ═══════════════════════════════════════════════════════ */

export const revenueMonths = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

/** Bar values (in thousands), max = 100K */
export const revenueBarData = [35, 15, 52, 83, 89, 11, 42, 42, 22, 73, 12, 100];

export type BarType = "previous" | "current" | "incomplete";

export const revenueBarTypes: BarType[] = [
  "previous",
  "previous",
  "previous",
  "previous",
  "previous",
  "previous",
  "current",
  "previous",
  "previous",
  "previous",
  "incomplete",
  "incomplete",
];

export const barColorMap: Record<BarType, string> = {
  previous: "#2B3C63",
  current: "#34C759",
  incomplete: "#CDD9F4",
};

export const revenueYLabels = ["100K", "80K", "60K", "40K", "20K", "0"];

/* ── Revenue timeframe datasets ── */

export type RevenueTimeframe = "Week" | "Month" | "Year";

export interface RevenueDataset {
  labels: string[];
  values: number[];
  types: BarType[];
  yLabels: string[];
  max: number;
}

export const revenueDatasets: Record<RevenueTimeframe, RevenueDataset> = {
  Week: {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    values: [12, 28, 18, 35, 42, 22, 8],
    types: [
      "previous",
      "previous",
      "previous",
      "current",
      "previous",
      "previous",
      "incomplete",
    ],
    yLabels: ["50K", "40K", "30K", "20K", "10K", "0"],
    max: 50,
  },
  Month: {
    labels: revenueMonths,
    values: [35, 15, 52, 83, 89, 11, 42, 42, 22, 73, 12, 100],
    types: [
      "previous",
      "previous",
      "previous",
      "previous",
      "previous",
      "previous",
      "current",
      "previous",
      "previous",
      "previous",
      "incomplete",
      "incomplete",
    ],
    yLabels: ["100K", "80K", "60K", "40K", "20K", "0"],
    max: 100,
  },
  Year: {
    labels: ["2021", "2022", "2023", "2024", "2025", "2026"],
    values: [220, 340, 480, 620, 750, 300],
    types: [
      "previous",
      "previous",
      "previous",
      "previous",
      "current",
      "incomplete",
    ],
    yLabels: ["800K", "600K", "400K", "200K", "0"],
    max: 800,
  },
};

/* ── Experience timeframe datasets ── */

export interface ExperienceDataset {
  segments: ExperienceSegment[];
  totalLabel: string;
  totalValue: string;
  centerPct: string;
}

export const experienceDatasets: Record<
  (typeof experienceTabs)[number],
  ExperienceDataset
> = {
  Week: {
    segments: [
      {
        label: "Pharmacy",
        color: "#334EAC",
        value: 80,
        strokeColor: "#334EAC",
        trackColor: "#EBEDF7",
      },
      {
        label: "Patient",
        color: "#FFD15C",
        value: 60,
        strokeColor: "#FFD15C",
        trackColor: "#FFFAEF",
      },
      {
        label: "Delivery",
        color: "#34C759",
        value: 40,
        strokeColor: "#34C759",
        trackColor: "#EBF9EE",
      },
    ],
    totalLabel: "Total prescriptions",
    totalValue: "1,284",
    centerPct: "43%",
  },
  Month: {
    segments: [
      {
        label: "Pharmacy",
        color: "#334EAC",
        value: 72,
        strokeColor: "#334EAC",
        trackColor: "#EBEDF7",
      },
      {
        label: "Patient",
        color: "#FFD15C",
        value: 55,
        strokeColor: "#FFD15C",
        trackColor: "#FFFAEF",
      },
      {
        label: "Delivery",
        color: "#34C759",
        value: 48,
        strokeColor: "#34C759",
        trackColor: "#EBF9EE",
      },
    ],
    totalLabel: "Total prescriptions",
    totalValue: "5,120",
    centerPct: "58%",
  },
  Year: {
    segments: [
      {
        label: "Pharmacy",
        color: "#334EAC",
        value: 88,
        strokeColor: "#334EAC",
        trackColor: "#EBEDF7",
      },
      {
        label: "Patient",
        color: "#FFD15C",
        value: 70,
        strokeColor: "#FFD15C",
        trackColor: "#FFFAEF",
      },
      {
        label: "Delivery",
        color: "#34C759",
        value: 52,
        strokeColor: "#34C759",
        trackColor: "#EBF9EE",
      },
    ],
    totalLabel: "Total prescriptions",
    totalValue: "61,440",
    centerPct: "70%",
  },
};

export interface RevenueMetric {
  label: string;
  value: string;
  change: string;
  positive: boolean;
}

export const revenueMetrics: RevenueMetric[] = [
  {
    label: "Average order",
    value: "$32.00",
    change: "+2.43%",
    positive: true,
  },
  { label: "Orders", value: "1,284", change: "+15.43%", positive: true },
  { label: "Refunds", value: "2.01%", change: "+1.78%", positive: true },
];

export const revenueLegends = [
  { label: "Previous periods", color: "#212F4D" },
  { label: "Current period", color: "#34C759" },
  { label: "Incomplete data", color: "#CDD9F4" },
];

/* ═══════════════════════════════════════════════════════
   RecentOrders
   ═══════════════════════════════════════════════════════ */

export interface DashboardOrder {
  id: string;
  customer: string;
  contact: string;
  pharmacy: string;
  branch: string;
  date: string;
  time: string;
  payment: string;
  delivery: string;
  avatar: string;
  avatarBg: string;
}

export const dashboardOrders: DashboardOrder[] = [
  {
    id: "#C0001",
    customer: "Mohammed B. K. Alfarra",
    contact: "Gaza, (+970) 59-244-9634",
    pharmacy: "City Pharmacy",
    branch: "Gaza Branch",
    date: "12, Mar, 2026",
    time: "At 11:34pm",
    payment: "Paid",
    delivery: "Delivered",
    avatar: "/avatar.png",
    avatarBg: "#FFFDC3",
  },
  {
    id: "#C0002",
    customer: "Mohammed B. K. Alfarra",
    contact: "Gaza, (+970) 59-244-9634",
    pharmacy: "City Pharmacy",
    branch: "Gaza Branch",
    date: "12, Mar, 2026",
    time: "At 11:34pm",
    payment: "Paid",
    delivery: "Delivered",
    avatar: "/avatar-boy-with-glaces.png",
    avatarBg: "#FDE5FF",
  },
  {
    id: "#C0003",
    customer: "Mohammed B. K. Alfarra",
    contact: "Gaza, (+970) 59-244-9634",
    pharmacy: "City Pharmacy",
    branch: "Gaza Branch",
    date: "12, Mar, 2026",
    time: "At 11:34pm",
    payment: "Paid",
    delivery: "Delivered",
    avatar: "/avatar-girl-with-glaces.png",
    avatarBg: "#DCFFDF",
  },
  {
    id: "#C0004",
    customer: "Mohammed B. K. Alfarra",
    contact: "Gaza, (+970) 59-244-9634",
    pharmacy: "City Pharmacy",
    branch: "Gaza Branch",
    date: "12, Mar, 2026",
    time: "At 11:34pm",
    payment: "Paid",
    delivery: "Delivered",
    avatar: "/avatar.png",
    avatarBg: "#FFFDC3",
  },
  {
    id: "#C0005",
    customer: "Mohammed B. K. Alfarra",
    contact: "Gaza, (+970) 59-244-9634",
    pharmacy: "City Pharmacy",
    branch: "Gaza Branch",
    date: "12, Mar, 2026",
    time: "At 11:34pm",
    payment: "Paid",
    delivery: "Delivered",
    avatar: "/avatar.png",
    avatarBg: "#FFFDC3",
  },
];

/* ═══════════════════════════════════════════════════════
   RecentPharmacies
   ═══════════════════════════════════════════════════════ */

export interface DashboardPharmacy {
  name: string;
  branch: string;
}

export const dashboardPharmacies: DashboardPharmacy[] = [
  { name: "City Pharmacy", branch: "Gaza Branch" },
  { name: "Family Pharmacy", branch: "Rafah Branch" },
  { name: "Al-Shfia Pharmacy", branch: "Khan Younis Branch" },
  { name: "Al-Aqsa Pharmacy", branch: "Nablus Branch" },
];

/* ═══════════════════════════════════════════════════════
   RecentDeliveries
   ═══════════════════════════════════════════════════════ */

export interface DashboardDelivery {
  name: string;
  vehicle: string;
}

export const dashboardDeliverers: DashboardDelivery[] = [
  { name: "Mohammed B. K. Alfarra", vehicle: "Vehicle type: Bike" },
  { name: "Sara J. Khan", vehicle: "Vehicle type: Car" },
  { name: "Faisal M. A. Hammad", vehicle: "Vehicle type: Car" },
  { name: "Layla S. T. Ibrahim", vehicle: "Vehicle type: Car" },
];

/* ═══════════════════════════════════════════════════════
   RecentPatients
   ═══════════════════════════════════════════════════════ */

export interface DashboardPatient {
  name: string;
  contact: string;
}

export const dashboardPatients: DashboardPatient[] = [
  { name: "Mohammed B. K. Alfarra", contact: "Gaza, (+970) 59-244-9634" },
  { name: "Sara J. Khan", contact: "Ramallah, (+970) 59-345-6789" },
  { name: "Faisal M. A. Hammad", contact: "Nablus, (+970) 58-456-7890" },
  { name: "Layla S. T. Ibrahim", contact: "Hebron, (+970) 57-567-8901" },
];

/* ═══════════════════════════════════════════════════════
   TopCategories
   ═══════════════════════════════════════════════════════ */

export interface DashboardCategory {
  label: string;
  sales: number;
  borderColor: string;
  fillColor: string;
  labelColor: string;
}

export const dashboardCategories: DashboardCategory[] = [
  {
    label: "OTC Medications",
    sales: 684,
    borderColor: "#334EAC",
    fillColor: "#334EAC",
    labelColor: "#5B5958",
  },
  {
    label: "Vitamins",
    sales: 100,
    borderColor: "#FFD15C",
    fillColor: "#FFD15C",
    labelColor: "#5B5958",
  },
  {
    label: "Pain Relief",
    sales: 216,
    borderColor: "#34C759",
    fillColor: "#34C759",
    labelColor: "#989593",
  },
];

/* ═══════════════════════════════════════════════════════
   SystemExperienceOverview
   ═══════════════════════════════════════════════════════ */

export const experienceTabs = ["Week", "Month", "Year"] as const;
export const experienceActiveTab: (typeof experienceTabs)[number] = "Week";

export interface ExperienceSegment {
  label: string;
  color: string;
  /** Percentage filled for this ring (0-100) */
  value: number;
  /** CSS color for SVG stroke */
  strokeColor: string;
  /** track (background) color */
  trackColor: string;
}

export const experienceSegments: ExperienceSegment[] = [
  {
    label: "Pharmacy",
    color: "#334EAC",
    value: 80,
    strokeColor: "#334EAC",
    trackColor: "#EBEDF7",
  },
  {
    label: "Patient",
    color: "#FFD15C",
    value: 60,
    strokeColor: "#FFD15C",
    trackColor: "#FFFAEF",
  },
  {
    label: "Delivery",
    color: "#34C759",
    value: 40,
    strokeColor: "#34C759",
    trackColor: "#EBF9EE",
  },
];
