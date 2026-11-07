import type { OrderStatus } from "@/types/order";

type Props = { status: OrderStatus };

function cx(...classes: Array<string | false | undefined | null>) {
  return classes.filter(Boolean).join(" ");
}

export function OrderStatusBadge({ status }: Props) {
  const map: Record<
    OrderStatus,
    { label: string; wrap: string; text: string }
  > = {
    processing: {
      label: "Processing",
      wrap: "bg-[#EBEDF7] border border-black/10",
      text: "text-[#334EAC]",
    },
    on_the_way: {
      label: "On the way",
      wrap: "bg-[#FFF8E6] border border-[#CCBA8A]",
      text: "text-black/60",
    },
    delivered: {
      label: "Delivered",
      wrap: "bg-[#DCFFDF] border border-[#2A9F47]",
      text: "text-[#34C759]",
    },
    cancelled: {
      label: "Cancelled",
      wrap: "bg-[#F9E3E3] border border-[#AB3737]",
      text: "text-[#D64545]",
    },
  };

  const s = map[status];

  return (
    <div
      className={cx(
        "inline-flex h-9 items-center justify-center rounded-lg px-4",
        "border-[0.5px]",
        "font-[var(--font-montserrat)]",
        s.wrap,
      )}
    >
      <span className={cx("text-sm font-medium leading-[120%]", s.text)}>
        {s.label}
      </span>
    </div>
  );
}
