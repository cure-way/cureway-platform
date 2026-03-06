"use client";

import { useCallback, useEffect, useState } from "react";
import { useAuth } from "@/features/auth";
import type { AuthProfile } from "@/features/auth";
import {
  getMyProfile,
  updateMyProfile,
  type PatientProfile,
  type UpdateProfilePayload,
} from "@/services/profile.service";

interface UseProfileReturn {
  profile: PatientProfile | null;
  loading: boolean;
  error: string | null;
  updating: boolean;
  update: (payload: UpdateProfilePayload) => Promise<PatientProfile>;
  refetch: () => Promise<void>;
}

export function useProfile(): UseProfileReturn {
  const { isLoading: authLoading, user, profile: authProfile, setSession } = useAuth();
  const [profile, setProfile] = useState<PatientProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updating, setUpdating] = useState(false);

  const fetch = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await getMyProfile();
      // The service returns PatientProfile directly, but guard against
      // API envelope shapes where data is nested
      const data = (res as { data?: PatientProfile } & PatientProfile).data ?? res;
      setProfile(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load profile");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (authLoading) return;
    fetch();
  }, [authLoading, fetch]);

  const update = useCallback(
    async (payload: UpdateProfilePayload) => {
      setUpdating(true);
      try {
        const updated = await updateMyProfile(payload);
        setProfile(updated);
        // Sync global auth state so header/WelcomeSection reflect changes immediately
        if (user) {
          setSession(
            {
              ...user,
              name: updated.name,
              phoneNumber: updated.phoneNumber,
              profileImageUrl: updated.profileImageUrl ?? user.profileImageUrl,
              dateOfBirth: updated.dateOfBirth ?? user.dateOfBirth,
            },
            authProfile as AuthProfile | null,
          );
        }
        return updated;
      } finally {
        setUpdating(false);
      }
    },
    [user, authProfile, setSession],
  );

  return { profile, loading, error, updating, update, refetch: fetch };
}
