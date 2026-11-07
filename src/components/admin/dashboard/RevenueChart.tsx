"use client";

import { useState, useMemo, useCallback } from "react";
import {
  RevenueActivityIcon,
  RevenueExportIcon,
  RevenueCalendarIcon,
} from "@/components/admin/shared/icons";
import {
  barColorMap,
  revenueMetrics as metrics,
  revenueLegends as legends,
  revenueDatasets,
  type RevenueTimeframe,
} from "@/lib/mock/admin";
import { notifyUnbuilt } from "@/lib/showcase/notify";

/* ── Timeframe tabs ── */
const timeframes: RevenueTimeframe[] = ["Week", "Month", "Year"];

/* ── Tooltip ── */
function BarTooltip({
  label,
  value,
  x,
  y,
}: {
  label: string;
  value: number;
  x: number;
  y: number;
}) {
  return (
    <div
      className="pointer-events-none absolute z-30 flex flex-col items-center gap-0.5 rounded-lg bg-[#212F4D] px-3 py-2 text-white shadow-lg"
      style={{
        left: x,
        top: y,
        transform: "translate(-50%, -100%)",
        marginTop: -8,
      }}
      role="tooltip"
    >
      <span className="text-t-12 font-medium leading-[1.2] opacity-70">
        {label}
      </span>
      <span className="text-t-14-semibold leading-[1.2]">
        {value >= 1000 ? `${(value / 1000).toFixed(0)}K` : `${value}K`}
      </span>
      <div
        className="absolute left-1/2 top-full -translate-x-1/2 border-4 border-transparent border-t-[#212F4D]"
        aria-hidden="true"
      />
    </div>
  );
}

/* ── Component ── */
export default function RevenueChart() {
  const [timeframe, setTimeframe] = useState<RevenueTimeframe>("Month");
  const [hovered, setHovered] = useState<number | null>(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });

  const dataset = useMemo(() => revenueDatasets[timeframe], [timeframe]);
  const maxVal = useMemo(
    () => Math.max(...dataset.values, 1),
    [dataset.values],
  );

  const handleBarHover = useCallback(
    (i: number, e: React.MouseEvent<HTMLDivElement>) => {
      const barEl = e.currentTarget.firstElementChild as HTMLElement | null;
      const rect =
        barEl?.getBoundingClientRect() ??
        e.currentTarget.getBoundingClientRect();
      const parentRect =
        e.currentTarget.closest("[data-chart-area]")?.getBoundingClientRect() ??
        rect;
      setHovered(i);
      setTooltipPos({
        x: rect.left + rect.width / 2 - parentRect.left,
        y: rect.top - parentRect.top,
      });
    },
    [],
  );

  return (
    <div className="bg-white rounded-xl border border-border pt-3 sm:pt-5 px-3 sm:px-5 pb-3 sm:pb-4 flex flex-col gap-3 sm:gap-4">
      {/* Header + Metrics */}
      <div className="flex flex-col gap-3 sm:gap-5">
        {/* Title Row */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
          <div className="flex items-center gap-3 sm:gap-4 flex-1 min-w-0">
            <div className="w-10 h-10 sm:w-16 sm:h-16 rounded-full bg-[#EFF3FB] flex items-center justify-center shrink-0 [&>svg]:w-5 [&>svg]:h-5 sm:[&>svg]:w-auto sm:[&>svg]:h-auto">
              <RevenueActivityIcon />
            </div>
            <div className="flex-1 flex flex-col gap-1 sm:gap-2 min-w-0">
              <h2 className="text-t-17-semibold sm:text-t-21-semibold leading-[1.2] text-[#212F4D]">
                System Revenue Overview
              </h2>
              <p className="text-[12px] sm:text-[14px] leading-[1.2] text-[#989593]">
                Revenue generated from completed orders
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0 flex-wrap">
            {/* Timeframe Toggle */}
            <div className="flex bg-[#F7F6F6] rounded-xl p-[2px]">
              {timeframes.map((tf) => (
                <button
                  key={tf}
                  onClick={() => {
                    setTimeframe(tf);
                    setHovered(null);
                  }}
                  className={`px-3 py-2 text-[12px] font-medium leading-[1.2] rounded-xl transition-colors ${
                    tf === timeframe
                      ? "bg-white text-[#393737] shadow-sm"
                      : "text-[#989593] hover:text-[#393737]"
                  }`}
                  aria-pressed={tf === timeframe}
                >
                  {tf}
                </button>
              ))}
            </div>
            <button
              className="bg-white border border-[#EFEDED] rounded-lg h-10 w-10 sm:h-12 sm:w-12 flex items-center justify-center shrink-0 hover:bg-gray-50 transition-colors"
              aria-label="Export report"
            >
              <RevenueExportIcon />
            </button>
            <div className="bg-white border border-[#EFEDED] rounded-xl h-10 sm:h-12 px-3 sm:px-4 flex items-center gap-2 sm:gap-4 shrink-0">
              <RevenueCalendarIcon />
              <span className="text-[12px] sm:text-[14px] font-medium leading-[1.2] text-[#5B5958] whitespace-nowrap">
                Today &middot; Jun, 01
              </span>
            </div>
          </div>
        </div>

        {/* Metrics Row */}
        <div className="grid grid-cols-2 sm:flex gap-2">
          {metrics.map((m) => (
            <div
              key={m.label}
              className="sm:flex-1 border border-[#EFEDED] rounded-xl px-2 sm:px-3 py-3 sm:py-4 flex flex-col gap-3 sm:gap-6"
            >
              <p className="text-[12px] sm:text-[14px] font-medium leading-[1.2] text-[#989593]">
                {m.label}
              </p>
              <div className="flex items-end justify-between gap-1">
                <span className="text-t-17-semibold sm:text-t-25-semibold leading-[1.2] text-[#393737]">
                  {m.value}
                </span>
                <div className="flex flex-col items-end gap-1 sm:gap-2">
                  <span
                    className={`inline-flex items-center px-1.5 sm:px-2 py-0.5 sm:py-1 rounded text-t-12-semibold leading-[1.2] ${
                      m.positive
                        ? "bg-[#EBF9EE] text-[#12461F]"
                        : "bg-error-light text-error-dark"
                    }`}
                  >
                    {m.change}
                  </span>
                  <span className="text-t-12 leading-[1.2] text-[#393737] whitespace-nowrap">
                    from last week
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bar Chart Area */}
      <div className="relative" data-chart-area>
        <div className="flex flex-col h-[220px] sm:h-[329px] overflow-x-auto">
          <div className="flex-1 flex">
            {/* Y Axis Labels */}
            <div className="flex flex-col justify-between pr-1 py-[6px] shrink-0">
              {dataset.yLabels.map((label) => (
                <span
                  key={`${timeframe}-${label}`}
                  className="text-[12px] leading-[1.2] text-black/70 text-right transition-opacity duration-300"
                >
                  {label}
                </span>
              ))}
            </div>

            {/* Grid + Bars */}
            <div className="flex-1 relative">
              {/* Horizontal grid lines */}
              <div className="absolute inset-0 flex flex-col justify-between py-[6px] pointer-events-none">
                {dataset.yLabels.map((_, i) => (
                  <div
                    key={i}
                    className="w-full border-b border-dashed border-[#EFEDED]"
                  />
                ))}
              </div>

              {/* Bars container */}
              <div className="absolute inset-x-0 top-[6px] bottom-[7px] flex items-end border-b border-black/30">
                {dataset.values.map((val, i) => {
                  const heightPct = (val / maxVal) * 100;
                  const barType = dataset.types[i];
                  const isHovered = hovered === i;
                  return (
                    <div
                      key={`${timeframe}-${i}`}
                      className="flex-1 flex justify-center px-[4px] sm:px-[9px] h-full items-end cursor-pointer outline-none"
                      onMouseEnter={(e) => handleBarHover(i, e)}
                      onMouseLeave={() => setHovered(null)}
                      onFocus={(e) => {
                        const barEl = e.currentTarget
                          .firstElementChild as HTMLElement | null;
                        const rect =
                          barEl?.getBoundingClientRect() ??
                          e.currentTarget.getBoundingClientRect();
                        const parentRect =
                          e.currentTarget
                            .closest("[data-chart-area]")
                            ?.getBoundingClientRect() ?? rect;
                        setHovered(i);
                        setTooltipPos({
                          x: rect.left + rect.width / 2 - parentRect.left,
                          y: rect.top - parentRect.top,
                        });
                      }}
                      onBlur={() => setHovered(null)}
                      tabIndex={0}
                      role="img"
                      aria-label={`${dataset.labels[i]}: ${val}K`}
                    >
                      <div
                        className="w-full rounded-t-lg transition-all duration-300 ease-out"
                        style={{
                          height: `${heightPct}%`,
                          backgroundColor: barColorMap[barType],
                          opacity: hovered !== null && !isHovered ? 0.4 : 1,
                          filter: isHovered ? "brightness(1.15)" : "none",
                        }}
                      />
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* X Axis Labels */}
          <div className="flex pl-[37px] pb-2">
            {dataset.labels.map((label, i) => (
              <div
                key={`${timeframe}-${label}`}
                className={`flex-1 text-center text-[12px] leading-[1.2] pt-3 transition-colors duration-300 ${
                  dataset.types[i] === "current"
                    ? "font-semibold text-[#1F7736]"
                    : "text-black/70"
                }`}
              >
                {label}
              </div>
            ))}
          </div>
        </div>

        {/* Tooltip — rendered outside overflow container */}
        {hovered !== null && (
          <BarTooltip
            label={dataset.labels[hovered]}
            value={dataset.values[hovered]}
            x={tooltipPos.x}
            y={tooltipPos.y}
          />
        )}
      </div>

      {/* Legend + View All */}
      <div className="flex items-center gap-2">
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 sm:gap-x-0 sm:max-w-[400px]">
            {legends.map((legend) => (
              <div
                key={legend.label}
                className="sm:flex-1 flex items-center gap-1.5 sm:gap-2"
              >
                <div
                  className="w-3 h-3 rounded-sm shrink-0"
                  style={{ backgroundColor: legend.color }}
                />
                <span className="text-[12px] font-medium leading-[1.2] text-[#989593]">
                  {legend.label}
                </span>
              </div>
            ))}
          </div>
        </div>
        {/* /admin/reports has no route in this app, so this must not be a
            Link: Next.js would prefetch it and log a 404 on every view. */}
        <button
          type="button"
          onClick={() => notifyUnbuilt("Reports")}
          className="border border-[#EFEDED] rounded-lg p-3 text-[12px] leading-[1.2] text-[#393737] hover:bg-gray-50 transition-colors shrink-0"
        >
          View all
        </button>
      </div>
    </div>
  );
}
