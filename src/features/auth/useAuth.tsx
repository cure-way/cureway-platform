"use client";

/**
 * useAuth — typed access to AuthContext.
 *
 * Must be used inside <AuthProvider>.
 */

import { useContext } from "react";
import { AuthContext, type AuthContextValue } from "./AuthProvider";

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within an <AuthProvider>.");
  }
  return ctx;
}
