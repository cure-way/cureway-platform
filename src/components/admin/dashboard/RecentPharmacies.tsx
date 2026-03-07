"use client";

import Link from "next/link";
import {
  DashPharmacyOutlineIcon,
  DashPharmacyFilledIcon,
} from "@/components/admin/shared/icons";
import { useAdminPharmacies } from "@/hooks/admin.hooks";

export default function RecentPharmacies() {
  const { data, loading } = useAdminPharmacies();
  const pharmacies = data.slice(0, 4);

  return (
    <div className="bg-white rounded-2xl border border-[#EFEDED] flex flex-col p-4 gap-4">
      {/* Header */}
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-full bg-[#EFF3FB] flex items-center justify-center shrink-0">
          <DashPharmacyOutlineIcon />
        </div>
        <h3 className="flex-1 text-[16px] leading-[1.2] font-semibold text-[#212F4D]">
          Recent pharmacies
        </h3>
        <Link
          href="/admin/pharmacies"
          className="border border-[#EFEDED] rounded-lg p-3 text-[12px] leading-[1.2] font-normal text-[#393737] hover:bg-[#FAF9F9] transition-colors shrink-0"
        >
          View all
        </Link>
      </div>

      {/* Table */}
      <div className="flex flex-col rounded-t-[16px] rounded-b-[12px]">
        {/* Table Header */}
        <div className="flex items-center h-14 bg-[#EFF3FB] border-t-2 border-[#5F85DB] rounded-t-[12px] px-4 gap-2">
          <span className="flex-1 text-[14px] leading-[1.2] font-semibold text-[#393737] min-w-[200px]">
            Pharmacy
          </span>
          <span className="flex-1 max-w-[62px] text-[14px] leading-[1.2] font-semibold text-[#393737]">
            City
          </span>
        </div>

        {/* Rows */}
        {loading ? (
          <div className="flex items-center justify-center h-16 text-[14px] text-[#989593]">
            Loading…
          </div>
        ) : pharmacies.length === 0 ? (
          <div className="flex items-center justify-center h-16 text-[14px] text-[#989593]">
            No pharmacies found
          </div>
        ) : (
          pharmacies.map((pharmacy) => (
            <div
              key={pharmacy.id}
              className="flex items-center h-16 px-4 py-3 gap-2 border-t border-[#FAF9F9] border-l border-r"
            >
              <div className="w-8 h-8 rounded-2xl bg-[#CDD9F4] flex items-center justify-center shrink-0">
                <DashPharmacyFilledIcon />
              </div>
              <div className="flex-1 flex flex-col gap-1 justify-center min-w-0">
                <p className="text-[14px] leading-[1.2] font-semibold text-[#263B81] truncate">
                  {pharmacy.pharmacyName}
                </p>
                <p className="text-[12px] leading-[1.2] font-medium text-[#989593] truncate">
                  {pharmacy.addressLine ?? "—"}
                </p>
              </div>
              <div className="border border-[#EFEDED] rounded-lg px-2 py-3 shrink-0">
                <p className="text-[12px] leading-[1.2] font-normal text-[#5B5958] text-right w-[46px] truncate">
                  {pharmacy.cityName}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
