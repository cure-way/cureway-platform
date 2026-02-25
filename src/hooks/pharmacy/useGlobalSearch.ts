"use client";

import { useMemo, useState } from "react";
import { useClickOutside } from "@/hooks/useClickOutside";
import { InventoryItem, OrderRow } from "@/types/pharmacyTypes";
import { inventoryData, ORDERS } from "@/services/pharmacyData";

export interface MatchedOrder {
  order: OrderRow;
  matchedItems: InventoryItem[];
}

export function useGlobalSearch() {
  const [search, setSearch] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const searchRef = useClickOutside<HTMLDivElement>(() => {
    setIsOpen(false);
  });

  const results = useMemo(() => {
    if (!search.trim()) return null;

    const query = search.toLowerCase();

    const medicines = inventoryData.filter((m) =>
      m.medicineName.toLowerCase().includes(query),
    );

    const inventoryMap = Object.fromEntries(
      inventoryData.map((item) => [item.id, item]),
    );

    const orders = ORDERS.map((order) => {
      const matchedItems = order.items
        .map((item) => inventoryMap[item.inventoryId])
        .filter(
          (inv): inv is InventoryItem =>
            Boolean(inv) && inv.medicineName.toLowerCase().includes(query),
        );

      if (!matchedItems.length) return null;

      return { order, matchedItems };
    }).filter((o): o is MatchedOrder => o !== null);

    return { medicines, orders };
  }, [search]);

  return {
    search,
    setSearch,
    isOpen,
    setIsOpen,
    searchRef,
    results,
  };
}
