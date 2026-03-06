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

export default function PharmacyProfilePage() {
  const { profile, loading, error } = usePharmacyProfile();

  const [activeTab, setActiveTab] = useState("profile");
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const handleSaveProfile = (updatedProfile: PharmacyProfile) => {
    // setProfile(updatedProfile);
    setIsEditModalOpen(false);
  };

  const handleDeleteAccount = async () => {
    try {
      // call delete endpoint
      console.log("Deleting account...");

      setIsDeleteModalOpen(false);

      // router.push("/auth/sign-in");
    } catch (error) {
      console.error("Failed to delete account", error);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (!profile || error) return <div>Error loading profile</div>;

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
        <div className="w-full max-w-4xl">
          <ProfileHeader
            name={profile.name}
            onEdit={() => setIsEditModalOpen(true)}
          />

          <ProfileAvatar image={profile.image} name={profile.name} />

          {/* PHARMACY INFO */}

          <h2 className="mb-4 font-semibold text-(--color-primary) text-lg">
            Pharmacy Information
          </h2>

          <div className="space-y-3 mb-8">
            <InfoCard icon={<FiMapPin />}>
              <p>{profile.address}</p>
              <p className="text-gray-500 text-sm">{profile.city}</p>
            </InfoCard>

            <InfoCard icon={<FiPhone />}>{profile.phone}</InfoCard>

            <InfoCard icon={<FiMail />}>{profile.email}</InfoCard>

            <InfoCard icon={<FiClock />}>{profile.openingHours}</InfoCard>
          </div>

          {/* ACTIVITY */}

          <h2 className="mb-4 font-semibold text-(--color-primary) text-lg">
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
