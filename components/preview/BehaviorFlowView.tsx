"use client";

import { WidgetCard } from "./WidgetCard";
import type { FlowStep } from "./types";

export function BehaviorFlowView({ flowSteps }: { flowSteps: FlowStep[] }) {
  return (
    <div className="grid min-h-[420px] grid-cols-1 items-stretch gap-4 overflow-hidden p-3 md:grid-cols-[260px_minmax(0,1fr)] md:gap-4 md:p-4 xl:min-h-[540px] xl:grid-cols-[320px_minmax(0,1fr)] xl:gap-6">
      <div className="grid grid-cols-2 gap-3 self-start md:grid-cols-1">
        <WidgetCard label="Flow completion" value="68%" accent="#1bd98a">
          <div className="mt-2 text-xs text-white/40">↑ 4% vs last week</div>
        </WidgetCard>
        <WidgetCard label="Biggest drop-off" value="Invite team step">
          <div className="mt-2 text-[11px] text-[#f0563a]">-21% from previous step</div>
        </WidgetCard>
        <WidgetCard label="Avg steps / session" value="3.4" />
        <WidgetCard label="Repeat interaction" value="42%" accent="#a78bfa">
          <div className="mt-2 text-xs text-white/40">stable vs last week</div>
        </WidgetCard>
      </div>

      <div className="h-[500px] overflow-hidden rounded-lg border border-[#1e2530] bg-[#161b22]">
        <div className="flow-scroll flex h-full flex-col overflow-y-scroll p-4">
          <div className="mb-2 flex items-center justify-between text-xs text-white/40">
            <div className="flex flex-wrap items-center gap-2">
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
    </div>
  );
}
