"use client";

import Image from "next/image";
import { FaPrescription } from "react-icons/fa";
import { TbTruckDelivery } from "react-icons/tb";
import { heroData, heroBadges } from "@/lib/mock/home";
import {
  SlideIn,
  ScaleIn,
  Floating,
  StaggerContainer,
  StaggerItem,
} from "@/components/home/animations";

/**
 * HomeHero
 * Two-column hero: heading + CTA cards on left, image + floating badges on right.
 */
export function HomeHero() {
  const { heading, subheading, ctas } = heroData;

  return (
    <section className="w-full px-3 md:px-6 lg:px-10">
      <div className="flex flex-col lg:flex-row items-center gap-6 md:gap-8 lg:gap-[100px] py-4 md:py-6 lg:py-8">
        {/* Left column */}
        <SlideIn
          direction="left"
          offset={20}
          duration={0.55}
          inView
          className="flex-1 flex flex-col gap-5 md:gap-6 lg:gap-8 min-w-0"
        >
          <div className="flex flex-col gap-3 md:gap-4 lg:gap-6">
            <h1 className="text-t-21 md:text-t-30 lg:text-[56px] font-bold text-primary-darker leading-tight md:leading-normal">
              {heading}
            </h1>
            <p className="text-t-17 md:text-t-21 lg:text-t-25 text-secondary leading-[1.5] max-w-[545px]">
              {subheading}
            </p>
          </div>

          {/* CTA cards */}
          <StaggerContainer
            className="flex flex-col sm:flex-row gap-3"
            stagger={0.1}
          >
            {ctas.map((cta) => (
              <StaggerItem key={cta.label} className="flex-1">
                <button className="flex items-center gap-3 bg-primary-light border border-black/10 rounded-2xl px-2 py-3 h-[72px] md:h-[88px] w-full hover:bg-primary-light-hover transition-colors">
                  <div className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-white flex items-center justify-center shrink-0">
                    {cta.icon === "prescription" ? (
                      <FaPrescription className="w-5 h-5 md:w-6 md:h-6 text-primary" />
                    ) : (
                      <TbTruckDelivery className="w-6 h-6 md:w-8 md:h-8 text-primary" />
                    )}
                  </div>
                  <span className="text-t-14 md:text-t-17 lg:text-t-17 font-semibold text-primary-dark text-left">
                    {cta.label}
                  </span>
                </button>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </SlideIn>

        {/* Right column — hero image + badges */}
        <ScaleIn
          delay={0.15}
          duration={0.6}
          inView
          className="relative flex-1 w-full max-w-[636px] hidden lg:block"
        >
          {/* Main image */}
          <div className="relative w-full h-[420px]">
            <Image
              src="/patient/Pharnacy-shelves.png"
              alt="Pharmacy shelves"
              fill
              className="object-contain"
              sizes="(max-width: 1024px) 100vw, 636px"
              priority
            />
          </div>

          {/* Floating badges */}
          {heroBadges.map((badge, i) => {
            const innerClasses =
              "rounded-2xl shadow-[0px_4px_4px_rgba(0,0,0,0.15)] px-4 py-3 md:px-5 md:py-4 hidden md:flex flex-col gap-2";

            if (badge.variant === "primary") {
              return (
                <Floating
                  key={badge.value}
                  amplitude={4 + i * 2}
                  duration={3.5 + i * 0.5}
                  className="absolute -rotate-[17deg] left-[15%] top-[14%] w-44 hidden md:block"
                >
                  <div className={`${innerClasses} bg-primary text-white`}>
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-t-21">{badge.value}</span>
                      <div className="w-10 h-10 rounded-full bg-primary-light flex items-center justify-center">
                        <span className="text-t-14 text-primary">👤</span>
                      </div>
                    </div>
                    <p className="text-t-14 font-bold list-disc">
                      • {badge.label}
                    </p>
                  </div>
                </Floating>
              );
            }

            if (badge.variant === "accent") {
              return (
                <Floating
                  key={badge.value}
                  amplitude={4 + i * 2}
                  duration={3.5 + i * 0.5}
                  className="absolute rotate-[5deg] right-0 bottom-0 w-52 md:w-56 hidden md:block"
                >
                  <div
                    className={`${innerClasses} bg-primary-light text-primary-hover`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-t-25 md:text-t-30">
                        {badge.value}
                      </span>
                      <span className="text-t-25">🏅</span>
                    </div>
                    <p className="text-t-14 md:text-t-17 font-bold">
                      • {badge.label}
                    </p>
                  </div>
                </Floating>
              );
            }

            return (
              <Floating
                key={badge.value}
                amplitude={4 + i * 2}
                duration={3.5 + i * 0.5}
                className="absolute rotate-[4deg] right-0 top-[2%] w-44 hidden md:block"
              >
                <div
                  className={`${innerClasses} bg-white border border-primary text-primary`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-t-14">{badge.value}</span>
                    <span className="text-t-17">🏅</span>
                  </div>
                  <p className="text-t-12 font-bold text-primary">
                    • {badge.label}
                  </p>
                </div>
              </Floating>
            );
          })}
        </ScaleIn>
      </div>
    </section>
  );
}
