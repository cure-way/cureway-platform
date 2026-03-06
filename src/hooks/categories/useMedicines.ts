"use client";

import { useEffect, useState } from "react";
import { getMedicines } from "@/services/medicineService";
import { useAuth } from "@/features/auth";
import type { Medicine } from "@/types/medicine.types";

export function useMedicines(
  page?: number,
  limit?: number,
  categoryId?: number,
) {
  const { isLoading: authLoading } = useAuth();
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    // Wait for auth hydration to finish so the access token is available
    if (authLoading) return;

    let mounted = true;

    async function fetchData() {
      try {
        setLoading(true);
        setError(null);

        const result = await getMedicines({
          page,
          limit,
          categoryId,
        });

        if (!mounted) return;

        setMedicines(result.data);
        setTotalPages(result.totalPages);
      } catch (err) {
        if (!mounted) return;

        setError(
          err instanceof Error ? err.message : "Failed to load medicines",
        );
      } finally {
        if (mounted) setLoading(false);
      }
    }

    fetchData();

    return () => {
      mounted = false;
    };
  }, [authLoading, page, limit, categoryId]);

  return { medicines, loading, error, totalPages };
}
