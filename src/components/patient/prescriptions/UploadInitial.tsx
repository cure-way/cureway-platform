import Image from "next/image";
import PrimaryButton from "./PrimaryButton";

interface Props {
  onUploadClick: () => void;
}

export default function UploadInitial({ onUploadClick }: Props) {
  return (
    <div className="flex flex-col gap-6">
      {/* Warning banner */}
      <div className="rounded-xl bg-[#FFF8E6] p-5 sm:p-6 flex flex-col gap-4">
        <p className="text-t-17-semibold text-black/80 leading-[1.2]">
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

          <p className="text-t-14 text-[#73694E] leading-[1.2]">
            Your prescription is secure and only shared with the selected
            pharmacy.
          </p>
        </div>
      </div>

      {/* Upload box */}
      <div className="bg-white border-2 border-[#334EAC] shadow-[0px_4px_7.3px_0px_rgba(46,70,155,0.25)] rounded-2xl p-6 sm:p-10 flex flex-col items-center gap-8">
        <Image
          src="/icons/prescriptions/upload.png"
          alt="Upload"
          width={150}
          height={150}
          className="w-24 h-24 sm:w-[120px] sm:h-[120px]"
        />

        <p className="text-center text-black/60 text-t-14 leading-[1.5]">
          JPG or PNG · Max size 10 MB · Minimum 600×600 px
        </p>

        <div className="w-full max-w-[26rem]">
          <PrimaryButton onClick={onUploadClick}>Upload file</PrimaryButton>
        </div>
      </div>
    </div>
  );
}
