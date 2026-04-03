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
      const hero = document.getElementById("hero");
      const threshold = hero
        ? Math.max(hero.offsetHeight - 80, 80)
        : 80;

      setIsFloating(window.scrollY > threshold);
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
      className={`inset-x-0 transition-all duration-300 ease-out ${
        isFloating
          ? "fixed top-4 z-50"
          : "absolute top-0 z-40 py-6"
      }`}
    >
      <div
        className={`mx-auto flex w-full items-center justify-between px-6 lg:px-12 ${shellClassName} will-change-transform transition-all duration-300 ease-out ${
          isFloating
            ? "scale-[0.985] rounded-2xl border border-[#1BA99C]/20 bg-[#071010]/60 py-3.5 shadow-[0_10px_40px_rgba(0,0,0,0.35)] backdrop-blur-md"
            : "border border-transparent bg-transparent py-0 shadow-none"
        }`}
      >
        <div className="flex items-center gap-2">
          <div style={{ filter: "drop-shadow(0 0 8px rgba(35,201,185,0.5))" }}>
            <img
              src={logoSrc}
              alt="CroVew"
              style={{ width: 68, height: "auto" }}
            />
          </div>
          <span className="text-xl font-bold tracking-tight text-white">
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

        <div className="flex items-center gap-4">
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
            className="group relative overflow-hidden rounded-full bg-[#1BA99C] px-5 py-2 text-sm font-semibold text-black transition-all hover:scale-105 hover:bg-[#23C9B9]"
          >
            <span className="relative z-10">Get Early Access</span>
            <div className="absolute inset-0 z-0 translate-x-[-100%] bg-gradient-to-r from-transparent via-white/30 to-transparent group-hover:animate-[shimmer_1.5s_infinite]" />
          </a>
        </div>
      </div>
    </nav>
  );
}
