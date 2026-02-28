"use client";

import { getMedicines } from "@/services/categoriesService";
import { Medicine } from "@/types/categories.types";
import { useEffect, useState } from "react";

export function useMedicines(
  page: number = 1,
  limit: number = 12,
  categoryId?: number,
) {
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    async function fetchData() {
      try {
        setLoading(true);
        setError(null);

        const data = await getMedicines({
          page,
          limit,
          categoryId,
        });

        if (mounted) setMedicines(data);
      } catch (err) {
        if (mounted) {
          setError(
            err instanceof Error ? err.message : "Failed to load medicines",
          );
        }
      } finally {
        if (mounted) setLoading(false);
      }
    }

    fetchData();

    return () => {
      mounted = false;
    };
  }, [page, limit, categoryId]);

  return { medicines, loading, error };
}
