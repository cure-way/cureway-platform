"use client";

import { fetchSimilarMedicines } from "@/services/medicineService";
import { Medicine } from "@/types/medicine.types";
import { useEffect, useState, useCallback } from "react";

export function useSimilarMedicines(
  categoryId?: number,
  currentMedicineId?: number,
) {
  const [data, setData] = useState<Medicine[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    if (!categoryId || !currentMedicineId) return;

    try {
      setLoading(true);
      const result = await fetchSimilarMedicines(categoryId, currentMedicineId);
      setData(result);
    } finally {
      setLoading(false);
    }
  }, [categoryId, currentMedicineId]);

  useEffect(() => {
    load();
  }, [load]);

  return { data, loading };
}
