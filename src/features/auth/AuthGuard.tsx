"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "./useAuth";
import AccountUnderReview from "@/components/pharmacy/shared/AccountUnderReview";
import { getRoleHome, isAppRole, ROUTES } from "@/lib/routes";

type Props = {
  children: React.ReactNode;
  allowedRoles?: string[];
};

/**
 * Full-screen loader shown while the session is being resolved or while a
 * role-based redirect is in flight. Guarantees the guard never renders a blank
 * white page (the previous implementation returned `null`).
 */
function AuthLoadingScreen() {
  return (
    <div
      className="min-h-screen flex items-center justify-center bg-gray-50"
      role="status"
      aria-live="polite"
      aria-busy="true"
    >
      <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      <span className="sr-only">Loading…</span>
    </div>
  );
}

export function AuthGuard({ children, allowedRoles }: Props) {
  const { isAuthed, isLoading, user, profile } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const role = user?.role ?? null;
  const isPharmacy = role === "PHARMACY";
  const isUnderReview =
    isPharmacy && profile?.verificationStatus === "UNDER_REVIEW";

  // A user passes the role check when no roles are required, or when their
  // (known) role is explicitly allowed for this section.
  const isRoleAllowed =
    !allowedRoles || (isAppRole(role) && allowedRoles.includes(role));

  useEffect(() => {
    if (isLoading) return;

    // 1. Unauthenticated → sign-in.
    if (!isAuthed || !user) {
      router.replace(ROUTES.AUTH.SIGN_IN);
      return;
    }

    // 2. Corrupt session (missing / unexpected role) → force re-auth instead of
    //    looping forever on a page the role can't render.
    if (!isAppRole(role)) {
      router.replace(ROUTES.AUTH.SIGN_IN);
      return;
    }

    // 3. Authenticated but not allowed in this section → send the user to THEIR
    //    own home, not back to the current page (which caused the blank-page
    //    self-redirect loop). Guard against redirecting to the current path.
    if (!isRoleAllowed) {
      const dest = getRoleHome(role);
      if (dest !== pathname) {
        router.replace(dest);
      }
      return;
    }

    // 4. Pharmacy under review stays on the review screen.
    if (isUnderReview) return;

    // 5. Verified pharmacy that somehow landed outside its portal → home.
    if (
      isPharmacy &&
      profile?.verificationStatus === "VERIFIED" &&
      !pathname.startsWith("/pharmacy")
    ) {
      router.replace(ROUTES.PHARMACY.HOME);
    }
  }, [
    isAuthed,
    isLoading,
    user,
    role,
    isRoleAllowed,
    router,
    profile,
    pathname,
    isPharmacy,
    isUnderReview,
  ]);

  // Never render a blank page — show a loader while resolving or redirecting.
  if (isLoading) return <AuthLoadingScreen />;
  if (!isAuthed || !user) return <AuthLoadingScreen />;
  if (!isAppRole(role)) return <AuthLoadingScreen />;
  if (!isRoleAllowed) return <AuthLoadingScreen />;

  if (isUnderReview) {
    return <AccountUnderReview />;
  }

  return <>{children}</>;
}
