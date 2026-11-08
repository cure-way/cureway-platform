"use client";

import { FaBars, FaBell } from "react-icons/fa";
import { useRouter } from "next/navigation";
import PharmacyMenu from "./PharmacyMenu";
import GlobalSearchPanel from "./GlobalSearchModal";
import { useGlobalSearch } from "@/hooks/pharmacy/useGlobalSearch";
import { FRAME } from "@/components/shared";

interface TopBarProps {
  onMenuClick: () => void;
}

export default function TopBar({ onMenuClick }: TopBarProps) {
  const router = useRouter();

  const { search, setSearch, debouncedSearch, isOpen, setIsOpen, searchRef } =
    useGlobalSearch();

  return (
    <header className="bg-white border-b">
      <div
        data-topbar-inner=""
        className={`${FRAME} flex items-center gap-4 h-20`}
      >
        {/* Menu button (mobile only) */}
        <button
          onClick={onMenuClick}
          className="lg:hidden hover:bg-gray-100 p-2 border rounded-lg text-(--color-primary)"
        >
          <FaBars />
        </button>

        {/* Search (desktop) */}
        <div
          ref={searchRef}
          className="hidden md:block relative w-full max-w-md"
        >
          <input
            type="text"
            value={search}
            onFocus={() => setIsOpen(true)}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="What do you want to find?"
            className="px-4 py-2 border border-gray-200 focus:border-(--color-primary-active) rounded-full focus:outline-none w-full text-t-14"
          />

          <div className="top-full right-0 left-0 z-50 absolute mt-2">
            {isOpen && debouncedSearch && (
              <GlobalSearchPanel
                search={debouncedSearch}
                onItemClick={() => setIsOpen(false)}
              />
            )}
          </div>
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-4 ml-auto">
          <button
            onClick={() => router.push("/pharmacy/notifications")}
            className="flex justify-center items-center hover:bg-gray-100 border rounded-full w-9 h-9 text-(--color-primary)"
          >
            <FaBell />
          </button>
          <PharmacyMenu />
        </div>
      </div>

      {/* Search (mobile only) */}
      <div className="md:hidden relative mt-4 w-full">
        <input
          type="text"
          value={search}
          onFocus={() => setIsOpen(true)}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="What do you want to find?"
          className="px-4 py-2 border border-gray-200 focus:border-(--color-primary-active) rounded-full focus:outline-none w-full text-t-14"
        />

        <div className="top-full right-0 left-0 z-50 absolute mt-2">
          {isOpen && debouncedSearch && (
            <GlobalSearchPanel
              search={debouncedSearch}
              onItemClick={() => setIsOpen(false)}
            />
          )}
        </div>
      </div>
    </header>
  );
}
