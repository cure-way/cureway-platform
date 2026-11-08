"use client";

import { FaChevronDown, FaPhoneAlt } from "react-icons/fa";
import { MdOutlineAttachMoney, MdOutlineTranslate } from "react-icons/md";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { CONTACT_PHONE } from "@/lib/constants";
import { SHOWCASE_MODE } from "@/lib/showcase/config";
import { SHELL_RAIL } from "@/components/shared";

const CURRENCIES = ["USD", "EUR", "ILS"] as const;
const LANGUAGES = [
  { value: "English", label: "English" },
  { value: "العربية", label: "العربية" },
] as const;

/**
 * AnnouncementsBar
 * Blue top strip with help line, announcements text, and currency / language
 * selectors. Hidden below `lg` breakpoint.
 *
 * In showcase mode this renders nothing: `ShowcaseBar` occupies the same slot
 * at the top of the page, and two stacked blue strips would look broken. The
 * currency and language pickers are display-only anyway.
 */
export function AnnouncementsBar() {
  const [currencyOpen, setCurrencyOpen] = useState(false);
  const [languageOpen, setLanguageOpen] = useState(false);
  const [selectedCurrency, setSelectedCurrency] = useState<string>("USD");
  const [selectedLanguage, setSelectedLanguage] = useState<string>("English");

  const currencyRef = useRef<HTMLDivElement>(null);
  const languageRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        currencyRef.current &&
        !currencyRef.current.contains(event.target as Node) &&
        languageRef.current &&
        !languageRef.current.contains(event.target as Node)
      ) {
        setCurrencyOpen(false);
        setLanguageOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleCurrencyToggle = () => {
    setCurrencyOpen((prev) => !prev);
    setLanguageOpen(false);
  };

  const handleLanguageToggle = () => {
    setLanguageOpen((prev) => !prev);
    setCurrencyOpen(false);
  };

  if (SHOWCASE_MODE) return null;

  return (
    /* Full-bleed background, content on the frame. */
    <div className="bg-primary w-full" aria-label="Announcements bar">
      <div
        className={`${SHELL_RAIL} flex justify-between items-center py-2 lg:py-2.5 gap-3`}
      >
      {/* Help Line (desktop only) */}
      <div className="hidden lg:flex items-center gap-3 flex-1">
        <FaPhoneAlt className="text-primary-light w-4 h-4" />
        <p className="text-t-14 font-semibold text-primary-light">
          Need help? call us:{" "}
          <span className="text-primary-light-active">{CONTACT_PHONE}</span>
        </p>
      </div>

      {/* Centre – Announcements text (desktop only) */}
      <p className="hidden lg:block text-t-17 font-semibold text-primary-light text-center flex-1">
        Announcements Bar
      </p>

      {/* Dropdowns – always visible */}
      <div className="flex items-center gap-3 justify-end flex-1">
        {/* Currency Dropdown */}
        <div className="relative" ref={currencyRef}>
          <button
            type="button"
            onClick={handleCurrencyToggle}
            aria-haspopup="listbox"
            aria-expanded={currencyOpen}
            aria-label="Select currency"
            className="bg-white flex items-center gap-2 px-2 py-0.5 rounded-md cursor-pointer hover:bg-white/90 transition-colors h-8"
          >
            <MdOutlineAttachMoney className="w-5 h-5 text-primary" />
            <span className="text-t-14 font-semibold text-primary">
              {selectedCurrency}
            </span>
            <FaChevronDown
              className={`w-3.5 h-3.5 text-primary transition-transform ${currencyOpen ? "rotate-180" : ""}`}
            />
          </button>
          <AnimatePresence>
            {currencyOpen && (
              <motion.ul
                role="listbox"
                aria-label="Currency options"
                initial={
                  prefersReducedMotion ? undefined : { opacity: 0, y: -10 }
                }
                animate={{ opacity: 1, y: 0 }}
                exit={prefersReducedMotion ? undefined : { opacity: 0, y: -10 }}
                transition={
                  prefersReducedMotion ? { duration: 0 } : { duration: 0.2 }
                }
                className="absolute top-full mt-1 right-0 bg-white rounded-lg shadow-lg border border-gray-200 py-1 min-w-25 z-50"
              >
                {CURRENCIES.map((currency) => (
                  <li
                    key={currency}
                    role="option"
                    tabIndex={0}
                    aria-selected={selectedCurrency === currency}
                    onClick={() => {
                      setSelectedCurrency(currency);
                      setCurrencyOpen(false);
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        setSelectedCurrency(currency);
                        setCurrencyOpen(false);
                      }
                    }}
                    className={`px-4 py-2 text-t-14 font-semibold cursor-pointer hover:bg-primary-light transition-colors ${
                      selectedCurrency === currency
                        ? "bg-primary text-white hover:bg-primary-hover"
                        : "text-primary-darker"
                    }`}
                  >
                    {currency}
                  </li>
                ))}
              </motion.ul>
            )}
          </AnimatePresence>
        </div>

        {/* Language Dropdown */}
        <div className="relative" ref={languageRef}>
          <button
            type="button"
            onClick={handleLanguageToggle}
            aria-haspopup="listbox"
            aria-expanded={languageOpen}
            aria-label="Select language"
            className="bg-white flex items-center gap-2 px-2 py-0.5 rounded-md cursor-pointer hover:bg-white/90 transition-colors h-8"
          >
            <MdOutlineTranslate className="w-5 h-5 text-primary" />
            <span className="text-t-14 font-semibold text-primary">
              {selectedLanguage}
            </span>
            <FaChevronDown
              className={`w-3.5 h-3.5 text-primary transition-transform ${languageOpen ? "rotate-180" : ""}`}
            />
          </button>
          <AnimatePresence>
            {languageOpen && (
              <motion.ul
                role="listbox"
                aria-label="Language options"
                initial={
                  prefersReducedMotion ? undefined : { opacity: 0, y: -10 }
                }
                animate={{ opacity: 1, y: 0 }}
                exit={prefersReducedMotion ? undefined : { opacity: 0, y: -10 }}
                transition={
                  prefersReducedMotion ? { duration: 0 } : { duration: 0.2 }
                }
                className="absolute top-full mt-1 right-0 bg-white rounded-lg shadow-lg border border-gray-200 py-1 min-w-30 z-50"
              >
                {LANGUAGES.map((lang) => (
                  <li
                    key={lang.value}
                    role="option"
                    tabIndex={0}
                    aria-selected={selectedLanguage === lang.value}
                    onClick={() => {
                      setSelectedLanguage(lang.value);
                      setLanguageOpen(false);
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        setSelectedLanguage(lang.value);
                        setLanguageOpen(false);
                      }
                    }}
                    className={`px-4 py-2 text-t-14 font-semibold cursor-pointer hover:bg-primary-light transition-colors ${
                      selectedLanguage === lang.value
                        ? "bg-primary text-white hover:bg-primary-hover"
                        : "text-primary-darker"
                    }`}
                  >
                    {lang.label}
                  </li>
                ))}
              </motion.ul>
            )}
          </AnimatePresence>
        </div>
      </div>
      </div>
    </div>
  );
}
