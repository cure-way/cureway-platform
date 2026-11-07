"use client";

import { FiPackage } from "react-icons/fi";

export default function OrdersEmptyState() {
  return (
    <div className="flex flex-col justify-center items-center py-10 text-center">
      <FiPackage className="mb-3 text-gray-400 text-t-25" />

      <p className="font-medium text-gray-700 text-t-14">
        No new Orders Right now
      </p>
    </div>
  );
}
