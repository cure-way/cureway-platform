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
      <section data-section="upload cta" className="w-full">
        <div className="bg-primary-hover flex flex-col sm:flex-row sm:items-center gap-3 md:gap-8 overflow-hidden rounded-2xl p-3 sm:p-0 shadow-[0px_2px_4px_rgba(0,0,0,0.15)] h-auto sm:h-32 md:h-36 lg:h-[156px]">
          {/* Left illustration */}
          <div className="relative hidden sm:block sm:w-44 md:w-52 lg:w-[218px] sm:h-32 md:h-36 lg:h-[156px] shrink-0">
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
            <p className="text-t-12 sm:text-t-14 md:text-t-17 lg:text-t-25 text-primary-light-active leading-snug lg:leading-[1.5]">
              Upload only .jpg, .png, .jpeg or .pdf files, Size limit is 10 MB
            </p>
          </div>

          {/* CTA button */}
          <button
            onClick={() => router.push("/prescriptions")}
            className="h-11 w-full sm:w-auto bg-primary-light text-primary text-t-14-semibold sm:text-t-17 md:text-t-21 rounded-lg px-4 sm:px-5 lg:px-6 sm:mr-6 md:mr-8 lg:mr-10 shrink-0 hover:bg-primary-light-hover transition-colors whitespace-nowrap"
          >
            Upload Prescription
          </button>
        </div>
      </section>
    </FadeUp>
  );
}
