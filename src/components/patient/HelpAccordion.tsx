"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";

interface AccordionItem {
  icon: React.ReactNode;
  title: string;
  content?: React.ReactNode;
}

interface HelpAccordionProps {
  items: AccordionItem[];
}

export function HelpAccordion({ items }: HelpAccordionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const prefersReducedMotion = useReducedMotion();

  const toggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="flex flex-col gap-3 w-full max-w-[1188px]">
      {items.map((item, index) => (
        <div
          key={item.title}
          className="bg-white border border-neutral-normal/30 rounded-3xl px-8 md:px-20 py-8 md:py-10"
        >
          <button
            onClick={() => toggle(index)}
            className="flex items-center gap-1 w-full px-3 py-4 h-14"
            aria-expanded={openIndex === index}
            aria-controls={`accordion-panel-${index}`}
            type="button"
          >
            <div className="shrink-0 size-[35px] flex items-center justify-center text-black">
              {item.icon}
            </div>
            <p className="flex-1 text-t-21 font-semibold text-black text-left leading-[1.2]">
              {item.title}
            </p>
            {openIndex === index ? (
              <ChevronUp className="w-6 h-6 text-black shrink-0" />
            ) : (
              <ChevronDown className="w-6 h-6 text-black shrink-0" />
            )}
          </button>

          <AnimatePresence>
            {openIndex === index && item.content && (
              <motion.div
                id={`accordion-panel-${index}`}
                role="region"
                initial={
                  prefersReducedMotion ? undefined : { height: 0, opacity: 0 }
                }
                animate={{ height: "auto", opacity: 1 }}
                exit={
                  prefersReducedMotion ? undefined : { height: 0, opacity: 0 }
                }
                transition={
                  prefersReducedMotion ? { duration: 0 } : { duration: 0.2 }
                }
                className="overflow-hidden"
              >
                <div className="pt-6">{item.content}</div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ))}
    </div>
  );
}
