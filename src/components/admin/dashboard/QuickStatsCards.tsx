import {
  StatsPharmacyIcon,
  StatsOrdersIcon,
  StatsDeliveriesIcon,
  DashArrowRightIcon,
} from "@/components/admin/shared/icons";

/* ── Card Data ── */

interface StatCard {
  label: string;
  labelColor: string;
  subtitle: string;
  icon: React.ComponentType;
}

const stats: StatCard[] = [
  {
    label: "Pharmacies",
    labelColor: "#212F4D",
    subtitle: "5 pharmacies need attention",
    icon: StatsPharmacyIcon,
  },
  {
    label: "Orders",
    labelColor: "#594920",
    subtitle: "5 order need attention",
    icon: StatsOrdersIcon,
  },
  {
    label: "Deliveries",
    labelColor: "#12461F",
    subtitle: "3 deliveries delayed",
    icon: StatsDeliveriesIcon,
  },
];

export default function QuickStatsCards() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="flex items-center gap-[16px] bg-white rounded-[12px] border border-[#EFEDED] px-[20px] py-[16px]"
        >
          {/* Icon */}
          <div className="w-[48px] h-[48px] rounded-full flex items-center justify-center shrink-0 overflow-hidden">
            <stat.icon />
          </div>

          {/* Text */}
          <div className="flex-1 min-w-0 flex flex-col gap-[8px] justify-center">
            <p
              className="text-t-17 font-semibold leading-[1.2]"
              style={{ color: stat.labelColor }}
            >
              {stat.label}
            </p>
            <p className="text-[14px] font-normal leading-[1.2] text-[#989593]">
              {stat.subtitle}
            </p>
          </div>

          {/* Arrow */}
          <div className="shrink-0">
            <DashArrowRightIcon />
          </div>
        </div>
      ))}
    </div>
  );
}
