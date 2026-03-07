"use client";

import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminHeader from "@/components/admin/AdminHeader";
import { SidebarProvider } from "@/contexts/SidebarContext";
import { PageTransition } from "@/components/admin/shared";
import { AuthGuard } from "@/features/auth/AuthGuard";

function AdminLayoutInner({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-neutral-light">
      <AdminSidebar />

      {/* Main Content — fills remaining width */}
      <div className="flex flex-col flex-1 min-w-0">
        <AdminHeader />
        <main className="flex-1 flex flex-col">
          <PageTransition className="flex-1 flex flex-col">
            {children}
          </PageTransition>
        </main>
      </div>
    </div>
  );
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGuard allowedRoles={["ADMIN"]}>
      <SidebarProvider>
        <AdminLayoutInner>{children}</AdminLayoutInner>
      </SidebarProvider>
    </AuthGuard>
  );
}
