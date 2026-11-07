"use client";

import { useState, useCallback } from "react";
import {
  PlatformActivityIcon,
  OrderFlowHealthIcon,
  DeliveryPerformanceIcon,
  DashArrowRightIcon,
} from "@/components/admin/shared/icons";

/* ── Card Data ── */

interface AnalyticsCard {
  title: string;
  titleColor: string;
  highlightValue: string;
  subtitleText: string;
  changeValue: string;
  changeColor: string;
  changeBorderColor: string;
  positive: boolean;
  icon: React.ComponentType;
  iconBg: string;
  borderColor: string;
  chartColor: string;
  chartData: number[];
}

const cards: AnalyticsCard[] = [
  {
    title: "Platform Activity",
    titleColor: "#212F4D",
    highlightValue: "124",
    subtitleText: " active pharmacies",
    changeValue: "+23%",
    changeColor: "#279543",
    changeBorderColor: "#EFEDED",
    positive: true,
    icon: PlatformActivityIcon,
    iconBg: "#EFF3FB",
    borderColor: "#334EAC",
    chartColor: "#334EAC",
    chartData: [40, 65, 45, 70, 55, 80, 60, 75, 50, 85],
  },
  {
    title: "Order Flow Health",
    titleColor: "#594920",
    highlightValue: "1,284",
    subtitleText: " orders today",
    changeValue: "-41%",
    changeColor: "#D64545",
    changeBorderColor: "#FBECEC",
    positive: false,
    icon: OrderFlowHealthIcon,
    iconBg: "#FFFAEF",
    borderColor: "#FFD15C",
    chartColor: "#D4A843",
    chartData: [20, 35, 50, 30, 60, 45, 75, 40, 55, 70],
  },
  {
    title: "Delivery Performance",
    titleColor: "#121B3C",
    highlightValue: "1,284",
    subtitleText: " orders today",
    changeValue: "+17%",
    changeColor: "#279543",
    changeBorderColor: "#EFEDED",
    positive: true,
    icon: DeliveryPerformanceIcon,
    iconBg: "#EBF9EE",
    borderColor: "#34C759",
    chartColor: "#30A35C",
    chartData: [50, 40, 65, 55, 70, 45, 60, 75, 50, 80],
  },
];

/* ── Sparkline Tooltip ── */
function SparkTooltip({
  value,
  x,
  y,
  color,
}: {
  value: number;
  x: number;
  y: number;
  color: string;
}) {
  return (
    <div
      className="pointer-events-none absolute z-30 rounded-md px-2 py-1 text-white shadow-lg"
      style={{
        left: x,
        top: y,
        transform: "translate(-50%, -100%)",
        marginTop: -10,
        backgroundColor: color,
      }}
      role="tooltip"
    >
      <span className="text-t-12 font-semibold leading-[1.2]">{value}</span>
      <div
        className="absolute left-1/2 top-full -translate-x-1/2 border-4 border-transparent"
        style={{ borderTopColor: color }}
        aria-hidden="true"
      />
    </div>
  );
}

/* ── Sparkline Chart ── */
function SparklineChart({
  data,
  color,
  id,
}: {
  data: number[];
  color: string;
  id: string;
}) {
  const [hovered, setHovered] = useState<number | null>(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });

  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const width = 315;
  const height = 80;
  const padding = 4;

  const pointCoords = data.map((val, i) => ({
    x: (i / (data.length - 1)) * width,
    y: height - padding - ((val - min) / range) * (height - 2 * padding),
    value: val,
  }));

  const pathD = `M ${pointCoords.map((p) => `${p.x},${p.y}`).join(" L ")}`;
  const areaD = `${pathD} L ${width},${height} L 0,${height} Z`;
  const gradientId = `sparkline-grad-${id}`;

  const handlePointHover = useCallback(
    (i: number, e: React.MouseEvent<SVGElement>) => {
      const svg = e.currentTarget.closest("svg");
      const container = svg?.parentElement;
      if (!svg || !container) return;
      const svgRect = svg.getBoundingClientRect();
      const containerRect = container.getBoundingClientRect();
      const scaleX = svgRect.width / width;
      const scaleY = svgRect.height / height;
      setHovered(i);
      setTooltipPos({
        x: svgRect.left + pointCoords[i].x * scaleX - containerRect.left,
        y: svgRect.top + pointCoords[i].y * scaleY - containerRect.top,
      });
    },
    [pointCoords],
  );

  return (
    <div className="relative w-full" data-sparkline-area>
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="w-full h-[80px]"
        preserveAspectRatio="none"
        aria-hidden="true"
        onMouseLeave={() => setHovered(null)}
      >
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity={0.18} />
            <stop offset="100%" stopColor={color} stopOpacity={0.02} />
          </linearGradient>
        </defs>
        <path d={areaD} fill={`url(#${gradientId})`} />
        <path
          d={pathD}
          fill="none"
          stroke={color}
          strokeWidth="2"
          className="transition-all duration-200"
        />
        {/* Invisible wide hit areas for each data point */}
        {pointCoords.map((p, i) => (
          <rect
            key={i}
            x={p.x - width / data.length / 2}
            y={0}
            width={width / data.length}
            height={height}
            fill="transparent"
            onMouseEnter={(e) => handlePointHover(i, e)}
            className="cursor-pointer"
          />
        ))}
        {/* Highlighted point */}
        {hovered !== null && (
          <circle
            cx={pointCoords[hovered].x}
            cy={pointCoords[hovered].y}
            r={4}
            fill="white"
            stroke={color}
            strokeWidth={2}
            className="transition-all duration-150"
          />
        )}
      </svg>
      {/* Tooltip */}
      {hovered !== null && (
        <SparkTooltip
          value={pointCoords[hovered].value}
          x={tooltipPos.x}
          y={tooltipPos.y}
          color={color}
        />
      )}
    </div>
  );
}

export default function AnalyticsMiniCards() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {cards.map((card, idx) => (
        <div
          key={card.title}
          className="bg-white rounded-[16px] border border-[#EFEDED] flex flex-col gap-[4px] pt-[16px] pb-[12px] px-[20px]"
        >
          {/* Top Content */}
          <div className="flex flex-col gap-[12px] w-full">
            {/* Header Row */}
            <div className="flex gap-[16px] items-center w-full">
              {/* Icon Circle */}
              <div
                className="w-[64px] h-[64px] rounded-full flex items-center justify-center shrink-0 overflow-hidden"
                style={{ backgroundColor: card.iconBg }}
              >
                <card.icon />
              </div>

              {/* Title + Subtitle */}
              <div className="flex-1 min-w-0 flex flex-col gap-[12px]">
                <p
                  className="text-t-17 font-semibold leading-[1.2]"
                  style={{ color: card.titleColor }}
                >
                  {card.title}
                </p>
                <div
                  className="border-l-2 pl-[12px]"
                  style={{ borderColor: card.borderColor }}
                >
                  <p className="text-[14px] leading-[1.2]">
                    <span className="font-medium text-[#5B5958]">
                      {card.highlightValue}
                    </span>
                    <span className="font-medium text-[#989593]">
                      {card.subtitleText}
                    </span>
                  </p>
                </div>
              </div>

              {/* Arrow Right */}
              <div className="shrink-0">
                <DashArrowRightIcon color="#989593" />
              </div>
            </div>

            {/* Change Badge */}
            <div className="flex items-center">
              <div
                className="border rounded-[8px] px-[12px] py-[12px]"
                style={{ borderColor: card.changeBorderColor }}
              >
                <p className="text-[12px] leading-[1.2]">
                  <span
                    className="font-medium"
                    style={{ color: card.changeColor }}
                  >
                    {card.changeValue}
                  </span>
                  <span className="text-[#393737]">{"  from last month"}</span>
                </p>
              </div>
            </div>
          </div>

          {/* Sparkline Chart */}
          <div className="w-full">
            <SparklineChart
              data={card.chartData}
              color={card.chartColor}
              id={String(idx)}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
