"use client";

import { createInventory } from "@/services/pharmacy/pharmacyService";
import { CreateInventoryInput } from "@/types/pharmacyTypes";
import { useState } from "react";

export function useCreateInventory() {
  const [isLoading, setIsLoading] = useState(false);

  async function execute(input: CreateInventoryInput) {
    try {
      setIsLoading(true);
      const item = await createInventory(input);
      return item;
    } finally {
      setIsLoading(false);
    }
  }

  return {
    execute,
    isLoading,
  };
}
