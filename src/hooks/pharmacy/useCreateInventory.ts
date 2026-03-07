"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createInventory } from "@/services/pharmacyInventory";
import { CreateInventoryInput } from "@/types/pharmacyTypes";

export function useCreateInventory() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (input: CreateInventoryInput) => createInventory(input),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["pharmacy", "inventory"],
      });
    },
  });

  return {
    execute: mutation.mutateAsync,
    isLoading: mutation.isPending,
  };
}
