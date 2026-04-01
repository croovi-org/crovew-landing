import { motion } from "framer-motion";

type ProductCardProps = {
  accent: string;
  body: string;
  delay: number;
  description: string;
  glowColor?: string;
  href?: string;
  logo: React.ReactNode;
  title: string;
};

function CrooviLogo() {
  return (
    <svg viewBox="0 0 120 120" className="h-14 w-14" aria-hidden="true">
      <defs>
        <linearGradient id="crooviGradient" x1="15" y1="14" x2="100" y2="105">
          <stop offset="0%" stopColor="#F39BFF" />
          <stop offset="55%" stopColor="#A856FF" />
          <stop offset="100%" stopColor="#5DA8FF" />
        </linearGradient>
      </defs>
      <path
        d="M88.7 23.1c-8.1-7.3-18.4-11.5-29.8-11.5-24.8 0-44.9 20.1-44.9 44.9S34.1 101.4 58.9 101.4c11.8 0 22.5-4.6 30.6-12.1-7.7 4.7-16.8 7.4-26.6 7.4-27.9 0-42.9-18.2-42.9-40.2S35 16.3 62.9 16.3c9.6 0 18.5 2.6 25.8 6.8Z"
        fill="url(#crooviGradient)"
      />
      <path
        d="M80.1 24.7c8.4 4.9 14.7 13.2 17.5 23.2-1-16.1-14.4-28.8-30.8-28.8-8.4 0-16.1 3.3-21.7 8.7 4.8-2.7 10.5-4.3 16.7-4.3 6.6 0 12.7 1.8 18.3 5.2Z"
        fill="#F5C6FF"
        fillOpacity="0.72"
      />
      <path
        d="M39.5 91.4C30 86.2 23.1 76.6 20.8 65.3c.3 18.1 15.1 32.5 33.3 32.5 9 0 17.2-3.5 23.2-9.3-5.1 3-11.1 4.8-17.5 4.8-7.2 0-13.9-2.2-20.3-6.1Z"
        fill="#6DBEFF"
        fillOpacity="0.75"
      />
    </svg>
  );
}

function StackLogo({ tone }: { tone: "flux" | "fx" }) {
  const primary = tone === "flux" ? "#D989FF" : "#FFD15C";
  const secondary = tone === "flux" ? "#745CFF" : "#FF8A34";
  const glow = tone === "flux" ? "#F2A7FF" : "#FFE08A";

  return (
    <svg viewBox="0 0 96 84" className="h-14 w-16" aria-hidden="true">
      <defs>
        <linearGradient
          id={`stackGradient-${tone}`}
          x1="8"
          y1="6"
          x2="82"
          y2="76"
        >
          <stop offset="0%" stopColor={glow} />
          <stop offset="45%" stopColor={primary} />
          <stop offset="100%" stopColor={secondary} />
        </linearGradient>
      </defs>
      <rect
        x="34"
        y="2"
        width="28"
        height="22"
        rx="6"
        fill={`url(#stackGradient-${tone})`}
      />
      <rect
        x="10"
        y="28"
        width="24"
        height="20"
        rx="6"
        fill={`url(#stackGradient-${tone})`}
      />
      <rect
        x="36"
        y="30"
        width="30"
        height="24"
        rx="6"
        fill={`url(#stackGradient-${tone})`}
      />
      <rect
        x="68"
        y="12"
        width="18"
        height="18"
        rx="5"
        fill={`url(#stackGradient-${tone})`}
      />
      <rect
        x="28"
        y="62"
        width="18"
        height="12"
        rx="5"
        fill={`url(#stackGradient-${tone})`}
      />
    </svg>
  );
}

function ProductCard({
  accent,
  body,
  delay,
  description,
  glowColor,
  href,
  logo,
  title,
}: ProductCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 28, scale: 0.98 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, amount: 0.4 }}
      transition={{ duration: 0.75, delay, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ y: -6, scale: 1.015 }}
      className="group relative overflow-hidden rounded-[24px] border border-white/10 bg-white/[0.04] p-5 backdrop-blur-xl"
      style={{
        boxShadow:
          "0 22px 80px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.04)",
      }}
    >
      <div
        className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${accent} opacity-[0.12] blur-2xl transition-opacity duration-500 group-hover:opacity-[0.22]`}
      />
      <div className="pointer-events-none absolute inset-[1px] rounded-[23px] border border-white/5" />
      {glowColor ? (
        <motion.div
          className="pointer-events-none absolute inset-0 rounded-[24px]"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: [0, 1, 0.72] }}
          viewport={{ once: true, amount: 0.55 }}
          transition={{
            duration: 0.75,
            delay: delay + 0.62,
            times: [0, 0.55, 1],
            ease: [0.16, 1, 0.3, 1],
          }}
          style={{
            border: `1px solid ${glowColor}`,
            boxShadow: `0 0 0 1px ${glowColor} inset, 0 0 22px ${glowColor}, 0 0 44px ${glowColor}33`,
          }}
        />
      ) : null}
      <div className="relative z-10 flex flex-col items-center text-center">
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-[20px] border border-white/10 bg-black/20 shadow-[0_0_30px_rgba(255,255,255,0.02)]">
          {logo}
        </div>
        <h3 className="text-xl font-semibold tracking-tight text-white md:text-[1.35rem]">
          {title}
        </h3>
        <p className="mt-1.5 text-[11px] font-medium uppercase tracking-[0.22em] text-[#E6F7F6]/68">
          {description}
        </p>
        <p className="mt-3 max-w-[26ch] text-sm leading-6 text-[#9FB3B8]">
          {body}
        </p>
        {href ? (
          <a
            href={href}
            target="_blank"
            rel="noreferrer"
            className="mt-4 inline-flex items-center rounded-full border border-white/10 bg-white/6 px-4 py-2 text-xs font-medium uppercase tracking-[0.18em] text-white transition-all hover:border-white/20 hover:bg-white/10"
          >
            Visit
          </a>
        ) : null}
      </div>
    </motion.div>
  );
}

function ConnectorLines() {
  return (
    <motion.svg
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, amount: 0.5 }}
      transition={{ duration: 0.4, delay: 0.35 }}
      viewBox="0 0 1000 520"
      className="pointer-events-none absolute inset-x-0 top-[112px] hidden h-[430px] w-full md:block"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="ecosystemConnectorFlux" x1="40%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#A856FF" />
          <stop offset="55%" stopColor="#D989FF" />
          <stop offset="100%" stopColor="#F2A7FF" />
        </linearGradient>
        <linearGradient id="ecosystemConnectorFx" x1="60%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFB347" />
          <stop offset="55%" stopColor="#FFD15C" />
          <stop offset="100%" stopColor="#FF8A34" />
        </linearGradient>
        <filter id="ecosystemGlowFlux">
          <feGaussianBlur stdDeviation="5" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <filter id="ecosystemGlowFx">
          <feGaussianBlur stdDeviation="5" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      <motion.path
        d="M415 170 C382 230 318 308 242 414"
        fill="none"
        stroke="url(#ecosystemConnectorFlux)"
        strokeWidth="2.8"
        strokeLinecap="round"
        strokeDasharray="1 11"
        filter="url(#ecosystemGlowFlux)"
        initial={{ pathLength: 0, opacity: 0.16 }}
        whileInView={{ pathLength: 1, opacity: 0.8 }}
        viewport={{ once: true, amount: 0.45 }}
        transition={{
          duration: 1.02,
          delay: 0.46,
          ease: [0.16, 1, 0.3, 1],
        }}
      />
      <motion.path
        d="M585 170 C618 230 682 308 758 414"
        fill="none"
        stroke="url(#ecosystemConnectorFx)"
        strokeWidth="2.8"
        strokeLinecap="round"
        strokeDasharray="1 11"
        filter="url(#ecosystemGlowFx)"
        initial={{ pathLength: 0, opacity: 0.16 }}
        whileInView={{ pathLength: 1, opacity: 0.8 }}
        viewport={{ once: true, amount: 0.45 }}
        transition={{
          duration: 1.02,
          delay: 0.62,
          ease: [0.16, 1, 0.3, 1],
        }}
      />
    </motion.svg>
  );
}

export function EcosystemMap() {
  return (
    <section id="company" className="relative overflow-hidden border-t border-white/5 py-18 md:py-20">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_15%,rgba(171,86,255,0.16),transparent_32%),radial-gradient(circle_at_20%_65%,rgba(86,228,255,0.08),transparent_26%),radial-gradient(circle_at_82%_66%,rgba(255,170,92,0.09),transparent_24%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.018)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.018)_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(circle_at_center,#000_35%,transparent_92%)]" />

      <div className="relative mx-auto max-w-5xl px-6 lg:px-12">
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.35 }}
          transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
          className="mx-auto max-w-4xl text-center"
        >
          <p className="mb-4 text-xs font-medium uppercase tracking-[0.32em] text-[#7AF5E8]/70">
            Ecosystem Architecture
          </p>
          <h2 className="mx-auto max-w-3xl text-3xl font-semibold tracking-tight text-white sm:text-4xl lg:text-[3.2rem] lg:leading-[1.02]">
            CroVew fits inside the Croovi execution stack
          </h2>
        </motion.div>

        <div className="relative mt-8 md:mt-10">
          <ConnectorLines />

          <div className="mx-auto max-w-[320px] md:max-w-[340px]">
            <ProductCard
              title="Croovi"
              description="Platform Layer"
              body="The operating layer that holds planning, context, product direction, and decision flow together."
              delay={0.12}
              accent="from-fuchsia-400/50 via-violet-400/35 to-cyan-400/20"
              logo={<CrooviLogo />}
            />
          </div>

          <div className="mt-6 grid gap-4 md:mt-10 md:grid-cols-2 md:gap-6">
            <ProductCard
              title="CroFlux"
              description="Project & Execution"
              body="Turns strategy into structured work through projects, tasks, ownership, and execution flow."
              delay={0.52}
              glowColor="#D989FF"
              href="https://croflux.vercel.app/"
              accent="from-fuchsia-300/45 via-violet-400/35 to-indigo-500/22"
              logo={<StackLogo tone="flux" />}
            />
            <ProductCard
              title="CrooFx"
              description="AI Automation"
              body="Automates repetitive development workflows so teams can move faster with less manual overhead."
              delay={0.66}
              glowColor="#FFBE4A"
              href="https://www.croovi.com/"
              accent="from-amber-300/42 via-orange-400/30 to-fuchsia-500/16"
              logo={<StackLogo tone="fx" />}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
