"use client";

import { useState } from "react";
import { UpdateInventoryInput } from "@/types/pharmacyTypes";
import { ApiErrorShape } from "@/lib/api/errors";
import { updateInventoryItemService } from "@/services/pharmacy/pharmacyService";

export function useUpdateInventory() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<ApiErrorShape | null>(null);

  async function update(id: string, input: UpdateInventoryInput) {
    try {
      setLoading(true);
      setError(null);

      const updated = await updateInventoryItemService(id, input);

      return updated;
    } catch (err) {
      setError(err as ApiErrorShape);
      throw err;
    } finally {
      setLoading(false);
    }
  }

  return {
    update,
    loading,
    error,
  };
}
