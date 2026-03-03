"use client";

import { fetchInventoryItem } from "@/services/pharmacyInventory";
import { InventoryItem } from "@/types/pharmacyTypes";
import { useState, useEffect, useCallback } from "react";

export function useInventoryDetails(id: string | null) {
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
    } catch (err) {
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
    setData,
    loading,
    error,
    refetch: fetchDetails,
  };
}
