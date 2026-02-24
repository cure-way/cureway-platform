"use client";

import Image from "next/image";

interface Props {
  title: string;
  subtitle?: string;
  onBack: () => void;
}

export default function UploadHeader({ title, subtitle, onBack }: Props) {
  return (
    <div className="w-full max-w-7xl mx-auto flex flex-col gap-3">
      {/* Row: Title (left) + Back (right) */}
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-3xl sm:text-5xl font-bold text-black leading-[1.2]">
          {title}
        </h1>

        <button
          type="button"
          onClick={onBack}
          className="shrink-0 flex items-center gap-2 font-bold text-base sm:text-xl text-black"
        >
          <Image
            src="/icons/prescriptions/back.png"
            alt="Back"
            width={14}
            height={24}
            className="opacity-60"
          />
          Back
        </button>
      </div>

      {subtitle ? (
        <p className="text-base sm:text-2xl font-semibold text-black/60 leading-[1.2]">
          {subtitle}
        </p>
      ) : null}
    </div>
  );
}