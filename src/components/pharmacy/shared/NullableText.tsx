interface NullableTextProps {
  value: unknown;
  className?: string;
}

export default function NullableText({
  value,
  className = "",
}: NullableTextProps) {
  if (value === null || value === undefined || value === "") {
    return <span className={`text-gray-400 text-sm ${className}`}>—</span>;
  }

  return <>{String(value)}</>;
}
