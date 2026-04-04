"use client";

import React from "react";
import { AnimatedWorldMap } from "@/components/map/WorldMap";
import { WidgetCard } from "./WidgetCard";

export function GeoPresenceView({
  userCount,
  offset,
  isDragging,
  geoLabelIdx,
  onPointerDown,
  onPointerMove,
  onPointerUp,
  onPointerCancel,
  onPointerLeave,
  mapHeightClass,
}: {
  userCount: number;
  offset: { x: number; y: number };
  isDragging: boolean;
  geoLabelIdx: number;
  onPointerDown: (event: React.PointerEvent<HTMLDivElement>) => void;
  onPointerMove: (event: React.PointerEvent<HTMLDivElement>) => void;
  onPointerUp: (event: React.PointerEvent<HTMLDivElement>) => void;
  onPointerCancel: (event: React.PointerEvent<HTMLDivElement>) => void;
  onPointerLeave: (event: React.PointerEvent<HTMLDivElement>) => void;
  mapHeightClass: string;
}) {
  return (
    <div className="grid min-h-[420px] grid-cols-1 items-center gap-4 p-3 md:grid-cols-[260px_minmax(0,1fr)] md:gap-4 md:p-4 xl:min-h-[540px] xl:grid-cols-[320px_minmax(0,1fr)] xl:gap-6">
      <div className="grid grid-cols-2 gap-3 self-start pt-1 md:grid-cols-1 md:pt-2">
        <WidgetCard label="Active globally" value={userCount.toLocaleString()} accent="#1bd98a" />
        <WidgetCard label="Active regions" value="12" accent="#a78bfa" />
        <WidgetCard label="Events today" value="3.2m" accent="#facc15" />
        <div className="min-h-[72px] rounded-lg border border-[#1e2530] bg-[#161b22] p-4">
          <div className="mb-2 text-[11px] text-[#8b949e]">Top region</div>
          <div className="text-sm text-[#e6edf3]">India 18%</div>
          <div className="text-sm text-[#c9d1d9]">Germany 12%</div>
          <div className="mt-3 text-[11px] text-[#8b949e]">Peak hour</div>
          <div className="text-sm text-[#e6edf3]">19:00 UTC</div>
        </div>
      </div>

      <div
        className={`relative w-full overflow-hidden ${mapHeightClass}`}
        style={{
          maskImage: "radial-gradient(circle at center, white 55%, transparent 100%)",
          WebkitMaskImage: "radial-gradient(circle at center, white 55%, transparent 100%)",
          cursor: isDragging ? "grabbing" : "grab",
          touchAction: "none",
          userSelect: "none",
        }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerCancel}
        onPointerLeave={onPointerLeave}
      >
        <AnimatedWorldMap
          className="absolute left-1/2 top-1/2 w-[160%] max-w-none opacity-90"
          dotRadius={6}
          strongGlow
          projectionScale={255}
          style={{
            transform: `translate(-50%, -50%) translate(${offset.x}px, ${offset.y}px) scale(1)`,
            transition: isDragging ? "none" : "transform 0.35s ease-out",
          }}
        />

        {[
          { text: "3 users active", x: "24%", y: "33%" },
          { text: "signup spike", x: "61%", y: "48%" },
          { text: "new session", x: "72%", y: "36%" },
        ].map((label, idx) => (
          <div
            key={label.text}
            className="absolute rounded border border-[#1e2530] bg-[#0d1117]/90 px-2 py-1 text-[10px] text-[#c9d1d9] transition-opacity duration-700"
            style={{ left: label.x, top: label.y, opacity: geoLabelIdx === idx ? 0.95 : 0.28 }}
          >
            {label.text}
          </div>
        ))}
      </div>
    </div>
  );
}
