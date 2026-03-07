import { ReactNode } from "react";

interface Props {
  icon: ReactNode;
  title: string;
  value: ReactNode;
}

export default function ActivityCard({ icon, title, value }: Props) {
  return (
    <div className="flex items-start gap-3 bg-white px-4 py-4 border border-[#E2E8F0] rounded-lg">
      <div className="mt-1 text-[#64748B]">{icon}</div>

      <div>
        <p className="font-medium text-[#0F172A]">{title}</p>

        <div className="text-gray-500 text-sm">{value}</div>
      </div>
    </div>
  );
}
