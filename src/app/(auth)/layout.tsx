"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/features/auth";

/**
 * Auth Route Layout
 * Redirects already-authenticated users away from sign-in / sign-up pages.
 * Auth state comes from the client-side AuthProvider.
 */
export default function AuthRouteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthed, isLoading, user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return; // wait for hydration
    if (!isAuthed || !user) return;

    // Redirect based on role
    switch (user.role) {
      case "PHARMACY":
        router.replace("/pharmacy/home");
        break;
      case "ADMIN":
        router.replace("/admin/dashboard");
        break;
      default:
        router.replace("/");
    }
  }, [isAuthed, isLoading, user, router]);

  // While loading or if authenticated (redirect in progress), show spinner
  if (isLoading || isAuthed) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return <>{children}</>;
}
