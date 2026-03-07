import { OrderFilter } from "@/types/pharmacyOrders";

export const queryKeys = {
  pharmacy: {
    inventory: (
      status: string,
      search: string,
      page: number,
      limit: number,
    ) => ["pharmacy", "inventory", status, search, page, limit],
    inventorySnapshot: () => ["pharmacy", "inventory", "snapshot"],
    criticalStock: () => ["pharmacy", "inventory", "critical"],
    inventorySearch: (search: string) => [
      "pharmacy",
      "inventory",
      "search",
      search,
    ],
    inventoryDetail: (id: number) => ["pharmacy", "inventory", "detail", id],
    ordersSnapshot: (filter?: OrderFilter) => [
      "pharmacy",
      "orders",
      "snapshot",
      filter ?? "all",
    ],
    ordersSearch: (search: string) => ["pharmacy", "orders", "search", search],

    todayAnalytics: () => ["pharmacy", "orders", "today-analytics"],
    report: () => ["pharmacy", "orders", "report"],
    profile: () => ["pharmacy", "profile"],
  },
};
