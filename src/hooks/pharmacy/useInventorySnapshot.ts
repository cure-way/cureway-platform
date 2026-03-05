"use client";

import { useEffect, useState, useCallback } from "react";
import type { InventoryItem } from "@/types/pharmacyTypes";
import { getInventorySnapshot } from "@/services/pharmacyInventory";

export function useInventorySnapshot() {
  const [data, setData] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSnapshot = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const items = await getInventorySnapshot();
      setData(items);
    } catch (err) {
      setError("Failed to load inventory snapshot.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSnapshot();
  }, [fetchSnapshot]);

  return {
    data,
    loading,
    error,
    refetch: fetchSnapshot,
  };
}
