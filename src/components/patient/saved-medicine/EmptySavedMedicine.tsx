"use client";

import React from "react";
import { MotionTap } from "@/components/shared/MotionTap";
import { IconSave } from "@/components/patient/settings/Icons"; // ✅ نفس أيقونة Saved items

export function EmptySavedMedicine({ onBrowse }: { onBrowse?: () => void }) {
  return (
    <MotionTap className="mx-auto w-full max-w-[734px] rounded-[24px] bg-white pt-6 shadow-[0px_4px_7.3px_0px_#00000040]">
      <div className="rounded-[24px] border-t-[5px] border-t-[#334EAC] px-6 pb-6">
        <div className="flex flex-col items-center gap-6">
          <div className="grid h-[200px] w-[200px] place-items-center rounded-full bg-[#EBEDF7]">
            {/* تكبير الأيقونة */}
            <div className="scale-[2.2]">
              <IconSave />
            </div>
          </div>

          <div className="text-center">
            <div className="text-[24px] font-semibold leading-[120%] text-[#334EAC]">
              No Saved Medicine Yet
            </div>
            <div className="mt-3 text-[18px] font-medium leading-[120%] text-[#474545]">
              • Save medicine to access them faster
            </div>
          </div>

          <div className="w-full pt-2">
            <MotionTap
              as="button"
              onClick={onBrowse}
              className="mx-auto flex h-[65px] w-full max-w-[586px] items-center justify-center rounded-[12px] bg-[#334EAC]"
            >
              <span className="text-[20px] font-semibold leading-none text-[#EBEDF7]">
                Browse Medicine
              </span>
            </MotionTap>
          </div>
        </div>
      </div>
    </MotionTap>
  );
}