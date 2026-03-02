import Link from "next/link";
import React from "react";

type BaseProps = {
  icon?: React.ReactNode;
  title: string;
  subtitle?: string;
  className?: string;
};

type LinkItemProps = BaseProps & {
  href: string;
  right?: React.ReactNode;
};

type ActionItemProps = BaseProps & {
  onClick: () => void;
  right?: React.ReactNode;
};

export function SettingsLinkItem({
  icon,
  title,
  subtitle,
  href,
  right,
  className,
}: LinkItemProps) {
  return (
    <Link
      href={href}
      className={[
        "group flex items-center gap-4 rounded-2xl border border-[#EFEDED] bg-white px-3 py-4",
        "transition hover:bg-[rgba(52,78,172,0.03)]",
        className ?? "",
      ].join(" ")}
    >
      {icon ? (
        <div className="grid h-[50px] w-[50px] place-items-center rounded-full bg-[#EBEDF7]">
          {icon}
        </div>
      ) : null}

      <div className="min-w-0 flex-1">
        <div className="truncate text-[20px] font-semibold leading-[120%] text-[#121B3C]">
          {title}
        </div>
        {subtitle ? (
          <div className="truncate text-[14px] font-medium leading-[120%] text-[#334EAC]">
            {subtitle}
          </div>
        ) : null}
      </div>

      <div className="shrink-0">{right}</div>
    </Link>
  );
}

export function SettingsActionItem({
  icon,
  title,
  subtitle,
  onClick,
  right,
  className,
}: ActionItemProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "w-full group flex items-center gap-4 rounded-2xl border border-[#EFEDED] bg-white px-3 py-4 text-left",
        "transition hover:bg-[rgba(52,78,172,0.03)]",
        className ?? "",
      ].join(" ")}
    >
      {icon ? (
        <div className="grid h-[50px] w-[50px] place-items-center rounded-full bg-[#EBEDF7]">
          {icon}
        </div>
      ) : null}

      <div className="min-w-0 flex-1">
        <div className="truncate text-[20px] font-semibold leading-[120%] text-[#121B3C]">
          {title}
        </div>
        {subtitle ? (
          <div className="truncate text-[14px] font-medium leading-[120%] text-[#334EAC]">
            {subtitle}
          </div>
        ) : null}
      </div>

      <div className="shrink-0">{right}</div>
    </button>
  );
}