"use client";

import Image from "next/image";
import { FiMapPin } from "react-icons/fi";
import { IoSearchOutline } from "react-icons/io5";
import { findPharmacySteps } from "@/lib/mock/home";
import {
  FadeUp,
  SlideIn,
  StaggerContainer,
  StaggerItem,
} from "@/components/home/animations";

/**
 * HomeBottomCTA
 * Two-part bottom section:
 *  1. "Free Delivery on first order" promo strip
 *  2. Two-column: Find nearby pharmacy steps + search card
 */
export function HomeBottomCTA() {
  const stepIcons: Record<string, React.ReactNode> = {
    location: <FiMapPin className="w-6 h-6 md:w-8 md:h-8 text-primary" />,
    click: (
      <svg
        className="w-6 h-6 md:w-8 md:h-8 text-primary"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122"
        />
      </svg>
    ),
    consult: (
      <svg
        className="w-6 h-6 md:w-8 md:h-8 text-primary"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
        />
      </svg>
    ),
  };

  return (
    <section className="w-full flex flex-col gap-8">
      {/* Free delivery promo strip */}
      <FadeUp inView offset={14} duration={0.5}>
        <div className="bg-primary-light flex items-center gap-6 md:gap-10 px-4 md:px-6 lg:px-10 py-4 md:py-6 h-auto md:h-[140px] relative overflow-visible">
          <div className="relative w-28 h-28 md:w-[160px] md:h-[160px] shrink-0 md:absolute md:left-8 md:top-1">
            <Image
              src="/patient/Free Delivery.png"
              alt="Free delivery"
              fill
              className="object-contain"
              sizes="160px"
            />
          </div>
          <p className="text-2xl md:text-3xl lg:text-t-36 font-black leading-tight md:ml-[180px]">
            <span className="text-error-hover">Free </span>
            <span className="text-primary-hover">Delivery on first order</span>
          </p>
        </div>
      </FadeUp>

      {/* Find pharmacy — two columns */}
      <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 px-4 md:px-6 lg:px-10 pb-8">
        {/* Left — steps */}
        <div className="flex-1 flex flex-col gap-8 md:gap-10">
          <FadeUp inView offset={12} duration={0.45}>
            <div className="flex flex-col gap-4">
              <h2 className="text-2xl md:text-3xl lg:text-[36px] font-semibold leading-snug">
                Find the{" "}
                <span className="font-bold bg-gradient-to-r from-primary-hover to-neutral bg-clip-text text-transparent">
                  Nearby Pharmacy
                </span>
                <br />
                right at your fingertips
              </h2>
              <p className="text-t-17 md:text-t-21 lg:text-t-25 text-black/60">
                We care gives you the tools and information you need to
              </p>
            </div>
          </FadeUp>

          <StaggerContainer
            className="flex flex-col"
            stagger={0.1}
            delayChildren={0.15}
          >
            {findPharmacySteps.map((step, i) => (
              <StaggerItem key={step.title}>
                <div className="flex items-start gap-5 md:gap-6">
                  <div className="w-12 h-12 md:w-14 md:h-14 lg:w-16 lg:h-16 rounded-full bg-primary-light flex items-center justify-center shrink-0">
                    {stepIcons[step.icon]}
                  </div>
                  <div className="flex flex-col gap-2">
                    <p className="text-t-17 md:text-t-21 lg:text-t-25 font-semibold text-primary-hover leading-[1.2]">
                      {step.title}
                    </p>
                    <p className="text-t-14 md:text-t-17 lg:text-t-21 text-black/50 leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </div>
                {/* Connector line */}
                {i < findPharmacySteps.length - 1 && (
                  <div className="w-12 md:w-14 lg:w-16 flex justify-center py-2">
                    <div className="w-0.5 h-8 md:h-10 bg-primary-light-active" />
                  </div>
                )}
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>

        {/* Right — search card */}
        <SlideIn
          direction="right"
          offset={24}
          duration={0.55}
          inView
          className="w-full lg:w-[400px] self-start"
        >
          <div className="bg-white rounded-2xl shadow-md p-5 md:p-6 flex flex-col gap-5">
            <h3 className="text-t-21 md:text-t-25 font-semibold text-primary-hover text-center">
              Find the nearest pharmacy
            </h3>

            {/* Saved location card */}
            <div className="border-2 border-black/10 rounded-2xl p-4 flex items-start gap-3">
              <div className="w-10 h-10 md:w-12 md:h-12 shrink-0 flex items-center justify-center">
                <svg
                  className="w-8 h-8 md:w-10 md:h-10 text-primary"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z" />
                </svg>
              </div>
              <div className="flex flex-col gap-1 flex-1 min-w-0">
                <p className="text-t-14 md:text-t-17 font-semibold text-black">
                  Use Your Saved Location
                </p>
                <p className="text-t-12 md:text-t-14 font-semibold text-black/60 leading-snug">
                  Omar Mukhtar Street, Al-Rimal Area, Gaza City, Gaza, Palestine
                </p>
              </div>
            </div>

            {/* Divider */}
            <div className="flex items-center gap-5">
              <div className="flex-1 h-px bg-black/10" />
              <span className="text-t-14 font-medium text-black/80">Or</span>
              <div className="flex-1 h-px bg-black/10" />
            </div>

            {/* Write location input */}
            <div className="border border-black/10 rounded-2xl p-4 flex items-center gap-4">
              <FiMapPin className="w-6 h-6 md:w-8 md:h-8 text-primary shrink-0" />
              <p className="text-t-17 md:text-t-21 font-semibold text-black/80">
                Write location
              </p>
            </div>

            {/* Search now button */}
            <button
              className="bg-primary text-primary-light text-t-17 md:text-t-21 font-semibold rounded-2xl h-14 md:h-16 flex items-center justify-center gap-3 hover:bg-primary-hover transition-colors w-full"
              type="button"
              aria-label="Search for nearby pharmacy"
            >
              <IoSearchOutline className="w-6 h-6" />
              Search Now
            </button>
          </div>
        </SlideIn>
      </div>
    </section>
  );
}
