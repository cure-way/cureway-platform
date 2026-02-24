import Image from "next/image";
import PrimaryButton from "./PrimaryButton";

interface Props {
  onClose: () => void;
  onTrack: () => void;
}

export default function UploadSuccess({ onClose, onTrack }: Props) {
  return (
    <div className="max-w-4xl mx-auto bg-white shadow-[0px_4px_7.3px_0px_rgba(0,0,0,0.25)] rounded-3xl p-6 sm:p-10 flex flex-col items-center gap-8 text-center border-t-[5px] border-t-[#334EAC1A]">
      <Image
        src="/icons/prescriptions/success.png"
        alt="Success"
        width={150}
        height={150}
        className="w-24 h-24 sm:w-36 sm:h-36"
      />

      <div className="flex flex-col gap-2">
        <h2 className="text-2xl sm:text-5xl font-bold text-black leading-[1.2]">
          Prescription uploaded
        </h2>

        <p className="text-[#AEAEAE] text-base sm:text-2xl font-medium leading-[1.2]">
          A licensed pharmacist will review it shortly
        </p>
      </div>

      <div className="w-full max-w-2xl bg-[#FFF8E6] border border-[#73694E] rounded-xl p-4 sm:p-5 text-left">
        <div className="flex items-start gap-3">
          {/* لو عندك أيقونة Status حطها هنا، أو اتركها */}
          <div className="mt-1">
            <span className="inline-block w-2 h-2 rounded-full bg-black/40" />
          </div>

          <div className="flex flex-col gap-1">
            <p className="font-semibold text-black/80 text-lg sm:text-2xl">
              Status
            </p>
            <p className="text-base sm:text-xl text-black/60">Under review</p>
          </div>
        </div>
      </div>

      <div className="w-full max-w-xl flex flex-col gap-3">
        <PrimaryButton onClick={onTrack}>Track status</PrimaryButton>
        <PrimaryButton variant="outline" onClick={onClose}>
          Close
        </PrimaryButton>
      </div>
    </div>
  );
}