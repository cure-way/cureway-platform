import Image from "next/image";
import PrimaryButton from "./PrimaryButton";

interface Props {
  onRetry: () => void;
}

export default function UploadError({ onRetry }: Props) {
  return (
    <div className="flex flex-col items-center gap-6 text-center">
      <div className="rounded-2xl border-b border-[#EBEDF7] p-6 sm:p-10 w-full flex flex-col items-center gap-6 shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)]">
        <Image
          src="/icons/prescriptions/error.png"
          alt="Network error"
          width={189}
          height={189}
          className="w-24 h-24 sm:w-[120px] sm:h-[120px]"
        />

        <h2 className="text-t-17-semibold md:text-t-21-semibold text-[#111111]">
          Unable to upload prescription
        </h2>

        <p className="text-black/80 text-t-14 leading-[1.5]">
          .Please check your connection and try again.
        </p>
      </div>

      <div className="w-full max-w-[26rem]">
        <PrimaryButton onClick={onRetry}>Try again</PrimaryButton>
      </div>
    </div>
  );
}
