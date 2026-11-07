"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/features/auth";
import { getRoleHome } from "@/lib/routes";
import { SHOWCASE_MODE } from "@/lib/showcase/config";

/**
 * Auth Route Layout
 * Redirects already-authenticated users away from sign-in / sign-up pages.
 * Auth state comes from the client-side AuthProvider.
 *
 * In showcase mode the visitor always has a demo session, so this redirect
 * would make every auth screen unreachable. The auth screens are part of what
 * the portfolio is showing, so the redirect is skipped and the pages render.
 */
export default function AuthRouteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthed, isLoading, user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (SHOWCASE_MODE) return; // auth screens stay browsable
    if (isLoading) return; // wait for hydration
    if (!isAuthed || !user) return;

    // Send the authenticated user to their role's correct destination.
    router.replace(getRoleHome(user.role));
  }, [isAuthed, isLoading, user, router]);

  if (SHOWCASE_MODE) return <>{children}</>;

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
