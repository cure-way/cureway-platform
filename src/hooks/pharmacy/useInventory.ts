import { useEffect, useState, useCallback } from "react";
import { getInventory } from "@/repositories/inventory.repository";
import {
  InventoryFilterStatus,
  InventoryListItem,
} from "@/types/pharmacyTypes";

type UseInventoryParams = {
  status: InventoryFilterStatus;
  search: string;
};

export function useInventory({ status, search }: UseInventoryParams) {
  const [data, setData] = useState<InventoryListItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchInventory = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await getInventory({
        page: 1,
        limit: 10,
        q: search || undefined,
        stockStatus: status === "all" ? undefined : status,
      });

      setData(res.data);
    } catch (err) {
      setError("Failed to load inventory. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [search, status]);

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
