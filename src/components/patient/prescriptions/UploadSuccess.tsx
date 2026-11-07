import Image from "next/image";
import PrimaryButton from "./PrimaryButton";
import { SHOWCASE_MODE } from "@/lib/showcase/config";

interface Props {
  onClose: () => void;
  onTrack: () => void;
}

export default function UploadSuccess({ onClose, onTrack }: Props) {
  return (
    <div className="bg-white shadow-[0px_4px_7.3px_0px_rgba(0,0,0,0.25)] rounded-2xl p-6 sm:p-10 flex flex-col items-center gap-8 text-center border-t-[5px] border-t-[#334EAC1A]">
      <Image
        src="/icons/prescriptions/success.png"
        alt="Success"
        width={150}
        height={150}
        className="w-24 h-24 sm:w-[120px] sm:h-[120px]"
      />

      <div className="flex flex-col gap-2">
        <h2 className="text-page-title text-black leading-[1.2]">
          Prescription uploaded
        </h2>

        <p className="text-[#AEAEAE] text-t-14 leading-[1.2]">
          A licensed pharmacist will review it shortly
        </p>
      </div>

      <div className="w-full bg-[#FFF8E6] border border-[#73694E] rounded-xl p-4 sm:p-5 text-left">
        <div className="flex items-start gap-3">
          {/* لو عندك أيقونة Status حطها هنا، أو اتركها */}
          <div className="mt-1">
            <span className="inline-block w-2 h-2 rounded-full bg-black/40" />
          </div>

          <div className="flex flex-col gap-1">
            <p className="text-t-14-semibold text-black/80">Status</p>
            <p className="text-t-14 text-black/60">Under review</p>
          </div>
        </div>
      </div>

      {SHOWCASE_MODE && (
        <p className="text-t-12 text-neutral-dark/70">
          Your file is previewed locally and is{""}
          <span className="font-semibold">not stored in showcase mode</span> —
          this version of CureWay runs without a backend.
        </p>
      )}

      <div className="w-full max-w-[26rem] flex flex-col gap-3">
        <PrimaryButton onClick={onTrack}>Track status</PrimaryButton>
        <PrimaryButton variant="outline" onClick={onClose}>
          Close
        </PrimaryButton>
      </div>
    </div>
  );
}
