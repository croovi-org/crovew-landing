"use client";

import { WidgetCard } from "./WidgetCard";

const RETENTION_MATRIX = [
  [82, 68, 54, 44, 36],
  [78, 64, 52, 42, 34],
  [86, 71, 58, 47, 39],
  [84, 69, 56, 46, 37],
];
const RETENTION_DAYS = ["Day 0", "Day 1", "Day 3", "Day 7", "Day 14"];
const RETENTION_COHORT_DATES = ["Apr 1", "Apr 2", "Apr 3", "Apr 4"];

export function RetentionSignalsView({
  retentionPulse,
  shimmerCol,
}: {
  retentionPulse: number;
  shimmerCol: number;
}) {
  return (
    <div className="grid min-h-[420px] grid-cols-1 items-center gap-4 p-3 md:grid-cols-[260px_minmax(0,1fr)] md:gap-4 md:p-4 xl:min-h-[540px] xl:grid-cols-[320px_minmax(0,1fr)] xl:gap-6">
      <div className="grid grid-cols-2 gap-3 md:grid-cols-1">
        <WidgetCard label="Day 1 retention" value="54%" accent="#1bd98a" />
        <WidgetCard label="Day 7 retention" value="31%" />
        <WidgetCard label="Returning users" value="28%" accent="#a78bfa" />
        <WidgetCard label="Power users" value="9%" accent="#facc15" />
      </div>

      <div className="flex h-full min-h-[280px] flex-col gap-4 rounded-lg border border-[#1e2530] bg-[#161b22] p-4 md:min-h-[420px] xl:min-h-[500px]">
        <div className="flex items-end justify-between">
          <div>
            <div className="text-sm font-medium text-[#e6edf3]">Retention Cohorts</div>
            <div className="text-xs text-white/40">Last 14 days</div>
          </div>
          <div className="text-xs text-white/40">Grouped by daily cohorts</div>
        </div>

        <div className="flex flex-wrap gap-2 text-xs">
          <div className="rounded-md bg-[#0d1117]/70 px-3 py-1 text-white/70">Avg retention 42%</div>
          <div className="rounded-md bg-[#0d1117]/70 px-3 py-1 text-white/70">Best cohort 86%</div>
          <div className="rounded-md bg-[#0d1117]/70 px-3 py-1 text-white/70">Trend stable</div>
        </div>

        <div className="flex-1 overflow-x-auto" style={{ opacity: retentionPulse, transition: "opacity 0.6s ease" }}>
          <div className="min-w-[520px] space-y-2">
            <div className="grid grid-cols-[72px_repeat(5,minmax(0,1fr))] gap-2 text-xs text-white/40">
              <div />
              {RETENTION_DAYS.map((day) => (
                <div key={day} className="text-center">
                  {day}
                </div>
              ))}
            </div>

            <div className="space-y-2">
              {RETENTION_MATRIX.map((row, rowIdx) => (
                <div key={RETENTION_COHORT_DATES[rowIdx]} className="grid grid-cols-[72px_repeat(5,minmax(0,1fr))] gap-2">
                  <div className="flex items-center text-xs text-white/30">{RETENTION_COHORT_DATES[rowIdx]}</div>
                  {row.map((cell, colIdx) => {
                    const highlighted = colIdx === shimmerCol;
                    return (
                      <div
                        key={`${rowIdx}-${colIdx}`}
                        className="h-14 rounded text-center text-[11px] font-medium leading-[56px] transition-all duration-300"
                        style={{
                          background: highlighted ? "rgba(27,217,138,0.88)" : `rgba(27,217,138,${(cell / 100) * 0.75 + 0.12})`,
                          color: highlighted ? "#032210" : cell > 60 ? "#0a2a18" : "#8b949e",
                          transform: highlighted ? "translateY(-1px)" : "translateY(0)",
                        }}
                      >
                        {cell}%
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <div className="space-y-1">
            <div className="h-2 w-full rounded bg-gradient-to-r from-[rgba(27,217,138,0.15)] to-[rgba(27,217,138,0.9)]" />
            <div className="flex justify-between text-xs text-white/40">
              <span>12%</span>
              <span>Low retention - High retention</span>
              <span>82%</span>
            </div>
          </div>

          <div className="rounded-md border border-[#1e2530] bg-[#0d1117]/65 px-3 py-2 text-xs text-white/60">
            <div className="mb-1 flex items-center gap-2 text-[#1bd98a]">
              <span className="h-2 w-2 rounded-full bg-[#1bd98a]" />
              Insight detected
            </div>
            <div>Retention stabilizes after day 3 for most cohorts</div>
          </div>
        </div>
      </div>
    </div>
  );
}
