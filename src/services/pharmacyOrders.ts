import { mapOrderDTO, mapOrderToRow } from "@/adapters/pharmacyOrders";
import { getOrders } from "@/repositories/pharmacyOrders.repository";
import {
  GetOrdersParams,
  Order,
  OrderFilter,
  OrdersStatusModel,
  OrderStatusDonutDatum,
  PharmacyOrderDTO,
  SearchOrder,
  TodayDashboardAnalytics,
  TopMedicine,
  WeeklyOrdersDatum,
  WeeklyStats,
} from "@/types/pharmacyOrders";

const SNAPSHOT_LIMIT = 3;
const ANALYTICS_LIMIT = 100;

export async function fetchOrdersList(params: GetOrdersParams) {
  const response = await getOrders(params);

  if (!response.success) {
    throw new Error("Failed to fetch orders");
  }

  return {
    rows: response.data.map((dto) => mapOrderToRow(mapOrderDTO(dto))),
    total: response.meta.total,
    page: response.meta.page,
    limit: response.meta.limit,
  };
}

export async function getOrdersSnapshot(
  filter?: OrderFilter,
): Promise<Order[]> {
  const response = await getOrders({
    page: 1,
    limit: SNAPSHOT_LIMIT,
    filter,
  });

  if (!response.success) {
    throw new Error("Failed to fetch orders");
  }

  return response.data.map(mapOrderDTO);
}

function isSameDayUTC(date: Date, compareTo: Date): boolean {
  return (
    date.getUTCFullYear() === compareTo.getUTCFullYear() &&
    date.getUTCMonth() === compareTo.getUTCMonth() &&
    date.getUTCDate() === compareTo.getUTCDate()
  );
}

export async function getTodayDashboardAnalytics(): Promise<TodayDashboardAnalytics> {
  const response = await getOrders({
    page: 1,
    limit: ANALYTICS_LIMIT,
    filter: "ALL",
  });

  if (!response.success) {
    throw new Error("Failed to fetch dashboard analytics");
  }

  const orders = response.data.map(mapOrderDTO);

  const now = new Date();

  const todayOrders = orders.filter((order) =>
    isSameDayUTC(order.createdAt, now),
  );

  if (!todayOrders.length) {
    return {
      totalToday: 0,
      deliveredToday: 0,
      topMedicineName: null,
    };
  }

  const deliveredToday = todayOrders.filter(
    (order) => order.status === "DELIVERED",
  );

  const medicineFrequency = new Map<
    number,
    { count: number; medicineName: string }
  >();

  for (const order of todayOrders) {
    for (const item of order.items) {
      const existing = medicineFrequency.get(item.medicineId);

      if (existing) {
        existing.count += 1;
      } else {
        medicineFrequency.set(item.medicineId, {
          count: 1,
          medicineName: item.medicineName,
        });
      }
    }
  }

  let topMedicineName: string | null = null;
  let max = 0;

  for (const entry of medicineFrequency.values()) {
    if (entry.count > max) {
      max = entry.count;
      topMedicineName = entry.medicineName;
    }
  }

  return {
    totalToday: todayOrders.length,
    deliveredToday: deliveredToday.length,
    topMedicineName,
  };
}

export async function searchOrders(query: string): Promise<SearchOrder[]> {
  if (!query.trim()) return [];

  const res = await getOrders({
    page: 1,
    limit: 5,
    q: query,
  });

  return res.data.map((order: PharmacyOrderDTO) => {
    const firstItem = order.items[0];

    return {
      orderId: order.pharmacyOrderId,
      firstMedicineName: firstItem?.medicineDisplayName ?? "",
      remainingItemsCount: Math.max(order.items.length - 1, 0),
    };
  });
}

function filterLast7Days(orders: Order[]): Order[] {
  const now = new Date();
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(now.getDate() - 7);

  return orders.filter((order) => order.createdAt >= sevenDaysAgo);
}

function calculateWeeklyStats(orders: Order[]): WeeklyStats {
  const totalOrders = orders.length;

  const deliveredCount = orders.filter(
    (order) => order.status === "DELIVERED",
  ).length;

  const pendingCount = orders.filter(
    (order) => order.status === "PENDING",
  ).length;

  const completionRate =
    totalOrders === 0
      ? 0
      : Number(((deliveredCount / totalOrders) * 100).toFixed(1));

  const pendingRate =
    totalOrders === 0
      ? 0
      : Number(((pendingCount / totalOrders) * 100).toFixed(1));

  return {
    totalOrders,
    deliveredCount,
    completionRate,
    pendingRate,
  };
}

function calculateOrderStatusDonut(orders: Order[]): OrderStatusDonutDatum[] {
  const deliveredCount = orders.filter(
    (order) => order.status === "DELIVERED" || order.status === "PAST",
  ).length;

  const pendingCount = orders.filter(
    (order) => order.status === "PENDING",
  ).length;

  return [
    { name: "Delivered", value: deliveredCount },
    { name: "Pending", value: pendingCount },
  ];
}

export function buildOrdersStatusModel(
  data: OrderStatusDonutDatum[],
): OrdersStatusModel {
  const deliveredCount = data.find((d) => d.name === "Delivered")?.value ?? 0;

  const pendingCount = data.find((d) => d.name === "Pending")?.value ?? 0;

  const total = deliveredCount + pendingCount;

  const deliveredPercent =
    total > 0 ? Math.round((deliveredCount / total) * 100) : 0;

  const pendingPercent = total > 0 ? 100 - deliveredPercent : 0;

  return {
    completedPercent: deliveredPercent,
    pendingPercent,

    outerData: [
      { name: "Delivered", value: deliveredPercent },
      { name: "Remaining", value: 100 - deliveredPercent },
    ],

    innerData: [
      { name: "Pending", value: pendingPercent },
      { name: "Remaining", value: 100 - pendingPercent },
    ],
  };
}

function calculateWeeklyOrders(orders: Order[]): WeeklyOrdersDatum[] {
  const now = new Date();

  // Normalize to start of today (avoid time drift)
  now.setHours(0, 0, 0, 0);

  // Build last 7 days window
  const days: Date[] = [];

  for (let i = 6; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(now.getDate() - i);
    days.push(date);
  }

  // Create map with ISO date key
  const counts = new Map<string, number>();

  for (const day of days) {
    counts.set(day.toISOString().split("T")[0], 0);
  }

  // Count orders per date
  for (const order of orders) {
    const orderDate = new Date(order.createdAt);
    orderDate.setHours(0, 0, 0, 0);

    const key = orderDate.toISOString().split("T")[0];

    if (counts.has(key)) {
      counts.set(key, (counts.get(key) ?? 0) + 1);
    }
  }

  // Return in chronological order
  return days.map((day) => {
    const key = day.toISOString().split("T")[0];

    return {
      label: day.toLocaleDateString("en-US", {
        weekday: "short",
      }),
      orders: counts.get(key) ?? 0,
    };
  });
}

function calculateTopMedicines(orders: Order[]): TopMedicine[] {
  const medicineMap = new Map<
    number,
    {
      medicineName: string;
      soldUnits: number;
      orderIds: Set<number>;
    }
  >();

  for (const order of orders) {
    for (const item of order.items) {
      if (!medicineMap.has(item.medicineId)) {
        medicineMap.set(item.medicineId, {
          medicineName: item.medicineName,
          soldUnits: 0,
          orderIds: new Set(),
        });
      }

      const entry = medicineMap.get(item.medicineId)!;

      entry.soldUnits += 1;

      entry.orderIds.add(order.id);
    }
  }

  return Array.from(medicineMap.entries())
    .map(([medicineId, value]) => ({
      medicineId,
      medicineName: value.medicineName,
      soldUnits: value.soldUnits,
      orderCount: value.orderIds.size,
    }))
    .sort((a, b) => b.soldUnits - a.soldUnits)
    .slice(0, 4);
}

export async function getPharmacyReport(): Promise<{
  weeklyStats: WeeklyStats;
  orderStatusDonut: OrderStatusDonutDatum[];
  weeklyOrdersStats: WeeklyOrdersDatum[];
  topMedicines: TopMedicine[];
}> {
  const dtos = await getOrders({ page: 1, limit: 100, filter: "ALL" });
  const orders = dtos.data.map(mapOrderDTO);

  const weeklyOrders = filterLast7Days(orders);

  const weeklyStats = calculateWeeklyStats(weeklyOrders);
  const orderStatusDonut = calculateOrderStatusDonut(weeklyOrders);
  const weeklyOrdersStats = calculateWeeklyOrders(weeklyOrders);
  const topMedicines = calculateTopMedicines(weeklyOrders);
  return {
    weeklyStats,
    orderStatusDonut,
    weeklyOrdersStats,
    topMedicines,
  };
}
