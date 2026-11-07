"use client";

import { useState } from "react";
import Sidebar from "./Sidebar";
import TopBar from "./Topbar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex bg-gray-50 h-[calc(100dvh-var(--showcase-bar-h,0px))] overflow-hidden">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex flex-col flex-1">
        <TopBar onMenuClick={() => setSidebarOpen(true)} />

        <main className="flex-1 p-2 overflow-hidden">{children}</main>
      </div>
    </div>
  );
}
