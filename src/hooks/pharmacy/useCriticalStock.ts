"use client";

import { useEffect, useState, useCallback } from "react";
import type { InventoryItem } from "@/types/pharmacyTypes";
import { getCriticalStockItems } from "@/services/pharmacyInventory";

export function useCriticalStock() {
  const [data, setData] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCritical = useCallback(async () => {
    try {
      setError(null);
      const items = await getCriticalStockItems();
      setData(items);
    } catch {
      setError("Failed to load stock alerts.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCritical();
  }, [fetchCritical]);

  return {
    data,
    loading,
    error,
    refetch: fetchCritical,
  };
}
