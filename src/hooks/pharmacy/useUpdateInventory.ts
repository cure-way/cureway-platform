"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { UpdateInventoryInput } from "@/types/pharmacyTypes";
import { ApiErrorShape } from "@/lib/api/errors";
import { updateInventoryItemService } from "@/services/pharmacyInventory";

export function useUpdateInventory() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: ({ id, input }: { id: string; input: UpdateInventoryInput }) =>
      updateInventoryItemService(id, input),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["pharmacy", "inventory"],
      });
    },
  });

  return {
    update: async (id: string, input: UpdateInventoryInput) => {
      return mutation.mutateAsync({ id, input });
    },

    loading: mutation.isPending,
    error: mutation.error as ApiErrorShape | null,
  };
}
