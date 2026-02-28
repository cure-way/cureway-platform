"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { FadeUp } from "@/components/home/animations";

/**
 * HomeUploadPrescription
 * Horizontal CTA card — upload prescription to place order.
 */
export function HomeUploadPrescription() {
  const router = useRouter();
  return (
    <FadeUp inView offset={14} duration={0.45}>
      <section className="w-full">
        <div className="bg-primary-hover flex flex-row items-center gap-3 md:gap-8 overflow-hidden shadow-[0px_2px_4px_rgba(0,0,0,0.15)] border-t border-black/10 h-auto min-h-[100px] sm:h-32 md:h-36 lg:h-[156px]">
          {/* Left illustration */}
          <div className="relative w-24 sm:w-44 md:w-52 lg:w-[218px] h-[100px] sm:h-32 md:h-36 lg:h-[156px] shrink-0">
            <Image
              src="/patient/Upload-Prescription.png"
              alt="Upload prescription"
              fill
              className="object-cover"
              sizes="(max-width: 640px) 96px, 208px"
            />
          </div>

          {/* Text */}
          <div className="flex-1 flex flex-col gap-0.5 md:gap-1 min-w-0">
            <p className="text-t-14 sm:text-t-21 md:text-t-25 lg:text-t-30 font-semibold text-primary-light leading-snug">
              Upload Prescriptions to Place Order
            </p>
            <p className="text-[10px] sm:text-t-14 md:text-t-17 lg:text-[24px] text-primary-light-active leading-snug lg:leading-[1.5] hidden sm:block">
              Upload only .jpg, .png, .jpeg or .pdf files, Size limit is 10 MB
            </p>
          </div>

          {/* CTA button */}
          <button onClick={() => router.push("/prescriptions")} className="bg-primary-light text-primary text-t-12 sm:text-t-17 md:text-t-21 lg:text-[24px] font-normal rounded-lg sm:rounded-xl px-3 sm:px-5 lg:px-6 py-2 sm:py-2.5 mr-3 sm:mr-6 md:mr-8 lg:mr-10 shrink-0 hover:bg-primary-light-hover transition-colors whitespace-nowrap">
            Upload Prescription
          </button>
        </div>
      </section>
    </FadeUp>
  );
}
