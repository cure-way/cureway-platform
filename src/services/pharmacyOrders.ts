import { mapOrderDTO } from "@/adapters/pharmacyOrders";
import { getOrders } from "@/repositories/orders.repository";
import {
  Order,
  OrderFilter,
  TodayDashboardAnalytics,
} from "@/types/pharmacyOrders";

const SNAPSHOT_LIMIT = 3;
const ANALYTICS_LIMIT = 100;

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
