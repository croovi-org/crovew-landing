"use client";

import { motion } from "framer-motion";

const crooviSymbol = "/assets/croovi-symbol.png";
const crovewLogo = "/assets/crovew-logo-cropped.png";

type EcosystemCardProps = {
  badge?: string;
  body: string;
  cardClassName?: string;
  description: string;
  href?: string;
  iconBgClassName: string;
  labelClassName: string;
  logo: React.ReactNode;
  title: string;
};

function StackLogo({ tone }: { tone: "flux" | "fx" }) {
  const primary = tone === "flux" ? "#D989FF" : "#FFD15C";
  const secondary = tone === "flux" ? "#745CFF" : "#FF8A34";
  const glow = tone === "flux" ? "#F2A7FF" : "#FFE08A";

  return (
    <svg viewBox="0 0 96 84" className="h-[18px] w-[18px]" aria-hidden="true">
      <defs>
        <linearGradient
          id={`ecosystemStackGradient-${tone}`}
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
        fill={`url(#ecosystemStackGradient-${tone})`}
      />
      <rect
        x="10"
        y="28"
        width="24"
        height="20"
        rx="6"
        fill={`url(#ecosystemStackGradient-${tone})`}
      />
      <rect
        x="36"
        y="30"
        width="30"
        height="24"
        rx="6"
        fill={`url(#ecosystemStackGradient-${tone})`}
      />
      <rect
        x="68"
        y="12"
        width="18"
        height="18"
        rx="5"
        fill={`url(#ecosystemStackGradient-${tone})`}
      />
      <rect
        x="28"
        y="62"
        width="18"
        height="12"
        rx="5"
        fill={`url(#ecosystemStackGradient-${tone})`}
      />
    </svg>
  );
}

function CroovewEyeIcon() {
  return (
    <svg viewBox="0 0 18 18" className="h-[18px] w-[18px]" aria-hidden="true">
      <ellipse
        cx="9"
        cy="9"
        rx="7"
        ry="4.5"
        stroke="#23C9B9"
        strokeWidth="1.4"
      />
      <circle cx="9" cy="9" r="2" fill="#23C9B9" opacity="0.9" />
      <line
        x1="5.5"
        y1="5.5"
        x2="7.5"
        y2="7.5"
        stroke="#23C9B9"
        strokeWidth="1"
        opacity="0.4"
      />
      <line
        x1="12.5"
        y1="5.5"
        x2="10.5"
        y2="7.5"
        stroke="#23C9B9"
        strokeWidth="1"
        opacity="0.4"
      />
    </svg>
  );
}

function EcosystemCard({
  badge,
  body,
  cardClassName,
  description,
  href,
  iconBgClassName,
  labelClassName,
  logo,
  title,
}: EcosystemCardProps) {
  return (
    <div
      className={`group relative flex h-full flex-col rounded-[14px] border border-[#151E30] bg-[#0B0F14] px-6 pb-6 pt-7 transition-all duration-200 hover:-translate-y-[2px] ${cardClassName ?? ""}`}
    >
      {badge ? (
        <div className="absolute -top-[9px] right-4 rounded-full bg-[#23C9B9] px-[9px] py-[3px] text-[9px] font-bold uppercase tracking-[0.1em] text-[#041010]">
          {badge}
        </div>
      ) : null}
      <div
        className={`mb-4 flex h-9 w-9 items-center justify-center rounded-[9px] ${iconBgClassName}`}
      >
        {logo}
      </div>
      <p
        className={`mb-[5px] text-[10px] font-semibold uppercase tracking-[0.12em] ${labelClassName}`}
      >
        {description}
      </p>
      <p className="mb-[6px] text-[16px] font-[650] tracking-[-0.01em] text-[#DDE3F5]">
        {title}
      </p>
      <p className="text-[12.5px] leading-[1.6] text-[#9FB3B8]">{body}</p>
      {href ? (
        <a
          href={href}
          target="_blank"
          rel="noreferrer"
          className="mt-4 inline-flex items-center gap-[5px] rounded-[6px] border border-[#18253A] px-3 py-[5px] text-[11px] font-medium uppercase tracking-[0.05em] text-[#6B7C80] transition-colors duration-200 group-hover:border-[#23C9B935] group-hover:text-[#7AF5E8]"
        >
          Visit ↗
        </a>
      ) : null}
    </div>
  );
}

function ConnectorSvg() {
  return (
    <motion.svg
      initial={{ opacity: 0, y: -4 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.55 }}
      transition={{ duration: 0.5, delay: 0.18 }}
      className="block w-full overflow-visible"
      height="48"
      viewBox="0 0 816 48"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="ecosystemLeft" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#23C9B9" stopOpacity="0.45" />
          <stop offset="100%" stopColor="#23C9B9" stopOpacity="0.12" />
        </linearGradient>
        <linearGradient id="ecosystemMid" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#23C9B9" stopOpacity="0.45" />
          <stop offset="100%" stopColor="#23C9B9" stopOpacity="0.12" />
        </linearGradient>
        <linearGradient id="ecosystemRight" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#23C9B9" stopOpacity="0.45" />
          <stop offset="100%" stopColor="#23C9B9" stopOpacity="0.12" />
        </linearGradient>
      </defs>

      <circle cx="408" cy="2" r="2.5" fill="#23C9B9" opacity="0.5" />
      <line
        x1="408"
        y1="2"
        x2="408"
        y2="24"
        stroke="url(#ecosystemMid)"
        strokeWidth="1.5"
      />
      <line
        x1="136"
        y1="24"
        x2="680"
        y2="24"
        stroke="#23C9B9"
        strokeOpacity="0.15"
        strokeWidth="1"
      />
      <circle cx="136" cy="24" r="2" fill="#23C9B9" opacity="0.3" />
      <circle cx="408" cy="24" r="2" fill="#23C9B9" opacity="0.3" />
      <circle cx="680" cy="24" r="2" fill="#23C9B9" opacity="0.3" />
      <line
        x1="136"
        y1="24"
        x2="136"
        y2="48"
        stroke="url(#ecosystemLeft)"
        strokeWidth="1.5"
      />
      <line
        x1="408"
        y1="24"
        x2="408"
        y2="48"
        stroke="url(#ecosystemMid)"
        strokeWidth="1.5"
      />
      <line
        x1="680"
        y1="24"
        x2="680"
        y2="48"
        stroke="url(#ecosystemRight)"
        strokeWidth="1.5"
      />
    </motion.svg>
  );
}

export function EcosystemMap() {
  return (
    <section
      id="company"
      className="relative overflow-hidden border-t border-white/5 py-20 md:py-24"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_15%,rgba(35,201,185,0.08),transparent_30%),radial-gradient(circle_at_20%_65%,rgba(86,228,255,0.05),transparent_24%),radial-gradient(circle_at_82%_66%,rgba(168,86,255,0.07),transparent_22%)]" />
      <div className="pointer-events-none absolute left-1/2 top-0 h-px w-[500px] -translate-x-1/2 bg-[linear-gradient(90deg,transparent,rgba(35,201,185,0.1),transparent)]" />

      <div className="relative mx-auto max-w-[880px] px-8">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.45 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="text-center"
        >
          <p className="mb-[14px] text-[11px] font-semibold uppercase tracking-[0.14em] text-[#23C9B9]">
            Ecosystem
          </p>
          <h2 className="mb-[10px] text-[34px] font-bold leading-[1.2] tracking-[-0.02em] text-[#EEF2FF]">
            Part of the Croovi suite
          </h2>
          <p className="mx-auto mb-14 max-w-[380px] text-[14px] leading-[1.65] text-[#6B7C80]">
            CroVew is one layer in a connected set of tools built for the way
            solo founders actually work.
          </p>
        </motion.div>

        <div className="mb-0 flex justify-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.45 }}
            transition={{ duration: 0.65, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
            className="w-full max-w-[300px]"
          >
            <EcosystemCard
              title="Croovi"
              description="Platform layer"
              body="The operating layer. Planning, context, product direction, and decision flow."
              iconBgClassName="bg-[#160F2A]"
              labelClassName="text-[#7C72D8]"
              cardClassName="border-[#151E30] hover:border-[#23C9B930]"
              logo={
                <img
                  src={crooviSymbol}
                  alt="Croovi symbol"
                  className="h-5 w-5 object-contain"
                />
              }
            />
          </motion.div>
        </div>

        <ConnectorSvg />

        <div className="grid grid-cols-1 gap-[14px] md:grid-cols-3 md:items-stretch">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.35 }}
            transition={{ duration: 0.6, delay: 0.16 }}
            className="h-full"
          >
            <EcosystemCard
              title="CroFlux"
              description="Project & Execution"
              body="Turns strategy into structured work. Projects, tasks, ownership, execution flow."
              href="https://croflux.vercel.app/"
              iconBgClassName="bg-[#160F2A]"
              labelClassName="text-[#A78BFA]"
              cardClassName="hover:border-[#A78BFA35]"
              logo={<StackLogo tone="flux" />}
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.35 }}
            transition={{ duration: 0.6, delay: 0.24 }}
            className="h-full"
          >
            <EcosystemCard
              title="CrooFx"
              description="AI Automation"
              body="Automates repetitive dev workflows so your team moves faster with less overhead."
              href="https://www.croovi.com/"
              iconBgClassName="bg-[#1C1405]"
              labelClassName="text-[#F59E0B]"
              cardClassName="hover:border-[#F59E0B35]"
              logo={<StackLogo tone="fx" />}
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.35 }}
            transition={{ duration: 0.6, delay: 0.32 }}
            className="h-full"
          >
            <EcosystemCard
              title="CroVew"
              description="Visibility"
              body="Real-time behavioral analytics. See who is live, what they are doing, and where they drop off."
              badge="You are here"
              iconBgClassName="bg-[#071616]"
              labelClassName="text-[#23C9B9]"
              cardClassName="border-[#23C9B922] hover:border-[#23C9B945]"
              logo={<CroovewEyeIcon />}
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
