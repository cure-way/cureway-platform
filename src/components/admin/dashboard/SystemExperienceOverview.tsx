"use client";

import { useState, useMemo, useCallback } from "react";
import { TableEyeIcon } from "@/components/admin/shared/icons";
import {
  experienceTabs as tabs,
  experienceDatasets,
  type ExperienceSegment,
} from "@/lib/mock/admin";

/* ── Ring Tooltip ── */
function RingTooltip({
  segment,
  x,
  y,
}: {
  segment: ExperienceSegment;
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
        style={{ backgroundColor: segment.color }}
      />
      <span className="text-t-12 font-medium leading-[1.2] opacity-70">
        {segment.label}
      </span>
      <span className="text-t-14 font-semibold leading-[1.2]">
        {segment.value}%
      </span>
      <div
        className="absolute left-1/2 top-full -translate-x-1/2 border-4 border-transparent border-t-[#212F4D]"
        aria-hidden="true"
      />
    </div>
  );
}

/* ── Concentric Ring Donut Chart ── */

function ConcentricDonut({
  segments,
  centerPct,
  hoveredRing,
  onRingHover,
  onRingLeave,
  hiddenSegments,
}: {
  segments: ExperienceSegment[];
  centerPct: string;
  hoveredRing: number | null;
  onRingHover: (i: number, e: React.MouseEvent<SVGCircleElement>) => void;
  onRingLeave: () => void;
  hiddenSegments: Set<string>;
}) {
  const size = 150;
  const center = size / 2;
  const strokeWidth = 10;
  const gap = 4;

  const rings = segments.map((seg, i) => {
    const radius = center - strokeWidth / 2 - i * (strokeWidth + gap);
    const circumference = 2 * Math.PI * radius;
    const isHidden = hiddenSegments.has(seg.label);
    const filled = isHidden ? 0 : (seg.value / 100) * circumference;
    return { ...seg, radius, circumference, filled, isHidden };
  });

  return (
    <div className="relative shrink-0" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {rings.map((ring, i) => (
          <g key={ring.label}>
            {/* Track */}
            <circle
              cx={center}
              cy={center}
              r={ring.radius}
              fill="none"
              stroke={ring.trackColor}
              strokeWidth={strokeWidth}
              className="transition-opacity duration-300"
              style={{
                opacity: hoveredRing !== null && hoveredRing !== i ? 0.35 : 1,
              }}
            />
            {/* Filled arc */}
            <circle
              cx={center}
              cy={center}
              r={ring.radius}
              fill="none"
              stroke={ring.strokeColor}
              strokeWidth={strokeWidth}
              strokeDasharray={`${ring.filled} ${ring.circumference - ring.filled}`}
              strokeDashoffset={ring.circumference * 0.25}
              strokeLinecap="round"
              style={{
                transform: "rotate(-90deg)",
                transformOrigin: "center",
                transition: "stroke-dasharray 0.5s ease, opacity 0.3s ease",
                opacity: ring.isHidden
                  ? 0
                  : hoveredRing !== null && hoveredRing !== i
                    ? 0.35
                    : 1,
                filter: hoveredRing === i ? "brightness(1.15)" : "none",
              }}
              className="cursor-pointer"
              onMouseEnter={(e) => onRingHover(i, e)}
              onMouseLeave={onRingLeave}
            />
          </g>
        ))}
      </svg>
      {/* Center label */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-t-17 font-semibold leading-[1.2] text-[#212F4D] transition-all duration-300">
          {centerPct}
        </span>
        <span className="text-t-12 sm:text-t-10 leading-[1.2] text-[#989593] text-center">
          rate
        </span>
      </div>
    </div>
  );
}

/* ── Component ── */

export default function SystemExperienceOverview() {
  const [activeTab, setActiveTab] = useState<(typeof tabs)[number]>("Week");
  const [hoveredRing, setHoveredRing] = useState<number | null>(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });
  const [hiddenSegments, setHiddenSegments] = useState<Set<string>>(new Set());

  const dataset = useMemo(() => experienceDatasets[activeTab], [activeTab]);

  const handleRingHover = useCallback(
    (i: number, e: React.MouseEvent<SVGCircleElement>) => {
      const svg = e.currentTarget.closest("svg");
      const container = svg?.parentElement?.parentElement;
      if (!svg || !container) return;
      const svgRect = svg.getBoundingClientRect();
      const containerRect = container.getBoundingClientRect();
      setHoveredRing(i);
      setTooltipPos({
        x: svgRect.left + svgRect.width / 2 - containerRect.left,
        y: svgRect.top - containerRect.top,
      });
    },
    [],
  );

  const toggleSegment = useCallback((label: string) => {
    setHiddenSegments((prev) => {
      const next = new Set(prev);
      if (next.has(label)) next.delete(label);
      else next.add(label);
      return next;
    });
  }, []);

  return (
    <div className="bg-white rounded-2xl border border-[#EFEDED] px-5 py-4 flex flex-col gap-6">
      {/* Header + Tabs */}
      <div className="flex flex-col gap-4">
        {/* Title */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-4">
            <TableEyeIcon />
            <h2 className="text-t-17 font-semibold leading-[1.2] text-[#212F4D]">
              System Experience Overview
            </h2>
          </div>
          <p className="text-[12px] leading-[1.2] text-[#989593]">
            End-to-end service performance by role.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex bg-[#F7F6F6] rounded-2xl p-[2px]">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => {
                setActiveTab(tab);
                setHoveredRing(null);
              }}
              className={`flex-1 p-3 text-[12px] leading-[1.2] text-center rounded-2xl transition-colors ${
                tab === activeTab
                  ? "bg-white font-medium text-[#393737] shadow-sm"
                  : "text-[#989593] hover:text-[#393737]"
              }`}
              aria-pressed={tab === activeTab}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Content: Legend + Donut */}
      <div className="flex items-end gap-8 relative" data-chart-area>
        {/* Left: Stats + Legend */}
        <div className="flex-1 flex flex-col justify-between self-stretch">
          {/* Value */}
          <div className="flex flex-col leading-[1.2]">
            <p className="text-[12px] font-medium text-[#989593] mb-0">
              {dataset.totalLabel}
            </p>
            <p className="text-t-17 font-medium text-[#393737] transition-all duration-300">
              {dataset.totalValue}
            </p>
          </div>

          {/* Legend (clickable to toggle) */}
          <div className="flex flex-col gap-2">
            {dataset.segments.map((seg) => {
              const isHidden = hiddenSegments.has(seg.label);
              return (
                <button
                  key={seg.label}
                  onClick={() => toggleSegment(seg.label)}
                  className="flex items-center gap-2 group cursor-pointer"
                  aria-label={`${isHidden ? "Show" : "Hide"} ${seg.label}`}
                >
                  <div
                    className="w-3 h-3 rounded-sm shrink-0 transition-opacity duration-300"
                    style={{
                      backgroundColor: seg.color,
                      opacity: isHidden ? 0.3 : 1,
                    }}
                  />
                  <span
                    className={`text-[12px] font-medium leading-[1.2] transition-all duration-300 ${
                      isHidden
                        ? "text-[#C5C3C1] line-through"
                        : "text-[#989593] group-hover:text-[#5B5958]"
                    }`}
                  >
                    {seg.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right: Donut Chart */}
        <ConcentricDonut
          segments={dataset.segments}
          centerPct={dataset.centerPct}
          hoveredRing={hoveredRing}
          onRingHover={handleRingHover}
          onRingLeave={() => setHoveredRing(null)}
          hiddenSegments={hiddenSegments}
        />

        {/* Ring Tooltip */}
        {hoveredRing !== null && (
          <RingTooltip
            segment={dataset.segments[hoveredRing]}
            x={tooltipPos.x}
            y={tooltipPos.y}
          />
        )}
      </div>
    </div>
  );
}
