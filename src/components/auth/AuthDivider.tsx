export interface AuthDividerProps {
  text?: string;
}

export function AuthDivider({ text = "or" }: AuthDividerProps) {
  return (
    <div className="flex items-center gap-4 w-full">
      <div className="flex-1 h-px bg-gray-300" />
      <span className="text-t-14 text-gray-500 uppercase">{text}</span>
      <div className="flex-1 h-px bg-gray-300" />
    </div>
  );
}
