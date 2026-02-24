import Image from "next/image";
import PrimaryButton from "./PrimaryButton";

interface Props {
  onSelect: () => void;
  onClose: () => void;
}

export default function UploadPicker({ onSelect, onClose }: Props) {
  return (
    <div className="max-w-6xl mx-auto bg-white rounded-3xl shadow-[0px_4px_4px_0px_rgba(46,70,155,0.25)] p-6 sm:p-8 flex flex-col gap-6">
      <div className="flex flex-col gap-4">
        <button
          type="button"
          onClick={onSelect}
          className="w-full flex items-center gap-4 bg-[#EBEDF7] rounded-2xl px-6 py-4 text-left hover:bg-[#dde2f5] transition"
        >
          <Image src="/icons/prescriptions/take-photo.png" alt="Take Photo" width={24} height={24} />
          <span className="text-lg sm:text-2xl font-semibold text-[#121B3C]">
            Take Photo
          </span>
        </button>

        <button
          type="button"
          onClick={onSelect}
          className="w-full flex items-center gap-4 bg-[#EBEDF7] rounded-2xl px-6 py-4 text-left hover:bg-[#dde2f5] transition"
        >
          <Image
            src="/icons/prescriptions/image-lib.png"
            alt="Photo Library"
            width={24}
            height={24}
          />
          <span className="text-lg sm:text-2xl font-semibold text-[#121B3C]">
            Photo Library
          </span>
        </button>

        <button
          type="button"
          onClick={onSelect}
          className="w-full flex items-center gap-4 bg-[#EBEDF7] rounded-2xl px-6 py-4 text-left hover:bg-[#dde2f5] transition"
        >
          <Image src="/icons/prescriptions/files.png" alt="Files" width={24} height={24} />
          <span className="text-lg sm:text-2xl font-semibold text-[#121B3C]">
            Files
          </span>
        </button>
      </div>

      <div className="w-full max-w-xl self-center">
        <PrimaryButton variant="outline" onClick={onClose}>
          Close
        </PrimaryButton>
      </div>
    </div>
  );
}