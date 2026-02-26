interface Props {
  value: number;
}

export default function ProgressBar({ value }: Props) {
  return (
    <div className="w-full h-2 bg-[#EBEDF7] rounded-full overflow-hidden">
      <div
        className="h-full bg-[#334EAC] rounded-full transition-all duration-300"
        style={{ width: `${Math.max(0, Math.min(100, value))}%` }}
      />
    </div>
  );
}