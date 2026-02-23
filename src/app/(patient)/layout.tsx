import { HomeHeader } from "@/components/patient/header";

/**
 * Patient Layout
 * Unified layout for all patient-facing pages (main website UI).
 * Renders the HomeHeader globally on every patient route.
 *
 * Auth state is resolved client-side by the AuthProvider / UserMenu,
 * so no server-side session check is needed here.
 */
export default function PatientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      <HomeHeader cartCount={0} />
      <main className="flex-1">{children}</main>
    </div>
  );
}
