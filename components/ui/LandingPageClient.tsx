"use client";

import dynamic from "next/dynamic";

const LandingPage = dynamic(
  () => import("@/components/ui/LandingPage").then((mod) => mod.LandingPage),
  { ssr: false },
);

export function LandingPageClient() {
  return <LandingPage />;
}
