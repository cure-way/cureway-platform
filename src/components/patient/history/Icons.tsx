import React from "react";

export function IconCopy(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" {...props}>
      <path
        d="M9 9h10v10H9V9Z"
        stroke="#9CA3AF"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path
        d="M5 15H4a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v1"
        stroke="#9CA3AF"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function IconBack(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg width="14" height="24" viewBox="0 0 14 24" fill="none" {...props}>
      <path
        d="M12 2L2 12l10 10"
        stroke="#1E2B57"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function IconPin(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" {...props}>
      <path
        d="M12 21s7-4.5 7-11a7 7 0 1 0-14 0c0 6.5 7 11 7 11Z"
        stroke="#334EAC"
        strokeWidth="2"
      />
      <path
        d="M12 11.5a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z"
        stroke="#334EAC"
        strokeWidth="2"
      />
    </svg>
  );
}