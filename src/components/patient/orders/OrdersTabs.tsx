export type OrdersTabKey = "all" | "active" | "delivered" | "cancelled";

type Tab = {
  key: OrdersTabKey;
  label: string;
  count: number;
};

type Props = {
  activeTab: OrdersTabKey;
  tabs: Tab[];
  onChange: (key: OrdersTabKey) => void;
};

function cx(...classes: Array<string | false | undefined | null>) {
  return classes.filter(Boolean).join(" ");
}

export function OrdersTabs({ activeTab, tabs, onChange }: Props) {
  return (
    <div
      className={cx(
        "w-full rounded-xl bg-white p-2",
        "flex items-center gap-6",
        "font-[var(--font-montserrat)]",
      )}
    >
      {tabs.map((t) => {
        const selected = t.key === activeTab;
        const isAll = t.key === "all";

        return (
          <button
            key={t.key}
            type="button"
            onClick={() => onChange(t.key)}
            className={cx(
              "h-16 rounded-lg px-4",
              "whitespace-nowrap",
              "text-t-17 font-semibold leading-[120%]",
              "transition-all duration-300 ease-in-out",
              selected
                ? "bg-[#263B81] text-white"
                : "bg-white text-[#263B81] hover:bg-[#263B81]/10",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#263B81]/40",
            )}
          >
            <span className="inline-flex items-center gap-2">
              {isAll && (
                <span
                  className={cx(
                    "inline-block h-2 w-2 rounded-full",
                    selected ? "bg-white" : "bg-[#263B81]",
                  )}
                />
              )}

              <span>
                {t.label} ({t.count})
              </span>
            </span>
          </button>
        );
      })}
    </div>
  );
}
