import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo,
} from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Activity,
  MousePointerClick,
  Globe,
  Code,
  ShieldCheck,
  Terminal,
  ChevronRight,
  Zap,
  Play,
  Clock3,
  Shield,
  BarChart3,
  Users,
  KeyRound,
  ArrowUpRight,
} from "lucide-react";
import crovewLogo from "@/assets/crovew-logo-cropped.png";
import { AnimatedWorldMap } from "./WorldMap";
import { GlobeScene, isWebGLAvailable } from "./GlobeScene";
import { EyeCursor } from "./components/EyeCursor";

const COLORS = {
  bg: "#05070A",
  panel: "#0B0F14",
  panelLight: "#0F1720",
  text: "#E6F7F6",
  textDim: "#9FB3B8",
  textMuted: "#6B7C80",
  primary1: "#23C9B9",
  primary2: "#1BA99C",
  primary3: "#0F7F78",
  glow: "#7AF5E8",
};

const MOCK_EVENTS = [
  {
    id: 1,
    user: "david_m",
    action: "Upgraded to Pro",
    time: "Just now",
    icon: Zap,
    color: "text-yellow-400",
    bg: "bg-yellow-400/10",
  },
  {
    id: 2,
    user: "sarah.dev",
    action: "Deployed API endpoint",
    time: "12s ago",
    icon: Code,
    color: "text-primary1",
    bg: "bg-[#23C9B9]/10",
  },
  {
    id: 3,
    user: "alex_99",
    action: "Invited 3 team members",
    time: "45s ago",
    icon: MousePointerClick,
    color: "text-blue-400",
    bg: "bg-blue-400/10",
  },
  {
    id: 4,
    user: "jessica_t",
    action: "Created new project",
    time: "1m ago",
    icon: Terminal,
    color: "text-purple-400",
    bg: "bg-purple-400/10",
  },
  {
    id: 5,
    user: "mike.w",
    action: "Session started (Mobile)",
    time: "2m ago",
    icon: Activity,
    color: "text-green-400",
    bg: "bg-green-400/10",
  },
];

const NAV_ITEMS = [
  { label: "Product", href: "#product" },
  { label: "Docs", href: "#docs" },
  { label: "Pricing", href: "#pricing" },
  { label: "Roadmap", href: "#roadmap" },
];

const PREVIEW_BARS = [40, 20, 50, 80, 45, 60, 30, 90, 70, 85, 40, 65, 50].map(
  (value, index) => ({
    value,
    peak: Math.max(12, Math.min(96, value + ((index % 5) - 2) * 5)),
    duration: 2.4 + (index % 4) * 0.35,
  }),
);

function scrollToSection(id: string) {
  const element = document.getElementById(id);
  if (!element) return;
  element.scrollIntoView({ behavior: "smooth", block: "start" });
}

export function LandingPage() {
  const [showIntro, setShowIntro] = useState(true);
  // NavBar is hidden while the globe is showing; it slides in when the map phase begins
  const [showNav, setShowNav] = useState(() => !isWebGLAvailable());

  useEffect(() => {
    const link = document.createElement("link");
    link.href =
      "https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap";
    link.rel = "stylesheet";
    document.head.appendChild(link);
    return () => {
      document.head.removeChild(link);
    };
  }, []);

  return (
    <div
      className="min-h-screen w-full overflow-x-hidden selection:bg-[#23C9B9] selection:text-black"
      style={{
        background: COLORS.bg,
        fontFamily: "'Inter', system-ui, sans-serif",
        color: COLORS.text,
      }}
    >
      <EyeCursor />
      <NoiseOverlay />

      <AnimatePresence>
        {showIntro && <IntroAnimation onComplete={() => setShowIntro(false)} />}
      </AnimatePresence>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: showIntro ? 0 : 1 }}
        transition={{ duration: 1.5, delay: 0.5 }}
      >
        {/* NavBar slides in when entering map phase */}
        <AnimatePresence>
          {showNav && (
            <motion.div
              key="navbar"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, ease: "easeOut" }}
            >
              <NavBar />
            </motion.div>
          )}
        </AnimatePresence>

        <HeroSection onEnterMap={() => setShowNav(true)} />
        <FeaturesSection />
        <PreviewSection />
        <HowItWorksSection />
        <DocsSection />
        <PricingSection />
        <SocialProofSection />
        <RoadmapSection />
        <EcosystemSection />
        <CTASection />
        <Footer />
      </motion.div>
    </div>
  );
}

// -----------------------------------------------------------------------------
// COMPONENTS
// -----------------------------------------------------------------------------

function NoiseOverlay() {
  return (
    <div
      className="pointer-events-none fixed inset-0 z-50 h-full w-full opacity-[0.03]"
      style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
      }}
    />
  );
}

function IntroAnimation({ onComplete }: { onComplete: () => void }) {
  useEffect(() => {
    const timer = setTimeout(onComplete, 3200);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <motion.div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-[#05070A]"
      exit={{ opacity: 0, scale: 1.05 }}
      transition={{ duration: 1, ease: "easeInOut" }}
    >
      {/* Scanning grid — fills entire screen */}
      <motion.div
        className="absolute inset-0 bg-[linear-gradient(rgba(35,201,185,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(35,201,185,0.03)_1px,transparent_1px)] bg-[size:40px_40px] opacity-0"
        animate={{ opacity: [0, 1, 0] }}
        transition={{ duration: 3, ease: "easeInOut" }}
      />

      {/* Ambient glow behind logo */}
      <motion.div
        className="absolute h-72 w-72 rounded-full bg-[#7AF5E8] opacity-0 blur-[120px]"
        animate={{ opacity: [0, 0.12, 0.25, 0] }}
        transition={{ duration: 3, times: [0, 0.4, 0.8, 1], ease: "easeInOut" }}
      />

      {/* Vertical stack: logo + text, all properly centered */}
      <div className="relative flex flex-col items-center gap-4">
        {/* Logo wrapper */}
        <div className="relative" style={{ width: 200 }}>
          <motion.div
            initial={{ scale: 0.7, opacity: 0, filter: "blur(16px)" }}
            animate={{ scale: [0.7, 1.05, 1], opacity: 1, filter: "blur(0px)" }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            style={{
              filter:
                "drop-shadow(0 0 60px rgba(35,201,185,0.55)) drop-shadow(0 0 20px rgba(122,245,232,0.4))",
            }}
          >
            <img
              src={crovewLogo}
              alt="CroVew"
              style={{ width: 200, height: "auto", display: "block" }}
            />
          </motion.div>

          {/* Scanning light sweep */}
          <motion.div
            className="absolute inset-0 overflow-hidden pointer-events-none"
            style={{ borderRadius: "50% 50% / 40% 40%" }}
          >
            <motion.div
              className="absolute top-0 bottom-0 w-14"
              style={{
                background:
                  "linear-gradient(90deg, transparent, rgba(122,245,232,0.4), transparent)",
                left: -56,
              }}
              animate={{ left: ["-56px", "200px"] }}
              transition={{ delay: 1.4, duration: 0.85, ease: "linear" }}
            />
          </motion.div>
        </div>

        {/* Brand text — centered naturally in the flex column */}
        <motion.div
          className="flex flex-col items-center gap-1.5"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.6, duration: 0.7, ease: "easeOut" }}
        >
          <span
            className="text-3xl font-bold tracking-tight text-white"
            style={{ fontFamily: "'Inter', system-ui" }}
          >
            CroVew
          </span>
          <span
            className="text-xs font-medium text-[#7AF5E8] opacity-75"
            style={{
              letterSpacing: "0.28em",
              fontFamily: "'Inter', system-ui",
            }}
          >
            SEE EVERYTHING. STORE NOTHING.
          </span>
        </motion.div>
      </div>
    </motion.div>
  );
}

function NavBar() {
  return (
    <nav className="absolute left-0 right-0 top-0 z-40 flex items-center justify-between px-6 py-6 lg:px-12">
      <div className="flex items-center gap-2">
        <div style={{ filter: "drop-shadow(0 0 8px rgba(35,201,185,0.5))" }}>
          <img
            src={crovewLogo}
            alt="CroVew"
            style={{ width: 68, height: "auto" }}
          />
        </div>
        <span className="text-xl font-bold tracking-tight text-white">
          CroVew
        </span>
      </div>
      <div className="hidden items-center gap-8 md:flex">
        {NAV_ITEMS.map((item) => (
          <a
            key={item.label}
            href={item.href}
            className="text-sm font-medium text-[#9FB3B8] transition-colors hover:text-white"
          >
            {item.label}
          </a>
        ))}
      </div>
      <div className="flex items-center gap-4">
        <a
          href="#preview"
          className="hidden text-sm font-medium text-[#E6F7F6] md:block hover:text-[#7AF5E8] transition-colors"
        >
          Live Preview
        </a>
        <a
          href="#waitlist"
          className="group relative overflow-hidden rounded-full bg-[#1BA99C] px-5 py-2 text-sm font-semibold text-black transition-all hover:scale-105 hover:bg-[#23C9B9]"
        >
          <span className="relative z-10">Get Early Access</span>
          <div className="absolute inset-0 z-0 bg-gradient-to-r from-transparent via-white/30 to-transparent translate-x-[-100%] group-hover:animate-[shimmer_1.5s_infinite]" />
        </a>
      </div>
    </nav>
  );
}

type HeroPhase = "globe" | "map";

function HeroSection({ onEnterMap }: { onEnterMap: () => void }) {
  const webgl = useMemo(() => isWebGLAvailable(), []);
  const [phase, setPhase] = useState<HeroPhase>(webgl ? "globe" : "map");
  const [transitioning, setTransitioning] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  // If no WebGL, trigger navbar immediately on mount
  useEffect(() => {
    if (!webgl) onEnterMap();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    const { left, top, width, height } =
      containerRef.current.getBoundingClientRect();
    setMousePos({
      x: (e.clientX - left) / width - 0.5,
      y: (e.clientY - top) / height - 0.5,
    });
  };

  const handleReveal = useCallback(() => {
    if (transitioning || phase === "map") return;
    setTransitioning(true);
    setTimeout(() => {
      setPhase("map");
      setTransitioning(false);
      onEnterMap();
    }, 800);
  }, [transitioning, phase, onEnterMap]);

  const handleWebGLError = useCallback(() => {
    setPhase("map");
    setTransitioning(false);
    onEnterMap();
  }, [onEnterMap]);

  const revealToSection = useCallback(
    (id: string) => {
      if (phase === "map") {
        scrollToSection(id);
        return;
      }

      if (transitioning) return;
      setTransitioning(true);
      setTimeout(() => {
        setPhase("map");
        setTransitioning(false);
        onEnterMap();
        setTimeout(() => scrollToSection(id), 250);
      }, 800);
    },
    [phase, transitioning, onEnterMap],
  );

  return (
    <section
      id="hero"
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className="relative flex min-h-screen items-center overflow-hidden"
    >
      {/* Background Grid */}
      <div className="absolute inset-0 z-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_40%,#000_20%,transparent_100%)]" />

      {/* Ambient glow — shifts position between globe/map phase */}
      <motion.div
        className="absolute z-0 h-[60vh] w-[60vw] rounded-full bg-[#23C9B9] opacity-[0.06] blur-[120px] pointer-events-none"
        animate={{ left: phase === "globe" ? "20%" : "35%", top: "20%" }}
        transition={{ duration: 1.4, ease: [0.4, 0, 0.2, 1] }}
      />

      {/* ── GLOBE PHASE — fills entire hero section ── */}
      <AnimatePresence>
        {phase === "globe" && (
          <motion.div
            key="globe-phase"
            className="absolute inset-0 z-10"
            exit={{
              opacity: 0,
              scale: 0.92,
              transition: { duration: 1.0, ease: [0.4, 0, 0.2, 1] },
            }}
          >
            {/* Globe canvas fills section completely */}
            <GlobeScene
              onClick={handleReveal}
              transitioning={transitioning}
              onWebGLError={handleWebGLError}
            />

            {/* CTAs pinned to bottom-center, overlaid on globe */}
            <div className="absolute bottom-0 left-0 right-0 flex flex-col items-center gap-4 pb-14 pointer-events-none">
              <motion.p
                className="text-[10px] tracking-[0.28em] uppercase text-[#23C9B9]/55 pointer-events-none"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 2.2, duration: 1.1 }}
              >
                Click globe to explore
              </motion.p>

              <motion.div
                className="flex items-center gap-4 pointer-events-auto"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 2.8, duration: 0.8 }}
              >
                <button
                  onClick={() => revealToSection("waitlist")}
                  className="group flex items-center gap-2 rounded-full bg-gradient-to-r from-[#23C9B9] to-[#1BA99C] px-7 py-3.5 text-sm font-semibold text-black transition-all hover:scale-105 hover:shadow-[0_0_28px_rgba(35,201,185,0.4)]"
                >
                  Get Early Access
                  <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </button>
                <button
                  onClick={() => revealToSection("preview")}
                  className="group flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-7 py-3.5 text-sm font-medium text-white backdrop-blur-md transition-all hover:bg-white/10"
                >
                  <Play className="h-3.5 w-3.5 fill-white/80" />
                  View Demo
                </button>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── MAP PHASE ── */}
      {phase === "map" && (
        <>
          {/* Map */}
          <motion.div
            className="absolute right-6 lg:right-12 top-0 bottom-0 w-[58%] z-0 pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.1, delay: 0.35 }}
            style={{
              transform: `translate3d(${mousePos.x * 18}px, ${mousePos.y * 12}px, 0)`,
            }}
          >
            <AnimatedWorldMap />
          </motion.div>

          {/* Left gradient */}
          <div
            className="absolute inset-0 z-[1] bg-gradient-to-r from-[#05070A] via-[#05070A]/85 to-transparent pointer-events-none"
            style={{ width: "55%" }}
          />

          {/* Hero text */}
          <div className="relative z-10 mx-auto w-full max-w-7xl px-6 lg:px-12 pt-24">
            <motion.div
              className="flex flex-col items-start gap-8 max-w-xl"
              initial={{ opacity: 0, x: -28 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.85, delay: 0.5, ease: "easeOut" }}
              style={{
                transform: `translate3d(${mousePos.x * -20}px, ${mousePos.y * -20}px, 0)`,
              }}
            >
              <div className="inline-flex items-center gap-2 rounded-full border border-[#23C9B9]/30 bg-[#23C9B9]/10 px-3 py-1 text-xs font-medium text-[#7AF5E8]">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#7AF5E8] opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-[#7AF5E8]" />
                </span>
                SEE EVERYTHING. STORE NOTHING.
              </div>

              <h1 className="text-5xl font-semibold leading-[1.1] tracking-tight text-white sm:text-6xl lg:text-7xl">
                See everything happening inside your product{" "}
                <span className="bg-gradient-to-r from-[#23C9B9] to-[#0F7F78] bg-clip-text text-transparent">
                  — live.
                </span>
              </h1>

              <p className="max-w-lg text-lg text-[#9FB3B8] sm:text-xl">
                CroVew gives you real-time visibility into user activity,
                sessions, and engagement without heavy analytics complexity.
              </p>

              <div className="flex flex-col w-full sm:flex-row sm:w-auto items-center gap-4">
                <button
                  onClick={() => scrollToSection("waitlist")}
                  className="group w-full sm:w-auto flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#23C9B9] to-[#1BA99C] px-8 py-4 text-base font-semibold text-black transition-all hover:scale-105 hover:shadow-[0_0_30px_rgba(35,201,185,0.4)]"
                >
                  Get Early Access
                  <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </button>
                <button
                  onClick={() => scrollToSection("preview")}
                  className="group w-full sm:w-auto flex items-center justify-center gap-2 rounded-full border border-white/10 bg-white/5 px-8 py-4 text-base font-medium text-white backdrop-blur-md transition-all hover:bg-white/10"
                >
                  <Play className="h-4 w-4 fill-white/80 transition-transform group-hover:scale-110" />
                  View Demo
                </button>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </section>
  );
}

const FEATURES = [
  {
    icon: Activity,
    title: "Real-time Event Stream",
    description:
      "See exactly what users are doing live as it happens. Watch your product heartbeat.",
  },
  {
    icon: MousePointerClick,
    title: "Session Insights",
    description:
      "Understand user journeys, identify friction points, and see drop-offs immediately.",
  },
  {
    icon: Globe,
    title: "Geo Analytics",
    description:
      "Visualize globally where your users are coming from and how they interact.",
  },
  {
    icon: Code,
    title: "Lightweight SDK",
    description:
      "Integrate in minutes with our zero-dependency SDK. Zero performance impact.",
  },
  {
    icon: ShieldCheck,
    title: "Privacy First",
    description:
      "See behavior patterns without storing invasive PII data. Store nothing long-term.",
  },
  {
    icon: Terminal,
    title: "Developer Friendly",
    description:
      "Clean API, comprehensive docs, and webhooks to trigger your own workflows.",
  },
];

function FeaturesSection() {
  return (
    <section id="product" className="relative py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-12">
        <div className="mb-16 max-w-2xl">
          <h2 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl mb-4">
            Omniscient visibility.
            <br />
            Zero complexity.
          </h2>
          <p className="text-lg text-[#9FB3B8]">
            Built for solo founders and early SaaS teams that need a live user
            view before they need a full analytics stack.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((feat, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="group relative rounded-2xl border border-white/5 bg-[#0B0F14] p-8 transition-all hover:-translate-y-1 hover:border-[#23C9B9]/30 hover:shadow-[0_10px_30px_rgba(35,201,185,0.1)]"
            >
              <div className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-white/5 text-[#23C9B9] transition-colors group-hover:bg-[#23C9B9]/10 group-hover:text-[#7AF5E8]">
                <feat.icon className="h-6 w-6" />
              </div>
              <h3 className="mb-3 text-xl font-medium text-white">
                {feat.title}
              </h3>
              <p className="text-sm leading-relaxed text-[#6B7C80]">
                {feat.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function PreviewSection() {
  return (
    <section id="preview" className="relative py-24 overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[600px] bg-[#23C9B9]/5 blur-[150px] pointer-events-none" />

      <div className="mx-auto max-w-7xl px-6 lg:px-12 relative z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="rounded-xl border border-white/10 bg-[#0B0F14]/80 p-2 shadow-2xl backdrop-blur-xl"
        >
          {/* Mac window header */}
          <div className="flex items-center gap-2 px-4 py-3 border-b border-white/5 bg-[#0F1720]/50 rounded-t-lg">
            <div className="flex gap-1.5">
              <div className="h-3 w-3 rounded-full bg-red-500/80" />
              <div className="h-3 w-3 rounded-full bg-yellow-500/80" />
              <div className="h-3 w-3 rounded-full bg-green-500/80" />
            </div>
            <div className="mx-auto flex h-6 items-center rounded-md bg-black/40 px-3 text-[10px] text-[#6B7C80]">
              crovew.com/app/live
            </div>
          </div>

          {/* Dashboard body */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 p-4 lg:p-6 bg-black/20 rounded-b-lg min-h-[400px]">
            {/* Sidebar / Stats */}
            <div className="flex flex-col gap-4">
              <div className="rounded-lg border border-white/5 bg-[#0B0F14] p-4">
                <div className="text-xs text-[#6B7C80] mb-1">
                  Active Users (Live)
                </div>
                <div className="text-4xl font-semibold text-white flex items-center gap-3">
                  <motion.span
                    animate={{ opacity: [1, 0.5, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    1,284
                  </motion.span>
                  <Activity className="h-5 w-5 text-[#23C9B9] animate-pulse" />
                </div>
              </div>
              <div className="rounded-lg border border-white/5 bg-[#0B0F14] p-4 flex-1">
                <div className="text-xs text-[#6B7C80] mb-4">Live Traffic</div>
                <div className="flex items-end gap-1 h-32">
                  {PREVIEW_BARS.map((bar, i) => (
                      <motion.div
                        key={i}
                        className="w-full bg-[#23C9B9]/20 rounded-t-sm relative"
                        style={{ height: `${bar.value}%` }}
                        animate={{
                          height: [
                            `${bar.value}%`,
                            `${bar.peak}%`,
                            `${bar.value}%`,
                          ],
                        }}
                        transition={{
                          duration: bar.duration,
                          repeat: Infinity,
                        }}
                      >
                        <div className="absolute top-0 left-0 right-0 h-1 bg-[#23C9B9] rounded-t-sm" />
                      </motion.div>
                    ))}
                </div>
              </div>
            </div>

            {/* Main Feed */}
            <div className="lg:col-span-3 rounded-lg border border-white/5 bg-[#0B0F14] p-4 lg:p-6 overflow-hidden relative">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-sm font-medium text-white">
                  Live Event Feed
                </h3>
                <div className="flex items-center gap-2 text-xs text-[#23C9B9]">
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#23C9B9] opacity-75"></span>
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-[#23C9B9]"></span>
                  </span>
                  Receiving events...
                </div>
              </div>

              <div className="flex flex-col gap-3 relative z-10">
                {MOCK_EVENTS.map((event, i) => (
                  <motion.div
                    key={event.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.2 }}
                    className="flex items-center justify-between rounded-md border border-white/5 bg-[#0F1720]/50 p-3 hover:bg-[#0F1720]"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`flex h-8 w-8 items-center justify-center rounded-md ${event.bg} ${event.color}`}
                      >
                        <event.icon className="h-4 w-4" />
                      </div>
                      <div>
                        <div className="text-sm font-medium text-white">
                          {event.action}
                        </div>
                        <div className="text-xs text-[#6B7C80]">
                          {event.user}
                        </div>
                      </div>
                    </div>
                    <div className="text-xs text-[#6B7C80] font-mono">
                      {event.time}
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Fade out bottom */}
              <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[#0B0F14] to-transparent z-20" />
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function HowItWorksSection() {
  const steps = [
    {
      num: "01",
      title: "Install SDK",
      desc: "Drop in one script tag and start tracking pageviews and sessions in minutes.",
    },
    {
      num: "02",
      title: "Identify And Track",
      desc: "Call identify() and track() only where you need product-level signal.",
    },
    {
      num: "03",
      title: "Visualize Behavior",
      desc: "See live users, event stream, geo presence, retention, and peak activity in one view.",
    },
  ];

  return (
    <section className="py-24 border-t border-white/5">
      <div className="mx-auto max-w-7xl px-6 lg:px-12">
        <h2 className="text-3xl font-semibold tracking-tight text-white mb-16 text-center">
          Three steps to total visibility
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {/* Connecting line desktop */}
          <div className="hidden md:block absolute top-6 left-[15%] right-[15%] h-[1px] bg-gradient-to-r from-transparent via-[#23C9B9]/30 to-transparent" />

          {steps.map((step, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.2 }}
              className="relative flex flex-col items-center text-center group"
            >
              <div className="w-12 h-12 rounded-full bg-[#0B0F14] border border-[#23C9B9]/30 text-[#7AF5E8] flex items-center justify-center font-mono text-sm mb-6 relative z-10 shadow-[0_0_15px_rgba(35,201,185,0)] group-hover:shadow-[0_0_20px_rgba(35,201,185,0.2)] transition-all">
                {step.num}
              </div>
              <h3 className="text-lg font-medium text-white mb-2">
                {step.title}
              </h3>
              <p className="text-sm text-[#9FB3B8] max-w-xs">{step.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function DocsSection() {
  return (
    <section id="docs" className="border-t border-white/5 py-24">
      <div className="mx-auto grid max-w-7xl gap-10 px-6 lg:grid-cols-[1.1fr_0.9fr] lg:px-12">
        <div>
          <p className="mb-4 text-xs font-medium uppercase tracking-[0.3em] text-[#7AF5E8]/70">
            Quick Start
          </p>
          <h2 className="mb-4 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            Ship CroVew before the bigger analytics stack.
          </h2>
          <p className="max-w-2xl text-lg text-[#9FB3B8]">
            The MVP brief is clear: integrate in under 5 minutes, see useful
            signal immediately, and avoid collecting anything you did not
            explicitly ask for.
          </p>

          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {[
              {
                icon: Code,
                title: "Tiny SDK",
                body: "Script tag install, SPA pageviews, heartbeats, sendBeacon on close, batching and retry.",
              },
              {
                icon: KeyRound,
                title: "Project Keys",
                body: "Each product gets its own project_id and API key with clean tenant isolation.",
              },
              {
                icon: Shield,
                title: "Privacy By Default",
                body: "No passwords, payment details, keystrokes, GPS coordinates, or hidden PII capture.",
              },
              {
                icon: Users,
                title: "Founder-first",
                body: "Live user panel, event stream, geo presence, and retention without analytics-engineer overhead.",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="rounded-2xl border border-white/5 bg-[#0B0F14] p-5"
              >
                <item.icon className="mb-4 h-5 w-5 text-[#23C9B9]" />
                <h3 className="mb-2 text-base font-medium text-white">
                  {item.title}
                </h3>
                <p className="text-sm leading-relaxed text-[#9FB3B8]">
                  {item.body}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-[#0B0F14]/90 p-6 shadow-2xl">
          <div className="mb-4 flex items-center justify-between">
            <span className="text-sm font-medium text-white">
              Install snippet
            </span>
            <a
              href="https://github.com/Ashish-khanagwal/crovew"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 text-sm text-[#7AF5E8] transition-colors hover:text-white"
            >
              GitHub
              <ArrowUpRight className="h-3.5 w-3.5" />
            </a>
          </div>
          <pre className="overflow-x-auto rounded-xl border border-white/5 bg-black/30 p-4 text-sm leading-7 text-[#E6F7F6]">
            <code>{`<script src="https://cdn.crovew.com/sdk.js"></script>
<script>
  CroVew.init({ projectId: "proj_live_xxx" })
  CroVew.identify("user_123", { plan: "pro" })
  CroVew.track("upgrade_clicked", { source: "pricing" })
</script>`}</code>
          </pre>

          <div className="mt-5 space-y-3">
            {[
              "Auto pageview tracking across routes",
              "Online / away / offline live presence",
              "Retention cohorts from D0 to D30",
              "Country and city visibility without exact location",
            ].map((item) => (
              <div
                key={item}
                className="flex items-start gap-3 text-sm text-[#9FB3B8]"
              >
                <span className="mt-1 h-2 w-2 rounded-full bg-[#23C9B9]" />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function PricingSection() {
  return (
    <section id="pricing" className="border-t border-white/5 py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-12">
        <div className="mb-14 max-w-2xl">
          <p className="mb-4 text-xs font-medium uppercase tracking-[0.3em] text-[#7AF5E8]/70">
            Pricing
          </p>
          <h2 className="mb-4 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            Start free while you find your signal.
          </h2>
          <p className="text-lg text-[#9FB3B8]">
            The brief positions CroVew as the analytics layer founders install
            before they have the time or scale for heavier tools.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {[
            {
              name: "Starter",
              price: "Free",
              desc: "For solo builders validating a new product.",
              points: ["1 project", "Live user panel", "Event stream", "Geo visibility"],
              featured: false,
            },
            {
              name: "Growth",
              price: "Coming soon",
              desc: "For teams that need more seats, exports, and alerts.",
              points: ["Multiple projects", "Email + Slack alerts", "CSV export", "Custom dashboards"],
              featured: true,
            },
            {
              name: "Scale",
              price: "Roadmap",
              desc: "For privacy-sensitive and self-hosting teams.",
              points: ["Postgres migration", "SSO", "Self-hosting", "White-label embed"],
              featured: false,
            },
          ].map((plan) => (
            <div
              key={plan.name}
              className={`rounded-2xl border p-7 ${
                plan.featured
                  ? "border-[#23C9B9]/40 bg-[#0F1720]"
                  : "border-white/5 bg-[#0B0F14]"
              }`}
            >
              <div className="mb-6 flex items-center justify-between">
                <h3 className="text-xl font-medium text-white">{plan.name}</h3>
                {plan.featured && (
                  <span className="rounded-full border border-[#23C9B9]/30 bg-[#23C9B9]/10 px-3 py-1 text-xs font-medium text-[#7AF5E8]">
                    Most likely next
                  </span>
                )}
              </div>
              <div className="mb-2 text-3xl font-semibold text-white">
                {plan.price}
              </div>
              <p className="mb-6 text-sm leading-relaxed text-[#9FB3B8]">
                {plan.desc}
              </p>
              <div className="space-y-3 text-sm text-[#E6F7F6]">
                {plan.points.map((point) => (
                  <div key={point} className="flex items-start gap-3">
                    <span className="mt-1 h-2 w-2 rounded-full bg-[#23C9B9]" />
                    <span>{point}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function SocialProofSection() {
  return (
    <section className="py-16">
      <div className="mx-auto max-w-7xl px-6 lg:px-12 text-center">
        <p className="text-sm font-medium text-[#6B7C80] mb-8 uppercase tracking-widest">
          Built for the people shipping before they have an analytics team
        </p>
        <div className="flex flex-wrap justify-center gap-4 md:gap-5">
          {[
            "Solo founders",
            "Indie hackers",
            "Early-stage SaaS teams",
            "Product engineers",
            "Growth operators",
          ].map((label) => (
            <div
              key={label}
              className="rounded-full border border-white/10 bg-white/5 px-5 py-3 text-sm font-medium text-[#E6F7F6]"
            >
              {label}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function RoadmapSection() {
  return (
    <section id="roadmap" className="border-t border-white/5 py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-12">
        <div className="mb-14 max-w-2xl">
          <p className="mb-4 text-xs font-medium uppercase tracking-[0.3em] text-[#7AF5E8]/70">
            Roadmap
          </p>
          <h2 className="mb-4 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            What ships after the MVP earns real usage.
          </h2>
          <p className="text-lg text-[#9FB3B8]">
            The product document already defines the sequence: signal first,
            depth next, scale after that.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {[
            {
              icon: Activity,
              phase: "Phase 2",
              title: "Signal",
              body: "Churn risk scoring, power-user detection, funnel analysis, property filtering, Slack alerts.",
            },
            {
              icon: BarChart3,
              phase: "Phase 3",
              title: "Depth",
              body: "Feature adoption, privacy-safe session replay, A/B visibility, custom dashboards, CSV export, APIs.",
            },
            {
              icon: Clock3,
              phase: "Phase 4",
              title: "Scale",
              body: "Postgres, self-hosting, npm SDK, SSO, team seats, white-label embed, usage-based billing.",
            },
          ].map((item) => (
            <div
              key={item.phase}
              className="rounded-2xl border border-white/5 bg-[#0B0F14] p-7"
            >
              <item.icon className="mb-5 h-5 w-5 text-[#23C9B9]" />
              <p className="mb-2 text-xs font-medium uppercase tracking-[0.24em] text-[#7AF5E8]/70">
                {item.phase}
              </p>
              <h3 className="mb-3 text-xl font-medium text-white">
                {item.title}
              </h3>
              <p className="text-sm leading-relaxed text-[#9FB3B8]">
                {item.body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function EcosystemSection() {
  return (
    <section id="company" className="border-t border-white/5 py-24">
      <div className="mx-auto grid max-w-7xl gap-10 px-6 lg:grid-cols-[0.95fr_1.05fr] lg:px-12">
        <div>
          <p className="mb-4 text-xs font-medium uppercase tracking-[0.3em] text-[#7AF5E8]/70">
            Ecosystem
          </p>
          <h2 className="mb-4 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            CroVew sits inside the broader Croovi operating layer.
          </h2>
          <p className="text-lg text-[#9FB3B8]">
            Your brand board already frames the story well: Croovi is the
            platform, CroFlux handles project and task flow, CroFx handles
            automation, and CroVew provides visibility.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          {[
            {
              name: "Croovi",
              role: "Platform",
              accent: "from-fuchsia-400 to-violet-500",
            },
            {
              name: "CroFlux",
              role: "Project & Task",
              accent: "from-violet-400 to-purple-500",
            },
            {
              name: "CroVew",
              role: "Visibility",
              accent: "from-[#23C9B9] to-[#0F7F78]",
            },
          ].map((item) => (
            <div
              key={item.name}
              className="rounded-2xl border border-white/5 bg-[#0B0F14] p-6"
            >
              <div
                className={`mb-5 h-1.5 w-16 rounded-full bg-gradient-to-r ${item.accent}`}
              />
              <h3 className="mb-2 text-xl font-medium text-white">
                {item.name}
              </h3>
              <p className="text-sm text-[#9FB3B8]">{item.role}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CTASection() {
  return (
    <section id="waitlist" className="py-32 relative overflow-hidden">
      <div className="absolute inset-0 bg-[#23C9B9]/5 [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_20%,transparent_100%)]" />

      <div className="mx-auto max-w-3xl px-6 relative z-10 text-center flex flex-col items-center">
        <div
          className="mb-8"
          style={{
            filter:
              "drop-shadow(0 0 24px rgba(35,201,185,0.7)) drop-shadow(0 0 50px rgba(122,245,232,0.3))",
          }}
        >
          <img
            src={crovewLogo}
            alt="CroVew"
            style={{ width: 130, height: "auto" }}
          />
        </div>
        <h2 className="text-4xl font-semibold tracking-tight text-white sm:text-5xl mb-6">
          Start seeing your product
          <br />
          through your users' eyes
        </h2>
        <p className="text-lg text-[#9FB3B8] mb-10">
          Join the early-access list for the MVP: live users, event stream,
          geo presence, retention cohorts, and a tiny SDK built for founders.
        </p>
        <div className="flex flex-col items-center gap-4 sm:flex-row">
          <a
            href="https://github.com/Ashish-khanagwal/crovew"
            target="_blank"
            rel="noreferrer"
            className="group relative overflow-hidden rounded-full bg-white px-8 py-4 text-base font-semibold text-black transition-all hover:scale-105 hover:shadow-[0_0_40px_rgba(255,255,255,0.3)]"
          >
            <span className="relative z-10 inline-flex items-center gap-2">
              View Project
              <ArrowUpRight className="h-4 w-4" />
            </span>
            <div className="absolute inset-0 z-0 bg-gradient-to-r from-transparent via-[#23C9B9]/20 to-transparent translate-x-[-100%] group-hover:animate-[shimmer_1.5s_infinite]" />
          </a>
          <a
            href="#docs"
            className="rounded-full border border-white/10 bg-white/5 px-8 py-4 text-base font-medium text-white transition-all hover:bg-white/10"
          >
            Read The MVP
          </a>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-white/5 py-12">
      <div className="mx-auto max-w-7xl px-6 lg:px-12 flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex items-center gap-2">
          <div style={{ filter: "drop-shadow(0 0 5px rgba(35,201,185,0.4))" }}>
            <img
              src={crovewLogo}
              alt="CroVew"
              style={{ width: 52, height: "auto" }}
            />
          </div>
          <span className="text-lg font-bold tracking-tight text-white">
            CroVew
          </span>
        </div>

        <div className="flex flex-wrap justify-center gap-6 text-sm text-[#6B7C80]">
          <a href="#product" className="hover:text-white transition-colors">
            Product
          </a>
          <a href="#docs" className="hover:text-white transition-colors">
            Docs
          </a>
          <a href="#pricing" className="hover:text-white transition-colors">
            Pricing
          </a>
          <a href="#roadmap" className="hover:text-white transition-colors">
            Roadmap
          </a>
          <a href="#company" className="hover:text-white transition-colors">
            Company
          </a>
        </div>

        <div className="text-sm text-[#6B7C80]">
          © 2025 CroVew. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
