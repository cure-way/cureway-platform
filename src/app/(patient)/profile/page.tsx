"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import React from "react";

import { SettingsLinkItem } from "@/components/patient/settings/SettingsItem";
import { Switch } from "@/components/patient/settings/Switch";
import {
  IconBack,
  IconBell,
  IconChevronRight,
  IconHistory,
  IconSave,
  IconTime,
} from "@/components/patient/settings/Icons";
import { MotionTap } from "@/components/shared/MotionTap";
import { useProfile } from "@/hooks/useProfile";
import { useAuth } from "@/features/auth";

export default function SettingsPage() {
  const router = useRouter();
  const { profile, loading } = useProfile();
  const { logout } = useAuth();

  const [medicineReminders, setMedicineReminders] = React.useState(true);
  const [notificationAccess, setNotificationAccess] = React.useState(true);

  const [offers, setOffers] = React.useState(true);
  const [orderTracking, setOrderTracking] = React.useState(true);
  const [ratingRequests, setRatingRequests] = React.useState(true);

  const displayName = profile?.name ?? "—";
  const displayEmail = profile?.email ?? "";
  const displayPhone = profile?.phoneNumber ?? "";
  const displayLocation = profile?.defaultAddress
    ? `${profile.defaultAddress.cityName}, ${displayPhone}`
    : displayPhone;

  const handleLogout = async () => {
    await logout();
    router.replace("/auth/sign-in");
  };

  return (
    <div className="w-full px-4 py-6">
      <div className="mx-auto w-full max-w-[1100px]">
        <div className="grid gap-6 lg:grid-cols-12">
          {/* LEFT COLUMN */}
          <div className="lg:col-span-5">
            <div className="mb-4 text-[28px] font-bold leading-[120%] text-black">
              Settings
            </div>

            <MotionTap className="rounded-[24px] border-t-[5px] border-t-[#5678C5] bg-white p-6 shadow-card">
              <div className="flex flex-col items-center gap-4 pb-4">
                <div className="h-[120px] w-[120px] overflow-hidden rounded-full bg-[#EBEDF7]">
                  <Image
                    src={profile?.profileImageUrl || "/patient/profile/Avatar.png"}
                    alt="avatar"
                    width={120}
                    height={120}
                    className="h-full w-full object-cover"
                    priority
                  />
                </div>

                {loading ? (
                  <div className="text-center animate-pulse space-y-2">
                    <div className="h-7 w-40 rounded bg-gray-200" />
                    <div className="h-5 w-48 rounded bg-gray-200" />
                    <div className="h-4 w-44 rounded bg-gray-200" />
                  </div>
                ) : (
                  <div className="text-center">
                    <div className="text-[24px] font-bold text-[#17234D]">
                      {displayName}
                    </div>
                    <div className="mt-1 text-[16px] text-[rgba(0,0,0,0.8)]">
                      {displayEmail}
                    </div>
                    <div className="mt-1 text-[14px] text-[#989593]">
                      {displayLocation}
                    </div>
                  </div>
                )}

                <MotionTap
                  as="a"
                  href="/profile/edit-profile"
                  className="inline-flex h-[56px] items-center justify-center rounded-[24px] bg-[#EBEDF7] px-[22px]"
                >
                  <span className="text-[20px] font-semibold text-[#334EAC]">
                    Edit Profile
                  </span>
                </MotionTap>
              </div>
            </MotionTap>
          </div>

          {/* RIGHT COLUMN */}
          <div className="lg:col-span-7">
            <div className="mb-4 flex justify-end">
              <MotionTap
                as="button"
                onClick={() => router.back()}
                className="inline-flex items-center gap-2"
              >
                <IconBack />
                <span className="text-[20px] font-bold text-black">
                  Back
                </span>
              </MotionTap>
            </div>

            <div className="rounded-[24px] border-t-[5px] border-t-[#4C6AAF] bg-white p-6 shadow-card">
              <div className="flex flex-col gap-4">
                <MotionTap>
                  <SettingsLinkItem
                    icon={<IconHistory />}
                    title="History"
                    subtitle="Orders & Activity"
                    href="/profile/history"
                    right={<IconChevronRight />}
                  />
                </MotionTap>

                <MotionTap>
                  <SettingsLinkItem
                    icon={<IconSave />}
                    title="Saved items"
                    subtitle="medicines & Healthy products"
                    href="/profile/saved-medicine"
                    right={<IconChevronRight />}
                  />
                </MotionTap>

                <MotionTap className="flex items-center gap-4 rounded-2xl border border-[#EFEDED] bg-white px-3 py-4">
                  <div className="grid h-[50px] w-[50px] place-items-center rounded-full bg-[#EBEDF7]">
                    <IconTime />
                  </div>

                  <div className="flex-1">
                    <div className="text-[20px] font-semibold text-[#121B3C]">
                      Medicine reminders
                    </div>
                    <div className="text-[14px] text-[#334EAC]">
                      Get reminders to refill your medicines
                    </div>
                  </div>

                  <Switch
                    checked={medicineReminders}
                    onCheckedChange={setMedicineReminders}
                  />
                </MotionTap>

                <div className="rounded-2xl border border-[#E5E7EB] bg-white px-3 py-4">
                  <MotionTap className="flex items-center gap-4 pb-4">
                    <div className="grid h-[50px] w-[50px] place-items-center rounded-full bg-[#EBEDF7]">
                      <IconBell />
                    </div>

                    <div className="flex-1">
                      <div className="text-[20px] font-semibold text-[#17234D]">
                        Notification
                      </div>
                      <div className="text-[14px] text-[#334EAC]">
                        Get access to edit your notifications
                      </div>
                    </div>

                    <Switch
                      checked={notificationAccess}
                      onCheckedChange={setNotificationAccess}
                    />
                  </MotionTap>

                  <div className="h-px w-full bg-[#D9D9D9]" />

                  <MotionTap className="flex items-center justify-between py-4">
                    <span className="text-[14px] text-[rgba(0,0,0,0.8)]">
                      Offers
                    </span>
                    <Switch checked={offers} onCheckedChange={setOffers} />
                  </MotionTap>

                  <div className="h-px w-full bg-[#D9D9D9]" />

                  <MotionTap className="flex items-center justify-between py-4">
                    <span className="text-[14px] text-[rgba(0,0,0,0.8)]">
                      Order tracking
                    </span>
                    <Switch
                      checked={orderTracking}
                      onCheckedChange={setOrderTracking}
                    />
                  </MotionTap>

                  <div className="h-px w-full bg-[#D9D9D9]" />

                  <MotionTap className="flex items-center justify-between pt-4">
                    <span className="text-[14px] text-[rgba(0,0,0,0.8)]">
                      Rating requests
                    </span>
                    <Switch
                      checked={ratingRequests}
                      onCheckedChange={setRatingRequests}
                    />
                  </MotionTap>
                </div>

                <div className="pt-2">
                  <MotionTap
                    as="button"
                    onClick={handleLogout}
                    className="mx-auto flex h-[56px] w-full max-w-[406px] items-center justify-center rounded-[24px] border border-[#263B81] bg-white"
                  >
                    <span className="text-[24px] text-[#334EAC]">
                      Logout
                    </span>
                  </MotionTap>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}