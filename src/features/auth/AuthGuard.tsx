"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "./useAuth";
import AccountUnderReview from "@/components/pharmacy/shared/AccountUnderReview";

type Props = {
  children: React.ReactNode;
  allowedRoles?: string[];
};

export function AuthGuard({ children, allowedRoles }: Props) {
  const { isAuthed, isLoading, user, profile } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const isPharmacy = user?.role === "PHARMACY";
  const isUnderReview =
    isPharmacy && profile?.verificationStatus === "UNDER_REVIEW";

  useEffect(() => {
    if (isLoading) return;

    if (!isAuthed) {
      router.replace("/auth/sign-in");
      return;
    }

    if (allowedRoles && !allowedRoles.includes(user?.role ?? "")) {
      router.replace("/");
      return;
    }

    if (isUnderReview) return;

    if (
      isPharmacy &&
      profile?.verificationStatus === "VERIFIED" &&
      !pathname.startsWith("/pharmacy")
    ) {
      router.replace("/pharmacy/home");
    }
  }, [
    isAuthed,
    isLoading,
    user,
    allowedRoles,
    router,
    profile,
    pathname,
    isPharmacy,
    isUnderReview,
  ]);

  if (isLoading) return null;
  if (!isAuthed) return null;
  if (allowedRoles && !allowedRoles.includes(user?.role ?? "")) return null;

  if (isUnderReview) {
    return <AccountUnderReview />;
  }

  return <>{children}</>;
}
