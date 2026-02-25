"use client";

import dynamic from "next/dynamic";
import StateGrid from "@/components/pharmacy/report/StateGrid";
import { TopMedicineCard } from "@/components/pharmacy/report/TopMedicineCard";
import PageHeader from "@/components/pharmacy/shared/PageHeader";
import { inventoryData, ORDERS } from "@/services/pharmacyData";
import {
  getOrderStatusData,
  getTopSellingMedicines,
  getWeeklyOrdersData,
} from "@/services/pharmacy/pharmacyService";
import { FiBarChart2 } from "react-icons/fi";

const OrdersStatusDonut = dynamic(
  () =>
    import("@/components/pharmacy/report/OrdersStatusDonut").then(
      (m) => m.OrdersStatusDonut,
    ),
  {
    ssr: false,
    loading: () => (
      <div className="bg-gray-100 rounded-xl h-[200px] animate-pulse" />
    ),
  },
);

const WeeklyOrdersBar = dynamic(
  () =>
    import("@/components/pharmacy/report/WeeklyOrdersBar").then(
      (m) => m.WeeklyOrdersBar,
    ),
  {
    ssr: false,
    loading: () => (
      <div className="bg-gray-100 rounded-xl h-80 animate-pulse" />
    ),
  },
);

export default function PharmacyReportPage() {
  const orderStatusData = getOrderStatusData(ORDERS);
  const weeklyOrdersData = getWeeklyOrdersData(ORDERS);

  const topMedicines = getTopSellingMedicines(ORDERS, inventoryData);

  return (
    <div className="space-y-6">
      <PageHeader title="Pharmacy Performance Report" icon={FiBarChart2} />

      <div className="flex flex-wrap md:flex-nowrap gap-4">
        <StateGrid />
        <div className="bg-white p-4 border rounded-xl max-w-full md:max-w-100 grow">
          <OrdersStatusDonut data={orderStatusData} />
        </div>
      </div>

      <div className="flex md:flex-row flex-col gap-4">
        <div className="bg-white p-6 border rounded-xl grow">
          <WeeklyOrdersBar data={weeklyOrdersData} />
        </div>

        <TopMedicineCard data={topMedicines} />
      </div>
    </div>
  );
}
