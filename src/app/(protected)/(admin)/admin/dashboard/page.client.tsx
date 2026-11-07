"use client";

import {
  WelcomeSection,
  AlertBanner,
  QuickStatsCards,
  AnalyticsMiniCards,
  RevenueChart,
  SystemExperienceOverview,
  TopCategories,
  RecentPharmacies,
  RecentPatients,
  RecentDeliveries,
  RecentOrders,
} from "@/components/admin/dashboard";
import { MotionStagger, MotionStaggerItem } from "@/components/admin/shared";
import { PageContainer } from "@/components/shared";

export default function AdminDashboardPage() {
  return (
    <PageContainer variant="dashboard" as={MotionStagger} className="space-y-6">
      {/* Welcome & Quick Actions */}
      <MotionStaggerItem>
        <WelcomeSection />
      </MotionStaggerItem>

      {/* Alert Banner */}
      <MotionStaggerItem>
        <AlertBanner />
      </MotionStaggerItem>

      {/* Quick Stats */}
      <MotionStaggerItem>
        <QuickStatsCards />
      </MotionStaggerItem>

      {/* Analytics Mini Cards */}
      <MotionStaggerItem>
        <AnalyticsMiniCards />
      </MotionStaggerItem>

      {/* Revenue Chart + Side Panels */}
      <MotionStaggerItem>
        <div className="grid grid-cols-1 xl:grid-cols-[1fr_320px] gap-4">
          <RevenueChart />
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-1 gap-4">
            <SystemExperienceOverview />
            <TopCategories />
          </div>
        </div>
      </MotionStaggerItem>

      {/* Recent Tables Row */}
      <MotionStaggerItem>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          <RecentPharmacies />
          <RecentPatients />
          <RecentDeliveries />
        </div>
      </MotionStaggerItem>

      {/* Recent Orders */}
      <MotionStaggerItem>
        <RecentOrders />
      </MotionStaggerItem>
    </PageContainer>
  );
}
