"use client";

import { fetchMedicineDetails } from "@/services/medicineService";
import { Medicine } from "@/types/medicine.types";
import { useEffect, useState, useCallback } from "react";

interface UseMedicineDetailsReturn {
  data: Medicine | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useMedicineDetails(id: number): UseMedicineDetailsReturn {
  const [data, setData] = useState<Medicine | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!id) return;

    try {
      setLoading(true);
      setError(null);

      const result = await fetchMedicineDetails(id);
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load medicine.");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    load();
  }, [load]);

  return {
    data,
    loading,
    error,
    refetch: load,
  };
}
