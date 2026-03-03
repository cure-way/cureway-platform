"use client";

import dynamic from "next/dynamic";
import StateGrid from "@/components/pharmacy/report/StateGrid";
import { TopMedicineCard } from "@/components/pharmacy/report/TopMedicineCard";
import PageHeader from "@/components/pharmacy/shared/PageHeader";
import { FiBarChart2 } from "react-icons/fi";
import { usePharmacyReport } from "@/hooks/pharmacy/usePharmacyReport";
import ErrorState from "@/components/pharmacy/shared/ErrorState";
import ReportSkeleton from "@/components/pharmacy/report/ReportSkeleton";

const OrdersStatusDonut = dynamic(
  () =>
    import("@/components/pharmacy/report/OrdersStatusDonut").then(
      (m) => m.OrdersStatusDonut,
    ),
  {
    ssr: false,
    loading: () => (
      <div className="bg-gray-100 rounded-xl h-50 animate-pulse" />
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
  const {
    weeklyStats,
    orderStatusDonut,
    weeklyOrdersStats,
    topMedicines,
    isLoading,
    error,
  } = usePharmacyReport();

  if (isLoading) return <ReportSkeleton />;

  if (error)
    return (
      <div className="flex justify-center items-center w-full h-full">
        <ErrorState message="Failed to load report." />
      </div>
    );

  return (
    <div className="space-y-6">
      <PageHeader title="Pharmacy Performance Report" icon={FiBarChart2} />
      {weeklyStats?.totalOrders === 0 && (
        <div className="p-2 font-medium text-gray-500 text-sm">
          No orders recorded in the last 7 days.
        </div>
      )}
      <div className="flex flex-wrap md:flex-nowrap gap-4">
        <StateGrid stats={weeklyStats} />
        <div className="bg-white p-4 border rounded-xl max-w-full md:max-w-100 grow">
          <OrdersStatusDonut data={orderStatusDonut} />
        </div>
      </div>

      <div className="flex md:flex-row flex-col gap-4">
        <div className="bg-white p-6 border rounded-xl grow">
          <WeeklyOrdersBar data={weeklyOrdersStats} />
        </div>

        {weeklyStats?.totalOrders !== 0 && (
          <TopMedicineCard data={topMedicines} />
        )}
      </div>
    </div>
  );
}
