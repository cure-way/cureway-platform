"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { promoBanner } from "@/lib/mock/home";
import { FadeUp, Floating } from "@/components/home/animations";

/** First Aid in the catalogue fixtures. */
const FIRST_AID_CATEGORY_ID = 26;

/**
 * HomePromoBanner
 *
 * A bordered promo card, so it sits inside the frame like every other block
 * on the page — it used to run edge to edge with its border against the
 * viewport and the first-aid kit clipped off the left.
 *
 * The kit still overflows the card upward on purpose, but it is now fully
 * inside the card horizontally, so nothing can clip it at any width.
 */
export function HomePromoBanner() {
  const { discount, subtitle } = promoBanner;

  return (
    <FadeUp inView offset={16} duration={0.5}>
      <section
        data-section="promo banner"
        /* The kit overflows the card upward by ~84px, so the section
           reserves that room: the image is fully visible and never
           reaches the quick-action chips above it. */
        className="w-full lg:pt-24"
      >
        <div className="relative flex items-center gap-4 overflow-visible rounded-xl border border-error-hover bg-error-light px-4 py-4 shadow-[0px_2px_10px_rgba(193,62,62,0.1)] md:gap-8 md:px-8 lg:min-h-35 lg:pl-56">
          {/* 3D first-aid kit. Anchored to the card's bottom edge so it
              overflows upward only, and `left-2` keeps it inside the card
              horizontally; lg:pl-56 reserves the room for it. */}
          <Floating
            amplitude={5}
            duration={4}
            className="pointer-events-none absolute bottom-0 left-2 hidden h-56 w-56 lg:block"
          >
            <Image
              src="/patient/Discount on First Aid.png"
              alt=""
              fill
              className="object-contain"
              sizes="224px"
            />
          </Floating>

          {/* Compact kit below lg, where there is no room to overflow. */}
          <div className="relative h-12 w-12 shrink-0 md:h-16 md:w-16 lg:hidden">
            <Image
              src="/patient/Discount on First Aid.png"
              alt=""
              fill
              className="object-contain"
              sizes="64px"
            />
          </div>

          {/* Offer */}
          <div className="flex min-w-0 flex-1 items-center gap-3 md:gap-5">
            <span className="shrink-0 text-t-25 font-bold leading-none text-error-hover md:text-t-30 lg:text-[56px]">
              {discount}
            </span>
            <div className="flex min-w-0 flex-col gap-0.5 md:gap-1">
              <p className="text-t-17 font-bold leading-tight md:text-t-21 lg:text-t-25">
                <span className="text-error-hover">Discount on</span>{" "}
                <span className="text-black/60">First Aid</span>
              </p>
              <p className="measure line-clamp-2 text-t-12 leading-snug text-black/50 md:text-t-14">
                {subtitle}
              </p>
            </div>
          </div>

          {/* The right half used to be empty: the offer now has somewhere to go. */}
          <Link
            href={`/categories/${FIRST_AID_CATEGORY_ID}`}
            className="ml-auto hidden h-11 shrink-0 items-center gap-2 rounded-lg bg-error-hover px-4 text-t-14-semibold text-white transition-colors hover:bg-error-dark sm:inline-flex"
          >
            Shop first aid
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>

        {/* Below sm the button goes full width under the offer rather than
            squeezing the text. */}
        <Link
          href={`/categories/${FIRST_AID_CATEGORY_ID}`}
          className="mt-3 flex h-11 items-center justify-center gap-2 rounded-lg bg-error-hover px-4 text-t-14-semibold text-white transition-colors hover:bg-error-dark sm:hidden"
        >
          Shop first aid
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </Link>
      </section>
    </FadeUp>
  );
}
