import Image from "next/image";
import PrimaryButton from "./PrimaryButton";

interface Props {
  onUploadClick: () => void;
}

/**
 * The drop zone.
 *
 * The privacy note that used to sit above it has moved to the side panel,
 * where it belongs with the rest of the context — it was repeating the same
 * reassurance directly above the control it describes. What is left is one
 * sized drop zone rather than a tall empty card.
 */
export default function UploadInitial({ onUploadClick }: Props) {
  return (
    <div
      className="flex flex-col items-center justify-center gap-5 rounded-2xl border-2 border-dashed border-primary bg-primary-light/25 px-6 py-10 text-center md:py-14"
      role="group"
      aria-label="Upload a prescription"
    >
      <Image
        src="/icons/prescriptions/upload.png"
        alt=""
        width={120}
        height={120}
        className="h-20 w-20 md:h-[120px] md:w-[120px]"
      />

      <div className="flex flex-col gap-1">
        <p className="text-t-17-semibold text-primary-darker">
          Add a photo of your prescription
        </p>
        <p className="measure text-t-14 text-neutral-dark">
          JPG, PNG or PDF · up to 10 MB · at least 600 × 600 px
        </p>
      </div>

      <div className="w-full max-w-[20rem]">
        <PrimaryButton onClick={onUploadClick}>Upload file</PrimaryButton>
      </div>
    </div>
  );
}
