"use client";

import { useState } from "react";
import { FiMapPin, FiPhone, FiMail, FiClock, FiLogIn } from "react-icons/fi";

import ProfileSidebar from "./ProfileSidebar";
import ProfileHeader from "./ProfileHeader";
import ProfileAvatar from "./ProfileAvatar";
import InfoCard from "./InfoCard";
import ActivityCard from "./ActivityCard";
import { usePharmacyProfile } from "@/hooks/pharmacy/usePharmacyProfile";
import DeleteAccountModal from "./DeleteProfile";
import EditProfileModal from "./EditProfile";
import { PharmacyProfile } from "@/types/PharmacyProfile";
import ErrorState from "../shared/ErrorState";
import ProfilePageSkeleton from "./ProfilePageSkeleton";
import { notifyDisabled } from "@/lib/showcase/notify";

export default function PharmacyProfilePage() {
  const { profile, loading, error } = usePharmacyProfile();

  const [activeTab, setActiveTab] = useState("profile");
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // Persisting the pharmacy profile and deleting the account both need the
  // backend, so they are disabled rather than silently closing the modal.
  const handleSaveProfile = (updatedProfile: PharmacyProfile) => {
    notifyDisabled(`changes to ${updatedProfile.name} were not saved`);
    setIsEditModalOpen(false);
  };

  const handleDeleteAccount = async () => {
    notifyDisabled("account deletion");
    setIsDeleteModalOpen(false);
  };

  if (loading) return <ProfilePageSkeleton />;
  if (!profile || error)
    return (
      <div className="flex justify-center items-center">
        <ErrorState />
      </div>
    );

  return (
    <div className="flex min-h-screen">
      <ProfileSidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        notificationsEnabled={notificationsEnabled}
        setNotificationsEnabled={setNotificationsEnabled}
        onDelete={() => setIsDeleteModalOpen(true)}
      />

      <div className="flex flex-1 justify-center p-10">
        <div className="w-full max-w-[44rem]">
          <ProfileHeader
            name={profile.name}
            onEdit={() => setIsEditModalOpen(true)}
          />

          <ProfileAvatar image={profile.image} name={profile.name} />

          {/* PHARMACY INFO */}

          <h2 className="mb-4 font-semibold text-(--color-primary) text-t-17">
            Pharmacy Information
          </h2>

          <div className="space-y-3 mb-8">
            <InfoCard icon={<FiMapPin />}>
              <p>{profile.address}</p>
              <p className="text-gray-500 text-t-14">{profile.city}</p>
            </InfoCard>

            <InfoCard icon={<FiPhone />}>{profile.phone}</InfoCard>

            <InfoCard icon={<FiMail />}>{profile.email}</InfoCard>

            <InfoCard icon={<FiClock />}>{profile.openingHours}</InfoCard>
          </div>

          {/* ACTIVITY */}

          <h2 className="mb-4 font-semibold text-(--color-primary) text-t-17">
            Activity
          </h2>

          <div className="space-y-3">
            <ActivityCard
              icon={<FiLogIn />}
              title="Account Created"
              value={profile.createdAt}
            />

            <ActivityCard
              icon={<FiClock />}
              title="Verification Status"
              value={profile.verificationStatus}
            />
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
