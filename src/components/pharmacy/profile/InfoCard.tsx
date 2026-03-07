import { ReactNode } from "react";

interface Props {
  icon: ReactNode;
  children: ReactNode;
}

export default function InfoCard({ icon, children }: Props) {
  return (
    <div className="flex items-start gap-3 bg-white px-4 py-4 border border-[#E2E8F0] rounded-lg">
      <div className="mt-1 text-[#64748B]">{icon}</div>

      <div className="text-[#0F172A] text-sm">{children}</div>
    </div>
  );
}
