interface TabButtonProps {
  label: string;
  isActive: boolean;
  onClick: () => void;
}

export function TabButton({ label, isActive, onClick }: TabButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`text-t-14 transition-colors ${
        isActive
          ? "font-medium text-gray-700"
          : "text-gray-400 hover:text-gray-600"
      }`}
    >
      {label}
    </button>
  );
}
