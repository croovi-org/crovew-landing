export type PreviewTab = "live" | "geo" | "flow" | "retention";

export type LiveEventItem = {
  id: number;
  ts: number;
  t: string;
  u: string;
  i: string;
  bg: string;
  c: string;
};

export type FlowStep = {
  label: string;
  width: number;
  color: string;
  time: string;
};
