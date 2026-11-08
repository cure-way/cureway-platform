import Image from "next/image";
import PrimaryButton from "./PrimaryButton";
import ProgressBar from "./ProgressBar";

interface Props {
  progress: number;
  onCancel: () => void;
}

export default function UploadProgress({ progress, onCancel }: Props) {
  return (
    <div className="flex flex-col gap-6">
      <div className="rounded-2xl border-b border-[#EBEDF7] p-6 sm:p-10 flex flex-col items-center gap-6">
        <Image
          src="/icons/prescriptions/uploading.png"
          alt="Uploading"
          width={154}
          height={154}
          className="w-24 h-24 sm:w-[120px] sm:h-[120px]"
        />

        <h2 className="text-t-17-semibold md:text-t-21-semibold text-center leading-[1.2]">
          Uploading prescription ({progress}% )...
        </h2>

        <div className="w-full">
          <ProgressBar value={progress} />
        </div>
      </div>

      <div className="bg-[#F9F9F9] rounded-xl p-5 sm:p-6">
        <p className="text-red-700 text-t-14 leading-[1.2]">
          .Please don’t close this window
        </p>
      </div>

      <div className="w-full max-w-[26rem] self-center">
        <PrimaryButton variant="outline" onClick={onCancel}>
          Cancel
        </PrimaryButton>
      </div>
    </div>
  );
}
