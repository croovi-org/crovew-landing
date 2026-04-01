import { motion, useSpring } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import eyeLogo from "@/assets/crovew-logo-cropped.png";

const EYE_SIZE = 32;
const HALF_EYE = EYE_SIZE / 2;
const TRAIL_DISTANCE = 18;
const IDLE_DELAY_MS = 800;
const ORBIT_RADIUS = 22;
const ORBIT_DURATION_MS = 3000;

type Point = {
  x: number;
  y: number;
};

function clampDirection(value: number) {
  if (Math.abs(value) < 0.5) return 0;
  return value > 0 ? 1 : -1;
}

function getTrailingOffset(direction: Point) {
  const offsetX = direction.x === 0 ? 0 : -direction.x * TRAIL_DISTANCE;
  const offsetY = direction.y === 0 ? 0 : -direction.y * TRAIL_DISTANCE;

  return {
    x: offsetX,
    y: offsetY,
  };
}

export function EyeCursor() {
  const [visible, setVisible] = useState(false);
  const [isIdle, setIsIdle] = useState(false);
  const [reducedMotion] = useState(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  });

  const positionRef = useRef<Point>({ x: 0, y: 0 });
  const previousPositionRef = useRef<Point>({ x: 0, y: 0 });
  const anchorRef = useRef<Point>({ x: 0, y: 0 });
  const directionRef = useRef<Point>({ x: 1, y: 1 });
  const scrollDirectionRef = useRef(0);
  const idleRef = useRef(false);
  const idleTimeoutRef = useRef<number | null>(null);
  const orbitStartRef = useRef(0);
  const rafRef = useRef<number | null>(null);
  const lastScrollYRef = useRef(0);

  const springConfig = { stiffness: 120, damping: 18 };
  const x = useSpring(-EYE_SIZE, springConfig);
  const y = useSpring(-EYE_SIZE, springConfig);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const setIdleTimeout = () => {
      if (idleTimeoutRef.current !== null) {
        window.clearTimeout(idleTimeoutRef.current);
      }

      idleTimeoutRef.current = window.setTimeout(() => {
        idleRef.current = true;
        setIsIdle(true);
        orbitStartRef.current = performance.now();
      }, IDLE_DELAY_MS);
    };

    const handleMouseMove = (event: MouseEvent) => {
      const nextPoint = { x: event.clientX, y: event.clientY };
      const previousPoint = previousPositionRef.current;
      const deltaX = nextPoint.x - previousPoint.x;
      const deltaY = nextPoint.y - previousPoint.y;

      positionRef.current = nextPoint;
      anchorRef.current = nextPoint;

      if (!visible) {
        previousPositionRef.current = nextPoint;
        setVisible(true);
      } else {
        if (Math.abs(deltaX) > 0.5) {
          directionRef.current.x = clampDirection(deltaX);
        }
        if (Math.abs(deltaY) > 0.5) {
          directionRef.current.y = clampDirection(deltaY);
        }
        previousPositionRef.current = nextPoint;
      }

      idleRef.current = false;
      setIsIdle(false);
      setIdleTimeout();
    };

    const handleMouseLeave = () => {
      setVisible(false);
      setIsIdle(false);
    };

    const handleMouseEnter = () => {
      const current = positionRef.current;
      if (current.x !== 0 || current.y !== 0) {
        setVisible(true);
      }
    };

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const delta = currentScrollY - lastScrollYRef.current;
      if (Math.abs(delta) > 0.5) {
        scrollDirectionRef.current = clampDirection(delta);
        directionRef.current.y = scrollDirectionRef.current;
        idleRef.current = false;
        setIsIdle(false);
        setIdleTimeout();
      }
      lastScrollYRef.current = currentScrollY;
    };

    lastScrollYRef.current = window.scrollY;
    setIdleTimeout();

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseleave", handleMouseLeave);
    window.addEventListener("mouseenter", handleMouseEnter);
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseleave", handleMouseLeave);
      window.removeEventListener("mouseenter", handleMouseEnter);
      window.removeEventListener("scroll", handleScroll);

      if (idleTimeoutRef.current !== null) {
        window.clearTimeout(idleTimeoutRef.current);
      }
    };
  }, [visible]);

  useEffect(() => {
    const update = (time: number) => {
      if (!visible) {
        rafRef.current = window.requestAnimationFrame(update);
        return;
      }

      let targetX = anchorRef.current.x;
      let targetY = anchorRef.current.y;

      if (idleRef.current && !reducedMotion) {
        const elapsed = time - orbitStartRef.current;
        const angle = (elapsed / ORBIT_DURATION_MS) * Math.PI * 2;
        targetX += Math.cos(angle) * ORBIT_RADIUS;
        targetY += Math.sin(angle) * ORBIT_RADIUS;
      } else {
        const effectiveDirection = {
          x: directionRef.current.x,
          y: directionRef.current.y !== 0 ? directionRef.current.y : scrollDirectionRef.current,
        };
        const offset = getTrailingOffset(effectiveDirection);
        targetX += offset.x;
        targetY += offset.y;
      }

      x.set(targetX - HALF_EYE);
      y.set(targetY - HALF_EYE);
      rafRef.current = window.requestAnimationFrame(update);
    };

    rafRef.current = window.requestAnimationFrame(update);

    return () => {
      if (rafRef.current !== null) {
        window.cancelAnimationFrame(rafRef.current);
      }
    };
  }, [reducedMotion, visible, x, y]);

  return (
    <motion.div
      aria-hidden="true"
      className="pointer-events-none fixed left-0 top-0 z-[9999]"
      style={{
        x,
        y,
        opacity: visible ? 1 : 0,
      }}
    >
      <motion.img
        src={eyeLogo}
        alt=""
        className="h-8 w-8 select-none object-contain"
        draggable={false}
        animate={isIdle && !reducedMotion ? { rotate: 360 } : { rotate: 0 }}
        transition={
          isIdle && !reducedMotion
            ? { duration: ORBIT_DURATION_MS / 1000, ease: "linear", repeat: Infinity }
            : { duration: 0.4, ease: "easeOut" }
        }
        style={{
          filter:
            "drop-shadow(0 0 14px rgba(35,201,185,0.5)) drop-shadow(0 0 24px rgba(122,245,232,0.28))",
        }}
      />
    </motion.div>
  );
}
