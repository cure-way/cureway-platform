interface Props {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: "primary" | "outline";
  fullWidth?: boolean;
}

export default function PrimaryButton({
  children,
  onClick,
  variant = "primary",
  fullWidth = true,
}: Props) {
  const base =
    "rounded-2xl px-6 py-4 font-semibold text-base sm:text-lg transition-all duration-300";

  const primary =
    "bg-[#334EAC] text-white hover:opacity-90 active:scale-[0.99]";

  const outline =
    "border border-[#334EAC] text-[#334EAC] bg-white hover:bg-[#f5f7ff] active:scale-[0.99]";

  return (
    <button
      type="button"
      onClick={onClick}
      className={`${base} ${variant === "primary" ? primary : outline} ${
        fullWidth ? "w-full" : ""
      }`}
    >
      {children}
    </button>
  );
}