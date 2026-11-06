/**
 * Patient-side fixtures that are not catalog or order data:
 * saved addresses, prescriptions and notifications.
 */

import type {
  PatientAddressResponse,
  PrescriptionResponseDto,
} from "@/types/api.types";

import { CITIES, IMG, daysAgo, hoursAgo } from "./common";

export function buildAddresses(): PatientAddressResponse[] {
  return [
    {
      id: 301,
      cityId: CITIES[0].id,
      cityName: CITIES[0].name,
      addressLine1: "Omar Al-Mukhtar Street, Rimal",
      addressLine2: "Building 14, 3rd floor",
      label: "Home",
      region: "Gaza Governorate",
      area: "Rimal",
      latitude: 31.5175,
      longitude: 34.4515,
      isDefault: true,
    },
    {
      id: 302,
      cityId: CITIES[0].id,
      cityName: CITIES[0].name,
      addressLine1: "Al-Azhar University Road, Tal Al-Hawa",
      addressLine2: null,
      label: "Work",
      region: "Gaza Governorate",
      area: "Tal Al-Hawa",
      latitude: 31.4986,
      longitude: 34.4293,
      isDefault: false,
    },
    {
      id: 303,
      cityId: CITIES[1].id,
      cityName: CITIES[1].name,
      addressLine1: "Jamal Abdel Nasser Street",
      addressLine2: "Near Nasser Hospital",
      label: "Family",
      region: "Khan Younis Governorate",
      area: "Al-Amal",
      latitude: 31.3461,
      longitude: 34.3063,
      isDefault: false,
    },
  ];
}

export function buildPrescriptions(): PrescriptionResponseDto[] {
  return [
    {
      id: 601,
      status: "APPROVED",
      reuploadReason: null,
      reuploadRequestedAt: null,
      createdAt: daysAgo(4),
      updatedAt: daysAgo(4),
      isActive: true,
      files: [{ id: 6011, url: IMG.prescription, sortOrder: 0 }],
    },
    {
      id: 602,
      status: "UNDER_REVIEW",
      reuploadReason: null,
      reuploadRequestedAt: null,
      createdAt: hoursAgo(6),
      updatedAt: hoursAgo(6),
      isActive: true,
      files: [{ id: 6021, url: IMG.prescription, sortOrder: 0 }],
    },
    {
      id: 603,
      status: "REUPLOAD_REQUESTED",
      reuploadReason:
        "The dosage line is cut off at the bottom of the photo. Please re-upload the full prescription.",
      reuploadRequestedAt: daysAgo(2),
      createdAt: daysAgo(3),
      updatedAt: daysAgo(2),
      isActive: true,
      files: [{ id: 6031, url: IMG.prescription, sortOrder: 0 }],
    },
  ];
}

export interface ShowcaseNotification {
  id: number;
  title: string;
  message: string;
  type: "order" | "prescription" | "system" | "promo";
  isRead: boolean;
  createdAt: string;
}

export function buildPatientNotifications(): ShowcaseNotification[] {
  return [
    {
      id: 901,
      title: "Your order is on the way",
      message:
        "Order #5101 from Al-Shifa Pharmacy has left the pharmacy. Khaled is delivering it to Rimal.",
      type: "order",
      isRead: false,
      createdAt: hoursAgo(2),
    },
    {
      id: 902,
      title: "Prescription approved",
      message:
        "Al-Shifa Pharmacy approved your prescription. You can now complete your order for Augmentin 625.",
      type: "prescription",
      isRead: false,
      createdAt: hoursAgo(7),
    },
    {
      id: 903,
      title: "Re-upload requested",
      message:
        "The dosage line on your prescription was cut off. Please upload a clearer photo.",
      type: "prescription",
      isRead: true,
      createdAt: daysAgo(2),
    },
    {
      id: 904,
      title: "Order delivered",
      message: "Order #5103 was delivered on Salah Al-Din Road. Thanks for using CureWay.",
      type: "order",
      isRead: true,
      createdAt: daysAgo(4),
    },
    {
      id: 905,
      title: "Free delivery in Gaza this week",
      message: "Orders over $25 from pharmacies in Gaza city ship free until Friday.",
      type: "promo",
      isRead: true,
      createdAt: daysAgo(6),
    },
  ];
}

export function buildPharmacyNotifications(): ShowcaseNotification[] {
  return [
    {
      id: 921,
      title: "New order received",
      message: "Order #5106 needs review — Ventolin Inhaler requires a prescription check.",
      type: "order",
      isRead: false,
      createdAt: hoursAgo(1),
    },
    {
      id: 922,
      title: "Low stock warning",
      message: "Zyrtec 10mg is down to 12 packs, below your minimum of 20.",
      type: "system",
      isRead: false,
      createdAt: hoursAgo(5),
    },
    {
      id: 923,
      title: "Out of stock",
      message: "Ventolin Inhaler and Ciprobay 500mg are out of stock.",
      type: "system",
      isRead: true,
      createdAt: daysAgo(1),
    },
  ];
}

export function buildAdminNotifications(): ShowcaseNotification[] {
  return [
    {
      id: 941,
      title: "Pharmacy awaiting verification",
      message: "Nour Al-Sabah Pharmacy (Jabalia) submitted licence PS-JB-2022-7215 for review.",
      type: "system",
      isRead: false,
      createdAt: hoursAgo(4),
    },
    {
      id: 942,
      title: "Pharmacy awaiting verification",
      message: "Rafah Central Pharmacy submitted licence PS-RF-2023-8033 for review.",
      type: "system",
      isRead: false,
      createdAt: daysAgo(1),
    },
    {
      id: 943,
      title: "Medicine pending approval",
      message: "CH-Alpha Active was submitted by Amal Pharmacy and needs catalog review.",
      type: "system",
      isRead: true,
      createdAt: daysAgo(3),
    },
  ];
}
