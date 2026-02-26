import Image from "next/image";
import PrimaryButton from "./PrimaryButton";

interface Props {
  onUploadClick: () => void;
}

export default function UploadInitial({ onUploadClick }: Props) {
  return (
    <div className="max-w-5xl mx-auto flex flex-col gap-6">
      {/* Warning banner */}
      <div className="rounded-[22px] bg-[#FFF8E6] p-5 sm:p-6 flex flex-col gap-4">
        <p className="text-lg sm:text-2xl font-semibold text-black/80 leading-[1.2]">
          A licensed pharmacist will review it
        </p>

        <div className="flex items-center gap-4">
          <div className="shrink-0 w-14 h-14 rounded-full bg-[#73694E] shadow-sm flex items-center justify-center">
            <Image
              src="/icons/prescriptions/secure.png"
              alt="Secure"
              width={22}
              height={22}
            />
          </div>

          <p className="text-sm sm:text-lg font-medium text-[#73694E] leading-[1.2]">
            Your prescription is secure and only shared with the selected pharmacy.
          </p>
        </div>
      </div>

      {/* Upload box */}
      <div className="bg-white border-2 border-[#334EAC] shadow-[0px_4px_7.3px_0px_rgba(46,70,155,0.25)] rounded-3xl p-6 sm:p-10 flex flex-col items-center gap-8">
        <Image
          src="/icons/prescriptions/upload.png"
          alt="Upload"
          width={150}
          height={150}
          className="w-28 h-28 sm:w-36 sm:h-36"
        />

        <p className="text-center text-black/60 text-base sm:text-2xl leading-[1.5]">
          JPG or PNG · Max size 10 MB · Minimum 600×600 px
        </p>

        <div className="w-full max-w-xl">
          <PrimaryButton onClick={onUploadClick}>Upload file</PrimaryButton>
        </div>
      </div>
    </div>
  );
}