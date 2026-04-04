"use client";

import { motion } from "framer-motion";
import { WidgetCard } from "./WidgetCard";
import type { LiveEventItem } from "./types";

export function LiveActivityView({
  userCount,
  eventsPerMinute,
  avgSessionText,
  desktopPct,
  mobilePct,
  tabletPct,
  visibleEvents,
  newestEventId,
  formatEventTime,
  tick,
}: {
  userCount: number;
  eventsPerMinute: number;
  avgSessionText: string;
  desktopPct: number;
  mobilePct: number;
  tabletPct: number;
  visibleEvents: LiveEventItem[];
  newestEventId: number | null;
  formatEventTime: (ts: number, tick: number) => string;
  tick: number;
}) {
  return (
    <div className="grid min-h-[420px] grid-cols-1 items-center gap-4 p-3 md:grid-cols-[260px_minmax(0,1fr)] md:gap-4 md:p-4 xl:min-h-[540px] xl:grid-cols-[320px_minmax(0,1fr)] xl:gap-6">
      <div className="grid grid-cols-2 gap-3 md:grid-cols-1">
        <WidgetCard label="Active Users" value={userCount.toLocaleString()} accent="#1bd98a" />
        <WidgetCard label="Events / Min" value={`${eventsPerMinute}`}>
          <div className="mt-2 text-[11px] text-[#8b949e]">Steady live throughput</div>
        </WidgetCard>
        <WidgetCard label="Avg Session" value={avgSessionText}>
          <div className="mt-2 flex items-center gap-2 text-[11px] text-[#8b949e]">
            <span className="h-2 w-2 animate-[previewPulse_1.8s_ease-in-out_infinite] rounded-full bg-[#1bd98a]" />
            Pulse stable
          </div>
        </WidgetCard>
        <div className="min-h-[72px] rounded-lg border border-[#1e2530] bg-[#161b22] p-4">
          <div className="mb-2 text-[11px] text-[#8b949e]">Device split</div>
          {[
            { label: "Desktop", value: desktopPct },
            { label: "Mobile", value: mobilePct },
            { label: "Tablet", value: tabletPct },
          ].map((row) => (
            <div key={row.label} className="mb-1.5">
              <div className="mb-1 flex justify-between text-[10px] text-[#8b949e]">
                <span>{row.label}</span>
                <span>{row.value}%</span>
              </div>
              <div className="h-1.5 rounded bg-[#0d1117]">
                <div className="h-full rounded bg-[#1bd98a]/70 transition-all duration-500" style={{ width: `${row.value}%` }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="relative h-full min-h-[280px] rounded-lg border border-[#1e2530] bg-[#161b22] p-4 md:min-h-[420px] xl:min-h-[500px]">
        <div className="mb-3 flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm font-medium text-[#e6edf3]">
            Live Event Feed
            <span className="h-2 w-2 animate-[previewPulse_1.6s_ease-in-out_infinite] rounded-full bg-[#1bd98a]" />
          </div>
          <div className="text-[11px] text-[#8b949e]">Receiving events...</div>
        </div>
        <div className="relative h-[220px] overflow-hidden md:h-[320px] xl:h-[430px]">
          <motion.div
            key={visibleEvents[0]?.id ?? "feed"}
            initial={{ y: 10, opacity: 0.92 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.32, ease: "easeOut" }}
            className="flex flex-col gap-2"
          >
            {visibleEvents.map((event) => (
              <div
                key={event.id}
                className={`flex items-center gap-2.5 rounded-[7px] border border-[#1e2530] bg-[#0d1117]/55 px-3 py-2 ${
                  newestEventId === event.id ? "animate-[eventSlideIn_350ms_ease]" : ""
                }`}
              >
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-xs font-mono" style={{ background: event.bg, color: event.c }}>
                  {event.i}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="truncate text-xs font-medium text-[#e6edf3]">{event.t}</div>
                  <div className="truncate text-[11px] text-[#8b949e]">{event.u}</div>
                </div>
                <div className="text-[11px] text-[#8b949e]">{formatEventTime(event.ts, tick)}</div>
              </div>
            ))}
          </motion.div>
          <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-[#161b22] to-transparent" />
        </div>
      </div>
    </div>
  );
}
