"use client";

import { fetchPharmaciesByMedicine } from "@/services/medicineService";
import { PharmacyStock } from "@/types/medicine.types";
import { useEffect, useState, useCallback } from "react";

interface UsePharmaciesReturn {
  data: PharmacyStock[];
  total: number;
  totalPages: number;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

interface UsePharmaciesOptions {
  page?: number;
  limit?: number;
}

export function usePharmaciesByMedicine(
  medicineId: number,
  options?: UsePharmaciesOptions,
): UsePharmaciesReturn {
  const [data, setData] = useState<PharmacyStock[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!medicineId) return;

    try {
      setLoading(true);
      setError(null);

      const result = await fetchPharmaciesByMedicine(medicineId, options);

      setData(result.data);
      setTotal(result.total);
      setTotalPages(result.totalPages);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to load pharmacies.",
      );
    } finally {
      setLoading(false);
    }
  }, [medicineId, options]);

  useEffect(() => {
    load();
  }, [load]);

  return {
    data,
    total,
    totalPages,
    loading,
    error,
    refetch: load,
  };
}
