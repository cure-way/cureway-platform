"use client";

import React, { useState } from "react";
import Image from "next/image";
import DeleteAccountModal from "./DeleteProfile";
import EditProfileModal from "./EditProfile";

export interface PharmacyProfile {
  name: string;
  image: string;
  address: string;
  city: string;
  country: string;
  phone: string;
  email: string;
  openingHours: string;
  workingDays: string;
  lastLogin: string;
  currentStatus: "online" | "offline";
}

interface PharmacyProfilePageProps {
  initialProfile?: PharmacyProfile;
}
// mock profile
const defaultProfile: PharmacyProfile = {
  name: "Al Shifa Pharmacy",
  image: "/images/pharmacy-profile.jpg",
  address: "26 Salah El Din St, Gaza",
  city: "Gaza City",
  country: "Palestine",
  phone: "+970 12345678",
  email: "AlshifaPharmacy@gmail.com",
  openingHours: "9AM-9PM",
  workingDays: "Every Day",
  lastLogin: "Today at 9:24 AM",
  currentStatus: "online",
};

// testing noti Icon Components
const ProfileIcon = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M10 0C4.48 0 0 4.48 0 10C0 15.52 4.48 20 10 20C15.52 20 20 15.52 20 10C20 4.48 15.52 0 10 0ZM10 3C11.66 3 13 4.34 13 6C13 7.66 11.66 9 10 9C8.34 9 7 7.66 7 6C7 4.34 8.34 3 10 3ZM10 17.2C7.5 17.2 5.29 15.92 4 13.98C4.03 11.99 8 10.9 10 10.9C11.99 10.9 15.97 11.99 16 13.98C14.71 15.92 12.5 17.2 10 17.2Z"
      fill="currentColor"
    />
  </svg>
);

const PasswordIcon = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 18 21"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M15 7H14V5C14 2.24 11.76 0 9 0C6.24 0 4 2.24 4 5V7H3C1.9 7 1 7.9 1 9V19C1 20.1 1.9 21 3 21H15C16.1 21 17 20.1 17 19V9C17 7.9 16.1 7 15 7ZM9 16C7.9 16 7 15.1 7 14C7 12.9 7.9 12 9 12C10.1 12 11 12.9 11 14C11 15.1 10.1 16 9 16ZM11.1 7H6.9V5C6.9 3.29 8.29 1.9 10 1.9C11.71 1.9 13.1 3.29 13.1 5V7H11.1Z"
      fill="currentColor"
    />
  </svg>
);

const NotificationIcon = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M10 20C11.1 20 12 19.1 12 18H8C8 19.1 8.9 20 10 20ZM16 14V9C16 5.93 14.37 3.36 11.5 2.68V2C11.5 1.17 10.83 0.5 10 0.5C9.17 0.5 8.5 1.17 8.5 2V2.68C5.64 3.36 4 5.92 4 9V14L2 16V17H18V16L16 14Z"
      fill="currentColor"
    />
  </svg>
);

const SettingsIcon = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M17.43 10.98C17.47 10.66 17.5 10.34 17.5 10C17.5 9.66 17.47 9.34 17.43 9.02L19.54 7.37C19.73 7.22 19.78 6.95 19.66 6.73L17.66 3.27C17.54 3.05 17.27 2.97 17.05 3.05L14.56 4.05C14.04 3.65 13.48 3.32 12.87 3.07L12.49 0.42C12.46 0.18 12.25 0 12 0H8C7.75 0 7.54 0.18 7.51 0.42L7.13 3.07C6.52 3.32 5.96 3.66 5.44 4.05L2.95 3.05C2.72 2.96 2.46 3.05 2.34 3.27L0.34 6.73C0.21 6.95 0.27 7.22 0.46 7.37L2.57 9.02C2.53 9.34 2.5 9.67 2.5 10C2.5 10.33 2.53 10.66 2.57 10.98L0.46 12.63C0.27 12.78 0.22 13.05 0.34 13.27L2.34 16.73C2.46 16.95 2.73 17.03 2.95 16.95L5.44 15.95C5.96 16.35 6.52 16.68 7.13 16.93L7.51 19.58C7.54 19.82 7.75 20 8 20H12C12.25 20 12.46 19.82 12.49 19.58L12.87 16.93C13.48 16.68 14.04 16.34 14.56 15.95L17.05 16.95C17.28 17.04 17.54 16.95 17.66 16.73L19.66 13.27C19.78 13.05 19.73 12.78 19.54 12.63L17.43 10.98ZM10 13.5C8.07 13.5 6.5 11.93 6.5 10C6.5 8.07 8.07 6.5 10 6.5C11.93 6.5 13.5 8.07 13.5 10C13.5 11.93 11.93 13.5 10 13.5Z"
      fill="currentColor"
    />
  </svg>
);

const LocationIcon = () => (
  <svg
    width="16"
    height="20"
    viewBox="0 0 16 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M8 0C3.58 0 0 3.58 0 8C0 14 8 22 8 22C8 22 16 14 16 8C16 3.58 12.42 0 8 0ZM8 10.5C6.62 10.5 5.5 9.38 5.5 8C5.5 6.62 6.62 5.5 8 5.5C9.38 5.5 10.5 6.62 10.5 8C10.5 9.38 9.38 10.5 8 10.5Z"
      fill="#64748B"
    />
  </svg>
);

const PhoneIcon = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 18 18"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M3.62 7.79C5.06 10.62 7.38 12.93 10.21 14.38L12.41 12.18C12.69 11.9 13.08 11.82 13.43 11.93C14.55 12.3 15.75 12.5 17 12.5C17.55 12.5 18 12.95 18 13.5V17C18 17.55 17.55 18 17 18C7.61 18 0 10.39 0 1C0 0.45 0.45 0 1 0H4.5C5.05 0 5.5 0.45 5.5 1C5.5 2.25 5.7 3.45 6.07 4.57C6.18 4.92 6.1 5.31 5.82 5.59L3.62 7.79Z"
      fill="#64748B"
    />
  </svg>
);

const EmailIcon = () => (
  <svg
    width="20"
    height="16"
    viewBox="0 0 20 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M18 0H2C0.9 0 0.01 0.9 0.01 2L0 14C0 15.1 0.9 16 2 16H18C19.1 16 20 15.1 20 14V2C20 0.9 19.1 0 18 0ZM18 4L10 9L2 4V2L10 7L18 2V4Z"
      fill="#64748B"
    />
  </svg>
);

const ClockIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M9.99 0C4.47 0 0 4.48 0 10C0 15.52 4.47 20 9.99 20C15.52 20 20 15.52 20 10C20 4.48 15.52 0 9.99 0ZM10 18C5.58 18 2 14.42 2 10C2 5.58 5.58 2 10 2C14.42 2 18 5.58 18 10C18 14.42 14.42 18 10 18ZM10.5 5H9V11L14.25 14.15L15 12.92L10.5 10.25V5Z"
      fill="#64748B"
    />
  </svg>
);

const LoginIcon = () => (
  <svg
    width="20"
    height="18"
    viewBox="0 0 20 18"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M10.09 13.59L11.5 15L17.5 9L11.5 3L10.09 4.41L13.67 8H0V10H13.67L10.09 13.59ZM18 0H2C0.89 0 0 0.9 0 2V6H2V2H18V16H2V12H0V16C0 17.1 0.89 18 2 18H18C19.1 18 20 17.1 20 16V2C20 0.9 19.1 0 18 0Z"
      fill="#64748B"
    />
  </svg>
);

const StatusIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle cx="10" cy="10" r="3" fill="currentColor" />
  </svg>
);

const EditIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M0 12.6667V16H3.33333L13.1667 6.16667L9.83333 2.83333L0 12.6667ZM15.7333 3.6C16.0667 3.26667 16.0667 2.73333 15.7333 2.4L13.6 0.266667C13.2667 -0.0666667 12.7333 -0.0666667 12.4 0.266667L10.7333 1.93333L14.0667 5.26667L15.7333 3.6Z"
      fill="currentColor"
    />
  </svg>
);

const CameraIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M10 7C8.34 7 7 8.34 7 10C7 11.66 8.34 13 10 13C11.66 13 13 11.66 13 10C13 8.34 11.66 7 10 7ZM17 5H14.83L13 3H7L5.17 5H3C1.9 5 1 5.9 1 7V17C1 18.1 1.9 19 3 19H17C18.1 19 19 18.1 19 17V7C19 5.9 18.1 5 17 5ZM10 15C7.24 15 5 12.76 5 10C5 7.24 7.24 5 10 5C12.76 5 15 7.24 15 10C15 12.76 12.76 15 10 15Z"
      fill="white"
    />
  </svg>
);

export default function PharmacyProfilePage({
  initialProfile = defaultProfile,
}: PharmacyProfilePageProps) {
  const [profile, setProfile] = useState<PharmacyProfile>(initialProfile);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [activeTab, setActiveTab] = useState<
    "profile" | "password" | "notifications" | "settings"
  >("profile");

  const handleDeleteAccount = () => {
    // TODO: Handle account deletion logic
    setIsDeleteModalOpen(false);
  };

  const handleSaveProfile = (updatedProfile: PharmacyProfile) => {
    setProfile(updatedProfile);
    setIsEditModalOpen(false);
  };

  return (
    <div className="flex min-h-screen bg-[#F8FAFC]">
      <div className="w-64 bg-white border-r border-[#E2E8F0] p-6">
        <nav className="space-y-2">
          <button
            onClick={() => setActiveTab("profile")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium text-[14px] transition-colors ${
              activeTab === "profile"
                ? "text-[#1E293B] bg-[#F1F5F9]"
                : "text-[#64748B] hover:bg-[#F8FAFC]"
            }`}
          >
            <ProfileIcon />
            Profile
          </button>

          <button
            onClick={() => setActiveTab("password")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium text-[14px] transition-colors ${
              activeTab === "password"
                ? "text-[#1E293B] bg-[#F1F5F9]"
                : "text-[#64748B] hover:bg-[#F8FAFC]"
            }`}
          >
            <PasswordIcon />
            Change Password
          </button>

          <button
            onClick={() => setActiveTab("notifications")}
            className="w-full flex items-center gap-3 px-4 py-3 text-[#64748B] hover:bg-[#F8FAFC] rounded-lg font-medium text-[14px] transition-colors"
          >
            <NotificationIcon />
            <span className="flex-1 text-left">Notification Preferences</span>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={notificationsEnabled}
                onChange={(e) => setNotificationsEnabled(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#00D26B]"></div>
            </label>
          </button>

          <button
            onClick={() => setActiveTab("settings")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium text-[14px] transition-colors ${
              activeTab === "settings"
                ? "text-[#1E293B] bg-[#F1F5F9]"
                : "text-[#64748B] hover:bg-[#F8FAFC]"
            }`}
          >
            <SettingsIcon />
            Settings
          </button>

          <button
            onClick={() => setIsDeleteModalOpen(true)}
            className="w-full flex items-center gap-3 px-4 py-3 text-[#EF4444] hover:bg-[#FEF2F2] rounded-lg font-medium text-[14px] transition-colors mt-4"
          >
            Delete Account
          </button>
        </nav>
      </div>

      <div className="flex-1 p-8">
        <div className="max-w-3xl">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-[28px] font-semibold text-[#1E293B]">
              {profile.name}
            </h1>
            <button
              onClick={() => setIsEditModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2.5 bg-[#3B82F6] hover:bg-[#2563EB] text-white text-[14px] font-medium rounded-lg transition-colors"
            >
              <EditIcon />
              Edit Profile
            </button>
          </div>

          <div className="mb-8 relative w-32 h-32">
            <div className="w-32 h-32 rounded-full bg-gradient-to-br from-orange-200 to-orange-300 overflow-hidden relative">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-20 h-16 bg-orange-400/30 rounded-lg" />
              </div>
            </div>
            <button className="absolute bottom-0 right-0 w-10 h-10 bg-[#3B82F6] hover:bg-[#2563EB] rounded-full flex items-center justify-center shadow-lg transition-colors">
              <CameraIcon />
            </button>
          </div>

          <div className="mb-8">
            <h2 className="text-[18px] font-semibold text-[#1E293B] mb-4">
              Pharmacy Information
            </h2>

            <div className="space-y-3">
              <div className="flex items-start gap-3 px-4 py-4 bg-white border border-[#E2E8F0] rounded-lg">
                <div className="mt-0.5">
                  <LocationIcon />
                </div>
                <div>
                  <p className="text-[15px] font-medium text-[#1E293B]">
                    {profile.address}
                  </p>
                  <p className="text-[13px] text-[#64748B]">
                    {profile.city}, {profile.country}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 px-4 py-4 bg-white border border-[#E2E8F0] rounded-lg">
                <PhoneIcon />
                <p className="text-[15px] font-medium text-[#1E293B]">
                  {profile.phone}
                </p>
              </div>

              <div className="flex items-center gap-3 px-4 py-4 bg-white border border-[#E2E8F0] rounded-lg">
                <EmailIcon />
                <p className="text-[15px] font-medium text-[#1E293B]">
                  {profile.email}
                </p>
              </div>

              <div className="flex items-center gap-3 px-4 py-4 bg-white border border-[#E2E8F0] rounded-lg">
                <ClockIcon />
                <div className="flex-1 flex items-center justify-between">
                  <p className="text-[15px] font-medium text-[#1E293B]">
                    {profile.openingHours}
                  </p>
                  <p className="text-[13px] text-[#64748B]">
                    {profile.workingDays}
                  </p>
                  <button className="text-[#3B82F6] hover:text-[#2563EB]">
                    <EditIcon />
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-[18px] font-semibold text-[#1E293B] mb-4">
              Activity
            </h2>

            <div className="space-y-3">
              <div className="flex items-start gap-3 px-4 py-4 bg-white border border-[#E2E8F0] rounded-lg">
                <div className="mt-0.5">
                  <LoginIcon />
                </div>
                <div>
                  <p className="text-[15px] font-medium text-[#1E293B] mb-1">
                    Last Login
                  </p>
                  <p className="text-[13px] text-[#64748B]">
                    {profile.lastLogin}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 px-4 py-4 bg-white border border-[#E2E8F0] rounded-lg">
                <div className="mt-0.5 text-[#00D26B]">
                  <StatusIcon />
                </div>
                <div>
                  <p className="text-[15px] font-medium text-[#1E293B] mb-1">
                    Current Status
                  </p>
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-2 h-2 rounded-full ${profile.currentStatus === "online" ? "bg-[#00D26B]" : "bg-[#94A3B8]"}`}
                    />
                    <p className="text-[13px] text-[#64748B] capitalize">
                      {profile.currentStatus}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <DeleteAccountModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteAccount}
      />

      <EditProfileModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSave={handleSaveProfile}
        profile={profile}
      />
    </div>
  );
}
