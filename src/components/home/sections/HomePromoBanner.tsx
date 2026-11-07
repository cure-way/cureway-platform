"use client";

import Image from "next/image";
import { promoBanner } from "@/lib/mock/home";
import { FadeUp, Floating } from "@/components/home/animations";

/**
 * HomePromoBanner
 * Full-width error-light coloured discount banner with a large 3D first-aid
 * kit image overflowing top-left, plus "20% Discount on First Aid" text.
 */
export function HomePromoBanner() {
  const { discount, subtitle } = promoBanner;

  return (
    <FadeUp inView offset={16} duration={0.5}>
      <section className="w-full px-3 md:px-6 lg:px-12 pt-4 md:pt-6 lg:pt-12">
        <div className="relative bg-error-light border border-error-hover shadow-[0px_2px_10px_rgba(193,62,62,0.1)] rounded-lg md:rounded-xl flex items-center gap-3 md:gap-8 px-4 md:px-8 lg:pl-60 py-3 md:py-4 h-auto min-h-24 md:h-30 lg:h-35 overflow-visible">
          {/* 3D first-aid kit — overflows top-left on large screens */}
          <Floating
            amplitude={5}
            duration={4}
            className="hidden lg:block absolute -left-5 -top-15 w-61 h-61 pointer-events-none"
          >
            <Image
              src="/patient/Discount on First Aid.png"
              alt="First Aid Kit"
              fill
              className="object-contain"
              sizes="244px"
            />
          </Floating>

          {/* Smaller first-aid image on mobile / tablet */}
          <div className="relative shrink-0 w-12 h-12 md:w-16 md:h-16 lg:hidden">
            <Image
              src="/patient/Discount on First Aid.png"
              alt="First Aid Kit"
              fill
              className="object-contain"
              sizes="64px"
            />
          </div>

          {/* Text content */}
          <div className="flex items-center gap-2 md:gap-4 flex-1 min-w-0">
            <span className="text-error-hover font-bold text-t-25 md:text-t-30 lg:text-[80px] leading-none shrink-0">
              {discount}
            </span>
            <div className="flex flex-col gap-0.5 md:gap-2 min-w-0">
              <p className="text-t-17 md:text-t-25 lg:text-t-30 font-bold leading-tight md:leading-normal">
                <span className="text-error-hover">Discount on</span>{" "}
                <span className="text-black/60 font-bold">First Aid</span>
              </p>
              <p className="text-t-12 md:text-t-17 lg:text-t-25 text-black/40 leading-snug md:leading-normal lg:leading-normal line-clamp-2">
                {subtitle}
              </p>
            </div>
          </div>
        </div>
      </section>
    </FadeUp>
  );
}
