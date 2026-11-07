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
    "flex h-[52px] w-full items-center justify-center rounded-lg px-6 text-t-14-semibold md:text-t-17-semibold transition-all duration-300";

  const primary =
    "bg-primary text-white hover:bg-primary-hover active:scale-[0.99]";

  const outline =
    "border border-primary text-primary bg-white hover:bg-primary-light active:scale-[0.99]";

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
