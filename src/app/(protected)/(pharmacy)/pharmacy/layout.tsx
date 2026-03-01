import DashboardLayout from "@/components/pharmacy/layout/DashboardLayout";
import { AuthGuard } from "@/features/auth/AuthGuard";

export default function PharmacyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGuard allowedRoles={["PHARMACY"]}>
      <DashboardLayout>{children}</DashboardLayout>
    </AuthGuard>
  );
}
