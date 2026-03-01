"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "./useAuth";

type Props = {
  children: React.ReactNode;
  allowedRoles?: string[];
};

export function AuthGuard({ children, allowedRoles }: Props) {
  const { isAuthed, isLoading, user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;

    if (!isAuthed) {
      router.replace("/auth/sign-in");
      return;
    }

    if (allowedRoles && !allowedRoles.includes(user?.role ?? "")) {
      router.replace("/");
    }
  }, [isAuthed, isLoading, user, allowedRoles, router]);

  if (isLoading) return null;
  if (!isAuthed) return null;
  if (allowedRoles && !allowedRoles.includes(user?.role ?? "")) return null;

  return <>{children}</>;
}
