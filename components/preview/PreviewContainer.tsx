"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";
import { BehaviorFlowView } from "./BehaviorFlowView";
import { GeoPresenceView } from "./GeoPresenceView";
import { LiveActivityView } from "./LiveActivityView";
import { PreviewTabs } from "./PreviewTabs";
import { RetentionSignalsView } from "./RetentionSignalsView";
import type { FlowStep, LiveEventItem, PreviewTab } from "./types";

const PREVIEW_TABS: PreviewTab[] = ["live", "geo", "flow", "retention"];

const LIVE_EVENT_POOL = [
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

function createInitialEvents(): LiveEventItem[] {
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

export function PreviewContainer() {
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
    const interval = window.setInterval(() => setShimmerCol((prev) => (prev + 1) % 5), 900);
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
    const interval = window.setInterval(() => setGeoLabelIdx((prev) => (prev + 1) % 3), 2600);
    return () => window.clearInterval(interval);
  }, []);

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

  const tabletPct = Math.max(5, 100 - desktopPct - mobilePct);
  const avgSessionText = `${Math.floor(avgSessionSec / 60)}m ${String(avgSessionSec % 60).padStart(2, "0")}s`;

  const visibleEvents = useMemo(() => events.slice(0, 6), [events]);
  const flowSteps = useMemo<FlowStep[]>(
    () => [
      { label: "Step 1 - Signup", width: flowWidths[0], color: "#1bd98a", time: FLOW_STEP_TIMES[0] },
      { label: "Step 2 - Create project", width: flowWidths[1], color: "#1bd98a", time: FLOW_STEP_TIMES[1] },
      { label: "Step 3 - Invite team", width: flowWidths[2], color: "#facc15", time: FLOW_STEP_TIMES[2] },
      { label: "Step 4 - Activate feature", width: flowWidths[3], color: "#f0563a", time: FLOW_STEP_TIMES[3] },
    ],
    [flowWidths],
  );

  const changeTab = (tab: PreviewTab) => {
    if (tab !== "geo") {
      setIsDragging(false);
      setOffset({ x: 0, y: 0 });
    }
    setActiveTab(tab);
  };

  const mapHeightClass = "h-[260px] sm:h-[300px] md:h-[360px] xl:h-[420px]";

  return (
    <div onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
      <PreviewTabs activeTab={activeTab} onChange={changeTab} />

      <div className="relative min-h-[420px] bg-black/20 sm:min-h-[460px] md:min-h-[500px] xl:min-h-[540px]">
        <AnimatePresence mode="wait">
          {activeTab === "live" && (
            <motion.div
              key="tab-live"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 6 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            >
              <LiveActivityView
                userCount={userCount}
                eventsPerMinute={eventsPerMinute}
                avgSessionText={avgSessionText}
                desktopPct={desktopPct}
                mobilePct={mobilePct}
                tabletPct={tabletPct}
                visibleEvents={visibleEvents}
                newestEventId={newestEventId}
                formatEventTime={formatEventTime}
                tick={tick}
              />
            </motion.div>
          )}

          {activeTab === "geo" && (
            <motion.div
              key="tab-geo"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 6 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            >
              <GeoPresenceView
                userCount={userCount}
                offset={offset}
                isDragging={isDragging}
                geoLabelIdx={geoLabelIdx}
                mapHeightClass={mapHeightClass}
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
                  const width = event.currentTarget.clientWidth;
                  const clampXLimit = clamp(Math.round(width * 0.18), 40, 120);
                  const clampYLimit = clamp(Math.round(width * 0.1), 25, 70);
                  const clampX = Math.max(-clampXLimit, Math.min(clampXLimit, newX));
                  const clampY = Math.max(-clampYLimit, Math.min(clampYLimit, newY));
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
              />
            </motion.div>
          )}

          {activeTab === "flow" && (
            <motion.div
              key="tab-flow"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 6 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            >
              <BehaviorFlowView flowSteps={flowSteps} />
            </motion.div>
          )}

          {activeTab === "retention" && (
            <motion.div
              key="tab-retention"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 6 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            >
              <RetentionSignalsView retentionPulse={retentionPulse} shimmerCol={shimmerCol} />
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
