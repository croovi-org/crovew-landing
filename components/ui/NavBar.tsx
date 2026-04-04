"use client";

import React, { useEffect, useState } from "react";

type NavItem = {
  href: string;
  label: string;
};

type NavBarProps = {
  items: NavItem[];
  logoSrc: string;
  shellClassName: string;
  onSectionClick: (
    id: string,
    event: React.MouseEvent<HTMLAnchorElement>,
  ) => void;
};

export function NavBar({
  items,
  logoSrc,
  shellClassName,
  onSectionClick,
}: NavBarProps) {
  const [isFloating, setIsFloating] = useState(false);

  useEffect(() => {
    const updateFloatingState = () => {
      setIsFloating(window.scrollY > 8);
    };

    updateFloatingState();
    window.addEventListener("scroll", updateFloatingState, { passive: true });
    window.addEventListener("resize", updateFloatingState);

    return () => {
      window.removeEventListener("scroll", updateFloatingState);
      window.removeEventListener("resize", updateFloatingState);
    };
  }, []);

  return (
    <nav
      className={`inset-x-0 transition-all duration-300 ease-out max-[550px]:px-2 ${
        isFloating
          ? "fixed top-4 z-50 max-[550px]:top-2"
          : "absolute top-0 z-40 py-6 max-[550px]:py-4"
      }`}
    >
      <div
        className={`mx-auto flex w-full items-center justify-between px-6 lg:px-12 max-[550px]:px-3 ${shellClassName} will-change-transform transition-all duration-300 ease-out ${
          isFloating
            ? "scale-[0.985] rounded-2xl border border-[#1BA99C]/20 bg-[#071010]/60 py-3.5 shadow-[0_10px_40px_rgba(0,0,0,0.35)] backdrop-blur-md max-[550px]:rounded-xl max-[550px]:py-2.5"
            : "border border-transparent bg-transparent py-0 shadow-none"
        }`}
      >
        <div className="flex items-center gap-2 max-[550px]:gap-1.5">
          <div style={{ filter: "drop-shadow(0 0 8px rgba(35,201,185,0.5))" }}>
            <img
              src={logoSrc}
              alt="CroVew"
              className="w-[68px] max-[550px]:w-[50px]"
            />
          </div>
          <span className="text-xl font-bold tracking-tight text-white max-[550px]:text-base">
            CroVew
          </span>
        </div>

        <div className="hidden items-center gap-8 md:flex">
          {items.map((item) => (
            <a
              key={item.label}
              href={item.href}
              onClick={(event) =>
                onSectionClick(item.href.replace("#", ""), event)
              }
              className="text-sm font-medium text-[#9FB3B8] transition-colors hover:text-white"
            >
              {item.label}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-4 max-[550px]:gap-2">
          <a
            href="#preview"
            onClick={(event) => onSectionClick("preview", event)}
            className="hidden text-sm font-medium text-[#E6F7F6] transition-colors hover:text-[#7AF5E8] md:block"
          >
            Live Preview
          </a>
          <a
            href="#waitlist"
            onClick={(event) => onSectionClick("waitlist", event)}
            className="group relative overflow-hidden rounded-full bg-[#1BA99C] px-5 py-2 text-sm font-semibold text-black transition-all hover:scale-105 hover:bg-[#23C9B9] max-[550px]:px-3 max-[550px]:py-1.5 max-[550px]:text-xs"
          >
            <span className="relative z-10">Get Early Access</span>
            <div className="absolute inset-0 z-0 translate-x-[-100%] bg-gradient-to-r from-transparent via-white/30 to-transparent group-hover:animate-[shimmer_1.5s_infinite]" />
          </a>
        </div>
      </div>
    </nav>
  );
}
