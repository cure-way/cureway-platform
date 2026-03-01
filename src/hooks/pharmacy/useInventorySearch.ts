"use client";

import { useEffect, useState, useCallback } from "react";
import { SearchMedicine } from "@/types/pharmacyTypes";
import { searchInventory } from "@/services/pharmacyInventory";

export function useInventorySearch(search: string) {
  const [data, setData] = useState<SearchMedicine[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchInventory = useCallback(async () => {
    if (!search.trim()) {
      setData([]);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const result = await searchInventory(search);
      setData(result);
    } catch {
      setError("Failed to search medicines.");
    } finally {
      setLoading(false);
    }
  }, [search]);

  useEffect(() => {
    fetchInventory();
  }, [fetchInventory]);

  return {
    data,
    loading,
    error,
    refetch: fetchInventory,
  };
}
