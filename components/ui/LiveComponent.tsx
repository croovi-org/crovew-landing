"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { AnimatedWorldMap } from "@/components/map/WorldMap";

type PreviewTab = "live" | "geo" | "flow" | "retention";
const PREVIEW_TABS: PreviewTab[] = ["live", "geo", "flow", "retention"];

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
  { t: "Deployed API endpoint", u: "sarah.dev", i: "{}", bg: "#001a2d", c: "#38bdf8" },
  { t: "Invited 3 team members", u: "alex_99", i: "✦", bg: "#1a002d", c: "#a78bfa" },
  { t: "Created new project", u: "jessica_t", i: "▸", bg: "#1a0d2e", c: "#c084fc" },
  { t: "Session started (Mobile)", u: "mike.w", i: "~", bg: "#001e1a", c: "#1bd98a" },
  { t: "Integration connected", u: "nina_codes", i: "+", bg: "#001a2d", c: "#38bdf8" },
  { t: "Completed onboarding", u: "rahul_dev", i: "✓", bg: "#001a0d", c: "#1bd98a" },
  { t: "Viewed pricing page", u: "alex_dev", i: "$", bg: "#1a1a00", c: "#facc15" },
  { t: "API key generated", u: "sarahbuilds", i: "#", bg: "#1a002d", c: "#a78bfa" },
  { t: "Dashboard activated", u: "david_pm", i: "▤", bg: "#001e1a", c: "#1bd98a" },
];

const RETENTION_MATRIX = [
  [82, 68, 54, 44, 36],
  [78, 64, 52, 42, 34],
  [86, 71, 58, 47, 39],
  [84, 69, 56, 46, 37],
];
const RETENTION_DAYS = ["Day 0", "Day 1", "Day 3", "Day 7", "Day 14"];
const RETENTION_COHORT_DATES = ["Apr 1", "Apr 2", "Apr 3", "Apr 4"];

const FLOW_BASE = [100, 82, 61, 49];
const FLOW_STEP_TIMES = ["avg time 12s", "avg time 1m 22s", "avg time 48s", "avg time 2m 10s"];

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
  const offsets = [0, 8, 16, 26, 38, 51, 64, 77];
  return LIVE_EVENT_POOL.slice(0, 8).map((event, index) => ({
    ...event,
    id: index + 1,
    ts: now - offsets[index] * 1000,
  }));
}

function randomDelay() {
  return 3000 + Math.round(Math.random() * 2000);
}

function Widget({ label, value, accent, children }: { label: string; value: string; accent?: string; children?: React.ReactNode }) {
  return (
    <div className="rounded-lg border border-[#1e2530] bg-[#161b22] p-4">
      <div className="mb-1 text-[11px] text-[#8b949e]">{label}</div>
      <div className="text-[24px] font-semibold leading-none" style={{ color: accent ?? "#e6edf3" }}>
        {value}
      </div>
      {children}
    </div>
  );
}

export function LiveComponent() {
  const [activeTab, setActiveTab] = useState<PreviewTab>("live");
  const [isHovered, setIsHovered] = useState(false);

  const [userCount, setUserCount] = useState(1284);
  const [eventsPerMinute, setEventsPerMinute] = useState(92);
  const [avgSessionSec, setAvgSessionSec] = useState(252);
  const [desktopPct, setDesktopPct] = useState(62);
  const [mobilePct, setMobilePct] = useState(31);

  const [events, setEvents] = useState<LiveEventItem[]>(() => createInitialEvents());
  const [tick, setTick] = useState(() => Date.now());
  const [newestEventId, setNewestEventId] = useState<number | null>(null);

  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);

  const [flowWidths, setFlowWidths] = useState(FLOW_BASE);
  const [shimmerCol, setShimmerCol] = useState(0);
  const [geoLabelIdx, setGeoLabelIdx] = useState(0);
  const [retentionPulse, setRetentionPulse] = useState(1);

  const eventIdxRef = useRef(events.length);
  const eventIdRef = useRef(events.length);
  const dragStart = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const interval = window.setInterval(() => setTick(Date.now()), 1000);
    return () => window.clearInterval(interval);
  }, []);

  useEffect(() => {
    let timeoutId: number;

    const update = () => {
      setUserCount((prev) => clamp(prev + (Math.random() > 0.5 ? 1 : -1) * (1 + Math.floor(Math.random() * 3)), 1220, 1360));
      setEventsPerMinute((prev) => clamp(prev + (Math.random() > 0.5 ? 1 : -1) * (1 + Math.floor(Math.random() * 2)), 76, 116));
      setAvgSessionSec((prev) => clamp(prev + (Math.random() > 0.5 ? 1 : -1) * (1 + Math.floor(Math.random() * 4)), 228, 286));
      setDesktopPct((prev) => clamp(prev + (Math.random() > 0.5 ? 1 : -1), 58, 68));
      setMobilePct((prev) => clamp(prev + (Math.random() > 0.5 ? 1 : -1), 26, 36));
      timeoutId = window.setTimeout(update, randomDelay());
    };

    timeoutId = window.setTimeout(update, randomDelay());
    return () => window.clearTimeout(timeoutId);
  }, []);

  useEffect(() => {
    const interval = window.setInterval(() => {
      const event = LIVE_EVENT_POOL[eventIdxRef.current % LIVE_EVENT_POOL.length];
      eventIdxRef.current += 1;
      eventIdRef.current += 1;
      const nextEvent = { ...event, id: eventIdRef.current, ts: Date.now() };
      setEvents((prev) => [nextEvent, ...prev].slice(0, 12));
      setNewestEventId(nextEvent.id);
      window.setTimeout(() => setNewestEventId(null), 360);
    }, 2800);

    return () => window.clearInterval(interval);
  }, []);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setFlowWidths(FLOW_BASE.map((v) => clamp(v + (Math.random() - 0.5) * 6, v - 5, v + 5)));
    }, 3600);
    return () => window.clearInterval(interval);
  }, []);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setShimmerCol((prev) => (prev + 1) % 5);
    }, 900);
    return () => window.clearInterval(interval);
  }, []);

  useEffect(() => {
    let timeoutId: number;
    const pulse = () => {
      setRetentionPulse((prev) => (prev > 0.95 ? 0.93 : 1));
      timeoutId = window.setTimeout(pulse, 4000 + Math.round(Math.random() * 2000));
    };
    timeoutId = window.setTimeout(pulse, 4500);
    return () => window.clearTimeout(timeoutId);
  }, []);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setGeoLabelIdx((prev) => (prev + 1) % 3);
    }, 2600);
    return () => window.clearInterval(interval);
  }, []);

  const tabletPct = Math.max(5, 100 - desktopPct - mobilePct);
  const avgSessionText = `${Math.floor(avgSessionSec / 60)}m ${String(avgSessionSec % 60).padStart(2, "0")}s`;

  const visibleEvents = useMemo(() => events.slice(0, 6), [events]);
  const flowSteps = useMemo(
    () => [
      { label: "Step 1 - Signup", width: flowWidths[0], color: "#1bd98a", time: FLOW_STEP_TIMES[0] },
      { label: "Step 2 - Create project", width: flowWidths[1], color: "#1bd98a", time: FLOW_STEP_TIMES[1] },
      { label: "Step 3 - Invite team", width: flowWidths[2], color: "#facc15", time: FLOW_STEP_TIMES[2] },
      { label: "Step 4 - Activate feature", width: flowWidths[3], color: "#f0563a", time: FLOW_STEP_TIMES[3] },
    ],
    [flowWidths],
  );

  const tabButtonClass = (tab: PreviewTab) =>
    [
      "relative flex-1 border-b px-2 py-2.5 text-[11px] transition-colors duration-200",
      activeTab === tab
        ? "border-[#1e2530] bg-[#0d1117] text-[#1bd98a]"
        : "border-[#1e2530] bg-transparent text-[#8b949e] hover:text-[#c9d1d9]",
    ].join(" ");

  const changeTab = (tab: PreviewTab) => {
    if (tab !== "geo") {
      setIsDragging(false);
      setOffset({ x: 0, y: 0 });
    }
    setActiveTab(tab);
  };

  useEffect(() => {
    if (isHovered) return;

    const interval = window.setInterval(() => {
      setActiveTab((prev) => {
        const currentIndex = PREVIEW_TABS.indexOf(prev);
        const nextIndex = (currentIndex + 1) % PREVIEW_TABS.length;
        return PREVIEW_TABS[nextIndex];
      });
    }, 2000);

    return () => window.clearInterval(interval);
  }, [isHovered, activeTab]);

  return (
    <div onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
      <div className="flex border-b border-[#1e2530] bg-[#161b22]">
        <button className={tabButtonClass("live")} onClick={() => changeTab("live")} type="button">
          Live Activity
          {activeTab === "live" && (
            <motion.div
              layoutId="tab-underline"
              className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#1bd98a]"
              transition={{ duration: 0.2, ease: "easeOut" }}
            />
          )}
        </button>
        <button className={tabButtonClass("geo")} onClick={() => changeTab("geo")} type="button">
          Geo Presence
          {activeTab === "geo" && (
            <motion.div
              layoutId="tab-underline"
              className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#1bd98a]"
              transition={{ duration: 0.2, ease: "easeOut" }}
            />
          )}
        </button>
        <button className={tabButtonClass("flow")} onClick={() => changeTab("flow")} type="button">
          Behavior Flow
          {activeTab === "flow" && (
            <motion.div
              layoutId="tab-underline"
              className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#1bd98a]"
              transition={{ duration: 0.2, ease: "easeOut" }}
            />
          )}
        </button>
        <button className={tabButtonClass("retention")} onClick={() => changeTab("retention")} type="button">
          Retention Signals
          {activeTab === "retention" && (
            <motion.div
              layoutId="tab-underline"
              className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#1bd98a]"
              transition={{ duration: 0.2, ease: "easeOut" }}
            />
          )}
        </button>
      </div>

      <div className="relative w-full min-h-[540px] max-h-[560px] bg-black/20">
        <AnimatePresence mode="wait">
          {activeTab === "live" && (
            <motion.div
              key="tab-live"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 6 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="grid min-h-[540px] max-h-[560px] grid-cols-[320px_1fr] items-center gap-6 p-4"
            >
              <div className="grid gap-3">
                <Widget label="Active Users" value={userCount.toLocaleString()} accent="#1bd98a" />
                <Widget label="Events / Min" value={`${eventsPerMinute}`}>
                  <div className="mt-2 text-[11px] text-[#8b949e]">Steady live throughput</div>
                </Widget>
                <Widget label="Avg Session" value={avgSessionText}>
                  <div className="mt-2 flex items-center gap-2 text-[11px] text-[#8b949e]">
                    <span className="h-2 w-2 animate-[previewPulse_1.8s_ease-in-out_infinite] rounded-full bg-[#1bd98a]" />
                    Pulse stable
                  </div>
                </Widget>
                <div className="rounded-lg border border-[#1e2530] bg-[#161b22] p-4">
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

              <div className="relative h-full min-h-[500px] rounded-lg border border-[#1e2530] bg-[#161b22] p-4">
                <div className="mb-3 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm font-medium text-[#e6edf3]">
                    Live Event Feed
                    <span className="h-2 w-2 animate-[previewPulse_1.6s_ease-in-out_infinite] rounded-full bg-[#1bd98a]" />
                  </div>
                  <div className="text-[11px] text-[#8b949e]">Receiving events...</div>
                </div>
                <div className="relative h-[430px] overflow-hidden">
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
            </motion.div>
          )}

          {activeTab === "geo" && (
            <motion.div
              key="tab-geo"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 6 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="grid min-h-[540px] max-h-[560px] grid-cols-[320px_1fr] items-center gap-6 p-4"
            >
              <div className="grid gap-3 self-start pt-2">
                <Widget label="Active globally" value={userCount.toLocaleString()} accent="#1bd98a" />
                <Widget label="Active regions" value="12" accent="#a78bfa" />
                <Widget label="Events today" value="3.2m" accent="#facc15" />
                <div className="rounded-lg border border-[#1e2530] bg-[#161b22] p-4">
                  <div className="mb-2 text-[11px] text-[#8b949e]">Top region</div>
                  <div className="text-sm text-[#e6edf3]">India 18%</div>
                  <div className="text-sm text-[#c9d1d9]">Germany 12%</div>
                  <div className="mt-3 text-[11px] text-[#8b949e]">Peak hour</div>
                  <div className="text-sm text-[#e6edf3]">19:00 UTC</div>
                </div>
              </div>

              <div
                className="relative w-full h-full overflow-hidden"
                style={{
                  maskImage: "radial-gradient(circle at center, white 55%, transparent 100%)",
                  WebkitMaskImage: "radial-gradient(circle at center, white 55%, transparent 100%)",
                  cursor: isDragging ? "grabbing" : "grab",
                  touchAction: "none",
                  userSelect: "none",
                }}
                onPointerDown={(event) => {
                  setIsDragging(true);
                  dragStart.current = {
                    x: event.clientX - offset.x,
                    y: event.clientY - offset.y,
                  };
                  event.currentTarget.setPointerCapture(event.pointerId);
                }}
                onPointerMove={(event) => {
                  if (!isDragging) return;
                  const newX = event.clientX - dragStart.current.x;
                  const newY = event.clientY - dragStart.current.y;
                  const clampX = Math.max(-120, Math.min(120, newX));
                  const clampY = Math.max(-70, Math.min(70, newY));
                  setOffset({ x: clampX, y: clampY });
                }}
                onPointerUp={(event) => {
                  setIsDragging(false);
                  setOffset((prev) => ({ x: prev.x * 0.6, y: prev.y * 0.6 }));
                  event.currentTarget.releasePointerCapture(event.pointerId);
                }}
                onPointerCancel={(event) => {
                  setIsDragging(false);
                  setOffset((prev) => ({ x: prev.x * 0.6, y: prev.y * 0.6 }));
                  event.currentTarget.releasePointerCapture(event.pointerId);
                }}
                onPointerLeave={(event) => {
                  if (!isDragging) return;
                  setIsDragging(false);
                  setOffset((prev) => ({ x: prev.x * 0.6, y: prev.y * 0.6 }));
                  event.currentTarget.releasePointerCapture(event.pointerId);
                }}
              >
                <div
                  className="relative h-full w-full overflow-hidden"
                  style={{
                    transition: isDragging ? "none" : "transform 0.35s ease-out",
                  }}
                >
                  <AnimatedWorldMap
                    className="absolute left-1/2 top-1/2 w-[160%] max-w-none opacity-90"
                    dotRadius={6}
                    strongGlow
                    projectionScale={255}
                    style={
                      {
                        transform: `translate(-50%, -50%) translate(${offset.x}px, ${offset.y}px) scale(1)`,
                      } as React.CSSProperties
                    }
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
            </motion.div>
          )}

          {activeTab === "flow" && (
            <motion.div
              key="tab-flow"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 6 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="grid min-h-[540px] max-h-[560px] grid-cols-[320px_1fr] items-stretch gap-6 overflow-hidden p-4"
            >
              <div className="grid gap-3 self-start">
                <Widget label="Flow completion" value="68%" accent="#1bd98a">
                  <div className="mt-2 text-xs text-white/40">↑ 4% vs last week</div>
                </Widget>
                <Widget label="Biggest drop-off" value="Invite team step">
                  <div className="mt-2 text-[11px] text-[#f0563a]">-21% from previous step</div>
                </Widget>
                <Widget label="Avg steps / session" value="3.4" />
                <Widget label="Repeat interaction" value="42%" accent="#a78bfa">
                  <div className="mt-2 text-xs text-white/40">stable vs last week</div>
                </Widget>
              </div>

              <div className="h-[500px] overflow-hidden rounded-lg border border-[#1e2530] bg-[#161b22]">
                <div className="flow-scroll flex h-full flex-col overflow-y-scroll p-4">
                <div className="mb-2 flex items-center justify-between text-xs text-white/40">
                  <div className="flex items-center gap-2">
                    <span>Onboarding Flow</span>
                    <span>Last 7 days</span>
                    <span>Based on 4,218 sessions</span>
                  </div>
                </div>
                <div className="mb-3 flex items-center gap-2">
                  <span className="rounded-full bg-white/5 px-3 py-1 text-xs text-white/70">Segment: New users</span>
                  <span className="rounded-full bg-white/5 px-3 py-1 text-xs text-white/70">All traffic</span>
                </div>
                <div className="mb-4 text-sm font-medium text-[#e6edf3]">Behavior funnel</div>

                <div className="flex-1 space-y-5">
                  {flowSteps.map((step, idx) => {
                    const next = flowSteps[idx + 1];
                    const currentPct = Math.round(step.width);
                    const nextPct = next ? Math.round(next.width) : null;
                    const drop = nextPct !== null ? Math.max(0, currentPct - nextPct) : null;
                    return (
                      <div key={step.label} className="relative">
                        <div className="mb-1 flex items-start justify-between gap-3 text-[11px]">
                          <div>
                            <div className="text-[#c9d1d9]">{step.label}</div>
                            <div className="mt-0.5 text-xs text-white/30">{step.time}</div>
                          </div>
                          <span className="text-[#c9d1d9]">{currentPct}%</span>
                        </div>
                        <div className="h-8 rounded bg-[#0d1117]">
                          <div
                            className="h-full rounded transition-[width] duration-[1400ms] ease-out"
                            style={{ width: `${step.width}%`, background: step.color, opacity: 0.82 }}
                          />
                        </div>
                        {next && (
                          <div className="mt-2 flex items-center justify-between text-xs text-white/40">
                            <span>
                              {currentPct}% -&gt; {nextPct}%
                            </span>
                            <span>{`↓ ${drop}% drop`}</span>
                          </div>
                        )}
                        {idx < flowSteps.length - 1 && <div className="mt-3 h-px w-full bg-white/20" />}
                      </div>
                    );
                  })}
                </div>

                <div className="mt-4 rounded-md border border-[#1e2530] bg-[#0d1117]/65 p-3 text-xs text-white/60">
                  <div className="mb-1 flex items-center gap-2 text-[#1bd98a]">
                    <span className="h-2 w-2 rounded-full bg-[#1bd98a]" />
                    Insight detected
                  </div>
                  <div>Largest drop occurs at Invite Team step</div>
                  <div className="mt-1 text-white/40">Users who skip inviting teammates show 37% lower retention.</div>
                </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === "retention" && (
            <motion.div
              key="tab-retention"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 6 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="grid min-h-[540px] max-h-[560px] grid-cols-[320px_1fr] items-center gap-6 p-4"
            >
              <div className="grid gap-3">
                <Widget label="Day 1 retention" value="54%" accent="#1bd98a" />
                <Widget label="Day 7 retention" value="31%" />
                <Widget label="Returning users" value="28%" accent="#a78bfa" />
                <Widget label="Power users" value="9%" accent="#facc15" />
              </div>

              <div className="flex h-full min-h-[500px] flex-col gap-4 rounded-lg border border-[#1e2530] bg-[#161b22] p-4">
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

                <div className="flex-1 space-y-2" style={{ opacity: retentionPulse, transition: "opacity 0.6s ease" }}>
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
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <style jsx global>{`
        @keyframes previewPulse {
          0%,
          100% {
            opacity: 1;
          }
          50% {
            opacity: 0.35;
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
        .flow-scroll {
          scrollbar-width: thin;
          scrollbar-color: rgba(27, 217, 138, 0.45) rgba(13, 17, 23, 0.6);
        }
        .flow-scroll::-webkit-scrollbar {
          width: 8px;
        }
        .flow-scroll::-webkit-scrollbar-track {
          background: rgba(13, 17, 23, 0.55);
          border-radius: 999px;
        }
        .flow-scroll::-webkit-scrollbar-thumb {
          background: rgba(27, 217, 138, 0.45);
          border-radius: 999px;
        }
        .flow-scroll::-webkit-scrollbar-thumb:hover {
          background: rgba(27, 217, 138, 0.65);
        }
      `}</style>
    </div>
  );
}
