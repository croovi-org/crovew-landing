"use client";

import React, { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { AnimatedWorldMap } from "@/components/map/WorldMap";

type PreviewTab = "live" | "geo" | "flow" | "retention";

type LiveEventTemplate = {
  t: string;
  u: string;
  i: string;
  bg: string;
  c: string;
};

type LiveEventItem = LiveEventTemplate & {
  id: number;
  ts: number;
};

const LIVE_EVENT_POOL: LiveEventTemplate[] = [
  { t: "Upgraded to Pro", u: "david_m", i: "⚡", bg: "#2d1f00", c: "#f0a500" },
  {
    t: "Deployed API endpoint",
    u: "sarah.dev",
    i: "{}",
    bg: "#001a2d",
    c: "#38bdf8",
  },
  {
    t: "Invited 3 team members",
    u: "alex_99",
    i: "✦",
    bg: "#1a002d",
    c: "#a78bfa",
  },
  {
    t: "Created new project",
    u: "jessica_t",
    i: "▸",
    bg: "#1a0d2e",
    c: "#c084fc",
  },
  {
    t: "Session started (Mobile)",
    u: "mike.w",
    i: "~",
    bg: "#001e1a",
    c: "#1bd98a",
  },
  {
    t: "Integration connected",
    u: "nina_codes",
    i: "+",
    bg: "#001a2d",
    c: "#38bdf8",
  },
  {
    t: "Completed onboarding",
    u: "rahul_dev",
    i: "✓",
    bg: "#001a0d",
    c: "#1bd98a",
  },
  {
    t: "Viewed pricing page",
    u: "alex_dev",
    i: "$",
    bg: "#1a1a00",
    c: "#facc15",
  },
  {
    t: "API key generated",
    u: "sarahbuilds",
    i: "#",
    bg: "#1a002d",
    c: "#a78bfa",
  },
  {
    t: "Dashboard activated",
    u: "david_pm",
    i: "▤",
    bg: "#001e1a",
    c: "#1bd98a",
  },
];

const LIVE_INSIGHTS = [
  "Spike detected in onboarding completion",
  "New power user detected",
  "Feature adoption increasing",
  "Retention improving for cohort",
  "Drop-off detected at step 3",
  "High session intensity - 4 users",
];

const INITIAL_LIVE_BAR_HEIGHTS = [45, 32, 60, 38, 72, 50, 28, 64, 42, 56, 70, 36, 48, 80];

const FLOW_STEPS = [
  { label: "Signup", pct: 100, color: "#1bd98a" },
  { label: "Create project", pct: 78, color: "#1bd98a" },
  { label: "Invite team", pct: 44, color: "#facc15" },
  { label: "Activate feature", pct: 31, color: "#f0563a" },
];

const RETENTION_COHORTS = ["Jan cohort", "Feb cohort", "Mar cohort", "Apr cohort"];
const RETENTION_DAYS = ["Day 0", "Day 1", "Day 3", "Day 7", "Day 14", "Day 30", "Day 60"];
const RETENTION_DATA = [
  [100, 82, 71, 58, 44, 28, 18],
  [100, 79, 67, 54, 42, 31, 21],
  [100, 85, 74, 63, 51, 38, 26],
  [100, 88, 78, 66, 54, 41, 29],
];

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

function formatEventTime(ts: number, tick: number) {
  const diffSec = Math.round((tick - ts) / 1000);
  if (diffSec < 5) return "Just now";
  if (diffSec < 60) return `${diffSec}s ago`;
  return `${Math.round(diffSec / 60)}m ago`;
}

function createInitialEvents() {
  const now = Date.now();
  const offsets = [0, 12, 45, 60, 120];
  return LIVE_EVENT_POOL.slice(0, 5).map((event, index) => ({
    ...event,
    id: index + 1,
    ts: now - offsets[index] * 1000,
  }));
}

export function LiveComponent() {
  const [activeTab, setActiveTab] = useState<PreviewTab>("live");
  const [userCount, setUserCount] = useState(1284);
  const [userCountFlash, setUserCountFlash] = useState(false);
  const [barHeights, setBarHeights] = useState(INITIAL_LIVE_BAR_HEIGHTS);
  const [events, setEvents] = useState<LiveEventItem[]>(() => createInitialEvents());
  const [tick, setTick] = useState(() => Date.now());
  const [insightText, setInsightText] = useState(LIVE_INSIGHTS[0]);
  const [insightVisible, setInsightVisible] = useState(false);
  const [newestEventId, setNewestEventId] = useState<number | null>(null);
  const [flowHeights, setFlowHeights] = useState(FLOW_STEPS.map((step) => step.pct));
  const [hlRow, setHlRow] = useState(0);
  const [hlCol, setHlCol] = useState(0);

  const eventIdxRef = useRef(events.length);
  const eventIdRef = useRef(events.length);
  const insightIdxRef = useRef(0);

  useEffect(() => {
    if (activeTab !== "live" && activeTab !== "geo") return;

    const flashTimeouts = new Set<number>();
    const countInterval = window.setInterval(() => {
      setUserCount((prev) => {
        const direction = Math.random() > 0.5 ? 1 : -1;
        const magnitude = Math.round(5 + Math.random() * 10);
        return clamp(prev + direction * magnitude, 1200, 1400);
      });
      setUserCountFlash(true);
      const flashTimeout = window.setTimeout(() => {
        setUserCountFlash(false);
        flashTimeouts.delete(flashTimeout);
      }, 400);
      flashTimeouts.add(flashTimeout);
    }, 2200);

    return () => {
      window.clearInterval(countInterval);
      flashTimeouts.forEach((timeout) => window.clearTimeout(timeout));
    };
  }, [activeTab]);

  useEffect(() => {
    if (activeTab !== "live") return;

    const liveTimeouts = new Set<number>();
    const liveIntervals = [
      window.setInterval(() => {
        setTick(Date.now());
      }, 1000),
      window.setInterval(() => {
        setBarHeights((prev) =>
          prev.map((height) => clamp(height + (Math.random() - 0.5) * 18, 12, 95)),
        );
      }, 1600),
      window.setInterval(() => {
        const event = LIVE_EVENT_POOL[eventIdxRef.current % LIVE_EVENT_POOL.length];
        eventIdxRef.current += 1;
        eventIdRef.current += 1;
        const nextEvent = { ...event, id: eventIdRef.current, ts: Date.now() };
        setEvents((prev) => [nextEvent, ...prev].slice(0, 5));
        setNewestEventId(nextEvent.id);
        const timeout = window.setTimeout(() => {
          setNewestEventId((current) => (current === nextEvent.id ? null : current));
          liveTimeouts.delete(timeout);
        }, 360);
        liveTimeouts.add(timeout);
      }, 2800),
      window.setInterval(() => {
        const nextInsight = LIVE_INSIGHTS[insightIdxRef.current % LIVE_INSIGHTS.length];
        insightIdxRef.current += 1;
        setInsightText(nextInsight);
        setInsightVisible(true);
        const timeout = window.setTimeout(() => {
          setInsightVisible(false);
          liveTimeouts.delete(timeout);
        }, 3200);
        liveTimeouts.add(timeout);
      }, 7000),
    ];

    const initialInsight = window.setTimeout(() => {
      const nextInsight = LIVE_INSIGHTS[insightIdxRef.current % LIVE_INSIGHTS.length];
      insightIdxRef.current += 1;
      setInsightText(nextInsight);
      setInsightVisible(true);
      const timeout = window.setTimeout(() => {
        setInsightVisible(false);
        liveTimeouts.delete(timeout);
      }, 3200);
      liveTimeouts.add(timeout);
      liveTimeouts.delete(initialInsight);
    }, 3000);
    liveTimeouts.add(initialInsight);

    return () => {
      liveIntervals.forEach((intervalId) => window.clearInterval(intervalId));
      liveTimeouts.forEach((timeout) => window.clearTimeout(timeout));
      setInsightVisible(false);
      setNewestEventId(null);
    };
  }, [activeTab]);

  useEffect(() => {
    if (activeTab !== "flow") return;

    const interval = window.setInterval(() => {
      setFlowHeights(
        FLOW_STEPS.map((step) =>
          clamp(step.pct + (Math.random() - 0.5) * 12, step.pct - 8, step.pct + 8),
        ),
      );
    }, 3000);

    return () => {
      window.clearInterval(interval);
      setFlowHeights(FLOW_STEPS.map((step) => step.pct));
    };
  }, [activeTab]);

  useEffect(() => {
    if (activeTab !== "retention") return;
    const interval = window.setInterval(() => {
      setHlCol((prevCol) => {
        const nextCol = (prevCol + 1) % RETENTION_DAYS.length;
        if (nextCol === 0) {
          setHlRow((prevRow) => (prevRow + 1) % RETENTION_COHORTS.length);
        }
        return nextCol;
      });
    }, 900);

    return () => window.clearInterval(interval);
  }, [activeTab]);

  const tabButtonClass = (tab: PreviewTab) =>
    [
      "flex-1 border-b-2 px-2 py-2.5 text-[11px] transition-colors duration-200",
      activeTab === tab
        ? "border-[#1bd98a] bg-[#0d1117] text-[#1bd98a]"
        : "border-transparent bg-transparent text-[#8b949e] hover:text-[#c9d1d9]",
    ].join(" ");

  const day7Average = Math.round(
    RETENTION_DATA.reduce((sum, row) => sum + row[3], 0) / RETENTION_DATA.length,
  );

  return (
    <>
      <div className="flex border-b border-[#1e2530] bg-[#161b22]">
        <button className={tabButtonClass("live")} onClick={() => setActiveTab("live")} type="button">
          Live Activity
        </button>
        <button className={tabButtonClass("geo")} onClick={() => setActiveTab("geo")} type="button">
          Geo Presence
        </button>
        <button className={tabButtonClass("flow")} onClick={() => setActiveTab("flow")} type="button">
          Behavior Flow
        </button>
        <button
          className={tabButtonClass("retention")}
          onClick={() => setActiveTab("retention")}
          type="button"
        >
          Retention Signals
        </button>
      </div>

      <div className="min-h-[400px] bg-black/20">
        <AnimatePresence mode="wait">
          {activeTab === "live" && (
            <motion.div
              key="tab-live"
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 2 }}
              transition={{ duration: 0.22, ease: "easeOut" }}
              className="grid min-h-[400px] grid-cols-1 lg:grid-cols-[260px_minmax(0,1fr)]"
            >
              <div className="flex flex-col gap-3 border-b border-[#1e2530] p-4 lg:border-b-0 lg:border-r lg:p-[18px]">
                <div className="rounded-lg border border-[#1e2530] bg-[#161b22] p-3.5">
                  <div className="mb-1.5 text-[11px] text-[#8b949e]">Active Users (Live)</div>
                  <div className="flex items-center gap-2 text-[30px] font-semibold leading-none text-[#e6edf3]">
                    <span
                      className={`transition-all duration-300 ${
                        userCountFlash ? "text-[#1bd98a] drop-shadow-[0_0_10px_rgba(27,217,138,0.35)]" : ""
                      }`}
                    >
                      {userCount.toLocaleString()}
                    </span>
                    <span className="animate-[previewWave_1.8s_ease-in-out_infinite] text-xl text-[#1bd98a]">~</span>
                  </div>
                </div>

                <div className="flex-1 rounded-lg border border-[#1e2530] bg-[#161b22] p-3.5">
                  <div className="mb-3 text-[11px] text-[#8b949e]">Live Traffic</div>
                  <div className="flex h-16 items-end gap-[3px]">
                    {barHeights.map((height, index) => (
                      <div
                        key={`bar-${index}`}
                        className="flex-1 rounded-t-[2px] bg-[#1bd98a] opacity-70 transition-[height] duration-[1300ms] ease-in-out"
                        style={{ height: `${height}%` }}
                      />
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex flex-col p-4 lg:p-[18px]">
                <div className="mb-3 flex items-center justify-between">
                  <div className="text-sm font-medium text-[#e6edf3]">Live Event Feed</div>
                  <div className="flex items-center gap-1.5 text-[11px] text-[#1bd98a]">
                    <span className="h-1.5 w-1.5 animate-[previewWave_1.4s_ease-in-out_infinite] rounded-full bg-[#1bd98a]" />
                    Receiving events...
                  </div>
                </div>

                <div className="flex flex-1 flex-col gap-1.5">
                  {events.map((event) => (
                    <div
                      key={event.id}
                      className={`flex items-center gap-2.5 rounded-[7px] border border-[#1e2530] bg-[#161b22] px-3 py-2 ${
                        newestEventId === event.id ? "animate-[eventSlideIn_350ms_ease]" : ""
                      }`}
                    >
                      <div
                        className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-xs font-mono"
                        style={{ background: event.bg, color: event.c }}
                      >
                        {event.i}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="truncate text-xs font-medium text-[#e6edf3]">{event.t}</div>
                        <div className="truncate text-[11px] text-[#8b949e]">{event.u}</div>
                      </div>
                      <div className="text-[11px] text-[#8b949e]">{formatEventTime(event.ts, tick)}</div>
                    </div>
                  ))}
                </div>

                <div
                  className={`mt-2 flex items-center gap-2 rounded-md border border-[rgba(27,217,138,0.18)] bg-[rgba(27,217,138,0.06)] px-3 py-2 text-[11px] text-[#1bd98a] transition-opacity duration-500 ${
                    insightVisible ? "opacity-100" : "opacity-0"
                  }`}
                >
                  <span>◈</span>
                  <span>{insightText}</span>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === "geo" && (
            <motion.div
              key="tab-geo"
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 2 }}
              transition={{ duration: 0.22, ease: "easeOut" }}
              className="p-[18px]"
            >
              <div className="mb-3.5 flex flex-wrap gap-3">
                <div className="rounded-[7px] border border-[#1e2530] bg-[#161b22] px-4 py-2.5">
                  <div className="text-xl font-semibold text-[#1bd98a]">{userCount.toLocaleString()}</div>
                  <div className="text-[11px] text-[#8b949e]">Active globally</div>
                </div>
                <div className="rounded-[7px] border border-[#1e2530] bg-[#161b22] px-4 py-2.5">
                  <div className="text-xl font-semibold text-[#a78bfa]">12</div>
                  <div className="text-[11px] text-[#8b949e]">Active regions</div>
                </div>
                <div className="rounded-[7px] border border-[#1e2530] bg-[#161b22] px-4 py-2.5">
                  <div className="text-xl font-semibold text-[#facc15]">3.2m</div>
                  <div className="text-[11px] text-[#8b949e]">Events today</div>
                </div>
              </div>

              <div className="relative h-[260px] w-full overflow-hidden">
                <AnimatedWorldMap interactive projectionScale={205} />
              </div>
            </motion.div>
          )}

          {activeTab === "flow" && (
            <motion.div
              key="tab-flow"
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 2 }}
              transition={{ duration: 0.22, ease: "easeOut" }}
              className="p-6"
            >
              <div className="mb-5 text-xs uppercase tracking-[0.04em] text-[#8b949e]">
                User behavior flow - drop-off detection
              </div>

              <div className="mb-4 flex items-end gap-0">
                {FLOW_STEPS.map((step, index) => (
                  <div key={step.label} className="relative flex flex-1 flex-col items-center">
                    <div className="flex h-[150px] w-full items-end px-1.5">
                      <div
                        className="w-full rounded-t-[4px] opacity-85 transition-[height] duration-1000 ease-in-out"
                        style={{
                          height: `${Math.round((flowHeights[index] / 100) * 140)}px`,
                          background: step.color,
                        }}
                      />
                    </div>
                    <div className="mt-1.5 text-center text-[11px] font-medium text-[#c9d1d9]">
                      {step.label}
                    </div>
                    <div className="mt-0.5 text-center text-[13px]" style={{ color: step.color }}>
                      {step.pct}%
                    </div>
                    <div
                      className={`mt-0.5 text-center text-[10px] ${
                        index === 0 ? "text-[#8b949e]" : "text-[#f0563a]"
                      }`}
                    >
                      {index === 0 ? "baseline" : `-${FLOW_STEPS[index - 1].pct - step.pct}%`}
                    </div>
                    {index < FLOW_STEPS.length - 1 && (
                      <div className="absolute -right-3 top-[70px] z-10 text-base text-[#2a3540]">›</div>
                    )}
                  </div>
                ))}
              </div>

              <div className="flex items-center gap-2.5 rounded-[7px] border border-[#1e2530] bg-[#161b22] px-3.5 py-2.5">
                <span className="h-2 w-2 animate-[previewWave_2s_ease-in-out_infinite] rounded-full bg-[#f0563a]" />
                <span className="text-xs text-[#c9d1d9]">
                  Drop-off spike detected between{" "}
                  <strong className="text-[#e6edf3]">Create project</strong> and{" "}
                  <strong className="text-[#e6edf3]">Invite team</strong>
                </span>
                <span className="ml-auto rounded border border-[rgba(240,86,58,0.2)] bg-[rgba(240,86,58,0.1)] px-2 py-0.5 text-[10px] text-[#f0563a]">
                  -34%
                </span>
              </div>

              <div className="mt-3 flex flex-col gap-2 sm:flex-row">
                <div className="flex-1 rounded-[7px] border border-[#1e2530] bg-[#161b22] px-3.5 py-2.5">
                  <div className="mb-1 text-[11px] text-[#8b949e]">Highest friction</div>
                  <div className="text-[13px] font-medium text-[#e6edf3]">Step 3 - Invite team</div>
                </div>
                <div className="flex-1 rounded-[7px] border border-[#1e2530] bg-[#161b22] px-3.5 py-2.5">
                  <div className="mb-1 text-[11px] text-[#8b949e]">Completion rate</div>
                  <div className="text-[13px] font-medium text-[#1bd98a]">31%</div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === "retention" && (
            <motion.div
              key="tab-retention"
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 2 }}
              transition={{ duration: 0.22, ease: "easeOut" }}
              className="p-5"
            >
              <div className="mb-4 flex flex-wrap items-center justify-between gap-2.5">
                <div className="text-xs uppercase tracking-[0.04em] text-[#8b949e]">
                  Cohort retention signals
                </div>
                <div className="flex items-center gap-3 text-[11px] text-[#8b949e]">
                  <span className="inline-flex items-center gap-1.5">
                    <span className="h-2.5 w-2.5 rounded-[2px] bg-[rgba(27,217,138,0.8)]" />
                    High
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <span className="h-2.5 w-2.5 rounded-[2px] bg-[rgba(27,217,138,0.35)]" />
                    Mid
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <span className="h-2.5 w-2.5 rounded-[2px] bg-[rgba(27,217,138,0.1)]" />
                    Low
                  </span>
                </div>
              </div>

              <div className="overflow-hidden rounded-lg border border-[#1e2530]">
                <div className="grid grid-cols-[80px_repeat(7,minmax(0,1fr))]">
                  <div className="border-b border-r border-[#1e2530] bg-[#161b22] px-2 py-2 text-[10px] text-[#8b949e]" />
                  {RETENTION_DAYS.map((day) => (
                    <div
                      key={day}
                      className="border-b border-r border-[#1e2530] bg-[#161b22] px-1.5 py-2 text-center text-[10px] text-[#8b949e] last:border-r-0"
                    >
                      {day}
                    </div>
                  ))}

                  {RETENTION_DATA.map((row, rowIndex) => (
                    <React.Fragment key={RETENTION_COHORTS[rowIndex]}>
                      <div className="border-b border-r border-[#1e2530] bg-[#161b22] px-2 py-2.5 text-[11px] text-[#c9d1d9] last:border-b-0">
                        {RETENTION_COHORTS[rowIndex]}
                      </div>
                      {row.map((value, colIndex) => {
                        const isHighlighted = rowIndex === hlRow && colIndex === hlCol;
                        const opacity = (value / 100) * 0.9 + 0.05;
                        const textColor =
                          value > 60 ? "#0a2a18" : value > 35 ? "#0e2810" : "#8b949e";
                        return (
                          <div
                            key={`${rowIndex}-${colIndex}`}
                            className="border-b border-r border-[#1e2530] px-1.5 py-2.5 text-center text-[11px] font-medium last:border-r-0"
                            style={{
                              background: isHighlighted
                                ? "rgba(27,217,138,0.95)"
                                : `rgba(27,217,138,${opacity.toFixed(2)})`,
                              color: isHighlighted ? "#032210" : textColor,
                              transform: isHighlighted ? "scale(1.04)" : "scale(1)",
                              transition: "all 0.3s ease",
                            }}
                          >
                            {value}%
                          </div>
                        );
                      })}
                    </React.Fragment>
                  ))}
                </div>
              </div>

              <div className="mt-3 flex flex-col gap-2 sm:flex-row">
                <div className="flex-1 rounded-[7px] border border-[#1e2530] bg-[#161b22] px-3.5 py-2.5">
                  <div className="mb-1 text-[11px] text-[#8b949e]">Day 7 avg retention</div>
                  <div className="text-xl font-semibold text-[#1bd98a]">{day7Average}%</div>
                </div>
                <div className="flex-1 rounded-[7px] border border-[#1e2530] bg-[#161b22] px-3.5 py-2.5">
                  <div className="mb-1 text-[11px] text-[#8b949e]">Power users (Day 30)</div>
                  <div className="text-xl font-semibold text-[#a78bfa]">18%</div>
                </div>
                <div className="flex-1 rounded-[7px] border border-[#1e2530] bg-[#161b22] px-3.5 py-2.5">
                  <div className="mb-1 text-[11px] text-[#8b949e]">Improving cohort</div>
                  <div className="text-xl font-semibold text-[#facc15]">Mar '26</div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <style jsx global>{`
        @keyframes previewWave {
          0%,
          100% {
            opacity: 1;
          }
          50% {
            opacity: 0.3;
          }
        }
        @keyframes eventSlideIn {
          from {
            opacity: 0;
            transform: translateY(-8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </>
  );
}
