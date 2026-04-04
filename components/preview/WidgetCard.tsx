"use client";

import React from "react";

export function WidgetCard({
  label,
  value,
  accent,
  children,
}: {
  label: string;
  value: string;
  accent?: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="min-h-[72px] rounded-lg border border-[#1e2530] bg-[#161b22] p-4">
      <div className="mb-1 text-[11px] text-[#8b949e]">{label}</div>
      <div className="text-[24px] font-semibold leading-none" style={{ color: accent ?? "#e6edf3" }}>
        {value}
      </div>
      {children}
    </div>
  );
}
