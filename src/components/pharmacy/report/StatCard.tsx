interface StatCardProps {
  title: string;
  value: string;
  subtitle?: string;
}

export function StatCard({ title, value, subtitle }: StatCardProps) {
  return (
    <div className="bg-white p-4 border rounded-xl">
      <p className="mb-6 text-gray-500 text-t-14">{title}</p>
      <p className="mt-1 font-semibold text-t-21 text-(--color-primary)">
        {value}
      </p>
      {subtitle && <p className="mt-1 text-gray-400 text-t-12">{subtitle}</p>}
    </div>
  );
}
