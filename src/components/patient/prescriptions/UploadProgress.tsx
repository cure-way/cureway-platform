import Image from "next/image";
import PrimaryButton from "./PrimaryButton";
import ProgressBar from "./ProgressBar";

interface Props {
  progress: number;
  onCancel: () => void;
}

export default function UploadProgress({ progress, onCancel }: Props) {
  return (
    <div className="max-w-6xl mx-auto flex flex-col gap-6">
      <div className="rounded-3xl border-b border-[#EBEDF7] p-6 sm:p-10 flex flex-col items-center gap-6">
        <Image
          src="/icons/prescriptions/uploading.png"
          alt="Uploading"
          width={154}
          height={154}
          className="w-28 h-28 sm:w-36 sm:h-36"
        />

        <h2 className="text-xl sm:text-4xl font-semibold text-center leading-[1.2]">
          Uploading prescription ({progress}% )...
        </h2>

        <div className="w-full max-w-3xl">
          <ProgressBar value={progress} />
        </div>
      </div>

      <div className="bg-[#F9F9F9] rounded-[22px] p-5 sm:p-6">
        <p className="text-red-700 text-base sm:text-2xl font-medium leading-[1.2]">
          .Please don’t close this window
        </p>
      </div>

      <div className="w-full max-w-xl self-center">
        <PrimaryButton variant="outline" onClick={onCancel}>
          Cancel
        </PrimaryButton>
      </div>
    </div>
  );
}