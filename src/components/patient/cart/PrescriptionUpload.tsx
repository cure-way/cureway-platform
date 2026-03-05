"use client";
import Image from "next/image";

interface Props {
  onUpload?: () => void;
  highlighted?: boolean;
}

export default function PrescriptionUpload({
  onUpload,
  highlighted = false,
}: Props) {
  return (
    <div
      onClick={onUpload}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") onUpload?.();
      }}
      className={[
        "flex items-center gap-5 bg-warning-light rounded-2xl p-5 mb-3 outline-none transition-all",
        onUpload ? "cursor-pointer" : "cursor-default",
        highlighted
          ? "border-2 border-error animate-pulse"
          : "border-2 border-transparent",
      ].join(" ")}
    >
      <Image src="/icons/upload.svg" alt="Upload" width={24} height={24} />

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5 flex-wrap mb-2">
          <span
            className={`text-t-21-semibold font-[var(--font-montserrat)] ${
              highlighted ? "text-error" : "text-warning-darker"
            }`}
          >
            Upload Prescription
          </span>
          <span
            className={`text-t-17 font-[var(--font-montserrat)] ${
              highlighted ? "text-error" : "text-warning"
            }`}
          >
            (required)
          </span>
        </div>

        <p
          className={`text-t-17 font-[var(--font-montserrat)] ${
            highlighted ? "text-error" : "text-muted-foreground"
          }`}
        >
          {highlighted
            ? "Please upload your prescription to continue to checkout"
            : "You can't go for checkout without uploading the prescription"}
        </p>
      </div>

      {onUpload && (
        <svg
          width="20"
          height="20"
          viewBox="0 0 20 20"
          fill="none"
          stroke={highlighted ? "hsl(var(--error))" : "hsl(var(--neutral))"}
          strokeWidth="1.5"
          strokeLinecap="round"
          className="flex-shrink-0"
        >
          <path d="M7.5 5l5 5-5 5" />
        </svg>
      )}
    </div>
  );
}
