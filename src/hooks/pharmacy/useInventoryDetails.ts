"use client";

import { fetchInventoryItem } from "@/services/pharmacy/pharmacyService";
import { InventoryItem } from "@/types/pharmacyTypes";
import { useState, useEffect, useCallback } from "react";

export function useInventoryDetails(id: number | null) {
  const [data, setData] = useState<InventoryItem | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchDetails = useCallback(async () => {
    if (!id) return;

    setLoading(true);
    setError(null);

    try {
      const item = await fetchInventoryItem(id);
      setData(item);
    } catch {
      setError("Failed to load medicine details.");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchDetails();
  }, [fetchDetails]);

  return {
    data,
    loading,
    error,
    refetch: fetchDetails,
  };
}
