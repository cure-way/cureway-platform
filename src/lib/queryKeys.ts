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
    orders: (page?: number) => ["pharmacy", "orders", page],
    reports: () => ["pharmacy", "reports"],
  },
};
