import Image from "next/image";
import PrimaryButton from "./PrimaryButton";

interface Props {
  onUploadAgain: () => void;
}

export default function UploadUnsupported({ onUploadAgain }: Props) {
  return (
    <div className="flex flex-col items-center gap-6 text-center">
      <div className="rounded-2xl border-b border-[#EBEDF7] p-6 sm:p-10 w-full flex flex-col items-center gap-6 shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)]">
        <Image
          src="/icons/prescriptions/unsupported.png"
          alt="Unsupported"
          width={189}
          height={189}
          className="w-24 h-24 sm:w-[120px] sm:h-[120px]"
        />

        <h2 className="text-t-17-semibold md:text-t-21-semibold text-[#111111]">
          File unsupported
        </h2>

        <p className="text-black/80 text-t-14 leading-[1.5]">
          .Please check your file type (png, jpg, jpeg, pdf) and try again.
        </p>
      </div>

      <div className="w-full max-w-[26rem]">
        <PrimaryButton onClick={onUploadAgain}>Upload again</PrimaryButton>
      </div>
    </div>
  );
}
