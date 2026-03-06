"use client";

import { HomeHeader } from "@/components/patient/header";
import { AuthGuard } from "@/features/auth/AuthGuard";

/**
 * Patient Layout
 * Unified layout for all patient-facing pages (main website UI).
 * Renders the HomeHeader globally on every patient route.
 * Guests are redirected to the sign-in page via AuthGuard.
 */
export default function PatientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGuard allowedRoles={["PATIENT"]}>
      <div className="min-h-screen bg-gray-50">
        <HomeHeader cartCount={0} />
        <main className="flex-1">{children}</main>
      </div>
    </AuthGuard>
  );
}
