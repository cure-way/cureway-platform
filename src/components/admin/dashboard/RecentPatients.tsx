"use client";

import Link from "next/link";
import { DashPatientsIcon } from "@/components/admin/shared/icons";
import { useAdminPatients } from "@/hooks/admin.hooks";

export default function RecentPatients() {
  const { data, loading } = useAdminPatients();
  const patients = data.slice(0, 4);

  return (
    <div className="bg-white rounded-2xl border border-[#EFEDED] flex flex-col p-4 gap-4">
      {/* Header */}
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-full bg-[#FFFAEF] flex items-center justify-center shrink-0">
          <DashPatientsIcon />
        </div>
        <h3 className="flex-1 text-[16px] leading-[1.2] font-semibold text-[#594920]">
          Recent patients
        </h3>
        <Link
          href="/admin/patients"
          className="border border-[#EFEDED] rounded-lg p-3 text-[12px] leading-[1.2] font-normal text-[#393737] hover:bg-[#FAF9F9] transition-colors shrink-0"
        >
          View all
        </Link>
      </div>

      {/* Table */}
      <div className="flex flex-col rounded-t-[16px] rounded-b-[12px]">
        {/* Table Header */}
        <div className="flex items-center h-14 bg-[#FFFAEF] border-t-2 border-[#BF9D45] rounded-t-[12px] px-3 gap-2">
          <span className="flex-1 text-[14px] leading-[1.2] font-semibold text-[#594920]">
            Patient Name
          </span>
          <span className="flex-1 max-w-[62px] text-[14px] leading-[1.2] font-semibold text-[#594920]">
            Date
          </span>
        </div>

        {/* Rows */}
        {loading ? (
          <div className="flex items-center justify-center h-16 text-[14px] text-[#989593]">
            Loading…
          </div>
        ) : patients.length === 0 ? (
          <div className="flex items-center justify-center h-16 text-[14px] text-[#989593]">
            No patients found
          </div>
        ) : (
          patients.map((patient) => {
            const d = new Date(patient.createdAt);
            const dateStr = d.toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
            });
            const timeStr = d.toLocaleTimeString("en-US", {
              hour: "2-digit",
              minute: "2-digit",
            });
            return (
              <div
                key={patient.id}
                className="flex items-center h-16 px-3 py-3 border-t border-[#FAF9F9] border-l border-r"
              >
                <div className="flex items-center gap-2 flex-1 min-w-0 h-full">
                  <div className="w-9 h-9 rounded-[20px] bg-[#FFFDC3] shrink-0 flex items-center justify-center">
                    <span className="text-[14px] font-bold text-[#594920]">
                      {patient.name.charAt(0)}
                    </span>
                  </div>
                  <div className="flex-1 flex flex-col gap-2 justify-center min-w-0">
                    <p className="text-[12px] leading-[1.2] font-semibold text-[#393737] truncate">
                      {patient.name}
                    </p>
                    <p className="text-[12px] leading-[1.2] font-medium text-[#989593] truncate">
                      {patient.phoneNumber || patient.email}
                    </p>
                  </div>
                </div>
                <div className="border border-[#EFEDED] rounded-lg px-2 py-3 shrink-0">
                  <p className="text-[12px] leading-[1.2] font-normal text-[#989593] text-right w-[46px]">
                    {dateStr}
                  </p>
                  <p className="text-[12px] leading-[1.2] font-normal text-[#5B5958] text-right w-[46px]">
                    {timeStr}
                  </p>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
