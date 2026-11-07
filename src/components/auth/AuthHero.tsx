"use client";

import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

export interface AuthHeroProps {
  /** Image URL for the hero background */
  imageSrc?: string;
  /** Hero title text */
  title?: string;
  /** Hero subtitle/description */
  subtitle?: string;
  /** Additional className */
  className?: string;
  /** Whether to show the slider dots */
  showSliderDots?: boolean;
  /** Current active slide (if using slider) */
  activeSlide?: number;
  /** Total number of slides */
  totalSlides?: number;
}

/**
 * AuthHero - Left side hero component for auth split layout
 * Features: Background image with overlay, headline text pinned to bottom, optional slider dots
 * The hero is fixed height (h-dvh) and content stays pinned regardless of right panel scroll
 */
export function AuthHero({
  imageSrc = "/images/auth-hero.jpg",
  title = "Your Health Our Priority",
  subtitle = "Trusted access to the medicine you need safely and effortlessly.",
  className,
  showSliderDots = true,
  activeSlide = 0,
  totalSlides = 3,
}: AuthHeroProps) {
  return (
    <div
      className={cn(
        "relative w-full h-dvh rounded-3xl overflow-hidden",
        className,
      )}
    >
      {/* Background Image with Overlay */}
      <div className="absolute inset-0">
        <Image
          src={imageSrc}
          alt="Health and wellness"
          fill
          className="object-cover blur-[2px]"
          priority
        />
        {/* Gradient overlay for better text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-black/20" />
      </div>

      {/* Content - Pinned to bottom */}
      <div className="absolute bottom-8 left-8 right-8 z-10 flex flex-col gap-8 max-w-[520px]">
        {/* Text Content with Animation */}
        <AnimatePresence mode="wait">
          <motion.div
            key={`${title}-${subtitle}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
            className="flex flex-col gap-4"
          >
            {/* Decorative hero copy, not a section heading: it renders
                before the page's own h1 and would break the outline. */}
            <p className="text-4xl font-bold text-white leading-tight">
              {title}
            </p>
            <p className="text-base text-white/90">{subtitle}</p>
          </motion.div>
        </AnimatePresence>

        {/* Slider Dots */}
        {showSliderDots && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="flex items-center gap-2"
          >
            {Array.from({ length: totalSlides }).map((_, index) => (
              <div
                key={index}
                className={cn(
                  "h-1 rounded-full transition-all duration-300",
                  index === activeSlide ? "w-12 bg-white" : "w-2 bg-white/50",
                )}
              />
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
}
