"use client";

import React, { useState } from "react";
import { Shield, Eye, EyeOff } from "lucide-react";
import toast from "react-hot-toast";
import { MotionStagger, MotionStaggerItem } from "@/components/admin/shared";
import { useAuth } from "@/features/auth";

export default function AdminSettingsSecurityPage() {
  const { user, isLoading } = useAuth();

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleChangePassword = () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.error("Please fill in all password fields");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("New passwords do not match");
      return;
    }
    // TODO: call password change API when available
    toast.success("Password change is not yet supported by the API");
  };

  if (isLoading) {
    return (
      <div className="flex-1 bg-white border border-border rounded-2xl p-6 space-y-6 animate-pulse">
        {[1, 2, 3].map((i) => (
          <div key={i} className="space-y-2">
            <div className="h-4 w-32 rounded bg-neutral-light" />
            <div className="h-10 w-full rounded-xl bg-neutral-light" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <MotionStagger className="flex-1 bg-white border border-border rounded-2xl p-4 sm:p-6 space-y-6">
      {/* Header */}
      <MotionStaggerItem>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary-light flex items-center justify-center">
            <Shield className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h2 className="text-t-18 font-bold text-primary-darker">
              Security Settings
            </h2>
            <p className="text-t-12 text-neutral">
              Manage your password and security preferences
            </p>
          </div>
        </div>
      </MotionStaggerItem>

      <div className="h-px bg-border" />

      {/* Account Info */}
      <MotionStaggerItem>
        <div className="space-y-3">
          <h3 className="text-t-14 font-semibold text-neutral-darker">
            Account Information
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="px-4 py-3 bg-neutral-light rounded-xl">
              <p className="text-t-12 text-neutral">Email</p>
              <p className="text-t-14 font-medium text-foreground">
                {user?.email ?? "—"}
              </p>
            </div>
            <div className="px-4 py-3 bg-neutral-light rounded-xl">
              <p className="text-t-12 text-neutral">Last Updated</p>
              <p className="text-t-14 font-medium text-foreground">{"—"}</p>
            </div>
          </div>
        </div>
      </MotionStaggerItem>

      <div className="h-px bg-border" />

      {/* Password Change */}
      <MotionStaggerItem>
        <div className="space-y-4">
          <h3 className="text-t-14 font-semibold text-neutral-darker">
            Change Password
          </h3>

          <div className="grid grid-cols-1 gap-4 max-w-md">
            {/* Current Password */}
            <div className="space-y-1.5">
              <label className="text-t-14 font-medium text-neutral-darker">
                Current Password
              </label>
              <div className="relative">
                <input
                  type={showCurrent ? "text" : "password"}
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full h-11 px-4 pr-11 rounded-xl border border-border text-t-14 outline-none focus:ring-2 focus:ring-primary/20 transition-shadow"
                  placeholder="Enter current password"
                />
                <button
                  type="button"
                  onClick={() => setShowCurrent((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral"
                >
                  {showCurrent ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            {/* New Password */}
            <div className="space-y-1.5">
              <label className="text-t-14 font-medium text-neutral-darker">
                New Password
              </label>
              <div className="relative">
                <input
                  type={showNew ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full h-11 px-4 pr-11 rounded-xl border border-border text-t-14 outline-none focus:ring-2 focus:ring-primary/20 transition-shadow"
                  placeholder="Enter new password"
                />
                <button
                  type="button"
                  onClick={() => setShowNew((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral"
                >
                  {showNew ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div className="space-y-1.5">
              <label className="text-t-14 font-medium text-neutral-darker">
                Confirm New Password
              </label>
              <div className="relative">
                <input
                  type={showConfirm ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full h-11 px-4 pr-11 rounded-xl border border-border text-t-14 outline-none focus:ring-2 focus:ring-primary/20 transition-shadow"
                  placeholder="Re-enter new password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral"
                >
                  {showConfirm ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>
          </div>

          <button
            onClick={handleChangePassword}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-primary-dark text-white text-t-14 font-semibold hover:bg-primary-dark-hover transition-colors"
          >
            Update Password
          </button>
        </div>
      </MotionStaggerItem>
    </MotionStagger>
  );
}
