"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Camera, Save } from "lucide-react";
import toast from "react-hot-toast";
import { useAuth } from "@/features/auth";
import type { AuthUser } from "@/features/auth";
import { MotionStagger, MotionStaggerItem } from "@/components/admin/shared";

/* ------------------------------------------------------------------
   Inner form — receives user as a prop so initial state is stable
   ------------------------------------------------------------------ */
function ProfileForm({
  user,
  onLogout,
}: {
  user: AuthUser;
  onLogout: () => void;
}) {
  const [name, setName] = useState(user.name ?? "");
  const [phone, setPhone] = useState(user.phoneNumber ?? "");
  const [dob, setDob] = useState(user.dateOfBirth ?? "");
  const [saving, setSaving] = useState(false);

  const initials = (user.name || "A")
    .split(" ")
    .map((w: string) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const handleSave = async () => {
    // TODO: wire to admin profile update endpoint when available
    setSaving(true);
    try {
      toast.success("Profile update is not yet supported for admin accounts");
    } finally {
      setSaving(false);
    }
  };

  return (
    <MotionStagger className="flex-1 bg-white border border-border rounded-2xl p-4 sm:p-6 space-y-6">
      {/* Avatar + Info */}
      <MotionStaggerItem>
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
          <div className="relative w-20 h-20 shrink-0">
            {user.profileImageUrl ? (
              <Image
                src={user.profileImageUrl}
                alt="Profile"
                width={80}
                height={80}
                className="w-20 h-20 rounded-full object-cover"
              />
            ) : (
              <div className="w-20 h-20 rounded-full bg-primary-light flex items-center justify-center text-primary font-bold text-t-24">
                {initials}
              </div>
            )}
            <button
              className="absolute bottom-0 right-0 w-7 h-7 rounded-full bg-primary-dark text-white flex items-center justify-center"
              aria-label="Change photo"
            >
              <Camera className="w-4 h-4" />
            </button>
          </div>
          <div className="text-center sm:text-left">
            <h2 className="text-t-18 font-bold text-primary-darker">
              {user.name || "—"}
            </h2>
            <p className="text-t-14 text-neutral">{user.email}</p>
            <p className="text-t-12 text-neutral capitalize">
              {user.role.toLowerCase()} · {user.status.toLowerCase()}
            </p>
          </div>
        </div>
      </MotionStaggerItem>

      <div className="h-px bg-border" />

      {/* Form Fields */}
      <MotionStaggerItem>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-t-14 font-medium text-neutral-darker">
              Full Name
            </label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full h-11 px-4 rounded-xl border border-border text-t-14 text-foreground placeholder:text-neutral outline-none focus:ring-2 focus:ring-primary/20 transition-shadow"
              placeholder="Enter your name"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-t-14 font-medium text-neutral-darker">
              Email
            </label>
            <input
              value={user.email}
              readOnly
              className="w-full h-11 px-4 rounded-xl border border-border text-t-14 text-neutral bg-neutral-light cursor-not-allowed"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-t-14 font-medium text-neutral-darker">
              Phone Number
            </label>
            <input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full h-11 px-4 rounded-xl border border-border text-t-14 text-foreground placeholder:text-neutral outline-none focus:ring-2 focus:ring-primary/20 transition-shadow"
              placeholder="+970599000000"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-t-14 font-medium text-neutral-darker">
              Date of Birth
            </label>
            <input
              type="date"
              value={dob}
              onChange={(e) => setDob(e.target.value)}
              className="w-full h-11 px-4 rounded-xl border border-border text-t-14 text-foreground outline-none focus:ring-2 focus:ring-primary/20 transition-shadow"
            />
          </div>
        </div>
      </MotionStaggerItem>

      <div className="h-px bg-border" />

      {/* Actions */}
      <MotionStaggerItem>
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <button
            onClick={handleSave}
            disabled={saving}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-primary-dark text-white text-t-14 font-semibold hover:bg-primary-dark-hover disabled:opacity-50 transition-colors"
          >
            <Save className="w-4 h-4" />
            {saving ? "Saving..." : "Save Changes"}
          </button>

          <button
            onClick={onLogout}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl border border-error text-error text-t-14 font-semibold hover:bg-error-light transition-colors"
          >
            Logout
          </button>
        </div>
      </MotionStaggerItem>
    </MotionStagger>
  );
}

/* ------------------------------------------------------------------
   Page — uses useAuth() which already has user data from login/refresh
   ------------------------------------------------------------------ */
export default function AdminSettingsProfilePage() {
  const router = useRouter();
  const { user, isLoading, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    router.replace("/auth/sign-in");
  };

  if (isLoading) {
    return (
      <div className="flex-1 bg-white border border-border rounded-2xl p-6 space-y-6 animate-pulse">
        <div className="flex items-center gap-4">
          <div className="w-20 h-20 rounded-full bg-neutral-light" />
          <div className="space-y-2 flex-1">
            <div className="h-5 w-40 rounded bg-neutral-light" />
            <div className="h-4 w-56 rounded bg-neutral-light" />
          </div>
        </div>
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="space-y-2">
            <div className="h-4 w-24 rounded bg-neutral-light" />
            <div className="h-10 w-full rounded-xl bg-neutral-light" />
          </div>
        ))}
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex-1 bg-white border border-border rounded-2xl p-6 flex flex-col items-center justify-center gap-4">
        <p className="text-t-14 text-error font-medium">Not authenticated</p>
        <button
          onClick={handleLogout}
          className="px-6 py-2.5 rounded-xl border border-error text-error text-t-14 font-semibold hover:bg-error-light transition-colors"
        >
          Logout
        </button>
      </div>
    );
  }

  return <ProfileForm key={user.id} user={user} onLogout={handleLogout} />;
}
