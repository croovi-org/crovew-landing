"use client";

import { motion } from "framer-motion";
import type { PreviewTab } from "./types";

const TABS: Array<{ key: PreviewTab; label: string }> = [
  { key: "live", label: "Live Activity" },
  { key: "geo", label: "Geo Presence" },
  { key: "flow", label: "Behavior Flow" },
  { key: "retention", label: "Retention Signals" },
];

export function PreviewTabs({
  activeTab,
  onChange,
}: {
  activeTab: PreviewTab;
  onChange: (tab: PreviewTab) => void;
}) {
  const tabButtonClass = (tab: PreviewTab) =>
    [
      "relative shrink-0 border-b px-6 py-2.5 text-[11px] transition-colors duration-200 sm:flex-1 sm:px-2",
      activeTab === tab
        ? "border-[#1e2530] bg-[#0d1117] text-[#1bd98a]"
        : "border-[#1e2530] bg-transparent text-[#8b949e] hover:text-[#c9d1d9]",
    ].join(" ");

  return (
    <div className="overflow-x-auto border-b border-[#1e2530] bg-[#161b22] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      <div className="flex min-w-[640px] sm:min-w-0">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            className={tabButtonClass(tab.key)}
            onClick={() => onChange(tab.key)}
            type="button"
          >
            {tab.label}
            {activeTab === tab.key && (
              <motion.div
                layoutId="tab-underline"
                className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#1bd98a]"
                transition={{ duration: 0.2, ease: "easeOut" }}
              />
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
