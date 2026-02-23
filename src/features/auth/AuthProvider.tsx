"use client";

/**
 * AuthProvider — client component that wraps the app with auth context.
 *
 * On mount it attempts to restore the session by calling POST /auth/refresh
 * with the persisted refresh token (localStorage). If no token exists or the
 * refresh fails the user is treated as unauthenticated.
 */

import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";

import type {
  AuthUser,
  AuthProfile,
  LoginPayload,
  AuthResponse,
} from "./auth.types";
import * as authApi from "./auth.api";

// ---------------------------------------------------------------------------
// Context shape
// ---------------------------------------------------------------------------

export interface AuthContextValue {
  /** Current user (null when not authenticated) */
  user: AuthUser | null;
  /** Profile associated with the current user */
  profile: AuthProfile | null;
  /** True while the initial session hydration is in progress */
  isLoading: boolean;
  /** Convenience boolean derived from !!user */
  isAuthed: boolean;
  /** Log in with email + password */
  login: (payload: LoginPayload) => Promise<AuthResponse>;
  /** Log out and clear tokens */
  logout: () => Promise<void>;
  /** Manually trigger a token refresh and re-hydrate user data */
  refreshIfNeeded: () => Promise<AuthResponse | null>;
  /** Update in-memory user/profile after an external mutation */
  setSession: (user: AuthUser, profile: AuthProfile | null) => void;
}

export const AuthContext = createContext<AuthContextValue | undefined>(
  undefined,
);

// ---------------------------------------------------------------------------
// Provider
// ---------------------------------------------------------------------------

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [profile, setProfile] = useState<AuthProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  /** Guard to prevent double-hydration in React 18/19 StrictMode */
  const hydrated = useRef(false);

  /** Guard for the safety-net profile effect (at most one retry) */
  const profileRetried = useRef(false);

  // ---- Session hydration on mount ----------------------------------------
  useEffect(() => {
    if (hydrated.current) return;
    hydrated.current = true;

    let cancelled = false;

    const hydrate = async () => {
      try {
        const res = await authApi.refresh();
        if (!cancelled) {
          setUser(res.user);
          setProfile(res.profile);
        }
      } catch {
        // No valid session — user is simply not logged in
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };

    hydrate();

    return () => {
      cancelled = true;
    };
  }, []);

  // ---- Safety-net: hydrate profile for authenticated users ---------------
  // If user is set but profile is missing (e.g. refresh failed right after
  // login due to server propagation delay), retry once so the header
  // eventually shows complete data without requiring a hard reload.
  useEffect(() => {
    if (!user) {
      profileRetried.current = false;
      return;
    }
    if (isLoading || profile || profileRetried.current) return;
    profileRetried.current = true;

    let cancelled = false;
    const fetchProfile = async () => {
      try {
        const res = await authApi.refresh();
        if (!cancelled) {
          setUser(res.user);
          setProfile(res.profile);
        }
      } catch {
        // Silent — profile remains null until next full reload
      }
    };

    fetchProfile();

    return () => {
      cancelled = true;
    };
  }, [isLoading, user, profile]);

  // ---- Actions -----------------------------------------------------------

  const login = useCallback(async (payload: LoginPayload) => {
    const res = await authApi.login(payload);

    let finalUser = res.user;
    let finalProfile = res.profile;

    if (!finalProfile) {
      try {
        const full = await authApi.refresh();
        finalUser = full.user;
        finalProfile = full.profile;
      } catch {
        // Refresh failed — safety-net effect will retry
      }
    }

    setUser(finalUser);
    setProfile(finalProfile);

    return { user: finalUser, tokens: res.tokens, profile: finalProfile };
  }, []);

  const logout = useCallback(async () => {
    try {
      await authApi.logout();
    } finally {
      setUser(null);
      setProfile(null);
    }
  }, []);

  const refreshIfNeeded = useCallback(async () => {
    try {
      const res = await authApi.refresh();
      setUser(res.user);
      setProfile(res.profile);
      return res;
    } catch {
      setUser(null);
      setProfile(null);
      return null;
    }
  }, []);

  const setSession = useCallback((u: AuthUser, p: AuthProfile | null) => {
    setUser(u);
    setProfile(p);
  }, []);

  // ---- Memoised context value --------------------------------------------

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      profile,
      isLoading,
      isAuthed: !!user,
      login,
      logout,
      refreshIfNeeded,
      setSession,
    }),
    [user, profile, isLoading, login, logout, refreshIfNeeded, setSession],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
