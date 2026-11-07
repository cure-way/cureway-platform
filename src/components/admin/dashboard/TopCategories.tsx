"use client";

import { useState, useMemo, useCallback } from "react";
import {
  TopCategoryIcon,
  CalendarSmallIcon,
} from "@/components/admin/shared/icons";
import { dashboardCategories as categories } from "@/lib/mock/admin";

/* ── Segment Tooltip ── */
function SegmentTooltip({
  label,
  sales,
  color,
  x,
  y,
}: {
  label: string;
  sales: number;
  color: string;
  x: number;
  y: number;
}) {
  return (
    <div
      className="pointer-events-none absolute z-30 flex items-center gap-2 rounded-lg bg-[#212F4D] px-3 py-2 text-white shadow-lg"
      style={{
        left: x,
        top: y,
        transform: "translate(-50%, -100%)",
        marginTop: -8,
      }}
      role="tooltip"
    >
      <div
        className="w-2.5 h-2.5 rounded-sm shrink-0"
        style={{ backgroundColor: color }}
      />
      <span className="text-t-12 font-medium leading-[1.2] opacity-70">
        {label}
      </span>
      <span className="text-t-14 font-semibold leading-[1.2]">{sales}</span>
      <div
        className="absolute left-1/2 top-full -translate-x-1/2 border-4 border-transparent border-t-[#212F4D]"
        aria-hidden="true"
      />
    </div>
  );
}

/* ── Donut Chart ── */

function DonutChart({
  hovered,
  onSegmentHover,
  onSegmentLeave,
  hiddenSegments,
}: {
  hovered: number | null;
  onSegmentHover: (i: number, e: React.MouseEvent<SVGCircleElement>) => void;
  onSegmentLeave: () => void;
  hiddenSegments: Set<string>;
}) {
  const size = 156;
  const center = size / 2;
  const radius = 56;
  const strokeWidth = 28;
  const circumference = 2 * Math.PI * radius;

  const segments = useMemo(() => {
    const visible = categories.filter((c) => !hiddenSegments.has(c.label));
    const total = visible.reduce((sum, c) => sum + c.sales, 0);
    return categories.map((cat, i) => {
      const isHidden = hiddenSegments.has(cat.label);
      if (isHidden)
        return {
          ...cat,
          isHidden: true as const,
          dashLength: 0,
          dashOffset: 0,
        };
      const preceding = categories
        .slice(0, i)
        .filter((c) => !hiddenSegments.has(c.label))
        .reduce((sum, c) => sum + c.sales, 0);
      const dashLength = (cat.sales / total) * circumference;
      const dashOffset =
        circumference * 0.25 - (preceding / total) * circumference;
      return { ...cat, isHidden: false as const, dashLength, dashOffset };
    });
  }, [hiddenSegments, circumference]);

  return (
    <div className="relative shrink-0" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {segments.map((seg, i) => {
          if (seg.isHidden) return null;
          const isHovered = hovered === i;

          return (
            <circle
              key={seg.label}
              cx={center}
              cy={center}
              r={radius}
              fill="none"
              stroke={seg.fillColor}
              strokeWidth={strokeWidth}
              strokeDasharray={`${seg.dashLength} ${circumference - seg.dashLength}`}
              strokeDashoffset={seg.dashOffset}
              className="cursor-pointer"
              style={{
                transition:
                  "stroke-dasharray 0.5s ease, stroke-dashoffset 0.5s ease, opacity 0.3s ease, filter 0.3s ease",
                opacity: hovered !== null && !isHovered ? 0.4 : 1,
                filter: isHovered ? "brightness(1.15)" : "none",
              }}
              onMouseEnter={(e) => onSegmentHover(i, e)}
              onMouseLeave={onSegmentLeave}
            />
          );
        })}
      </svg>
    </div>
  );
}

/* ── Component ── */

export default function TopCategories() {
  const [hovered, setHovered] = useState<number | null>(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });
  const [hiddenSegments, setHiddenSegments] = useState<Set<string>>(new Set());

  const handleSegmentHover = useCallback(
    (i: number, e: React.MouseEvent<SVGCircleElement>) => {
      const svg = e.currentTarget.closest("svg");
      const container = svg?.parentElement?.closest("[data-chart-area]");
      if (!svg || !container) return;
      const svgRect = svg.getBoundingClientRect();
      const containerRect = container.getBoundingClientRect();
      setHovered(i);
      setTooltipPos({
        x: svgRect.left + svgRect.width / 2 - containerRect.left,
        y: svgRect.top - containerRect.top,
      });
    },
    [],
  );

  const toggleCategory = useCallback((label: string) => {
    setHiddenSegments((prev) => {
      const next = new Set(prev);
      if (next.has(label)) next.delete(label);
      else next.add(label);
      return next;
    });
  }, []);

  return (
    <div className="bg-white rounded-2xl border border-[#EFEDED] px-5 py-4 flex flex-col gap-8">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-4">
          <TopCategoryIcon />
          <h2 className="flex-1 text-t-17 font-semibold leading-[1.2] text-[#212F4D]">
            Top Categories
          </h2>
          <div className="bg-white border border-[#EFEDED] rounded-lg h-full px-4 py-3 flex items-center gap-4 shrink-0">
            <CalendarSmallIcon />
            <span className="text-[12px] font-medium leading-[1.2] text-[#5B5958] whitespace-nowrap">
              Weekly
            </span>
          </div>
        </div>
        <p className="text-[12px] leading-[1.2] text-[#989593]">
          Highest performing category based on total sales
        </p>
      </div>

      {/* Content: Category List + Donut */}
      <div className="flex items-center gap-2 relative" data-chart-area>
        {/* Category List (clickable legend) */}
        <div className="flex-1 flex flex-col gap-5">
          {categories.map((cat) => {
            const isHidden = hiddenSegments.has(cat.label);
            return (
              <button
                key={cat.label}
                onClick={() => toggleCategory(cat.label)}
                className="flex flex-col gap-3 text-left cursor-pointer group"
                aria-label={`${isHidden ? "Show" : "Hide"} ${cat.label}`}
              >
                <div
                  className="border-l-2 pl-2 pr-3 transition-opacity duration-300"
                  style={{
                    borderColor: cat.borderColor,
                    opacity: isHidden ? 0.35 : 1,
                  }}
                >
                  <span
                    className={`text-[12px] font-medium leading-[1.2] transition-all duration-300 ${
                      isHidden ? "line-through text-[#C5C3C1]" : ""
                    }`}
                    style={{ color: isHidden ? undefined : cat.labelColor }}
                  >
                    {cat.label}
                  </span>
                </div>
                <p
                  className={`text-[12px] font-medium leading-[1.2] transition-opacity duration-300 ${
                    isHidden ? "opacity-35" : ""
                  }`}
                >
                  <span
                    className={`text-t-17 ${isHidden ? "text-[#C5C3C1]" : "text-[#393737]"}`}
                  >
                    {cat.sales}
                  </span>
                  <span
                    className={isHidden ? "text-[#C5C3C1]" : "text-[#989593]"}
                  >
                    {" sales"}
                  </span>
                </p>
              </button>
            );
          })}
        </div>

        {/* Donut Chart */}
        <DonutChart
          hovered={hovered}
          onSegmentHover={handleSegmentHover}
          onSegmentLeave={() => setHovered(null)}
          hiddenSegments={hiddenSegments}
        />

        {/* Segment Tooltip */}
        {hovered !== null && !hiddenSegments.has(categories[hovered].label) && (
          <SegmentTooltip
            label={categories[hovered].label}
            sales={categories[hovered].sales}
            color={categories[hovered].fillColor}
            x={tooltipPos.x}
            y={tooltipPos.y}
          />
        )}
      </div>
    </div>
  );
}
